import { ArrowLeft, BookOpen, PenSquare, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { DEFAULT_BLOG_ARTICLES } from '../data/blogArticles.ts';
import {
  fetchAllBlogArticlesAdmin,
  fetchPublishedBlogArticles,
  saveBlogArticle,
  updateBlogArticleStatus,
} from '../lib/firestoreService.ts';
import type { BlogArticle, BlogCategory } from '../types/typing.ts';

interface BlogViewProps {
  activeSlug?: string;
  onNavigate: (path: string) => void;
}

const CATEGORIES: ('All' | BlogCategory)[] = [
  'All',
  'Typing Tips',
  'English Typing',
  'Hindi Typing',
  'Typing Speed',
  'Student Guides',
  'Exam Preparation',
];

function renderArticleBody(content: string) {
  const blocks = content.split('\n\n');
  return blocks.map((block, idx) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="mt-6 font-display text-xl font-bold text-slate-900 dark:text-white">
          {trimmed.replace('### ', '')}
        </h3>
      );
    }
    if (trimmed.split('\n').every((line) => line.trim().startsWith('- ') || /^\d+\.\s/.test(line.trim()))) {
      const items = trimmed.split('\n');
      return (
        <ul key={idx} className="mt-3 list-disc space-y-2 pl-5 text-base leading-relaxed text-slate-700 dark:text-slate-300">
          {items.map((line, i) => (
            <li key={i}>{line.replace(/^-\s+|^\d+\.\s+/, '').replace(/\*\*/g, '')}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={idx} className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        {trimmed.replace(/\*\*/g, '')}
      </p>
    );
  });
}

export function BlogView({ activeSlug, onNavigate }: BlogViewProps) {
  const { isAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<'All' | BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cloudArticles, setCloudArticles] = useState<BlogArticle[]>([]);
  const [adminOpen, setAdminOpen] = useState(false);

  // Admin draft composer state
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSlug, setDraftSlug] = useState('');
  const [draftCategory, setDraftCategory] = useState<BlogCategory>('Typing Tips');
  const [draftExcerpt, setDraftExcerpt] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [draftStatusMsg, setDraftStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    const loader = isAdmin ? fetchAllBlogArticlesAdmin : fetchPublishedBlogArticles;
    void loader()
      .then((rows) => setCloudArticles(rows))
      .catch(() => {});
  }, [isAdmin]);

  const allArticles = useMemo(() => {
    const map = new Map<string, BlogArticle>();
    for (const a of DEFAULT_BLOG_ARTICLES) map.set(a.slug, a);
    for (const a of cloudArticles) map.set(a.slug, a);
    return Array.from(map.values()).filter((a) => a.status === 'published' || isAdmin);
  }, [cloudArticles, isAdmin]);

  const activeArticle = useMemo(() => {
    if (!activeSlug) return null;
    return allArticles.find((a) => a.slug === activeSlug) || null;
  }, [allArticles, activeSlug]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter((a) => {
      if (a.status !== 'published' && !isAdmin) return false;
      if (selectedCategory !== 'All' && a.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allArticles, selectedCategory, searchQuery, isAdmin]);

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setDraftStatusMsg(null);
    try {
      const slug = (draftSlug.trim() || draftTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')).replace(
        /^-|-$/g,
        '',
      );
      await saveBlogArticle({
        slug,
        title: draftTitle,
        excerpt: draftExcerpt,
        category: draftCategory,
        content: draftContent,
        authorName: 'TypingPro Editorial Team',
        readMinutes: Math.max(2, Math.ceil(draftContent.split(/\s+/).length / 180)),
        status: 'draft', // Never auto-published without explicit review
      });
      setDraftStatusMsg('Saved as Draft for review. Use the Publish button below after reviewing.');
      setDraftTitle('');
      setDraftSlug('');
      setDraftExcerpt('');
      setDraftContent('');
      const refreshed = await fetchAllBlogArticlesAdmin();
      setCloudArticles(refreshed);
    } catch (err) {
      setDraftStatusMsg(err instanceof Error ? err.message : 'Unable to save draft.');
    }
  };

  if (activeSlug && activeArticle) {
    return (
      <article className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={() => onNavigate('/blog/')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Articles
        </button>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{activeArticle.category}</span>
          <span aria-hidden="true">·</span>
          <span>{activeArticle.readMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>Published {activeArticle.publishedDate}</span>
          {activeArticle.status === 'draft' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">Draft</span>
            </>
          )}
        </div>

        <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
          {activeArticle.title}
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          By {activeArticle.authorName}
        </p>

        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
          {renderArticleBody(activeArticle.content)}
        </div>

        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Practice What You Just Read
          </h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Apply these techniques immediately in a 1-minute or 5-minute typing session.
          </p>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('/typing-test/')}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Take Typing Test
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/typing-lessons/')}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              Open Lessons
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <label htmlFor="blog-search" className="sr-only">
              Search typing articles
            </label>
            <input
              id="blog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles on speed, Hindi Unicode, exams..."
              className="h-10 w-full rounded-xl border border-slate-300 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setAdminOpen((v) => !v)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
            >
              <PenSquare className="h-4 w-4" />
              {adminOpen ? 'Hide Editorial Composer' : 'Editorial Draft Composer'}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white dark:bg-blue-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Admin Editorial Draft Workflow */}
      {isAdmin && adminOpen && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            Editorial Article Composer (Saves as Draft for Review)
          </h3>
          <form onSubmit={handleSaveDraft} className="mt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="draft-title" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Article Title
                </label>
                <input
                  id="draft-title"
                  type="text"
                  required
                  minLength={10}
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="draft-cat" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  id="draft-cat"
                  value={draftCategory}
                  onChange={(e) => setDraftCategory(e.target.value as BlogCategory)}
                  className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="draft-slug" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                URL Slug (optional)
              </label>
              <input
                id="draft-slug"
                type="text"
                value={draftSlug}
                onChange={(e) => setDraftSlug(e.target.value)}
                placeholder="e.g. hindi-inscript-layout-guide"
                className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="draft-excerpt" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Summary Excerpt (20–320 chars)
              </label>
              <input
                id="draft-excerpt"
                type="text"
                required
                minLength={20}
                value={draftExcerpt}
                onChange={(e) => setDraftExcerpt(e.target.value)}
                className="mt-1 h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <div>
              <label htmlFor="draft-content" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Article Content (min 100 chars)
              </label>
              <textarea
                id="draft-content"
                rows={5}
                required
                minLength={100}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save Draft for Review
            </button>
            {draftStatusMsg && (
              <p className="text-xs text-slate-600 dark:text-slate-300">{draftStatusMsg}</p>
            )}
          </form>
        </section>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-blue-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700"
          >
            <div>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>{article.category}</span>
                <span aria-hidden="true">·</span>
                <span>{article.readMinutes} min read</span>
                <span aria-hidden="true">·</span>
                <span>{article.publishedDate}</span>
              </div>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug text-slate-900 dark:text-white">
                <a
                  href={`/blog/${article.slug}/`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(`/blog/${article.slug}/`);
                  }}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {article.title}
                </a>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {article.excerpt}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <a
                href={`/blog/${article.slug}/`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/blog/${article.slug}/`);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Read Article
              </a>

              {isAdmin && cloudArticles.some((ca) => ca.id === article.id) && (
                <button
                  type="button"
                  onClick={() => {
                    const nextStatus = article.status === 'published' ? 'draft' : 'published';
                    void updateBlogArticleStatus(article.id, nextStatus).then(async () => {
                      const refreshed = await fetchAllBlogArticlesAdmin();
                      setCloudArticles(refreshed);
                    });
                  }}
                  className="text-xs font-semibold text-amber-600 hover:underline dark:text-amber-400"
                >
                  {article.status === 'published' ? 'Unpublish' : 'Publish Reviewed Draft'}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
