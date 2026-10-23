import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubCard from "../components/SubCard";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import { api, brandOf, daysUntil, kobo } from "../lib/api";

/* Figma content, shown while the real list loads. */
const ROWS = [
  { brand: "adobe", title: "Adobe Creative Cloud", plan: "Standard Plan", price: "N3,000", mTitle: "Adobe Creative Cloud" },
  { brand: "netflix", title: "Netflix Premium", plan: "Premium Plan", price: "N2,000", mTitle: "Netflix Premium" },
  { brand: "youtube", title: "YouTube Premium", plan: "Premium Plan", price: "N2,000", mTitle: "YouTube" },
  { brand: "spotify", title: "Spotify Premium", plan: "Premium Plan", price: "N2,000", mTitle: "Spotify Premium" },
  { brand: "capcut", title: "CapCut Pro", plan: "Premium Plan", price: "N3,300", mTitle: "CapCut Pro" },
  { brand: "canva", title: "Canva Pro", plan: "Premium Plan", price: "N5,000", mTitle: "Canva Pro" },
  { brand: "amazon", title: "Amazon", plan: "Premium Plan", price: "N2,000", mTitle: "Amazon" },
  { brand: "prime", title: "Prime Video Premium", plan: "Premium Plan", price: "N2,000", mTitle: "Prime Video Premium" },
];

/* Mobile order differs from desktop (literal per screen). */
const MORDER = ["adobe", "netflix", "amazon", "canva", "capcut", "prime", "spotify", "youtube"];
const MROWS = MORDER.map((b) => ROWS.find((r) => r.brand === b));

const SUB = "Manage your subscriptions, view details, and track your groups.";

const PEACH = {
  statusLabel: "Renewal Due",
  statusBg: "bg-[#FFE4D3]",
  statusText: "text-[#CB5300]",
  statusDot: "bg-[#CB5300]",
};
const GRAY = {
  statusBg: "bg-[#F1F1F1]",
  statusText: "text-[#6B6B6B]",
  statusDot: "bg-[#999999]",
};

function mapSub(s) {
  const service = s.service || {};
  const plan = s.plan || {};
  const name = [service.name, plan.name].filter(Boolean).join(" ") || "Subscription";
  const planLine = plan.name ? `${plan.name} Plan` : "Premium Plan";
  // The row price lives on the membership (price.total_kobo); the nested
  // plan carries no totals.
  const total =
    s.price?.total_kobo ?? plan.total_price_kobo ?? plan.total_kobo ?? null;
  const price = total != null ? kobo(total) : "N2,000";
  let status = (s.derived_status || s.status || s.membership_status || "active").toLowerCase();
  // Rich membership axes override the coarse status when present.
  const pay = (s.payment_status || "").toLowerCase();
  const ren = (s.renewal_status || "").toLowerCase();
  if (pay === "due" || pay === "overdue" || ren === "due") status = "renewal_required";
  else if (ren === "declined" || ren === "ended") status = "ended";
  const d = daysUntil(s.current_period_end);
  let subLine = "Renews in 12 days";
  let pill = {};
  if (status === "active") {
    subLine =
      d == null ? "Renews soon" : d === 0 ? "Renews today" : `Renews in ${d} day${d === 1 ? "" : "s"}`;
  } else if (status === "renewal_required") {
    subLine = "Renewal required";
    pill = PEACH;
  } else if (status === "expired") {
    subLine = "Expired";
    pill = { ...GRAY, statusLabel: "Expired" };
  } else {
    subLine = "Ended";
    pill = { ...GRAY, statusLabel: "Ended" };
  }
  return {
    key: s.membership_id || s.id,
    brand: brandOf(service),
    title: name,
    plan: planLine,
    price,
    mTitle: name,
    mPlan: planLine,
    mPrice: price,
    mSub: subLine,
    subLine,
    linkState: { membership_id: s.membership_id || s.id },
    ...pill,
  };
}

export default function Subscriptions() {
  const [subs, setSubs] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      // GET /member/memberships is the membership screen (payment, access and
      // renewal axes); fall back to the lightweight subscriptions list.
      const first = await api("/member/memberships");
      const list = first.data?.memberships;
      if (live && list) {
        setSubs(list);
        return;
      }
      const { data } = await api("/member/subscriptions");
      if (live) setSubs(data?.subscriptions || data?.memberships || []);
    })();
    return () => {
      live = false;
    };
  }, []);

  if (subs && subs.length === 0) return <Navigate to="/subscriptions/empty" replace />;

  const rows = subs ? subs.map(mapSub) : ROWS;
  const mrows = subs ? rows : MROWS;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px]">
          <Sidebar active="My Subscription" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Subscription
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] flex flex-col gap-[30px]">
              {rows.map((r) => (
                <SubCard key={r.key || r.title} {...r} />
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
          <div className="mt-[19px] grid h-[33px] place-items-center">
            <svg width="19" height="9" viewBox="0 0 19 9" fill="none" aria-hidden>
              <path
                d="M1.5 1.5 9.5 7.5l8-6"
                stroke="#6B6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-[51px] text-[30px] leading-[37px] font-bold text-black">
            Subscription
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[70px] flex flex-col gap-[10px]">
            {subs
              ? mrows.map((r) => <SubCard key={r.key || r.title} {...r} />)
              : mrows.map((r) => (
                  <SubCard
                    key={r.title}
                    {...r}
                    mPlan="Premium Plan"
                    mPrice="N2,000"
                  />
                ))}
          </div>
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
