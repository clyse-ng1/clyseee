import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubCard, { SubCardSk } from "../components/SubCard";
import ExtraBlock from "../components/ExtraBlock";
import { BlurBg } from "../components/Decor";
import { api, brandOf, daysUntil, kobo } from "../lib/api";


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
  const planLine = plan.name ? `${plan.name} Plan` : "Plan details unavailable";
  // The row price lives on the membership (price.total_kobo); the nested
  // plan carries no totals.
  const total =
    s.price?.total_kobo ?? plan.total_price_kobo ?? plan.total_kobo ?? null;
  const price = total != null ? kobo(total) : "—";
  let status = (s.derived_status || s.status || s.membership_status || "active").toLowerCase();
  // Rich membership axes override the coarse status when present.
  const pay = (s.payment_status || "").toLowerCase();
  const ren = (s.renewal_status || "").toLowerCase();
  if (pay === "due" || pay === "overdue" || ren === "due") status = "renewal_required";
  else if (ren === "declined" || ren === "ended") status = "ended";
  const d = daysUntil(s.current_period_end);
  let subLine = "Renewal date unavailable";
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
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      // GET /member/memberships is the membership screen (payment, access and
      // renewal axes); fall back to the lightweight subscriptions list.
      const first = await api("/member/memberships");
      const list = first.data?.memberships;
      if (live && Array.isArray(list)) {
        setSubs(list);
        return;
      }
      const fallback = await api("/member/subscriptions");
      if (!live) return;
      if (fallback.error) {
        setLoadError(true);
        setSubs([]);
      } else {
        setSubs(fallback.data?.subscriptions || fallback.data?.memberships || []);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  if (loadError) return <Navigate to="/subscriptions/error" replace />;
  if (subs && subs.length === 0) return <Navigate to="/subscriptions/empty" replace />;

  const rows = (subs || []).map(mapSub);
  const mrows = rows;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="My Subscription" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Subscription
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] flex flex-col gap-[30px]">
              {!subs
                ? [0, 1, 2, 3].map((i) => <SubCardSk key={i} />)
                : rows.map((r) => <SubCard key={r.key || r.title} {...r} />)}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative bg-white xl:hidden">
        <div className="relative bg-white px-[30px] pt-[30px] pb-[40px]">
          <h1 className="mt-[0px] text-[30px] leading-[37px] font-bold text-black">
            Subscription
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[70px] flex flex-col gap-[10px]">
            {!subs
              ? [0, 1, 2, 3].map((i) => <SubCardSk key={i} />)
              : mrows.map((r) => <SubCard key={r.key || r.title} {...r} />)}
          </div>
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
