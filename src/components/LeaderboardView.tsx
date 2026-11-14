import { ShieldCheck, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchLeaderboard } from '../lib/firestoreService.ts';
import type { LeaderboardEntry, TestDurationSec, TypingLanguage } from '../types/typing.ts';

interface LeaderboardViewProps {
  onNavigate: (path: string) => void;
}

export function LeaderboardView({ onNavigate }: LeaderboardViewProps) {
  const [languageFilter, setLanguageFilter] = useState<'all' | TypingLanguage>('all');
  const [durationFilter, setDurationFilter] = useState<0 | TestDurationSec>(0);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);
    void fetchLeaderboard(
      languageFilter === 'all' ? undefined : languageFilter,
      durationFilter === 0 ? undefined : durationFilter,
    )
      .then((rows) => setEntries(rows))
      .catch((err) => setErrorMsg(err instanceof Error ? err.message : 'Unable to load leaderboard.'))
      .finally(() => setLoading(false));
  }, [languageFilter, durationFilter]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950">
              {(['all', 'en', 'hi'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguageFilter(lang)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    languageFilter === lang
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lang === 'all' ? 'All Languages' : lang === 'en' ? 'English' : 'Hindi'}
                </button>
              ))}
            </div>

            <select
              aria-label="Filter leaderboard by test duration"
              value={durationFilter}
              onChange={(e) => setDurationFilter(Number(e.target.value) as 0 | TestDurationSec)}
              className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value={0}>All Durations</option>
              <option value={60}>1 Minute</option>
              <option value={120}>2 Minutes</option>
              <option value={180}>3 Minutes</option>
              <option value={300}>5 Minutes</option>
              <option value={600}>10 Minutes</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Ranked by Net WPM, then Accuracy % (≥ 80% accuracy, zero-paste verified)</span>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 space-y-2">
            <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-10 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ) : errorMsg ? (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
            {errorMsg}
          </div>
        ) : entries.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-950">
            <Trophy className="mx-auto h-8 w-8 text-slate-400" />
            <h3 className="mt-2 font-display text-base font-bold text-slate-900 dark:text-white">
              No Verified Entries in This Category Yet
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-slate-600 dark:text-slate-400">
              TypingPro only displays genuine, telemetry-verified results submitted by signed-in users. Complete a timed test and click &ldquo;Submit to Verified Leaderboard&rdquo; to claim the first spot.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/typing-test/')}
              className="mt-4 inline-flex min-h-[40px] items-center rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Take a Timed Test
            </button>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[540px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="py-2.5 pr-3">Rank</th>
                  <th className="py-2.5 px-3">Display Name</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3 text-right">Net WPM</th>
                  <th className="py-2.5 px-3 text-right">Gross WPM</th>
                  <th className="py-2.5 pl-3 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {entries.map((entry, idx) => (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 pr-3 font-mono font-bold text-slate-500 tabular-nums">
                      #{idx + 1}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                      {entry.displayName}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300">
                      {entry.language === 'hi' ? 'Hindi' : 'English'}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-600 tabular-nums dark:text-slate-300">
                      {entry.durationSec / 60} Min
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600 tabular-nums dark:text-blue-400">
                      {entry.netWpm}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {entry.grossWpm}
                    </td>
                    <td className="py-2.5 pl-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                      {entry.accuracy}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
