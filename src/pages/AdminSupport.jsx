import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { SearchIcon, ChevDown, PencilIcon, DotsIcon } from "../components/AdminShell";
import avatar1 from "../assets/avatar-1.webp";

/* Support & Platform Issue — Figma 1236:32825 (1440, desktop only).
   Stat cards h135 with left tile + label/value/"Last 30 Days"; labelled
   mint selects; table card titled "Transaction Comparison" (Figma copy
   kept), rows h115 with avatar reporter cells and dotted category pills. */

const STATS = [
  { tile: "bg-[#FFEEE2]", glyph: "users", label: "Open Tickets", value: "122" },
  { tile: "bg-[#E5FFE7]", glyph: "check", label: "In Progress", value: "124" },
  { tile: "bg-[#FFEEE2]", glyph: "users", label: "Awaiting User", value: "122" },
  { tile: "bg-[#FFEEE2]", glyph: "users", label: "Resolved", value: "122" },
];

const CATS = {
  Billing: "bg-[#D6E9FF] text-[#0087FF] dot-[#0087FF]",
  "Group Access": "bg-[#E9E4FF] text-[#7E00CD] dot-[#7E00CD]",
  Account: "bg-[#FFE9E0] text-[#FF0000] dot-[#FF0000]",
};

const ROWS = ["Billing", "Group Access", "Account", "Group Access", "Billing", "Group Access", "Billing"].map((c, i) => ({
  id: "SUP-0004455",
  subject: "Wallet Funding not reflected",
  name: "Haylie Siphron",
  email: "clysewebapp@gmail.com",
  cat: c,
  date: "Sep. 28, 2025",
  time: "10:30AM",
  status: i % 3 === 2 ? "Resolved" : "Open",
}));

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

function LSelect({ label, options }) {
  const [v, setV] = useState(options[0]);
  return (
    <label className="block">
      <span className="text-[16px] leading-[20px] font-semibold text-[#001701]">{label}</span>
      <span className="relative mt-[10px] flex h-[46px] w-[218px] items-center rounded-[10px] bg-[#E5FFE7] px-[11px]">
        <select value={v} onChange={(e) => setV(e.target.value)} className="w-full appearance-none bg-transparent pr-6 text-[16px] font-semibold text-[#001701] focus:outline-none">
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <span className="pointer-events-none absolute right-[11px]"><ChevDown color="#001701" /></span>
      </span>
    </label>
  );
}

export default function AdminSupport() {
  const nav = useNavigate();
  return (
    <AdminShell active="support">
      <div className="flex items-center gap-[16px]">
        <button onClick={() => nav(-1)} aria-label="Go back" className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#F1F8F2] shadow-[0_4px_10px_rgba(0,23,1,0.10)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5 8 12l7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <h1 className="text-[35px] leading-[43px] font-bold text-[#001701]">Support & Platform Issue</h1>
      </div>

      <div className="mt-[30px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex h-[135px] items-start gap-[16px] rounded-[10px] border border-[#999999] bg-white px-[21px] pt-[21px]">
            <span className={`grid h-[40px] w-[40px] flex-none place-items-center rounded-[10px] ${s.tile}`}>
              <TileGlyph kind={s.glyph} color={s.glyph === "check" ? "#048B0B" : "#FF6C03"} />
            </span>
            <span>
              <span className="block text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">{s.label}</span>
              <span className="block text-[32px] leading-[38px] font-bold text-[#001701]">{s.value}</span>
              <span className="mt-[6px] block text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">Last 30 Days</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[40px] flex flex-wrap items-end gap-[24px]">
        <label className="flex h-[40px] w-[374px] max-w-full items-center gap-[10px] rounded-full border border-[#999999] bg-white px-[20px]">
          <SearchIcon />
          <input placeholder="Search....." className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#9F9F9F] focus:outline-none" />
        </label>
        <LSelect label="Status" options={["All", "Open", "In Progress", "Resolved"]} />
        <LSelect label="Category" options={["All", "Billing", "Group Access", "Account"]} />
        <LSelect label="Date Range" options={["All", "Last 7 days", "Last 30 days"]} />
      </div>

      <div className="mt-[30px] overflow-x-auto rounded-[20px] border border-[#999999] bg-white pt-[30px] pb-[30px]">
        <div className="min-w-[1584px]">
          <p className="px-[22px] text-[20px] leading-[25px] font-bold text-[#001701]">Transaction Comparison</p>
          <div className="relative mt-[25px] flex h-[50px] w-full items-center bg-[#E5FFE7]">
            <span className="absolute left-[20px] h-[30px] w-[30px] rounded-[5px] border border-[#048B0B] bg-white" />
            {[["Ticket ID", 80], ["Subject", 300], ["Reported By", 700], ["Category", 1120], ["Submitted", 1360], ["Status", 1560], ["Action", 1720]].map(([l, x]) => (
              <span key={l} style={{ left: x }} className="absolute text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">{l}</span>
            ))}
          </div>
          {ROWS.map((r, i) => (
            <div key={i} className="border-b border-[#999999]">
              <div className="relative flex h-[115px] items-center">
                <span className="absolute left-[20px] h-[20px] w-[20px] rounded-[5px] border border-[#999999] bg-white" />
                <span className="absolute text-[16px] leading-[20px] font-bold text-[#001701]" style={{ left: 80 }}>{r.id}</span>
                <span className="absolute text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 300 }}>{r.subject}</span>
                <span className="absolute flex items-center gap-[16px]" style={{ left: 700 }}>
                  <img src={avatar1} alt="" className="h-[40px] w-[40px] rounded-full object-cover" />
                  <span>
                    <span className="block text-[18px] leading-[22px] font-bold text-[#001701]">{r.name}</span>
                    <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">{r.email}</span>
                  </span>
                </span>
                <span className="absolute" style={{ left: 1120 }}>
                  <span className={`flex h-[40px] items-center gap-[8px] rounded-[10px] px-[16px] text-[15px] font-semibold ${CATS[r.cat].split(" ").slice(0, 2).join(" ")}`}>
                    <span className={`h-[8px] w-[8px] rounded-full ${r.cat === "Billing" ? "bg-[#0087FF]" : r.cat === "Account" ? "bg-[#FF0000]" : "bg-[#7E00CD]"}`} />
                    {r.cat}
                  </span>
                </span>
                <span className="absolute" style={{ left: 1360 }}>
                  <span className="block text-[16px] leading-[20px] font-bold text-[#001701]">{r.date}</span>
                  <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">{r.time}</span>
                </span>
                <span className="absolute" style={{ left: 1560 }}>
                  <span className={`flex h-[27px] items-center rounded-[8px] px-[14px] text-[14px] font-semibold ${r.status === "Open" ? "bg-[#DDFFDE] text-[#048B0B]" : "bg-[#E5FFE7] text-[#048B0B]"}`}>{r.status}</span>
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
