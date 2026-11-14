import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LESSONS } from '../data/passages.ts';
import type { LessonItem } from '../types/typing.ts';
import { evaluateTyping } from '../utils/typingEngine.ts';

const FINGER_ROWS = [
  [
    { key: 'Q', finger: 'Left Pinky', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800' },
    { key: 'W', finger: 'Left Ring', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800' },
    { key: 'E', finger: 'Left Middle', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800' },
    { key: 'R', finger: 'Left Index', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800' },
    { key: 'T', finger: 'Left Index', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800' },
    { key: 'Y', finger: 'Right Index', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-800' },
    { key: 'U', finger: 'Right Index', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-800' },
    { key: 'I', finger: 'Right Middle', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800' },
    { key: 'O', finger: 'Right Ring', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800' },
    { key: 'P', finger: 'Right Pinky', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800' },
  ],
  [
    { key: 'A', finger: 'Left Pinky', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800' },
    { key: 'S', finger: 'Left Ring', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800' },
    { key: 'D', finger: 'Left Middle', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800' },
    { key: 'F (bump)', finger: 'Left Index Anchor', color: 'bg-sky-200 text-sky-950 border-sky-500 dark:bg-sky-900 dark:text-sky-100 dark:border-sky-500' },
    { key: 'G', finger: 'Left Index', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800' },
    { key: 'H', finger: 'Right Index', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-800' },
    { key: 'J (bump)', finger: 'Right Index Anchor', color: 'bg-indigo-200 text-indigo-950 border-indigo-500 dark:bg-indigo-900 dark:text-indigo-100 dark:border-indigo-500' },
    { key: 'K', finger: 'Right Middle', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800' },
    { key: 'L', finger: 'Right Ring', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800' },
    { key: ';', finger: 'Right Pinky', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800' },
  ],
  [
    { key: 'Z', finger: 'Left Pinky', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800' },
    { key: 'X', finger: 'Left Ring', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800' },
    { key: 'C', finger: 'Left Middle', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800' },
    { key: 'V', finger: 'Left Index', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800' },
    { key: 'B', finger: 'Left Index', color: 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800' },
    { key: 'N', finger: 'Right Index', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-800' },
    { key: 'M', finger: 'Right Index', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-800' },
    { key: ',', finger: 'Right Middle', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800' },
    { key: '.', finger: 'Right Ring', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800' },
    { key: '/', finger: 'Right Pinky', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800' },
  ],
];

export function TypingLessonsView() {
  const [filterLang, setFilterLang] = useState<'all' | 'en' | 'hi'>('all');
  const [selectedLesson, setSelectedLesson] = useState<LessonItem>(LESSONS[0]);
  const [typedText, setTypedText] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [selectedKeyInfo, setSelectedKeyInfo] = useState<string>('F (bump) -> Left Index Anchor');

  const filteredLessons = useMemo(() => {
    if (filterLang === 'all') return LESSONS;
    return LESSONS.filter((l) => l.language === filterLang);
  }, [filterLang]);

  const elapsedSec = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 1;
  const evalResult = useMemo(
    () =>
      evaluateTyping({
        targetText: selectedLesson.drillText,
        typedText,
        elapsedSec,
        language: selectedLesson.language,
        isFinished: false,
      }),
    [selectedLesson, typedText, elapsedSec],
  );

  const selectLesson = (lesson: LessonItem) => {
    setSelectedLesson(lesson);
    setTypedText('');
    setStartedAt(null);
  };

  const handleDrillInput = (val: string) => {
    if (!startedAt && val.length > 0) {
      setStartedAt(Date.now());
    }
    setTypedText(val);
    const check = evaluateTyping({
      targetText: selectedLesson.drillText,
      typedText: val,
      elapsedSec,
      language: selectedLesson.language,
      isFinished: true,
    });
    if (check.isPassageCompleted && !completedIds.includes(selectedLesson.id)) {
      setCompletedIds((prev) => [...prev, selectedLesson.id]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Finger Placement Guide */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Interactive QWERTY Finger Placement Map
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Click any key below to inspect its assigned finger. Keep index fingers anchored on F and J.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            {selectedKeyInfo}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto pb-2">
          <div className="min-w-[540px] space-y-2">
            {FINGER_ROWS.map((row, rowIdx) => (
              <div
                key={rowIdx}
                className="grid grid-cols-10 gap-1.5"
                style={{ paddingLeft: `${rowIdx * 16}px` }}
              >
                {row.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedKeyInfo(`${item.key} -> ${item.finger}`)}
                    className={`flex min-h-[44px] flex-col items-center justify-center rounded-lg border px-1 py-1 text-xs font-semibold transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${item.color}`}
                  >
                    <span>{item.key.replace(' (bump)', '')}</span>
                    {item.key.includes('bump') && <span className="text-[10px] opacity-75">anchor</span>}
                  </button>
                ))}
              </div>
            ))}
            <div className="mx-auto mt-2 max-w-xs">
              <button
                type="button"
                onClick={() => setSelectedKeyInfo('Spacebar -> Either Thumb')}
                className="flex h-10 w-full items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Spacebar (Thumbs)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum + Interactive Lesson Stage */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Structured Lessons
            </h2>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-950">
              {(['all', 'en', 'hi'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setFilterLang(lang)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    filterLang === lang
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lang === 'all' ? 'All' : lang === 'en' ? 'English' : 'Hindi'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filteredLessons.map((lesson) => {
              const isSelected = selectedLesson.id === lesson.id;
              const isDone = completedIds.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => selectLesson(lesson)}
                  className={`w-full rounded-xl border p-3.5 text-left transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:border-blue-500 dark:bg-blue-950/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Lesson {lesson.number} · {lesson.level} ·{' '}
                      {lesson.language === 'hi' ? 'Hindi' : 'English'}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Done
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-slate-900 dark:text-white">
                    {lesson.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Lesson Practice Area */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Lesson {selectedLesson.number} · {selectedLesson.level} · Focus Keys:{' '}
                  {selectedLesson.focusKeys.join(' ')}
                </div>
                <h3 className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">
                  {selectedLesson.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTypedText('');
                  setStartedAt(null);
                }}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Drill
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {selectedLesson.description}
            </p>

            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <strong className="font-semibold text-slate-900 dark:text-white">
                Finger Placement:
              </strong>{' '}
              {selectedLesson.fingerNote}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-xs text-slate-500 dark:text-slate-400">Progress</div>
                <div className="font-mono text-lg font-bold text-slate-900 tabular-nums dark:text-white">
                  {evalResult.metrics.completionPercent}%
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-xs text-slate-500 dark:text-slate-400">Accuracy</div>
                <div className="font-mono text-lg font-bold text-emerald-700 tabular-nums dark:text-emerald-400">
                  {evalResult.metrics.accuracy}%
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
                <div className="text-xs text-slate-500 dark:text-slate-400">Net WPM</div>
                <div className="font-mono text-lg font-bold text-blue-600 tabular-nums dark:text-blue-400">
                  {evalResult.metrics.netWpm}
                </div>
              </div>
            </div>

            <div
              className={`mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 leading-relaxed dark:border-slate-800 dark:bg-slate-950 ${
                selectedLesson.language === 'hi'
                  ? 'font-typing-hi text-xl leading-[1.9]'
                  : 'font-typing-en text-lg leading-[1.8]'
              }`}
            >
              {evalResult.items.map((item, idx) => (
                <span
                  key={idx}
                  className={
                    item.status === 'correct'
                      ? 'bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : item.status === 'incorrect'
                        ? 'bg-red-100 text-red-800 underline decoration-red-600 decoration-2 dark:bg-red-950/60 dark:text-red-300'
                        : item.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200'
                          : item.isCurrent
                            ? 'bg-blue-600/15 text-blue-950 ring-2 ring-blue-600 dark:bg-blue-500/25 dark:text-blue-100'
                            : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  {item.char}
                </span>
              ))}
            </div>

            <div className="mt-4">
              <label
                htmlFor="lesson-drill-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Type the lesson drill below
              </label>
              <textarea
                id="lesson-drill-input"
                rows={2}
                value={typedText}
                onChange={(e) => handleDrillInput(e.target.value)}
                onPaste={(e) => e.preventDefault()}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder={
                  selectedLesson.language === 'hi'
                    ? 'पाठ अभ्यास यहाँ टाइप करें...'
                    : 'Type the lesson drill here...'
                }
                className={`mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white p-3 text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white ${
                  selectedLesson.language === 'hi' ? 'font-typing-hi text-lg' : 'font-typing-en text-base'
                }`}
              />
            </div>

            {evalResult.isPassageCompleted && (
              <div
                role="status"
                className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-200"
              >
                <span>
                  Lesson drill completed with {evalResult.metrics.accuracy}% accuracy at{' '}
                  {evalResult.metrics.netWpm} Net WPM.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const idx = LESSONS.findIndex((l) => l.id === selectedLesson.id);
                    const next = LESSONS[(idx + 1) % LESSONS.length];
                    selectLesson(next);
                  }}
                  className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
                >
                  Next Lesson
                </button>
              </div>
            )}

            <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <strong className="font-semibold text-slate-700 dark:text-slate-300">
                Common Mistake Fix:
              </strong>{' '}
              {selectedLesson.commonMistakeTip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
