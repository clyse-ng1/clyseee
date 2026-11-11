import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import avatarAccount from "../assets/avatar-account.webp";

/* Shared admin/CMS shell — Figma V3 admin frames (1440, desktop only).
   Sidebar 270 wide, rows 270x60 pitch 80, icon 30 @x20, label 18/600,
   active row full-bleed #F1F8F2 + dark label; topbar h70 #DFFFE1.
   Fully static: no admin endpoints exist in the backend spec. */

function G({ children, s = 24 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  );
}
const stroke = "#46C04C";
export function AdminEmpty({ title, hint, dark }) {
  return (
    <div
      className={`mt-[26px] rounded-[14px] border border-dashed px-[30px] py-[56px] text-center ${
        dark ? "border-[#3A5C3C] bg-[#0B2A0D]" : "border-[#C8D2C8] bg-white"
      }`}
    >
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" className="mx-auto" aria-hidden="true">
        <path d="M3 13h4l2 3h6l2-3h4" stroke={dark ? "#7FB783" : "#048B0B"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 13V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" stroke={dark ? "#7FB783" : "#048B0B"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 13v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" stroke={dark ? "#7FB783" : "#048B0B"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className={`mt-[14px] text-[20px] leading-[24px] font-bold ${dark ? "text-white" : "text-[#001701]"}`}>{title}</div>
      <p className={`mx-auto mt-[8px] max-w-[460px] text-[15px] leading-[21px] font-semibold ${dark ? "text-[#9DB49E]" : "text-[#657165]"}`}>{hint}</p>
    </div>
  );
}

export function IconGrid() {
  return (
    <G>
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth="1.8" />
    </G>
  );
}
export function IconBox() {
  return (
    <G>
      <path d="M12 3.5 4.5 7.5v9L12 20.5l7.5-4v-9L12 3.5Z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4.5 7.5 12 11.5l7.5-4M12 11.5v9" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
    </G>
  );
}
export function IconShield() {
  return (
    <G>
      <path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8 7.5 10 4.3-2 7.5-5.4 7.5-10v-6L12 2.5Z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m9 11.5 2.2 2.2L15.5 9.5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  );
}
export function IconUsers() {
  return (
    <G>
      <circle cx="9" cy="8.5" r="3.2" stroke={stroke} strokeWidth="1.8" />
      <path d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="9.5" r="2.6" stroke={stroke} strokeWidth="1.8" />
      <path d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function IconWallet() {
  return (
    <G>
      <rect x="3" y="6.5" width="18" height="12" rx="2.5" stroke={stroke} strokeWidth="1.8" />
      <path d="M3 10h18M16.5 14.5h.01" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function IconHeadset() {
  return (
    <G>
      <path d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <rect x="3.5" y="13" width="4.5" height="6" rx="2" stroke={stroke} strokeWidth="1.8" />
      <rect x="16" y="13" width="4.5" height="6" rx="2" stroke={stroke} strokeWidth="1.8" />
    </G>
  );
}
export function IconBell() {
  return (
    <G>
      <path d="M6 16.5v-5a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16.5Z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 21.5a2.2 2.2 0 0 0 4 0" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function IconClip() {
  return (
    <G>
      <rect x="5" y="5" width="14" height="16" rx="2" stroke={stroke} strokeWidth="1.8" />
      <rect x="9" y="3" width="6" height="4" rx="1" stroke={stroke} strokeWidth="1.8" />
      <path d="M9 12h6M9 15.5h6" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function IconAudit() {
  return (
    <G>
      <path d="M6 3.5h8L19 8.5v12H6v-17Z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="11" cy="13" r="2.5" stroke={stroke} strokeWidth="1.8" />
      <path d="m12.8 14.8 2 2" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function IconGear() {
  return (
    <G>
      <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.8" />
      <path d="M12 2.8v2.7M12 18.5v2.7M2.8 12h2.7M18.5 12h2.7M5.5 5.5l1.9 1.9M16.6 16.6l1.9 1.9M18.5 5.5l-1.9 1.9M7.4 16.6l-1.9 1.9" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function ChevDown({ color = "#FFFFFF", up = false }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={up ? { transform: "rotate(180deg)" } : undefined}>
      <path d="m6 9 6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function SearchIcon() {
  return (
    <G>
      <circle cx="11" cy="11" r="6.5" stroke="#4E4E4E" strokeWidth="1.8" />
      <path d="m15.8 15.8 4.2 4.2" stroke="#4E4E4E" strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function PencilIcon() {
  return (
    <G>
      <path d="M14.5 5.5 18.5 9.5 8.5 19.5l-5 1 1-5 10-10Z" stroke="#001701" strokeWidth="1.8" strokeLinejoin="round" />
    </G>
  );
}
export function DotsIcon() {
  return (
    <G>
      <circle cx="12" cy="5.5" r="1.6" fill="#001701" />
      <circle cx="12" cy="12" r="1.6" fill="#001701" />
      <circle cx="12" cy="18.5" r="1.6" fill="#001701" />
    </G>
  );
}
export function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="m14.5 5.5-7 6.5 7 6.5" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function CalendarIcon() {
  return (
    <G>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" stroke="#001701" strokeWidth="1.8" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="#001701" strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function BellTop() {
  return (
    <G s={26}>
      <path d="M6 16.5v-5a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16.5Z" stroke="#001701" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M10 21.5a2.2 2.2 0 0 0 4 0" stroke="#001701" strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}

const MENU = [
  { key: "dashboard", label: "Dashboard", icon: <IconGrid />, to: "/admin" },
  {
    key: "subscriptions", label: "Subscriptions", icon: <IconBox />, to: "/admin/subscriptions", chev: true,
    sub: [
      { key: "services", label: "Subscription & Plans", to: "/admin/subscriptions" },
      { key: "requests", label: "Custom Requests", to: "/admin/subscriptions/requests" },
    ],
  },
  {
    key: "verification", label: "Group Verification", icon: <IconShield />, to: "/admin/data/review", chev: true,
    sub: [{ key: "review", label: "Review Queue", to: "/admin/data/review" }],
  },
  {
    key: "users", label: "Users & Groups", icon: <IconUsers />, to: "/admin/data/users", chev: true,
    sub: [
      { key: "um", label: "User Management", to: "/admin/data/users" },
      { key: "gm", label: "Group Management", to: "/admin/data/groups" },
    ],
  },
  {
    key: "finance", label: "Finance", icon: <IconWallet />, to: "/admin/data/transactions", chev: true,
    sub: [
      { key: "transactions", label: "Transactions", to: "/admin/data/transactions" },
      { key: "fundings", label: "Wallet Fundings", to: "/admin/data/walletFundings" },
      { key: "earnings", label: "Creator Earnings", to: "/admin/data/creatorEarnings" },
      { key: "payouts", label: "Payouts", to: "/admin/data/payouts" },
      { key: "recon", label: "Reconciliation", to: "/admin/data/reconciliation" },
      { key: "exceptions", label: "Exceptions", to: "/admin/data/exceptions" },
      { key: "disputes", label: "Disputes", to: "/admin/data/disputes" },
    ],
  },
  { key: "support", label: "Support", icon: <IconHeadset />, to: "/admin/data/support" },
  {
    key: "notifications", label: "Notifications", icon: <IconBell />, to: "/admin/data/communications", chev: true,
    sub: [
      { key: "communications", label: "Campaigns", to: "/admin/data/communications" },
      { key: "recipients", label: "Delivery Recipients", to: "/admin/data/communicationRecipients" },
      { key: "channels", label: "Delivery Channels", to: "/admin/data/communicationChannels" },
      { key: "templates", label: "Message Templates", to: "/admin/data/templates" },
      { key: "versions", label: "Template Versions", to: "/admin/data/templateVersions" },
      { key: "placeholders", label: "Placeholders", to: "/admin/data/templatePlaceholders" },
    ],
  },
  {
    key: "reports", label: "Reports", icon: <IconClip />, to: "/admin/data/reportSubscriptions", chev: true,
    sub: [
      { key: "subscriptions-report", label: "Subscriptions", to: "/admin/data/reportSubscriptions" },
      { key: "groups-report", label: "Groups", to: "/admin/data/reportGroups" },
    ],
  },
  { key: "audit", label: "Audit Logs", icon: <IconAudit />, to: "/admin/data/audit" },
  {
    key: "security", label: "Security", icon: <IconShield />, to: "/admin/security", chev: true,
    sub: [
      { key: "moderation", label: "Platform Moderation", to: "/admin/security" },
      { key: "health", label: "System Monitoring", to: "/admin/security/monitoring" },
    ],
  },
  {
    key: "settings", label: "Settings", icon: <IconGear />, to: "/admin/data/admins", chev: true,
    sub: [
      { key: "admin-roles", label: "Admin Roles", to: "/admin/data/admins" },
      { key: "roles", label: "Roles & Permissions", to: "/admin/data/roles" },
      { key: "create-role", label: "Create Role", to: "/admin/data/roleCreate" },
      { key: "role-history", label: "Role History", to: "/admin/data/roleHistory" },
      { key: "system-configuration", label: "System Configuration", to: "/admin/data/config" },
      { key: "config-history", label: "Configuration History", to: "/admin/data/configHistory" },
    ],
  },
];

/* V2 nav — the later Figma admin frames (1170/1176/1187/1214/1222) rename two
   groups ("Subscription", "User & Group"), point them at the design routes and
   add a standalone Disputes group. Pages built from those frames pass nav2. */
const MENU2 = [
  { key: "dashboard", label: "Dashboard", icon: <IconGrid />, to: "/admin" },
  {
    key: "subscriptions", label: "Subscription", icon: <IconBox />, to: "/admin/subscriptions", chev: true,
    sub: [
      { key: "services", label: "Subscription & Plans", to: "/admin/subscriptions" },
      { key: "requests", label: "Custom Requests", to: "/admin/subscriptions/requests" },
    ],
  },
  {
    key: "verification", label: "Group Verification", icon: <IconShield />, to: "/admin/data/review", chev: true,
    sub: [{ key: "review", label: "Review Queue", to: "/admin/data/review" }],
  },
  {
    key: "users", label: "User & Group", icon: <IconUsers />, to: "/admin/users", chev: true,
    sub: [
      { key: "um", label: "User Management", to: "/admin/users" },
      { key: "gm", label: "Group Management", to: "/admin/groups" },
    ],
  },
  {
    key: "finance", label: "Finance", icon: <IconWallet />, to: "/admin/finance", chev: true,
    sub: [
      { key: "transactions", label: "Transactions", to: "/admin/finance" },
      { key: "recon", label: "Reconciliation", to: "/admin/finance/reconciliation" },
    ],
  },
  {
    key: "disputes", label: "Disputes", icon: <IconShield />, to: "/admin/finance/disputes", chev: true,
    sub: [
      { key: "dlist", label: "Dispute List", to: "/admin/finance/disputes" },
      { key: "dinv", label: "Dispute Investigation", to: "/admin/finance/disputes" },
    ],
  },
  { key: "support", label: "Support", icon: <IconHeadset />, to: "/admin/data/support" },
  {
    key: "notifications", label: "Notifications", icon: <IconBell />, to: "/admin/data/communications", chev: true,
    sub: [
      { key: "communications", label: "Campaigns", to: "/admin/data/communications" },
      { key: "recipients", label: "Delivery Recipients", to: "/admin/data/communicationRecipients" },
      { key: "channels", label: "Delivery Channels", to: "/admin/data/communicationChannels" },
      { key: "templates", label: "Message Templates", to: "/admin/data/templates" },
      { key: "versions", label: "Template Versions", to: "/admin/data/templateVersions" },
      { key: "placeholders", label: "Placeholders", to: "/admin/data/templatePlaceholders" },
    ],
  },
  {
    key: "reports", label: "Reports", icon: <IconClip />, to: "/admin/data/reportSubscriptions", chev: true,
    sub: [
      { key: "subscriptions-report", label: "Subscriptions", to: "/admin/data/reportSubscriptions" },
      { key: "groups-report", label: "Groups", to: "/admin/data/reportGroups" },
    ],
  },
  { key: "audit", label: "Audit Logs", icon: <IconAudit />, to: "/admin/data/audit" },
  {
    key: "security", label: "Security", icon: <IconShield />, to: "/admin/security", chev: true,
    sub: [
      { key: "moderation", label: "Platform Moderation", to: "/admin/security" },
      { key: "health", label: "System Monitoring", to: "/admin/security/monitoring" },
    ],
  },
  {
    key: "settings", label: "Settings", icon: <IconGear />, to: "/admin/data/admins", chev: true,
    sub: [
      { key: "admin-roles", label: "Admin Roles", to: "/admin/data/admins" },
      { key: "roles", label: "Roles & Permissions", to: "/admin/data/roles" },
      { key: "create-role", label: "Create Role", to: "/admin/data/roleCreate" },
      { key: "role-history", label: "Role History", to: "/admin/data/roleHistory" },
      { key: "system-configuration", label: "System Configuration", to: "/admin/data/config" },
      { key: "config-history", label: "Configuration History", to: "/admin/data/configHistory" },
    ],
  },
];

/* Dark-canvas primitives — the V2 frames sit every list screen on a black
   canvas: moon toggle top-left, white cards with a black stroke and a white
   outer ring, mint controls with the same ring. */
export const DCARD = "rounded-[12px] border border-black bg-white shadow-[0_0_0_2px_#ffffff]";

export function MoonToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className="grid h-[34px] w-[34px] place-items-center rounded-full border border-black bg-white shadow-[0_0_0_2px_#ffffff]"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="#000" />
      </svg>
    </button>
  );
}

export function DarkZone({ band = false, width, children }) {
  return (
    <div
      style={band && width ? { width } : undefined}
      className={`bg-black px-[24px] pb-[30px] pt-[16px] ${band ? "" : "min-h-[calc(100vh-70px)]"}`}
    >
      <MoonToggle />
      {children}
    </div>
  );
}

export function DarkFilter({ count = 3, value, onChange }) {
  return (
    <div className="mt-[26px] flex flex-wrap items-center gap-x-[26px] gap-y-[12px]">
      <label className="flex h-[40px] w-[380px] max-w-full items-center gap-[10px] rounded-full border border-black bg-white px-[18px] shadow-[0_0_0_2px_#ffffff]">
        <SearchIcon />
        <input
          placeholder="Search...."
          value={value}
          onChange={onChange}
          aria-label="Search"
          className="w-full bg-transparent text-[14px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none"
        />
      </label>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className="flex h-[40px] w-[215px] min-w-[160px] flex-1 items-center justify-between rounded-[8px] border border-black bg-[#DEFFE1] px-[14px] shadow-[0_0_0_2px_#ffffff]"
        >
          <span className="text-[15px] font-semibold text-[#001701]">All</span>
          <ChevDown color="#001701" />
        </button>
      ))}
    </div>
  );
}

/* Status pill. tones: green red orange gray blue lightred */
const TONES = {
  green: "bg-[#DFFFE1] text-[#048B0B]",
  red: "bg-[#FFF2F2] text-[#FF0000]",
  orange: "bg-[#FDEED9] text-[#FF9200]",
  deeporange: "bg-[#FFEFE4] text-[#FF6C03]",
  gray: "bg-[#E1E1E1] text-[#2B2B2B]",
  blue: "bg-[#E4F4FF] text-[#0087FF]",
};
export function Pill({ tone = "green", children, className = "", dot = false }) {
  return (
    <span className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[14px] font-semibold ${TONES[tone] || TONES.green} ${className}`}>
      {dot && <span className="h-[10px] w-[10px] rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function BackTitle({ title, right = null }) {
  const nav = useNavigate();
  return (
    <div className="flex h-[43px] items-center justify-between">
      <div className="flex items-center gap-[15px]">
        <button
          onClick={() => nav(-1)}
          aria-label="Go back"
          className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-[#F1F8F2]"
        >
          <BackIcon />
        </button>
        <h1 className="text-[35px] font-bold leading-none text-[#001701]">{title}</h1>
      </div>
      {right}
    </div>
  );
}

export function PageTitle({ title, right = null }) {
  return (
    <div className="flex min-h-[43px] items-center justify-between">
      <h1 className="text-[35px] font-bold leading-none text-[#001701]">{title}</h1>
      {right}
    </div>
  );
}

export function DarkButton({ children, className = "", ...rest }) {
  return (
    <button
      className={`bg-btn flex items-center justify-center gap-2 rounded-[10px] text-[18px] font-semibold text-[#F1F8F2] ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default function AdminShell({ active = null, sub = null, expand = false, dark = false, nav2 = false, children }) {
  const nav = useNavigate();
  const menu = (nav2 ? MENU2 : MENU).filter((m) => m.key !== "disputes" || active === "disputes");
  const [open, setOpen] = useState(expand ? active : null);
  const [drawer, setDrawer] = useState(false);
  const { user } = useAuth();
  const adminName = user?.full_name || user?.name || (user?.email ? String(user.email).split("@")[0] : "Carter George");
  const go = (to) => {
    setDrawer(false);
    nav(to);
  };
  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Sidebar */}
      <>
      {drawer && (
        <div
          onClick={() => setDrawer(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden
        />
      )}
      <aside
        className={`bg-deep fixed inset-y-0 left-0 z-50 flex w-[270px] shrink-0 flex-col overflow-y-auto transition-transform duration-300 lg:z-30 lg:translate-x-0 ${
          drawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="relative flex h-[70px] shrink-0 items-center justify-center border-b border-[#77BAE7]">
          <span className="text-[28px] font-extrabold tracking-wide text-white">CL<span className="text-[#46C04C]">X</span>SE</span>
          <button
            onClick={() => setDrawer(false)}
            aria-label="Close menu"
            className="absolute right-[14px] top-[18px] grid h-[34px] w-[34px] place-items-center rounded-full bg-white/15 text-[20px] font-bold text-white lg:hidden"
          >
            ×
          </button>
        </div>
        <nav className="flex flex-col pt-[30px]">
          {menu.map((m) => {
            const isActive = active === m.key;
            const expanded = open === m.key;
            return (
              <div key={m.key}>
                <button
                  onClick={() => {
                    if (m.sub) setOpen(expanded ? null : m.key);
                    if (m.to) go(m.to);
                  }}
                  className={`flex h-[60px] w-full items-center gap-[12px] px-[20px] text-left text-[16px] font-semibold ${
                    isActive ? "bg-[#F1F8F2] text-[#001701]" : "text-white"
                  }`}
                >
                  <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center">{m.icon}</span>
                  <span className="flex-1 whitespace-nowrap leading-tight">{m.label}</span>
                  {m.chev && (
                    <span className="shrink-0">
                      <ChevDown color={isActive ? "#001701" : "#FFFFFF"} up={expanded && !!m.sub} />
                    </span>
                  )}
                </button>
                {m.sub && expanded && (
                  <div className="flex flex-col py-[6px]">
                    {m.sub.map((s) => {
                      const subActive = sub === s.key || (!sub && m.to === s.to && isActive && m.sub.indexOf(s) === 0);
                      return (
                        <button
                          key={s.key}
                          onClick={() => go(s.to)}
                          className="flex h-[37px] w-full items-center pl-[35px] text-left text-[18px] font-semibold text-white"
                        >
                          <span
                            className={`h-[15px] w-[15px] shrink-0 rounded-full ${
                              subActive ? "border-2 border-[#DFFFE1]" : "bg-[#048B0B]"
                            }`}
                          />
                          <span className="ml-[10px] leading-tight">{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="h-[20px]" />
              </div>
            );
          })}
          {/* CMS card */}
          <div className="mx-[40px] mb-[40px] flex h-[249px] w-[190px] shrink-0 flex-col items-center rounded-[10px] bg-[#073019] px-[20px] pb-[20px] pt-[25px]">
            <span className="text-[16px] font-extrabold tracking-wide text-white">CLYSE</span>
            <p className="mt-[25px] text-center text-[18px] font-semibold leading-snug text-white">CLYSE CMS v1.0</p>
            <p className="mt-[5px] text-center text-[14px] font-normal leading-snug text-white/85">
              Manage your content efficiently and grow your business.
            </p>
            <button
              onClick={() => go("/")}
              className="mt-auto flex h-[40px] w-[150px] items-center justify-center rounded-[5px] bg-[#048B0B] text-[12px] font-normal text-white"
            >
              View Website
            </button>
          </div>
        </nav>
      </aside>
      </>

      {/* Right column */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col lg:ml-[270px]">
        <header className="sticky top-0 z-20 flex h-[70px] shrink-0 items-center justify-between gap-[12px] border-b border-[#77BAE7] bg-[#E5FFE7] px-[16px] lg:px-[30px]">
          <button
            onClick={() => setDrawer(true)}
            aria-label="Open menu"
            className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[8px] bg-white lg:hidden"
          >
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden>
              <path d="M1 1.5h18M1 8h18M1 14.5h18" stroke="#001701" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <label className="hidden h-[34px] w-[520px] max-w-full flex-1 items-center gap-2 rounded-full bg-white px-[20px] sm:flex lg:flex-none">
            <SearchIcon />
            <input
              placeholder="Search...."
              className="w-full bg-transparent text-[16px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none"
            />
          </label>
          <div className="flex shrink-0 items-center gap-[14px] lg:gap-[25px]">
            <button aria-label="Notifications" className="relative">
              <BellTop />
              <span className="absolute right-[3px] top-[2px] h-[10px] w-[10px] rounded-full bg-[#E80000]" />
            </button>
            <span className="hidden text-[16px] font-semibold text-[#001701] lg:block">{adminName}</span>
            <img src={avatarAccount} alt="Admin" className="h-[30px] w-[30px] rounded-full object-cover" />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="m6 9 6 6 6-6" stroke="#001701" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </header>
        <main className={`admin-main flex-1 overflow-x-auto ${dark ? "bg-black" : ""}`}>
          <div className={nav2 ? "w-full" : "w-full px-[16px] pb-[40px] pt-[20px] lg:min-w-[1110px] lg:px-[30px] lg:pb-[60px] lg:pt-[30px]"}>{children}</div>
        </main>
      </div>
    </div>
  );
}
