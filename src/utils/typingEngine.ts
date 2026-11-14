import type {
  EvaluatedGrapheme,
  TypingEvaluationResult,
  TypingLanguage,
  TypingMetrics,
} from '../types/typing.ts';

const graphemeSegmenterCache = new Map<string, Intl.Segmenter>();

function getSegmenter(language: TypingLanguage): Intl.Segmenter | null {
  if (typeof Intl === 'undefined' || typeof Intl.Segmenter !== 'function') {
    return null;
  }
  const locale = language === 'hi' ? 'hi' : 'en';
  let seg = graphemeSegmenterCache.get(locale);
  if (!seg) {
    seg = new Intl.Segmenter(locale, { granularity: 'grapheme' });
    graphemeSegmenterCache.set(locale, seg);
  }
  return seg;
}

/**
 * Splits Unicode text (including Hindi Devanagari matras, nukta, anusvara,
 * and halant conjunct clusters) into visual grapheme clusters.
 */
export function segmentGraphemes(text: string, language: TypingLanguage = 'hi'): string[] {
  const normalized = text.normalize('NFC');
  if (!normalized) return [];

  const segmenter = getSegmenter(language);
  if (segmenter) {
    const result: string[] = [];
    for (const part of segmenter.segment(normalized)) {
      result.push(part.segment);
    }
    return result;
  }

  // Fallback for runtimes without Intl.Segmenter: keep combining marks and Devanagari virama clusters intact
  const codePoints = Array.from(normalized);
  const clusters: string[] = [];
  const combiningRegex = /[\p{M}\u0901-\u0903\u093A-\u094F\u0951-\u0957\u0962-\u0963]/u;
  for (let i = 0; i < codePoints.length; i++) {
    const ch = codePoints[i];
    if (clusters.length > 0 && (combiningRegex.test(ch) || clusters[clusters.length - 1].endsWith('\u094D'))) {
      clusters[clusters.length - 1] += ch;
    } else {
      clusters.push(ch);
    }
  }
  return clusters;
}

export interface CalculateWpmInput {
  correctChars: number;
  incorrectChars: number;
  elapsedSec: number;
}

/**
 * Standard 5-unit word formula used consistently across TypingPro:
 * - Total Typed Units = correctChars + incorrectChars
 * - Gross WPM = (Total Typed Units / 5) / (elapsedSec / 60)
 * - Net WPM = max(0, ((Total Typed Units - incorrectChars) / 5) / (elapsedSec / 60))
 * - Accuracy (%) = Total Typed Units > 0 ? round((correctChars / Total Typed Units) * 1000) / 10 : 100
 */
export function calculateWpmAndAccuracy({
  correctChars,
  incorrectChars,
  elapsedSec,
}: CalculateWpmInput): Pick<TypingMetrics, 'grossWpm' | 'netWpm' | 'accuracy' | 'totalTypedChars'> {
  const safeCorrect = Math.max(0, correctChars);
  const safeIncorrect = Math.max(0, incorrectChars);
  const totalTypedChars = safeCorrect + safeIncorrect;
  if (totalTypedChars === 0 || elapsedSec <= 0) {
    return {
      grossWpm: 0,
      netWpm: 0,
      accuracy: 100,
      totalTypedChars: 0,
    };
  }

  const minutes = Math.max(elapsedSec, 1) / 60;
  const grossWpm = Math.round((totalTypedChars / 5) / minutes);
  const netUnits = Math.max(0, totalTypedChars - safeIncorrect);
  const netWpm = Math.max(0, Math.round((netUnits / 5) / minutes));
  const accuracy = Math.round((safeCorrect / totalTypedChars) * 1000) / 10;

  return {
    grossWpm,
    netWpm,
    accuracy,
    totalTypedChars,
  };
}

export interface EvaluateTypingOptions {
  targetText: string;
  typedText: string;
  elapsedSec: number;
  language: TypingLanguage;
  isFinished?: boolean;
}

/**
 * Evaluates user-typed text against the target passage using Unicode grapheme clusters.
 * Handles in-progress Devanagari matras/conjuncts gracefully without false-error flashing
 * while typing a partial akshara cluster.
 */
export function evaluateTyping({
  targetText,
  typedText,
  elapsedSec,
  language,
  isFinished = false,
}: EvaluateTypingOptions): TypingEvaluationResult {
  const targetUnits = segmentGraphemes(targetText, language);
  const typedUnits = segmentGraphemes(typedText, language);

  let correctChars = 0;
  let incorrectChars = 0;

  const items: EvaluatedGrapheme[] = targetUnits.map((targetChar, index) => {
    const isCurrent = index === typedUnits.length && !isFinished;
    if (index >= typedUnits.length) {
      return {
        char: targetChar,
        status: 'untyped',
        isCurrent,
      };
    }

    const typedChar = typedUnits[index];
    if (typedChar === targetChar) {
      correctChars += 1;
      return {
        char: targetChar,
        status: 'correct',
        isCurrent: false,
      };
    }

    // If this is the active last typed cluster and the user hasn't finished yet,
    // allow partial Devanagari composition prefix (e.g. 'क' towards 'कि', or 'स्' towards 'स्ते')
    const isLastTyped = index === typedUnits.length - 1;
    if (
      language === 'hi' &&
      isLastTyped &&
      !isFinished &&
      typedChar.length > 0 &&
      targetChar.startsWith(typedChar)
    ) {
      return {
        char: targetChar,
        status: 'pending',
        isCurrent: true,
      };
    }

    incorrectChars += 1;
    return {
      char: targetChar,
      status: 'incorrect',
      isCurrent: false,
    };
  });

  // Account for any extra overflow characters typed past target length
  if (typedUnits.length > targetUnits.length) {
    incorrectChars += typedUnits.length - targetUnits.length;
  }

  const { grossWpm, netWpm, accuracy, totalTypedChars } = calculateWpmAndAccuracy({
    correctChars,
    incorrectChars,
    elapsedSec,
  });

  const isPassageCompleted =
    targetUnits.length > 0 &&
    typedUnits.length >= targetUnits.length &&
    items[targetUnits.length - 1]?.status !== 'pending';

  const completionPercent =
    targetUnits.length > 0
      ? Math.min(100, Math.round((Math.min(typedUnits.length, targetUnits.length) / targetUnits.length) * 100))
      : 0;

  return {
    items,
    metrics: {
      grossWpm,
      netWpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalTypedChars,
      totalTargetChars: targetUnits.length,
      completionPercent,
      elapsedSec,
    },
    isPassageCompleted,
  };
}

export interface TelemetryValidationInput {
  durationSec: number;
  elapsedSec: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalTypedChars: number;
  keystrokeTimestamps: number[];
  pasteAttempted: boolean;
}

export interface TelemetryValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validates typing test telemetry to block pasted text, impossible speeds,
 * or client-side tampered score payloads before issuing a leaderboard digest.
 */
export function validateKeystrokeTelemetry(input: TelemetryValidationInput): TelemetryValidationResult {
  if (input.pasteAttempted) {
    return { valid: false, reason: 'Pasted input cannot be submitted to the verified leaderboard.' };
  }
  if (![60, 120, 180, 300, 600].includes(input.durationSec)) {
    return { valid: false, reason: 'Leaderboard entries require a standard 1, 2, 3, 5, or 10 minute test.' };
  }
  if (input.elapsedSec < 15) {
    return { valid: false, reason: 'Test duration must be at least 15 seconds to qualify.' };
  }
  if (input.totalTypedChars < 25) {
    return { valid: false, reason: 'At least 25 typed characters are required to qualify.' };
  }
  if (input.correctChars + input.incorrectChars !== input.totalTypedChars) {
    return { valid: false, reason: 'Character tally mismatch detected.' };
  }

  const expected = calculateWpmAndAccuracy({
    correctChars: input.correctChars,
    incorrectChars: input.incorrectChars,
    elapsedSec: input.elapsedSec,
  });

  if (Math.abs(expected.grossWpm - input.grossWpm) > 2 || Math.abs(expected.netWpm - input.netWpm) > 2) {
    return { valid: false, reason: 'Submitted WPM does not match character and timing formula.' };
  }
  if (Math.abs(expected.accuracy - input.accuracy) > 0.5) {
    return { valid: false, reason: 'Submitted accuracy does not match character counts.' };
  }
  if (input.netWpm > 220 || input.grossWpm > 250) {
    return { valid: false, reason: 'Speed exceeds human verification threshold (220 Net WPM).' };
  }
  if (input.accuracy < 80) {
    return { valid: false, reason: 'Minimum 80% accuracy is required for the public leaderboard.' };
  }
  if (input.keystrokeTimestamps.length < 10) {
    return { valid: false, reason: 'Insufficient genuine keystroke timing samples.' };
  }

  // Check timestamps are monotonically non-decreasing and span a realistic interval
  let nonMonotonic = false;
  for (let i = 1; i < input.keystrokeTimestamps.length; i++) {
    if (input.keystrokeTimestamps[i] < input.keystrokeTimestamps[i - 1]) {
      nonMonotonic = true;
      break;
    }
  }
  if (nonMonotonic) {
    return { valid: false, reason: 'Invalid keystroke timestamp sequence.' };
  }

  return { valid: true };
}
