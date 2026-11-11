import { useNavigate } from "react-router-dom";
import AdminShell from "../components/AdminShell";
import avatar1 from "../assets/avatar-1.webp";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";

/* System Monitoring — Figma 1260:56887 (1440, dark content bg).
   Stat cards h135; Performance + Server Status row; Admin Activity +
   Recent System Event row; full-width Server Status action list. */

const STATS = [
  { tile: "bg-[#E5FFE7]", glyph: "users", label: "System Uptime", value: "99.98%" },
  { tile: "bg-[#E5FFE7]", glyph: "check", label: "Active User", value: "4,534" },
  { tile: "bg-[#E5FFE7]", glyph: "check", label: "Response Time", value: "248ms" },
  { tile: "bg-[#FFEEE2]", glyph: "users", label: "Error Rate", value: "0.12%" },
];

const SERVERS = ["Web Server", "Database", "Payment Server", "Notification Server", "Storage"];

const ACTIVITY = [
  { av: avatar1, name: "Emerson Culhane", action: "Moderated a User" },
  { av: avatarAshlynn, name: "Emerson Westervelt", action: "Resolved a Group Issue" },
  { av: avatarAspen, name: "Justin Baptista", action: "Attended to a User Problem" },
  { av: avatarKianna, name: "Alena Botosh", action: "Updated Platform Setting" },
];

const EVENTS = [
  { dot: "#0087FF", title: "Payment service latency improved", pill: "Info", cls: "bg-[#D6E9FF] text-[#0087FF]" },
  { dot: "#FF0000", title: "Multiple failed login attempts blocked", pill: "Security", cls: "bg-[#FFE9E0] text-[#FF0000]" },
  { dot: "#048B0B", title: "System backup completed", pill: "Success", cls: "bg-[#DDFFDE] text-[#048B0B]" },
  { dot: "#0087FF", title: "High traffic detected (Normal)", pill: "Info", cls: "bg-[#D6E9FF] text-[#0087FF]" },
];

const COUNTERS = [
  ["Failed Login Attempts", "2"],
  ["Blocked IPs", "2"],
  ["Suspicious Activities", "5"],
  ["Moderation Actions", "16"],
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

function ChevR() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="m9 5 7 7-7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminHealth() {
  const nav = useNavigate();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <AdminShell active="security" sub="health" expand dark>
      <div className="flex items-center gap-[16px]">
        <button onClick={() => nav(-1)} aria-label="Go back" className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#F1F8F2] shadow-[0_4px_10px_rgba(0,23,1,0.10)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5 8 12l7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>

      <div className="mt-[45px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="flex h-[135px] items-start gap-[16px] rounded-[10px] bg-white px-[21px] pt-[21px]">
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

      {/* Performance + Server status */}
      <div className="mt-[35px] flex flex-col gap-[35px] xl:flex-row">
        <div className="min-w-0 flex-1 rounded-[20px] bg-white px-[40px] pt-[35px] pb-[40px]">
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">System Performance</p>
          <div className="mt-[35px] flex items-center">
            <p className="text-[18px] leading-[22px] font-semibold text-[#001701]">CPU Usage</p>
            <span className="ml-auto flex h-[40px] items-center gap-[8px] rounded-[10px] border border-[#999999] px-[16px] text-[16px] font-bold text-[#001701]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4v16m0 0-6-6m6 6 6-6" stroke="#048B0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              70%
            </span>
          </div>
          <svg viewBox="0 0 640 220" className="mt-[30px] w-full" role="img" aria-label="CPU usage chart">
            {[0, 1, 2, 3, 4].map((i) => (
              <g key={i}>
                <line x1="50" y1={20 + i * 40} x2="640" y2={20 + i * 40} stroke="#9CC79E" strokeWidth="1" strokeDasharray="2 4" />
                <text x="0" y={24 + i * 40} fill="#001701" fontSize="12" fontWeight="700">{i === 4 ? "0" : `${100 - i * 25}%`}</text>
              </g>
            ))}
            <path d="M50 130 C 100 100, 130 96, 170 98 S 250 108, 290 92 S 360 104, 400 96 S 470 78, 510 92 S 600 96, 640 60 L 640 180 L 50 180 Z" fill="#46C04C" fillOpacity="0.25" />
            <path d="M50 130 C 100 100, 130 96, 170 98 S 250 108, 290 92 S 360 104, 400 96 S 470 78, 510 92 S 600 96, 640 60" fill="none" stroke="#048B0B" strokeWidth="2.5" />
            {months.map((m, i) => (
              <text key={m} x={55 + i * 53} y={212} fill={m === "Sep" ? "#048B0B" : "#001701"} fontSize="12" fontWeight="700" textAnchor="middle">{m}</text>
            ))}
          </svg>
        </div>
        <div className="w-full flex-none rounded-[20px] bg-white px-[30px] pt-[35px] pb-[35px] xl:w-[470px]">
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">Server Status</p>
          <div className="mt-[10px]">
            {SERVERS.map((s) => (
              <div key={s} className="flex h-[58px] items-center border-b border-[#E3E3E3] last:border-b-0">
                <span className="h-[10px] w-[10px] rounded-full bg-[#048B0B]" />
                <span className="ml-[16px] text-[18px] leading-[22px] font-bold text-[#001701]">{s}</span>
                <span className="ml-auto text-[16px] leading-[20px] font-semibold text-[#048B0B]">Online</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity + events */}
      <div className="mt-[35px] flex flex-col gap-[35px] xl:flex-row">
        <div className="w-full flex-none rounded-[20px] bg-white px-[30px] pt-[35px] pb-[35px] xl:w-[545px]">
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">Admin Activity</p>
          <div className="mt-[25px] flex flex-col gap-[28px]">
            {ACTIVITY.map((a) => (
              <div key={a.name} className="flex items-center gap-[20px]">
                <img src={a.av} alt="" className="h-[56px] w-[56px] rounded-full object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[18px] leading-[22px] font-bold text-[#001701]">{a.name}</span>
                  <span className="block text-[16px] leading-[20px] font-semibold text-[#001701]">{a.action}</span>
                  <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">Sep 30, 2025 10:22AM</span>
                </span>
                <ChevR />
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1 rounded-[20px] bg-white px-[30px] pt-[35px] pb-[35px]">
          <p className="text-[20px] leading-[25px] font-bold text-[#001701]">Recent System Event</p>
          <div className="mt-[10px]">
            {EVENTS.map((e) => (
              <div key={e.title} className="flex items-center gap-[20px] border-b border-[#E3E3E3] py-[18px] last:border-b-0">
                <span className="grid h-[36px] w-[36px] flex-none place-items-center rounded-full" style={{ background: `${e.dot}22` }}>
                  <span className="h-[12px] w-[12px] rounded-full" style={{ background: e.dot }} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[18px] leading-[22px] font-bold text-[#001701]">{e.title}</span>
                  <span className="block text-[16px] leading-[20px] text-[#4E4E4E]">Sep 30, 2025 10:22AM</span>
                </span>
                <span className={`flex h-[32px] flex-none items-center rounded-[10px] px-[16px] text-[14px] font-semibold ${e.cls}`}>{e.pill}</span>
              </div>
            ))}
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
          {COUNTERS.map(([label, n]) => (
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
