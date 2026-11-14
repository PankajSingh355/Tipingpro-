import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWpmAndAccuracy,
  evaluateTyping,
  segmentGraphemes,
  validateKeystrokeTelemetry,
} from './typingEngine.ts';

test('English WPM & accuracy: 250 correct chars in 60s equals 50 gross/net WPM and 100% accuracy', () => {
  const result = calculateWpmAndAccuracy({
    correctChars: 250,
    incorrectChars: 0,
    elapsedSec: 60,
  });
  assert.equal(result.grossWpm, 50);
  assert.equal(result.netWpm, 50);
  assert.equal(result.accuracy, 100);
  assert.equal(result.totalTypedChars, 250);
});

test('English WPM & accuracy: 225 correct and 25 incorrect in 60s equals 50 gross WPM, 45 net WPM, 90% accuracy', () => {
  const result = calculateWpmAndAccuracy({
    correctChars: 225,
    incorrectChars: 25,
    elapsedSec: 60,
  });
  assert.equal(result.grossWpm, 50);
  assert.equal(result.netWpm, 45);
  assert.equal(result.accuracy, 90);
});

test('Hindi Devanagari grapheme segmentation keeps matras and conjuncts intact', () => {
  const clusters = segmentGraphemes('किताब नमस्ते', 'hi');
  assert.equal(clusters[0], 'कि');
  assert.equal(clusters[1], 'ता');
  assert.equal(clusters[2], 'ब');
  assert.equal(clusters[3], ' ');
  assert.equal(clusters[4], 'न');
  assert.equal(clusters[5], 'म');
  assert.equal(clusters[6], 'स्ते');
  assert.equal(clusters.length, 7);
});

test('Hindi typing evaluation does not mark partial matra/conjunct prefix as incorrect mid-typing', () => {
  const partial = evaluateTyping({
    targetText: 'किताब',
    typedText: 'क',
    elapsedSec: 5,
    language: 'hi',
    isFinished: false,
  });
  assert.equal(partial.items[0].status, 'pending');
  assert.equal(partial.metrics.incorrectChars, 0);

  const completed = evaluateTyping({
    targetText: 'किताब',
    typedText: 'किताब',
    elapsedSec: 10,
    language: 'hi',
    isFinished: true,
  });
  assert.equal(completed.items[0].status, 'correct');
  assert.equal(completed.metrics.accuracy, 100);
  assert.equal(completed.isPassageCompleted, true);
});

test('Hindi wrong matra marks cluster incorrect', () => {
  const wrongMatra = evaluateTyping({
    targetText: 'किताब',
    typedText: 'कीता',
    elapsedSec: 10,
    language: 'hi',
    isFinished: false,
  });
  assert.equal(wrongMatra.items[0].status, 'incorrect');
  assert.equal(wrongMatra.items[1].status, 'correct');
});

test('Telemetry validation rejects pasted text and tampered WPM', () => {
  const validTimestamps = Array.from({ length: 20 }, (_, i) => 1000 + i * 250);
  const pasted = validateKeystrokeTelemetry({
    durationSec: 60,
    elapsedSec: 60,
    grossWpm: 50,
    netWpm: 50,
    accuracy: 100,
    correctChars: 250,
    incorrectChars: 0,
    totalTypedChars: 250,
    keystrokeTimestamps: validTimestamps,
    pasteAttempted: true,
  });
  assert.equal(pasted.valid, false);

  const tampered = validateKeystrokeTelemetry({
    durationSec: 60,
    elapsedSec: 60,
    grossWpm: 190,
    netWpm: 190,
    accuracy: 100,
    correctChars: 250,
    incorrectChars: 0,
    totalTypedChars: 250,
    keystrokeTimestamps: validTimestamps,
    pasteAttempted: false,
  });
  assert.equal(tampered.valid, false);

  const legitimate = validateKeystrokeTelemetry({
    durationSec: 60,
    elapsedSec: 60,
    grossWpm: 50,
    netWpm: 50,
    accuracy: 100,
    correctChars: 250,
    incorrectChars: 0,
    totalTypedChars: 250,
    keystrokeTimestamps: validTimestamps,
    pasteAttempted: false,
  });
  assert.equal(legitimate.valid, true);
});
