import { Link } from "react-router-dom";
import avatarAccount from "../assets/avatar-account.webp";
import { useAuth } from "../lib/useAuth";
import { displayName, fmtDay } from "../lib/api";
import iconDashboard from "../assets/side-dashboard-ink.svg";
import iconDashboardWhite from "../assets/side-dashboard.svg";
import iconSearch from "../assets/side-search.svg";
import iconPayment from "../assets/side-payment.svg";
import iconPaymentWhite from "../assets/side-payment-white.svg";
import iconEarning from "../assets/side-earning.svg";
import iconEarningWhite from "../assets/side-earning-white.svg";
import iconWaitlist from "../assets/side-waitlist.svg";
import iconWaitlistWhite from "../assets/side-waitlist-white.svg";
import iconNotification from "../assets/side-notification.svg";
import iconMessage from "../assets/side-message.svg";
import iconUser from "../assets/side-user.svg";
import iconRowArrow from "../assets/side-row-arrow.svg";
import ExtraBlock from "./ExtraBlock";

/* Unified logged-in sidebar (desktop only). 11 links grouped into 4
   labelled sections so the nav scans cleanly. Inactive rows: white +
   1px green border, ink icon/label, trailing arrow docked at the right
   edge (never overlapping the label). Active row: dark gradient, mint
   label/icon, no arrow. "Massage" fixed to "Message". */
const SECTIONS = [
  {
    title: "Menu",
    rows: [
      { label: "Dashboard", icon: iconDashboard, activeIcon: iconDashboardWhite, to: "/dashboard" },
      { label: "Browse Group", icon: iconSearch, to: "/browse" },
      { label: "My Subscription", icon: iconPayment, activeIcon: iconPaymentWhite, to: "/subscriptions" },
      { label: "My Group", icon: iconPayment, activeIcon: iconPaymentWhite, to: "/groups" },
    ],
  },
  {
    title: "Money",
    rows: [
      { label: "Earning", icon: iconEarning, activeIcon: iconEarningWhite, to: "/earnings" },
      { label: "My Wallet", icon: iconPayment, activeIcon: iconPaymentWhite, to: "/wallet" },
    ],
  },
  {
    title: "Waitlist",
    rows: [
      { label: "My Waitlist", icon: iconWaitlist, activeIcon: iconWaitlistWhite, to: "/waitlist" },
      { label: "Join Waitlist", icon: iconWaitlist, activeIcon: iconWaitlistWhite, to: "/join" },
    ],
  },
  {
    title: "Account",
    rows: [
      { label: "Notification", icon: iconNotification, to: "/notifications" },
      { label: "Message", icon: iconMessage, to: "/messages" },
      { label: "Profile", icon: iconUser, to: "/profile" },
    ],
  },
];

function Row({ r, active }) {
  const cls = `relative flex h-[56px] w-[292px] items-center rounded-[10px] pl-[16px] pr-[14px] ${
    active
      ? "bg-btn"
      : "border border-clyse bg-white shadow-[0_0_7px_rgba(0,23,1,0.25)]"
  }`;
  const inner = (
    <>
      <img
        src={active && r.activeIcon ? r.activeIcon : r.icon}
        alt=""
        className="h-[26px] w-[26px] flex-none"
      />
      <span
        className={`ml-[12px] truncate font-semibold ${
          active
            ? "text-[22px] leading-[30px] text-[#F1F8F1]"
            : "text-[18px] leading-[22px] text-ink"
        }`}
      >
        {r.label}
      </span>
      {!active && (
        <img
          src={iconRowArrow}
          alt=""
          className="ml-auto h-[26px] w-[26px] flex-none"
        />
      )}
    </>
  );
  return r.to ? (
    <Link key={r.label} to={r.to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div key={r.label} className={cls}>
      {inner}
    </div>
  );
}

export default function Sidebar({ active }) {
  const { user } = useAuth();
  const name = displayName(user) || "Marcus Saris";
  const since = fmtDay(user?.created_at) || "20/11/2026";
  return (
    <aside className="w-[372px] flex-none">
      <div className="bg-white px-[40px] pt-[50px] pb-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <div className="flex items-center">
          <img
            src={user?.avatar_url || avatarAccount}
            alt={name}
            className="h-[50px] w-[50px] rounded-full border-[0.5px] border-mint object-cover shadow-[0_0_7px_rgba(0,23,1,0.25)]"
          />
          <div className="ml-[12px]">
            <p className="text-[25px] leading-[28px] font-bold text-ink">
              {name}
            </p>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Member on Clyse Since {since}
            </p>
          </div>
        </div>
        <nav className="mt-[36px]">
          {SECTIONS.map((s, si) => (
            <div key={s.title} className={si > 0 ? "mt-[22px]" : ""}>
              <p className="pl-[4px] text-[12px] leading-[16px] font-bold tracking-[0.14em] text-[#6B6B6B] uppercase">
                {s.title}
              </p>
              <div className="mt-[10px] space-y-[12px]">
                {s.rows.map((r) => (
                  <Row key={r.label} r={r} active={r.label === active} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <ExtraBlock className="mt-[48px]" />
    </aside>
  );
}
