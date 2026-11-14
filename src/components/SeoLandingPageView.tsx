import { ArrowRight, ChevronRight } from 'lucide-react';
import type { SeoRouteDefinition } from '../types/typing.ts';
import { AdPlaceholder } from './AdPlaceholder.tsx';
import { BlogView } from './BlogView.tsx';
import { ContactView } from './ContactView.tsx';
import { DashboardView } from './DashboardView.tsx';
import { LeaderboardView } from './LeaderboardView.tsx';
import { PracticeReportView } from './PracticeReportView.tsx';
import { TypingGamesView } from './TypingGamesView.tsx';
import { TypingLessonsView } from './TypingLessonsView.tsx';
import { TypingTestEngine } from './TypingTestEngine.tsx';

interface SeoLandingPageViewProps {
  route: SeoRouteDefinition;
  blogSlug?: string;
  onNavigate: (path: string) => void;
}

export function SeoLandingPageView({ route, blogSlug, onNavigate }: SeoLandingPageViewProps) {
  const handleLink = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate(href);
  };

  return (
    <div className="space-y-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <a
          href="/"
          onClick={(e) => handleLink(e, '/')}
          className="hover:text-slate-900 dark:hover:text-white"
        >
          Home
        </a>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="font-medium text-slate-900 dark:text-slate-100">{route.breadcrumbLabel}</span>
      </nav>

      {/* Unique H1 & Page Intro */}
      <header className="max-w-3xl">
        <h1
          style={{ textWrap: 'balance' }}
          className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white"
        >
          {route.h1}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
          {route.subtitle}
        </p>
      </header>

      {/* Working Route-Specific Tool */}
      <div>
        {route.widget === 'typing-test' && (
          <TypingTestEngine
            mode="test"
            routeSlug={route.path}
            initialLanguage={route.defaultLanguage ?? 'en'}
            initialDurationSec={route.defaultDurationSec ?? 60}
            initialDifficulty={route.defaultDifficulty ?? 'intermediate'}
            passageCategory={route.defaultPassageCategory ?? 'general'}
            lockDuration={route.lockDuration}
            onNavigate={onNavigate}
          />
        )}

        {route.widget === 'typing-practice' && (
          <TypingTestEngine
            mode="practice"
            routeSlug={route.path}
            initialLanguage={route.defaultLanguage ?? 'en'}
            initialDurationSec={route.defaultDurationSec ?? 180}
            initialDifficulty={route.defaultDifficulty ?? 'beginner'}
            passageCategory={route.defaultPassageCategory ?? 'general'}
            onNavigate={onNavigate}
          />
        )}

        {route.widget === 'typing-tips' && (
          <TypingTestEngine
            mode="practice"
            routeSlug={route.path}
            initialLanguage={route.defaultLanguage ?? 'en'}
            initialDurationSec={60}
            initialDifficulty="intermediate"
            onNavigate={onNavigate}
          />
        )}

        {route.widget === 'typing-lessons' && <TypingLessonsView />}
        {route.widget === 'typing-games' && <TypingGamesView />}
        {route.widget === 'typing-certificate' && <PracticeReportView onNavigate={onNavigate} />}
        {route.widget === 'blog' && <BlogView activeSlug={blogSlug} onNavigate={onNavigate} />}
        {route.widget === 'dashboard' && <DashboardView onNavigate={onNavigate} />}
        {route.widget === 'leaderboard' && <LeaderboardView onNavigate={onNavigate} />}
        {route.widget === 'contact' && <ContactView />}
      </div>

      {/* Unique Route Educational Sections */}
      {route.sections.length > 0 && (
        <section className="space-y-6">
          {route.sections.map((sec, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                {sec.heading}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {sec.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
              {sec.bullets && sec.bullets.length > 0 && (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700 dark:text-slate-300">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Worked Examples */}
      {route.examples && route.examples.length > 0 && (
        <section className="space-y-4">
          {route.examples.map((ex, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
            >
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-white">
                {ex.title}
              </h2>
              <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3.5 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {ex.sample}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{ex.note}</p>
            </div>
          ))}
        </section>
      )}

      {/* Disabled AdSense placeholder strictly outside interactive input/game areas */}
      {route.widget !== 'dashboard' &&
        route.widget !== 'typing-games' &&
        !route.path.includes('policy') &&
        route.path !== '/disclaimer/' && <AdPlaceholder slotName={`route-${route.breadcrumbLabel.toLowerCase().replace(/\s+/g, '-')}`} />}

      {/* Route FAQs */}
      {route.faqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {route.faqs.map((faq, idx) => (
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
      )}

      {/* Internal Related Links */}
      {route.relatedLinks.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Related Typing Tools &amp; Pages
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {route.relatedLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLink(e, item.href)}
                className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
              >
                <div className="flex items-center justify-between font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  <span>{item.label}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 opacity-60" />
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
