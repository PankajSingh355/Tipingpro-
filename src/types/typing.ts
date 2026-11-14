export type TypingLanguage = 'en' | 'hi';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'custom';

export type TestDurationSec = 60 | 120 | 180 | 300 | 600;

export type SessionMode = 'test' | 'practice' | 'lesson' | 'game';

export type GraphemeStatus = 'correct' | 'incorrect' | 'pending' | 'untyped';

export interface EvaluatedGrapheme {
  char: string;
  status: GraphemeStatus;
  isCurrent: boolean;
}

export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalTypedChars: number;
  totalTargetChars: number;
  completionPercent: number;
  elapsedSec: number;
}

export interface TypingEvaluationResult {
  items: EvaluatedGrapheme[];
  metrics: TypingMetrics;
  isPassageCompleted: boolean;
}

export interface PassageItem {
  id: string;
  title: string;
  language: TypingLanguage;
  difficulty: Exclude<DifficultyLevel, 'custom'>;
  category: 'general' | 'kids' | 'students' | 'ssc' | 'cpct' | 'daily';
  text: string;
}

export interface LessonItem {
  id: string;
  number: string;
  title: string;
  language: TypingLanguage;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  focusKeys: string[];
  fingerNote: string;
  description: string;
  drillText: string;
  commonMistakeTip: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email?: string;
  preferredLanguage: TypingLanguage;
  preferredDurationSec: TestDurationSec;
  leaderboardOptIn: boolean;
  theme: 'light' | 'dark' | 'system';
  deletionRequested: boolean;
  deletionRequestedAt?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TypingSessionRecord {
  id: string;
  userId: string;
  mode: SessionMode;
  routeSlug: string;
  language: TypingLanguage;
  difficulty: DifficultyLevel;
  durationSec: number;
  elapsedSec: number;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalTypedChars: number;
  passageTitle: string;
  createdAt?: unknown;
  createdAtMs?: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  language: TypingLanguage;
  durationSec: TestDurationSec;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  verificationDigest: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export type BlogCategory =
  | 'Typing Tips'
  | 'English Typing'
  | 'Hindi Typing'
  | 'Typing Speed'
  | 'Student Guides'
  | 'Exam Preparation';

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  content: string;
  authorName: string;
  readMinutes: number;
  publishedDate: string;
  status: 'draft' | 'published';
}

export interface RouteFaq {
  question: string;
  answer: string;
}

export interface InternalLinkItem {
  label: string;
  href: string;
  description: string;
}

export type RouteWidgetType =
  | 'home'
  | 'typing-test'
  | 'typing-practice'
  | 'typing-lessons'
  | 'typing-games'
  | 'typing-certificate'
  | 'typing-tips'
  | 'blog'
  | 'dashboard'
  | 'leaderboard'
  | 'about'
  | 'contact'
  | 'privacy-policy'
  | 'terms-and-conditions'
  | 'disclaimer'
  | 'cookie-policy';

export interface SeoRouteDefinition {
  path: string;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  breadcrumbLabel: string;
  widget: RouteWidgetType;
  defaultLanguage?: TypingLanguage;
  defaultDurationSec?: TestDurationSec;
  defaultDifficulty?: Exclude<DifficultyLevel, 'custom'>;
  defaultPassageCategory?: PassageItem['category'];
  lockDuration?: boolean;
  lockLanguage?: boolean;
  sections: {
    heading: string;
    paragraphs: string[];
    bullets?: string[];
  }[];
  examples?: {
    title: string;
    sample: string;
    note: string;
  }[];
  faqs: RouteFaq[];
  relatedLinks: InternalLinkItem[];
  schemaType?: 'WebApplication' | 'FAQPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';
}
