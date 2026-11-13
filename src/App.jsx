import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";
import { RequireAuth } from "./lib/auth.jsx";
import RequireAdmin from "./components/RequireAdmin.jsx";
import Landing from "./pages/Landing";
import Marketplace from "./pages/Marketplace";
import NoSubscription from "./pages/NoSubscription";
import Group from "./pages/Group";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import Browse from "./pages/Browse";
import WithdrawAmount from "./pages/WithdrawAmount";
import WithdrawDetails from "./pages/WithdrawDetails";
import Admin from "./pages/Admin";
import AdminCustomRequests from "./pages/AdminCustomRequests";
import AdminRequestDetails from "./pages/AdminRequestDetails";
import AdminGroupVerification from "./pages/AdminGroupVerification";
import AdminGroupReview from "./pages/AdminGroupReview";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminGroups from "./pages/AdminGroups";
import AdminGroupDetails from "./pages/AdminGroupDetails";
import AdminFinance from "./pages/AdminFinance";
import AdminFinanceDetails from "./pages/AdminFinanceDetails";
import AdminRecon from "./pages/AdminRecon";
import AdminReconHistory from "./pages/AdminReconHistory";
import AdminExceptions from "./pages/AdminExceptions";
import AdminDisputes from "./pages/AdminDisputes";
import AdminSupport from "./pages/AdminSupport";
import AdminSecurity from "./pages/AdminSecurity";
import AdminHealth from "./pages/AdminHealth";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import AdminSubAdd from "./pages/AdminSubAdd";
import AdminSubDetails from "./pages/AdminSubDetails";
import AdminDataPage from "./pages/AdminDataPage";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { VerifyEmail, VerifySuccess } from "./pages/Verify";
import { ResetEmail, ResetCheckMail, ResetNew } from "./pages/Reset";
import CreateGroup from "./pages/CreateGroup";
import CreateDetails from "./pages/CreateDetails";
import CreatePlan from "./pages/CreatePlan";
import CreateVerify from "./pages/CreateVerify";
import CreateReview from "./pages/CreateReview";
import CreateResult from "./pages/CreateResult";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import TransactionHistory from "./pages/TransactionHistory";
import { SupportInbox, SupportThread, SupportNew } from "./pages/Support";
import { WaitlistHistory } from "./pages/WaitlistHistory";
import { GroupActivity, InviteManager } from "./pages/GroupActivity";
import WalletEmpty from "./pages/WalletEmpty";
import WalletError from "./pages/WalletError";
import Join from "./pages/Join";
import JoinPlan from "./pages/JoinPlan";
import JoinSummary from "./pages/JoinSummary";
import JoinSummaryError from "./pages/JoinSummaryError";
import JoinPayment from "./pages/JoinPayment";
import JoinApplePay from "./pages/JoinApplePay";
import JoinGooglePay from "./pages/JoinGooglePay";
import JoinCard from "./pages/JoinCard";
import JoinCardFilled from "./pages/JoinCardFilled";
import JoinCardError from "./pages/JoinCardError";
import JoinConfirmed from "./pages/JoinConfirmed";
import JoinPaymentFailed from "./pages/JoinPaymentFailed";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import GroupMembers from "./pages/GroupMembers";
import GroupShare from "./pages/GroupShare";
import GroupManage from "./pages/GroupManage";
import GroupBrowse from "./pages/GroupBrowse";
import GroupEmpty from "./pages/GroupEmpty";
import GroupError from "./pages/GroupError";
import Earnings from "./pages/Earnings";
import EarningsPerGroup from "./pages/EarningsPerGroup";
import EarningsPerMember from "./pages/EarningsPerMember";
import JoinDetails from "./pages/JoinDetails";
import JoinPreview from "./pages/JoinPreview";

/* The preview step duplicated the payment summary in the mobile join flow.
   Old links/backs land here and are forwarded straight to the summary. */
function PreviewForward() {
  const loc = useLocation();
  return <Navigate to="/join/summary" replace state={loc.state} />;
}
import JoinSuccess from "./pages/JoinSuccess";
import JoinAlready from "./pages/JoinAlready";
import JoinFailed from "./pages/JoinFailed";
import Waitlist from "./pages/Waitlist";
import WaitlistLeave from "./pages/WaitlistLeave";
import WaitlistError from "./pages/WaitlistError";
import WaitlistEmpty from "./pages/WaitlistEmpty";
import Subscriptions from "./pages/Subscriptions";
import SubscriptionHistory from "./pages/SubscriptionHistory";
import SubError from "./pages/SubError";
import SubReport from "./pages/SubReport";
import CreatorDisputes from "./pages/CreatorDisputes";
import { SubscriptionRequestList, SubscriptionRequestNew, SubscriptionRequestDetails } from "./pages/SubscriptionRequests";
import SubDetails from "./pages/SubDetails";
import SubEmpty from "./pages/SubEmpty";
import CreateLive from "./pages/CreateLive";
import SelectBank from "./pages/SelectBank";
import CreateNotActivated from "./pages/CreateNotActivated";

const TITLES = {
  "/": "Clyse — Share the Cost. Enjoy the Access.",
  "/signup": "Sign Up — Clyse",
  "/signin": "Sign In — Clyse",
  "/verify-email": "Verify Email — Clyse",
  "/verify-email/success": "Verification Successful — Clyse",
  "/reset-password": "Reset Password — Clyse",
  "/reset-password/check-mail": "Check Your Mail — Clyse",
  "/reset-password/new": "Create A New Password — Clyse",
  "/no-subscription": "No Subscription — Clyse",
  "/subscription-group": "Subscription Group — Clyse",
  "/marketplace": "Browse Subscriptions — Clyse",
  "/dashboard": "Dashboard — Clyse",
  "/wallet": "My Wallet — Clyse",
  "/wallet/empty": "My Wallet — Clyse",
  "/wallet/error": "My Wallet — Clyse",
  "/join": "Join Waitlist — Clyse",
  "/join/plan": "Choose Your Plan — Clyse",
  "/join/details": "Waitlist Details — Clyse",
  "/join/success": "Waitlist Joined — Clyse",
  "/join/already": "Already on Waitlist — Clyse",
  "/join/failed": "Something Went Wrong — Clyse",
  "/join/confirmed": "Payment Confirmed — Clyse",
  "/join/payment-failed": "Payment Failed — Clyse",
  "/groups": "My Group — Clyse",
  "/groups/details": "Group Details — Clyse",
  "/groups/members": "Group Members — Clyse",
  "/groups/share": "Share Group — Clyse",
  "/groups/manage": "Manage Group — Clyse",
  "/groups/browse": "Browse Subscription — Clyse",
  "/groups/empty": "My Group — Clyse",
  "/groups/error": "My Group — Clyse",
  "/earnings": "Earnings — Clyse",
  "/earnings/per-group": "Earnings Per Group — Clyse",
  "/earnings/per-member": "Earnings Per Member — Clyse",
  "/wallet/transactions": "Transaction History — Clyse",
  "/waitlist": "My Waitlist — Clyse",
  "/waitlist/leave": "Leave Waitlist — Clyse",
  "/waitlist/error": "Waitlist Error — Clyse",
  "/waitlist/empty": "No Waitlist — Clyse",
  "/subscriptions": "My Subscription — Clyse",
  "/subscriptions/history": "Subscription History — Clyse",
  "/subscriptions/details": "Subscription Details — Clyse",
  "/subscriptions/empty": "No Subscription — Clyse",
  "/create/activated": "Group Activated — Clyse",
  "/create/not-activated": "Group Not Activated — Clyse",
  "/withdraw/select-bank": "Select Bank Account — Clyse",
  "/withdraw/details": "Withdrawal Details — Clyse",
  "/withdraw/amount": "Withdraw Earnings — Clyse",
  "/about": "About Us — Clyse",
  "/contact": "Contact Us — Clyse",
  "/messages": "Messages — Clyse",
  "/notifications": "Notifications — Clyse",
  "/profile": "Profile — Clyse",
  "/support": "Support — Clyse",
  "/support/new": "New Support Ticket — Clyse",
  "/support/:issueId": "Support Ticket — Clyse",
  "/waitlist/activity": "Waitlist Activity — Clyse",
  "/groups/activity": "Group Activity — Clyse",
  "/groups/invites": "Invite Links — Clyse",
  "/create-group": "Create Group — Clyse",
  "/create-group/plan": "Create Group — Clyse",
  "/browse": "Browse Groups — Clyse",
  "/admin": "Admin Dashboard — Clyse",
  "/admin/dashboard": "Admin Dashboard — Clyse",
  "/admin/subscriptions": "Subscriptions — Clyse CMS",
  "/admin/subscriptions/add": "Add Subscription — Clyse CMS",
  "/admin/subscriptions/details": "Subscription Details — Clyse CMS",
  "/admin/subscriptions/requests": "Custom Requests — Clyse CMS",
  "/admin/subscriptions/requests/details": "Request Details — Clyse CMS",
  "/admin/group-verification": "Group Verification — Clyse CMS",
  "/admin/group-verification/review": "Group Details & Review — Clyse CMS",
  "/admin/users": "User List — Clyse CMS",
  "/admin/users/details": "User Details & Moderation — Clyse CMS",
  "/admin/groups": "Group List — Clyse CMS",
  "/admin/groups/details": "Group Details & Moderation — Clyse CMS",
};

function AdminDataRoute() {
  const { page } = useParams();
  return <AdminDataPage key={page} page={page} />;
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        document.title = TITLES[pathname] || TITLES["/"];
        return;
      }
    }
    /* Explicit "instant" so this can never inherit a smooth scroll-behavior. */
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.title = TITLES[pathname] || TITLES["/"];
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/verify-email/success" element={<VerifySuccess />} />
        <Route path="/reset-password" element={<ResetEmail />} />
        <Route path="/reset-password/check-mail" element={<ResetCheckMail />} />
        <Route path="/reset-password/new" element={<ResetNew />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/subscription-group" element={<Group />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        {/* Logged-in only */}
        <Route element={<RequireAuth />}>
          <Route path="/no-subscription" element={<NoSubscription />} />
          <Route path="/create-group" element={<CreateGroup />} />
          <Route path="/create-group/plan" element={<CreatePlan />} />
          <Route path="/create-group/details" element={<CreateDetails />} />
          <Route path="/create-group/verify" element={<CreateVerify />} />
          <Route path="/create-group/review" element={<CreateReview />} />
          <Route path="/create-group/activated" element={<CreateResult ok />} />
          <Route path="/create-group/failed" element={<CreateResult ok={false} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/wallet/empty" element={<WalletEmpty />} />
          <Route path="/wallet/error" element={<WalletError />} />
          <Route path="/wallet/transactions" element={<TransactionHistory />} />
          <Route path="/join" element={<Join />} />
          <Route path="/join/:token" element={<JoinSummary />} />
          <Route path="/join/preview" element={<PreviewForward />} />
        <Route path="/join/plan" element={<JoinPlan />} />
          <Route path="/join/group" element={<Navigate to="/marketplace" replace />} />
          <Route path="/join/summary" element={<JoinSummary />} />
          <Route path="/join/summary-error" element={<JoinSummaryError />} />
          <Route path="/join/payment" element={<JoinPayment />} />
          <Route path="/join/apple-pay" element={<JoinApplePay />} />
          <Route path="/join/google-pay" element={<JoinGooglePay />} />
          <Route path="/join/card" element={<JoinCard />} />
          <Route path="/join/card-filled" element={<JoinCardFilled />} />
          <Route path="/join/card-error" element={<JoinCardError />} />
          <Route path="/join/confirmed" element={<JoinConfirmed />} />
          <Route path="/join/payment-failed" element={<JoinPaymentFailed />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/details" element={<GroupDetails />} />
          <Route path="/groups/members" element={<GroupMembers />} />
          <Route path="/groups/share" element={<GroupShare />} />
          <Route path="/groups/manage" element={<GroupManage />} />
          <Route path="/groups/browse" element={<GroupBrowse />} />
          <Route path="/groups/empty" element={<GroupEmpty />} />
          <Route path="/groups/error" element={<GroupError />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/earnings/per-group" element={<EarningsPerGroup />} />
          <Route path="/earnings/per-member" element={<EarningsPerMember />} />
          <Route path="/join/details" element={<JoinDetails />} />
          <Route path="/join/success" element={<JoinSuccess />} />
          <Route path="/join/already" element={<JoinAlready />} />
          <Route path="/join/failed" element={<JoinFailed />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/waitlist/leave" element={<WaitlistLeave />} />
          <Route path="/waitlist/error" element={<WaitlistError />} />
          <Route path="/waitlist/empty" element={<WaitlistEmpty />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/subscriptions/history" element={<SubscriptionHistory />} />
          <Route path="/subscriptions/details" element={<SubDetails />} />
          <Route path="/subscriptions/empty" element={<SubEmpty />} />
          <Route path="/subscriptions/error" element={<SubError />} />
          <Route path="/subscriptions/report" element={<SubReport />} />
          <Route path="/disputes" element={<CreatorDisputes />} />
          <Route path="/subscription-requests" element={<SubscriptionRequestList />} />
          <Route path="/subscription-requests/new" element={<SubscriptionRequestNew />} />
          <Route path="/subscription-requests/:id" element={<SubscriptionRequestDetails />} />
          <Route path="/create/activated" element={<CreateLive />} />
          <Route path="/create/not-activated" element={<CreateNotActivated />} />
          <Route path="/withdraw/select-bank" element={<SelectBank />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<SupportInbox />} />
          <Route path="/support/new" element={<SupportNew />} />
          <Route path="/support/:issueId" element={<SupportThread />} />
          <Route path="/waitlist/activity" element={<WaitlistHistory />} />
          <Route path="/groups/activity" element={<GroupActivity />} />
          <Route path="/groups/invites" element={<InviteManager />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/withdraw/amount" element={<WithdrawAmount />} />
          <Route path="/withdraw/details" element={<WithdrawDetails />} />
        </Route>
        {/* Admin has its own credential entry point; successful login is followed
            by a server-side permission check before any CMS route renders. */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/admin/dashboard" element={<Admin />}></Route>
          <Route path="/admin/data/:page" element={<AdminDataRoute />} />
          <Route path="/admin/subscriptions" element={<AdminSubscriptions />}></Route>
          <Route path="/admin/subscriptions/add" element={<AdminSubAdd />}></Route>
          <Route path="/admin/subscriptions/details" element={<AdminSubDetails />}></Route>
          <Route path="/admin/subscriptions/requests" element={<AdminCustomRequests />}></Route>
          <Route path="/admin/subscriptions/requests/details" element={<AdminRequestDetails />}></Route>
          <Route path="/admin/group-verification" element={<AdminGroupVerification />}></Route>
          <Route path="/admin/group-verification/review" element={<AdminGroupReview />}></Route>
          <Route path="/admin/users" element={<AdminUsers />}></Route>
          <Route path="/admin/users/details" element={<AdminUserDetails />}></Route>
          <Route path="/admin/groups" element={<AdminGroups />}></Route>
          <Route path="/admin/groups/details" element={<AdminGroupDetails />}></Route>
          <Route path="/admin/finance" element={<AdminFinance />}></Route>
          <Route path="/admin/finance/transactions/details" element={<AdminFinanceDetails />}></Route>
          <Route path="/admin/finance/reconciliation" element={<AdminRecon />}></Route>
          <Route path="/admin/finance/disputes" element={<AdminDisputes />}></Route>
          <Route path="/admin/finance/reconciliation/history" element={<AdminReconHistory />}></Route>
          <Route path="/admin/finance/exceptions" element={<AdminExceptions />}></Route>
          <Route path="/admin/support" element={<AdminSupport />}></Route>
          <Route path="/admin/security" element={<AdminSecurity />}></Route>
          <Route path="/admin/security/monitoring" element={<AdminHealth />}></Route>
        </Route>
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}
