import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { PageTitle, Pill, SearchIcon, ChevDown, PencilIcon, DotsIcon } from "../components/AdminShell";
import { GlyphUsers, GlyphBadge, GlyphX, GlyphClock } from "../components/AdminGlyphs";
import BrandTile from "../components/BrandTile";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";

/* Group List — Figma 1176:26649 (1440, desktop only). Static: search +
   filters work client-side. Copy fix: "Close Groud" -> "Closed Group". */

const STATS = [
  { glyph: <GlyphUsers />, label: "Total Group", value: "124,000" },
  { glyph: <GlyphBadge />, label: "Open Group", value: "34" },
  { glyph: <GlyphX />, label: "Closed Group", value: "12" },
  { glyph: <GlyphClock />, label: "Full Group", value: "22" },
];

const ROWS = [
  { name: "Maria Philips", email: "maria@gmail.com", brand: "netflix", sub: "Netflix", plan: "Premium", slot: "5/10", date: "Sep. 20, 2026", status: "open" },
  { name: "Ann Kenter", email: "ann@gmail.com", brand: "spotify", sub: "Spotify", plan: "Basic", slot: "3/6", date: "Sep. 20, 2026", status: "open" },
  { name: "James Lipshutz", email: "james@gmail.com", brand: "canva", sub: "Canva", plan: "Premium", slot: "5/10", date: "Sep. 20, 2026", status: "full" },
  { name: "Dulce Press", email: "dulce@gmail.com", brand: "youtube", sub: "YouTube", plan: "Basic", slot: "4/8", date: "Sep. 20, 2026", status: "closed" },
  { name: "Jakob Lubin", email: "jakob@gmail.com", brand: "capcut", sub: "CapCut", plan: "Basic", slot: "5/10", date: "Sep. 20, 2026", status: "open" },
  { name: "Kaylynn Dokidis", email: "kaylynn@gmail.com", brand: "adobe", sub: "Adobe Creative Cloud", plan: "Basic", slot: "5/10", date: "Sep. 20, 2026", status: "full" },
];

const STATUS_PILL = {
  open: { tone: "green", label: "Open" },
  closed: { tone: "gray", label: "Closed" },
  full: { tone: "orange", label: "Full" },
};

const MEMBER_STACK = [avatar1, avatar2, avatar3];

function Filter({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-[10px]">
      <span className="text-[16px] font-semibold leading-[20px] text-[#000000]">{label}</span>
      <span className="relative flex h-[46px] w-[221px] items-center rounded-[10px] border border-[#999999] bg-[#DFFFE1] px-[15px]">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-transparent pr-6 text-[16px] font-semibold text-[#001701] focus:outline-none"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-[15px]">
          <ChevDown color="#001701" />
        </span>
      </span>
    </label>
  );
}

export default function AdminGroups() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");
  const [checked, setChecked] = useState([]);
  const rows = useMemo(
    () =>
      ROWS.filter(
        (r) =>
          (r.name.toLowerCase().includes(q.trim().toLowerCase()) || r.sub.toLowerCase().includes(q.trim().toLowerCase())) &&
          (status === "All" || STATUS_PILL[r.status].label === status)
      ),
    [q, status]
  );
  const all = rows.length > 0 && rows.every((r) => checked.includes(r.name));
  const toggle = (name) => setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="users" sub="gm">
      <PageTitle title="Group List" />

      <div className="mt-[30px] flex gap-[20px]">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex h-[121px] ${i === 3 ? "w-[276px]" : "w-[258px]"} items-center gap-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px]`}
          >
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[5px] bg-[#DFFFE1]">
              {s.glyph}
            </span>
            <span>
              <span className="block text-[18px] font-semibold leading-[22px] text-[#4E4E4E]">{s.label}</span>
              <span className="block text-[25px] font-bold leading-[31px] text-[#001701]">{s.value}</span>
              <span className="block text-[18px] font-semibold leading-[22px] text-[#6B6B6B]">Last 30 Days</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[30px] flex items-end gap-[24px]">
        <label className="mb-[3px] flex h-[40px] w-[374px] items-center gap-2 rounded-full bg-white px-[20px]">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search...."
            className="w-full bg-transparent text-[14px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none"
          />
        </label>
        <Filter label="Group Status" value={status} onChange={setStatus} options={["All", "Open", "Closed", "Full"]} />
        <Filter label="Member" value="All" onChange={() => {}} options={["All", "1 - 5", "6 - 10"]} />
        <Filter label="Start Date" value="All" onChange={() => {}} options={["All", "Last 30 Days", "Last 90 Days"]} />
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
            <span className="w-[131px] shrink-0">Member</span>
            <span className="w-[98px] shrink-0">Shared Slot</span>
            <span className="w-[126px] shrink-0">Start Date</span>
            <span className="w-[164px] shrink-0">Status</span>
            <span className="w-[80px] shrink-0">Action</span>
          </div>
          <div className="divide-y divide-[#999999] pb-[20px]">
            {rows.map((r) => (
              <div key={r.name} className="flex h-[112px] items-center">
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
                <span className="flex w-[131px] shrink-0">
                  {MEMBER_STACK.map((m, i) => (
                    <img
                      key={m}
                      src={m}
                      alt=""
                      className={`h-[32px] w-[32px] rounded-full border-2 border-white object-cover ${i > 0 ? "-ml-[10px]" : ""}`}
                    />
                  ))}
                </span>
                <span className="w-[98px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.slot}</span>
                <span className="w-[126px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.date}</span>
                <span className="flex w-[164px] shrink-0">
                  <Pill tone={STATUS_PILL[r.status].tone} className="h-[37px] w-[110px]">
                    {STATUS_PILL[r.status].label}
                  </Pill>
                </span>
                <span className="flex w-[80px] shrink-0 items-center gap-[18px]">
                  <button aria-label={`View ${r.name}`} onClick={() => nav("/admin/groups/details")}>
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
