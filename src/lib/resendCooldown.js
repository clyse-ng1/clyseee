import { useCallback, useEffect, useState } from "react";

export const RESEND_COOLDOWN_SECONDS = 60;
const storageKey = (flow) => `clyse.resend-until.${flow}`;

function remainingFor(flow) {
  if (typeof window === "undefined") return 0;
  try {
    const until = Number(window.sessionStorage.getItem(storageKey(flow))) || 0;
    return Math.max(0, Math.ceil((until - Date.now()) / 1000));
  } catch {
    return 0;
  }
}

export function startResendCooldown(flow) {
  const until = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
  try {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(storageKey(flow), String(until));
    }
  } catch {
    // Storage may be disabled; the resend button still observes local state.
  }
  return RESEND_COOLDOWN_SECONDS;
}

export function formatCooldown(seconds) {
  const safe = Math.max(0, Math.floor(seconds || 0));
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
}

export function useResendCooldown(flow) {
  const [remaining, setRemaining] = useState(() => remainingFor(flow));

  useEffect(() => {
    const update = () => setRemaining(remainingFor(flow));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [flow]);

  const start = useCallback(() => {
    setRemaining(startResendCooldown(flow));
  }, [flow]);

  return { remaining, start };
}
