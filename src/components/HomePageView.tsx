import { ArrowRight, BookOpen, CheckCircle2, Gamepad2, GraduationCap, Keyboard, Shield } from 'lucide-react';
import { useState } from 'react';
import heroDeskImg from '../assets/images/hero_typing_desk_1794639606139.jpg';
import postureGuideImg from '../assets/images/guide_ergonomic_posture_1794639606841.jpg';
import { DEFAULT_BLOG_ARTICLES } from '../data/blogArticles.ts';
import { SEO_ROUTES } from '../data/seoRoutes.ts';
import type { TypingLanguage } from '../types/typing.ts';
import { AdPlaceholder } from './AdPlaceholder.tsx';
import { ResilientImage } from './ResilientImage.tsx';
import { TypingTestEngine } from './TypingTestEngine.tsx';

interface HomePageViewProps {
  onNavigate: (path: string) => void;
}

const POPULAR_TEST_LINKS = [
  { label: '1-Minute Speed Test', href: '/typing-speed-test-1-minute/', meta: '60s Quick Check' },
  { label: '2-Minute Speed Test', href: '/typing-speed-test-2-minute/', meta: '120s Pacing' },
  { label: '3-Minute Speed Test', href: '/typing-speed-test-3-minute/', meta: '180s Benchmark' },
  { label: '5-Minute Speed Test', href: '/typing-speed-test-5-minute/', meta: '300s Endurance' },
  { label: '10-Minute Speed Test', href: '/typing-speed-test-10-minute/', meta: '600s Stamina' },
  { label: 'English Typing Test', href: '/english-typing-test/', meta: 'Beginner to Advanced' },
  { label: 'Hindi Typing Test', href: '/hindi-typing-test/', meta: 'Unicode Devanagari' },
  { label: 'Custom Text Practice', href: '/typing-practice/', meta: 'Paste Any Paragraph' },
];

export function HomePageView({ onNavigate }: HomePageViewProps) {
  const [previewLanguage, setPreviewLanguage] = useState<TypingLanguage>('en');
  const homeFaqs = SEO_ROUTES.find((r) => r.path === '/')?.faqs ?? [];

  const handleLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-center lg:col-span-7">
          <h1
            style={{ textWrap: 'balance' }}
            className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
          >
            Improve Your Typing Speed and Accuracy with TypingPro
          </h1>
          <p className="mt-3.5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
            Practice English and Unicode Hindi Devanagari typing with transparent WPM scoring, guided home-row lessons, playable typing games, and optional cloud progress tracking.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/typing-test/')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              Start Free Typing Test
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setPreviewLanguage('en')}
              className={`inline-flex min-h-[44px] items-center rounded-xl border px-4 text-sm font-semibold transition-colors ${
                previewLanguage === 'en'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/50 dark:text-blue-300'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              English Typing
            </button>

            <button
              type="button"
              onClick={() => setPreviewLanguage('hi')}
              className={`inline-flex min-h-[44px] items-center rounded-xl border px-4 text-sm font-semibold transition-colors ${
                previewLanguage === 'hi'
                  ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500 dark:bg-blue-950/50 dark:text-blue-300'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
              }`}
            >
              Hindi Typing (हिंदी)
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="h-full max-h-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <ResilientImage
              src={heroDeskImg}
              alt="Clean modern wooden and slate desk with compact mechanical keyboard for focused typing practice"
              eager
              className="h-56 w-full object-cover lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* Live Working Typing Test Preview */}
      <section aria-labelledby="live-preview-heading" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="live-preview-heading" className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Try a Live Typing Test Right Now
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Start typing below to trigger the countdown timer—switch between English and Hindi Unicode anytime.
            </p>
          </div>
          <a
            href={previewLanguage === 'hi' ? '/hindi-typing-test/' : '/typing-test/'}
            onClick={(e) => handleLink(e, previewLanguage === 'hi' ? '/hindi-typing-test/' : '/typing-test/')}
            className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            Open Dedicated {previewLanguage === 'hi' ? 'Hindi' : 'Full'} Test Page
          </a>
        </div>

        <TypingTestEngine
          mode="test"
          routeSlug={previewLanguage === 'hi' ? '/?lang=hi' : '/'}
          initialLanguage={previewLanguage}
          initialDurationSec={60}
          initialDifficulty="intermediate"
          onNavigate={onNavigate}
        />
      </section>

      {/* How Speed, Accuracy & Practice Work */}
      <section className="space-y-6">
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
            Built for Accurate Speed, Not Guesswork
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Consistent measurement helps you understand whether mistakes or hesitation are holding back your net speed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <Keyboard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h3 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">
              Transparent Net WPM
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              We calculate Gross WPM from total typed units divided by five per minute, then subtract errors for Net WPM so clean accuracy is always rewarded.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h3 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">
              Unicode Devanagari Precision
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Hindi tests segment matras, anusvara, and halant conjunct clusters properly using Unicode grapheme boundaries instead of breaking characters apart.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <Gamepad2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h3 className="mt-3 font-display text-lg font-bold text-slate-900 dark:text-white">
              Lessons, Practice &amp; Games
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Combine structured home-row drills, custom text practice, and four playable typing games to build finger fluency without boredom.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Typing Tests & Practice Links */}
      <section className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Popular Typing Tests &amp; Practice Modes
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Jump directly to a specific timer length, language, or practice tool.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_TEST_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleLink(e, item.href)}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
            >
              <div className="text-xs text-slate-500 dark:text-slate-400">{item.meta}</div>
              <div className="mt-1 flex items-center justify-between font-display text-base font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                <span>{item.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Beginner Learning Section */}
      <section className="grid grid-cols-1 items-stretch gap-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 lg:grid-cols-12 dark:border-slate-800 dark:bg-slate-900">
        <div className="lg:col-span-5">
          <div className="h-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
            <ResilientImage
              src={postureGuideImg}
              alt="Overhead view of hands resting on the QWERTY home row keys for proper touch typing posture"
              className="h-56 w-full object-cover lg:h-full"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center lg:col-span-7">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            New to Touch Typing? Start with Guided Lessons
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            Learning to anchor your fingers on A, S, D, F and J, K, L, ; saves years of hunting for keys. Our beginner curriculum guides you row by row in English and through Hindi Unicode vowels, consonants, and matras.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Interactive QWERTY finger placement map</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Beginner story passages for kids and first-time learners</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Daily 15-minute accuracy &amp; rhythm routines</span>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/typing-lessons/"
              onClick={(e) => handleLink(e, '/typing-lessons/')}
              className="inline-flex min-h-[42px] items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Explore Typing Lessons
            </a>
            <a
              href="/typing-test-for-beginners/"
              onClick={(e) => handleLink(e, '/typing-test-for-beginners/')}
              className="inline-flex min-h-[42px] items-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              Beginner Typing Test
            </a>
          </div>
        </div>
      </section>

      {/* Exam Practice Section (Non-Affiliated Transparency) */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <GraduationCap className="h-4 w-4" />
              <span>Independent Self-Study Preparation</span>
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 dark:text-white">
              SSC, CPCT &amp; Student Typing Practice
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Train 10-minute stamina with formal administrative paragraphs, numeric strings, and Unicode Hindi passages. TypingPro is an independent practice resource and is not officially affiliated with SSC, CPCT, or any examination authority.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="/typing-test-for-ssc/"
              onClick={(e) => handleLink(e, '/typing-test-for-ssc/')}
              className="inline-flex min-h-[42px] items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              SSC Practice
            </a>
            <a
              href="/cpct-typing-practice/"
              onClick={(e) => handleLink(e, '/cpct-typing-practice/')}
              className="inline-flex min-h-[42px] items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              CPCT Practice
            </a>
            <a
              href="/typing-test-for-students/"
              onClick={(e) => handleLink(e, '/typing-test-for-students/')}
              className="inline-flex min-h-[42px] items-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              For Students
            </a>
          </div>
        </div>
      </section>

      {/* Latest Typing Articles */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Latest Typing Guides &amp; Tips
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Practical articles on speed, ergonomics, and Hindi Unicode ordering.
            </p>
          </div>
          <a
            href="/blog/"
            onClick={(e) => handleLink(e, '/blog/')}
            className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400"
          >
            View All Articles
          </a>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {DEFAULT_BLOG_ARTICLES.slice(0, 3).map((art) => (
            <article
              key={art.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {art.category} · {art.readMinutes} min read
              </div>
              <h3 className="mt-2 font-display text-base font-bold text-slate-900 dark:text-white">
                <a
                  href={`/blog/${art.slug}/`}
                  onClick={(e) => handleLink(e, `/blog/${art.slug}/`)}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {art.title}
                </a>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {art.excerpt}
              </p>
              <a
                href={`/blog/${art.slug}/`}
                onClick={(e) => handleLink(e, `/blog/${art.slug}/`)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Read Guide
              </a>
            </article>
          ))}
        </div>
      </section>

      <AdPlaceholder slotName="homepage-footer-banner" />

      {/* FAQs */}
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {homeFaqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
