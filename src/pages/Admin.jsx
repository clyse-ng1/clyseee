import AdminShell from "../components/AdminShell";

/* Admin / CMS dashboard — Figma 1054:20187 (1440x1548, desktop only).
   Fully static: no admin endpoints exist. Copy fixes: "Eearning" ->
   "Earning", "Neflix" -> "Netflix", "attion" -> "attention",
   "regisrtered" -> "registered", "Sep. 1 206" -> "Sep. 1 2026". */

function G({ children }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  );
}

const stroke = "#46C04C";
function IconWallet() {
  return (
    <G>
      <rect x="3" y="6.5" width="18" height="12" rx="2.5" stroke={stroke} strokeWidth="1.8" />
      <path d="M3 10h18M16.5 14.5h.01" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
function ChevDown({ color = "#FFFFFF" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="m6 9 6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatGlyph({ d }) {
  return d;
}
function UsersGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8.5" r="3.2" stroke={color} strokeWidth="2" />
      <path d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16.5" cy="9.5" r="2.6" stroke={color} strokeWidth="2" />
      <path d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function UserCheckGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="8.5" r="3.5" stroke={color} strokeWidth="2" />
      <path d="M3.5 19.5c.7-3.4 3.2-5.3 6.5-5.3 1 0 2 .2 2.8.6" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="m14.5 17.5 2 2 3.5-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CheckCircleGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="2" />
      <path d="m8.5 12.2 2.5 2.5 4.8-5.4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function WarnGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M12 3.5 2.5 20h19L12 3.5Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="M12 9.5v5M12 17.5v.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BadgeGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="10" r="6" stroke={color} strokeWidth="2" />
      <path d="m9.5 15-2 5.5 4.5-2.5 4.5 2.5-2-5.5" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <path d="m10 10 1.5 1.5L14.5 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function HourGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M6.5 3.5h11M6.5 20.5h11M8 3.5v3l4 4 4-4v-3M8 20.5v-3l4-4 4 4v3" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClipGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="5" width="14" height="16" rx="2" stroke={color} strokeWidth="2" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth="2" />
      <path d="M9 12h6M9 15.5h6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function BankGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M3.5 9.5 12 4l8.5 5.5M5 10.5V18M9.5 10.5V18M14.5 10.5V18M19 10.5V18M3.5 20.5h17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PercentGlyph({ color }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M18.5 5.5 5.5 18.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="8" cy="8" r="2.5" stroke={color} strokeWidth="2" />
      <circle cx="16" cy="16" r="2.5" stroke={color} strokeWidth="2" />
    </svg>
  );
}
function ClockGlyph({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="2" />
      <path d="M12 7.5V12l3.2 2" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ROW1 = [
  { bg: "bg-[#DFFFE0]", glyph: <UsersGlyph color="#048B0B" />, label: "Total User", value: "12,300" },
  { bg: "bg-[#E9E4FF]", glyph: <UserCheckGlyph color="#6A5ACD" />, label: "Active User", value: "10,000" },
  { bg: "bg-[#DFFFE0]", glyph: <UsersGlyph color="#048B0B" />, label: "Total subscription Groups", value: "124" },
  { bg: "bg-[#DFFFE0]", glyph: <CheckCircleGlyph color="#048B0B" />, label: "Active Group", value: "842" },
];
const ROW2 = [
  { bg: "bg-[#FBD9DC]", glyph: <WarnGlyph color="#E31B00" />, label: "Dispute", value: "124,000" },
  { bg: "bg-[#DFFFE0]", glyph: <BadgeGlyph color="#048B0B" />, label: "Active Subscription / membership", value: "1,000" },
  { bg: "bg-[#E9E4FF]", glyph: <HourGlyph color="#6A5ACD" />, label: "Waitlist Activity", value: "50,000" },
  { bg: "bg-[#E0EFFF]", glyph: <ClipGlyph color="#0087FF" />, label: "Pending Admin Actions", value: "124,000" },
];
const DARK = [
  { glyph: <BankGlyph color="#0087FF" />, label: "Creator's Earning", value: "N124,000" },
  { glyph: <PercentGlyph color="#CB5300" />, label: "Clyse fees", value: "N150,000" },
  { glyph: <IconWallet />, label: "Wallet Funding Activity", value: "124,000" },
  { glyph: <IconWallet />, label: "Subscription Payment Activity", value: "124,000" },
];
const ACTIVITIES = [
  { title: "New user registered", sub: "alex.smith@example.com", time: "3m ago" },
  { title: "Group verified", sub: "Netflix Premium (GRP-104)", time: "4m ago" },
  { title: "Payment received", sub: "N5,000.00 - Group (GRP-098)", time: "5m ago" },
  { title: "Dispute created", sub: "Access issue - Spotify (DIS-023)", time: "6m ago" },
  { title: "Creator earnings updated", sub: "N12,500.00 - Group #GRP-079", time: "7m ago" },
  { title: "New user registered", sub: "alex.smith@example.com", time: "2m ago" },
];

function LightCard({ c }) {
  return (
    <div className="flex flex-col items-center rounded-[16px] border border-[#E5E5E5] bg-white px-[16px] py-[24px] text-center">
      <span className={`grid h-[60px] w-[60px] place-items-center rounded-full ${c.bg}`}>
        <StatGlyph d={c.glyph} />
      </span>
      <p className="mt-[12px] min-h-[40px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
        {c.label}
      </p>
      <p className="text-[35px] leading-[43px] font-bold text-ink">{c.value}</p>
      <p className="mt-[6px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
        From Last Month
      </p>
    </div>
  );
}

function DarkCard({ c }) {
  return (
    <div className="bg-btn flex flex-col items-center rounded-[16px] px-[16px] py-[24px] text-center">
      <span className="grid h-[60px] w-[60px] place-items-center rounded-full bg-white">
        {c.glyph}
      </span>
      <p className="mt-[12px] min-h-[40px] text-[16px] leading-[20px] font-semibold text-mint">
        {c.label}
      </p>
      <p className="text-[35px] leading-[43px] font-bold text-mint">{c.value}</p>
      <p className="mt-[6px] text-[16px] leading-[20px] font-semibold text-mint">
        From Last Month
      </p>
    </div>
  );
}

function Chart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div>
      <div className="flex items-center">
        <p className="text-[18px] leading-[22px] font-bold text-white">Overview</p>
        <p className="ml-[60px] flex items-center gap-[6px] text-[14px] font-semibold text-white">
          <span className="h-[10px] w-[10px] rounded-full bg-white" /> Revenue
        </p>
        <p className="ml-[16px] flex items-center gap-[6px] text-[14px] font-semibold text-white">
          <span className="h-[10px] w-[10px] rounded-full bg-clyse" /> Payout
        </p>
        <button
          type="button"
          className="ml-auto flex h-[28px] items-center gap-[8px] rounded-[8px] border border-white/40 px-[12px] text-[11px] font-bold text-white"
        >
          Month <ChevDown />
        </button>
      </div>
      <svg viewBox="0 0 525 258" className="mt-[16px] w-full" role="img" aria-label="Revenue versus payout chart">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <line x1="36" y1={20 + i * 40} x2="520" y2={20 + i * 40} stroke="#FFFFFF" strokeOpacity="0.15" />
            <text x="0" y={24 + i * 40} fill="#FFFFFF" fontSize="11" fontWeight="700">
              {`${(5 - i) * 2}M`}
            </text>
          </g>
        ))}
        {months.map((m, i) => (
          <text
            key={m}
            x={52 + i * 39}
            y={248}
            fill={m === "Sep" ? "#46C04C" : "#FFFFFF"}
            fontSize="11"
            fontWeight="700"
            textAnchor="middle"
          >
            {m}
          </text>
        ))}
        <path
          d="M52 200 C 90 200, 100 150, 140 150 S 190 170, 230 140 S 300 120, 340 150 S 410 170, 440 130 S 490 150, 515 145"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
        />
        <path
          d="M52 170 C 90 170, 110 120, 150 120 S 210 90, 260 100 S 330 60, 370 90 S 430 60, 470 90 S 500 60, 515 40"
          fill="none"
          stroke="#46C04C"
          strokeWidth="2.5"
        />
        <rect x="330" y="10" width="90" height="34" rx="6" fill="#013104" stroke="#46C04C" />
        <text x="338" y="23" fill="#FFFFFF" fontSize="8" fontWeight="600">Payout</text>
        <text x="338" y="34" fill="#B1DBB3" fontSize="8" fontWeight="700">Total Amount N8M</text>
        <circle cx="378" cy="82" r="6" fill="#013104" stroke="#FFFFFF" strokeWidth="2.5" />
        <rect x="300" y="120" width="90" height="34" rx="6" fill="#013104" stroke="#FFFFFF" />
        <text x="308" y="133" fill="#FFFFFF" fontSize="8" fontWeight="600">Revenue</text>
        <text x="308" y="144" fill="#B1DBB3" fontSize="8" fontWeight="700">Total Amount N4M</text>
        <circle cx="440" cy="132" r="6" fill="#013104" stroke="#FFFFFF" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminShell active="dashboard">
            <div className="flex flex-wrap items-center gap-[16px]">
              <div>
                <h1 className="text-[35px] leading-[43px] font-bold text-black">
                  Dashboard
                </h1>
                <p className="text-[18px] leading-[22px] font-semibold text-black">
                  Welcome to Admin Dashboard
                </p>
              </div>
              <button
                type="button"
                className="ml-auto flex h-[54px] items-center gap-[12px] rounded-[10px] bg-[#DFFFE0] px-[20px] text-[18px] font-semibold text-ink"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="#001701" strokeWidth="1.8" />
                  <path d="M3.5 10h17M8 3v4M16 3v4" stroke="#001701" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Sep. 1 2026 - Sep. 30 2026
                <ChevDown color="#001701" />
              </button>
            </div>
            <div className="mt-[30px] grid grid-cols-2 gap-[20px] xl:grid-cols-4">
              {ROW1.map((c) => (
                <LightCard key={c.label} c={c} />
              ))}
            </div>
            <div className="mt-[20px] grid grid-cols-2 gap-[20px] xl:grid-cols-4">
              {ROW2.map((c) => (
                <LightCard key={c.label} c={c} />
              ))}
            </div>
            <div className="mt-[20px] grid grid-cols-2 gap-[20px] xl:grid-cols-4">
              {DARK.map((c) => (
                <DarkCard key={c.label} c={c} />
              ))}
            </div>
            <div className="mt-[20px] flex flex-col gap-[20px] xl:flex-row">
              <div className="xl:w-[266px] xl:flex-none">
                <DarkCard
                  c={{ glyph: <ClockGlyph color="#6A5ACD" />, label: "Pending Payout", value: "124,000" }}
                />
              </div>
              <div className="relative flex-1 rounded-[10px] bg-[#DFFFE0] px-[21px] py-[28px]">
                <span className="absolute top-[28px] right-[21px] grid h-[28px] w-[28px] place-items-center rounded-full bg-[#E31B00] text-[14px] font-bold text-white">
                  4
                </span>
                <p className="text-[18px] leading-[22px] font-bold text-black">
                  Alert & Action Items
                </p>
                <div className="mt-[20px] grid gap-[20px] md:grid-cols-2">
                  <div className="flex flex-col gap-[16px]">
                    {[
                      ["3 Group Pending verification", "Review & approve group submission"],
                      ["7 pending administrative actions", "Requires your attention"],
                    ].map(([t, s]) => (
                      <div key={t} className="flex items-start gap-[12px]">
                        <span className="mt-[2px] flex-none">
                          <ClockGlyph color="#E31B00" />
                        </span>
                        <span>
                          <span className="block text-[18px] leading-[22px] font-bold text-black">
                            {t}
                          </span>
                          <span className="mt-[4px] block text-[16px] leading-[20px] text-[#6B6B6B]">
                            {s}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-[16px] md:border-l md:border-[#999999] md:pl-[20px]">
                    {[
                      ["2 high-priority disputes", "Need resolution"],
                      ["3 Group Pending verification", "Review & approve group submission"],
                    ].map(([t, s]) => (
                      <div key={t} className="flex items-start gap-[12px]">
                        <span className="mt-[2px] flex-none">
                          <ClockGlyph color="#E31B00" />
                        </span>
                        <span>
                          <span className="block text-[18px] leading-[22px] font-bold text-black">
                            {t}
                          </span>
                          <span className="mt-[4px] block text-[16px] leading-[20px] text-[#6B6B6B]">
                            {s}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-[20px] flex flex-col gap-[20px] xl:flex-row">
              <div className="rounded-[20px] bg-[#DFFFE0] px-[30px] py-[30px] xl:w-[471px] xl:flex-none">
                <div className="flex items-center">
                  <p className="text-[18px] leading-[22px] font-bold text-black">
                    Recent Activities
                  </p>
                  <button type="button" className="ml-auto text-[15px] font-bold text-[#0087FF]">
                    View all
                  </button>
                </div>
                <div className="mt-[20px] flex flex-col gap-[18px]">
                  {ACTIVITIES.map((a, i) => (
                    <div key={`${a.title}-${i}`} className="flex items-center gap-[12px]">
                      <span className="grid h-[38px] w-[38px] flex-none place-items-center rounded-[10px] bg-[#D6E9FF] text-[15px] font-bold text-[#0087FF]">
                        R
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[16px] leading-[20px] font-semibold text-black">
                          {a.title}
                        </span>
                        <span className="block truncate text-[14px] leading-[20px] text-[#6B6B6B]">
                          {a.sub}
                        </span>
                      </span>
                      <span className="flex-none text-right">
                        <span className="block text-[14px] text-[#6B6B6B]">{a.time}</span>
                        <span className="block text-[11px] font-bold text-[#0087FF]">New</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-btn min-w-0 flex-1 rounded-[10px] px-[24px] py-[24px] xl:px-[40px]">
                <Chart />
              </div>
            </div>
      </AdminShell>
  );
}
