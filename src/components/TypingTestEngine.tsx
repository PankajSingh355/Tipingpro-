import {
  AlertTriangle,
  Award,
  Check,
  Copy,
  FileText,
  Keyboard,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Timer as TimerIcon,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { PASSAGES, selectPassage } from '../data/passages.ts';
import { saveTypingSession, submitLeaderboardEntry } from '../lib/firestoreService.ts';
import type {
  DifficultyLevel,
  PassageItem,
  SessionMode,
  TestDurationSec,
  TypingEvaluationResult,
  TypingLanguage,
} from '../types/typing.ts';
import { evaluateTyping } from '../utils/typingEngine.ts';

export interface StoredPracticeReportData {
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalTypedChars: number;
  elapsedSec: number;
  durationSec: number;
  language: TypingLanguage;
  difficulty: DifficultyLevel;
  passageTitle: string;
  completedAtIso: string;
}

interface TypingTestEngineProps {
  mode?: SessionMode;
  routeSlug: string;
  initialLanguage?: TypingLanguage;
  initialDurationSec?: TestDurationSec;
  initialDifficulty?: Exclude<DifficultyLevel, 'custom'>;
  passageCategory?: PassageItem['category'];
  lockDuration?: boolean;
  onNavigate: (path: string) => void;
}

const DURATIONS: { value: TestDurationSec; label: string }[] = [
  { value: 60, label: '1 Min' },
  { value: 120, label: '2 Min' },
  { value: 180, label: '3 Min' },
  { value: 300, label: '5 Min' },
  { value: 600, label: '10 Min' },
];

export function TypingTestEngine({
  mode = 'test',
  routeSlug,
  initialLanguage = 'en',
  initialDurationSec = 60,
  initialDifficulty = 'intermediate',
  passageCategory = 'general',
  lockDuration = false,
  onNavigate,
}: TypingTestEngineProps) {
  const { user, profile, setAuthModalOpen } = useAuth();

  const [language, setLanguage] = useState<TypingLanguage>(initialLanguage);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(initialDifficulty);
  const [durationSec, setDurationSec] = useState<TestDurationSec>(initialDurationSec);
  const [passage, setPassage] = useState<PassageItem>(() =>
    selectPassage({
      language: initialLanguage,
      difficulty: initialDifficulty,
      category: passageCategory,
    }),
  );
  const [customText, setCustomText] = useState(
    'Paste or enter your own English or Hindi Unicode text here to practice specific paragraphs, essays, or technical terms.',
  );
  const [isCustomMode, setIsCustomMode] = useState(false);

  const [typedText, setTypedText] = useState('');
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [elapsedSec, setElapsedSec] = useState(0);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const [pasteAttempted, setPasteAttempted] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [leaderboardState, setLeaderboardState] = useState<{
    status: 'idle' | 'submitting' | 'submitted' | 'error';
    message?: string;
  }>({ status: 'idle' });
  const [showHindiHelp, setShowHindiHelp] = useState(initialLanguage === 'hi');

  const startTimeMsRef = useRef<number | null>(null);
  const keystrokeTimestampsRef = useRef<number[]>([]);
  const isComposingRef = useRef(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const passageScrollRef = useRef<HTMLDivElement | null>(null);
  const finalizedRef = useRef(false);

  // Sync defaults when navigating between distinct SEO landing routes
  useEffect(() => {
    setLanguage(initialLanguage);
    setDifficulty(initialDifficulty);
    setDurationSec(initialDurationSec);
    setIsCustomMode(false);
    setShowHindiHelp(initialLanguage === 'hi');
    const nextPassage = selectPassage({
      language: initialLanguage,
      difficulty: initialDifficulty,
      category: passageCategory,
    });
    setPassage(nextPassage);
    setTypedText('');
    setStatus('idle');
    setElapsedSec(0);
    setPasteNotice(null);
    setPasteAttempted(false);
    setSaveState('idle');
    setLeaderboardState({ status: 'idle' });
    startTimeMsRef.current = null;
    keystrokeTimestampsRef.current = [];
    finalizedRef.current = false;
  }, [routeSlug, initialLanguage, initialDurationSec, initialDifficulty, passageCategory]);

  const targetText = useMemo(() => {
    if (isCustomMode) {
      return customText.trim() || 'Enter custom text above to begin practicing.';
    }
    return passage.text;
  }, [isCustomMode, customText, passage.text]);

  const evaluation: TypingEvaluationResult = useMemo(() => {
    return evaluateTyping({
      targetText,
      typedText,
      elapsedSec: Math.max(elapsedSec, status === 'idle' ? 0 : 1),
      language,
      isFinished: status === 'finished',
    });
  }, [targetText, typedText, elapsedSec, language, status]);

  const finalizeSession = useCallback(
    async (finalElapsedSec: number, finalTypedText: string) => {
      if (finalizedRef.current) return;
      finalizedRef.current = true;

      const safeElapsed = Math.max(1, finalElapsedSec);
      const finalEval = evaluateTyping({
        targetText,
        typedText: finalTypedText,
        elapsedSec: safeElapsed,
        language,
        isFinished: true,
      });

      setElapsedSec(safeElapsed);
      setStatus('finished');

      const reportPayload: StoredPracticeReportData = {
        netWpm: finalEval.metrics.netWpm,
        grossWpm: finalEval.metrics.grossWpm,
        accuracy: finalEval.metrics.accuracy,
        correctChars: finalEval.metrics.correctChars,
        incorrectChars: finalEval.metrics.incorrectChars,
        totalTypedChars: finalEval.metrics.totalTypedChars,
        elapsedSec: safeElapsed,
        durationSec: mode === 'test' ? durationSec : safeElapsed,
        language,
        difficulty: isCustomMode ? 'custom' : difficulty,
        passageTitle: isCustomMode ? 'Custom Text Practice' : passage.title,
        completedAtIso: new Date().toISOString(),
      };

      try {
        localStorage.setItem('typingpro_latest_result', JSON.stringify(reportPayload));
      } catch {
        // Ignore storage quota errors
      }

      if (user && finalEval.metrics.totalTypedChars >= 5) {
        setSaveState('saving');
        try {
          await saveTypingSession(user.uid, {
            mode,
            routeSlug,
            language,
            difficulty: isCustomMode ? 'custom' : difficulty,
            durationSec: mode === 'test' ? durationSec : safeElapsed,
            elapsedSec: safeElapsed,
            grossWpm: finalEval.metrics.grossWpm,
            netWpm: finalEval.metrics.netWpm,
            accuracy: finalEval.metrics.accuracy,
            correctChars: finalEval.metrics.correctChars,
            incorrectChars: finalEval.metrics.incorrectChars,
            totalTypedChars: finalEval.metrics.totalTypedChars,
            passageTitle: isCustomMode ? 'Custom Text Practice' : passage.title,
          });
          setSaveState('saved');
        } catch {
          setSaveState('error');
        }
      }
    },
    [targetText, language, mode, durationSec, isCustomMode, difficulty, passage.title, user, routeSlug],
  );

  // Accurate timestamp-based timer loop
  useEffect(() => {
    if (status !== 'running') return;
    const interval = window.setInterval(() => {
      if (!startTimeMsRef.current) return;
      const nowElapsed = Math.floor((Date.now() - startTimeMsRef.current) / 1000);
      if (mode === 'test' && nowElapsed >= durationSec) {
        window.clearInterval(interval);
        void finalizeSession(durationSec, typedText);
      } else {
        setElapsedSec(nowElapsed);
      }
    }, 150);
    return () => window.clearInterval(interval);
  }, [status, mode, durationSec, finalizeSession, typedText]);

  // Auto-finish if passage is fully typed
  useEffect(() => {
    if (status === 'running' && evaluation.isPassageCompleted) {
      const actualElapsed = startTimeMsRef.current
        ? Math.max(1, Math.round((Date.now() - startTimeMsRef.current) / 1000))
        : Math.max(1, elapsedSec);
      void finalizeSession(actualElapsed, typedText);
    }
  }, [status, evaluation.isPassageCompleted, elapsedSec, finalizeSession, typedText]);

  // Keep active character centered smoothly inside passage container
  useEffect(() => {
    const container = passageScrollRef.current;
    const active = activeCharRef.current;
    if (!container || !active) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    if (activeRect.bottom > containerRect.bottom - 20 || activeRect.top < containerRect.top + 10) {
      active.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [typedText]);

  const resetTest = useCallback(
    (newPassageItem?: PassageItem) => {
      if (newPassageItem) {
        setPassage(newPassageItem);
      }
      setTypedText('');
      setStatus('idle');
      setElapsedSec(0);
      setPasteNotice(null);
      setPasteAttempted(false);
      setCopiedShare(false);
      setSaveState('idle');
      setLeaderboardState({ status: 'idle' });
      startTimeMsRef.current = null;
      keystrokeTimestampsRef.current = [];
      finalizedRef.current = false;
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
    },
    [],
  );

  const handleLanguageChange = (nextLang: TypingLanguage) => {
    setLanguage(nextLang);
    setShowHindiHelp(nextLang === 'hi');
    setIsCustomMode(false);
    const diff = difficulty === 'custom' ? 'intermediate' : difficulty;
    setDifficulty(diff);
    const nextPassage = selectPassage({
      language: nextLang,
      difficulty: diff,
      category: passageCategory,
    });
    resetTest(nextPassage);
  };

  const handleDifficultyChange = (nextDiff: DifficultyLevel) => {
    if (nextDiff === 'custom') {
      setIsCustomMode(true);
      setDifficulty('custom');
      resetTest();
      return;
    }
    setIsCustomMode(false);
    setDifficulty(nextDiff);
    const nextPassage = selectPassage({
      language,
      difficulty: nextDiff,
      category: passageCategory,
    });
    resetTest(nextPassage);
  };

  const handleDurationChange = (nextDuration: TestDurationSec) => {
    setDurationSec(nextDuration);
    resetTest();
  };

  const handleNewPassage = () => {
    const diff = difficulty === 'custom' ? 'intermediate' : difficulty;
    const pool = PASSAGES.filter(
      (p) => p.language === language && p.difficulty === diff && p.id !== passage.id,
    );
    const fallbackPool = PASSAGES.filter((p) => p.language === language && p.id !== passage.id);
    const nextList = pool.length > 0 ? pool : fallbackPool;
    const next = nextList[Math.floor(Math.random() * nextList.length)] ?? passage;
    setIsCustomMode(false);
    resetTest(next);
  };

  const handleStartButton = () => {
    if (status === 'idle') {
      startTimeMsRef.current = Date.now();
      setStatus('running');
      inputRef.current?.focus();
    } else if (status === 'finished') {
      resetTest();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleFinishEarly = () => {
    if (status !== 'running') return;
    const actualElapsed = startTimeMsRef.current
      ? Math.max(1, Math.round((Date.now() - startTimeMsRef.current) / 1000))
      : Math.max(1, elapsedSec);
    void finalizeSession(actualElapsed, typedText);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (status === 'finished') return;
    const val = e.target.value;

    if (status === 'idle' && val.length > 0) {
      startTimeMsRef.current = Date.now();
      setStatus('running');
    }

    if (!isComposingRef.current) {
      keystrokeTimestampsRef.current.push(Date.now());
      if (keystrokeTimestampsRef.current.length > 2000) {
        keystrokeTimestampsRef.current.shift();
      }
    }

    setTypedText(val);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setPasteAttempted(true);
    setPasteNotice(
      'Paste is blocked during typing tests so WPM, accuracy, and saved progress remain genuine.',
    );
  };

  const handleCopyShare = async () => {
    const summary = `TypingPro Result (${language === 'hi' ? 'Hindi Unicode' : 'English'}): ${evaluation.metrics.netWpm} Net WPM | ${evaluation.metrics.grossWpm} Gross WPM | ${evaluation.metrics.accuracy}% Accuracy in ${evaluation.metrics.elapsedSec}s`;
    try {
      await navigator.clipboard.writeText(summary);
      setCopiedShare(true);
      window.setTimeout(() => setCopiedShare(false), 2500);
    } catch {
      setCopiedShare(false);
    }
  };

  const handleSubmitToLeaderboard = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (isCustomMode || mode !== 'test') {
      setLeaderboardState({
        status: 'error',
        message: 'Only standard timed typing tests (non-custom) qualify for the leaderboard.',
      });
      return;
    }

    setLeaderboardState({ status: 'submitting' });
    try {
      const response = await fetch('/api/typing/verify-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          language,
          durationSec,
          elapsedSec: evaluation.metrics.elapsedSec,
          grossWpm: evaluation.metrics.grossWpm,
          netWpm: evaluation.metrics.netWpm,
          accuracy: evaluation.metrics.accuracy,
          correctChars: evaluation.metrics.correctChars,
          incorrectChars: evaluation.metrics.incorrectChars,
          totalTypedChars: evaluation.metrics.totalTypedChars,
          keystrokeTimestamps: keystrokeTimestampsRef.current,
          pasteAttempted,
        }),
      });
      const data = (await response.json()) as {
        verified?: boolean;
        verificationDigest?: string;
        reason?: string;
      };
      if (!response.ok || !data.verified || !data.verificationDigest) {
        setLeaderboardState({
          status: 'error',
          message: data.reason || 'Score did not meet leaderboard verification requirements.',
        });
        return;
      }

      const displayName =
        profile?.displayName || user.displayName || user.email?.split('@')[0] || 'TypingPro Typist';
      await submitLeaderboardEntry({
        uid: user.uid,
        displayName,
        language,
        durationSec,
        netWpm: evaluation.metrics.netWpm,
        grossWpm: evaluation.metrics.grossWpm,
        accuracy: evaluation.metrics.accuracy,
        verificationDigest: data.verificationDigest,
      });

      setLeaderboardState({
        status: 'submitted',
        message: 'Verified score submitted to the TypingPro leaderboard.',
      });
    } catch (err) {
      setLeaderboardState({
        status: 'error',
        message: err instanceof Error ? err.message : 'Unable to submit leaderboard entry.',
      });
    }
  };

  const remainingSec = mode === 'test' ? Math.max(0, durationSec - elapsedSec) : elapsedSec;
  const formattedTime = `${String(Math.floor(remainingSec / 60)).padStart(2, '0')}:${String(
    remainingSec % 60,
  ).padStart(2, '0')}`;

  return (
    <section
      aria-label="Interactive Typing Test Workspace"
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Controls Bar */}
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Language Switcher */}
          <div
            role="group"
            aria-label="Typing language"
            className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950"
          >
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                language === 'en'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                language === 'hi'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Hindi (हिंदी Unicode)
            </button>
          </div>

          {/* Difficulty Switcher */}
          <div
            role="group"
            aria-label="Passage difficulty"
            className="inline-flex flex-wrap rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950"
          >
            {(
              [
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ] as const
            ).map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleDifficultyChange(level.value)}
                className={`min-h-[36px] rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  !isCustomMode && difficulty === level.value
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {level.label}
              </button>
            ))}
            {mode === 'practice' && (
              <button
                type="button"
                onClick={() => handleDifficultyChange('custom')}
                className={`min-h-[36px] rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isCustomMode
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Custom Text
              </button>
            )}
          </div>
        </div>

        {/* Duration Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {mode === 'test' && (
            <div
              role="group"
              aria-label="Test duration"
              className="inline-flex flex-wrap rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-800 dark:bg-slate-950"
            >
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  disabled={lockDuration && d.value !== durationSec}
                  onClick={() => handleDurationChange(d.value)}
                  className={`min-h-[36px] rounded-lg px-2.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 disabled:opacity-40 ${
                    durationSec === d.value
                      ? 'bg-blue-600 text-white shadow-xs dark:bg-blue-500'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleNewPassage}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            New Passage
          </button>

          <button
            type="button"
            onClick={() => resetTest()}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart
          </button>
        </div>
      </div>

      {/* Custom Text Editor (Practice Mode) */}
      {isCustomMode && status !== 'finished' && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950">
          <label
            htmlFor="custom-practice-source"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Custom Practice Passage (English or Hindi Unicode, max 2,000 characters)
          </label>
          <textarea
            id="custom-practice-source"
            rows={3}
            maxLength={2000}
            value={customText}
            onChange={(e) => {
              setCustomText(e.target.value);
              if (status === 'running') {
                resetTest();
              }
            }}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      )}

      {/* Live Metrics Strip */}
      <div className="mt-4 grid grid-cols-2 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 sm:grid-cols-5 sm:divide-x sm:divide-y-0 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950">
        <div className="px-4 py-2.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <TimerIcon className="h-3.5 w-3.5" />
            <span>{mode === 'test' ? 'Time Left' : 'Elapsed'}</span>
          </div>
          <div
            data-testid="typing-timer"
            className="mt-0.5 font-mono text-xl font-bold text-slate-900 tabular-nums dark:text-white"
          >
            {formattedTime}
          </div>
        </div>

        <div className="px-4 py-2.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Net WPM</div>
          <div
            data-testid="typing-net-wpm"
            className="mt-0.5 font-mono text-xl font-bold text-blue-600 tabular-nums dark:text-blue-400"
          >
            {evaluation.metrics.netWpm}
          </div>
        </div>

        <div className="px-4 py-2.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Gross WPM</div>
          <div
            data-testid="typing-gross-wpm"
            className="mt-0.5 font-mono text-xl font-bold text-slate-900 tabular-nums dark:text-white"
          >
            {evaluation.metrics.grossWpm}
          </div>
        </div>

        <div className="px-4 py-2.5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Accuracy</div>
          <div
            data-testid="typing-accuracy"
            className="mt-0.5 font-mono text-xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400"
          >
            {evaluation.metrics.accuracy}%
          </div>
        </div>

        <div className="col-span-2 px-4 py-2.5 sm:col-span-1">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Characters</div>
          <div className="mt-0.5 font-mono text-xl font-bold text-slate-900 tabular-nums dark:text-white">
            {evaluation.metrics.correctChars}
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
              /{evaluation.metrics.totalTargetChars}
            </span>
          </div>
        </div>
      </div>

      {/* Main Typing Stage or Results Screen */}
      {status !== 'finished' ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              {isCustomMode ? 'Custom Text Practice' : passage.title} ·{' '}
              {language === 'hi' ? 'Unicode Devanagari' : 'English'} ·{' '}
              {evaluation.metrics.completionPercent}% complete
            </span>
            <div className="flex items-center gap-2">
              {status === 'idle' && (
                <button
                  type="button"
                  onClick={handleStartButton}
                  className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  <Play className="h-3.5 w-3.5" />
                  Start Typing
                </button>
              )}
              {status === 'running' && (
                <button
                  type="button"
                  onClick={handleFinishEarly}
                  className="inline-flex min-h-[34px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Finish Now
                </button>
              )}
            </div>
          </div>

          {/* Target Passage Box */}
          <div
            ref={passageScrollRef}
            onClick={() => inputRef.current?.focus()}
            className={`max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 leading-relaxed select-none sm:p-5 dark:border-slate-800 dark:bg-slate-950 ${
              language === 'hi' ? 'font-typing-hi text-xl sm:text-2xl leading-[1.9]' : 'font-typing-en text-lg sm:text-xl leading-[1.8]'
            }`}
            aria-label="Passage to type"
          >
            {evaluation.items.map((item, idx) => {
              let cls = 'text-slate-500 dark:text-slate-400';
              if (item.status === 'correct') {
                cls =
                  'text-emerald-800 bg-emerald-100/75 dark:text-emerald-300 dark:bg-emerald-950/50 rounded-xs';
              } else if (item.status === 'incorrect') {
                cls =
                  'text-red-800 bg-red-100 underline decoration-red-600 decoration-2 dark:text-red-300 dark:bg-red-950/60 rounded-xs';
              } else if (item.status === 'pending') {
                cls =
                  'text-amber-900 bg-amber-100 underline decoration-blue-600 decoration-2 dark:text-amber-200 dark:bg-amber-900/40 rounded-xs';
              } else if (item.isCurrent) {
                cls =
                  'bg-blue-600/15 text-blue-950 ring-2 ring-blue-600 dark:bg-blue-500/25 dark:text-blue-100 dark:ring-blue-400 rounded-xs';
              }

              return (
                <span
                  key={idx}
                  ref={item.isCurrent ? activeCharRef : undefined}
                  className={cls}
                >
                  {item.char}
                </span>
              );
            })}
          </div>

          {/* Visible Accessible Mobile-Friendly Typing Input */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor={`typing-input-${routeSlug}`}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <Keyboard className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                {status === 'idle'
                  ? 'Click here and start typing to begin the timer'
                  : 'Typing active — keep eyes on the passage above'}
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Correct: green · Mistake: red underline
              </span>
            </div>

            <textarea
              ref={inputRef}
              id={`typing-input-${routeSlug}`}
              data-testid="typing-input"
              rows={3}
              value={typedText}
              onChange={handleInputChange}
              onPaste={handlePaste}
              onDrop={(e) => e.preventDefault()}
              onCompositionStart={() => {
                isComposingRef.current = true;
              }}
              onCompositionEnd={() => {
                isComposingRef.current = false;
                keystrokeTimestampsRef.current.push(Date.now());
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              lang={language}
              placeholder={
                language === 'hi'
                  ? 'यहाँ हिंदी यूनिकोड में टाइप करना शुरू करें...'
                  : 'Start typing the passage above here...'
              }
              className={`w-full rounded-xl border-2 border-slate-300 bg-white p-3.5 text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-400 ${
                language === 'hi' ? 'font-typing-hi text-lg' : 'font-typing-en text-base'
              }`}
            />

            {pasteNotice && (
              <div
                role="alert"
                className="mt-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300"
              >
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{pasteNotice}</span>
              </div>
            )}
          </div>

          {/* Hindi Input Explanation */}
          {language === 'hi' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Hindi Unicode Input Guide (Inscript / Phonetic / Mobile Keyboard)
                </span>
                <button
                  type="button"
                  onClick={() => setShowHindiHelp((v) => !v)}
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  {showHindiHelp ? 'Hide details' : 'Show details'}
                </button>
              </div>
              {showHindiHelp && (
                <p className="mt-2 leading-relaxed">
                  Use your device&apos;s Unicode Hindi keyboard (Windows: Win + Space after adding Hindi Inscript or Phonetic; macOS: Devanagari input source; Android/iOS: Gboard Hindi). Type the base consonant first, followed by matras or halant (्). Legacy non-Unicode font encodings such as Kruti Dev 010 ASCII mapping are not used here.
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Detailed Results View */
        <div
          data-testid="typing-results"
          className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                Typing Session Complete
              </h3>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                {isCustomMode ? 'Custom Text Practice' : passage.title} ·{' '}
                {language === 'hi' ? 'Hindi Unicode' : 'English'} · {evaluation.metrics.elapsedSec}s elapsed
              </p>
            </div>
            {saveState === 'saved' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <Check className="h-4 w-4" />
                Saved to your account history
              </span>
            )}
            {saveState === 'saving' && (
              <span className="text-xs text-slate-500 dark:text-slate-400">Saving to Cloud Firestore...</span>
            )}
            {!user && (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="text-left text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Sign in to save history &amp; view charts
              </button>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-y-0 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
            <div className="p-3.5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Net WPM</div>
              <div className="mt-1 font-mono text-2xl font-bold text-blue-600 tabular-nums dark:text-blue-400">
                {evaluation.metrics.netWpm}
              </div>
            </div>
            <div className="p-3.5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Gross WPM</div>
              <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
                {evaluation.metrics.grossWpm}
              </div>
            </div>
            <div className="p-3.5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Accuracy</div>
              <div className="mt-1 font-mono text-2xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                {evaluation.metrics.accuracy}%
              </div>
            </div>
            <div className="p-3.5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Correct Chars</div>
              <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
                {evaluation.metrics.correctChars}
              </div>
            </div>
            <div className="p-3.5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Incorrect Chars</div>
              <div className="mt-1 font-mono text-2xl font-bold text-red-600 tabular-nums dark:text-red-400">
                {evaluation.metrics.incorrectChars}
              </div>
            </div>
            <div className="p-3.5">
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Typed</div>
              <div className="mt-1 font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
                {evaluation.metrics.totalTypedChars}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            <strong className="font-semibold text-slate-900 dark:text-slate-200">
              Documented Formula:
            </strong>{' '}
            Gross WPM = (Total Typed Units / 5) / Minutes · Net WPM = max(0, ((Total Typed − Incorrect) / 5) / Minutes) · Accuracy = (Correct / Total Typed) × 100.
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => resetTest()}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              <RotateCcw className="h-4 w-4" />
              Retry Passage
            </button>
            <button
              type="button"
              onClick={handleNewPassage}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <RefreshCw className="h-4 w-4" />
              New Passage
            </button>
            <button
              type="button"
              onClick={handleCopyShare}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {copiedShare ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copiedShare ? 'Copied Result' : 'Share Result'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/typing-certificate/')}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <FileText className="h-4 w-4" />
              Practice Report
            </button>
            {mode === 'test' && !isCustomMode && (
              <button
                type="button"
                disabled={leaderboardState.status === 'submitting' || leaderboardState.status === 'submitted'}
                onClick={handleSubmitToLeaderboard}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-60 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60"
              >
                <ShieldCheck className="h-4 w-4" />
                {leaderboardState.status === 'submitting'
                  ? 'Verifying...'
                  : leaderboardState.status === 'submitted'
                    ? 'Submitted to Leaderboard'
                    : 'Submit to Verified Leaderboard'}
              </button>
            )}
          </div>

          {leaderboardState.message && (
            <div
              role="status"
              className={`mt-3 flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs ${
                leaderboardState.status === 'submitted'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300'
                  : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/50 dark:text-amber-300'
              }`}
            >
              <Award className="h-4 w-4 shrink-0" />
              <span>{leaderboardState.message}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
