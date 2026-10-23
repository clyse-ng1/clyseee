import { Link } from "react-router-dom";
import avatarAccount from "../assets/avatar-account.webp";
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

/* Unified logged-in sidebar (desktop only): white main 372x1182, member
   block, 11 rows (292x60 r9.75, pitch 90), dark extra block 100px below
   (aside total 1532). Inactive rows: white + 1px green + ink icon/label +
   trailing circle-arrow fixed at +172 (long labels overlap it in Figma).
   Active row: dark gradient, 25px mint label, mint icon, no arrow.
   "Massage" fixed to "Message". */
const ROWS = [
  { label: "Dashboard", icon: iconDashboard, activeIcon: iconDashboardWhite, to: "/dashboard" },
  { label: "Browse Group", icon: iconSearch, to: "/browse" },
  { label: "My Subscription", icon: iconPayment, activeIcon: iconPaymentWhite, to: "/subscriptions" },
  { label: "My Group", icon: iconPayment, activeIcon: iconPaymentWhite, to: "/groups" },
  { label: "Earning", icon: iconEarning, activeIcon: iconEarningWhite, to: "/earnings" },
  { label: "My Wallet", icon: iconPayment, activeIcon: iconPaymentWhite, to: "/wallet" },
  { label: "My Waitlist", icon: iconWaitlist, activeIcon: iconWaitlistWhite, to: "/waitlist" },
  { label: "Join Waitlist", icon: iconWaitlist, activeIcon: iconWaitlistWhite, to: "/join" },
  { label: "Notification", icon: iconNotification, to: "/notifications" },
  { label: "Message", icon: iconMessage, to: "/messages" },
  { label: "Profile", icon: iconUser, to: "/profile" },
];

export default function Sidebar({ active }) {
  return (
    <aside className="w-[372px] flex-none">
      <div className="h-[1182px] bg-white px-[40px] pt-[50px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <div className="flex items-center">
          <img
            src={avatarAccount}
            alt="Marcus Saris"
            className="h-[50px] w-[50px] rounded-full border-[0.5px] border-mint object-cover shadow-[0_0_7px_rgba(0,23,1,0.25)]"
          />
          <div className="ml-[12px]">
            <p className="text-[25px] leading-[28px] font-bold text-ink">
              Marcus Saris
            </p>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Member on Clyse Since 20/11/2026
            </p>
          </div>
        </div>
        <nav className="mt-[50px] space-y-[30px]">
          {ROWS.map((r) => {
            const isActive = r.label === active;
            const cls = `relative flex h-[60px] w-[292px] items-center rounded-[9.75px] pl-[16px] ${
              isActive
                ? "bg-btn"
                : "border border-clyse bg-white shadow-[0_0_7px_rgba(0,23,1,0.25)]"
            }`;
            const inner = (
              <>
                <img
                  src={isActive && r.activeIcon ? r.activeIcon : r.icon}
                  alt=""
                  className="h-[30px] w-[30px]"
                />
                <span
                  className={`ml-[12px] font-semibold ${
                    isActive
                      ? "text-[25px] leading-[35px] text-[#F1F8F1]"
                      : "text-[18px] leading-[22px] text-ink"
                  }`}
                >
                  {r.label}
                </span>
                {!isActive && (
                  <img
                    src={iconRowArrow}
                    alt=""
                    className="absolute top-1/2 left-[172px] h-[30px] w-[30px] -translate-y-1/2"
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
          })}
        </nav>
      </div>
      <ExtraBlock className="mt-[150px]" />
    </aside>
  );
}
