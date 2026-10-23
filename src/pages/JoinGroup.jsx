import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlanCard from "../components/PlanCard";
import PairButtons from "../components/PairButtons";
import LogoMarquee from "../components/LogoMarquee";
import CreateGroupHead from "../components/CreateGroupHead";
import { BlurBg } from "../components/Decor";
import { api, kobo } from "../lib/api";

const PLANS = [
  { name: "Standard with ads", price: "N 2,000", features: "1080p | 2 screens | limited ads" },
  { name: "Standard with ads", price: "N 2,000", features: "1080p | 2 screens | limited ads" },
  { name: "Standard with ads", price: "N 2,000", features: "1080p | 2 screens | limited ads" },
];

function mapPlan(a) {
  const cap = a.plan?.member_slot_capacity ?? a.plan?.capacity;
  return {
    name: a.plan?.name || "Standard",
    price: a.price?.total_kobo != null ? kobo(a.price.total_kobo) : "—",
    features:
      cap != null ? `${cap} slots · monthly billing` : "Monthly billing",
  };
}

export default function JoinGroup() {
  const incoming = useLocation().state || null;
  const incomingService = incoming?.service || null;
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
      if (on && rows.length) {
        setPlans(rows.map(mapPlan));
        setSel(0);
      }
    })();
    return () => {
      on = false;
    };
  }, [incomingService]);

  const list = plans || PLANS;
  const heading = incomingService
    ? `Choose your ${incomingService} plan`
    : "Choose your Netflix plan";
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[102px] bg-white">
          <CreateGroupHead />
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
            <PairButtons backTo="/join" nextTo="/join/summary" className="mt-[70px]" />
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
        <div className="relative bg-white">
          <CreateGroupHead />
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[30px] pb-[56px]">
            <h1 className="text-[25px] leading-[30px] font-bold text-black">
              {heading}
            </h1>
            <p className="mt-[15px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
              Pick the access level you want to buy. You can change this before joining a group
            </p>
            <div className="mt-[70px] flex flex-col gap-[20px]">
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
            <PairButtons backTo="/join" nextTo="/join/summary" className="mt-[70px]" />
          </div>
        </div>
      </main>
    </div>
  );
}
