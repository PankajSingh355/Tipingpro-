import { Download, Printer } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { fetchUserSessions } from '../lib/firestoreService.ts';
import type { TypingSessionRecord } from '../types/typing.ts';
import type { StoredPracticeReportData } from './TypingTestEngine.tsx';

interface PracticeReportViewProps {
  onNavigate: (path: string) => void;
}

export function PracticeReportView({ onNavigate }: PracticeReportViewProps) {
  const { user, profile } = useAuth();
  const [recipientName, setRecipientName] = useState(
    profile?.displayName || user?.displayName || 'Learner',
  );
  const [latestReport, setLatestReport] = useState<StoredPracticeReportData | null>(null);
  const [savedSessions, setSavedSessions] = useState<TypingSessionRecord[]>([]);

  useEffect(() => {
    if (profile?.displayName) {
      setRecipientName(profile.displayName);
    }
  }, [profile?.displayName]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('typingpro_latest_result');
      if (raw) {
        setLatestReport(JSON.parse(raw) as StoredPracticeReportData);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    void fetchUserSessions(user.uid)
      .then((rows) => {
        setSavedSessions(rows);
        if (!latestReport && rows.length > 0) {
          const r = rows[0];
          setLatestReport({
            netWpm: r.netWpm,
            grossWpm: r.grossWpm,
            accuracy: r.accuracy,
            correctChars: r.correctChars,
            incorrectChars: r.incorrectChars,
            totalTypedChars: r.totalTypedChars,
            elapsedSec: r.elapsedSec,
            durationSec: r.durationSec,
            language: r.language,
            difficulty: r.difficulty,
            passageTitle: r.passageTitle,
            completedAtIso: r.createdAtMs ? new Date(r.createdAtMs).toISOString() : new Date().toISOString(),
          });
        }
      })
      .catch(() => {});
  }, [user, latestReport]);

  const handleDownloadSvg = () => {
    if (!latestReport) return;
    const safeName = recipientName.replace(/[<>&"']/g, '').trim() || 'TypingPro Learner';
    const dateStr = new Date(latestReport.completedAtIso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="560" viewBox="0 0 900 560">
  <rect width="900" height="560" fill="#f8fafc" />
  <rect x="28" y="28" width="844" height="504" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
  <text x="70" y="90" font-family="sans-serif" font-size="20" font-weight="700" fill="#2563eb">TypingPro</text>
  <text x="70" y="135" font-family="sans-serif" font-size="32" font-weight="700" fill="#0f172a">Personal Typing Practice Report</text>
  <text x="70" y="168" font-family="sans-serif" font-size="14" fill="#64748b">Self-assessment summary — Not an official or accredited examination certificate</text>
  <line x1="70" y1="196" x2="830" y2="196" stroke="#e2e8f0" stroke-width="1.5" />
  <text x="70" y="240" font-family="sans-serif" font-size="14" fill="#64748b">Prepared For</text>
  <text x="70" y="274" font-family="sans-serif" font-size="28" font-weight="700" fill="#0f172a">${safeName}</text>
  <rect x="70" y="310" width="230" height="110" rx="12" fill="#f1f5f9" />
  <text x="90" y="344" font-family="sans-serif" font-size="13" fill="#64748b">Net Typing Speed</text>
  <text x="90" y="392" font-family="monospace" font-size="38" font-weight="700" fill="#2563eb">${latestReport.netWpm} WPM</text>
  <rect x="335" y="310" width="230" height="110" rx="12" fill="#f1f5f9" />
  <text x="355" y="344" font-family="sans-serif" font-size="13" fill="#64748b">Accuracy</text>
  <text x="355" y="392" font-family="monospace" font-size="38" font-weight="700" fill="#059669">${latestReport.accuracy}%</text>
  <rect x="600" y="310" width="230" height="110" rx="12" fill="#f1f5f9" />
  <text x="620" y="344" font-family="sans-serif" font-size="13" fill="#64748b">Gross Speed &amp; Time</text>
  <text x="620" y="392" font-family="monospace" font-size="28" font-weight="700" fill="#0f172a">${latestReport.grossWpm} WPM · ${latestReport.elapsedSec}s</text>
  <text x="70" y="470" font-family="sans-serif" font-size="14" fill="#475569">Language: ${latestReport.language === 'hi' ? 'Hindi (Unicode Devanagari)' : 'English'} | Characters: ${latestReport.correctChars}/${latestReport.totalTypedChars} | Date: ${dateStr}</text>
  <text x="70" y="498" font-family="sans-serif" font-size="12" fill="#64748b">Generated from genuine user session data on TypingPro. Formula: (Typed / 5) / Minutes.</text>
</svg>`;

    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typingpro-practice-report-${latestReport.netWpm}wpm.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!latestReport) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
          Complete a Typing Test First
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-600 dark:text-slate-400">
          TypingPro only generates Personal Practice Reports from real completed test results—never fabricated scores. Complete a quick 1-minute test to generate your printable report.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/typing-test/')}
          className="mt-5 inline-flex min-h-[44px] items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Take a Typing Test Now
        </button>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 print:hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="report-name"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Name Shown on Personal Practice Report
            </label>
            <input
              id="report-name"
              type="text"
              maxLength={60}
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {savedSessions.length > 0 && (
            <div>
              <label
                htmlFor="report-session-select"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Or Select a Saved Session
              </label>
              <select
                id="report-session-select"
                onChange={(e) => {
                  const found = savedSessions.find((s) => s.id === e.target.value);
                  if (found) {
                    setLatestReport({
                      netWpm: found.netWpm,
                      grossWpm: found.grossWpm,
                      accuracy: found.accuracy,
                      correctChars: found.correctChars,
                      incorrectChars: found.incorrectChars,
                      totalTypedChars: found.totalTypedChars,
                      elapsedSec: found.elapsedSec,
                      durationSec: found.durationSec,
                      language: found.language,
                      difficulty: found.difficulty,
                      passageTitle: found.passageTitle,
                      completedAtIso: found.createdAtMs
                        ? new Date(found.createdAtMs).toISOString()
                        : new Date().toISOString(),
                    });
                  }
                }}
                className="mt-1.5 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {savedSessions.slice(0, 15).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.netWpm} WPM ({s.accuracy}%) — {s.language.toUpperCase()} — {s.passageTitle}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Download className="h-4 w-4" />
            Download Report (SVG)
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            <Printer className="h-4 w-4" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Printable Personal Practice Report Card */}
      <article className="rounded-2xl border-2 border-slate-300 bg-white p-6 sm:p-10 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400">TypingPro</div>
            <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
              Personal Typing Practice Report
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Self-assessment performance summary — Not an official, government, or accredited examination certificate.
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 dark:text-slate-400">
            <div>Completed</div>
            <div className="font-semibold text-slate-900 dark:text-slate-100">
              {new Date(latestReport.completedAtIso).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs text-slate-500 dark:text-slate-400">Prepared For</div>
          <div className="mt-1 font-display text-3xl font-bold text-slate-900 dark:text-white">
            {recipientName.trim() || 'TypingPro Learner'}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs text-slate-500 dark:text-slate-400">Net Typing Speed</div>
            <div className="mt-1 font-mono text-3xl font-bold text-blue-600 tabular-nums dark:text-blue-400">
              {latestReport.netWpm} WPM
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs text-slate-500 dark:text-slate-400">Accuracy</div>
            <div className="mt-1 font-mono text-3xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
              {latestReport.accuracy}%
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-xs text-slate-500 dark:text-slate-400">Gross Speed &amp; Duration</div>
            <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
              {latestReport.grossWpm} WPM · {latestReport.elapsedSec}s
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-200 pt-5 text-xs text-slate-600 sm:grid-cols-4 dark:border-slate-800 dark:text-slate-400">
          <div>
            <span className="block text-slate-400">Language</span>
            <strong className="font-semibold text-slate-900 dark:text-slate-200">
              {latestReport.language === 'hi' ? 'Hindi (Devanagari)' : 'English'}
            </strong>
          </div>
          <div>
            <span className="block text-slate-400">Passage</span>
            <strong className="font-semibold text-slate-900 dark:text-slate-200">
              {latestReport.passageTitle}
            </strong>
          </div>
          <div>
            <span className="block text-slate-400">Correct / Total</span>
            <strong className="font-mono font-semibold text-slate-900 dark:text-slate-200">
              {latestReport.correctChars} / {latestReport.totalTypedChars}
            </strong>
          </div>
          <div>
            <span className="block text-slate-400">Difficulty</span>
            <strong className="font-semibold capitalize text-slate-900 dark:text-slate-200">
              {latestReport.difficulty}
            </strong>
          </div>
        </div>
      </article>
    </div>
  );
}
