import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import { api, fmtDay } from "../lib/api";

/* Notification center — Figma 889:87140. Rows come from
   GET /member/notifications; Figma content shows while they load. */
const SUB = "Stay Connected with your creators and members";

const FIG_STATIC = [
  { icon: "group", title: "Group Update", sub: "The next renews of Netflix Subscription" },
  { icon: "payment", title: "Payment Received", sub: "You received a payment of N2,200 from Aisha" },
  { icon: "member", title: "New Member", sub: "Tolu Adeyemi joined your group" },
  {
    icon: "system",
    title: "System Update",
    sub: "We've updated our terms and conditions Please review them",
  },
  { icon: "payment", title: "Payment Received", sub: "You received a payment of N2,200 from Aisha" },
  { icon: "system", title: "Group updates", sub: "Updates about group activity" },
];

function ChatGlyph({ color }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4v-11Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersGlyph({ color }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.5" r="3.2" stroke={color} strokeWidth="2" />
      <path
        d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="9.5" r="2.6" stroke={color} strokeWidth="2" />
      <path d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CashGlyph({ color }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7" width="18" height="11" rx="2.5" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12.5" r="2.6" stroke={color} strokeWidth="2" />
      <path d="M6.5 10.5v.01M17.5 14.5v.01" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function RefreshGlyph({ color }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 3.5V8H15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICONS = {
  msg: { bg: "bg-[#DFFFE0]", glyph: <ChatGlyph color="#048B0B" /> },
  group: { bg: "bg-[#FDEED9]", glyph: <UsersGlyph color="#CB5300" /> },
  payment: { bg: "bg-[#DFFFE0]", glyph: <CashGlyph color="#048B0B" /> },
  member: { bg: "bg-[#E9E4FF]", glyph: <UsersGlyph color="#6A5ACD" /> },
  system: { bg: "bg-[#FBD9DC]", glyph: <RefreshGlyph color="#E31B00" /> },
};

function iconFor(n) {
  const c = `${n.category || ""} ${n.type || ""}`.toLowerCase();
  const t = `${n.title || ""}`.toLowerCase();
  if (c.includes("payout") || c.includes("payment") || c.includes("wallet") || t.includes("payment")) return "payment";
  if (c.includes("member") || t.includes("joined")) return "member";
  if (c.includes("group") || c.includes("subscription") || c.includes("waitlist")) return "group";
  if (c.includes("marketing") || c.includes("promo")) return "msg";
  return "system";
}

function Row({ icon, title, sub, date, unread, onOpen }) {
  const ic = ICONS[icon] || ICONS.system;
  const inner = (
    <>
      <span className={`grid h-[50px] w-[50px] flex-none place-items-center rounded-[12px] ${ic.bg}`}>
        {ic.glyph}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[20px] leading-[26px] font-semibold text-black xl:text-[25px] xl:leading-[35px]">
          {title}
        </span>
        <span className="mt-[3px] block text-[14px] leading-[20px] font-semibold text-[#6B6B6B] xl:text-[18px] xl:leading-[22px]">
          {sub}
        </span>
        {date && (
          <span className="mt-[2px] block text-[12px] leading-[16px] font-semibold text-[#999999]">
            {date}
          </span>
        )}
      </span>
      {unread && <span className="h-[12px] w-[12px] flex-none rounded-full bg-clyse" />}
    </>
  );
  const cls =
    "flex min-h-[100px] w-full items-center gap-[16px] rounded-[20px] border border-[#999999] bg-white px-[18px] py-[14px] text-left xl:h-[124px] xl:gap-[20px] xl:px-[21px] xl:py-0";
  if (onOpen) {
    return (
      <button type="button" onClick={onOpen} className={`${cls} transition hover:border-clyse`}>
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}

const PREF_LABELS = {
  waitlist: "Waitlist updates",
  groups: "Group activity",
  members: "New members",
  subscriptions: "Subscriptions & renewals",
  payouts: "Payouts & earnings",
  security: "Security alerts",
  marketing: "News & offers",
};

function Prefs({ prefs, onToggle }) {
  const entries = Object.entries(prefs || {});
  if (!entries.length) return null;
  return (
    <div className="mt-[35px] rounded-[20px] border border-[#999999] bg-white px-[21px] py-[24px]">
      <p className="text-[20px] leading-[26px] font-semibold text-black xl:text-[25px] xl:leading-[35px]">
        Notification Settings
      </p>
      <p className="mt-[4px] text-[14px] leading-[20px] font-semibold text-[#6B6B6B]">
        Choose which updates you receive in the app.
      </p>
      <div className="mt-[16px] flex flex-col gap-[12px]">
        {entries.map(([key, val]) => {
          const locked = val.mandatory === true;
          const on = val.in_app !== false;
          return (
            <div key={key} className="flex items-center gap-[12px]">
              <span className="min-w-0 flex-1 text-[16px] font-semibold text-ink xl:text-[18px]">
                {PREF_LABELS[key] || key}
                {locked && (
                  <span className="ml-[8px] text-[13px] font-semibold text-[#999999]">
                    (always on)
                  </span>
                )}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={PREF_LABELS[key] || key}
                disabled={locked}
                onClick={() => onToggle(key, !on)}
                className={`relative h-[22px] w-[48px] flex-none rounded-full transition ${
                  on ? "bg-clyse" : "bg-[#D9D9D9]"
                } ${locked ? "opacity-50" : ""}`}
              >
                <span
                  className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white transition-all ${
                    on ? "right-[3px]" : "left-[3px]"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function mapNotif(n) {
  return {
    id: n.id || n.notification_id,
    icon: iconFor(n),
    title: n.title || "Notification",
    sub: n.body || n.message || n.description || "",
    date: fmtDay(n.created_at) || "",
    unread: n.read === false || n.is_read === false,
  };
}

export default function Notifications() {
  const [items, setItems] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    let on = true;
    (async () => {
      const [n, p] = await Promise.all([
        api("/member/notifications?limit=20"),
        api("/member/notifications/preferences"),
      ]);
      if (!on) return;
      if (!n.error) {
        setItems((n.data?.notifications || n.data?.items || []).map(mapNotif));
        setCursor(n.data?.page?.next_cursor || null);
        setHasMore(!!n.data?.page?.has_more);
      } else {
        setItems([]);
      }
      if (!p.error) setPrefs(p.data?.preferences || p.data || null);
    })();
    return () => {
      on = false;
    };
  }, []);

  const markRead = async (ids) => {
    if (!ids.length) return;
    setItems((list) =>
      (list || []).map((r) => (ids.includes(r.id) ? { ...r, unread: false } : r)),
    );
    await api("/member/notifications/read", { method: "POST", body: { ids } });
  };

  const markAll = () => {
    const ids = (items || []).filter((r) => r.unread && r.id).map((r) => r.id);
    markRead(ids);
  };

  const loadMore = async () => {
    if (loadingMore || !cursor) return;
    setLoadingMore(true);
    const { data, error } = await api(
      `/member/notifications?limit=20&before=${encodeURIComponent(cursor)}`,
    );
    setLoadingMore(false);
    if (!error && data) {
      setItems((list) => [
        ...(list || []),
        ...(data.notifications || data.items || []).map(mapNotif),
      ]);
      setCursor(data.page?.next_cursor || null);
      setHasMore(!!data.page?.has_more);
    }
  };

  const togglePref = async (key, next) => {
    setPrefs((p) => ({ ...(p || {}), [key]: { ...(p || {})[key], in_app: next } }));
    const { error } = await api("/member/notifications/preferences", {
      method: "PUT",
      body: { [key]: { in_app: next } },
    });
    if (error) {
      setPrefs((p) => ({ ...(p || {}), [key]: { ...(p || {})[key], in_app: !next } }));
    }
  };

  const rows = items || FIG_STATIC;
  const unreadCount = (items || []).filter((r) => r.unread).length;

  const list = (
    <div className="flex flex-col gap-[15px]">
      {rows.map((r, i) => (
        <Row
          key={r.id || `${r.title}-${i}`}
          {...r}
          onOpen={r.id && r.unread ? () => markRead([r.id]) : undefined}
        />
      ))}
      {items && items.length === 0 && (
        <p className="rounded-[20px] border border-[#999999] bg-white px-[18px] py-[30px] text-center text-[16px] font-semibold text-[#6B6B6B]">
          You&apos;re all caught up — no notifications yet.
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px]">
          <Sidebar active="Notification" />
          <div className="w-[830px] flex-none">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-[35px] leading-[43px] font-bold text-black">
                  Notification
                </h1>
                <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  {SUB}
                </p>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  className="flex-none text-[16px] font-semibold text-clyse transition hover:opacity-70"
                >
                  Mark all as read ({unreadCount})
                </button>
              )}
            </div>
            <div className="mt-[50px] rounded-[20px] bg-white px-[40px] py-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              {list}
              {hasMore && (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="mt-[24px] w-full text-center text-[16px] font-semibold text-clyse disabled:opacity-50"
                >
                  {loadingMore ? "Loading…" : "Show older notifications"}
                </button>
              )}
              <Link
                to="/groups/manage"
                className="mt-[35px] flex h-[60px] w-[356px] items-center justify-center gap-[20px] rounded-[10px] border border-clyse bg-white text-[18px] font-semibold text-ink transition hover:bg-mint"
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="#048B0B" strokeWidth="1.8" />
                  <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="#048B0B" strokeWidth="1.8" />
                  <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="#048B0B" strokeWidth="1.8" />
                  <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="#048B0B" strokeWidth="1.8" />
                </svg>
                Manage Group
              </Link>
              <Prefs prefs={prefs} onToggle={togglePref} />
            </div>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
          <div className="mt-[14px] flex h-[33px] items-center justify-center rounded-[5px] border border-line bg-white">
            <svg width="16" height="8" viewBox="0 0 19 9" fill="none" aria-hidden>
              <path
                d="M1.5 1.5 9.5 7.5l8-6"
                stroke="#6B6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-[30px] flex items-end justify-between gap-[12px]">
            <div>
              <h1 className="text-[20px] leading-[25px] font-bold text-black">
                Notification
              </h1>
              <p className="text-[14px] leading-[20px] font-semibold text-[#6B6B6B]">
                {SUB}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAll}
                className="flex-none text-[14px] font-semibold text-clyse"
              >
                Mark all read ({unreadCount})
              </button>
            )}
          </div>
          <div className="mt-[30px] flex flex-col gap-[10px]">
            {rows.map((r, i) => (
              <Row
                key={r.id || `${r.title}-${i}`}
                {...r}
                onOpen={r.id && r.unread ? () => markRead([r.id]) : undefined}
              />
            ))}
            {items && items.length === 0 && (
              <p className="rounded-[20px] border border-[#999999] bg-white px-[18px] py-[30px] text-center text-[14px] font-semibold text-[#6B6B6B]">
                You&apos;re all caught up — no notifications yet.
              </p>
            )}
          </div>
          {hasMore && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-[16px] w-full text-center text-[14px] font-semibold text-clyse disabled:opacity-50"
            >
              {loadingMore ? "Loading…" : "Show older notifications"}
            </button>
          )}
          <Link
            to="/groups/manage"
            className="mt-[24px] flex h-[55px] w-full items-center justify-center gap-[12px] rounded-[10px] border border-clyse bg-white text-[16px] font-semibold text-ink"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="#048B0B" strokeWidth="1.8" />
              <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="#048B0B" strokeWidth="1.8" />
              <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="#048B0B" strokeWidth="1.8" />
              <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="#048B0B" strokeWidth="1.8" />
            </svg>
            Manage Group
          </Link>
          <Prefs prefs={prefs} onToggle={togglePref} />
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
