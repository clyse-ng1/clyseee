import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, kobo } from "../lib/api";
import AdminShell from "../components/AdminShell";
import DropSelect from "../components/DropSelect";

/* Admin / CMS dashboard — Figma 1054:20187 (1440x1548, desktop only).
   Live data: GET /admin/dashboard?from=&to= drives every card, the alert
   list and recent activity; the revenue/payout chart is bucketed by month
   from the real transaction and payout ledgers for the selected range.
   Nothing is invented: while the API is in flight the cards show "…", and
   an error or an empty range renders "—"/an honest empty note instead of
   Figma's dummy numbers. Copy fixes: "Eearning" -> "Earning", "Neflix" ->
   "Netflix", "attion" -> "attention", "regisrtered" -> "registered",
   "Sep. 1 206" -> "Sep. 1 2026". */

function G({ children }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  );
}

const stroke = "#46C04C";
function IconWallet() {
  return (
    <G>
      <rect x="3" y="6.5" width="18" height="12" rx="2.5" stroke={stroke} strokeWidth="1.8" />
      <path d="M3 10h18M16.5 14.5h.01" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
function ChevDown({ color = "#FFFFFF" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="m6 9 6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatGlyph({ d }) {
  return d;
}
function UsersGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.5" r="3.2" stroke={color} strokeWidth="2" />
      <path d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16.5" cy="9.5" r="2.6" stroke={color} strokeWidth="2" />
      <path d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function UserCheckGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8.5" r="3.5" stroke={color} strokeWidth="2" />
      <path d="M3.5 19.5c.7-3.4 3.2-5.3 6.5-5.3 1 0 2 .2 2.8.6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="m14.5 17.5 2 2 3.5-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckCircleGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="2" />
      <path d="m8.5 12.2 2.5 2.5 4.8-5.4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WarnGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.5 2.5 20h19L12 3.5Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9.5v5M12 17.5v.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BadgeGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="6" stroke={color} strokeWidth="2" />
      <path d="m9.5 15-2 5.5 4.5-2.5 4.5 2.5-2-5.5" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="m10 10 1.5 1.5L14.5 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HourGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M6.5 3.5h11M6.5 20.5h11M8 3.5v3l4 4 4-4v-3M8 20.5v-3l4-4 4 4v3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClipGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="5" width="14" height="16" rx="2" stroke={color} strokeWidth="2" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="2" />
      <path d="M9 12h6M9 15.5h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BankGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M3.5 9.5 12 4l8.5 5.5M5 10.5V18M9.5 10.5V18M14.5 10.5V18M19 10.5V18M3.5 20.5h17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PercentGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M18.5 5.5 5.5 18.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="8" r="2.5" stroke={color} strokeWidth="2" />
      <circle cx="16" cy="16" r="2.5" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function ClockGlyph({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="2" />
      <path d="M12 7.5V12l3.2 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- range handling ---------- */

const pad = (v) => String(v).padStart(2, "0");
const isoDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/* Date-only filters are picked in the admin's own timezone (Lagos): parse the
   local wall-clock value and send the real UTC instant, same as the data
   pages. */
const toInstant = (day, end = false) => new Date(`${day}T${end ? "23:59:59" : "00:00:00"}`).toISOString();

function rangeOptions() {
  const now = new Date();
  const back = new Date(now);
  back.setDate(back.getDate() - 89);
  return [
    { label: "Sep. 1 2026 - Sep. 30 2026", from: "2026-09-01", to: "2026-09-30" },
    { label: "Aug. 1 2026 - Aug. 31 2026", from: "2026-08-01", to: "2026-08-31" },
    { label: "Jul. 1 2026 - Jul. 31 2026", from: "2026-07-01", to: "2026-07-31" },
    { label: "Last 90 days", from: isoDay(back), to: isoDay(now) },
  ];
}

/* ---------- defensive readers for the dashboard's nested metrics ---------- */

const num = (v) => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const pick = (obj, keys) => {
  if (!obj || typeof obj !== "object") return null;
  for (const k of keys) {
    const hit = num(obj[k]);
    if (hit != null) return hit;
  }
  return null;
};
const fmtCount = (v) => (v == null ? "—" : v.toLocaleString("en-US"));
const fmtMoney = (koboValue) => (koboValue == null ? "—" : kobo(koboValue));
const labelOf = (key) =>
  String(key).replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const relTime = (value) => {
  if (!value) return "—";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "—";
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(then).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

/* Use a consistent Jan–Dec axis for the selected calendar year like the
   Figma dashboard; the plotted values still come only from the selected API range. */
const rangeMonths = (fromDay) => {
  const year = new Date(`${fromDay}T00:00:00`).getFullYear();
  return Array.from({ length: 12 }, (_, m) => ({ y: year, m }));
};

function LightCard({ c }) {
  return (
    <div className="flex flex-col items-center rounded-[10px] border border-[#CCCCCC] bg-white px-[16px] pt-[27px] pb-[22px] text-center">
      <span className={`grid h-[56px] w-[56px] place-items-center rounded-full ${c.bg}`}>
        <StatGlyph d={c.glyph} />
      </span>
      <p className="mt-[8px] text-[15px] leading-[18px] font-semibold text-[#6B6B6B]">
        {c.label}
      </p>
      <p className="mt-[4px] text-[32px] leading-[38px] font-bold text-ink">{c.value}</p>
      <p className="mt-[2px] text-[13px] leading-[16px] font-semibold text-[#6B6B6B]">
        For selected range
      </p>
    </div>
  );
}

function DarkCard({ c }) {
  return (
    <div className="bg-btn flex flex-col items-center rounded-[10px] px-[16px] pt-[24px] pb-[24px] text-center">
      <span className="grid h-[56px] w-[56px] place-items-center rounded-full bg-white">
        {c.glyph}
      </span>
      <p className="mt-[12px] text-[15px] leading-[18px] font-semibold text-mint">
        {c.label}
      </p>
      <p className="mt-[4px] text-[30px] leading-[37px] font-bold text-mint">{c.value}</p>
      <p className="mt-[6px] text-[13px] leading-[16px] font-semibold text-mint">
        For selected range
      </p>
    </div>
  );
}

/* Revenue = posted member payments (subscription payments + platform fees);
   payout = paid creator payouts, bucketed by calendar month of the range. */
function Chart({ months, revenue, payout, loading }) {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const W = 525;
  const H = 258;
  const left = 36;
  const right = 520;
  const top = 20;
  const bottom = 240;
  const n = months.length;
  const revVals = months.map((mo) => revenue.get(`${mo.y}-${mo.m}`) || 0);
  const payVals = months.map((mo) => payout.get(`${mo.y}-${mo.m}`) || 0);
  const max = Math.max(0, ...revVals, ...payVals);
  const axisMax = max > 0 ? Math.pow(10, Math.ceil(Math.log10(max))) : 1_000_000_000;
  const compactMoney = (koboValue) => {
    const naira = koboValue / 100;
    if (naira >= 1_000_000) return `${Number((naira / 1_000_000).toFixed(naira >= 10_000_000 ? 0 : 1))}M`;
    if (naira >= 1_000) return `${Number((naira / 1_000).toFixed(naira >= 10_000 ? 0 : 1))}K`;
    return naira.toLocaleString("en-NG");
  };
  const x = (i) => (n === 1 ? (left + right) / 2 : left + ((right - left) * i) / (n - 1));
  const y = (v) => bottom - ((bottom - top) * v) / axisMax;
  const line = (vals) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line(payVals)} L${x(n - 1).toFixed(1)} ${bottom} L${x(0).toFixed(1)} ${bottom} Z`;
  const revTotal = revVals.reduce((a, b) => a + b, 0);
  const payTotal = payVals.reduce((a, b) => a + b, 0);
  const empty = !loading && revTotal === 0 && payTotal === 0;
  return (
    <div>
      <div className="flex items-center">
        <p className="text-[18px] leading-[22px] font-bold text-white">Overview</p>
        <p className="ml-[60px] flex items-center gap-[6px] text-[14px] font-semibold text-white">
          <span className="h-[10px] w-[10px] rounded-full bg-white" /> Revenue
        </p>
        <p className="ml-[16px] flex items-center gap-[6px] text-[14px] font-semibold text-white">
          <span className="h-[10px] w-[10px] rounded-full bg-clyse" /> Payout
        </p>
        <span className="ml-auto" />
        <div className="flex items-center gap-[10px]">
          <span className="rounded-[6px] border border-white/60 bg-[#013104] px-[10px] py-[4px] text-[11px] font-bold text-white">
            Revenue {fmtMoney(revTotal)}
          </span>
          <span className="rounded-[6px] border border-[#46C04C] bg-[#013104] px-[10px] py-[4px] text-[11px] font-bold text-[#B1DBB3]">
            Payout {fmtMoney(payTotal)}
          </span>
        </div>
      </div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-[16px] w-full" role="img" aria-label="Revenue versus payout chart">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <line x1={left} y1={top + i * 40} x2={right} y2={top + i * 40} stroke="#FFFFFF" strokeOpacity="0.15" />
              <text x="0" y={top + i * 40 + 4} fill="#FFFFFF" fontSize="11" fontWeight="700">
                {i === 5 ? "0" : compactMoney(axisMax * (5 - i) / 5)}
              </text>
            </g>
          ))}
          {months.map((mo, i) => (
            <text key={`${mo.y}-${mo.m}`} x={x(i)} y={bottom + 8} fill={mo.m === 8 ? "#46C04C" : "#FFFFFF"} fontSize="11" fontWeight="700" textAnchor="middle">
              {MONTHS[mo.m]}
            </text>
          ))}
          {!empty && <path d={area} fill="#46C04C" fillOpacity="0.18" stroke="none" />}
          {!empty && <path d={line(payVals)} fill="none" stroke="#46C04C" strokeWidth="2.5" />}
          {!empty && <path d={line(revVals)} fill="none" stroke="#FFFFFF" strokeWidth="2.5" />}
          {!empty && payVals.map((v, i) => v > 0 && <circle key={`p${i}`} cx={x(i)} cy={y(v)} r="4" fill="#013104" stroke="#46C04C" strokeWidth="2.5" />)}
          {!empty && revVals.map((v, i) => v > 0 && <circle key={`r${i}`} cx={x(i)} cy={y(v)} r="4" fill="#013104" stroke="#FFFFFF" strokeWidth="2.5" />)}
        </svg>
        {empty && <p className="absolute inset-0 grid place-items-center pt-[16px] text-[14px] font-semibold text-white/75">{loading ? "Loading revenue and payout activity…" : "No revenue or payout activity was recorded in this range."}</p>}
      </div>
    </div>
  );
}

export default function Admin() {
  const nav = useNavigate();
  const [options] = useState(rangeOptions);
  const [range, setRange] = useState(options[0].label);
  const [dash, setDash] = useState({ status: "loading", data: null, error: "" });
  const [series, setSeries] = useState({ status: "loading", revenue: new Map(), payout: new Map() });

  const active = options.find((o) => o.label === range) || options[0];
  const fromQ = toInstant(active.from, false);
  const toQ = toInstant(active.to, true);

  useEffect(() => {
    let alive = true;
    setDash({ status: "loading", data: null, error: "" });
    api(`/admin/dashboard?from=${encodeURIComponent(fromQ)}&to=${encodeURIComponent(toQ)}`).then((res) => {
      if (!alive) return;
      if (res.error) setDash({ status: "error", data: null, error: res.error.message || "The dashboard could not be loaded." });
      else setDash({ status: "live", data: res.data || {}, error: "" });
    });
    return () => {
      alive = false;
    };
  }, [fromQ, toQ]);

  useEffect(() => {
    let alive = true;
    setSeries({ status: "loading", revenue: new Map(), payout: new Map() });
    const range = `from=${encodeURIComponent(fromQ)}&to=${encodeURIComponent(toQ)}&limit=100`;
    Promise.all([
      api(`/admin/finance/transactions?${range}`),
      api(`/admin/finance/payouts?${range}`),
    ]).then(([tx, po]) => {
      if (!alive) return;
      const revenue = new Map();
      const payout = new Map();
      const bump = (map, row) => {
        const d = new Date(row.created_at || row.createdAt || "");
        if (Number.isNaN(d.getTime())) return;
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        map.set(key, (map.get(key) || 0) + (Number(row.amount_kobo) || 0));
      };
      const txRows = tx.error ? [] : tx.data?.transactions || [];
      for (const t of txRows) {
        if (!/posted|successful|completed/i.test(String(t.status || ""))) continue;
        if (/refund|reversal/i.test(String(t.category || t.kind || ""))) continue;
        bump(revenue, t);
      }
      const poRows = po.error ? [] : po.data?.payouts || [];
      for (const p of poRows) {
        if (!/paid/i.test(String(p.status || ""))) continue;
        bump(payout, p);
      }
      setSeries({ status: tx.error && po.error ? "error" : "live", revenue, payout });
    });
    return () => {
      alive = false;
    };
  }, [fromQ, toQ]);

  const live = dash.status === "live" ? dash.data : null;
  const loading = dash.status === "loading";
  const pending = (v) => (loading ? "…" : fmtCount(v));
  const pendingMoney = (v) => (loading ? "…" : fmtMoney(v));

  /* Creator earnings for the range: released + available + pending (kobo). */
  const earningsTotal = useMemo(() => {
    const e = live?.earnings;
    if (!e || typeof e !== "object") return null;
    if (e.total_kobo != null) return num(e.total_kobo);
    const sum = ["released_kobo", "available_kobo", "pending_kobo"].reduce((a, k) => a + (num(e[k]) || 0), 0);
    return sum > 0 ? sum : null;
  }, [live]);

  const pendingTotal = useMemo(() => {
    if (!live?.pending_actions || typeof live.pending_actions !== "object") return pick(live?.pending_actions, ["total", "count"]);
    const sum = Object.values(live.pending_actions).reduce((a, v) => a + (num(v) || 0), 0);
    return sum > 0 ? sum : null;
  }, [live]);

  const ROW1 = [
    { bg: "bg-[#DFFFE0]", glyph: <UsersGlyph color="#048B0B" />, label: "Total User", value: pending(pick(live?.users, ["total", "count", "all"])) },
    { bg: "bg-[#E9E4FF]", glyph: <UserCheckGlyph color="#6A5ACD" />, label: "Active User", value: pending(pick(live?.users, ["active", "active_count"])) },
    { bg: "bg-[#DFFFE0]", glyph: <UsersGlyph color="#048B0B" />, label: "Total subscription Groups", value: pending(pick(live?.groups, ["total", "count"])) },
    { bg: "bg-[#DFFFE0]", glyph: <CheckCircleGlyph color="#048B0B" />, label: "Active Group", value: pending(pick(live?.groups, ["active", "active_count"])) },
  ];
  const ROW2 = [
    { bg: "bg-[#FBD9DC]", glyph: <WarnGlyph color="#E31B00" />, label: "Dispute", value: pending(pick(live?.disputes, ["open", "open_count", "total", "count"])) },
    { bg: "bg-[#DFFFE0]", glyph: <BadgeGlyph color="#048B0B" />, label: "Active Subscription / membership", value: pending(pick(live?.memberships, ["active", "active_count", "total", "count"])) },
    { bg: "bg-[#E9E4FF]", glyph: <HourGlyph color="#6A5ACD" />, label: "Waitlist Activity", value: pending(pick(live?.waitlist, ["new", "waiting", "total", "count"])) },
    { bg: "bg-[#E0EFFF]", glyph: <ClipGlyph color="#0087FF" />, label: "Pending Admin Actions", value: pending(pendingTotal) },
  ];
  const DARK = [
    { glyph: <BankGlyph color="#0087FF" />, label: "Creator's Earning", value: pendingMoney(earningsTotal) },
    { glyph: <PercentGlyph color="#CB5300" />, label: "Clyse fees", value: pendingMoney(pick(live?.fees, ["total_kobo", "fees_kobo", "total"])) },
    { glyph: <IconWallet />, label: "Wallet Funding Activity", value: pending(pick(live?.wallet, ["funded_count", "funding_count", "total_fundings", "count"])) },
    { glyph: <IconWallet />, label: "Subscription Payment Activity", value: pending(pick(live?.payments, ["count", "payments_count", "total_count"])) },
  ];
  const pendingPayout = pendingMoney(pick(live?.payouts, ["pending_kobo", "pending_total_kobo"])) !== "—"
    ? pendingMoney(pick(live?.payouts, ["pending_kobo", "pending_total_kobo"]))
    : pending(pick(live?.payouts, ["pending", "pending_count"]));

  /* Alert & action items from pending_actions plus the verification queue. */
  const alerts = useMemo(() => {
    if (!live) return null;
    const out = [];
    const pa = live.pending_actions && typeof live.pending_actions === "object" ? live.pending_actions : {};
    const ver = pick(live.groups, ["pending_verification", "pending_review", "awaiting_verification"])
      ?? pick(pa, ["verification", "groups_pending_verification", "pending_verification"]);
    if (ver) out.push([`${ver} group${ver === 1 ? "" : "s"} pending verification`, "Review & approve group submission", "/admin/group-verification"]);
    const disputes = pick(pa, ["disputes", "open_disputes"]) ?? pick(live.disputes, ["open", "open_count"]);
    if (disputes) out.push([`${disputes} open dispute${disputes === 1 ? "" : "s"}`, "Need resolution", "/admin/disputes"]);
    const support = pick(pa, ["support", "support_issues", "tickets"]) ?? pick(live.support, ["open", "open_count", "total"]);
    if (support) out.push([`${support} open support ticket${support === 1 ? "" : "s"}`, "Requires a reply", "/admin/data/support"]);
    for (const [k, v] of Object.entries(pa)) {
      if (out.length >= 4) break;
      if (["verification", "groups_pending_verification", "pending_verification", "disputes", "open_disputes", "support", "support_issues", "tickets", "total", "count"].includes(k)) continue;
      const count = num(v);
      if (count) {
        const route = /verif|review|group/i.test(k) ? "/admin/group-verification" : /dispute/i.test(k) ? "/admin/disputes" : /support|ticket/i.test(k) ? "/admin/data/support" : null;
        out.push([`${count} ${labelOf(k)}`, "Requires your attention", route]);
      }
    }
    return out;
  }, [live]);

  /* recent_activity is an object of buckets (users, groups, transactions, ...),
     each a list — flatten the newest few into one feed. */
  const activities = useMemo(() => {
    if (!live) return null;
    const raw = live.recent_activity;
    const buckets = Array.isArray(raw) ? { activity: raw } : raw && typeof raw === "object" ? raw : {};
    const items = [];
    for (const [bucket, rows] of Object.entries(buckets)) {
      if (!Array.isArray(rows)) continue;
      for (const r of rows) {
        if (!r || typeof r !== "object") continue;
        let title = "Activity";
        let sub = "—";
        if (bucket === "users") {
          title = "New user registered";
          sub = [r.first_name, r.last_name].filter(Boolean).join(" ") || r.email || r.id || "—";
        } else if (bucket === "groups") {
          title = `Group ${String(r.status || "updated")}`;
          sub = [r.service, r.id].filter(Boolean).join(" · ") || "—";
        } else if (bucket === "transactions") {
          title = `${String(r.kind || "transaction").replace(/_/g, " ")} ${String(r.status || "")}`;
          sub = [r.amount_kobo != null ? kobo(r.amount_kobo) : null, r.reference].filter(Boolean).join(" · ") || r.id || "—";
        } else {
          title = r.title || r.action || r.event || labelOf(bucket);
          sub = r.description || r.detail || r.message || r.subject || [r.entity_type, r.entity_id].filter(Boolean).join(" · ") || "—";
        }
        items.push({ key: `${bucket}:${r.id || items.length}`, title, sub, at: r.created_at || r.at || r.timestamp });
      }
    }
    items.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));
    return items.slice(0, 6).map((a) => ({ key: a.key, title: a.title, sub: a.sub, time: relTime(a.at) }));
  }, [live]);

  const months = useMemo(() => rangeMonths(active.from), [active.from]);

  return (
    <AdminShell active="dashboard">
            <div className="flex flex-wrap items-center gap-[16px]">
              <div className="mr-auto">
                <h1 className="text-[35px] leading-[43px] font-bold text-black">
                  Dashboard
                </h1>
                <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  Welcome to Admin Dashboard
                </p>
              </div>
              <DropSelect
                value={range}
                options={options.map((o) => o.label)}
                onChange={setRange}
                ariaLabel="Date range"
                lead={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="flex-none">
                    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="#001701" strokeWidth="1.8" />
                    <path d="M3.5 10h17M8 3v4M16 3v4" stroke="#001701" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                }
                align="right"
                buttonClass="ml-auto flex h-[54px] items-center gap-[12px] rounded-[10px] bg-[#E5FFE7] px-[20px] text-[18px] font-semibold text-ink"
                labelClass="whitespace-nowrap text-[18px] font-semibold text-ink"
                panelClass="min-w-[320px]"
                chevron={<ChevDown color="#001701" />}
              />
            </div>
            {dash.status === "error" && (
              <p className="mt-[20px] rounded-[10px] border border-[#FFC48A] bg-[#FFEEE2] px-[20px] py-[14px] text-[15px] font-semibold text-[#8A3B00]">
                {dash.error} The cards below show placeholders until the dashboard answers.
              </p>
            )}
            <div className="mt-[30px] grid grid-cols-1 sm:grid-cols-2 gap-[20px] xl:grid-cols-4">
              {ROW1.map((c) => (
                <LightCard key={c.label} c={c} />
              ))}
            </div>
            <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 gap-[20px] xl:grid-cols-4">
              {ROW2.map((c) => (
                <LightCard key={c.label} c={c} />
              ))}
            </div>
            <div className="mt-[20px] grid grid-cols-1 sm:grid-cols-2 gap-[20px] xl:grid-cols-4">
              {DARK.map((c) => (
                <DarkCard key={c.label} c={c} />
              ))}
            </div>
            <div className="mt-[20px] flex flex-col gap-[20px] xl:flex-row">
              <div className="w-full xl:w-[266px] xl:flex-none">
                <DarkCard
                  c={{ glyph: <ClockGlyph color="#6A5ACD" />, label: "Pending Payout", value: pendingPayout }}
                />
              </div>
              <div className="relative flex-1 rounded-[10px] bg-[#E5FFE7] px-[21px] py-[28px]">
                {alerts && alerts.length > 0 && (
                  <span className="absolute top-[28px] right-[21px] grid h-[28px] w-[28px] place-items-center rounded-full bg-[#E31B00] text-[14px] font-bold text-white">
                    {alerts.length}
                  </span>
                )}
                <p className="text-[18px] leading-[22px] font-bold text-black">
                  Alert & Action Items
                </p>
                <div className="mt-[20px] grid gap-[20px] md:grid-cols-2">
                  <div className="flex flex-col gap-[16px]">
                    {(alerts || []).slice(0, 2).map(([t, s, to]) => (
                      <div key={t} className="flex items-start gap-[12px]">
                        <span className="mt-[2px] flex-none">
                          <ClockGlyph color="#E31B00" />
                        </span>
                        <span>
                          {to ? <button type="button" onClick={() => nav(to)} className="block text-left text-[16px] leading-[20px] font-bold text-clyse hover:underline">{t}</button> : <span className="block text-[16px] leading-[20px] font-bold text-black">{t}</span>}
                          <span className="mt-[4px] block text-[14px] leading-[18px] text-[#6B6B6B]">{s}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-[16px] md:border-l md:border-[#999999] md:pl-[20px]">
                    {(alerts || []).slice(2, 4).map(([t, s, to]) => (
                      <div key={t} className="flex items-start gap-[12px]">
                        <span className="mt-[2px] flex-none">
                          <ClockGlyph color="#E31B00" />
                        </span>
                        <span>
                          {to ? <button type="button" onClick={() => nav(to)} className="block text-left text-[16px] leading-[20px] font-bold text-clyse hover:underline">{t}</button> : <span className="block text-[16px] leading-[20px] font-bold text-black">{t}</span>}
                          <span className="mt-[4px] block text-[14px] leading-[18px] text-[#6B6B6B]">{s}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {dash.status === "live" && (!alerts || alerts.length === 0) && (
                  <p className="mt-[20px] text-[15px] font-semibold text-[#4E6B50]">
                    No pending actions right now — everything is clear for this range.
                  </p>
                )}
                {dash.status === "loading" && (
                  <p className="mt-[20px] text-[15px] font-semibold text-[#4E6B50]">Loading action items…</p>
                )}
              </div>
            </div>
            <div className="mt-[20px] flex flex-col gap-[20px] xl:flex-row">
              <div className="w-full rounded-[20px] bg-[#E5FFE7] px-[30px] py-[30px] xl:w-[473px] xl:flex-none">
                <div className="flex items-center">
                  <p className="text-[18px] leading-[22px] font-bold text-black">
                    Recent Activities
                  </p>
                  <button type="button" onClick={() => nav("/admin/data/audit")} className="ml-auto text-[15px] font-bold text-[#0087FF]">
                    View all
                  </button>
                </div>
                <div className="mt-[20px] flex flex-col gap-[14px]">
                  {activities === null && (
                    <p className="text-[14px] font-semibold text-[#6B6B6B]">Loading activity…</p>
                  )}
                  {activities !== null && activities.length === 0 && (
                    <p className="text-[14px] font-semibold text-[#6B6B6B]">No recent activity was recorded in this range.</p>
                  )}
                  {(activities || []).map((a) => (
                    <div key={a.key} className="flex items-center gap-[12px]">
                      <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-full bg-[#D6E9FF] text-[15px] font-bold text-[#0087FF]">
                        R
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[15px] leading-[18px] font-semibold text-black">
                          {a.title}
                        </span>
                        <span className="block truncate text-[13px] leading-[16px] text-[#6B6B6B]">
                          {a.sub}
                        </span>
                      </span>
                      <span className="flex-none text-right text-[14px] text-[#6B6B6B]">{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-btn min-w-0 flex-1 rounded-[10px] px-[24px] py-[24px] xl:px-[40px]">
                <Chart months={months} revenue={series.revenue} payout={series.payout} loading={series.status === "loading"} />
              </div>
            </div>
      </AdminShell>
  );
}
