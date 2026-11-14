# TypingPro Firestore Security Specification

## 1. Data Invariants
1. **PII Isolation**: User profile documents (`/users/{userId}`) may contain `email` and account preferences; only the owning `request.auth.uid == userId` (or verified admin) may read or write them. Public leaderboard entries (`/leaderboard/{entryId}`) must NEVER contain email addresses or private account data.
2. **Ownership Integrity**: Every `/users/{userId}/sessions/{sessionId}` document must belong to `userId` (`data.userId == userId == request.auth.uid`), reference an existing parent `/users/{userId}` document (`exists(...)`), and enforce `createdAt == request.time`.
3. **Immutable History & Creation Fields**: `uid`, `userId`, `id`, and `createdAt` are immutable once created. `TypingSession` records are append-only/deletable by owner, never silently altered to inflate scores.
4. **Leaderboard Anti-Cheat Bounds**: Leaderboard entries require `netWpm >= 5 && netWpm <= 220`, `grossWpm >= netWpm && grossWpm <= 250`, `accuracy >= 80 && accuracy <= 100`, `durationSec in [60, 120, 180, 300, 600]`, and a 64-char hex `verificationDigest` issued after server-side keystroke telemetry verification.
5. **Editorial Review Gate**: `blogArticles` with `status == 'draft'` are readable only by verified admins (`pg975674@gmail.com` with `email_verified == true` or `/admins/{uid}`), preventing unreviewed drafts from leaking publicly.
6. **Bounded Strings & Strict Keys**: Every document enforces `keys().hasAll(...)` and `keys().hasOnly(...)` on `create` and `affectedKeys().hasOnly(...)` on `update` to eliminate shadow/ghost fields and oversized Denial-of-Wallet payloads.

## 2. "Dirty Dozen" Attack Payloads (All Must Fail with PERMISSION_DENIED)
1. **Unauthenticated Profile Read**: Guest requests `get /users/user123`.
2. **Cross-User Profile Read (PII Leak)**: Signed-in `userA` requests `get /users/userB`.
3. **Blanket User List Scraping**: Signed-in `userA` requests `list /users`.
4. **Shadow Field Injection on Profile**: `userA` writes `/users/userA` with `{ ..., isAdmin: true }`.
5. **UID Spoofing on Session**: `userA` creates `/users/userA/sessions/s1` with `userId: "userB"`.
6. **Orphaned Session Without Parent Profile**: `userA` creates `/users/userA/sessions/s1` before `/users/userA` exists.
7. **Timestamp Forgery**: `userA` creates session with backdated `createdAt` instead of `request.time`.
8. **Score Inflation / Impossible WPM on Leaderboard**: `userA` writes `/leaderboard/e1` with `netWpm: 999`.
9. **Missing Verification Digest on Leaderboard**: `userA` writes `/leaderboard/e1` with `verificationDigest: "fake"`.
10. **PII Leak in Contact Messages**: Guest or non-admin user requests `get /contactMessages/m1` or `list /contactMessages`.
11. **Unverified Admin Email Spoof**: User with `email: "pg975674@gmail.com"` and `email_verified: false` tries to create `/blogArticles/a1`.
12. **Path ID Poisoning**: `userA` attempts write to `/users/userA/sessions/invalid$id!withSpacesAndOver128Chars...`.
