import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import StepHeader from "../components/StepHeader";
import BrandTile from "../components/BrandTile";
import { minPrice, useCatalogue } from "../lib/useCatalogue";
import iconPlusCircle from "../assets/icon-plus-circle.svg";

/* Step 1 — pick a subscription (desktop grid 4x2, mobile 2x4).
   NOTE: no footer on the creation flow (Component 3 is hidden in Figma);
   the selected-card highlight is a small addition since Figma shows no
   selected state. Prices go live from the catalogue when it loads. */
const CARDS = [
  { brand: "netflix", title: "Netflix Premium", chip: "Entertainment" },
  { brand: "spotify", title: "Spotify Premium", chip: "Music" },
  { brand: "youtube", title: "Youtube Premium", chip: "Entertainment" },
  { brand: "prime", title: "Prime Video", chip: "Streaming" },
  { brand: "canva", title: "Canva Pro", chip: "Design" },
  { brand: "capcut", title: "CapCut Pro", chip: "Editing" },
  { brand: "adobe", title: "Adobe Creative Cloud", chip: "Design" },
  { brand: "amazon", title: "Amazon", chip: "Shopping" },
];

function DesktopCard({ card, from, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`h-[200px] w-[250px] rounded-[20px] border bg-white pt-[31px] text-center shadow-[0_0_20px_rgba(0,23,1,0.10)] ${
        selected ? "border-[2px] border-clyse bg-[#F1F8F1]" : "border-clyse"
      }`}
    >
      <span className="flex justify-center">
        <BrandTile brand={card.brand} />
      </span>
      <span className="mt-[10px] block text-[18px] leading-[22px] font-bold text-ink">
        {card.title}
      </span>
      <span className="mx-auto mt-[5px] grid h-[19px] w-[96px] place-items-center rounded-[3.58px] bg-[#B1DBB3] text-[10px] font-semibold text-clyse">
        {card.chip}
      </span>
      <span className="mt-[10px] flex items-baseline justify-center gap-[4px]">
        <span className="text-[18px] leading-[22px] font-semibold text-ink">
          From &#8358;{from}/
        </span>
        <span className="text-[13px] leading-[16px] font-semibold text-ash">
          Monthly
        </span>
      </span>
    </button>
  );
}

function MobileCard({ card, from, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`h-[130px] rounded-[12.95px] border bg-white pt-[20px] text-center shadow-[0_0_13px_rgba(0,23,1,0.10)] ${
        selected ? "border-[2px] border-clyse bg-[#F1F8F1]" : "border-clyse"
      }`}
    >
      <span className="flex justify-center">
        <BrandTile brand={card.brand} mobile />
      </span>
      <span className="mt-[7px] block text-[11.66px] leading-[14.19px] font-bold text-ink">
        {card.title}
      </span>
      <span className="mx-auto mt-[3px] grid h-[12px] w-[62px] place-items-center rounded-[2.3px] bg-[#B1DBB3] text-[6.48px] font-semibold text-clyse">
        {card.chip}
      </span>
      <span className="mt-[7px] flex items-baseline justify-center gap-[3px]">
        <span className="text-[11.66px] leading-[14px] font-semibold text-ink">
          From &#8358;{from}/
        </span>
        <span className="text-[8.42px] leading-[10px] font-semibold text-ash">
          Monthly
        </span>
      </span>
    </button>
  );
}

export default function CreateGroup() {
  const incoming = useLocation().state || null;
  const [selected, setSelected] = useState(0);
  const [custom, setCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPlan, setCustomPlan] = useState("");
  const services = useCatalogue();

  const fromFor = (brand) => {
    const min = minPrice(services, brand);
    return min != null ? Math.round(min / 100).toLocaleString("en-US") : "2,000";
  };
  const nextState = custom
    ? {
        custom: { name: customName.trim(), plan: customPlan.trim() },
        ...(incoming?.fromWaitlist ? { fromWaitlist: incoming.fromWaitlist } : {}),
      }
    : {
        brand: CARDS[selected].brand,
        title: CARDS[selected].title,
        ...(incoming?.fromWaitlist ? { fromWaitlist: incoming.fromWaitlist } : {}),
      };

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-[163px] mt-[100px] hidden xl:block">
        <StepHeader step={1} />
        <h2 className="mt-[50px] text-center text-[35px] leading-[43px] font-semibold">
          What subscription do you want to share?
        </h2>
        <div className="mt-[60px] grid grid-cols-4 gap-[38px]">
          {CARDS.map((c, i) => (
            <DesktopCard
              key={c.brand}
              card={c}
              from={fromFor(c.brand)}
              selected={selected === i}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCustom((v) => !v)}
          className="mt-[60px] flex h-[60px] w-full items-center justify-center gap-[9px] rounded-2xl border border-[#999999] bg-mint"
        >
          <img src={iconPlusCircle} alt="" className="h-[35px] w-[35px]" />
          <span className="text-[25px] leading-[35px] font-semibold">
            Other Custom Subscription
          </span>
        </button>
        {custom && (
          <>
            <div className="mt-[30px] flex h-[100px] items-center rounded-2xl border border-clyse bg-white pl-[50px]">
              <input
                placeholder="Subscription name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-transparent text-[25px] font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-[#999999]"
              />
            </div>
            <div className="mt-[35px] flex h-[100px] items-center rounded-2xl border border-clyse bg-white pl-[50px]">
              <input
                placeholder="Subscription name"
                value={customPlan}
                onChange={(e) => setCustomPlan(e.target.value)}
                className="w-full bg-transparent text-[25px] font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-[#999999]"
              />
            </div>
          </>
        )}
        <Link
          to="/create-group/details"
          state={nextState}
          className="mx-auto mt-[50px] grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint"
        >
          Continue
        </Link>
        <div className={custom ? "pb-[195px]" : "pb-[150px]"} />
      </main>

      {/* Mobile */}
      <main className="relative z-10 xl:hidden">
        <StepHeader step={1} />
        <h2 className="mt-[32px] px-[30px] text-center text-[22px] leading-[27px] font-semibold">
          What subscription do you want to share?
        </h2>
        <div className="mt-[76px] grid grid-cols-2 gap-x-[24px] gap-y-[15px] px-[41px]">
          {CARDS.map((c, i) => (
            <MobileCard
              key={c.brand}
              card={c}
              from={fromFor(c.brand)}
              selected={selected === i}
              onSelect={() => setSelected(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCustom((v) => !v)}
          className="mx-[30px] mt-[148px] flex h-[50px] w-[370px] items-center justify-center gap-[7px] rounded-[11.1px] border border-[#999999] bg-mint"
        >
          <img src={iconPlusCircle} alt="" className="h-[24px] w-[24px]" />
          <span className="text-[17.34px] leading-[24px] font-semibold">
            Other Custom Subscription
          </span>
        </button>
        {custom && (
          <>
            <div className="mx-[30px] mt-[24px] flex h-[69px] w-[370px] items-center rounded-[11.1px] border-[0.69px] border-clyse bg-white pl-[35px]">
              <input
                placeholder="Subscription name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-transparent text-[17.34px] font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-[#999999]"
              />
            </div>
            <div className="mx-[30px] mt-[25px] flex h-[69px] w-[370px] items-center rounded-[11.1px] border-[0.69px] border-clyse bg-white pl-[35px]">
              <input
                placeholder="Subscription name"
                value={customPlan}
                onChange={(e) => setCustomPlan(e.target.value)}
                className="w-full bg-transparent text-[17.34px] font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-[#999999]"
              />
            </div>
          </>
        )}
        <Link
          to="/create-group/details"
          state={nextState}
          className="mx-[30px] mt-[32px] grid h-[50px] w-[370px] place-items-center rounded-[11.1px] bg-btn text-[11.66px] font-semibold text-mint"
        >
          Continue
        </Link>
        <div className="pb-[63px]" />
      </main>
    </div>
  );
}
