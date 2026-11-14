import { Award, Heart, Pause, Play, RotateCcw, Target, Timer, Zap } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { TypingLanguage } from '../types/typing.ts';

type GameKind = 'word-challenge' | 'falling-words' | 'timed-challenge' | 'accuracy-challenge';

const WORD_BANKS: Record<TypingLanguage, Record<1 | 2 | 3, string[]>> = {
  en: {
    1: ['hand', 'fast', 'word', 'home', 'desk', 'type', 'calm', 'read', 'book', 'note', 'line', 'good', 'page', 'time', 'work', 'play', 'star', 'tree', 'wind', 'lamp'],
    2: ['rhythm', 'steady', 'anchor', 'screen', 'letter', 'finger', 'smooth', 'minute', 'result', 'course', 'school', 'pencil', 'bright', 'silent', 'planet', 'garden', 'bridge', 'window'],
    3: ['accuracy', 'keyboard', 'practice', 'precision', 'velocity', 'document', 'learning', 'progress', 'schedule', 'champion', 'strategy', 'momentum', 'language', 'standard', 'focusing'],
  },
  hi: {
    1: ['कमल', 'घर', 'जल', 'मन', 'नल', 'फल', 'सच', 'कल', 'जब', 'हम', 'रथ', 'पथ', 'वन', 'धन', 'सब', 'अब'],
    2: ['किताब', 'सुबह', 'स्कूल', 'हिंदी', 'मित्र', 'लेखन', 'समय', 'सरल', 'पढ़ाई', 'कदम', 'सपना', 'जीवन', 'दिशा', 'विचार'],
    3: ['अभ्यास', 'विद्यार्थी', 'सफलता', 'विज्ञान', 'प्रयास', 'संस्कृति', 'परिश्रम', 'स्वावलंबन', 'प्रगति', 'संतुलन'],
  },
};

function pickRandomWord(lang: TypingLanguage, level: 1 | 2 | 3, exclude?: string): string {
  const list = WORD_BANKS[lang][level];
  const candidates = exclude && list.length > 1 ? list.filter((w) => w !== exclude) : list;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

interface FallingWordItem {
  id: number;
  word: string;
  xPercent: number;
  yPercent: number;
  speedPerSec: number;
}

export function TypingGamesView() {
  const [activeGame, setActiveGame] = useState<GameKind>('word-challenge');
  const [language, setLanguage] = useState<TypingLanguage>('en');
  const [level, setLevel] = useState<1 | 2 | 3>(1);

  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'gameover'>('ready');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [lives, setLives] = useState(5);
  const [wordsCleared, setWordsCleared] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const [currentWord, setCurrentWord] = useState(() => pickRandomWord('en', 1));
  const [nextWord, setNextWord] = useState(() => pickRandomWord('en', 1));
  const [inputVal, setInputVal] = useState('');
  const [fallingWords, setFallingWords] = useState<FallingWordItem[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const nextIdRef = useRef(1);
  const lastFrameRef = useRef<number | null>(null);
  const spawnAccumRef = useRef(0);

  const resetAndStartGame = useCallback(
    (kind: GameKind = activeGame, lang: TypingLanguage = language, lvl: 1 | 2 | 3 = level) => {
      setActiveGame(kind);
      setScore(0);
      setStreak(0);
      setWordsCleared(0);
      setMistakes(0);
      setInputVal('');
      setFallingWords([]);
      spawnAccumRef.current = 0;
      lastFrameRef.current = null;

      if (kind === 'word-challenge') {
        setTimeLeft(45);
        setLives(5);
      } else if (kind === 'timed-challenge') {
        setTimeLeft(30);
        setLives(5);
      } else if (kind === 'falling-words') {
        setTimeLeft(60);
        setLives(5);
        setFallingWords([
          {
            id: nextIdRef.current++,
            word: pickRandomWord(lang, lvl),
            xPercent: 25,
            yPercent: 6,
            speedPerSec: 8 + lvl * 2.5,
          },
        ]);
      } else if (kind === 'accuracy-challenge') {
        setTimeLeft(90);
        setLives(3);
      }

      const w1 = pickRandomWord(lang, lvl);
      const w2 = pickRandomWord(lang, lvl, w1);
      setCurrentWord(w1);
      setNextWord(w2);
      setGameState('playing');

      window.setTimeout(() => inputRef.current?.focus(), 20);
    },
    [activeGame, language, level],
  );

  // Countdown timer for timed modes
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (activeGame === 'falling-words') return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [gameState, activeGame]);

  // Update best score on game over
  useEffect(() => {
    if (gameState === 'gameover') {
      setBestScore((prev) => Math.max(prev, score));
    }
  }, [gameState, score]);

  // 60fps clamped-dt loop for Falling Words
  useEffect(() => {
    if (gameState !== 'playing' || activeGame !== 'falling-words') return;
    let rafId = 0;

    const tick = (now: number) => {
      if (lastFrameRef.current === null) {
        lastFrameRef.current = now;
      }
      const rawDt = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      const dt = Math.min(rawDt, 0.05);

      spawnAccumRef.current += dt;
      const spawnInterval = Math.max(1.1, 2.5 - level * 0.45);

      setFallingWords((prev) => {
        let missedCount = 0;
        const moved = prev
          .map((item) => ({
            ...item,
            yPercent: item.yPercent + item.speedPerSec * dt,
          }))
          .filter((item) => {
            if (item.yPercent >= 90) {
              missedCount += 1;
              return false;
            }
            return true;
          });

        if (missedCount > 0) {
          setStreak(0);
          setMistakes((m) => m + missedCount);
          setLives((l) => {
            const nextL = Math.max(0, l - missedCount);
            if (nextL === 0) setGameState('gameover');
            return nextL;
          });
        }

        if (spawnAccumRef.current >= spawnInterval && moved.length < 6) {
          spawnAccumRef.current = 0;
          moved.push({
            id: nextIdRef.current++,
            word: pickRandomWord(language, level),
            xPercent: 12 + Math.floor(Math.random() * 72),
            yPercent: 4,
            speedPerSec: 8 + level * 2.5 + Math.min(6, wordsCleared * 0.2),
          });
        }

        return moved;
      });

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
      lastFrameRef.current = null;
    };
  }, [gameState, activeGame, language, level, wordsCleared]);

  const handleGameInput = (val: string) => {
    if (gameState !== 'playing') return;
    const trimmed = val.trim();

    if (activeGame === 'falling-words') {
      setInputVal(val);
      const match = fallingWords.find((fw) => fw.word === trimmed);
      if (match) {
        setFallingWords((prev) => prev.filter((fw) => fw.id !== match.id));
        setInputVal('');
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setWordsCleared((c) => c + 1);
        setScore((s) => s + 10 * level + Math.min(20, nextStreak * 2));
      }
      return;
    }

    // Word Challenge, Timed Challenge, Accuracy Challenge
    if (val.endsWith(' ') || trimmed === currentWord) {
      if (trimmed === currentWord) {
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        setWordsCleared((c) => {
          const nextCleared = c + 1;
          if (activeGame === 'accuracy-challenge' && nextCleared >= 20) {
            setGameState('gameover');
          }
          return nextCleared;
        });
        setScore((s) => s + 10 * level + Math.min(25, nextStreak * 2));
        if (activeGame === 'timed-challenge' && nextStreak % 5 === 0) {
          setTimeLeft((t) => t + 2);
        }
        const upcoming = pickRandomWord(language, level, nextWord);
        setCurrentWord(nextWord);
        setNextWord(upcoming);
        setInputVal('');
      } else if (val.endsWith(' ')) {
        setStreak(0);
        setMistakes((m) => m + 1);
        if (activeGame === 'accuracy-challenge') {
          setLives((l) => {
            const nextL = Math.max(0, l - 1);
            if (nextL === 0) setGameState('gameover');
            return nextL;
          });
        }
        setInputVal('');
      } else {
        setInputVal(val);
      }
    } else {
      setInputVal(val);
    }
  };

  const gamesCatalog: { id: GameKind; title: string; subtitle: string; icon: typeof Zap }[] = [
    {
      id: 'word-challenge',
      title: 'Word Typing Challenge',
      subtitle: '45s sprint · Clear words cleanly with streak bonuses',
      icon: Zap,
    },
    {
      id: 'falling-words',
      title: 'Falling Words Arcade',
      subtitle: 'Catch descending words before they hit the bottom',
      icon: Target,
    },
    {
      id: 'timed-challenge',
      title: 'Timed Burst (+2s Bonus)',
      subtitle: '30s clock · Every 5-word clean streak adds +2 seconds',
      icon: Timer,
    },
    {
      id: 'accuracy-challenge',
      title: 'Precision 20 Challenge',
      subtitle: 'Clear 20 words with only 3 mistake hearts',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Game Selector Tabs */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {gamesCatalog.map((g) => {
          const Icon = g.icon;
          const isActive = activeGame === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                setActiveGame(g.id);
                setGameState('ready');
              }}
              className={`rounded-xl border p-4 text-left transition-colors ${
                isActive
                  ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40'
                  : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span>{g.title}</span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {g.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Playable Game Stage */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        {/* Game Settings & HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-950">
              {(['en', 'hi'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLanguage(lang);
                    if (gameState !== 'ready') {
                      resetAndStartGame(activeGame, lang, level);
                    } else {
                      setCurrentWord(pickRandomWord(lang, level));
                    }
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                    language === lang
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lang === 'en' ? 'English' : 'Hindi'}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-950">
              {([1, 2, 3] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setLevel(lvl);
                    if (gameState !== 'ready') {
                      resetAndStartGame(activeGame, language, lvl);
                    }
                  }}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold ${
                    level === lvl
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Level {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold tabular-nums">
            <span className="text-slate-600 dark:text-slate-300">
              Score: <strong className="font-mono text-blue-600 dark:text-blue-400">{score}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Streak: <strong className="font-mono text-emerald-700 dark:text-emerald-400">{streak}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Cleared: <strong className="font-mono">{wordsCleared}</strong>
            </span>
            {(activeGame === 'falling-words' || activeGame === 'accuracy-challenge') ? (
              <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                <Heart className="h-4 w-4 fill-current" />
                <span className="font-mono">{lives}</span>
              </span>
            ) : (
              <span className="text-slate-600 dark:text-slate-300">
                Time: <strong className="font-mono">{timeLeft}s</strong>
              </span>
            )}
          </div>
        </div>

        {/* Game Arena */}
        <div className="mt-5">
          {gameState === 'ready' && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-950">
              <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {gamesCatalog.find((g) => g.id === activeGame)?.title}
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                {gamesCatalog.find((g) => g.id === activeGame)?.subtitle}. Type each highlighted word cleanly—press Space or complete the word to score.
              </p>
              <button
                type="button"
                data-testid="game-start-btn"
                onClick={() => resetAndStartGame()}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <Play className="h-4 w-4" />
                Start Game
              </button>
            </div>
          )}

          {(gameState === 'playing' || gameState === 'paused') && (
            <div className="space-y-4">
              {activeGame === 'falling-words' ? (
                <div
                  data-testid="falling-words-arena"
                  className="relative h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950"
                >
                  {fallingWords.map((fw) => (
                    <div
                      key={fw.id}
                      style={{
                        left: `${fw.xPercent}%`,
                        top: `${fw.yPercent}%`,
                        transform: 'translate(-50%, 0)',
                      }}
                      className={`absolute rounded-lg border px-3 py-1.5 font-semibold shadow-xs ${
                        fw.word.startsWith(inputVal.trim()) && inputVal.trim().length > 0
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
                      } ${language === 'hi' ? 'font-typing-hi text-lg' : 'font-typing-en text-base'}`}
                    >
                      {fw.word}
                    </div>
                  ))}
                  {gameState === 'paused' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 text-lg font-bold text-white">
                      Paused
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {activeGame === 'accuracy-challenge'
                      ? `Word ${wordsCleared + 1} of 20`
                      : `Next word: ${nextWord}`}
                  </div>
                  <div
                    data-testid="game-current-word"
                    className={`mt-3 font-bold tracking-wide text-slate-900 dark:text-white ${
                      language === 'hi' ? 'font-typing-hi text-4xl' : 'font-typing-en text-4xl'
                    }`}
                  >
                    {currentWord}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <label htmlFor="game-word-input" className="sr-only">
                    Type the active word
                  </label>
                  <input
                    ref={inputRef}
                    id="game-word-input"
                    data-testid="game-input"
                    type="text"
                    disabled={gameState === 'paused'}
                    value={inputVal}
                    onChange={(e) => handleGameInput(e.target.value)}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="Type word here..."
                    className={`h-12 w-full rounded-xl border-2 border-slate-300 bg-white px-4 text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white ${
                      language === 'hi' ? 'font-typing-hi text-lg' : 'font-typing-en text-base'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setGameState((s) => (s === 'paused' ? 'playing' : 'paused'))
                    }
                    className="inline-flex h-12 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    {gameState === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    {gameState === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                  <button
                    type="button"
                    onClick={() => resetAndStartGame()}
                    className="inline-flex h-12 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart
                  </button>
                </div>
              </div>
            </div>
          )}

          {gameState === 'gameover' && (
            <div
              data-testid="game-over-panel"
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-6 py-10 text-center dark:border-slate-800 dark:bg-slate-950"
            >
              <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                {activeGame === 'accuracy-challenge' && wordsCleared >= 20
                  ? 'Precision Challenge Complete!'
                  : 'Game Round Finished'}
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Final Score</div>
                  <div className="font-mono text-2xl font-bold text-blue-600 tabular-nums dark:text-blue-400">
                    {score}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Session Best</div>
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
                    {Math.max(bestScore, score)}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Words Cleared</div>
                  <div className="font-mono text-2xl font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                    {wordsCleared}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Mistakes</div>
                  <div className="font-mono text-2xl font-bold text-red-600 tabular-nums dark:text-red-400">
                    {mistakes}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => resetAndStartGame()}
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                <RotateCcw className="h-4 w-4" />
                Play Again
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
