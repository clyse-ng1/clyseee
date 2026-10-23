import { Link } from "react-router-dom";
import { ChevDown, SearchIcon } from "./AdminShell";
import { GlyphUsers, GlyphBadge, GlyphCheck } from "./AdminGlyphs";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";

/* Shared kit for the Finance admin pages (all static: no admin finance
   endpoints exist). Geometry sampled from Figma 1187:28004, 1195:26648,
   1214:25954, 1222:29220, 1217:27756, 1195:27128. */

export const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";

const AVATARS = [avatar1, avatar2, avatar3, avatarAshlynn, avatarAspen, avatarKianna];

export function FinAvatar({ i = 0, size = 50 }) {
  return (
    <img
      src={AVATARS[i % AVATARS.length]}
      alt=""
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

/* Stat card: h121, 42px badge + label/value/sub. 1187 uses a 30px
   badge gap; 1214/1222 use 10px (their long labels bleed into the card
   gap exactly like Figma, so no truncation). */
export function StatCard({ label, value, sub = "Last 30 Days", badge, glyph, className = "", gap10 = false, center = false }) {
  return (
    <div
      className={`flex h-[121px] rounded-[10px] border border-[#999999] bg-white px-[21px] pt-[16px] ${SHADOW} ${center ? "justify-center" : ""} ${className}`}
    >
      <span className={`grid h-[42px] w-[42px] flex-none place-items-center rounded-[5px] ${badge}`}>
        {glyph}
      </span>
      <span className={`${gap10 ? "ml-[10px]" : "ml-[30px]"} min-w-0`}>
        <span className="block text-[18px] leading-[22px] font-semibold whitespace-nowrap text-[#4E4E4E]">
          {label}
        </span>
        <span className="mt-[5px] block text-[25px] leading-[35px] font-bold whitespace-nowrap text-[#001701]">
          {value}
        </span>
        <span className="mt-[5px] block text-[18px] leading-[22px] font-semibold whitespace-nowrap text-[#6B6B6B]">
          {sub}
        </span>
      </span>
    </div>
  );
}

export const badgeGreen = "bg-[#DFFFE0]/80";
export const badgeMint = "bg-[#DAFDDD]";
export const badgeOrange = "bg-[#FFEFE5]";

export function UsersGlyph({ color = "#048B0B" }) {
  return <GlyphUsers color={color} />;
}
export function BadgeGlyph({ color = "#048B0B" }) {
  return <GlyphBadge color={color} />;
}

/* Solid olive check disc used on the mint stat badges. */
export function CheckGlyph() {
  return (
    <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[#437000]">
      <GlyphCheck color="#FFFFFF" />
    </span>
  );
}

/* Filter row: search pill + labelled dropdowns. Static (Figma has no admin API). */
export function FilterBar({ labels }) {
  return (
    <div className="flex gap-[24px]">
      <div className="pt-[36px]">
        <label className="flex h-[40px] w-[374px] items-center gap-2 rounded-full border border-[#999999]/50 bg-white px-[20px]">
          <SearchIcon />
          <input
            placeholder="Search...."
            className="w-full bg-transparent text-[14px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none"
          />
        </label>
      </div>
      {labels.map((l) => (
        <div key={l} className="w-[221px] flex-none">
          <p className="text-[16px] leading-[20px] font-semibold text-black">{l}</p>
          <button
            type="button"
            className="mt-[10px] flex h-[46px] w-full items-center rounded-[10px] border border-[#999999] bg-[#DFFFE0]/80 px-[11px]"
          >
            <span className="text-[16px] leading-[20px] font-semibold text-[#001701]">
              All
            </span>
            <span className="ml-auto">
              <ChevDown color="#001701" />
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}

/* Table status pill: h37 r10, 10px dot + 14px semibold text. */
const TONES = {
  green: "bg-[#DFFFE0]/80 text-[#048B0B]",
  red: "bg-[#FFF2F2] text-[#FF0000]",
  orange: "bg-[#FCF6F1] text-[#FF6B02]",
  purple: "bg-[#EEDFFF]/80 text-[#4E0082]",
  blue: "bg-[#E7EBFF]/80 text-[#005DEA]",
  royal: "bg-[#E7EBFF]/80 text-[#003FFF]",
};
export function FinPill({ tone = "green", children }) {
  return (
    <span
      className={`inline-flex h-[37px] items-center gap-[15px] rounded-[10px] pr-[15px] pl-[15px] text-[14px] leading-[17px] font-semibold whitespace-nowrap ${TONES[tone]}`}
    >
      <span className="h-[10px] w-[10px] rounded-full bg-current" />
      {children}
    </span>
  );
}

export function CheckBox({ label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] border border-[#048B0B] bg-white"
    />
  );
}

/* Pagination: ‹ 1 2 3 ›, 28px boxes. */
export function Pagination() {
  const box =
    "grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] text-[16px] font-semibold";
  return (
    <div className="flex justify-end gap-[4px] px-[51px] pt-[3px] pb-[17px]">
      <button type="button" aria-label="Previous page" className={`${box} bg-white text-[#4E4E4E]`}>
        ‹
      </button>
      <button type="button" className={`${box} border-[#048B0B] bg-[#048B0B] text-white`}>
        1
      </button>
      {["2", "3"].map((n) => (
        <button key={n} type="button" className={`${box} bg-white text-[#4E4E4E]`}>
          {n}
        </button>
      ))}
      <button type="button" aria-label="Next page" className={`${box} bg-white text-[#4E4E4E]`}>
        ›
      </button>
    </div>
  );
}

/* Solid green check disc. */
export function CheckDisc({ size = 35 }) {
  return (
    <span
      className="grid flex-none place-items-center rounded-full bg-[#048B0B]"
      style={{ width: size, height: size }}
    >
      <GlyphCheck color="#FFFFFF" />
    </span>
  );
}

function TrendGlyph({ up }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      {up ? (
        <path
          d="M4 18 10 12l4 3 6-8M11 7h5v5"
          stroke="#048B0B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M4 6l6 6 4-3 6 8M13 17h-5v-5"
          stroke="#E31B00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

/* Recent Activities card (Finance + Reconciliation share it). */
const ACTIVITIES = [
  { name: "Payout to Allison Press", amount: "-N3,000", up: false },
  { name: "Refund to Mark Press", amount: "-N4,000", up: false },
  { name: "Payment from Sarah Press", amount: "N3,000", up: true },
  { name: "Payout to Allison Press", amount: "-N3,000", up: false },
  { name: "Payment from Sarah Press", amount: "N3,000", up: true },
];

export function RecentActivities() {
  return (
    <div className="w-[473px] flex-none rounded-[20px] border border-[#999999] bg-white px-[10px] pt-[30px] pb-[12px]">
      <div className="flex items-center px-[20px]">
        <p className="text-[18px] leading-[22px] font-bold text-black">Recent Activities</p>
        <Link
          to="/admin/finance/reconciliation/history"
          className="ml-auto text-[15px] leading-[18px] font-bold text-[#0087FF]"
        >
          View all
        </Link>
      </div>
      <div className="mt-[22px]">
        {ACTIVITIES.map((a, i) => (
          <div key={`${a.name}-${i}`} className="flex h-[64px] items-center">
            <span
              className={`grid h-[34px] w-[34px] flex-none place-items-center rounded-[5px] ${a.up ? "bg-[#DFFFE0]/80" : "bg-[#FFEFDF]/80"}`}
            >
              <TrendGlyph up={a.up} />
            </span>
            <span className="ml-[15px]">
              <span className="block text-[16px] leading-[20px] font-semibold whitespace-nowrap text-[#001701]">
                {a.name}
              </span>
              <span className="block text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                Sep. 20, 2026
              </span>
            </span>
            <span className="ml-auto text-right">
              <span
                className={`block text-[16px] leading-[20px] font-semibold ${a.up ? "text-[#048B0B]" : "text-black"}`}
              >
                {a.amount}
              </span>
              <span className="block text-[10px] leading-[20px] font-semibold text-[#048B0B]">
                Completed
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Revenue/Payout overview chart (static decorative SVG tracing the design). */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PAYOUT = [2.2, 3.4, 4.4, 3.9, 4.6, 6.4, 5.9, 6.8, 9.4, 7.6, 8.4, 10];
const REVENUE = [0.4, 1.9, 1.7, 2.4, 2.2, 3.0, 3.4, 2.9, 3.4, 2.6, 3.3, 4.0];

function smoothPath(vals, x0, dx, yTop, yBottom) {
  const pts = vals.map((v, i) => [x0 + i * dx, yBottom - (v / 10) * (yBottom - yTop)]);
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0p, y0p] = pts[i - 1];
    const [x1, y1] = pts[i];
    const mx = (x0p + x1) / 2;
    d += ` C ${mx} ${y0p}, ${mx} ${y1}, ${x1} ${y1}`;
  }
  return { d, pts };
}

export function OverviewChart() {
  const W = 527;
  const H = 230;
  const padL = 30;
  const padB = 28;
  const yTop = 8;
  const yBottom = H - padB;
  const x0 = padL + 8;
  const dx = (W - x0 - 8) / 11;
  const green = smoothPath(PAYOUT, x0, dx, yTop, yBottom);
  const black = smoothPath(REVENUE, x0, dx, yTop, yBottom);
  const area = `${green.d} L ${x0 + 11 * dx} ${yBottom} L ${x0} ${yBottom} Z`;
  const sep = green.pts[8];
  const ser = black.pts[8];
  return (
    <div className="w-[607px] flex-none rounded-[10px] border border-[#999999] bg-white px-[30px] pt-[35px] pb-[20px]">
      <div className="flex items-center">
        <p className="text-[18px] leading-[22px] font-bold text-[#001701]">Overview</p>
        <span className="ml-[120px] flex items-center gap-[6px] text-[14px] leading-[20px] font-semibold text-[#001701]">
          <span className="h-[10px] w-[10px] rounded-full bg-black" /> Revenue
        </span>
        <span className="ml-[16px] flex items-center gap-[6px] text-[14px] leading-[20px] font-semibold text-[#001701]">
          <span className="h-[10px] w-[10px] rounded-full bg-[#048B0B]" /> Payout
        </span>
        <span className="ml-auto flex h-[26px] w-[62px] items-center justify-center gap-[4px] rounded-[6px] border border-[#999999] text-[11px] leading-[13px] font-bold text-[#001701]">
          Month <ChevDown color="#001701" />
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-[12px] w-full" role="img" aria-label="Revenue and payout chart">
        {[0, 2, 4, 6, 8, 10].map((v) => {
          const y = yBottom - (v / 10) * (yBottom - yTop);
          return (
            <g key={v}>
              <line x1={x0} x2={W - 4} y1={y} y2={y} stroke="#E5E5E5" strokeWidth="1" />
              <text x={2} y={y + 4} fontSize="12" fontWeight="700" fill="#001701">
                {v === 0 ? "0" : `${v}M`}
              </text>
            </g>
          );
        })}
        <path d={area} fill="#048B0B" opacity="0.12" />
        <path d={green.d} fill="none" stroke="#048B0B" strokeWidth="2.5" />
        <path d={black.d} fill="none" stroke="#001701" strokeWidth="2" />
        {MONTHS.map((m, i) => (
          <text
            key={m}
            x={x0 + i * dx}
            y={H - 6}
            fontSize="12"
            fontWeight="700"
            textAnchor="middle"
            fill={m === "Sep" ? "#048B0B" : "#001701"}
          >
            {m}
          </text>
        ))}
        <circle cx={sep[0]} cy={sep[1]} r="5" fill="#048B0B" stroke="#fff" strokeWidth="2" />
        <circle cx={ser[0]} cy={ser[1]} r="5" fill="#048B0B" stroke="#fff" strokeWidth="2" />
        <g>
          <rect x={sep[0] - 44} y={sep[1] - 52} width="88" height="42" rx="6" fill="#EAFBEA" stroke="#B1DBB3" />
          <text x={sep[0]} y={sep[1] - 36} fontSize="8" textAnchor="middle" fill="#001701">
            Payout
          </text>
          <text x={sep[0]} y={sep[1] - 26} fontSize="8" fontWeight="700" textAnchor="middle" fill="#222222">
            Total Amount N8M
          </text>
        </g>
        <g>
          <rect x={ser[0] - 44} y={ser[1] + 10} width="88" height="42" rx="6" fill="#EAFBEA" stroke="#B1DBB3" />
          <text x={ser[0]} y={ser[1] + 26} fontSize="8" textAnchor="middle" fill="#001701">
            Revenue
          </text>
          <text x={ser[0]} y={ser[1] + 36} fontSize="8" fontWeight="700" textAnchor="middle" fill="#222222">
            Total Amount N4M
          </text>
        </g>
      </svg>
    </div>
  );
}

/* Reconciliation-status donut: green ~94%, orange ~5%, dark ~1%. */
export function Donut() {
  const R = 72;
  const C = 2 * Math.PI * R;
  const segs = [
    { frac: 0.939, color: "#048B0B" },
    { frac: 0.0475, color: "#FF9100" },
    { frac: 0.0135, color: "#4E4E4E" },
  ];
  let acc = 0;
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" role="img" aria-label="95.6 percent matched">
      <circle cx="100" cy="100" r={R} fill="none" stroke="#F1F1F1" strokeWidth="30" />
      {segs.map((s, i) => {
        const dash = `${Math.max(s.frac * C - 3, 1)} ${C}`;
        const rot = -90 + acc * 360;
        acc += s.frac;
        return (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={R}
            fill="none"
            stroke={s.color}
            strokeWidth="30"
            strokeDasharray={dash}
            transform={`rotate(${rot} 100 100)`}
          />
        );
      })}
      <text x="100" y="98" fontSize="20" fontWeight="600" textAnchor="middle" fill="#001701">
        95.6%
      </text>
      <text x="100" y="118" fontSize="14" fontWeight="600" textAnchor="middle" fill="#4E4E4E">
        Matched
      </text>
    </svg>
  );
}

export function BackLink({ to = -1, children }) {
  return (
    <Link
      to={to}
      className="text-[16px] leading-[20px] font-semibold text-[#005DEA]"
    >
      {children}
    </Link>
  );
}
