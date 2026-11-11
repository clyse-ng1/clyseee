import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { DarkButton, ChevDown, SearchIcon, PencilIcon, DotsIcon } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";
import { api } from "../lib/api";
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

const ROWS = [
  { brand: "netflix", name: "Netflix Premium", cat: "Entertainment", plan: "Premium", price: "N3,000", period: "Monthly", cap: "100 Slot", access: "Access Link", status: "Activated" },
  { brand: "capcut", name: "CapCut", cat: "Productivity", plan: "Standard", price: "N3,000", period: "Monthly", cap: "100 Slot", access: "Access Link", status: "Activated" },
  { brand: "adobe", name: "Adobe Creative Cloud", cat: "Productivity", plan: "Premium", price: "N4,000", period: "Monthly", cap: "200 Slot", access: "Access Link", status: "Activated" },
  { brand: "canva", name: "Canva Pro", cat: "Productivity", plan: "Premium", price: "N3,000", period: "Monthly", cap: "100 Slot", access: "Access Link", status: "Activated" },
  { brand: "youtube", name: "YouTube Premium", cat: "Entertainment", plan: "Standard", price: "N3,000", period: "Monthly", cap: "100 Slot", access: "Access Link", status: "Activated" },
  { brand: "prime", name: "Prime Video", cat: "Entertainment", plan: "Premium", price: "N3,000", period: "Monthly", cap: "100 Slot", access: "Access Link", status: "Activated" },
  { brand: "spotify", name: "Spotify", cat: "Streaming", plan: "Standard", price: "N3,000", period: "Monthly", cap: "100 Slot", access: "Access Link", status: "Activated" },
  { brand: "amazon", name: "Amazon", cat: "Productivity", plan: "Premium", price: "N3,000", period: "Monthly", cap: "100 Slot", access: "Access Link", status: "Activated" },
];

const CATS = ["All Category", "Entertainment", "Productivity", "Streaming"];
const STATUS = ["All Status", "Activated", "Deactivated"];
const PLANS = ["All Plans", "Premium", "Standard", "Basic"];

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
  const [live, setLive] = useState(null);

  useEffect(() => {
    let alive = true;
    api("/admin/catalogue/services").then((res) => {
      if (!alive || res.error || !Array.isArray(res.data?.items ?? res.data)) return;
      const items = res.data?.items ?? res.data;
      setLive(
        items.map((s) => ({
          brand: s.slug || s.name?.toLowerCase().split(" ")[0] || "generic",
          name: s.name || "Service",
          cat: s.category || "Entertainment",
          plan: s.plans?.[0]?.name || "Premium",
          price: s.plans?.[0]?.price ? `N${Number(s.plans[0].price / 100).toLocaleString("en-US")}` : "N3,000",
          period: "Monthly",
          cap: `${s.capacity ?? 100} Slot`,
          access: "Access Link",
          status: s.is_active === false ? "Deactivated" : "Activated",
        })),
      );
    });
    return () => { alive = false; };
  }, []);

  const rows = useMemo(() => {
    const base = live || ROWS;
    return base.filter(
      (r) =>
        (!q || r.name.toLowerCase().includes(q.toLowerCase())) &&
        (cat === CATS[0] || r.cat === cat) &&
        (plan === PLANS[0] || r.plan === plan) &&
        (status === STATUS[0] || r.status === status),
    );
  }, [q, cat, plan, status, live]);

  const toggle = (name) =>
    setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="subscriptions" sub="services">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          onClick={() => nav(-1)}
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
        <StatCard tile="bg-[#E5FFE7]" glyph={<UsersGlyph />} label="Total Subscription" value="124,000" />
        <StatCard tile="bg-[#E5FFE7]" glyph={<CheckBadgeGlyph />} label="Active Subscription" value="124,000" />
        <StatCard tile="bg-[#FFEEE2]" glyph={<ClipGlyph />} label="Inactive Subscription" value="124,000" />
      </div>

      {/* Filters */}
      <div className="mt-[30px] flex flex-wrap items-center gap-[24px]">
        <label className="flex h-[40px] w-[374px] max-w-full items-center gap-[10px] rounded-full border border-[#999999] bg-white px-[20px]">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search....."
            className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#9F9F9F] focus:outline-none"
          />
        </label>
        <Select value={cat} onChange={setCat} options={CATS} />
        <Select value={status} onChange={setStatus} options={STATUS} />
        <Select value={plan} onChange={setPlan} options={PLANS} />
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
          {rows.map((r) => (
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
                <button onClick={() => nav("/admin/subscriptions/details")} aria-label="Edit"><PencilIcon /></button>
                <button aria-label="More"><DotsIcon /></button>
              </span>
            </div>
            </div>
          ))}
          {/* pagination */}
          <div className="mt-[10px] flex h-[28px] items-center justify-end gap-[4px] pr-[30px]">
            {["1", "2", "3", "4", "5"].map((n, i) => (
              <button
                key={n}
                className={`grid h-[28px] w-[28px] place-items-center rounded-[5px] text-[13px] font-bold ${i === 0 ? "bg-[#001701] text-white" : "border border-[#999999] bg-white text-[#001701]"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
