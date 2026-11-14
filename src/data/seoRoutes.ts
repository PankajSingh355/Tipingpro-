import type { SeoRouteDefinition } from '../types/typing.ts';

export const SEO_ROUTES: SeoRouteDefinition[] = [
  {
    path: '/',
    title: 'TypingPro – Free Online English & Hindi Typing Speed Test',
    description:
      'Improve your typing speed and accuracy with TypingPro. Take free 1, 2, 3, 5, and 10-minute English and Hindi Devanagari typing tests, lessons, and games.',
    h1: 'Improve Your Typing Speed and Accuracy with TypingPro',
    subtitle:
      'Practice English and Unicode Hindi Devanagari typing with accurate WPM scoring, guided touch-typing lessons, interactive games, and personal progress tracking.',
    breadcrumbLabel: 'Home',
    widget: 'home',
    defaultLanguage: 'en',
    defaultDurationSec: 60,
    defaultDifficulty: 'intermediate',
    defaultPassageCategory: 'general',
    schemaType: 'WebApplication',
    sections: [],
    faqs: [
      {
        question: 'How does TypingPro calculate Gross WPM and Net WPM?',
        answer:
          'TypingPro uses the standard 5-character word unit. Gross WPM equals (total typed characters divided by 5) divided by elapsed minutes. Net WPM subtracts incorrect characters from total typed characters before dividing by 5 and elapsed minutes, ensuring accuracy counts directly toward your score.',
      },
      {
        question: 'Can I take both English and Hindi typing tests without creating an account?',
        answer:
          'Yes. Guest visitors have full access to 1, 2, 3, 5, and 10-minute typing tests, beginner lessons, custom text practice, and typing games in both English and Unicode Hindi. Signing in is optional and lets you save test history and view charts.',
      },
      {
        question: 'Does TypingPro support Hindi matras and conjunct characters?',
        answer:
          'Yes. TypingPro uses Unicode-aware grapheme cluster segmentation (Intl.Segmenter) so Devanagari base consonants, vowel matras, anusvara, and halant conjuncts are evaluated as proper visual characters without splitting mid-syllable.',
      },
      {
        question: 'Are the SSC and CPCT practice tests officially affiliated with government boards?',
        answer:
          'No. TypingPro is an independent practice and learning platform. Our SSC and CPCT practice pages use timed passages and 5-character keystroke accounting designed for self-study preparation only.',
      },
    ],
    relatedLinks: [
      { label: 'Free Typing Test', href: '/typing-test/', description: 'Launch the full customizable test workspace' },
      { label: 'Hindi Typing Test', href: '/hindi-typing-test/', description: 'Unicode Devanagari timed typing tests' },
      { label: 'Touch Typing Lessons', href: '/typing-lessons/', description: 'Step-by-step home row and finger placement' },
      { label: 'Typing Games', href: '/typing-games/', description: 'Build reflexes with 4 playable keyboard games' },
    ],
  },
  {
    path: '/typing-test/',
    title: 'Typing Test – Free Online WPM & Accuracy Check | TypingPro',
    description:
      'Take a free online typing test in English or Hindi. Measure Gross WPM, Net WPM, accuracy percentage, and keystrokes across 1 to 10 minute timers.',
    h1: 'Online Typing Test for Speed and Accuracy',
    subtitle:
      'Choose English or Unicode Hindi, select your difficulty and timer length, and measure your real-time Net WPM and accuracy.',
    breadcrumbLabel: 'Typing Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 60,
    defaultDifficulty: 'intermediate',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'What a Reliable Typing Test Measures',
        paragraphs: [
          'A dependable typing test tracks more than raw keystrokes per second. TypingPro records correct characters, uncorrected mistakes, Gross WPM, Net WPM, and overall accuracy percentage while blocking pasted text so your benchmark reflects genuine keyboard fluency.',
          'You can switch passages anytime, pick beginner, intermediate, or advanced prose, and save completed sessions to your optional account dashboard to track improvement over weeks.',
        ],
      },
      {
        heading: 'How to Benchmark Your Current Level',
        paragraphs: [
          'Start with a 1-minute warm-up to settle into rhythm, then complete a 3-minute or 5-minute test for a realistic everyday baseline.',
        ],
        bullets: [
          '25–35 WPM: Developing beginner pace suitable for basic notes.',
          '40–55 WPM: Comfortable everyday productivity and academic fluency.',
          '60–80+ WPM: High-proficiency professional and competitive typing pace.',
        ],
      },
    ],
    examples: [
      {
        title: 'Example WPM Calculation',
        sample: '250 typed characters in 60 seconds with 10 mistakes -> Gross: 50 WPM | Net: 48 WPM | Accuracy: 96.0%',
        note: 'One standard word equals 5 characters including spaces.',
      },
    ],
    faqs: [
      {
        question: 'When does the typing test countdown timer begin?',
        answer: 'The timer starts automatically on your very first keystroke in the typing box, or when you press the Start button.',
      },
      {
        question: 'Why does TypingPro block copy and paste inside the test box?',
        answer: 'Blocking pasted input keeps your Net WPM, saved dashboard history, and personal practice reports accurate and fair.',
      },
      {
        question: 'Can I retake a test with a fresh passage?',
        answer: 'Yes. Use the New Passage button before or after any test to load a different paragraph in your selected language and difficulty.',
      },
    ],
    relatedLinks: [
      { label: '1-Minute Typing Speed Test', href: '/typing-speed-test-1-minute/', description: 'Quick 60-second speed check' },
      { label: '5-Minute Typing Test', href: '/typing-speed-test-5-minute/', description: 'Endurance and consistency check' },
      { label: 'Hindi Typing Test', href: '/hindi-typing-test/', description: 'Switch to Devanagari Unicode testing' },
    ],
  },
  {
    path: '/typing-speed-test/',
    title: 'Typing Speed Test – Check Your Words Per Minute | TypingPro',
    description:
      'Test your typing speed in WPM with real-time error highlighting, net speed calculation, and detailed post-test breakdown on TypingPro.',
    h1: 'Typing Speed Test — Check Your Real WPM',
    subtitle:
      'Measure how many words per minute you type cleanly under a live countdown timer with instant Net WPM and accuracy analytics.',
    breadcrumbLabel: 'Typing Speed Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 120,
    defaultDifficulty: 'intermediate',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Gross Speed vs. Net Speed Explained',
        paragraphs: [
          'Gross WPM counts every character you type divided by five per minute, regardless of errors. Net WPM deducts your error count from that total so reckless speed does not inflate your score.',
          'Employers and typing assessments evaluate Net WPM alongside minimum accuracy thresholds (usually 90% to 95%). Focusing on clean rhythm raises both metrics together.',
        ],
      },
      {
        heading: 'Three Habits That Immediately Lift Speed',
        paragraphs: [
          'Even before memorizing every symbol, fixing posture and gaze brings measurable gains within a week.',
        ],
        bullets: [
          'Keep your eyes on the prompt rather than looking down at your hands.',
          'Use both Shift keys with the opposite pinky for capital letters.',
          'Avoid hammering Backspace after every small slip if it breaks your cadence—correct cleanly or keep steady tempo.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is considered a good typing speed?',
        answer: 'An average office typist types around 40 WPM. Reaching 55 to 70 WPM with 95%+ accuracy puts you well ahead for writing, coding, and administrative work.',
      },
      {
        question: 'Which duration should I choose for a speed test?',
        answer: 'Use 1-minute tests for quick warm-ups and 3 or 5-minute tests to measure sustained speed without fatigue.',
      },
    ],
    relatedLinks: [
      { label: 'Typing Speed Tips', href: '/typing-tips/', description: 'Actionable techniques to break speed plateaus' },
      { label: 'Typing Practice Drills', href: '/typing-practice/', description: 'Target accuracy and custom text drills' },
      { label: '3-Minute Speed Test', href: '/typing-speed-test-3-minute/', description: 'Balanced 3-minute speed benchmark' },
    ],
  },
  {
    path: '/free-typing-test/',
    title: 'Free Typing Test Online – No Signup Required | TypingPro',
    description:
      'Take a 100% free online typing test with no registration required. Practice English and Hindi typing, view instant WPM results, and download a practice report.',
    h1: 'Free Online Typing Test — Start Immediately',
    subtitle:
      'No paywalls, no intrusive popups, and no required signup. Test your English or Hindi typing speed right in your browser.',
    breadcrumbLabel: 'Free Typing Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 60,
    defaultDifficulty: 'beginner',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Everything Included Free for Learners',
        paragraphs: [
          'TypingPro gives every visitor unrestricted access to timed typing tests, beginner touch-typing lessons, custom text practice, and four keyboard games. Optional accounts exist solely if you want cloud history and progress charts across devices.',
        ],
        bullets: [
          'Full 1, 2, 3, 5, and 10-minute timers in English and Hindi Unicode.',
          'Instant post-test breakdown showing Gross WPM, Net WPM, Accuracy, and character counts.',
          'Downloadable Personal Practice Report for self-tracking.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypingPro really free without hidden limits?',
        answer: 'Yes. All typing tests, lessons, custom practice passages, and games work completely free without daily test caps.',
      },
      {
        question: 'Can I use this free typing test on mobile or tablet?',
        answer: 'Yes. The typing workspace includes a dedicated mobile-friendly input field that works smoothly with on-screen keyboards and external Bluetooth keyboards.',
      },
    ],
    relatedLinks: [
      { label: 'Beginner Typing Test', href: '/typing-test-for-beginners/', description: 'Gentle passages for first-time learners' },
      { label: 'Practice Report', href: '/typing-certificate/', description: 'Generate a printable summary of your result' },
      { label: 'Typing Games', href: '/typing-games/', description: 'Fun skill-building keyboard challenges' },
    ],
  },
  {
    path: '/online-typing-test/',
    title: 'Online Typing Test – Browser-Based English & Hindi Test | TypingPro',
    description:
      'Run an accurate online typing test directly in your web browser with zero downloads. Supports desktop, laptop, and mobile keyboards.',
    h1: 'Online Typing Test — Browser-Ready Precision',
    subtitle:
      'Zero software installation required. Open any device browser and start an accurate timed typing evaluation in seconds.',
    breadcrumbLabel: 'Online Typing Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 180,
    defaultDifficulty: 'intermediate',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Consistent Scoring Across Devices',
        paragraphs: [
          'Whether you are practicing on a Windows laptop, MacBook, Chromebook, or mobile tablet, TypingPro evaluates every keystroke locally with zero network lag affecting your timer. Your countdown runs accurately even on slower internet connections.',
        ],
      },
      {
        heading: 'Dark Mode & Accessibility Ready',
        paragraphs: [
          'Switch between crisp light mode and comfortable dark mode anytime from the top header. High-contrast indicators pair color with clear underlines and status labels so color-vision differences never obscure mistakes.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does internet speed affect my WPM measurement?',
        answer: 'No. All character comparison and timer ticks run locally in your browser so network latency never skews your WPM.',
      },
      {
        question: 'How do I save my online test history?',
        answer: 'Sign in with a free optional account to store completed sessions securely in Cloud Firestore and review charts on your Dashboard.',
      },
    ],
    relatedLinks: [
      { label: 'English Typing Test', href: '/english-typing-test/', description: 'Standard English passages and punctuation' },
      { label: 'Hindi Typing Test', href: '/hindi-typing-test/', description: 'Devanagari Unicode online test' },
      { label: '10-Minute Typing Test', href: '/typing-speed-test-10-minute/', description: 'Full endurance evaluation' },
    ],
  },
  {
    path: '/english-typing-test/',
    title: 'English Typing Test – Practice & Measure English WPM | TypingPro',
    description:
      'Take a free English typing test at beginner, intermediate, or advanced level. Track Net WPM, punctuation accuracy, and speed progress.',
    h1: 'English Typing Test — Speed & Punctuation Check',
    subtitle:
      'Practice real English sentences across beginner, intermediate, and advanced passages with full Shift, number, and punctuation evaluation.',
    breadcrumbLabel: 'English Typing Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 60,
    defaultDifficulty: 'intermediate',
    lockLanguage: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Progressive English Passages',
        paragraphs: [
          'Beginner English passages use clear everyday words with minimal punctuation so you can master the alphabet rows. Intermediate passages introduce common business and academic phrasing, while Advanced passages include parentheses, numbers, hyphens, and technical vocabulary.',
        ],
      },
    ],
    examples: [
      {
        title: 'Beginner vs. Advanced Focus',
        sample: 'Beginner: "Ten focused minutes of typing practice builds steady muscle memory." | Advanced: "Quarterly reviews (FY 2025-26) show an 18.5% gain."',
        note: 'Switch difficulty right above the passage box to match your current skill.',
      },
    ],
    faqs: [
      {
        question: 'Are capital letters and punctuation included in English typing accuracy?',
        answer: 'Yes. Every uppercase character, comma, apostrophe, and period is compared exactly against the passage.',
      },
      {
        question: 'Where can I practice English typing without a strict countdown?',
        answer: 'Visit our English Typing Practice page for untimed drills and custom text entry.',
      },
    ],
    relatedLinks: [
      { label: 'English Typing Practice', href: '/english-typing-practice/', description: 'Guided and custom English practice' },
      { label: 'Touch Typing Lessons', href: '/typing-lessons/', description: 'Learn QWERTY finger placement' },
      { label: 'SSC Typing Test', href: '/typing-test-for-ssc/', description: 'Formal administrative English drills' },
    ],
  },
  {
    path: '/hindi-typing-test/',
    title: 'Hindi Typing Test (हिंदी टाइपिंग टेस्ट) – Unicode Devanagari | TypingPro',
    description:
      'Free online Hindi typing test using Unicode Devanagari. Accurate matra and conjunct evaluation across 1, 2, 3, 5, and 10-minute timers.',
    h1: 'Hindi Typing Test (हिंदी टाइपिंग टेस्ट)',
    subtitle:
      'Unicode Devanagari typing speed test with grapheme-aware evaluation for matras, anusvara, and half-letter conjuncts.',
    breadcrumbLabel: 'Hindi Typing Test',
    widget: 'typing-test',
    defaultLanguage: 'hi',
    defaultDurationSec: 300,
    defaultDifficulty: 'intermediate',
    lockLanguage: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'How TypingPro Evaluates Hindi Unicode Accurately',
        paragraphs: [
          'Many generic typing tools split Devanagari strings into raw UTF-16 code units, causing false error flashes while you type a vowel matra or halant conjunct. TypingPro uses Unicode grapheme cluster segmentation (Intl.Segmenter) so characters like "कि", "स्ते", and "प्र" are treated as complete visual aksharas.',
        ],
      },
      {
        heading: 'Supported Keyboard & Input Methods',
        paragraphs: [
          'TypingPro works with your operating system Unicode Hindi keyboard—including Windows Hindi Traditional (Inscript), Windows Hindi Phonetic, macOS Devanagari QWERTY/Inscript, and mobile Hindi keyboards (Gboard).',
          'Note: TypingPro evaluates standard Unicode Devanagari text. Legacy non-Unicode font encodings (such as Kruti Dev 010 ASCII mapping) are not emulated unless your system outputs Unicode.',
        ],
      },
    ],
    examples: [
      {
        title: 'Unicode Typing Order Example',
        sample: 'किताब = क + ि + त + ा + ब  |  प्रयास = प + ् + र + य + ा + स',
        note: 'Always enter the base consonant first, followed by the matra or halant.',
      },
    ],
    faqs: [
      {
        question: 'Which keyboard layout works on TypingPro Hindi Typing Test?',
        answer: 'Any Unicode Devanagari input method installed on your OS (Inscript, Hindi Phonetic, or mobile Devanagari keyboard) works directly in the input box.',
      },
      {
        question: 'Does this test support Kruti Dev 010 legacy font?',
        answer: 'No. TypingPro intentionally uses standard Unicode Devanagari (Mangal/Noto Sans Devanagari compatible) so text works reliably across all modern browsers and devices.',
      },
      {
        question: 'What is a good Hindi typing speed for office and exams?',
        answer: 'Most bilingual clerical benchmarks aim for 20 to 30 Net WPM in Hindi with at least 90% accuracy.',
      },
    ],
    relatedLinks: [
      { label: 'Hindi Typing Practice', href: '/hindi-typing-practice/', description: 'Untimed matra, conjunct, and custom Hindi drills' },
      { label: 'CPCT Bilingual Practice', href: '/cpct-typing-practice/', description: 'Hindi & English proficiency practice' },
      { label: 'Hindi Unicode Guide', href: '/blog/', description: 'Read our detailed Devanagari typing tutorial' },
    ],
  },
  {
    path: '/hindi-typing-practice/',
    title: 'Hindi Typing Practice (हिंदी टाइपिंग अभ्यास) – Matra & Custom Drills | TypingPro',
    description:
      'Practice Hindi Unicode typing at your own pace with beginner, intermediate, advanced, or custom Devanagari text passages.',
    h1: 'Hindi Typing Practice — Matras, Conjuncts & Custom Text',
    subtitle:
      'Build comfort with Devanagari vowel signs, half-letters, and full paragraphs without rush, or paste your own Hindi study text.',
    breadcrumbLabel: 'Hindi Typing Practice',
    widget: 'typing-practice',
    defaultLanguage: 'hi',
    defaultDifficulty: 'beginner',
    lockLanguage: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Step-by-Step Devanagari Fluency',
        paragraphs: [
          'Start with simple consonant words before moving to matras (ि, ी, ु, ू, े, ै, ो, ौ) and halant conjuncts. Practicing without a harsh timeout lets your fingers build accurate key memory first.',
        ],
        bullets: [
          'Switch between Beginner, Intermediate, and Advanced Hindi passages.',
          'Paste your own Hindi notes, essays, or newspaper paragraphs in Custom Text mode.',
          'Review accuracy and character feedback after every session.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How can I type Hindi on Windows or Mac for free?',
        answer: 'On Windows 10/11, add Hindi (India) under Time & Language settings and toggle with Win + Space. On Mac, add Devanagari - QWERTY or Inscript under Keyboard Input Sources.',
      },
      {
        question: 'Can I practice my own Hindi paragraph?',
        answer: 'Yes. Select Custom Text in the practice panel below and paste or type any Unicode Hindi paragraph you want to rehearse.',
      },
    ],
    relatedLinks: [
      { label: 'Hindi Typing Test', href: '/hindi-typing-test/', description: 'Test your Hindi speed under a timer' },
      { label: 'Hindi Touch Lessons', href: '/typing-lessons/', description: 'Guided Devanagari swar & vyanjan drills' },
      { label: 'CPCT Practice', href: '/cpct-typing-practice/', description: 'Timed Hindi practice for proficiency tests' },
    ],
  },
  {
    path: '/english-typing-practice/',
    title: 'English Typing Practice – Custom Text & Accuracy Drills | TypingPro',
    description:
      'Improve English typing fluency with guided accuracy drills, speed-building paragraphs, and custom text practice on TypingPro.',
    h1: 'English Typing Practice — Accuracy & Custom Drills',
    subtitle:
      'Practice steady English sentences, eliminate repeated letter slips, or enter your own text to rehearse essays, code comments, or emails.',
    breadcrumbLabel: 'English Typing Practice',
    widget: 'typing-practice',
    defaultLanguage: 'en',
    defaultDifficulty: 'beginner',
    lockLanguage: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Deliberate Practice Beats Mindless Repetition',
        paragraphs: [
          'Typing the same easy sentences endlessly rarely fixes tricky keys like Q, Z, X, brackets, or numbers. Use our English practice drills to isolate weak patterns, then paste your own real-world material in Custom Text mode.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How long should I practice English typing each day?',
        answer: '15 to 20 minutes of focused, error-free practice daily produces noticeably better results than an occasional long session.',
      },
      {
        question: 'Can I paste my own study notes for practice?',
        answer: 'Yes. Switch to the Custom Text tab in the practice module and paste any English passage up to 2,000 characters.',
      },
    ],
    relatedLinks: [
      { label: 'English Typing Test', href: '/english-typing-test/', description: 'Benchmark your English WPM with a timer' },
      { label: 'Touch Typing Lessons', href: '/typing-lessons/', description: 'Learn proper finger zones from Lesson 1' },
      { label: 'Typing Tips', href: '/typing-tips/', description: 'Techniques to cut backspace usage' },
    ],
  },
  {
    path: '/typing-practice/',
    title: 'Typing Practice Online – Custom Text & Daily Drills | TypingPro',
    description:
      'Free online typing practice tool with English and Hindi passages, custom text mode, daily exercises, and accuracy-first feedback.',
    h1: 'Typing Practice Studio — Daily Drills & Custom Text',
    subtitle:
      'Train accuracy, build speed smoothly, or paste your own custom English or Hindi text to practice at your own pace.',
    breadcrumbLabel: 'Typing Practice',
    widget: 'typing-practice',
    defaultLanguage: 'en',
    defaultDifficulty: 'intermediate',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Three Modes of Effective Practice',
        paragraphs: [
          'Combine daily warm-up passages, high-accuracy drills, and custom text practice so your skills transfer directly to school assignments and office work.',
        ],
        bullets: [
          'Daily Practice Exercises: Fresh balanced prose covering common words and punctuation.',
          'Custom Text Practice: Paste your own paragraphs, speeches, or bilingual study lines.',
          'Accuracy Focus: Track every missed keystroke cleanly without pressure.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is custom text practice saved to the public leaderboard?',
        answer: 'No. Custom text sessions are strictly for personal practice and private session tracking so leaderboard scores remain standardized.',
      },
      {
        question: 'Can I switch between English and Hindi during practice?',
        answer: 'Yes. Use the language toggle inside the practice studio to alternate between English and Unicode Hindi anytime.',
      },
    ],
    relatedLinks: [
      { label: 'Typing Lessons', href: '/typing-lessons/', description: 'Structured home-row to advanced curriculum' },
      { label: 'Typing Speed Test', href: '/typing-speed-test/', description: 'Measure your progress under a timer' },
      { label: 'Typing Games', href: '/typing-games/', description: 'Practice reflexes through interactive games' },
    ],
  },
  {
    path: '/typing-speed-test-1-minute/',
    title: '1 Minute Typing Speed Test – Quick 60-Second WPM Check | TypingPro',
    description:
      'Take a 1-minute typing speed test in English or Hindi. Ideal for daily warm-ups, quick WPM checks, and burst speed tracking.',
    h1: '1-Minute Typing Speed Test (60 Seconds)',
    subtitle:
      'A crisp 60-second sprint to measure your peak burst WPM and warm up your fingers before longer writing or exam sessions.',
    breadcrumbLabel: '1-Minute Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 60,
    defaultDifficulty: 'intermediate',
    lockDuration: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'When to Use a 1-Minute Typing Test',
        paragraphs: [
          'A 60-second typing test is the fastest way to check your daily baseline and wake up finger coordination. Because the window is short, even two backspaces noticeably affect your score—making it ideal for sharpening crisp first-try accuracy.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is a 1-minute test enough to know my true typing speed?',
        answer: 'It captures your burst speed accurately. Pair it with a 3-minute or 5-minute test once a week to verify endurance.',
      },
    ],
    relatedLinks: [
      { label: '2-Minute Typing Test', href: '/typing-speed-test-2-minute/', description: 'Step up to 120 seconds' },
      { label: '3-Minute Typing Test', href: '/typing-speed-test-3-minute/', description: 'Balanced medium-length test' },
      { label: '5-Minute Typing Test', href: '/typing-speed-test-5-minute/', description: 'Standard endurance benchmark' },
    ],
  },
  {
    path: '/typing-speed-test-2-minute/',
    title: '2 Minute Typing Speed Test – Sustained WPM Check | TypingPro',
    description:
      'Run a 2-minute online typing speed test in English or Hindi. Check whether your 1-minute speed holds steady across 120 seconds.',
    h1: '2-Minute Typing Speed Test (120 Seconds)',
    subtitle:
      'Bridge the gap between quick 1-minute sprints and longer endurance tests with a focused 120-second typing evaluation.',
    breadcrumbLabel: '2-Minute Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 120,
    defaultDifficulty: 'intermediate',
    lockDuration: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Why Two Minutes Matters',
        paragraphs: [
          'In 120 seconds, initial adrenaline settles into your natural typing cadence. If your Net WPM drops sharply compared to your 1-minute score, focus on relaxing your shoulders and maintaining steady rhythm across longer sentences.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What happens if I finish the passage before 2 minutes end?',
        answer: 'The test finishes cleanly upon passage completion and computes your exact Gross WPM and Net WPM using the true elapsed seconds.',
      },
    ],
    relatedLinks: [
      { label: '1-Minute Typing Test', href: '/typing-speed-test-1-minute/', description: 'Quick 60-second warm-up' },
      { label: '3-Minute Typing Test', href: '/typing-speed-test-3-minute/', description: 'Next endurance milestone' },
      { label: 'Typing Tips', href: '/typing-tips/', description: 'Keep rhythm steady past minute one' },
    ],
  },
  {
    path: '/typing-speed-test-3-minute/',
    title: '3 Minute Typing Speed Test – Realistic WPM Benchmark | TypingPro',
    description:
      'Take a 3-minute English or Hindi typing test to measure consistent words per minute, accuracy, and real-world typing stamina.',
    h1: '3-Minute Typing Speed Test (180 Seconds)',
    subtitle:
      'A balanced 180-second assessment that reflects your realistic everyday writing, coding, and documentation speed.',
    breadcrumbLabel: '3-Minute Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 180,
    defaultDifficulty: 'intermediate',
    lockDuration: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'The Ideal Daily Benchmark Length',
        paragraphs: [
          'Three minutes is long enough to eliminate lucky short runs while staying short enough to repeat multiple times in a 15-minute daily routine. Track your 3-minute Net WPM in your Dashboard to measure true weekly growth.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How many words should I aim for in 3 minutes?',
        answer: 'At 40 Net WPM, you will type around 120 five-character words (600 characters) in 3 minutes; at 60 WPM, around 180 words (900 characters).',
      },
    ],
    relatedLinks: [
      { label: '5-Minute Typing Test', href: '/typing-speed-test-5-minute/', description: 'Prepare for formal 5-minute tests' },
      { label: 'Student Typing Test', href: '/typing-test-for-students/', description: 'Academic passages for students' },
      { label: 'Dashboard Progress', href: '/dashboard/', description: 'Track saved 3-minute scores over time' },
    ],
  },
  {
    path: '/typing-speed-test-5-minute/',
    title: '5 Minute Typing Speed Test – Endurance & Accuracy | TypingPro',
    description:
      'Challenge your stamina with a 5-minute typing speed test in English or Hindi. Great preparation for office and academic skill tests.',
    h1: '5-Minute Typing Speed Test (300 Seconds)',
    subtitle:
      'Evaluate sustained focus, finger endurance, and error control across five continuous minutes of typing.',
    breadcrumbLabel: '5-Minute Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 300,
    defaultDifficulty: 'intermediate',
    lockDuration: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Pacing Yourself Over Five Minutes',
        paragraphs: [
          'Many typists start a 5-minute test at 110% effort and burn out at minute three. Begin at 90% of your top speed with calm breathing; keeping errors low across all 300 seconds reliably yields a higher Net WPM.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Are 5-minute tests good preparation for job skill assessments?',
        answer: 'Yes. Five minutes tests both concentration and posture, making it an excellent bridge toward 10-minute clerical skill exams.',
      },
    ],
    relatedLinks: [
      { label: '10-Minute Typing Test', href: '/typing-speed-test-10-minute/', description: 'Full 10-minute exam endurance' },
      { label: 'SSC Typing Practice', href: '/typing-test-for-ssc/', description: 'Administrative passages & KDPH guide' },
      { label: 'CPCT Practice', href: '/cpct-typing-practice/', description: 'Bilingual skill test preparation' },
    ],
  },
  {
    path: '/typing-speed-test-10-minute/',
    title: '10 Minute Typing Speed Test – Full Stamina & Exam Simulation | TypingPro',
    description:
      'Take a full 10-minute English or Hindi typing speed test. Build stamina for long writing tasks and competitive skill exams.',
    h1: '10-Minute Typing Speed Test (600 Seconds)',
    subtitle:
      'Full 600-second endurance testing designed to train long-form concentration, steady posture, and high-accuracy net speed.',
    breadcrumbLabel: '10-Minute Test',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 600,
    defaultDifficulty: 'advanced',
    lockDuration: true,
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Mastering the 10-Minute Endurance Window',
        paragraphs: [
          'A 10-minute test exposes hand tension, uneven breathing, and accuracy drift that 60-second tests hide. Practice maintaining relaxed wrists and consistent tempo through the final two minutes.',
        ],
        bullets: [
          'Keep shoulders dropped and screen at eye level to prevent neck fatigue.',
          'Target 95%+ accuracy so error deductions do not erode 10 minutes of work.',
          'Check your Personal Practice Report afterward to record your Net WPM and keystrokes.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How many keystrokes are typed in a 10-minute 35 WPM test?',
        answer: 'At 35 Net WPM using 5 characters per word, you type 175 characters per minute—totaling 1,750 accurate characters across 10 minutes.',
      },
    ],
    relatedLinks: [
      { label: 'SSC Typing Practice', href: '/typing-test-for-ssc/', description: 'Dedicated SSC practice passages' },
      { label: 'CPCT Typing Practice', href: '/cpct-typing-practice/', description: 'Bilingual 10-minute practice' },
      { label: 'Practice Report', href: '/typing-certificate/', description: 'Save or print your 10-minute summary' },
    ],
  },
  {
    path: '/typing-test-for-beginners/',
    title: 'Typing Test for Beginners – Easy Pace & Finger Guide | TypingPro',
    description:
      'Friendly typing test for beginners in English and Hindi. Simple words, clear home-row reminders, and zero pressure while learning.',
    h1: 'Typing Test for Beginners — Learn at a Calm Pace',
    subtitle:
      'Simple, clear passages paired with home-row guidance so new typists build confidence and clean accuracy before chasing speed.',
    breadcrumbLabel: 'For Beginners',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 60,
    defaultDifficulty: 'beginner',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Start Right: Three Rules for Total Beginners',
        paragraphs: [
          'Every fast touch typist once started at 12–18 WPM. Focusing on proper finger placement during your first two weeks prevents years of slow hunt-and-peck habits.',
        ],
        bullets: [
          'Always return index fingers to the F and J bumps.',
          'Type slowly enough to hit 95% accuracy on your first pass.',
          'Practice 10 minutes a day instead of cramming once a week.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What WPM is normal for a beginner?',
        answer: 'Most beginners start between 15 and 25 WPM when switching from looking at the keyboard to true touch typing. Within 2–3 weeks of daily practice, reaching 35+ WPM is common.',
      },
      {
        question: 'Should beginners start with tests or lessons?',
        answer: 'Alternate both: spend 5 minutes on Lesson 1 (Home Row) in Typing Lessons, then take a 1-minute beginner test to track progress.',
      },
    ],
    relatedLinks: [
      { label: 'Touch Typing Lessons', href: '/typing-lessons/', description: 'Start Lesson 01: Home Row Foundation' },
      { label: 'Typing Test for Kids', href: '/typing-test-for-kids/', description: 'Short story passages for young learners' },
      { label: 'Typing Tips', href: '/typing-tips/', description: 'Beginner posture & eye placement guide' },
    ],
  },
  {
    path: '/typing-test-for-students/',
    title: 'Typing Test for Students – Academic & Study Speed Practice | TypingPro',
    description:
      'Typing test tailored for school and college students. Practice academic paragraphs, note-taking fluency, and essay typing accuracy.',
    h1: 'Typing Test for Students — Faster Notes & Essays',
    subtitle:
      'Practice structured academic passages with citations, numbers, and clear formatting to make assignments and digital exams effortless.',
    breadcrumbLabel: 'For Students',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 180,
    defaultDifficulty: 'intermediate',
    defaultPassageCategory: 'students',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Why Typing Fluency Matters in School and College',
        paragraphs: [
          'When typing is automatic, students write essays faster, take cleaner lecture notes, and spend more energy on ideas rather than hunting for letters on the keyboard.',
        ],
        bullets: [
          'Practice punctuation like parentheses, colons, and percentages used in reports.',
          'Use Custom Text mode to rehearse difficult terminology from science or history notes.',
          'Track semester-long improvement inside the Student Dashboard.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What typing speed helps college students most?',
        answer: 'Typing at 45–60 WPM with 95%+ accuracy allows you to capture lecture notes smoothly and finish typed assignments in half the time.',
      },
    ],
    relatedLinks: [
      { label: 'Custom Text Practice', href: '/typing-practice/', description: 'Paste your own study notes' },
      { label: 'Hindi Typing Test', href: '/hindi-typing-test/', description: 'Practice Hindi essays and assignments' },
      { label: 'Student Study Guides', href: '/blog/', description: 'Read productivity guides for students' },
    ],
  },
  {
    path: '/typing-test-for-kids/',
    title: 'Typing Test for Kids – Fun & Easy Beginner Practice | TypingPro',
    description:
      'Safe, ad-free-feeling, kid-friendly typing test with short cheerful story passages and simple beginner controls.',
    h1: 'Typing Test for Kids — Friendly Story Practice',
    subtitle:
      'Cheerful, age-appropriate short stories with clear large letters so kids can practice keyboard skills comfortably and safely.',
    breadcrumbLabel: 'For Kids',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 60,
    defaultDifficulty: 'beginner',
    defaultPassageCategory: 'kids',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Helping Kids Learn Without Frustration',
        paragraphs: [
          'Young learners build confidence quickly when passages tell simple stories using familiar vocabulary and short 1-minute timers. Encourage kids to keep both hands resting lightly on the home row rather than rushing.',
        ],
        bullets: [
          'Keep sessions short (5–10 minutes) so hands never get tired.',
          'Celebrate high accuracy (95%+) even at 15 or 20 WPM.',
          'Explore Typing Games for playful word challenges.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do kids need an account to practice here?',
        answer: 'No. Kids can use all beginner story passages and typing games as guests with zero personal information collected.',
      },
    ],
    relatedLinks: [
      { label: 'Typing Games', href: '/typing-games/', description: 'Play Word Sprint and Falling Words' },
      { label: 'Home Row Lessons', href: '/typing-lessons/', description: 'Easy step-by-step finger guide' },
      { label: 'Beginner Typing Test', href: '/typing-test-for-beginners/', description: 'More simple starter passages' },
    ],
  },
  {
    path: '/typing-test-for-ssc/',
    title: 'SSC Typing Test Practice – English & Hindi Prep | TypingPro',
    description:
      'Independent SSC CGL & CHSL typing skill practice with 10-minute English and Hindi passages, Net WPM, and keystroke count tracking.',
    h1: 'Typing Test Practice for SSC Skill Preparation',
    subtitle:
      'Practice formal administrative English and Hindi passages with 5-keystroke word counting and 10-minute stamina timers. Independent preparation tool—not officially affiliated with SSC.',
    breadcrumbLabel: 'SSC Practice',
    widget: 'typing-test',
    defaultLanguage: 'en',
    defaultDurationSec: 600,
    defaultDifficulty: 'advanced',
    defaultPassageCategory: 'ssc',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Understanding Key Depressions & Net Speed',
        paragraphs: [
          'Disclaimer: TypingPro is an independent practice resource and is not affiliated with or endorsed by the Staff Selection Commission (SSC).',
          'General clerical typing skill tests commonly measure total keystrokes over 10 or 15 minutes (for example, 1,750 keystrokes in 10 minutes corresponds to 35 WPM at 5 keystrokes per word, while 1,500 keystrokes corresponds to 30 WPM). Practicing full formal paragraphs helps you build steady cadence across punctuation and capitalization.',
        ],
        bullets: [
          '35 WPM (English benchmark example) = 175 characters/min = 1,750 characters in 10 minutes.',
          '30 WPM (Hindi benchmark example) = 150 characters/min = 1,500 characters in 10 minutes.',
          'Always verify current official notification rules on the official exam portal.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is TypingPro an official SSC exam simulator?',
        answer: 'No. TypingPro is strictly an independent self-practice platform built to help candidates improve raw typing accuracy, endurance, and comfort in English and Unicode Hindi.',
      },
      {
        question: 'Should I practice 5-minute or 10-minute tests for exam prep?',
        answer: 'Use 5-minute tests on busy days and run full 10-minute tests regularly to build wrist endurance and late-stage focus.',
      },
    ],
    relatedLinks: [
      { label: 'CPCT Typing Practice', href: '/cpct-typing-practice/', description: 'Bilingual proficiency practice' },
      { label: '10-Minute Endurance Test', href: '/typing-speed-test-10-minute/', description: 'Full 600-second stamina test' },
      { label: 'Hindi Typing Test', href: '/hindi-typing-test/', description: 'Unicode Devanagari practice' },
    ],
  },
  {
    path: '/cpct-typing-practice/',
    title: 'CPCT Typing Practice – English & Hindi Bilingual Prep | TypingPro',
    description:
      'Independent CPCT bilingual typing practice in English and Unicode Hindi. Track Net WPM, accuracy, and 5–10 minute stamina on TypingPro.',
    h1: 'CPCT Typing Practice — Bilingual Speed & Accuracy',
    subtitle:
      'Train both English and Unicode Hindi Devanagari passages with transparent Net WPM and accuracy metrics. Independent practice tool—no official CPCT affiliation.',
    breadcrumbLabel: 'CPCT Practice',
    widget: 'typing-test',
    defaultLanguage: 'hi',
    defaultDurationSec: 600,
    defaultDifficulty: 'intermediate',
    defaultPassageCategory: 'cpct',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'How to Prepare for Bilingual Proficiency Tests',
        paragraphs: [
          'Disclaimer: TypingPro has no official affiliation with MPSeDC or the CPCT examination authority. Always refer to official exam guidelines for approved keyboard layouts and rules.',
          'Bilingual computer proficiency exams require switching smoothly between English technical prose and Hindi Devanagari paragraphs while maintaining high net accuracy. Practicing both languages in alternating sessions prevents layout confusion.',
        ],
        bullets: [
          'Alternate 10-minute English and 10-minute Hindi sessions during weekly practice.',
          'Aim for 93%+ accuracy so error deductions never pull down your Net WPM.',
          'Use our Hindi Matra & Conjunct lessons to eliminate common Devanagari slips.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Can I switch between Hindi and English right on this page?',
        answer: 'Yes. Toggle between Hindi (Devanagari) and English in the test toolbar above the passage.',
      },
      {
        question: 'Does TypingPro support Remmington Gail or Kruti Dev fonts?',
        answer: 'TypingPro uses standard Unicode Devanagari input provided by your operating system (such as Inscript or Hindi Phonetic). Legacy non-Unicode font encodings are not built in.',
      },
    ],
    relatedLinks: [
      { label: 'Hindi Typing Practice', href: '/hindi-typing-practice/', description: 'Untimed Hindi matra & custom drills' },
      { label: 'SSC Typing Practice', href: '/typing-test-for-ssc/', description: 'Formal administrative typing prep' },
      { label: 'Exam Prep Articles', href: '/blog/', description: 'Read structured exam preparation strategies' },
    ],
  },
  {
    path: '/typing-lessons/',
    title: 'Typing Lessons – Free Touch Typing Course (English & Hindi) | TypingPro',
    description:
      'Learn touch typing step by step with interactive home-row, top-row, bottom-row, accuracy, and Hindi Devanagari lessons on TypingPro.',
    h1: 'Interactive Touch Typing Lessons & Finger Guides',
    subtitle:
      'Master finger placement from Home Row basics to speed bursts and Hindi Unicode matras with live interactive drills.',
    breadcrumbLabel: 'Typing Lessons',
    widget: 'typing-lessons',
    defaultLanguage: 'en',
    schemaType: 'CollectionPage',
    sections: [
      {
        heading: 'A Structured Path from Zero to Fluent Touch Typing',
        paragraphs: [
          'Each lesson focuses on a dedicated keyboard zone with visual finger placement guidance, a live drill box, and a practical tip to avoid common habits.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How long does it take to complete the touch typing lessons?',
        answer: 'Most learners finish Lessons 1 through 5 within 10 to 14 days by practicing one lesson for 15 minutes per day until hitting 95%+ accuracy.',
      },
      {
        question: 'Are Hindi lessons included?',
        answer: 'Yes! Lessons 06 and 07 cover Hindi Devanagari vowels, consonants, matras, and half-letter conjuncts.',
      },
    ],
    relatedLinks: [
      { label: 'Beginner Typing Test', href: '/typing-test-for-beginners/', description: 'Test your lesson skills on real sentences' },
      { label: 'Typing Practice', href: '/typing-practice/', description: 'Practice with custom text' },
      { label: 'Typing Tips', href: '/typing-tips/', description: 'Posture and accuracy checklist' },
    ],
  },
  {
    path: '/typing-games/',
    title: 'Typing Games Online – Free Keyboard Speed Games | TypingPro',
    description:
      'Play 4 genuinely interactive typing games: Word Sprint, Falling Words, Timed Burst, and Precision Accuracy Challenge on TypingPro.',
    h1: 'Playable Typing Games to Sharpen Reflexes',
    subtitle:
      'Build faster word recognition, clean accuracy, and rapid keystroke reflexes with four lightweight browser typing games.',
    breadcrumbLabel: 'Typing Games',
    widget: 'typing-games',
    defaultLanguage: 'en',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Learn Faster Through Focused Play',
        paragraphs: [
          'Typing games force quick visual recognition and break monotony between formal timed tests. Choose Word Typing Challenge, Falling Words Arcade, Timed Challenge, or the zero-mistake Accuracy Challenge.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do typing games help improve real WPM?',
        answer: 'Yes. Word-reaction games train your brain to read whole words as patterns rather than single letters, accelerating transition speed.',
      },
    ],
    relatedLinks: [
      { label: '1-Minute Speed Test', href: '/typing-speed-test-1-minute/', description: 'Measure your speed after warm-up games' },
      { label: 'Typing Test for Kids', href: '/typing-test-for-kids/', description: 'Beginner-friendly story typing' },
      { label: 'Dashboard', href: '/dashboard/', description: 'View your saved game and test sessions' },
    ],
  },
  {
    path: '/typing-certificate/',
    title: 'Typing Practice Report – Printable Speed Summary | TypingPro',
    description:
      'Generate and print a personal typing practice report showing your verified test WPM, accuracy, date, and language on TypingPro.',
    h1: 'Personal Typing Practice Report',
    subtitle:
      'Create a clean, printable summary of your completed TypingPro session for personal tracking, study logs, or portfolio records.',
    breadcrumbLabel: 'Practice Report',
    widget: 'typing-certificate',
    schemaType: 'WebApplication',
    sections: [
      {
        heading: 'Important Notice About Practice Reports',
        paragraphs: [
          'TypingPro generates a Personal Practice Report based on your genuine completed test data—not an official, government, or accredited examination certificate. We never issue fake accreditations.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this an official government or accredited typing certificate?',
        answer: 'No. It is clearly labeled as a Personal Practice Report summarizing your self-assessment speed and accuracy on TypingPro.',
      },
      {
        question: 'How do I generate my practice report?',
        answer: 'Complete any timed typing test first (or pick one of your saved sessions if signed in), enter your display name, and download or print the formatted SVG/printable report.',
      },
    ],
    relatedLinks: [
      { label: 'Take Typing Test', href: '/typing-test/', description: 'Complete a test to record a fresh score' },
      { label: 'User Dashboard', href: '/dashboard/', description: 'Access your full saved test history' },
      { label: 'Disclaimer', href: '/disclaimer/', description: 'Read our transparency and report terms' },
    ],
  },
  {
    path: '/typing-tips/',
    title: 'Typing Tips – Proven Ways to Type Faster & More Accurately | TypingPro',
    description:
      'Learn proven typing tips: home-row posture, eye focus, rhythm pacing, backspace discipline, and bilingual Hindi/English accuracy strategies.',
    h1: 'Practical Typing Tips to Boost Speed and Accuracy',
    subtitle:
      'Actionable habits for ergonomics, rhythm, mistake reduction, and breaking WPM plateaus—paired with a quick practice check.',
    breadcrumbLabel: 'Typing Tips',
    widget: 'typing-tips',
    defaultLanguage: 'en',
    defaultDurationSec: 60,
    schemaType: 'FAQPage',
    sections: [
      {
        heading: '01. Fix Ergonomics Before Chasing Speed',
        paragraphs: [
          'Sit upright with elbows bent roughly 90 degrees, feet flat on the floor, and your screen positioned so your chin stays level. Comfortable posture prevents wrist fatigue in longer 5- and 10-minute tests.',
        ],
      },
      {
        heading: '02. Look One Word Ahead of the Cursor',
        paragraphs: [
          'Beginners look at the single letter they are pressing. Fluent typists keep their eyes 1–2 words ahead so the fingers receive instructions before reaching the next word.',
        ],
      },
      {
        heading: '03. Eliminate Unnecessary Backspace Habits',
        paragraphs: [
          'Slowing down by 10% to keep accuracy above 96% almost always produces a higher Net WPM than rushing at 85% accuracy and constantly deleting errors.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How much practice per day is optimal?',
        answer: '15–20 minutes of focused daily practice is far more effective for muscle memory than 2 hours once a week.',
      },
      {
        question: 'Should I use a mechanical or laptop keyboard?',
        answer: 'Either works well. Practice primarily on the keyboard you actually use for school, work, or exams.',
      },
    ],
    relatedLinks: [
      { label: 'Touch Typing Lessons', href: '/typing-lessons/', description: 'Put these tips into structured drills' },
      { label: 'Typing Blog', href: '/blog/', description: 'In-depth articles on speed and accuracy' },
      { label: 'Typing Practice', href: '/typing-practice/', description: 'Run targeted accuracy drills' },
    ],
  },
  {
    path: '/blog/',
    title: 'TypingPro Blog – Guides on English & Hindi Typing, Speed & Exams',
    description:
      'Read original typing guides covering typing tips, English and Hindi Unicode typing, speed building, student productivity, and exam preparation.',
    h1: 'TypingPro Guides & Articles',
    subtitle:
      'Practical, original articles on touch typing technique, Hindi Devanagari Unicode rules, student workflows, and skill test preparation.',
    breadcrumbLabel: 'Blog',
    widget: 'blog',
    schemaType: 'CollectionPage',
    sections: [],
    faqs: [
      {
        question: 'Are TypingPro articles beginner-friendly?',
        answer: 'Yes. Every guide uses clear step-by-step explanations and real keyboard examples tailored for beginners, students, and bilingual typists.',
      },
    ],
    relatedLinks: [
      { label: 'Typing Lessons', href: '/typing-lessons/', description: 'Practice the techniques covered in our guides' },
      { label: 'Hindi Typing Test', href: '/hindi-typing-test/', description: 'Try Hindi Unicode typing live' },
      { label: 'About TypingPro', href: '/about/', description: 'Learn about our mission and editorial standards' },
    ],
  },
  {
    path: '/about/',
    title: 'About TypingPro – Mission, Accuracy Standards & Bilingual Design',
    description:
      'Learn about TypingPro, our transparent WPM methodology, Unicode Hindi Devanagari engineering, and commitment to accessible typing education.',
    h1: 'About TypingPro',
    subtitle:
      'Built to make accurate English and Hindi typing practice accessible, distraction-free, and transparent for learners everywhere.',
    breadcrumbLabel: 'About',
    widget: 'about',
    schemaType: 'AboutPage',
    sections: [
      {
        heading: 'Our Purpose',
        paragraphs: [
          'TypingPro was created for students, professionals, and beginners who want a fast, clean, reliable place to build keyboard fluency without cluttered popups, inflated counters, or confusing gimmicks.',
        ],
      },
      {
        heading: 'Transparent Methodology',
        paragraphs: [
          'We publish our exact 5-character word formula openly, use Unicode-aware grapheme segmentation for Hindi Devanagari matras and conjuncts, and clearly label practice reports as self-assessment records rather than official certificates.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How does TypingPro handle user privacy?',
        answer: 'Guest users can practice without sharing any personal information. Signed-in users control their own profiles, leaderboard visibility, and can request full data deletion anytime.',
      },
    ],
    relatedLinks: [
      { label: 'Contact Us', href: '/contact/', description: 'Send feedback, bug reports, or questions' },
      { label: 'Privacy Policy', href: '/privacy-policy/', description: 'Read how data is handled' },
      { label: 'Start Typing Test', href: '/typing-test/', description: 'Try the typing workspace' },
    ],
  },
  {
    path: '/contact/',
    title: 'Contact TypingPro – Feedback, Support & Privacy Requests',
    description:
      'Reach out to the TypingPro team for technical support, content suggestions, privacy inquiries, or custom domain questions.',
    h1: 'Contact TypingPro',
    subtitle:
      'Questions, bug reports, passage suggestions, or privacy requests? Send us a message using the form below.',
    breadcrumbLabel: 'Contact',
    widget: 'contact',
    schemaType: 'ContactPage',
    sections: [
      {
        heading: 'How We Can Help',
        paragraphs: [
          'We read feedback carefully to improve English and Hindi passages, fix accessibility issues, and keep TypingPro reliable across browsers and mobile devices.',
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I request deletion of my account data?',
        answer: 'Signed-in users can trigger an immediate data/account deletion request directly from their Dashboard Settings, or send a privacy inquiry via this Contact form.',
      },
    ],
    relatedLinks: [
      { label: 'About TypingPro', href: '/about/', description: 'Learn about our platform' },
      { label: 'Privacy Policy', href: '/privacy-policy/', description: 'Review our data practices' },
    ],
  },
  {
    path: '/privacy-policy/',
    title: 'Privacy Policy | TypingPro',
    description:
      'Read the TypingPro Privacy Policy explaining what minimal data is stored for optional accounts, guest sessions, cookies, and user data deletion rights.',
    h1: 'Privacy Policy',
    subtitle:
      'Last updated: November 2026. How TypingPro handles optional account information, typing session history, and privacy controls.',
    breadcrumbLabel: 'Privacy Policy',
    widget: 'privacy-policy',
    sections: [
      {
        heading: '1. Guest Usage Without Registration',
        paragraphs: [
          'You can take English and Hindi typing tests, complete lessons, practice custom text, and play typing games without registering an account. Guest typing runs locally in your browser.',
        ],
      },
      {
        heading: '2. Optional User Accounts & Stored Data',
        paragraphs: [
          'When you choose to sign in via Firebase Authentication (Google Sign-In or Email/Password), TypingPro stores your display name, email address (kept strictly private to your account), preferred language/timer settings, and your saved typing session metrics in Google Cloud Firestore.',
          'Email addresses and private profile records are never displayed publicly on leaderboards or shared with third parties.',
        ],
      },
      {
        heading: '3. Leaderboard Visibility Control',
        paragraphs: [
          'Participating in the public leaderboard is strictly optional. You can disable leaderboard participation or remove your leaderboard entry at any time from your Dashboard.',
        ],
      },
      {
        heading: '4. Data Deletion Rights',
        paragraphs: [
          'Signed-in users can delete saved sessions or submit an account/data deletion request directly inside Dashboard Settings, or contact us via the Contact page.',
        ],
      },
    ],
    faqs: [],
    relatedLinks: [
      { label: 'Cookie Policy', href: '/cookie-policy/', description: 'How local storage and cookies are used' },
      { label: 'Terms and Conditions', href: '/terms-and-conditions/', description: 'Site usage terms' },
      { label: 'Contact Us', href: '/contact/', description: 'Submit a privacy inquiry' },
    ],
  },
  {
    path: '/terms-and-conditions/',
    title: 'Terms and Conditions | TypingPro',
    description:
      'Review TypingPro Terms and Conditions covering acceptable use, fair leaderboard rules, intellectual property, and service disclaimers.',
    h1: 'Terms and Conditions',
    subtitle:
      'Last updated: November 2026. Guidelines for using the TypingPro website, practice tools, and optional user accounts.',
    breadcrumbLabel: 'Terms & Conditions',
    widget: 'terms-and-conditions',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        paragraphs: [
          'By accessing and using TypingPro, you agree to use the platform responsibly for lawful personal, educational, and practice purposes.',
        ],
      },
      {
        heading: '2. Fair Use & Anti-Automation',
        paragraphs: [
          'Automated bots, script-injected keystrokes, paste manipulation, or attempts to submit falsified scores to the leaderboard are prohibited and may result in entry removal or account restriction.',
        ],
      },
      {
        heading: '3. Educational Content & Practice Reports',
        paragraphs: [
          'All passages, lessons, and articles on TypingPro are provided for self-paced educational practice. Personal Practice Reports summarize performance on TypingPro only and are not accredited credentials.',
        ],
      },
    ],
    faqs: [],
    relatedLinks: [
      { label: 'Disclaimer', href: '/disclaimer/', description: 'Important exam and score disclaimers' },
      { label: 'Privacy Policy', href: '/privacy-policy/', description: 'How your data is protected' },
    ],
  },
  {
    path: '/disclaimer/',
    title: 'Disclaimer | TypingPro',
    description:
      'Important disclaimers regarding TypingPro exam preparation pages (SSC, CPCT), personal practice reports, and third-party advertising readiness.',
    h1: 'Disclaimer',
    subtitle:
      'Clear transparency regarding TypingPro educational materials, exam preparation tools, and practice reports.',
    breadcrumbLabel: 'Disclaimer',
    widget: 'disclaimer',
    sections: [
      {
        heading: 'No Official Examination Affiliation',
        paragraphs: [
          'TypingPro is an independent online educational platform. We are NOT affiliated with, sponsored by, or endorsed by the Staff Selection Commission (SSC), MPSeDC / CPCT, or any government department or testing agency.',
        ],
      },
      {
        heading: 'Practice Reports Are Not Official Certificates',
        paragraphs: [
          'Any speed summary or printable Personal Practice Report generated by TypingPro reflects self-assessment practice on this website only. It carries no official accreditation or employment guarantee.',
        ],
      },
      {
        heading: 'Accuracy & Continuous Improvement',
        paragraphs: [
          'While we verify WPM calculations and Unicode Hindi segmentation carefully, exam formats and official rules may change at any time. Always consult official examination notifications for current criteria.',
        ],
      },
    ],
    faqs: [],
    relatedLinks: [
      { label: 'Terms and Conditions', href: '/terms-and-conditions/', description: 'Read full terms of service' },
      { label: 'Privacy Policy', href: '/privacy-policy/', description: 'Privacy & data protection' },
    ],
  },
  {
    path: '/cookie-policy/',
    title: 'Cookie Policy | TypingPro',
    description:
      'Learn how TypingPro uses essential browser storage and optional cookies for theme preferences, Firebase authentication, and future configured services.',
    h1: 'Cookie Policy',
    subtitle:
      'Last updated: November 2026. Transparent explanation of browser storage and cookies used on TypingPro.',
    breadcrumbLabel: 'Cookie Policy',
    widget: 'cookie-policy',
    sections: [
      {
        heading: '1. Essential Preferences & Local Storage',
        paragraphs: [
          'TypingPro stores minimal local preferences—such as your light/dark theme choice and recent local guest practice summary—so your interface remains consistent across page visits.',
        ],
      },
      {
        heading: '2. Authentication Cookies & Session Tokens',
        paragraphs: [
          'If you sign in with Firebase Authentication, Firebase stores essential session tokens in your browser to keep you authenticated securely.',
        ],
      },
      {
        heading: '3. Advertising & Analytics Readiness',
        paragraphs: [
          'Advertising placeholders on TypingPro remain disabled unless configured by the site owner after official review and approval. If third-party advertising (such as Google AdSense) is enabled in the future, this policy and appropriate user consent notices will reflect those active services.',
        ],
      },
    ],
    faqs: [],
    relatedLinks: [
      { label: 'Privacy Policy', href: '/privacy-policy/', description: 'Full privacy practices' },
      { label: 'Contact Us', href: '/contact/', description: 'Questions about cookies' },
    ],
  },
  {
    path: '/dashboard/',
    title: 'User Dashboard & Progress Analytics | TypingPro',
    description:
      'View your saved TypingPro test history, Best WPM, Average WPM, accuracy charts, language breakdown, and account settings.',
    h1: 'Your Typing Dashboard',
    subtitle:
      'Review genuine saved typing sessions, progress trends over time, English vs. Hindi performance, and privacy settings.',
    breadcrumbLabel: 'Dashboard',
    widget: 'dashboard',
    sections: [],
    faqs: [],
    relatedLinks: [
      { label: 'Take New Typing Test', href: '/typing-test/', description: 'Record a fresh timed session' },
      { label: 'Public Leaderboard', href: '/leaderboard/', description: 'See verified community high scores' },
    ],
  },
  {
    path: '/leaderboard/',
    title: 'Verified Typing Speed Leaderboard | TypingPro',
    description:
      'View verified English and Hindi typing speed rankings on TypingPro. Anti-paste and telemetry-validated Net WPM scores with zero private PII exposed.',
    h1: 'Verified Typing Leaderboard',
    subtitle:
      'Rankings sorted by Net WPM and accuracy from opted-in signed-in users whose keystroke telemetry passed server validation.',
    breadcrumbLabel: 'Leaderboard',
    widget: 'leaderboard',
    sections: [],
    faqs: [
      {
        question: 'How are leaderboard scores ranked and validated?',
        answer: 'Entries are ranked primarily by Net WPM (with Accuracy % as tiebreaker) for standard 1, 2, 3, 5, and 10-minute tests. Submissions must pass server-side keystroke timing checks, zero-paste verification, and minimum 80% accuracy.',
      },
      {
        question: 'Can I keep my typing scores private?',
        answer: 'Yes. Leaderboard sharing is opt-in only. Toggle Leaderboard Privacy anytime in your Dashboard settings, and your email is never exposed.',
      },
    ],
    relatedLinks: [
      { label: 'Take Typing Test', href: '/typing-test/', description: 'Complete a verified timed test' },
      { label: 'Dashboard', href: '/dashboard/', description: 'Manage your leaderboard opt-in status' },
    ],
  },
];

export const ROUTE_MAP = new Map<string, SeoRouteDefinition>(
  SEO_ROUTES.map((route) => [route.path, route]),
);

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  const clean = pathname.split('?')[0].split('#')[0];
  return clean.endsWith('/') ? clean : `${clean}/`;
}

export function resolveRoute(pathname: string): {
  route: SeoRouteDefinition;
  blogSlug?: string;
} {
  const norm = normalizePathname(pathname);
  const direct = ROUTE_MAP.get(norm);
  if (direct) return { route: direct };

  if (norm.startsWith('/blog/') && norm.length > '/blog/'.length) {
    const slug = norm.slice('/blog/'.length, -1);
    return {
      route: ROUTE_MAP.get('/blog/')!,
      blogSlug: slug,
    };
  }

  if (norm === '/profile/') {
    return { route: ROUTE_MAP.get('/dashboard/')! };
  }

  return { route: ROUTE_MAP.get('/')! };
}
