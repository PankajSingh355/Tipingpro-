import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { DEFAULT_BLOG_ARTICLES } from './src/data/blogArticles.ts';
import { resolveRoute, SEO_ROUTES } from './src/data/seoRoutes.ts';
import { validateKeystrokeTelemetry } from './src/utils/typingEngine.ts';

const PORT = Number(process.env.PORT || 3000);
const IS_PROD = process.env.NODE_ENV === 'production';
const HMAC_SECRET = process.env.LEADERBOARD_HMAC_SECRET || 'typingpro-verified-session-key-v1';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getBaseUrl(req: express.Request): string {
  if (process.env.APP_URL && process.env.APP_URL !== 'MY_APP_URL') {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.get('host') || `localhost:${PORT}`;
  return `${proto}://${host}`.replace(/\/+$/, '');
}

function injectRouteSeoIntoHtml(html: string, reqPath: string, baseUrl: string): string {
  const { route, blogSlug } = resolveRoute(reqPath);
  const article = blogSlug
    ? DEFAULT_BLOG_ARTICLES.find((a) => a.slug === blogSlug)
    : undefined;

  const pageTitle = article ? `${article.title} | TypingPro` : route.title;
  const pageDescription = article ? article.excerpt : route.description;
  const canonicalPath = article ? `/blog/${article.slug}/` : route.path;
  const canonicalUrl = `${baseUrl}${canonicalPath}`;
  const isPrivateRoute = route.path === '/dashboard/' || route.path === '/profile/';

  let structuredData: Record<string, unknown> | null = null;
  if (article) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      author: { '@type': 'Organization', name: article.authorName },
      datePublished: article.publishedDate,
      mainEntityOfPage: canonicalUrl,
    };
  } else if (route.schemaType === 'WebApplication') {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'TypingPro',
      url: canonicalUrl,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      description: pageDescription,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    };
  } else if (route.schemaType === 'FAQPage' && route.faqs.length > 0) {
    structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: route.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    };
  }

  const extraHeadTags = [
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    isPrivateRoute ? `<meta name="robots" content="noindex,nofollow" />` : `<meta name="robots" content="index,follow" />`,
    structuredData
      ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`
      : '',
  ]
    .filter(Boolean)
    .join('\n    ');

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(pageTitle)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="description" content="${escapeHtml(pageDescription)}" />`,
    )
    .replace(
      /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`,
    )
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta property="og:description" content="${escapeHtml(pageDescription)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`,
    )
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
      `<meta name="twitter:description" content="${escapeHtml(pageDescription)}" />`,
    );

  out = out.replace('</head>', `    ${extraHeadTags}\n  </head>`);
  return out;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'TypingPro' });
  });

  app.post('/api/typing/verify-score', (req, res) => {
    const body = req.body ?? {};
    const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
    const language = body.language === 'hi' ? 'hi' : 'en';
    const durationSec = Number(body.durationSec);
    const elapsedSec = Number(body.elapsedSec);
    const grossWpm = Number(body.grossWpm);
    const netWpm = Number(body.netWpm);
    const accuracy = Number(body.accuracy);
    const correctChars = Number(body.correctChars);
    const incorrectChars = Number(body.incorrectChars);
    const totalTypedChars = Number(body.totalTypedChars);
    const pasteAttempted = Boolean(body.pasteAttempted);
    const keystrokeTimestamps = Array.isArray(body.keystrokeTimestamps)
      ? body.keystrokeTimestamps.map(Number).filter((n: number) => Number.isFinite(n))
      : [];

    if (!userId || !/^[a-zA-Z0-9_-]{1,128}$/.test(userId)) {
      res.status(400).json({ verified: false, reason: 'Valid authenticated userId is required.' });
      return;
    }

    const validation = validateKeystrokeTelemetry({
      durationSec,
      elapsedSec,
      grossWpm,
      netWpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalTypedChars,
      keystrokeTimestamps,
      pasteAttempted,
    });

    if (!validation.valid) {
      res.status(400).json({ verified: false, reason: validation.reason });
      return;
    }

    const digestPayload = `${userId}:${language}:${durationSec}:${Math.round(netWpm)}:${Number(accuracy.toFixed(1))}`;
    const verificationDigest = crypto
      .createHmac('sha256', HMAC_SECRET)
      .update(digestPayload)
      .digest('hex');

    res.json({ verified: true, verificationDigest });
  });

  app.post('/api/contact', (req, res) => {
    const { name, email, topic, message } = req.body ?? {};
    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      typeof message !== 'string' ||
      message.trim().length < 10
    ) {
      res.status(400).json({ ok: false, error: 'Please provide a valid name, email, and message (at least 10 characters).' });
      return;
    }
    res.json({ ok: true, topic: typeof topic === 'string' ? topic : 'general' });
  });

  app.get('/robots.txt', (req, res) => {
    const baseUrl = getBaseUrl(req);
    const content = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /api/',
      'Disallow: /dashboard/',
      '',
      `Sitemap: ${baseUrl}/sitemap.xml`,
    ].join('\n');
    res.type('text/plain').send(content);
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = getBaseUrl(req);
    const today = new Date().toISOString().slice(0, 10);
    const publicRoutes = SEO_ROUTES.filter((r) => r.path !== '/dashboard/');
    const blogUrls = DEFAULT_BLOG_ARTICLES.map((a) => ({
      loc: `${baseUrl}/blog/${a.slug}/`,
      priority: '0.7',
      changefreq: 'monthly',
    }));

    const routeUrls = publicRoutes.map((r) => ({
      loc: `${baseUrl}${r.path}`,
      priority: r.path === '/' ? '1.0' : r.path.includes('policy') || r.path === '/disclaimer/' ? '0.4' : '0.8',
      changefreq: r.path === '/' || r.path === '/blog/' ? 'weekly' : 'monthly',
    }));

    const allUrls = [...routeUrls, ...blogUrls];
    const xml = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...allUrls.map(
        (u) =>
          `  <url>\n    <loc>${escapeHtml(u.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
      ),
      '</urlset>',
    ].join('\n');

    res.type('application/xml').send(xml);
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const finalHtml = injectRouteSeoIntoHtml(template, req.originalUrl, getBaseUrl(req));
        res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir, { index: false }));
    app.use('*', (req, res) => {
      const indexHtmlPath = path.join(distDir, 'index.html');
      const rawHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
      const finalHtml = injectRouteSeoIntoHtml(rawHtml, req.originalUrl, getBaseUrl(req));
      res.status(200).set({ 'Content-Type': 'text/html' }).end(finalHtml);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TypingPro server listening on http://0.0.0.0:${PORT}`);
  });
}

void startServer();
