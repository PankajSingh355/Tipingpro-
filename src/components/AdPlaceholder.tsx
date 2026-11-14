interface AdPlaceholderProps {
  slotName: string;
  enabled?: boolean;
}

/**
 * Disabled AdSense-ready container. Remains inactive with zero fake ad code
 * until the site owner receives AdSense approval and supplies a verified Publisher ID.
 * Never rendered inside typing test input areas or interactive game stages.
 */
export function AdPlaceholder({ slotName, enabled = false }: AdPlaceholderProps) {
  if (!enabled) {
    return (
      <aside
        aria-label={`Advertisement slot placeholder (${slotName})`}
        data-ad-slot={slotName}
        data-ad-status="disabled"
        className="mx-auto my-6 max-w-4xl rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-3 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400"
      >
        Advertisement Slot ({slotName}) — Disabled until AdSense approval and owner configuration
      </aside>
    );
  }

  return null;
}
