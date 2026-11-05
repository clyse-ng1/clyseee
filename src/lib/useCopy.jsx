import { useCallback, useEffect, useRef, useState } from "react";

/* Copy to clipboard with a short-lived "Copied" flag so the UI can confirm it.
   Every copy affordance used to fail silently — users couldn't tell whether the
   group ID / invite link had actually been copied. */
export function useCopy(ms = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(
    async (text) => {
      if (!text) return false;
      try {
        if (navigator.clipboard) await navigator.clipboard.writeText(text);
        else return false;
      } catch {
        return false;
      }
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), ms);
      return true;
    },
    [ms],
  );
  return { copied, copy };
}

/* Fixed confirmation pill — one per screen, shown while `show` is true. */
export function CopiedPill({ show, label = "Copied to clipboard" }) {
  if (!show) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[28px] left-1/2 z-[60] flex h-[44px] -translate-x-1/2 items-center gap-[8px] rounded-full bg-[#001701] px-[22px] text-[14px] font-semibold text-[#DFFFE1] shadow-[0_10px_30px_rgba(0,23,1,0.35)]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="m5 13 4 4L19 7" stroke="#DFFFE1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </div>
  );
}
