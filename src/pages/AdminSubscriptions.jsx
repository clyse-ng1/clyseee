import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { PageTitle, DarkButton, Pill, SearchIcon, ChevDown, PencilIcon, DotsIcon } from "../components/AdminShell";
import { GlyphUsers, GlyphBadge, GlyphClock, GlyphPlus } from "../components/AdminGlyphs";
import BrandTile from "../components/BrandTile";

/* Subscription catalogue — Figma 1081:40502 (1440x1411, desktop only).
   Static admin: search + filters work client-side. Copy fixes:
   "Subcriptions" -> "Subscriptions", "Fixed Unite Price" -> "Fixed Unit Price". */

const STATS = [
  { glyph: <GlyphUsers />, label: "Total Subscription", value: "124,000" },
  { glyph: <GlyphBadge />, label: "Active Subscription", value: "124,000" },
  { glyph: <GlyphClock />, label: "Inactive Subscription", value: "124,000" },
];

const ROWS = [
  { brand: "netflix", name: "Netflix", cat: "Streaming", plan: "Standard", planPrice: "N5,500", price: "N3,000", period: "Monthly", cap: "5/10", access: "Private Group" },
  { brand: "capcut", name: "CapCut", cat: "Productivity", plan: "Basic", planPrice: "N3,000", price: "N1,500", period: "Monthly", cap: "5/10", access: "Public Group" },
  { brand: "adobe", name: "Adobe Creative Cloud", cat: "Productivity", plan: "Basic", planPrice: "N2,000", price: "N1,500", period: "Monthly", cap: "5/10", access: "Public Group" },
  { brand: "canva", name: "Canva", cat: "Productivity", plan: "Premium", planPrice: "N5,500", price: "N3,000", period: "Monthly", cap: "5/10", access: "Private Group" },
  { brand: "youtube", name: "YouTube", cat: "Streaming", plan: "Basic", planPrice: "N2,000", price: "N1,500", period: "Monthly", cap: "4/8", access: "Public Group" },
  { brand: "prime", name: "Prime Video", cat: "Streaming", plan: "Premium", planPrice: "N5,500", price: "N3,000", period: "Monthly", cap: "5/10", access: "Public Group" },
  { brand: "spotify", name: "Spotify", cat: "Music Streaming", plan: "Basic", planPrice: "N1,500", price: "N1,000", period: "Monthly", cap: "3/6", access: "Private Group" },
  { brand: "amazon", name: "Amazon", cat: "Streaming", plan: "Basic", planPrice: "N2,000", price: "N2,000", period: "Monthly", cap: "2/5", access: "Public Group" },
];

const CATS = ["All Category", "Streaming", "Productivity", "Music Streaming"];
const PLANS = ["All Plan", "Basic", "Standard", "Premium"];
const STATUS = ["All Status", "Activated"];

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

export default function AdminSubscriptions() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(CATS[0]);
  const [plan, setPlan] = useState(PLANS[0]);
  const [status, setStatus] = useState(STATUS[0]);
  const [checked, setChecked] = useState([]);

  const rows = useMemo(
    () =>
      ROWS.filter(
        (r) =>
          r.name.toLowerCase().includes(q.trim().toLowerCase()) &&
          (cat === CATS[0] || r.cat === cat) &&
          (plan === PLANS[0] || r.plan === plan) &&
          (status === STATUS[0] || "Activated" === status)
      ),
    [q, cat, plan, status]
  );
  const all = rows.length > 0 && rows.every((r) => checked.includes(r.name));
  const toggle = (name) => setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="subscriptions" sub="plans">
      <PageTitle
        title="Subscriptions"
        right={
          <DarkButton className="h-[60px] w-[231px]" onClick={() => nav("/admin/subscriptions/add")}>
            <GlyphPlus /> Add Subscription
          </DarkButton>
        }
      />

      {/* Stat cards 357x117 */}
      <div className="mt-[30px] flex gap-[19px]">
        {STATS.map((s) => (
          <div key={s.label} className="flex h-[117px] w-[357px] items-center gap-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px]">
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[5px] bg-[#DFFFE1]">
              {s.glyph}
            </span>
            <span>
              <span className="block text-[18px] font-semibold leading-[22px] text-[#6B6B6B]">{s.label}</span>
              <span className="block text-[35px] font-bold leading-[43px] text-[#001701]">{s.value}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-[30px] flex items-end gap-[24px]">
        <label className="flex h-[40px] w-[374px] items-center gap-2 rounded-full bg-white px-[20px]">
          <SearchIcon />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none"
          />
        </label>
        <Filter label="Category" value={cat} onChange={setCat} options={CATS} />
        <Filter label="Plan" value={plan} onChange={setPlan} options={PLANS} />
        <Filter label="Status" value={status} onChange={setStatus} options={STATUS} />
      </div>

      {/* Table 1584 wide -> horizontal scroll */}
      <div className="mt-[30px] overflow-x-auto rounded-[20px] border border-[#999999] bg-white">
        <div className="min-w-[1584px]">
          <div className="mt-[31px] flex h-[60px] items-center bg-[#DFFFE1] text-[16px] font-semibold text-[#4E4E4E]">
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
            <span className="w-[330px] shrink-0">Subscription</span>
            <span className="w-[200px] shrink-0">Category</span>
            <span className="w-[120px] shrink-0">Plans</span>
            <span className="w-[165px] shrink-0">Fixed Unit Price</span>
            <span className="w-[145px] shrink-0">Period</span>
            <span className="w-[146px] shrink-0">Capacity</span>
            <span className="w-[156px] shrink-0">Access Type</span>
            <span className="w-[140px] shrink-0">Status</span>
            <span className="w-[101px] shrink-0">Action</span>
          </div>
          <div className="divide-y divide-[#999999] pb-[20px]">
            {rows.map((r) => (
              <div key={r.name} className="flex h-[101px] items-center">
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
                <span className="flex w-[330px] shrink-0 items-center gap-[15px]">
                  <BrandTile brand={r.brand} size={50} />
                  <span className="text-[18px] font-bold text-[#001701]">{r.name}</span>
                </span>
                <span className="w-[200px] shrink-0">
                  <Pill className="h-[30px] w-[162px] text-[16px]">{r.cat}</Pill>
                </span>
                <span className="w-[120px] shrink-0 text-[16px] font-semibold leading-tight text-[#001701]">
                  {r.plan}
                  <br />
                  {r.planPrice}
                </span>
                <span className="w-[165px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.price}</span>
                <span className="w-[145px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.period}</span>
                <span className="w-[146px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.cap}</span>
                <span className="w-[156px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.access}</span>
                <span className="w-[140px] shrink-0">
                  <Pill dot className="h-[27px] w-[96px]">
                    Activated
                  </Pill>
                </span>
                <span className="flex w-[101px] shrink-0 items-center gap-[18px]">
                  <button aria-label={`View ${r.name}`} onClick={() => nav("/admin/subscriptions/details")}>
                    <PencilIcon />
                  </button>
                  <button aria-label="More actions">
                    <DotsIcon />
                  </button>
                </span>
              </div>
            ))}
            {rows.length === 0 && (
              <p className="px-[40px] py-[40px] text-[16px] font-semibold text-[#6B6B6B]">
                No subscriptions match your filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
