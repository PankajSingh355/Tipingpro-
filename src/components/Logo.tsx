export function TypingProLogo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="2"
          y="2"
          width="24"
          height="24"
          rx="6"
          className="fill-blue-600 dark:fill-blue-500"
        />
        <rect
          x="4.5"
          y="4.5"
          width="19"
          height="16.5"
          rx="3.5"
          className="fill-white/15"
        />
        <path
          d="M9 10H19M14 10V18.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <rect x="17.5" y="15.5" width="2" height="3.5" rx="0.75" fill="#BFDBFE" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
        TypingPro
      </span>
    </span>
  );
}
