import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { DCARD, DarkZone } from "../components/AdminShell";
import useAdminRows from "../components/useAdminRows";
import { FinAvatar } from "../components/FinanceShared";

/* Support & Platform Issue — Figma 1236:32825 (1440, desktop).
   The support workspace keeps Figma's dark canvas, four white metric cards,
   compact filters and wide comparison table. Rows and counts are always live;
   loading/error/empty states preserve the same table geometry without samples. */

const METRICS = [
  { label: "Open Tickets", match: (s) => /^open/.test(s), icon: "people", tone: "orange" },
  { label: "In Progress", match: (s) => /progress|investigat/.test(s), icon: "check", tone: "green" },
  { label: "Awaiting User", match: (s) => /await|waiting|user/.test(s), icon: "people", tone: "orange" },
  { label: "Resolved", match: (s) => /resolved|closed/.test(s), icon: "people", tone: "orange" },
];

const FILTERS = {
  status: ["All", "Open", "In Progress", "Awaiting User", "Resolved"],
  category: ["All", "Billing", "Group Access", "Account"],
  date: ["All", "Last 7 days", "Last 30 days", "Last 90 days"],
};

function MetricIcon({ kind, color }) {
  if (kind === "check") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="6" fill={color} />
        <path d="m8 12.2 2.6 2.6L16 9.4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8.5" r="3.2" fill={color} />
      <path d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" fill={color} />
      <circle cx="16.5" cy="9.5" r="2.6" fill={color} />
      <path d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3" fill={color} />
    </svg>
  );
}

function Select({ label, options, value, onChange }) {
  return (
    <label className="relative flex h-[40px] min-w-[160px] flex-1 items-center justify-between rounded-[8px] border border-black bg-[#DEFFE1] px-[14px] shadow-[0_0_0_2px_#fff]">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none bg-transparent pr-7 text-[15px] font-semibold text-[#001701] outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <svg className="pointer-events-none absolute right-[12px]" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="m6 9 6 6 6-6" stroke="#001701" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  );
}

function categoryStyle(category) {
  if (/bill/i.test(category)) return "bg-[#D6E9FF] text-[#0087FF]";
  if (/account/i.test(category)) return "bg-[#FFE9E0] text-[#E31B00]";
  return "bg-[#E9E4FF] text-[#7E00CD]";
}

function statusStyle(status) {
  if (/resolved|closed/i.test(status)) return "bg-[#DFFFE1] text-[#048B0B]";
  if (/open|active/i.test(status)) return "bg-[#D6E9FF] text-[#0087FF]";
  return "bg-[#FFF2E5] text-[#B45B00]";
}

export default function AdminSupport() {
  const nav = useNavigate();
  const { rows: live, status, total } = useAdminRows("support");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const rows = useMemo(() => (live || []).filter((row) => {
    const queryMatch = !q.trim() || [row.issue, row.name, row.email, row.id].some((value) => String(value || "").toLowerCase().includes(q.trim().toLowerCase()));
    const statusMatch = statusFilter === "All" || String(row.status || "").replaceAll("_", " ").toLowerCase() === statusFilter.toLowerCase();
    const categoryMatch = categoryFilter === "All" || String(row.sub || "").toLowerCase() === categoryFilter.toLowerCase();
    return queryMatch && statusMatch && categoryMatch;
  }), [live, q, statusFilter, categoryFilter]);

  const metricValue = (metric) => {
    if (status === "loading") return "…";
    if (status === "error") return "—";
    return String((live || []).filter((row) => metric.match(String(row.status || "").replaceAll("_", " ").toLowerCase())).length);
  };

  return (
    <AdminShell active="support" nav2 dark>
      <DarkZone>
        <div className="mt-[32px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
          {METRICS.map((metric) => (
            <div key={metric.label} className={`flex h-[135px] items-start gap-[16px] rounded-[10px] bg-white px-[21px] pt-[21px] ${DCARD}`}>
              <span className={`grid h-[40px] w-[40px] flex-none place-items-center rounded-[10px] ${metric.tone === "green" ? "bg-[#E5FFE7]" : "bg-[#FFEEE2]"}`}>
                <MetricIcon kind={metric.icon} color={metric.tone === "green" ? "#048B0B" : "#FF6C03"} />
              </span>
              <span>
                <span className="block text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">{metric.label}</span>
                <span className="mt-[2px] block text-[25px] leading-[35px] font-bold text-[#001701]">{metricValue(metric)}</span>
                <span className="mt-[2px] block text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">Last 30 Days</span>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-[35px] flex flex-wrap items-center gap-[24px]">
          <label className="flex h-[40px] w-[380px] max-w-full items-center gap-[10px] rounded-full border border-black bg-white px-[18px] shadow-[0_0_0_2px_#fff]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="10.8" cy="10.8" r="6.8" stroke="#4E4E4E" strokeWidth="1.8"/><path d="m16 16 4.5 4.5" stroke="#4E4E4E" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search...." aria-label="Search support tickets" className="w-full bg-transparent text-[14px] font-semibold text-[#001701] placeholder-[#4E4E4E] outline-none" />
          </label>
          <Select label="Status" value={statusFilter} onChange={setStatusFilter} options={FILTERS.status} />
          <Select label="Category" value={categoryFilter} onChange={setCategoryFilter} options={FILTERS.category} />
          <Select label="Date range" value={dateFilter} onChange={setDateFilter} options={FILTERS.date} />
        </div>

        <div className={`-ml-[34px] mt-[38px] w-[calc(100%+34px)] overflow-x-auto rounded-[20px] bg-white ${DCARD}`}>
          <div className="min-w-[1120px] pt-[44px] pb-[18px]">
            <p className="px-[22px] text-[20px] leading-[25px] font-bold text-[#001701]">Transaction Comparison</p>
            <div className="relative mt-[32px] flex h-[50px] items-center bg-[#E5FFE7]">
              <span className="absolute left-[20px] h-[30px] w-[30px] rounded-[5px] border border-[#048B0B] bg-white" />
              {[['Ticket ID', 70], ['Subject', 200], ['Reported By', 375], ['Category', 650], ['Submitted', 820], ['Status', 965], ['Action', 1050]].map(([label, left]) => (
                <span key={label} style={{ left }} className="absolute text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">{label}</span>
              ))}
            </div>
            {status === "loading" && Array.from({ length: 7 }, (_, i) => (
              <div key={`loading-${i}`} className="relative flex h-[108px] items-center border-b border-[#E4E4E4]" aria-hidden>
                {[70, 200, 375, 650, 820, 965].map((left, index) => (
                  <span key={left} style={{ left }} className={`absolute h-[13px] animate-pulse rounded bg-[#E9EEE9] ${index === 2 ? "w-[210px]" : index === 1 ? "w-[260px]" : "w-[110px]"}`} />
                ))}
              </div>
            ))}
            {(status === "empty" || status === "error" || (status === "live" && rows.length === 0)) && (
              <p className="px-[22px] py-[22px] text-[16px] font-semibold text-[#4E4E4E]">
                {status === "error" ? "Support tickets could not be loaded. Try again in a moment." : status === "empty" ? "No support tickets yet — member reports will appear here." : "No support tickets match these filters."}
              </p>
            )}
            {rows.map((row, index) => {
              const category = row.sub || "Other";
              const label = String(row.status || "Open").replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <div key={row.id || `${row.issue}-${index}`} className="relative flex h-[115px] items-center border-b border-[#999999] last:border-b-0">
                  <input type="checkbox" aria-label={`Select ${row.id || row.issue}`} className="absolute left-[20px] h-[20px] w-[20px] accent-[#048B0B]" />
                  <span title={row.id || "—"} className="absolute max-w-[115px] truncate text-[16px] leading-[20px] font-bold text-[#001701]" style={{ left: 70 }}>{row.id || "—"}</span>
                  <span className="absolute max-w-[160px] truncate text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 200 }}>{row.issue || "—"}</span>
                  <span className="absolute flex items-center gap-[12px]" style={{ left: 375 }}>
                    <FinAvatar i={index} size={36} />
                    <span className="max-w-[195px]">
                      <span className="block truncate text-[17px] leading-[22px] font-bold text-[#001701]">{row.name || "—"}</span>
                      <span className="block truncate text-[15px] leading-[20px] text-[#4E4E4E]">{row.email || "—"}</span>
                    </span>
                  </span>
                  <span className="absolute" style={{ left: 650 }}>
                    <span className={`inline-flex h-[40px] items-center gap-[8px] rounded-[10px] px-[12px] text-[14px] font-semibold ${categoryStyle(category)}`}><span className="h-[8px] w-[8px] rounded-full bg-current" />{category}</span>
                  </span>
                  <span className="absolute text-[15px] leading-[20px] font-bold text-[#001701]" style={{ left: 820 }}>{row.date || "—"}</span>
                  <span className="absolute" style={{ left: 965 }}>
                    <span className={`inline-flex h-[30px] items-center rounded-[8px] px-[12px] text-[13px] font-semibold ${statusStyle(label)}`}>{label}</span>
                  </span>
                  <button type="button" onClick={() => nav("/admin/data/support")} aria-label={`Open ${row.id || "support"} workspace`} className="absolute text-[14px] font-semibold text-[#048B0B] hover:underline" style={{ left: 1110 }}>Open</button>
                </div>
              );
            })}
            {status === "live" && rows.length > 0 && Array.from({ length: Math.max(0, 7 - rows.length) }, (_, index) => (
              <div key={`empty-space-${index}`} className="h-[115px] border-b border-[#E4E4E4]" aria-hidden />
            ))}
            {status === "live" && rows.length > 0 && (
              <div className="flex justify-end px-[30px] pt-[18px] text-[13px] font-semibold text-[#6B6B6B]">Showing {rows.length} of {total} support tickets</div>
            )}
          </div>
        </div>
      </DarkZone>
    </AdminShell>
  );
}
