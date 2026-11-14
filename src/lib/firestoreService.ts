import type { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import type {
  BlogArticle,
  LeaderboardEntry,
  TestDurationSec,
  TypingLanguage,
  TypingSessionRecord,
  UserProfile,
} from '../types/typing.ts';
import { db, handleFirestoreError, OperationType } from './firebase.ts';

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
}

function clampString(val: string, maxLen: number): string {
  return val.trim().slice(0, maxLen);
}

export async function ensureUserProfile(user: User): Promise<UserProfile> {
  const path = `users/${user.uid}`;
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }

    const displayName = clampString(user.displayName || user.email?.split('@')[0] || 'TypingPro Learner', 80);
    const newProfile: Record<string, unknown> = {
      uid: user.uid,
      displayName,
      preferredLanguage: 'en',
      preferredDurationSec: 60,
      leaderboardOptIn: false,
      theme: 'system',
      deletionRequested: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (user.email) {
      newProfile.email = clampString(user.email, 160);
    }

    await setDoc(ref, newProfile);
    const created = await getDoc(ref);
    return created.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<
    Pick<
      UserProfile,
      | 'displayName'
      | 'preferredLanguage'
      | 'preferredDurationSec'
      | 'leaderboardOptIn'
      | 'theme'
      | 'deletionRequested'
      | 'deletionRequestedAt'
    >
  >,
): Promise<void> {
  const path = `users/${uid}`;
  try {
    const ref = doc(db, 'users', uid);
    const payload: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };
    if (updates.displayName !== undefined) {
      payload.displayName = clampString(updates.displayName || 'TypingPro Learner', 80);
    }
    if (updates.preferredLanguage !== undefined) {
      payload.preferredLanguage = updates.preferredLanguage;
    }
    if (updates.preferredDurationSec !== undefined) {
      payload.preferredDurationSec = updates.preferredDurationSec;
    }
    if (updates.leaderboardOptIn !== undefined) {
      payload.leaderboardOptIn = updates.leaderboardOptIn;
    }
    if (updates.theme !== undefined) {
      payload.theme = updates.theme;
    }
    if (updates.deletionRequested !== undefined) {
      payload.deletionRequested = updates.deletionRequested;
    }
    if (updates.deletionRequestedAt !== undefined) {
      payload.deletionRequestedAt = clampString(updates.deletionRequestedAt, 64);
    }
    await updateDoc(ref, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveTypingSession(
  uid: string,
  session: Omit<TypingSessionRecord, 'id' | 'userId' | 'createdAt' | 'createdAtMs'>,
): Promise<string> {
  const sessionId = sanitizeId(`sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const path = `users/${uid}/sessions/${sessionId}`;
  try {
    const ref = doc(db, 'users', uid, 'sessions', sessionId);
    await setDoc(ref, {
      id: sessionId,
      userId: uid,
      mode: session.mode,
      routeSlug: clampString(session.routeSlug || '/', 100),
      language: session.language,
      difficulty: session.difficulty,
      durationSec: Math.min(3600, Math.max(15, Math.round(session.durationSec))),
      elapsedSec: Math.min(3600, Math.max(1, Math.round(session.elapsedSec))),
      grossWpm: Math.min(300, Math.max(0, Math.round(session.grossWpm))),
      netWpm: Math.min(300, Math.max(0, Math.round(session.netWpm))),
      accuracy: Math.min(100, Math.max(0, Number(session.accuracy.toFixed(1)))),
      correctChars: Math.min(100000, Math.max(0, Math.round(session.correctChars))),
      incorrectChars: Math.min(100000, Math.max(0, Math.round(session.incorrectChars))),
      totalTypedChars: Math.min(100000, Math.max(0, Math.round(session.totalTypedChars))),
      passageTitle: clampString(session.passageTitle || 'Typing Practice', 120),
      createdAt: serverTimestamp(),
    });
    return sessionId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchUserSessions(uid: string): Promise<TypingSessionRecord[]> {
  const path = `users/${uid}/sessions`;
  try {
    const q = query(
      collection(db, 'users', uid, 'sessions'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc'),
      limit(100),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as TypingSessionRecord & { createdAt?: { toMillis?: () => number } };
      return {
        ...data,
        createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function deleteUserSession(uid: string, sessionId: string): Promise<void> {
  const path = `users/${uid}/sessions/${sessionId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'sessions', sessionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function submitLeaderboardEntry(params: {
  uid: string;
  displayName: string;
  language: TypingLanguage;
  durationSec: TestDurationSec;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  verificationDigest: string;
}): Promise<string> {
  const entryId = sanitizeId(`${params.uid}_${params.language}_${params.durationSec}`);
  const path = `leaderboard/${entryId}`;
  try {
    const ref = doc(db, 'leaderboard', entryId);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      const prev = existing.data() as LeaderboardEntry;
      // Keep user's personal best for that language + duration bucket
      if (prev.netWpm > params.netWpm) {
        return entryId;
      }
      await updateDoc(ref, {
        displayName: clampString(params.displayName, 60),
        netWpm: Math.round(params.netWpm),
        grossWpm: Math.round(params.grossWpm),
        accuracy: Number(params.accuracy.toFixed(1)),
        verificationDigest: params.verificationDigest,
        updatedAt: serverTimestamp(),
      });
      return entryId;
    }

    await setDoc(ref, {
      id: entryId,
      userId: params.uid,
      displayName: clampString(params.displayName, 60),
      language: params.language,
      durationSec: params.durationSec,
      netWpm: Math.round(params.netWpm),
      grossWpm: Math.round(params.grossWpm),
      accuracy: Number(params.accuracy.toFixed(1)),
      verificationDigest: params.verificationDigest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return entryId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchLeaderboard(
  language?: TypingLanguage,
  durationSec?: TestDurationSec,
): Promise<LeaderboardEntry[]> {
  const path = 'leaderboard';
  try {
    const q = query(
      collection(db, 'leaderboard'),
      where('netWpm', '>=', 5),
      orderBy('netWpm', 'desc'),
      limit(100),
    );
    const snap = await getDocs(q);
    let rows = snap.docs.map((d) => d.data() as LeaderboardEntry);
    if (language) {
      rows = rows.filter((r) => r.language === language);
    }
    if (durationSec) {
      rows = rows.filter((r) => r.durationSec === durationSec);
    }
    return rows.sort((a, b) => b.netWpm - a.netWpm || b.accuracy - a.accuracy).slice(0, 50);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function removeUserLeaderboardEntries(uid: string): Promise<void> {
  const languages: TypingLanguage[] = ['en', 'hi'];
  const durations: TestDurationSec[] = [60, 120, 180, 300, 600];
  for (const lang of languages) {
    for (const dur of durations) {
      const entryId = sanitizeId(`${uid}_${lang}_${dur}`);
      const ref = doc(db, 'leaderboard', entryId);
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          await deleteDoc(ref);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `leaderboard/${entryId}`);
      }
    }
  }
}

export async function submitContactMessage(params: {
  name: string;
  email: string;
  topic: 'general' | 'bug' | 'feedback' | 'privacy' | 'domain';
  message: string;
}): Promise<string> {
  const id = sanitizeId(`msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const path = `contactMessages/${id}`;
  try {
    await setDoc(doc(db, 'contactMessages', id), {
      id,
      name: clampString(params.name, 80),
      email: clampString(params.email, 160),
      topic: params.topic,
      message: clampString(params.message, 2000),
      createdAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchPublishedBlogArticles(): Promise<BlogArticle[]> {
  const path = 'blogArticles';
  try {
    const q = query(
      collection(db, 'blogArticles'),
      where('status', '==', 'published'),
      limit(50),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as BlogArticle & { createdAt?: { toDate?: () => Date } };
      return {
        ...data,
        publishedDate: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString().slice(0, 10)
          : data.publishedDate || '2026-11-01',
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function fetchAllBlogArticlesAdmin(): Promise<BlogArticle[]> {
  const path = 'blogArticles';
  try {
    const q = query(collection(db, 'blogArticles'), limit(100));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data() as BlogArticle & { createdAt?: { toDate?: () => Date } };
      return {
        ...data,
        publishedDate: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString().slice(0, 10)
          : data.publishedDate || '2026-11-01',
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveBlogArticle(article: {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogArticle['category'];
  content: string;
  authorName: string;
  readMinutes: number;
  status: 'draft' | 'published';
}): Promise<string> {
  const id = sanitizeId(`art_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`);
  const path = `blogArticles/${id}`;
  try {
    await setDoc(doc(db, 'blogArticles', id), {
      id,
      slug: article.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 120),
      title: clampString(article.title, 140),
      excerpt: clampString(article.excerpt, 320),
      category: article.category,
      content: clampString(article.content, 25000),
      authorName: clampString(article.authorName, 60),
      readMinutes: Math.min(60, Math.max(1, Math.round(article.readMinutes))),
      status: article.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateBlogArticleStatus(
  id: string,
  status: 'draft' | 'published',
): Promise<void> {
  const path = `blogArticles/${id}`;
  try {
    await updateDoc(doc(db, 'blogArticles', id), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
