import type { DifficultyLevel, LessonItem, PassageItem, TypingLanguage } from '../types/typing.ts';

export const PASSAGES: PassageItem[] = [
  // ENGLISH - BEGINNER
  {
    id: 'en-beg-1',
    title: 'Steady Rhythm on the Home Row',
    language: 'en',
    difficulty: 'beginner',
    category: 'general',
    text: 'Good typing starts with calm posture and steady rhythm. Place your left fingers on A, S, D, and F, and rest your right fingers on J, K, L, and the semicolon key. Look at the screen instead of the keyboard, and let accuracy lead before chasing higher speed every day.',
  },
  {
    id: 'en-beg-2',
    title: 'Clear Habits for Daily Practice',
    language: 'en',
    difficulty: 'beginner',
    category: 'daily',
    text: 'Ten focused minutes of typing practice each morning builds stronger muscle memory than one rushed hour on the weekend. Keep your wrists floating lightly above the desk, strike each key with even pressure, and pause briefly when you notice repeated slips on the same letter.',
  },
  {
    id: 'en-kids-1',
    title: 'The Morning Park Walk',
    language: 'en',
    difficulty: 'beginner',
    category: 'kids',
    text: 'A small brown dog ran across the green park path while birds sang in the tall oak trees. Maya carried a bright red kite and waved to her friends near the pond. The cool breeze made the leaves dance, and everyone smiled as the sun rose higher in the clear blue sky.',
  },
  {
    id: 'en-kids-2',
    title: 'Space Club Explorer',
    language: 'en',
    difficulty: 'beginner',
    category: 'kids',
    text: 'Leo built a model rocket out of silver paper and cardboard tubes for his school science club. He wrote down each step in a neat notebook and tested the paper fins outside on the lawn. When the wind lifted the glider, the whole class cheered with joy.',
  },
  // ENGLISH - INTERMEDIATE
  {
    id: 'en-int-1',
    title: 'How Muscle Memory Builds Speed',
    language: 'en',
    difficulty: 'intermediate',
    category: 'general',
    text: 'Typing speed improves naturally when your fingers learn common letter combinations as single fluid motions rather than isolated keystrokes. Words like "there", "which", "about", and "through" appear in nearly every document. Practicing complete phrases trains your hands to anticipate the next word smoothly without hesitation.',
  },
  {
    id: 'en-int-2',
    title: 'Smart Note-Taking for College Students',
    language: 'en',
    difficulty: 'intermediate',
    category: 'students',
    text: 'University lectures move quickly, and students who type accurately can capture key arguments without staring down at their laptop keyboards. Using structured headings, short bullet points, and clear timestamps during class leaves more time later for reviewing concepts, drafting essays, and preparing research summaries.',
  },
  {
    id: 'en-int-3',
    title: 'Public Administration & Digital Records',
    language: 'en',
    difficulty: 'intermediate',
    category: 'ssc',
    text: 'Modern public offices rely on accurate digital documentation to process applications, maintain transparent citizen records, and publish timely notices. Clerks and data entry assistants must verify spelling, punctuation, and numeric figures carefully because even a single misplaced digit can delay an important file.',
  },
  {
    id: 'en-int-4',
    title: 'Office Communication & Data Accuracy',
    language: 'en',
    difficulty: 'intermediate',
    category: 'cpct',
    text: 'Computer proficiency examinations measure both steady typing throughput and careful attention to formatting details. Candidates who maintain ninety-five percent accuracy under a ten-minute timer consistently outperform faster typists who lose net words per minute due to frequent backspace corrections.',
  },
  // ENGLISH - ADVANCED
  {
    id: 'en-adv-1',
    title: 'Precision Under Punctuation & Numbers',
    language: 'en',
    difficulty: 'advanced',
    category: 'general',
    text: 'In 2026, technical writers, software engineers, and policy analysts frequently switch between prose, bracketed citations [Section 4.2], percentages (98.4%), and hyphenated compound terms. True fluency requires effortless mastery of Shift-key capitalization, apostrophes, semicolons, and top-row numerals without breaking typing cadence.',
  },
  {
    id: 'en-adv-2',
    title: 'Economic Survey & Governance Paragraph',
    language: 'en',
    difficulty: 'advanced',
    category: 'ssc',
    text: 'Sustained infrastructure investment across regional transport corridors, renewable energy grids, and rural broadband networks strengthens long-term productivity. According to quarterly fiscal reviews (FY 2025-26), transparent procurement workflows and timely audit compliance reduce administrative bottlenecks by nearly 18.5 percent across participating departments.',
  },
  {
    id: 'en-adv-3',
    title: 'Bilingual Documentation Standards',
    language: 'en',
    difficulty: 'advanced',
    category: 'cpct',
    text: 'Standardized clerical workflows require consistent spacing after commas, colons, and full stops, as well as strict verification of alphanumeric reference codes such as REG-4082/MP or CERT-917. Balanced pacing across the full examination window preserves concentration and minimizes late-stage fatigue.',
  },

  // HINDI DEVANAGARI UNICODE - BEGINNER
  {
    id: 'hi-beg-1',
    title: 'हिंदी टाइपिंग की सरल शुरुआत',
    language: 'hi',
    difficulty: 'beginner',
    category: 'general',
    text: 'हिंदी टाइपिंग सीखने के लिए धैर्य और नियमित अभ्यास सबसे जरूरी है। शुरुआत में गति की चिंता करने के बजाय हर अक्षर और मात्रा को सही लिखने पर ध्यान दें। रोज पंद्रह मिनट का शांत अभ्यास आपकी उंगलियों को कीबोर्ड पर सहज बना देता है।',
  },
  {
    id: 'hi-beg-2',
    title: 'दैनिक अभ्यास और सही मुद्रा',
    language: 'hi',
    difficulty: 'beginner',
    category: 'daily',
    text: 'पढ़ाई और कार्यालय के काम में शुद्ध हिंदी लिखना बहुत उपयोगी कौशल है। कुर्सी पर सीधे बैठकर स्क्रीन के सामने नजर रखें और कलाई को मेज पर न दबाएं। जब मात्राएं बिना देखे सही बनने लगें, तब धीरे-धीरे अपनी गति बढ़ाएं।',
  },
  {
    id: 'hi-kids-1',
    title: 'सुबह का सुंदर बगीचा',
    language: 'hi',
    difficulty: 'beginner',
    category: 'kids',
    text: 'सुबह के समय बगीचे में ताजी हवा चलती है और रंग-बिरंगे फूल खिलते हैं। चिड़िया पेड़ की डाली पर बैठकर मीठे गीत गाती है। बच्चे किताबें पढ़कर मैदान में खेलते हैं और प्रकृति से नई बातें सीखते हैं।',
  },
  // HINDI DEVANAGARI UNICODE - INTERMEDIATE
  {
    id: 'hi-int-1',
    title: 'संयुक्ताक्षर और मात्राओं का संतुलन',
    language: 'hi',
    difficulty: 'intermediate',
    category: 'general',
    text: 'हिंदी देवनागरी लिपि में छोटी और बड़ी मात्राओं, अनुस्वार, चंद्रबिंदु तथा आधे अक्षरों का सही क्रम बहुत महत्वपूर्ण होता है। शब्द जैसे विद्यार्थी, विज्ञान, प्रयास और स्वावलंबन लगातार अभ्यास से सरल हो जाते हैं और अशुद्धियां कम होती हैं।',
  },
  {
    id: 'hi-int-2',
    title: 'डिजिटल शिक्षा और विद्यार्थी जीवन',
    language: 'hi',
    difficulty: 'intermediate',
    category: 'students',
    text: 'आज के समय में विद्यालय और महाविद्यालय के विद्यार्थी अपने नोट्स, परियोजना रिपोर्ट और निबंध कंप्यूटर पर तैयार करते हैं। यूनिकोड हिंदी टाइपिंग आने से शोध सामग्री लिखना और ईमेल भेजना काफी आसान व तेज हो जाता है।',
  },
  {
    id: 'hi-int-3',
    title: 'कार्यालयीन पत्र और प्रशासनिक शब्दावली',
    language: 'hi',
    difficulty: 'intermediate',
    category: 'ssc',
    text: 'प्रशासनिक कार्यों में स्पष्ट भाषा, सटीक वर्तनी और निर्धारित समय सीमा का पालन आवश्यक होता है। विभिन्न विभागों के परिपत्र, आवेदन पत्र और सूचनाएं तैयार करते समय विराम चिह्नों तथा संयुक्ताक्षरों की शुद्धता पर विशेष ध्यान दिया जाता है।',
  },
  {
    id: 'hi-int-4',
    title: 'कंप्यूटर दक्षता और हिंदी लेखन',
    language: 'hi',
    difficulty: 'intermediate',
    category: 'cpct',
    text: 'मध्य प्रदेश और अन्य राज्यों की कंप्यूटर दक्षता परीक्षाओं में हिंदी टाइपिंग की शुद्धता और निरंतर गति दोनों की जांच की जाती है। नियमित रूप से अनुच्छेद लिखने का अभ्यास करने से परीक्षा के समय आत्मविश्वास बना रहता है।',
  },
  // HINDI DEVANAGARI UNICODE - ADVANCED
  {
    id: 'hi-adv-1',
    title: 'पर्यावरण संरक्षण और सतत विकास',
    language: 'hi',
    difficulty: 'advanced',
    category: 'general',
    text: 'जलवायु परिवर्तन की चुनौतियों का सामना करने के लिए नवीकरणीय ऊर्जा, जल संरक्षण और वृक्षारोपण जैसे ठोस कदम अनिवार्य हैं। यदि प्रत्येक नागरिक स्थानीय स्तर पर प्लास्टिक के उपयोग को सीमित करे और सार्वजनिक परिवहन को प्राथमिकता दे, तो पर्यावरण संतुलन सुदृढ़ हो सकता है।',
  },
  {
    id: 'hi-adv-2',
    title: 'सूचना प्रौद्योगिकी और सुशासन',
    language: 'hi',
    difficulty: 'advanced',
    category: 'cpct',
    text: 'ई-गवर्नेंस प्रणालियों ने प्रमाणपत्र, भू-अभिलेख और जनकल्याणकारी योजनाओं की प्रक्रियाओं को पारदर्शी एवं त्वरित बनाया है। दक्ष टंकक जटिल तकनीकी शब्दों, संख्याओं और पूर्ण विराम चिह्नों के बीच संतुलन बनाए रखते हुए उच्च सटीकता के साथ दस्तावेज तैयार करते हैं।',
  },
];

export function selectPassage(params: {
  language: TypingLanguage;
  difficulty?: Exclude<DifficultyLevel, 'custom'>;
  category?: PassageItem['category'];
  excludeId?: string;
}): PassageItem {
  const { language, difficulty, category, excludeId } = params;
  let candidates = PASSAGES.filter((p) => p.language === language);
  if (category && category !== 'general') {
    const catMatches = candidates.filter((p) => p.category === category);
    if (catMatches.length > 0) candidates = catMatches;
  }
  if (difficulty) {
    const diffMatches = candidates.filter((p) => p.difficulty === difficulty);
    if (diffMatches.length > 0) candidates = diffMatches;
  }
  if (excludeId && candidates.length > 1) {
    candidates = candidates.filter((p) => p.id !== excludeId);
  }
  return candidates[0] ?? PASSAGES.find((p) => p.language === language) ?? PASSAGES[0];
}

export const LESSONS: LessonItem[] = [
  {
    id: 'lesson-1-home-row',
    number: '01',
    title: 'Home Row Foundation (A S D F — J K L ;)',
    language: 'en',
    level: 'Beginner',
    focusKeys: ['A', 'S', 'D', 'F', 'J', 'K', 'L', ';'],
    fingerNote: 'Left pinky to index rest on A S D F; right index to pinky rest on J K L ;. Feel the small tactile bumps on F and J.',
    description: 'Build anchor awareness so your hands always return to the center row without looking down.',
    drillText: 'asdf jkl; fdsa ;lkj ask lad fall sad dad flask salad; as a lad falls; ask dad;',
    commonMistakeTip: 'Avoid lifting your entire hand off the desk—only move the assigned finger and return to F or J.',
  },
  {
    id: 'lesson-2-top-row',
    number: '02',
    title: 'Top Row Reach (Q W E R T — Y U I O P)',
    language: 'en',
    level: 'Beginner',
    focusKeys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    fingerNote: 'Reach upward slightly from your home-row anchor finger, then bring the finger straight back down.',
    description: 'Practice vowels E, I, O, U and high-frequency letters R and T paired with home-row letters.',
    drillText: 'we read your quote; write two reports; quiet water flows; try your pure effort today;',
    commonMistakeTip: 'Keep index fingers disciplined on T/R (left) and Y/U (right) instead of crossing hands.',
  },
  {
    id: 'lesson-3-bottom-row',
    number: '03',
    title: 'Bottom Row & Shift Keys (Z X C V B — N M , . /)',
    language: 'en',
    level: 'Beginner',
    focusKeys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.'],
    fingerNote: 'Curl the assigned finger downward cleanly and use the opposite hand pinky for Shift.',
    description: 'Master common suffixes (-ing, -ment, -tion) and clean sentence punctuation.',
    drillText: 'Calm minds combine vivid numbers, clean commas, and moving sentences every single morning.',
    commonMistakeTip: 'Never press Shift and the letter with the same hand—always use the opposite pinky for Shift.',
  },
  {
    id: 'lesson-4-accuracy-drill',
    number: '04',
    title: 'Precision & Mistake Elimination',
    language: 'en',
    level: 'Intermediate',
    focusKeys: ['P', 'B', 'V', 'M', 'N', ';', "'"],
    fingerNote: 'Slow down by 15% and aim for zero backspaces across the entire drill.',
    description: 'Targets commonly confused pairs (B/V, M/N, I/O) and contraction apostrophes.',
    drillText: "Don't rush past tricky words like accommodate, rhythm, necessary, environment, and government's review.",
    commonMistakeTip: 'Hitting Backspace repeatedly slows net WPM more than typing at a controlled, steady pace.',
  },
  {
    id: 'lesson-5-speed-bursts',
    number: '05',
    title: 'Speed Building: Bigram & Word Cadence',
    language: 'en',
    level: 'Advanced',
    focusKeys: ['T', 'H', 'E', 'I', 'N', 'G', 'A', 'R'],
    fingerNote: 'Read one word ahead of the cursor so your fingers chain common syllables smoothly.',
    description: 'High-frequency English digraphs and rolling alternating-hand words for 50–80+ WPM fluency.',
    drillText: 'There is no better habit than thinking clearly while writing through complex ideas with steady control.',
    commonMistakeTip: 'Do not burst fast on easy words and stall on long words—keep a metronome-like tempo.',
  },
  {
    id: 'lesson-6-hindi-swar-vyanjan',
    number: '06',
    title: 'Hindi Unicode Basics: Swar & Vyanjan (हिंदी स्वर व व्यंजन)',
    language: 'hi',
    level: 'Beginner',
    focusKeys: ['अ', 'आ', 'इ', 'क', 'ख', 'ग', 'न', 'म', 'र', 'स'],
    fingerNote: 'Use your system Hindi Unicode keyboard (Inscript or Phonetic). Focus on clean base consonants before adding matras.',
    description: 'Practice fundamental Devanagari consonants and simple two-letter words without matra errors.',
    drillText: 'कमल घर चल जल भर मन कर नल पर टब रख सब सच कह अब घर चल',
    commonMistakeTip: 'शुरुआत में समान दिखने वाले अक्षरों जैसे ख/रव और भ/म में जल्दबाजी न करें।',
  },
  {
    id: 'lesson-7-hindi-matra-conjunct',
    number: '07',
    title: 'Hindi Matras & Conjuncts (मात्रा और संयुक्ताक्षर अभ्यास)',
    language: 'hi',
    level: 'Intermediate',
    focusKeys: ['ि', 'ी', 'ु', 'ू', 'े', 'ै', 'ो', '्', 'ं'],
    fingerNote: 'Always type the base consonant first, followed by the matra or halant (्) + second consonant in Unicode.',
    description: 'Master Unicode ordering for इ/ई, उ/ऊ, ए/ऐ, अनुस्वार (ं), and halant conjuncts like प्र, स्त, क्त.',
    drillText: 'किताब विज्ञान प्रयास विद्यार्थी शिक्षा स्वतंत्र प्रकृति संस्कृति अभ्यास सफलता',
    commonMistakeTip: 'यूनिकोड हिंदी में छोटी इ की मात्रा (ि) भी व्यंजन लिखने के बाद ही टाइप की जाती है।',
  },
];
