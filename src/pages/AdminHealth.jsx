import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import AdminShell from "../components/AdminShell";
import useAdminRows from "../components/useAdminRows";

/* System Monitoring — Figma 1260:56887 (1440, dark content bg).
   Stat cards h135; Performance + Server Status row; Admin Activity +
   Recent System Event row; full-width Server Status action list. */

const STATS = [
  { tile: "bg-[#E5FFE7]", glyph: "users", label: "System Status" },
  { tile: "bg-[#E5FFE7]", glyph: "check", label: "Services Online" },
  { tile: "bg-[#E5FFE7]", glyph: "check", label: "Open Incidents" },
  { tile: "bg-[#FFEEE2]", glyph: "users", label: "Failed Admin Ops" },
];

const dateTime = (value) => value
  ? new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
  : "—";
const shortDate = (value) => value
  ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  : "—";
const titleCase = (value) => String(value || "—").replace(/[_-]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

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

function ChevR() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="m9 5 7 7-7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminHealth() {
  const nav = useNavigate();
  /* Live system status (ADMIN-014): GET /admin/health/status drives the stat
     tiles and the server list; POST /admin/health/run re-runs the checks.
     Figma values show only until the first answer arrives. */
  const [status, setStatus] = useState(null);
  const [stat, setStat] = useState("loading"); // loading | live | error
  const [running, setRunning] = useState(false);
  const [runNote, setRunNote] = useState("");

  const load = useCallback(async () => {
    const res = await api("/admin/health/status");
    if (res.error || !res.data) return setStat("error");
    setStatus(res.data);
    setStat("live");
  }, []);

  useEffect(() => { load(); }, [load]);

  const runChecks = async () => {
    if (running) return;
    setRunning(true);
    setRunNote("");
    const res = await api("/admin/health/run", { method: "POST" });
    setRunning(false);
    if (res.error) return setRunNote(res.error.message || "Could not run the checks.");
    setRunNote("Checks completed.");
    load();
  };

  const ok = stat === "live";
  const { rows: auditRows, status: auditState } = useAdminRows("audit");
  const { rows: eventRows, status: eventState } = useAdminRows("security");
  const { rows: historyRows, status: historyState } = useAdminRows("health");
  const services = ok && Array.isArray(status?.services)
    ? status.services.map((service) => {
        const serviceStatus = String(service.status || "unknown").toLowerCase();
        return {
          name: service.name || titleCase(service.service_key || service.key || "Service"),
          status: titleCase(serviceStatus),
          online: ["operational", "online", "ok", "up"].includes(serviceStatus),
        };
      })
    : [];
  const cards = [
    { ...STATS[0], value: stat === "live" ? titleCase(status?.status || "unknown") : stat === "loading" ? "…" : "—", note: stat === "live" ? "Live snapshot" : stat === "loading" ? "Loading" : "Unavailable" },
    { ...STATS[1], value: stat === "live" ? `${services.filter((service) => service.online).length}/${services.length}` : stat === "loading" ? "…" : "—", note: "Operational / total" },
    { ...STATS[2], value: stat === "live" ? String(status?.incidents?.open ?? 0) : stat === "loading" ? "…" : "—", note: "Currently open" },
    { ...STATS[3], value: stat === "live" ? String(status?.admin_activity?.failed ?? 0) : stat === "loading" ? "…" : "—", note: "Current counter" },
  ];
  const latencyRows = (historyRows || []).filter((row) => Number.isFinite(Number(row.latencyMs)) && row.latencyMs != null).sort((a, b) => Date.parse(a.createdAt || 0) - Date.parse(b.createdAt || 0)).slice(-12);
  const maxLatency = Math.max(1, ...latencyRows.map((row) => Number(row.latencyMs)));
  const latencyPoints = latencyRows.map((row, index) => {
    const x = latencyRows.length === 1 ? 325 : 50 + (550 * index) / (latencyRows.length - 1);
    const y = 180 - (Number(row.latencyMs) / maxLatency) * 140;
    return { x, y, row };
  });
  const latencyPath = latencyPoints.map(({ x, y }, index) => `${index ? "L" : "M"} ${x} ${y}`).join(" ");
  const latencyArea = latencyPath ? `${latencyPath} L ${latencyPoints.at(-1).x} 180 L ${latencyPoints[0].x} 180 Z` : "";
  return (
    <AdminShell active="security" sub="health" expand dark>
      <div className="flex items-center gap-[16px]">
        <button onClick={() => nav(-1)} aria-label="Go back" className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#F1F8F2] shadow-[0_4px_10px_rgba(0,23,1,0.10)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5 8 12l7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        {/* POST /admin/health/run — re-runs the six checks now. */}
        <button
          onClick={runChecks}
          disabled={running}
          className="flex h-[44px] items-center rounded-[10px] bg-[#048B0B] px-[20px] text-[16px] leading-[20px] font-semibold text-white disabled:opacity-60"
        >
          {running ? "Running checks…" : "Run Checks Now"}
        </button>
        {runNote && <span className="text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">{runNote}</span>}
        <span className="ml-auto flex items-center gap-[16px] text-[14px] font-semibold">
          <button type="button" onClick={() => nav("/admin/data/healthHistory")} className="text-[#0087FF] hover:underline">Full check history</button>
          <button type="button" onClick={() => nav("/admin/data/healthIncidents")} className="text-[#0087FF] hover:underline">Incidents</button>
        </span>
        {stat === "error" && (
          <span className="text-[16px] leading-[20px] font-semibold text-[#FF0000]">
            Could not load system status.
          </span>
        )}
      </div>

      <div className="mt-[45px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
        {cards.map((s) => (
          <div key={s.label} className="flex h-[135px] items-start gap-[16px] rounded-[10px] bg-white px-[21px] pt-[21px]">
            <span className={`grid h-[40px] w-[40px] flex-none place-items-center rounded-[10px] ${s.tile}`}>
              <TileGlyph kind={s.glyph} color={s.glyph === "check" ? "#048B0B" : "#FF6C03"} />
            </span>
            <span>
              <span className="block text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">{s.label}</span>
              <span className="block text-[32px] leading-[38px] font-bold text-[#001701]">{s.value}</span>
              <span className="mt-[6px] block text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">{s.note}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Performance + Server status */}
      <div className="mt-[35px] flex flex-col gap-[35px] xl:flex-row">
        <div className="min-w-0 flex-1 rounded-[20px] bg-white px-[40px] pt-[35px] pb-[40px]">
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">System Performance</p>
          <div className="mt-[35px] flex items-center">
            <p className="text-[18px] leading-[22px] font-semibold text-[#001701]">Health-check latency</p>
            <span className="ml-auto flex h-[40px] items-center rounded-[10px] border border-[#999999] px-[16px] text-[16px] font-bold text-[#001701]">
              {historyState === "live" && latencyRows.length ? `${latencyRows.at(-1).latencyMs} ms` : historyState === "loading" ? "Loading…" : "—"}
            </span>
          </div>
          {historyState === "live" && latencyRows.length > 0 ? (
            <svg viewBox="0 0 640 220" className="mt-[30px] w-full" role="img" aria-label="Health check latency history in milliseconds">
              {[0, 1, 2, 3, 4].map((i) => {
                const value = Math.round(maxLatency * (4 - i) / 4);
                return <g key={i}><line x1="50" y1={20 + i * 40} x2="640" y2={20 + i * 40} stroke="#9CC79E" strokeWidth="1" strokeDasharray="2 4" /><text x="0" y={24 + i * 40} fill="#001701" fontSize="12" fontWeight="700">{value}ms</text></g>;
              })}
              {latencyArea && <path d={latencyArea} fill="#46C04C" fillOpacity="0.25" />}
              <path d={latencyPath} fill="none" stroke="#048B0B" strokeWidth="2.5" />
              {latencyPoints.filter((_, index) => index === 0 || index === latencyPoints.length - 1).map(({ x, y, row }) => <g key={`${row.id}-${x}`}><circle cx={x} cy={y} r="4" fill="#048B0B" /><text x={x} y="212" fill="#001701" fontSize="12" fontWeight="700" textAnchor="middle">{shortDate(row.createdAt)}</text></g>)}
            </svg>
          ) : (
            <p role={historyState === "error" ? "alert" : "status"} className="mt-[55px] grid min-h-[135px] place-items-center text-center text-[15px] font-semibold text-[#596659]">
              {historyState === "loading" ? "Loading health-check history…" : historyState === "error" ? "Health-check history could not be loaded." : "No latency data is available in the health-check history."}
            </p>
          )}
        </div>
        <div className="w-full flex-none rounded-[20px] bg-white px-[30px] pt-[35px] pb-[35px] xl:w-[470px]">
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">Server Status</p>
          <div className="mt-[10px]">
            {stat === "loading" && <p role="status" className="py-[30px] text-[15px] font-semibold text-[#596659]">Loading service status…</p>}
            {stat === "error" && <p role="alert" className="py-[30px] text-[15px] font-semibold text-[#A11B1B]">Service status could not be loaded.</p>}
            {stat === "live" && services.length === 0 && <p className="py-[30px] text-[15px] font-semibold text-[#596659]">No services were returned by the health endpoint.</p>}
            {services.map((s) => (
              <div key={s.name} className="flex h-[58px] items-center border-b border-[#E3E3E3] last:border-b-0">
                <span className={`h-[10px] w-[10px] rounded-full ${s.online ? "bg-[#048B0B]" : "bg-[#FF0000]"}`} />
                <span className="ml-[16px] text-[18px] leading-[22px] font-bold text-[#001701]">{s.name}</span>
                <span className={`ml-auto text-[16px] leading-[20px] font-semibold ${s.online ? "text-[#048B0B]" : "text-[#FF0000]"}`}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + events */}
      <div className="mt-[35px] flex flex-col gap-[35px] xl:flex-row">
        <div className="w-full flex-none rounded-[20px] bg-white px-[30px] pt-[35px] pb-[35px] xl:w-[545px]">
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">Admin Activity</p>
          <div className="mt-[25px] flex flex-col gap-[20px]">
            {auditState === "loading" && <p role="status" className="py-[30px] text-[15px] font-semibold text-[#596659]">Loading administrator activity…</p>}
            {auditState === "error" && <p role="alert" className="py-[30px] text-[15px] font-semibold text-[#A11B1B]">Administrator activity could not be loaded.</p>}
            {auditState === "empty" && <p className="py-[30px] text-[15px] font-semibold text-[#596659]">No administrator activity has been recorded.</p>}
            {(auditRows || []).slice(0, 4).map((activity) => (
              <button key={activity.id} type="button" onClick={() => activity.id && nav(`/admin/data/audit?id=${encodeURIComponent(activity.id)}`)} className="flex w-full items-center gap-[20px] text-left hover:bg-[#F7FAF7]">
                <span className="grid h-[56px] w-[56px] flex-none place-items-center rounded-full bg-[#E5FFE7] text-[16px] font-bold text-[#048B0B]">{String(activity.name || "A").split(/[\s@]/).filter(Boolean).slice(0, 2).map((word) => word[0]?.toUpperCase()).join("")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[18px] leading-[22px] font-bold text-[#001701]">{activity.name}</span>
                  <span className="block truncate text-[16px] leading-[20px] font-semibold text-[#001701]">{activity.action}</span>
                  <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">{dateTime(activity.createdAt)}</span>
                </span>
                <ChevR />
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1 rounded-[20px] bg-white px-[30px] pt-[35px] pb-[35px]">
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">Recent System Event</p>
          <div className="mt-[10px]">
            {eventState === "loading" && <p role="status" className="py-[30px] text-[15px] font-semibold text-[#596659]">Loading system events…</p>}
            {eventState === "error" && <p role="alert" className="py-[30px] text-[15px] font-semibold text-[#A11B1B]">System events could not be loaded.</p>}
            {eventState === "empty" && <p className="py-[30px] text-[15px] font-semibold text-[#596659]">No recent system events.</p>}
            {(eventRows || []).slice(0, 4).map((event, index) => {
              const severity = String(event.status || "info").toLowerCase();
              const color = /critical|high|fail|error|security/.test(severity) ? "#D93025" : /medium|warn|review/.test(severity) ? "#E87500" : /success|operational|low/.test(severity) ? "#048B0B" : "#0087FF";
              return (
                <div key={event.id || `${event.issue}-${index}`} className="flex items-center gap-[20px] border-b border-[#E3E3E3] py-[18px] last:border-b-0">
                  <span className="grid h-[36px] w-[36px] flex-none place-items-center rounded-full" style={{ background: `${color}22` }}><span className="h-[12px] w-[12px] rounded-full" style={{ background: color }} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[18px] leading-[22px] font-bold text-[#001701]">{event.issue}</span>
                    <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">{dateTime(event.createdAt)}</span>
                  </span>
                  <span className="flex h-[32px] flex-none items-center rounded-[10px] px-[16px] text-[14px] font-semibold" style={{ background: `${color}22`, color }}>{titleCase(event.status)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Server status counters */}
      <div className="mt-[35px] rounded-[20px] bg-white px-[30px] pt-[35px] pb-[20px]">
        <div className="flex items-center gap-[12px]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8 7.5 10 4.3-2 7.5-5.4 7.5-10v-6L12 2.5Z" fill="#048B0B" />
            <path d="m9 11.5 2.2 2.2L15.5 9.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">Server Status</p>
        </div>
        <div className="mt-[15px]">
          {[
            ["Open Incidents", stat === "live" ? String(status?.incidents?.open ?? "—") : stat === "loading" ? "…" : "—"],
            ["Failed Admin Operations", stat === "live" ? String(status?.admin_activity?.failed ?? "—") : stat === "loading" ? "…" : "—"],
            ["Total Admin Operations", stat === "live" ? String(status?.admin_activity?.total ?? "—") : stat === "loading" ? "…" : "—"],
            ["Monitoring Interval", stat === "live" ? `${status?.monitoring?.interval_minutes ?? "—"} min` : stat === "loading" ? "…" : "—"],
          ].map(([label, n]) => (
            <div key={label} className="flex h-[78px] items-center border-b border-[#E3E3E3] last:border-b-0">
              <span className="grid h-[36px] w-[36px] place-items-center rounded-full bg-[#E5FFE7]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#048B0B" /><path d="m8 12.2 2.6 2.6L16 9.4" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
              <span className="ml-[20px] text-[18px] leading-[22px] font-bold text-[#001701]">{label}</span>
              <span className="ml-auto text-[16px] leading-[20px] font-bold text-[#001701]">{n}</span>
              <span className="ml-[30px]"><ChevR /></span>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
