import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminRows from "../components/useAdminRows";
import AdminShell, { AdminEmpty, PageTitle, Pill, SearchIcon, ChevDown, PencilIcon, DotsIcon, CalendarIcon } from "../components/AdminShell";
import { GlyphClock, GlyphBadge, GlyphX, GlyphUsers } from "../components/AdminGlyphs";
import BrandTile from "../components/BrandTile";
import DropSelect from "../components/DropSelect";

/* Group Verification list — Figma 1157:45361 (1440, desktop only).
   Static: search + filters work client-side. Copy fixes: "Aproved" ->
   "Approved", "Sep. 1 206" -> "Sep. 1 2026". */

const STATS = [
  { glyph: <GlyphClock />, label: "Pending", value: "…", color: "text-[#FF6C03]" },
  { glyph: <GlyphBadge />, label: "Approved", value: "…", color: "text-[#048B0B]" },
  { glyph: <GlyphX />, label: "Reject", value: "…", color: "text-[#FF0000]" },
  { glyph: <GlyphUsers color="#6B6B6B" />, label: "Suspended", value: "…", color: "text-[#6B6B6B]" },
];


const STATUS_PILL = {
  pending: { tone: "orange", label: "Pending" },
  pending_review: { tone: "orange", label: "Pending" },
  approved: { tone: "green", label: "Approved" },
  verified: { tone: "green", label: "Approved" },
  active: { tone: "green", label: "Approved" },
  rejected: { tone: "red", label: "Rejected" },
  suspended: { tone: "gray", label: "Suspended" },
};

const daysForRange = (range) => ({ "Last 7 days": 7, "Last 30 days": 30, "Last 90 days": 90 })[range] || null;
const AUDIT_NOW = Date.now();

export default function AdminGroupVerification() {
  const { rows: live, status: loadStatus } = useAdminRows("verification");
  const [range, setRange] = useState("All time");
  const [category, setCategory] = useState("All Categories");
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All Status");
  const [checked, setChecked] = useState([]);
  const categories = useMemo(() => [...new Set((live || []).map((r) => r.sub).filter((value) => value && value !== "—"))], [live]);
  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    const days = daysForRange(range);
    const cutoff = days ? new Date(AUDIT_NOW - days * 86400000) : null;
    return (live || []).filter((r) => {
      const rowStatus = String(r.status || "").toLowerCase();
      const pill = STATUS_PILL[rowStatus];
      const rowDate = r.date && r.date !== "—" ? new Date(r.date) : null;
      const dateMatch = !cutoff || (rowDate && !Number.isNaN(rowDate.getTime()) && rowDate >= cutoff);
      return (!query || `${r.name || ""} ${r.sub || ""}`.toLowerCase().includes(query)) &&
        (status === "All Status" || pill?.label === status) &&
        (category === "All Categories" || r.sub === category) && dateMatch;
    });
  }, [live, q, status, category, range]);
  const liveish = loadStatus === "live" || loadStatus === "empty";
  const stats = liveish
    ? [
        { glyph: <GlyphClock />, label: "Pending", value: String((live || []).filter((r) => ["pending", "pending_review"].includes(String(r.status).toLowerCase())).length), color: "text-[#FF6C03]" },
        { glyph: <GlyphBadge />, label: "Approved", value: String((live || []).filter((r) => ["verified", "approved", "active"].includes(String(r.status).toLowerCase())).length), color: "text-[#048B0B]" },
        { glyph: <GlyphX />, label: "Reject", value: String((live || []).filter((r) => r.status === "rejected").length), color: "text-[#FF0000]" },
        { glyph: <GlyphUsers color="#6B6B6B" />, label: "Suspended", value: String((live || []).filter((r) => r.status === "suspended").length), color: "text-[#6B6B6B]" },
      ]
    : STATS;
  const all = rows.length > 0 && rows.every((r) => checked.includes(r.name));
  const toggle = (name) => setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="verification">
      <PageTitle title="Group Verification" />

      <div className="mt-[30px] flex gap-[20px]">
        {stats.map((s) => (
          <div key={s.label} className="flex h-[94px] w-full lg:w-[262px] items-center gap-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px]">
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
        <label className="flex h-[40px] w-full lg:w-[373px] items-center gap-2 rounded-full bg-white px-[20px]">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none"
          />
        </label>
        <span className="relative flex h-[46px] w-[168px] items-center rounded-[10px] border border-[#999999] bg-[#DFFFE1] px-[15px]">
          <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category" className="w-full appearance-none bg-transparent pr-6 text-[16px] font-semibold text-[#001701] focus:outline-none">
            {["All Categories", ...categories].map((item) => <option key={item}>{item}</option>)}
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
        <DropSelect
          value={range}
          options={["All time", "Last 7 days", "Last 30 days", "Last 90 days"]}
          onChange={setRange}
          ariaLabel="Date range"
          lead={<CalendarIcon />}
          buttonClass="flex h-[54px] w-full lg:w-[329px] shrink-0 items-center gap-[8px] rounded-[10px] bg-[#DFFFE1] px-[15px]"
          labelClass="flex-1 whitespace-nowrap text-[16px] font-semibold text-[#001701]"
          panelClass="min-w-[300px]"
          chevron={<ChevDown color="#001701" />}
        />
      </div>

      {loadStatus === "empty" && (
        <AdminEmpty title="No groups waiting for verification" hint="When a creator submits proof of an active subscription, the group queues here for review." />
      )}
      <div className={`mt-[30px] overflow-x-auto rounded-[20px] border border-[#999999] bg-white ${loadStatus === "empty" ? "hidden" : ""}`}>
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
            <span className="w-full lg:w-[214px] shrink-0">Creator</span>
            <span className="w-full lg:w-[269px] shrink-0">Subscription & Plan</span>
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
                <span className="w-full lg:w-[214px] shrink-0">
                  <span className="block text-[16px] font-semibold text-[#001701]">{r.name}</span>
                  <span className="block text-[14px] font-semibold text-[#6B6B6B]">{r.email}</span>
                </span>
                <span className="flex w-full lg:w-[269px] shrink-0 items-center gap-[12px]">
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
                  <Pill tone={(STATUS_PILL[String(r.status || "").toLowerCase()] || { tone: "gray", label: String(r.status || "Unknown").replaceAll("_", " ") }).tone} className="h-[37px] w-[120px]">
                    {(STATUS_PILL[String(r.status || "").toLowerCase()] || { label: String(r.status || "Unknown").replaceAll("_", " ") }).label}
                  </Pill>
                </span>
                <span className="flex w-[80px] shrink-0 items-center gap-[18px]">
                  <button aria-label={`Review ${r.name}`} onClick={() => (r.id ? nav(`/admin/group-verification/review?group_id=${encodeURIComponent(r.id)}`) : null)}>
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
