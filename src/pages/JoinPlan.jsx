import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlanCard from "../components/PlanCard";
import PairButtons from "../components/PairButtons";
import LogoMarquee from "../components/LogoMarquee";
import MemberMini from "../components/MemberMini";
import SectionHead from "../components/SectionHead";
import { BlurBg } from "../components/Decor";
import { api, kobo } from "../lib/api";

/* Figma shows the middle plan selected — selection is live: tapping any
   Select moves the pill + dark button + green stroke to that card. */
const PLANS = [
  { name: "Standard with ads", price: "N 2,000", features: "1080p | 2 screens | limited ads" },
  { name: "Standard with ads", price: "N 2,000", features: "1080p | 2 screens | limited ads" },
  { name: "Standard with ads", price: "N 2,000", features: "1080p | 2 screens | limited ads" },
];

function mapPlan(a, service, brand) {
  const title =
    [a.service?.name, a.plan?.name].filter(Boolean).join(" ") || "Subscription";
  const cap = a.plan?.member_slot_capacity ?? a.plan?.capacity;
  return {
    name: a.plan?.name || "Standard",
    price: a.price?.total_kobo != null ? kobo(a.price.total_kobo) : "—",
    features:
      cap != null ? `${cap} slots · monthly billing` : "Monthly billing",
    state: {
      plan_id: a.plan_id,
      service: a.service?.name || service,
      plan: a.plan?.name || "",
      title,
      brand,
      price_kobo: a.price?.total_kobo ?? null,
      open_slots: a.open_slots ?? 0,
      people_waiting: a.people_waiting ?? 0,
    },
  };
}

export default function JoinPlan() {
  const incoming = useLocation().state || null;
  const incomingService = incoming?.service || null;
  const incomingBrand = incoming?.brand || null;
  const incomingPlanId = incoming?.plan_id || null;
  const incomingPlan = incoming?.plan || "";
  const incomingPrice = incoming?.price_kobo ?? null;
  const incomingSlots = incoming?.open_slots ?? 0;
  const incomingWaiting = incoming?.people_waiting ?? 0;
  const [sel, setSel] = useState(1);
  const [plans, setPlans] = useState(null);

  useEffect(() => {
    if (!incomingService) return;
    let on = true;
    (async () => {
      const { data } = await api("/member/dashboard");
      if (!on) return;
      const rows = (data?.available_subscriptions || []).filter(
        (a) => (a.service?.name || "").toLowerCase() === incomingService.toLowerCase(),
      );
      const list = rows.length
        ? rows
        : incomingPlanId
          ? [
              {
                plan_id: incomingPlanId,
                service: { name: incomingService },
                plan: { name: incomingPlan },
                price: { total_kobo: incomingPrice },
                open_slots: incomingSlots,
                people_waiting: incomingWaiting,
              },
            ]
          : [];
      if (on && list.length) {
        setPlans(list.map((a) => mapPlan(a, incomingService, incomingBrand)));
        setSel(0);
      }
    })();
    return () => {
      on = false;
    };
  }, [incomingService, incomingBrand, incomingPlanId, incomingPlan, incomingPrice, incomingSlots, incomingWaiting]);

  const list = plans || PLANS;
  const heading = incoming?.service
    ? `Choose your ${incoming.service} plan`
    : "Choose your Netflix plan";
  const nextState = plans ? (plans[sel] || plans[0]).state : incoming;
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[102px] border-y border-[#BABABA] bg-white">
          <div className="py-[30px] pl-[63px]">
            <SectionHead />
          </div>
        </div>
        <div className="relative bg-white">
          <div className="px-[63px] pt-[30px] pb-[30px]">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              {heading}
            </h1>
            <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Pick the access level you want to buy. You can change this before joining a group
            </p>
            <div className="mt-[70px] flex gap-[20px]">
              {list.map((p, i) => (
                <PlanCard
                  key={i}
                  {...p}
                  status={sel === i ? "Selected" : "Successful"}
                  selected={sel === i}
                  onSelect={() => setSel(i)}
                />
              ))}
            </div>
            <PairButtons backTo="/join" nextTo="/join/details" nextState={nextState} className="mt-[70px]" />
          </div>
        </div>
      </main>
      <div className="hidden xl:block">
        <LogoMarquee className="mt-[60px]" />
        <div className="pb-[60px]" />
      </div>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
        </div>
        <div className="relative mt-[103px] border-y border-[#BABABA] bg-white">
          <div className="px-[30px] py-[30px]">
            <SectionHead mobile />
          </div>
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[30px] pb-[30px]">
            <h1 className="text-[25px] leading-[30px] font-bold text-black">
              {heading}
            </h1>
            <p className="mt-[15px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
              Pick the access level you want to buy. You can change this before joining a group
            </p>
            <div className="mt-[90px] flex flex-col gap-[20px]">
              {list.map((p, i) => (
                <PlanCard
                  key={i}
                  {...p}
                  status={sel === i ? "Selected" : "Successful"}
                  selected={sel === i}
                  onSelect={() => setSel(i)}
                />
              ))}
            </div>
            <PairButtons backTo="/join" nextTo="/join/details" nextState={nextState} className="mt-[70px]" />
          </div>
        </div>
      </main>
    </div>
  );
}
