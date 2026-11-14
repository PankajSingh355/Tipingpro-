import { LogOut, MailCheck, ShieldAlert, Trash2, TrendingUp, UserCheck } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  deleteUserSession,
  fetchUserSessions,
  removeUserLeaderboardEntries,
  updateUserProfile,
} from '../lib/firestoreService.ts';
import type { TestDurationSec, TypingLanguage, TypingSessionRecord } from '../types/typing.ts';

interface DashboardViewProps {
  onNavigate: (path: string) => void;
}

export function DashboardView({ onNavigate }: DashboardViewProps) {
  const { user, profile, loading: authLoading, setAuthModalOpen, logout, refreshProfile, resendVerificationEmail } =
    useAuth();
  const { setThemeMode } = useTheme();

  const [sessions, setSessions] = useState<TypingSessionRecord[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings form state
  const [displayName, setDisplayName] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<TypingLanguage>('en');
  const [preferredDurationSec, setPreferredDurationSec] = useState<TestDurationSec>(60);
  const [leaderboardOptIn, setLeaderboardOptIn] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);
  const [verifyEmailMsg, setVerifyEmailMsg] = useState<string | null>(null);
  const [deletionConfirmOpen, setDeletionConfirmOpen] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPreferredLanguage(profile.preferredLanguage || 'en');
      setPreferredDurationSec(profile.preferredDurationSec || 60);
      setLeaderboardOptIn(Boolean(profile.leaderboardOptIn));
    }
  }, [profile]);

  const loadSessions = useCallback(async () => {
    if (!user) return;
    setLoadingSessions(true);
    setErrorMsg(null);
    try {
      const rows = await fetchUserSessions(user.uid);
      setSessions(rows);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to load saved sessions.');
    } finally {
      setLoadingSessions(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      void loadSessions();
    } else {
      setSessions([]);
    }
  }, [user, loadSessions]);

  const stats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        latest: null as TypingSessionRecord | null,
        bestWpm: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        totalSessions: 0,
        enCount: 0,
        enAvgWpm: 0,
        hiCount: 0,
        hiAvgWpm: 0,
      };
    }

    const totalSessions = sessions.length;
    const bestWpm = Math.max(...sessions.map((s) => s.netWpm));
    const avgWpm = Math.round(sessions.reduce((acc, s) => acc + s.netWpm, 0) / totalSessions);
    const avgAccuracy =
      Math.round((sessions.reduce((acc, s) => acc + s.accuracy, 0) / totalSessions) * 10) / 10;

    const enRows = sessions.filter((s) => s.language === 'en');
    const hiRows = sessions.filter((s) => s.language === 'hi');
    const enAvgWpm =
      enRows.length > 0 ? Math.round(enRows.reduce((a, s) => a + s.netWpm, 0) / enRows.length) : 0;
    const hiAvgWpm =
      hiRows.length > 0 ? Math.round(hiRows.reduce((a, s) => a + s.netWpm, 0) / hiRows.length) : 0;

    return {
      latest: sessions[0],
      bestWpm,
      avgWpm,
      avgAccuracy,
      totalSessions,
      enCount: enRows.length,
      enAvgWpm,
      hiCount: hiRows.length,
      hiAvgWpm,
    };
  }, [sessions]);

  const chartPoints = useMemo(() => {
    const recent = [...sessions].slice(0, 12).reverse();
    if (recent.length === 0) return [];
    const maxWpm = Math.max(40, ...recent.map((r) => r.netWpm));
    return recent.map((item, idx) => {
      const x = recent.length === 1 ? 50 : 6 + (idx / (recent.length - 1)) * 88;
      const yWpm = 88 - (item.netWpm / maxWpm) * 72;
      const yAcc = 88 - (item.accuracy / 100) * 72;
      return {
        id: item.id,
        x,
        yWpm,
        yAcc,
        netWpm: item.netWpm,
        accuracy: item.accuracy,
        label: `#${idx + 1}`,
      };
    });
  }, [sessions]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingSettings(true);
    setSettingsMsg(null);
    try {
      await updateUserProfile(user.uid, {
        displayName: displayName.trim() || 'TypingPro Learner',
        preferredLanguage,
        preferredDurationSec,
        leaderboardOptIn,
      });
      if (!leaderboardOptIn) {
        await removeUserLeaderboardEntries(user.uid);
      }
      await refreshProfile();
      setSettingsMsg('Preferences saved to your profile.');
    } catch (err) {
      setSettingsMsg(err instanceof Error ? err.message : 'Failed to save preferences.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!user) return;
    try {
      await deleteUserSession(user.uid, sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not delete session.');
    }
  };

  const handleRequestDeletion = async () => {
    if (!user) return;
    try {
      await updateUserProfile(user.uid, {
        deletionRequested: true,
        deletionRequestedAt: new Date().toISOString(),
        leaderboardOptIn: false,
      });
      await removeUserLeaderboardEntries(user.uid);
      await refreshProfile();
      setDeletionConfirmOpen(false);
      setSettingsMsg(
        'Your account/data deletion request has been recorded and any public leaderboard entries have been removed.',
      );
    } catch (err) {
      setSettingsMsg(err instanceof Error ? err.message : 'Unable to submit deletion request.');
    }
  };

  if (authLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        Loading your account...
      </div>
    );
  }

  if (!user) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
          Sign In to View Your Typing Dashboard
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          Your dashboard displays only genuine saved records from Cloud Firestore—Best WPM, Average WPM, Accuracy charts, and English vs. Hindi breakdowns. Sign in optionally to start tracking.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setAuthModalOpen(true)}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign In / Create Account
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/typing-test/')}
            className="inline-flex min-h-[44px] items-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          >
            Continue as Guest
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Account Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span>Signed in as {user.email}</span>
          </div>
          <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 dark:text-white">
            {profile?.displayName || user.displayName || 'TypingPro Learner'}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('/typing-test/')}
            className="inline-flex min-h-[40px] items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Start New Test
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {!user.emailVerified && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <MailCheck className="h-4 w-4 shrink-0" />
            <span>
              Your email address is not yet verified. Verify it to unlock full security verification.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              void resendVerificationEmail()
                .then(() => setVerifyEmailMsg('Verification email sent!'))
                .catch(() => setVerifyEmailMsg('Please wait a moment before requesting another email.'));
            }}
            className="font-semibold underline"
          >
            {verifyEmailMsg || 'Resend Verification Email'}
          </button>
        </div>
      )}

      {profile?.deletionRequested && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
          Account/data deletion request recorded on {profile.deletionRequestedAt?.slice(0, 10)}.
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Latest Net WPM</div>
          <div className="mt-1 font-mono text-2xl font-bold text-blue-600 tabular-nums dark:text-blue-400">
            {stats.latest ? `${stats.latest.netWpm}` : '—'}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {stats.latest ? `${stats.latest.accuracy}% accuracy` : 'No saved tests yet'}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Best Net WPM</div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
            {stats.totalSessions > 0 ? stats.bestWpm : '—'}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Personal record</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Average WPM</div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
            {stats.totalSessions > 0 ? stats.avgWpm : '—'}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Across all saved tests</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Average Accuracy</div>
          <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
            {stats.totalSessions > 0 ? `${stats.avgAccuracy}%` : '—'}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Precision mean</div>
        </div>

        <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-1 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500 dark:text-slate-400">Practice Sessions</div>
          <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
            {stats.totalSessions}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            EN: {stats.enCount} · HI: {stats.hiCount}
          </div>
        </div>
      </div>

      {/* Progress Chart & Language Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-8 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Recent Speed &amp; Accuracy Trend
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Blue: Net WPM · Emerald: Accuracy %
            </span>
          </div>

          {loadingSessions ? (
            <div className="mt-6 h-48 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          ) : chartPoints.length === 0 ? (
            <div className="mt-6 flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-950">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Complete your first typing test while signed in to plot your real speed progress chart here.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/typing-test/')}
                className="mt-3 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Take First Test
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <svg viewBox="0 0 100 100" className="h-52 w-full overflow-visible" aria-label="Progress chart">
                <line x1="4" y1="16" x2="96" y2="16" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="0.4" />
                <line x1="4" y1="52" x2="96" y2="52" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="0.4" />
                <line x1="4" y1="88" x2="96" y2="88" className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="0.5" />

                {chartPoints.length > 1 && (
                  <>
                    <polyline
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="1.5"
                      points={chartPoints.map((p) => `${p.x},${p.yWpm}`).join(' ')}
                    />
                    <polyline
                      fill="none"
                      stroke="#059669"
                      strokeWidth="1.2"
                      strokeDasharray="2 1.5"
                      points={chartPoints.map((p) => `${p.x},${p.yAcc}`).join(' ')}
                    />
                  </>
                )}

                {chartPoints.map((p) => (
                  <g key={p.id}>
                    <circle cx={p.x} cy={p.yWpm} r="1.8" className="fill-blue-600 dark:fill-blue-400" />
                    <text
                      x={p.x}
                      y={p.yWpm - 3.5}
                      textAnchor="middle"
                      fontSize="3.4"
                      className="fill-slate-700 font-mono dark:fill-slate-200"
                    >
                      {p.netWpm}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Language-Wise Summary
          </h3>
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white">
                <span>English Typing</span>
                <span className="font-mono tabular-nums">{stats.enCount} tests</span>
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Average Net Speed:{' '}
                <strong className="font-mono text-slate-900 dark:text-white">
                  {stats.enCount > 0 ? `${stats.enAvgWpm} WPM` : 'No data yet'}
                </strong>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white">
                <span>Hindi Unicode</span>
                <span className="font-mono tabular-nums">{stats.hiCount} tests</span>
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Average Net Speed:{' '}
                <strong className="font-mono text-slate-900 dark:text-white">
                  {stats.hiCount > 0 ? `${stats.hiAvgWpm} WPM` : 'No data yet'}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Practice History Table */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
          Saved Practice History
        </h3>
        {errorMsg && (
          <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
            {errorMsg}
          </div>
        )}

        {sessions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            No saved sessions found yet. Complete any typing test to see your history here.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="py-2.5 pr-3">Date</th>
                  <th className="py-2.5 px-3">Passage</th>
                  <th className="py-2.5 px-3">Language</th>
                  <th className="py-2.5 px-3 text-right">Net WPM</th>
                  <th className="py-2.5 px-3 text-right">Gross WPM</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 pl-3 text-right">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 pr-3 font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                      {s.createdAtMs ? new Date(s.createdAtMs).toLocaleDateString() : 'Today'}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-slate-100">
                      {s.passageTitle}
                    </td>
                    <td className="py-2.5 px-3 text-xs text-slate-600 dark:text-slate-300">
                      {s.language === 'hi' ? 'Hindi' : 'English'} · {s.difficulty}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600 tabular-nums dark:text-blue-400">
                      {s.netWpm}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {s.grossWpm}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400">
                      {s.accuracy}%
                    </td>
                    <td className="py-2.5 pl-3 text-right">
                      <button
                        type="button"
                        onClick={() => void handleDeleteSession(s.id)}
                        aria-label={`Delete session ${s.passageTitle}`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/60 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Profile Settings & Privacy Controls */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
          Account Settings &amp; Privacy
        </h3>
        <form onSubmit={handleSaveSettings} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="pref-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Display Name (used on Leaderboard if opted in)
            </label>
            <input
              id="pref-name"
              type="text"
              maxLength={80}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="pref-lang" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Preferred Language
            </label>
            <select
              id="pref-lang"
              value={preferredLanguage}
              onChange={(e) => setPreferredLanguage(e.target.value as TypingLanguage)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (Unicode Devanagari)</option>
            </select>
          </div>

          <div>
            <label htmlFor="pref-dur" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Default Test Duration
            </label>
            <select
              id="pref-dur"
              value={preferredDurationSec}
              onChange={(e) => setPreferredDurationSec(Number(e.target.value) as TestDurationSec)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            >
              <option value={60}>1 Minute</option>
              <option value={120}>2 Minutes</option>
              <option value={180}>3 Minutes</option>
              <option value={300}>5 Minutes</option>
              <option value={600}>10 Minutes</option>
            </select>
          </div>

          <div>
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Theme Override
            </span>
            <div className="mt-1 flex gap-2">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className="h-11 flex-1 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                Light Mode
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className="h-11 flex-1 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              >
                Dark Mode
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm dark:border-slate-800 dark:bg-slate-950">
              <input
                type="checkbox"
                checked={leaderboardOptIn}
                onChange={(e) => setLeaderboardOptIn(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span>
                <strong className="block font-semibold text-slate-900 dark:text-white">
                  Allow Display Name on Public Verified Leaderboard
                </strong>
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  Leave unchecked to remain completely private. Your email address is never shared publicly.
                </span>
              </span>
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={savingSettings}
              className="inline-flex min-h-[42px] items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {savingSettings ? 'Saving...' : 'Save Preferences'}
            </button>

            <button
              type="button"
              onClick={() => setDeletionConfirmOpen((v) => !v)}
              className="inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline dark:text-red-400"
            >
              <ShieldAlert className="h-4 w-4" />
              Request Account &amp; Data Deletion
            </button>
          </div>
        </form>

        {settingsMsg && (
          <div role="status" className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300">
            {settingsMsg}
          </div>
        )}

        {deletionConfirmOpen && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-200">
            <p className="font-semibold">
              Confirm Account &amp; Data Deletion Request
            </p>
            <p className="mt-1 leading-relaxed">
              This will mark your profile for full deletion, opt you out of the leaderboard, and remove any existing leaderboard entries immediately.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => void handleRequestDeletion()}
                className="rounded-lg bg-red-600 px-3.5 py-2 font-semibold text-white hover:bg-red-700"
              >
                Confirm Deletion Request
              </button>
              <button
                type="button"
                onClick={() => setDeletionConfirmOpen(false)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
