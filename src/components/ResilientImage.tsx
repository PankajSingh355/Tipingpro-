import { Keyboard } from 'lucide-react';
import { useState } from 'react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

export function ResilientImage({ src, alt, className = '', eager = false }: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 p-6 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 ${className}`}
      >
        <Keyboard className="h-8 w-8" />
        <span className="text-center text-xs font-medium">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading={eager ? 'eager' : 'lazy'}
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
