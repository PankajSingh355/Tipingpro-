import { CheckCircle2, Send } from 'lucide-react';
import React, { useState } from 'react';
import { submitContactMessage } from '../lib/firestoreService.ts';

export function ContactView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<'general' | 'bug' | 'feedback' | 'privacy' | 'domain'>('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (name.trim().length < 2) {
      setErrorMsg('Please enter your name (at least 2 characters).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setErrorMsg('Please write a message of at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const apiRes = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      if (!apiRes.ok) {
        const data = (await apiRes.json()) as { error?: string };
        throw new Error(data.error || 'Validation failed.');
      }

      await submitContactMessage({ name, email, topic, message });
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Could not send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/60 dark:bg-emerald-950/50"
      >
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 dark:text-emerald-400" />
        <h3 className="mt-2 font-display text-xl font-bold text-slate-900 dark:text-white">
          Message Received
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Thank you for contacting TypingPro. Your inquiry has been saved securely.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
        Send a Message
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Your Name
          </label>
          <input
            id="contact-name"
            type="text"
            required
            maxLength={80}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <input
            id="contact-email"
            type="email"
            required
            maxLength={160}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Topic
        </label>
        <select
          id="contact-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value as typeof topic)}
          className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        >
          <option value="general">General Question</option>
          <option value="feedback">Passage or Feature Suggestion</option>
          <option value="bug">Report a Technical Issue</option>
          <option value="privacy">Privacy or Account Data Request</option>
          <option value="domain">Partnership or Custom Domain Inquiry</option>
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white p-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
        />
      </div>

      {errorMsg && (
        <div role="alert" className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
