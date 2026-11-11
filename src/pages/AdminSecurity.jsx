import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { SearchIcon, ChevDown, PencilIcon, DotsIcon } from "../components/AdminShell";
import avatar1 from "../assets/avatar-1.webp";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";

/* Platform Moderation — Figma 1257:54631 (1440, dark content bg).
   White stat cards h135; sage selects #A9C7A9; white card with template
   tabs (active = green underline); rows h115: type tile, name/sub,
   issue, reporter avatar cell. */

const STATS = [
  { tile: "bg-[#E5FFE7]", glyph: "users", color: "#048B0B", label: "All", value: "14" },
  { tile: "bg-[#E5FFE7]", glyph: "check", color: "#048B0B", label: "User", value: "7" },
  { tile: "bg-[#E5FFE7]", glyph: "check", color: "#048B0B", label: "Group", value: "3" },
  { tile: "bg-[#FFEEE2]", glyph: "users", color: "#FF6C03", label: "Subscription", value: "4" },
];

const TABS = ["All Template", "Email", "SMS", "In-App", "Push Notification"];

const ROWS = [
  { type: "User", name: "Maria Philips", sub: "clysewebapp@gmail.com", issue: "Subscription Activities", rep: "Madelyn Dokidis", av: avatarAshlynn },
  { type: "Group", name: "Netflix Premium", sub: "Group", issue: "Fake Subscription", rep: "Maria Philips", av: avatarAspen },
  { type: "User", name: "Maria Philips", sub: "clysewebapp@gmail.com", issue: "Refund Abuse", rep: "Charlie Philips", av: avatar1 },
  { type: "User", name: "Maria Philips", sub: "clysewebapp@gmail.com", issue: "Subscription Activities", rep: "Kaylynn Lipshutz", av: avatarKianna },
  { type: "Group", name: "Adobe Creative Cloud", sub: "Subscription", issue: "Fake Subscription", rep: "Brandon Ekstrom", av: avatarAshlynn },
  { type: "Group", name: "Netflix Premium", sub: "Group", issue: "Inappropriate Content", rep: "Paityn Culhane", av: avatarAspen },
  { type: "User", name: "Maria Philips", sub: "clysewebapp@gmail.com", issue: "Refund Abuse", rep: "Allison Herwitz", av: avatar1 },
  { type: "Group", name: "Netflix Premium", sub: "Group", issue: "Inappropriate Content", rep: "Martin Press", av: avatarKianna },
];

function TileGlyph({ kind, color }) {
  if (kind === "check")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="6" fill={color} />
        <path d="m8 12.2 2.6 2.6L16 9.4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.5" r="3.2" fill={color} />
      <path d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" fill={color} />
      <circle cx="16.5" cy="9.5" r="2.6" fill={color} />
      <path d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3" fill={color} />
    </svg>
  );
}

export default function AdminSecurity() {
  const nav = useNavigate();
  const [tab, setTab] = useState(TABS[0]);
  return (
    <AdminShell active="security" sub="moderation" expand dark>
      <div className="flex items-center gap-[16px]">
        <button onClick={() => nav(-1)} aria-label="Go back" className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#F1F8F2] shadow-[0_4px_10px_rgba(0,23,1,0.10)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5 8 12l7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="mt-[45px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex h-[135px] items-start gap-[16px] rounded-[10px] bg-white px-[21px] pt-[21px]">
            <span className={`grid h-[40px] w-[40px] flex-none place-items-center rounded-[10px] ${s.tile}`}>
              <TileGlyph kind={s.glyph} color={s.color} />
            </span>
            <span>
              <span className="block text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">{s.label}</span>
              <span className="block text-[32px] leading-[38px] font-bold text-[#001701]">{s.value}</span>
              <span className="mt-[6px] block text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">Last 30 Days</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[50px] flex flex-wrap items-center gap-[24px]">
        <label className="flex h-[40px] w-[374px] max-w-full items-center gap-[10px] rounded-full bg-white px-[20px]">
          <SearchIcon />
          <input placeholder="Search....." className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#9F9F9F] focus:outline-none" />
        </label>
        {[0, 1, 2].map((i) => (
          <span key={i} className="relative flex h-[46px] w-[218px] items-center rounded-[10px] bg-[#A9C7A9] px-[11px]">
            <select className="w-full appearance-none bg-transparent pr-6 text-[16px] font-semibold text-[#001701] focus:outline-none">
              <option>All</option>
            </select>
            <span className="pointer-events-none absolute right-[11px]"><ChevDown color="#001701" /></span>
          </span>
        ))}
      </div>

      <div className="mt-[30px] overflow-x-auto rounded-[20px] bg-white pt-[30px] pb-[30px]">
        <div className="min-w-[1584px]">
          <div className="flex gap-[40px] px-[40px]">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`border-b-2 pb-[10px] text-[18px] leading-[22px] font-semibold ${tab === t ? "border-[#048B0B] text-[#048B0B]" : "border-transparent text-[#4E4E4E]"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative mt-[30px] flex h-[50px] w-full items-center bg-[#E5FFE7]">
            <span className="absolute left-[20px] h-[30px] w-[30px] rounded-[5px] border border-[#048B0B] bg-white" />
            {[["Type", 80], ["Name / Group", 380], ["Issue / Reason", 780], ["Reported By", 1180], ["Status", 1560], ["Action", 1720]].map(([l, x]) => (
              <span key={l} style={{ left: x }} className="absolute text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">{l}</span>
            ))}
          </div>
          {ROWS.map((r, i) => (
            <div key={i} className="border-b border-[#999999]">
              <div className="relative flex h-[115px] items-center">
                <span className="absolute left-[20px] h-[20px] w-[20px] rounded-[5px] border border-[#999999] bg-white" />
                <span className="absolute flex items-center gap-[16px]" style={{ left: 80 }}>
                  <span className="grid h-[40px] w-[40px] place-items-center rounded-[10px] bg-[#E5FFE7]">
                    <TileGlyph kind="users" color="#048B0B" />
                  </span>
                  <span className="text-[18px] leading-[22px] font-bold text-[#001701]">{r.type}</span>
                </span>
                <span className="absolute" style={{ left: 380 }}>
                  <span className="block text-[18px] leading-[22px] font-bold text-[#001701]">{r.name}</span>
                  <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">{r.sub}</span>
                </span>
                <span className="absolute text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 780 }}>{r.issue}</span>
                <span className="absolute flex items-center gap-[16px]" style={{ left: 1180 }}>
                  <img src={r.av} alt="" className="h-[40px] w-[40px] rounded-full object-cover" />
                  <span>
                    <span className="block text-[18px] leading-[22px] font-bold text-[#001701]">{r.rep}</span>
                    <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">clysewebapp@gmail.com</span>
                  </span>
                </span>
                <span className="absolute" style={{ left: 1560 }}>
                  <span className="flex h-[27px] items-center rounded-[8px] bg-[#DDFFDE] px-[14px] text-[14px] font-semibold text-[#048B0B]">Reported</span>
                </span>
                <span className="absolute flex items-center gap-[12px]" style={{ left: 1720 }}>
                  <button aria-label="Edit"><PencilIcon /></button>
                  <button aria-label="More"><DotsIcon /></button>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
