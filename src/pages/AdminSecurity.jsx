import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { SearchIcon, ChevDown, PencilIcon, DotsIcon } from "../components/AdminShell";
import useAdminRows from "../components/useAdminRows";
import { goBackOr } from "../lib/navigation";

/* Platform Moderation — Figma 1257:54631 (1440, dark content bg).
   White stat cards h135; sage selects #A9C7A9; white card with template
   tabs (active = green underline); rows h115: type tile, name/sub,
   issue, reporter avatar cell. */

const STATS = [
  { tile: "bg-[#E5FFE7]", glyph: "users", color: "#048B0B", label: "Records" },
  { tile: "bg-[#E5FFE7]", glyph: "check", color: "#048B0B", label: "User Targets" },
  { tile: "bg-[#E5FFE7]", glyph: "check", color: "#048B0B", label: "Group Targets" },
  { tile: "bg-[#FFEEE2]", glyph: "users", color: "#FF6C03", label: "Suspensions" },
];

const TABS = ["All Records", "Warnings", "Restrictions", "Suspensions", "Restorations"];

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
  const [query, setQuery] = useState("");
  const [targetFilter, setTargetFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  /* This route is Platform Moderation, so it uses moderation records rather
     than the separate security-events feed. */
  const { rows: live, status, total } = useAdminRows("moderation");
  const rows = useMemo(() => (live || []).filter((row) => {
    const q = query.trim().toLowerCase();
    const queryMatch = !q || [row.name, row.sub, row.type, row.issue, row.rep, row.id]
      .some((value) => String(value || "").toLowerCase().includes(q));
    const targetMatch = targetFilter === "All" || String(row.sub || "").toLowerCase() === targetFilter.toLowerCase();
    const actionMatch = actionFilter === "All" || String(row.type || "").toLowerCase() === actionFilter.toLowerCase();
    const statusMatch = statusFilter === "All" || String(row.status || "").toLowerCase() === statusFilter.toLowerCase();
    const action = String(row.action || row.type || "").toLowerCase().replaceAll("_", " ");
    const selectedAction = tab === "All Records" ? "" : tab.slice(0, -1).toLowerCase();
    const tabMatch = !selectedAction || action === selectedAction;
    return queryMatch && targetMatch && actionMatch && statusMatch && tabMatch;
  }), [live, query, targetFilter, actionFilter, statusFilter, tab]);
  const statValue = (label) => {
    if (status === "loading") return "…";
    if (status === "error") return "—";
    if (label === "Records") return String(total ?? live?.length ?? 0);
    if (label === "User Targets" || label === "Group Targets") {
      const targetType = label.startsWith("User") ? "user" : "group";
      return String((live || []).filter((row) => String(row.targetType || "").toLowerCase() === targetType).length);
    }
    return String((live || []).filter((row) => String(row.action || row.type || "").toLowerCase() === "suspension").length);
  };
  const optionValues = (field) => [...new Set((live || []).map((row) => row[field]).filter(Boolean))].sort();
  const filters = [
    { value: targetFilter, set: setTargetFilter, options: ["User", "Group"] },
    { value: actionFilter, set: setActionFilter, options: optionValues("type") },
    { value: statusFilter, set: setStatusFilter, options: optionValues("status") },
  ];
  return (
    <AdminShell active="security" sub="moderation" expand dark>
      <div className="flex items-center gap-[16px]">
        <button onClick={() => goBackOr(nav, "/admin")} aria-label="Go back" className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#F1F8F2] shadow-[0_4px_10px_rgba(0,23,1,0.10)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5 8 12l7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <span className="ml-auto flex items-center gap-[16px] text-[14px] font-semibold">
          <button type="button" onClick={() => nav("/admin/data/securityAlerts")} className="text-[#0087FF] hover:underline">Alerts</button>
          <button type="button" onClick={() => nav("/admin/data/securityIncidents")} className="text-[#0087FF] hover:underline">Incidents</button>
          <button type="button" onClick={() => nav("/admin/data/securitySummary")} className="text-[#0087FF] hover:underline">Overview & scans</button>
          <button type="button" onClick={() => nav("/admin/data/moderation")} className="text-[#0087FF] hover:underline">Moderation records</button>
        </span>
      </div>

      <div className="mt-[45px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex h-[135px] items-start gap-[16px] rounded-[10px] bg-white px-[21px] pt-[21px]">
            <span className={`grid h-[40px] w-[40px] flex-none place-items-center rounded-[10px] ${s.tile}`}>
              <TileGlyph kind={s.glyph} color={s.color} />
            </span>
            <span>
              <span className="block text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">{s.label}</span>
              <span className="block text-[32px] leading-[38px] font-bold text-[#001701]">{statValue(s.label)}</span>
              <span className="mt-[6px] block text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">Current API results</span>
            </span>
          </div>
        ))}
      </div>

      <div className="mt-[50px] flex flex-wrap items-center gap-[24px]">
        <label className="flex h-[40px] w-[374px] max-w-full items-center gap-[10px] rounded-full bg-white px-[20px]">
          <SearchIcon />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search....." aria-label="Search moderation records" className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#9F9F9F] focus:outline-none" />
        </label>
        {filters.map(({ value, set, options }, i) => (
          <span key={i} className="relative flex h-[46px] w-[218px] items-center rounded-[10px] bg-[#A9C7A9] px-[11px]">
            <select value={value} onChange={(event) => set(event.target.value)} aria-label={["Filter by target type", "Filter by action", "Filter by status"][i]} className="w-full appearance-none bg-transparent pr-6 text-[16px] font-semibold text-[#001701] focus:outline-none">
              <option value="All">All</option>
              {options.map((option) => <option key={option} value={option}>{option}</option>)}
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
            {[["Type", 80], ["Name / Group", 270], ["Issue / Reason", 590], ["Reported By", 885], ["Status", 1300], ["Action", 1450]].map(([l, x]) => (
              <span key={l} style={{ left: x }} className="absolute text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">{l}</span>
            ))}
          </div>
          {status === "loading" && <p role="status" className="px-[24px] py-[32px] text-[16px] font-semibold text-[#4E4E4E]">Loading moderation records…</p>}
          {status === "error" && <p role="alert" className="px-[24px] py-[32px] text-[16px] font-semibold text-[#A11B1B]">Moderation records could not be loaded. Try again shortly.</p>}
          {(status === "empty" || (status === "live" && rows.length === 0)) && <p className="px-[24px] py-[32px] text-[16px] font-semibold text-[#4E4E4E]">{status === "empty" ? "No moderation records yet." : "No records match these filters."}</p>}
          {rows.map((r, i) => (
            <div key={i} className="border-b border-[#999999]">
              <div className="relative flex h-[115px] items-center">
                <span className="absolute left-[20px] h-[20px] w-[20px] rounded-[5px] border border-[#999999] bg-white" />
                <span className="absolute flex items-center gap-[16px]" style={{ left: 80 }}>
                  <span className="grid h-[40px] w-[40px] place-items-center rounded-[10px] bg-[#E5FFE7]">
                    <TileGlyph kind="users" color="#048B0B" />
                  </span>
                  <span className="text-[18px] leading-[22px] font-bold text-[#001701]">{r.sub}</span>
                </span>
                <span className="absolute" style={{ left: 270 }}>
                  <span className="block text-[18px] leading-[22px] font-bold text-[#001701]">{r.name}</span>
                    <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">{r.email && r.email !== "—" ? r.email : r.sub}</span>
                </span>
                <span className="absolute text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ left: 590 }}>{r.issue}</span>
                <span className="absolute flex items-center gap-[16px]" style={{ left: 885 }}>
                  <img src={r.av} alt="" className="h-[40px] w-[40px] rounded-full object-cover" />
                  <span>
                    <span className="block text-[18px] leading-[22px] font-bold text-[#001701]">{r.rep}</span>
                    <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">{r.repEmail || "—"}</span>
                  </span>
                </span>
                <span className="absolute" style={{ left: 1300 }}>
                  <span className="flex h-[27px] items-center rounded-[8px] bg-[#DDFFDE] px-[14px] text-[14px] font-semibold text-[#048B0B]">{String(r.status || "—").replaceAll("_", " ")}</span>
                </span>
                <span className="absolute flex items-center gap-[10px]" style={{ left: 1450 }}>
                  <span className="text-[14px] font-semibold text-[#4E4E4E]">{r.type}</span>
                  <button type="button" onClick={() => nav(`/admin/data/moderation?id=${encodeURIComponent(r.id)}`)} aria-label={`View moderation record ${r.id}`} className="rounded p-1 hover:bg-[#E5FFE7]"><PencilIcon /></button>
                  <button type="button" onClick={() => nav(`/admin/data/moderation?target_type=${encodeURIComponent(r.targetType || "")}&target_id=${encodeURIComponent(r.targetId || "")}`)} aria-label={`Open actions for ${r.name}`} className="rounded p-1 hover:bg-[#E5FFE7]"><DotsIcon /></button>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
