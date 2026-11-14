import React, { Component, useCallback, useEffect, useState } from 'react';
import { AuthModal } from './components/AuthModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Header } from './components/Header.tsx';
import { HomePageView } from './components/HomePageView.tsx';
import { SeoLandingPageView } from './components/SeoLandingPageView.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { DEFAULT_BLOG_ARTICLES } from './data/blogArticles.ts';
import { normalizePathname, resolveRoute } from './data/seoRoutes.ts';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-12 max-w-xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/60 dark:bg-red-950/50">
          <h2 className="font-display text-xl font-bold text-red-900 dark:text-red-200">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">{this.state.message}</p>
          <button
            type="button"
            onClick={() => window.location.assign('/')}
            className="mt-4 rounded-xl bg-red-700 px-4 py-2 text-xs font-semibold text-white hover:bg-red-800"
          >
            Return to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function updateMetaTag(selector: string, attrName: 'name' | 'property', attrVal: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function updateCanonicalTag(url: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function TypingProShell() {
  const [pathname, setPathname] = useState<string>(() =>
    typeof window !== 'undefined' ? normalizePathname(window.location.pathname) : '/',
  );

  useEffect(() => {
    const onPopState = () => {
      setPathname(normalizePathname(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((targetPath: string) => {
    const norm = normalizePathname(targetPath);
    if (window.location.pathname !== norm) {
      window.history.pushState({}, '', norm);
    }
    setPathname(norm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { route, blogSlug } = resolveRoute(pathname);
  const matchedArticle = blogSlug
    ? DEFAULT_BLOG_ARTICLES.find((a) => a.slug === blogSlug)
    : undefined;

  useEffect(() => {
    const title = matchedArticle ? `${matchedArticle.title} | TypingPro` : route.title;
    const description = matchedArticle ? matchedArticle.excerpt : route.description;
    const canonicalPath = matchedArticle ? `/blog/${matchedArticle.slug}/` : route.path;
    const canonicalUrl = `${window.location.origin}${canonicalPath}`;

    document.title = title;
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateCanonicalTag(canonicalUrl);
  }, [route, matchedArticle]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header currentPath={pathname} onNavigate={navigate} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <AppErrorBoundary>
          {route.widget === 'home' ? (
            <HomePageView onNavigate={navigate} />
          ) : (
            <SeoLandingPageView route={route} blogSlug={blogSlug} onNavigate={navigate} />
          )}
        </AppErrorBoundary>
      </main>

      <Footer onNavigate={navigate} />
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TypingProShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
