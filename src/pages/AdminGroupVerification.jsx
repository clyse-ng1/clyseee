import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { PageTitle, Pill, SearchIcon, ChevDown, PencilIcon, DotsIcon, CalendarIcon } from "../components/AdminShell";
import { GlyphClock, GlyphBadge, GlyphX, GlyphUsers } from "../components/AdminGlyphs";
import BrandTile from "../components/BrandTile";

/* Group Verification list — Figma 1157:45361 (1440, desktop only).
   Static: search + filters work client-side. Copy fixes: "Aproved" ->
   "Approved", "Sep. 1 206" -> "Sep. 1 2026". */

const STATS = [
  { glyph: <GlyphClock />, label: "Pending", value: "122", color: "text-[#FF6C03]" },
  { glyph: <GlyphBadge />, label: "Approved", value: "124,000", color: "text-[#048B0B]" },
  { glyph: <GlyphX />, label: "Reject", value: "124,000", color: "text-[#FF0000]" },
  { glyph: <GlyphUsers color="#6B6B6B" />, label: "Suspended", value: "50", color: "text-[#6B6B6B]" },
];

const ROWS = [
  { name: "Maria Philips", email: "maria@gmail.com", brand: "netflix", sub: "Netflix", plan: "Premium", price: "N3,000", slot: "5/10", date: "Sep. 20, 2026", status: "pending" },
  { name: "Ann Kenter", email: "ann@gmail.com", brand: "spotify", sub: "Spotify", plan: "Basic", price: "N1,000", slot: "3/6", date: "Sep. 20, 2026", status: "approved" },
  { name: "James Lipshutz", email: "james@gmail.com", brand: "canva", sub: "Canva", plan: "Premium", price: "N3,000", slot: "5/10", date: "Sep. 20, 2026", status: "pending" },
  { name: "Dulce Press", email: "dulce@gmail.com", brand: "youtube", sub: "YouTube", plan: "Basic", price: "N1,500", slot: "4/8", date: "Sep. 20, 2026", status: "rejected" },
  { name: "Jakob Lubin", email: "jakob@gmail.com", brand: "capcut", sub: "CapCut", plan: "Basic", price: "N1,500", slot: "5/10", date: "Sep. 20, 2026", status: "pending" },
  { name: "Kaylynn Dokidis", email: "kaylynn@gmail.com", brand: "adobe", sub: "Adobe Creative Cloud", plan: "Basic", price: "N1,500", slot: "5/10", date: "Sep. 20, 2026", status: "suspended" },
  { name: "Emerson Dokidis", email: "emerson@gmail.com", brand: "prime", sub: "Prime Video", plan: "Premium", price: "N3,000", slot: "5/10", date: "Sep. 20, 2026", status: "approved" },
];

const STATUS_PILL = {
  pending: { tone: "orange", label: "Pending" },
  approved: { tone: "green", label: "Approved" },
  rejected: { tone: "red", label: "Rejected" },
  suspended: { tone: "gray", label: "Suspended" },
};

export default function AdminGroupVerification() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All Status");
  const [checked, setChecked] = useState([]);
  const rows = useMemo(
    () =>
      ROWS.filter(
        (r) =>
          (r.name.toLowerCase().includes(q.trim().toLowerCase()) || r.sub.toLowerCase().includes(q.trim().toLowerCase())) &&
          (status === "All Status" || STATUS_PILL[r.status].label === status)
      ),
    [q, status]
  );
  const all = rows.length > 0 && rows.every((r) => checked.includes(r.name));
  const toggle = (name) => setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="verification">
      <PageTitle title="Group Verification" />

      <div className="mt-[30px] flex gap-[20px]">
        {STATS.map((s) => (
          <div key={s.label} className="flex h-[94px] w-[262px] items-center gap-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px]">
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[5px] bg-[#DFFFE1]">
              {s.glyph}
            </span>
            <span>
              <span className={`block text-[18px] font-semibold leading-[22px] ${s.color}`}>{s.label}</span>
              <span className={`block text-[25px] font-semibold leading-[31px] ${s.color}`}>{s.value}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[30px] flex items-center gap-[24px]">
        <label className="flex h-[40px] w-[373px] items-center gap-2 rounded-full bg-white px-[20px]">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none"
          />
        </label>
        <span className="relative flex h-[46px] w-[168px] items-center rounded-[10px] border border-[#999999] bg-[#DFFFE1] px-[15px]">
          <select className="w-full appearance-none bg-transparent pr-6 text-[16px] font-semibold text-[#001701] focus:outline-none">
            <option>All Category</option>
          </select>
          <span className="pointer-events-none absolute right-[15px]">
            <ChevDown color="#001701" />
          </span>
        </span>
        <span className="relative flex h-[46px] w-[168px] items-center rounded-[10px] border border-[#999999] bg-[#DFFFE1] px-[15px]">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full appearance-none bg-transparent pr-6 text-[16px] font-semibold text-[#001701] focus:outline-none"
          >
            {["All Status", "Pending", "Approved", "Rejected", "Suspended"].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-[15px]">
            <ChevDown color="#001701" />
          </span>
        </span>
        <span className="flex h-[54px] w-[329px] shrink-0 items-center gap-[8px] rounded-[10px] bg-[#DFFFE1] px-[15px]">
          <CalendarIcon />
          <span className="flex-1 whitespace-nowrap text-[16px] font-semibold text-[#001701]">Sep. 1 2026 - Sep. 30 2026</span>
          <ChevDown color="#001701" />
        </span>
      </div>

      <div className="mt-[30px] overflow-x-auto rounded-[20px] border border-[#999999] bg-white">
        <div className="min-w-[1387px]">
          <div className="mt-[36px] flex h-[60px] items-center bg-[#DFFFE1] text-[16px] font-semibold text-[#4E4E4E]">
            <span className="flex w-[81px] shrink-0 justify-center">
              <button
                aria-label="Select all"
                onClick={() => setChecked(all ? [] : rows.map((r) => r.name))}
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-[5px] border border-[#048B0B] bg-white ${all ? "bg-[#048B0B]" : ""}`}
              >
                {all && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </span>
            <span className="w-[214px] shrink-0">Creator</span>
            <span className="w-[269px] shrink-0">Subscription & Plan</span>
            <span className="w-[131px] shrink-0 whitespace-nowrap text-[15px]">Unit Fixed Price</span>
            <span className="w-[98px] shrink-0">Shared Slot</span>
            <span className="w-[126px] shrink-0">Start Date</span>
            <span className="w-[163px] shrink-0">Status</span>
            <span className="w-[80px] shrink-0">Action</span>
          </div>
          <div className="divide-y divide-[#999999] pb-[20px]">
            {rows.map((r) => (
              <div key={r.name} className="flex h-[116px] items-center">
                <span className="flex w-[81px] shrink-0 justify-center">
                  <button
                    aria-label={`Select ${r.name}`}
                    onClick={() => toggle(r.name)}
                    className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] border border-[#999999] bg-white"
                  >
                    {checked.includes(r.name) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="#048B0B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </span>
                <span className="w-[214px] shrink-0">
                  <span className="block text-[16px] font-semibold text-[#001701]">{r.name}</span>
                  <span className="block text-[14px] font-semibold text-[#6B6B6B]">{r.email}</span>
                </span>
                <span className="flex w-[269px] shrink-0 items-center gap-[12px]">
                  <BrandTile brand={r.brand} size={50} />
                  <span>
                    <span className="block text-[16px] font-semibold text-[#001701]">{r.sub}</span>
                    <span className="block text-[14px] font-semibold text-[#6B6B6B]">{r.plan}</span>
                  </span>
                </span>
                <span className="w-[131px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.price}</span>
                <span className="w-[98px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.slot}</span>
                <span className="w-[126px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.date}</span>
                <span className="flex w-[163px] shrink-0">
                  <Pill tone={STATUS_PILL[r.status].tone} className="h-[37px] w-[120px]">
                    {STATUS_PILL[r.status].label}
                  </Pill>
                </span>
                <span className="flex w-[80px] shrink-0 items-center gap-[18px]">
                  <button aria-label={`Review ${r.name}`} onClick={() => nav("/admin/group-verification/review")}>
                    <PencilIcon />
                  </button>
                  <button aria-label="More actions">
                    <DotsIcon />
                  </button>
                </span>
              </div>
            ))}
            {rows.length === 0 && (
              <p className="px-[40px] py-[40px] text-[16px] font-semibold text-[#6B6B6B]">No groups match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
