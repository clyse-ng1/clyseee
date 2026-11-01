/* Shared logged-in nav sections (desktop sidebar + mobile member menu). */
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

/* Unified logged-in sidebar (desktop only). 11 links grouped into 4
   labelled sections so the nav scans cleanly. Inactive rows: white +
   1px green border, ink icon/label, trailing arrow docked at the right
   edge (never overlapping the label). Active row: dark gradient, mint
   label/icon, no arrow. "Massage" fixed to "Message". */
export const SECTIONS = [
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

