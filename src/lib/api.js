/* Clyse API client — https://clyseapidocs.vercel.app
 * Base URL + session handling + typed fetch wrapper.
 * Override the base URL with VITE_API_URL in a .env file if needed. */

export const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://axjugqtzmnvjnhswejij.supabase.co/functions/v1";

const SESSION_KEY = "clyse.session";

/* ---------- session storage ---------- */

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

/* ---------- token refresh (single-flight: concurrent callers share one refresh) ---------- */

let refreshPromise = null;

export async function refreshSession() {
  const current = getSession();
  if (!current?.refresh_token) return null;
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch(`${API_BASE}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: current.refresh_token }),
        });
        const json = await res.json().catch(() => null);
        // Refresh rotates both tokens: { data: { session: { access_token,
        // refresh_token, expires_at }, user } } — expires_at is unix seconds.
        const rotated = json?.data?.session;
        if (!res.ok || !rotated?.access_token) {
          setSession(null);
          return null;
        }
        const next = {
          access_token: rotated.access_token,
          refresh_token: rotated.refresh_token,
          expires_at: rotated.expires_at,
        };
        setSession(next);
        return next;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

function expiresSoon(session) {
  if (session?.expires_at == null) return false;
  // expires_at is unix seconds (fall back to ISO parsing for safety).
  const t =
    typeof session.expires_at === "number"
      ? session.expires_at * 1000
      : Date.parse(session.expires_at);
  if (Number.isNaN(t)) return false;
  return t - Date.now() < 60_000; // refresh if < 60s of life left (tokens live 15 min)
}

/* ---------- fetch wrapper ----------
 * Returns { data, error, status }. Always branch on error.code, display error.message.
 * On 401 with a stale token it refreshes once and retries automatically. */

export async function api(
  path,
  { method = "GET", body, auth = true, raw = false, contentType } = {},
) {
  let session = getSession();
  if (auth && session && expiresSoon(session)) {
    session = (await refreshSession()) || null;
  }

  const buildHeaders = (token) => {
    const headers = {};
    if (!raw) headers["Content-Type"] = "application/json";
    if (contentType) headers["Content-Type"] = contentType;
    if (auth && token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const doFetch = (token) =>
    fetch(`${API_BASE}${path}`, {
      method,
      headers: buildHeaders(token),
      body: raw ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res;
  try {
    res = await doFetch(session?.access_token);
  } catch {
    return {
      data: null,
      status: 0,
      error: {
        code: "network_error",
        message: "Could not reach the server. Check your connection and try again.",
      },
    };
  }

  // One automatic retry after a silent refresh (never for the refresh call itself).
  if (res.status === 401 && auth && session?.access_token && path !== "/auth/refresh") {
    const next = await refreshSession();
    if (next?.access_token) {
      try {
        res = await doFetch(next.access_token);
      } catch {
        return {
          data: null,
          status: 0,
          error: {
            code: "network_error",
            message: "Could not reach the server. Check your connection and try again.",
          },
        };
      }
    }
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json) {
    const err = json?.error || {
      code: `http_${res.status}`,
      message: "Something went wrong. Please try again.",
    };
    // Backend sets Retry-After (seconds) on 429 — surface it so callers can
    // tell the user when to retry. We never auto-retry, so it is respected.
    if (res.status === 429) {
      const ra = Number(res.headers.get("Retry-After"));
      if (Number.isFinite(ra) && ra > 0) {
        err.retryAfter = Math.floor(ra);
        err.message = `${err.message} Try again in ${Math.floor(ra)}s.`;
      }
    }
    return { data: null, status: res.status, error: err };
  }
  return { data: json.data ?? null, error: json.error || null, status: res.status };
}

/* ---------- formatting helpers ---------- */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** kobo (integer) -> "₦2,200" */
export function kobo(amountKobo) {
  const n = Number(amountKobo) || 0;
  return `₦${(n / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;
}

/** ISO date -> "25 Sep 2026" (design format) */
export function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Masked-safe display name fallback */
export function displayName(user) {
  if (!user) return "";
  return user.full_name || user.first_name || (user.email ? user.email.split("@")[0] : "") || "";
}

/** "Email or Username" field -> { email } or { phone } identifier for the API. */
export function idOf(value) {
  const v = (value || "").trim();
  return v.includes("@") ? { email: v } : { phone: v };
}

/** API service ({ name, slug }) -> BrandTile key, or null for the generic tile. */
export function brandOf(service) {
  const s = `${service?.slug || ""} ${service?.name || ""}`.toLowerCase();
  if (s.includes("netflix")) return "netflix";
  if (s.includes("spotify")) return "spotify";
  if (s.includes("youtube")) return "youtube";
  if (s.includes("prime")) return "prime";
  if (s.includes("canva")) return "canva";
  if (s.includes("capcut") || s.includes("cap cut")) return "capcut";
  if (s.includes("adobe")) return "adobe";
  if (s.includes("amazon")) return "amazon";
  return null;
}

/** Whole days from now until an ISO date (0 if past, null if unknown). */
export function daysUntil(iso) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.ceil((t - Date.now()) / 86400000));
}

/** ISO date -> "20/11/2026" (member-since format). */
export function fmtDay(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** access_method -> Figma card label. */
export function accessLabel(method) {
  if (method === "credentials") return "Login Credential";
  if (method === "invite_link") return "Invite Link";
  if (!method) return "";
  return method
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** kobo -> "₦10,000.00" (wallet/ledger format with decimals) */
export function kobo2(amountKobo) {
  const n = Number(amountKobo) || 0;
  return `₦${(n / 100).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** ISO -> "Sep 28, 2025 · 04:12 PM" (transaction row format) */
export function fmtTx(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  let h = d.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const p = (n) => String(n).padStart(2, "0");
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} · ${p(h)}:${p(d.getMinutes())} ${ampm}`;
}

/** kobo -> "124,000" (plain grouped naira, no symbol — EarnMini format) */
export function nairaNum(amountKobo) {
  const n = Number(amountKobo) || 0;
  return (n / 100).toLocaleString("en-NG", { maximumFractionDigits: 2 });
}
