import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { PageTitle, Pill, SearchIcon, ChevDown, PencilIcon, DotsIcon } from "../components/AdminShell";
import { GlyphUsers, GlyphUserCheck, GlyphBadge, GlyphX } from "../components/AdminGlyphs";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";

/* User List — Figma 1170:23344 (1440, desktop only). Static: search +
   filters work client-side. Copy fix: "Susspended User" -> "Suspended User". */

const STATS = [
  { glyph: <GlyphUsers />, label: "Total User", value: "124,000" },
  { glyph: <GlyphUserCheck />, label: "Active User", value: "124,000" },
  { glyph: <GlyphBadge />, label: "Verified User", value: "124,000" },
  { glyph: <GlyphX />, label: "Suspended User", value: "124,000" },
];

const ROWS = [
  { name: "Ann Kenter", img: avatarAshlynn, email: "ann@gmail.com", phone: "+234 801 234 5678", acct: "active", ver: "verified", date: "Sep. 20, 2026", grp: "5/10" },
  { name: "Paityn Kenter", img: avatarAspen, email: "paityn@gmail.com", phone: "+234 802 234 5678", acct: "active", ver: "verified", date: "Sep. 20, 2026", grp: "5/10" },
  { name: "James Lipshutz", img: avatarKianna, email: "james@gmail.com", phone: "+234 803 234 5678", acct: "active", ver: "verified", date: "Sep. 20, 2026", grp: "5/10" },
  { name: "Dulce Press", img: avatar1, email: "dulce@gmail.com", phone: "+234 804 234 5678", acct: "suspended", ver: "verified", date: "Sep. 20, 2026", grp: "5/10" },
  { name: "Jakob Lubin", img: avatar2, email: "jakob@gmail.com", phone: "+234 805 234 5678", acct: "active", ver: "unverified", date: "Sep. 20, 2026", grp: "5/10" },
  { name: "Kaylynn Dokidis", img: avatar3, email: "kaylynn@gmail.com", phone: "+234 806 234 5678", acct: "pending", ver: "pending", date: "Sep. 20, 2026", grp: "5/10" },
];

const ACCT = {
  active: { tone: "green", label: "Activated" },
  suspended: { tone: "red", label: "Suspended" },
  pending: { tone: "orange", label: "Pending" },
};
const VER = {
  verified: { tone: "green", label: "Verified" },
  unverified: { tone: "gray", label: "Unverified" },
  pending: { tone: "orange", label: "Pending" },
};

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

export default function AdminUsers() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [acct, setAcct] = useState("All");
  const [ver, setVer] = useState("All");
  const [checked, setChecked] = useState([]);
  const rows = useMemo(
    () =>
      ROWS.filter(
        (r) =>
          r.name.toLowerCase().includes(q.trim().toLowerCase()) &&
          (acct === "All" || ACCT[r.acct].label === acct) &&
          (ver === "All" || VER[r.ver].label === ver)
      ),
    [q, acct, ver]
  );
  const all = rows.length > 0 && rows.every((r) => checked.includes(r.name));
  const toggle = (name) => setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="users" sub="um">
      <PageTitle title="User List" />

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
        <Filter label="Account Status" value={acct} onChange={setAcct} options={["All", "Activated", "Suspended", "Pending"]} />
        <Filter label="Verification Status" value={ver} onChange={setVer} options={["All", "Verified", "Unverified", "Pending"]} />
        <Filter label="Registered Date" value="All" onChange={() => {}} options={["All", "Last 30 Days", "Last 90 Days"]} />
      </div>

      <div className="mt-[30px] overflow-x-auto rounded-[20px] border border-[#999999] bg-white">
        <div className="min-w-[1391px]">
          <div className="mt-[46px] flex h-[60px] items-center bg-[#DFFFE1] text-[16px] font-semibold text-[#4E4E4E]">
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
            <span className="w-[245px] shrink-0">User</span>
            <span className="w-[226px] shrink-0">Email/Phone Number</span>
            <span className="w-[136px] shrink-0">Account Status</span>
            <span className="w-[151px] shrink-0">Verification Status</span>
            <span className="w-[145px] shrink-0">Registration Date</span>
            <span className="w-[165px] shrink-0">Active Subscription/Group</span>
            <span className="w-[132px] shrink-0">Action</span>
          </div>
          <div className="divide-y divide-[#999999] pb-[20px]">
            {rows.map((r) => (
              <div key={r.name} className="flex h-[111px] items-center">
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
                <span className="flex w-[245px] shrink-0 items-center gap-[10px]">
                  <img src={r.img} alt={r.name} className="h-[50px] w-[50px] rounded-full object-cover" />
                  <span className="text-[18px] font-bold text-[#001701]">{r.name}</span>
                </span>
                <span className="w-[226px] shrink-0">
                  <span className="block text-[16px] font-semibold text-[#001701]">{r.email}</span>
                  <span className="block text-[14px] font-semibold text-[#6B6B6B]">{r.phone}</span>
                </span>
                <span className="flex w-[136px] shrink-0">
                  <Pill tone={ACCT[r.acct].tone} className="h-[37px] w-[127px]">
                    {ACCT[r.acct].label}
                  </Pill>
                </span>
                <span className="flex w-[151px] shrink-0">
                  <Pill tone={VER[r.ver].tone} className="h-[37px] w-[127px]">
                    {VER[r.ver].label}
                  </Pill>
                </span>
                <span className="w-[145px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.date}</span>
                <span className="w-[165px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.grp}</span>
                <span className="flex w-[132px] shrink-0 items-center gap-[18px]">
                  <button aria-label={`View ${r.name}`} onClick={() => nav("/admin/users/details")}>
                    <PencilIcon />
                  </button>
                  <button aria-label="More actions">
                    <DotsIcon />
                  </button>
                </span>
              </div>
            ))}
            {rows.length === 0 && (
              <p className="px-[40px] py-[40px] text-[16px] font-semibold text-[#6B6B6B]">No users match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
