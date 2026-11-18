import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { DarkButton, ChevDown, SearchIcon, PencilIcon, DotsIcon } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";
import { api, kobo } from "../lib/api";
import { goBackOr } from "../lib/navigation";
import { useEffect } from "react";

/* Subscription catalogue — Figma 1081:40502 (1440x1411, desktop only).
   Exact metrics: stat cards 356.7x117 r10 border #999; filter row search
   374x40 pill + 3 mint selects 221x46 r10 gap 24; table card r20 border
   #999, header row h60 #E5FFE7, rows h91 with 1px #999 separators, table
   inner width 1584 (horizontal scroll); pagination 28x28 r5 bottom-right.
   Live merge: GET /admin/services replaces the Figma dummy rows when the
   backend answers. */

const CAT_STYLE = {
  Entertainment: "bg-[#DDFFDE] text-[#048B0B]",
  Productivity: "bg-[#F5E7FF] text-[#9500FF]",
  Streaming: "bg-[#FFE9E0] text-[#FF4C00]",
};
const catCls = (c) => CAT_STYLE[c] || "bg-[#DDFFDE] text-[#048B0B]";

const CATS = ["All Category", "Entertainment", "Productivity", "Streaming"];
const STATUS = ["All Status", "Activated", "Deactivated"];
const PLANS = ["All Plans", "Premium", "Standard", "Basic"];

const titleCase = (v) => String(v || "").replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const periodLabel = (months) => {
  const m = Number(months) || 1;
  if (m >= 12) return "Yearly";
  if (m >= 3) return "Quarterly";
  return "Monthly";
};
const ACCESS_LABEL = { invite_link: "Access Link", credentials: "Login Credential", other: "Other" };

function StatCard({ tile, glyph, label, value }) {
  return (
    <div className="flex h-[117px] items-center gap-[21px] rounded-[10px] border border-[#999999] bg-white px-[21px]">
      <span className={`grid h-[40px] w-[40px] flex-none place-items-center rounded-[10px] ${tile}`}>{glyph}</span>
      <span>
        <span className="block text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">{label}</span>
        <span className="block text-[32px] leading-[38px] font-bold text-[#001701]">{value}</span>
      </span>
    </div>
  );
}

function SkeletonRow({ index }) {
  return (
    <div className="relative mt-[10px] flex h-[91px] items-center border-b border-[#999999]" aria-hidden>
      <span className="absolute left-[20px] h-[20px] w-[20px] rounded-[5px] border border-[#D5DDD5] bg-white" />
      <span className="absolute left-[70px] flex items-center gap-[20px]">
        <span className="h-[50px] w-[50px] animate-pulse rounded-full bg-[#EFF3EF]" />
        <span className="h-[14px] w-[150px] animate-pulse rounded bg-[#EFF3EF]" />
      </span>
      {[400, 600, 720, 895, 1040, 1186, 1342, 1482].map((left, i) => (
        <span key={left} style={{ left }} className={`absolute h-[13px] animate-pulse rounded bg-[#EFF3EF] ${i === 0 ? "w-[100px]" : "w-[64px]"}`} />
      ))}
      <span className="sr-only">Loading catalogue entry {index + 1}</span>
    </div>
  );
}

function UsersGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.5" r="3.2" fill="#048B0B" />
      <path d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" fill="#048B0B" />
      <circle cx="16.5" cy="9.5" r="2.6" fill="#048B0B" />
      <path d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3" fill="#048B0B" />
    </svg>
  );
}
function CheckBadgeGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="20" height="20" rx="6" fill="#048B0B" />
      <path d="m8 12.2 2.6 2.6L16 9.4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClipGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="5" width="14" height="16" rx="2" fill="#FF6C03" />
      <rect x="9" y="3" width="6" height="4" rx="1" fill="#FF6C03" />
      <path d="M9 12h6M9 15.5h6" stroke="#FFE9E0" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function Select({ value, onChange, options }) {
  return (
    <span className="relative flex h-[46px] w-[221px] flex-none items-center rounded-[10px] bg-[#E5FFE7] px-[11px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent pr-6 text-[16px] leading-[20px] font-semibold text-[#001701] focus:outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-[11px]">
        <ChevDown color="#001701" />
      </span>
    </span>
  );
}

const COLS = [
  ["Subscription", 80, 300],
  ["Category", 410, 170],
  ["Plans", 610, 90],
  ["Fixed Unit Price", 730, 135],
  ["Billing Period", 895, 115],
  ["Total Capacity", 1040, 116],
  ["Access", 1186, 126],
  ["Status", 1342, 110],
  ["Action", 1482, 80],
];

export default function AdminSubscriptions() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(CATS[0]);
  const [plan, setPlan] = useState(PLANS[0]);
  const [status, setStatus] = useState(STATUS[0]);
  const [checked, setChecked] = useState([]);
  const [page, setPage] = useState(1);
  const [live, setLive] = useState(null);

  const [catState, setCatState] = useState("loading"); // loading | live | empty | error

  useEffect(() => {
    let alive = true;
    /* GET /admin/catalogue/services — the answer nests under data.services and
       every service carries its own plans; nothing here is invented. */
    api("/admin/catalogue/services?limit=100").then((res) => {
      if (!alive) return;
      if (res.error) return setCatState("error");
      const items = res.data?.services ?? res.data?.items ?? (Array.isArray(res.data) ? res.data : []);
      if (!items.length) { setLive([]); return setCatState("empty"); }
      setLive(
        items.map((s) => {
          const plan0 = s.plans?.find((p) => p.is_active) || s.plans?.[0] || {};
          return {
            id: s.id || s.service_id,
            brand: s.slug || s.name?.toLowerCase().split(" ")[0] || "generic",
            name: s.name || "Service",
            cat: titleCase(s.category || "other"),
            plan: plan0.name || "—",
            price: plan0.unit_price_kobo != null ? kobo(plan0.unit_price_kobo) : "—",
            period: periodLabel(plan0.billing_interval_months),
            cap: plan0.member_slot_capacity != null ? `${plan0.member_slot_capacity} Slot` : `${s.group_count ?? 0} Group`,
            access: ACCESS_LABEL[plan0.supported_access_methods?.[0]] || "Access Link",
            status: s.is_active === false ? "Deactivated" : "Activated",
          };
        }),
      );
      setCatState("live");
    });
    return () => { alive = false; };
  }, []);

  const rows = useMemo(() => {
    const base = live || [];
    return base.filter(
      (r) =>
        (!q || r.name.toLowerCase().includes(q.toLowerCase())) &&
        (cat === CATS[0] || r.cat === cat || r.cat.toLowerCase() === String(cat).toLowerCase()) &&
        (plan === PLANS[0] || r.plan === plan) &&
        (status === STATUS[0] || r.status === status),
    );
  }, [q, cat, plan, status, live]);
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  const emptyNote =
    catState === "loading"
      ? "Loading the live catalogue…"
      : catState === "error"
      ? "Could not load the subscription catalogue. Nothing is shown rather than stale values."
      : catState === "empty"
        ? "No services in the catalogue yet."
        : "";

  const toggle = (name) =>
    setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="subscriptions" sub="services">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          onClick={() => goBackOr(nav, "/admin")}
          aria-label="Go back"
          className="grid h-[35px] w-[35px] flex-none place-items-center rounded-full bg-[#F1F8F2] shadow-[0_4px_10px_rgba(0,23,1,0.10)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 5 8 12l7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[35px] leading-[43px] font-bold text-[#001701]">Subscription Catalogue</h1>
        <DarkButton className="ml-auto h-[60px] w-[231px] gap-[10px] text-[18px]" onClick={() => nav("/admin/subscriptions/add")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
            <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Add Subscription
        </DarkButton>
      </div>

      {/* Stats */}
      <div className="mt-[30px] grid grid-cols-1 gap-[20px] md:grid-cols-3">
        <StatCard tile="bg-[#E5FFE7]" glyph={<UsersGlyph />} label="Total Subscription" value={catState === "loading" ? "…" : String((live || []).length)} />
        <StatCard tile="bg-[#E5FFE7]" glyph={<CheckBadgeGlyph />} label="Active Subscription" value={catState === "loading" ? "…" : String((live || []).filter((r) => r.status === "Activated").length)} />
        <StatCard tile="bg-[#FFEEE2]" glyph={<ClipGlyph />} label="Inactive Subscription" value={catState === "loading" ? "…" : String((live || []).filter((r) => r.status === "Deactivated").length)} />
      </div>

      {/* Filters */}
      <div className="mt-[30px] flex flex-wrap items-center gap-[24px]">
        <label className="flex h-[40px] w-[374px] max-w-full items-center gap-[10px] rounded-full border border-[#999999] bg-white px-[20px]">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            placeholder="Search....."
            className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#9F9F9F] focus:outline-none"
          />
        </label>
        <Select value={cat} onChange={(value) => { setCat(value); setPage(1); }} options={[...new Set(["All Category", ...(live || []).map((r) => r.cat)])]} />
        <Select value={status} onChange={(value) => { setStatus(value); setPage(1); }} options={STATUS} />
        <Select value={plan} onChange={(value) => { setPlan(value); setPage(1); }} options={[...new Set(["All Plans", ...(live || []).map((r) => r.plan).filter((p) => p && p !== "—")])]} />
      </div>

      {/* Table */}
      <div className="mt-[30px] overflow-x-auto rounded-[20px] border border-[#999999] bg-white pt-[30px] pb-[30px]">
        <div className="min-w-[1584px]">
          {/* header row */}
          <div className="relative flex h-[60px] w-full items-center bg-[#E5FFE7]">
            <span className="absolute left-[20px] h-[30px] w-[30px] rounded-[5px] border border-[#048B0B] bg-white" />
            {COLS.map(([label, x]) => (
              <span
                key={label}
                style={{ left: x }}
                className="absolute text-[16px] leading-[20px] font-semibold text-[#4E4E4E]"
              >
                {label}
              </span>
            ))}
          </div>
          {/* rows */}
          {catState === "loading" && Array.from({ length: 8 }, (_, index) => <SkeletonRow key={`skeleton-${index}`} index={index} />)}
          {(catState === "error" || catState === "empty") && (
            <div className="flex min-h-[808px] items-center justify-center px-[24px] text-center">
              <p className="max-w-[520px] text-[16px] leading-[24px] font-semibold text-[#4E4E4E]">{emptyNote}</p>
            </div>
          )}
          {pageRows.map((r) => (
            <div key={r.name} className="mt-[10px] border-b border-[#999999]">
            <div className="relative flex h-[91px] items-center">
              <button
                onClick={() => toggle(r.name)}
                aria-label={`Select ${r.name}`}
                className={`absolute left-[20px] h-[20px] w-[20px] rounded-[5px] border ${checked.includes(r.name) ? "border-[#048B0B] bg-[#048B0B]" : "border-[#999999] bg-white"}`}
              />
              <span className="absolute flex w-[300px] items-center gap-[20px]" style={{ left: 70 }}>
                <BrandTile brand={r.brand} size={50} plain />
                <span className="truncate text-[18px] leading-[22px] font-bold text-[#001701]">{r.name}</span>
              </span>
              <span className="absolute flex h-[30px] items-center justify-center rounded-[10px] px-[20px] text-[15px] leading-[18px] font-semibold" style={{ left: 400 }} >
                <span className={`flex h-[30px] items-center justify-center rounded-[10px] px-[20px] ${catCls(r.cat)}`}>{r.cat}</span>
              </span>
              <span className="absolute text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 600 }}>{r.plan}</span>
              <span className="absolute text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 720 }}>{r.price}</span>
              <span className="absolute text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 885 }}>{r.period}</span>
              <span className="absolute text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 1030 }}>{r.cap}</span>
              <span className="absolute text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 1176 }}>{r.access}</span>
              <span className="absolute" style={{ left: 1332 }}>
                <span className={`flex h-[27px] items-center justify-center rounded-[8px] px-[14px] text-[14px] font-semibold ${r.status === "Activated" ? "bg-[#DDFFDE] text-[#048B0B]" : "bg-[#FFE9E0] text-[#FF4C00]"}`}>
                  {r.status}
                </span>
              </span>
              <span className="absolute flex items-center gap-[12px]" style={{ left: 1472 }}>
                <button
                  onClick={() => r.id && nav(`/admin/subscriptions/details?service_id=${encodeURIComponent(r.id)}`)}
                  disabled={!r.id}
                  aria-label={`Edit ${r.name}`}
                >
                  <PencilIcon />
                </button>
                <button
                  onClick={() => r.id && nav(`/admin/subscriptions/details?service_id=${encodeURIComponent(r.id)}`)}
                  disabled={!r.id}
                  aria-label={`More about ${r.name}`}
                >
                  <DotsIcon />
                </button>
              </span>
            </div>
            </div>
          ))}
          {rows.length > 0 && (
            <div className="mt-[10px] flex min-h-[36px] items-center justify-between px-[30px] text-[13px] font-semibold text-[#4E4E4E]">
              <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, rows.length)} of {rows.length} services</span>
              {pageCount > 1 && <div className="flex items-center gap-[4px]">
                <button type="button" aria-label="Previous page" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] bg-white text-[16px] disabled:opacity-40">‹</button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => <button key={number} type="button" aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => setPage(number)} className={`grid h-[28px] min-w-[28px] place-items-center rounded-[5px] border px-1 text-[14px] font-semibold ${page === number ? "border-[#048B0B] bg-[#048B0B] text-white" : "border-[#E9E9E9] bg-white text-[#4E4E4E]"}`}>{number}</button>)}
                <button type="button" aria-label="Next page" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] bg-white text-[16px] disabled:opacity-40">›</button>
              </div>}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
