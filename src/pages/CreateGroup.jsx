import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import StepHeader from "../components/StepHeader";
import BrandTile from "../components/BrandTile";
import { minPrice, useCatalogue } from "../lib/useCatalogue";

/* Step 1 — pick a subscription (desktop grid 4x2, mobile 2x4).
   NOTE: no footer on the creation flow (Component 3 is hidden in Figma);
   the selected-card highlight is a small addition since Figma shows no
   selected state. Prices go live from the catalogue when it loads. */
const CARDS = [
  { brand: "netflix", title: "Netflix Premium", chip: "Entertainment" },
  { brand: "spotify", title: "Spotify Premium", chip: "Music" },
  { brand: "youtube", title: "YouTube Premium", chip: "Entertainment" },
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
      /* Figma 887:49199 gives the card component a 1px #999999 stroke; only the
         card in play is stroked #048B0B. Every card used to be green. */
      className={`h-[200px] w-[250px] rounded-[20px] border-[1px] bg-white pt-[31px] text-center shadow-[0_0_20px_rgba(0,23,1,0.10)] ${
        selected ? "border-[#048B0B]" : "border-[#999999]"
      }`}
    >
      <span className="flex justify-center">
        <BrandTile brand={card.brand} plain />
      </span>
      <span className="mt-[10px] block text-[18px] leading-[22px] font-bold text-ink">
        {card.title}
      </span>
      <span className="mx-auto mt-[5px] grid h-[19px] w-[96px] place-items-center rounded-[3.58px] bg-[#B1DBB3] text-[10px] font-semibold text-clyse">
        {card.chip}
      </span>
      <span className="mt-[10px] flex items-baseline justify-center gap-0">
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
      className={`h-[130px] rounded-[12.95px] border-[1px] bg-white pt-[20px] text-center shadow-[0_0_13px_rgba(0,23,1,0.10)] ${
        selected ? "border-[#048B0B]" : "border-[#999999]"
      }`}
    >
      <span className="flex justify-center">
        <BrandTile brand={card.brand} mobile plain />
      </span>
      <span className="mt-[7px] block text-[11.66px] leading-[14.19px] font-bold text-ink">
        {card.title}
      </span>
      <span className="mx-auto mt-[3px] grid h-[12px] w-[62px] place-items-center rounded-[2.3px] bg-[#B1DBB3] text-[6.48px] font-semibold text-clyse">
        {card.chip}
      </span>
      <span className="mt-[7px] flex items-baseline justify-center gap-0">
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
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const [custom, setCustom] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customPlan, setCustomPlan] = useState("");
  const [q, setQ] = useState("");
  const services = useCatalogue();

  /* Figma 887:49199 puts a "Browse Subscription" field between the heading and
     the card grid. It filters the grid; the catalogue itself is unchanged. */
  const needle = q.trim().toLowerCase();
  const shownCards = CARDS.filter((c) => !needle || c.title.toLowerCase().includes(needle));

  const fromFor = (brand) => {
    const min = minPrice(services, brand);
    return min != null ? Math.round(min / 100).toLocaleString("en-US") : "—";
  };
  const customPriceKobo = customPlan
    ? Number.parseInt(customPlan, 10) * 100
    : null;
  const nextState = custom
    ? {
        custom: {
          name: customName.trim(),
          plan: "Custom plan",
          priceKobo: Number.isFinite(customPriceKobo) ? customPriceKobo : null,
        },
        ...(incoming?.fromWaitlist
          ? { fromWaitlist: incoming.fromWaitlist }
          : {}),
      }
    : {
        brand: CARDS[selected].brand,
        title: CARDS[selected].title,
        ...(incoming?.fromWaitlist
          ? { fromWaitlist: incoming.fromWaitlist }
          : {}),
      };

  /* Bug 12/13 came back whenever /create-group/details was opened directly:
     the picked brand only lived in router state. Mirror the choice into
     sessionStorage so the price chain survives a refresh or a deep link. */
  useEffect(() => {
    try {
      if (custom) {
        sessionStorage.setItem(
          "clyse-draft",
          JSON.stringify({
            custom: {
              name: customName.trim(),
              plan: "Custom plan",
              priceKobo: Number.isFinite(customPriceKobo) ? customPriceKobo : null,
            },
          }),
        );
      } else {
        sessionStorage.setItem(
          "clyse-draft",
          JSON.stringify({ brand: CARDS[selected].brand, title: CARDS[selected].title }),
        );
      }
    } catch {}
  }, [selected, custom, customName, customPlan, customPriceKobo]);

  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,#E4F6E5_0%,#EFFAF0_240px,#FBFEFB_420px)] font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-[100px] mt-[100px] hidden xl:block">
        {/* Figma 887:49199 — mint circular back chevron sits above the card */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          aria-label="Back"
          className="mb-[28px] grid h-[45px] w-[45px] place-items-center rounded-full bg-white shadow-[0_0_10px_rgba(0,23,1,0.08)] transition hover:bg-[#DFFFE0]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 5l-7 7 7 7" stroke="#001701" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="rounded-[20px] bg-white px-[63px] pt-[30px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.08)]">
        <StepHeader step={1} />
        <h2 className="mt-[50px] text-[35px] leading-[43px] font-semibold">
          What subscription do you want to share?
        </h2>
        <div className="mt-[50px] flex h-[80px] items-center gap-[18px] rounded-[10px] border border-[#57A35B] bg-white px-[32px]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="10.5" cy="10.5" r="7" stroke="#001701" strokeWidth="2" />
            <path d="m16 16 4.5 4.5" stroke="#001701" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Browse Subscription"
            aria-label="Browse Subscription"
            className="w-full bg-transparent text-[22px] font-semibold text-ink outline-none placeholder:text-[#999999]"
          />
        </div>
        <div className="mt-[40px] grid grid-cols-4 gap-[38px]">
          {shownCards.map((c) => (
            <DesktopCard
              key={c.brand}
              card={c}
              from={fromFor(c.brand)}
              selected={CARDS[selected].brand === c.brand}
              onSelect={() => setSelected(CARDS.indexOf(c))}
            />
          ))}
        </div>
        {shownCards.length === 0 && (
          <p className="mt-[40px] text-center text-[22px] font-semibold text-[#6B6B6B]">
            No subscription matches “{q.trim()}”.
          </p>
        )}
        <button
          type="button"
          onClick={() => setCustom((v) => !v)}
          aria-pressed={custom}
          className={`mt-[60px] flex h-[60px] w-full items-center justify-center gap-[12px] rounded-2xl border bg-mint transition ${
            custom ? "border-[#048B0B] shadow-[0_0_12px_rgba(4,139,11,0.18)]" : "border-[#999999]"
          }`}
        >
          <span
            aria-hidden="true"
            className="grid h-[20px] w-[20px] flex-none place-items-center rounded-full bg-[#001701]"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden>
              <path d="M6 1v10M1 6h10" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
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
                placeholder="Monthly price"
                value={customPlan}
                onChange={(e) =>
                  setCustomPlan(e.target.value.replace(/\D/g, ""))
                }
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full bg-transparent text-[25px] font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-[#999999]"
              />
            </div>
          </>
        )}
        <div className="mx-auto mt-[50px] flex w-[990px] items-center gap-[50px]">
          <Link
            to="/dashboard"
            className="grid h-[60px] w-[470px] place-items-center rounded-2xl border border-clyse text-[18px] font-semibold text-ink"
          >
            Go Back
          </Link>
          <Link
            to="/create-group/plan"
            state={nextState}
            className="grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint"
          >
            Continue
          </Link>
        </div>
        <div className={custom ? "pb-[195px]" : "pb-[150px]"} />
        </div>
      </main>

      {/* Mobile */}
      <main className="relative z-10 xl:hidden">
        <StepHeader step={1} />
        <h2 className="mt-[32px] px-[30px] text-center text-[22px] leading-[27px] font-semibold">
          What subscription do you want to share?
        </h2>
        <div className="mx-[30px] mt-[24px] flex h-[51px] items-center gap-[12px] rounded-[7px] border-[0.69px] border-[#57A35B] bg-white px-[18px]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="10.5" cy="10.5" r="7" stroke="#001701" strokeWidth="2" />
            <path d="m16 16 4.5 4.5" stroke="#001701" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Browse Subscription"
            aria-label="Browse Subscription"
            className="w-full bg-transparent text-[15.5px] font-semibold text-ink outline-none placeholder:text-[#999999]"
          />
        </div>
        <div className="mt-[26px] grid grid-cols-2 gap-x-[24px] gap-y-[15px] px-[41px]">
          {shownCards.map((c) => (
            <MobileCard
              key={c.brand}
              card={c}
              from={fromFor(c.brand)}
              selected={CARDS[selected].brand === c.brand}
              onSelect={() => setSelected(CARDS.indexOf(c))}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCustom((v) => !v)}
          aria-pressed={custom}
          className={`mx-[30px] mt-[32px] flex h-[50px] w-[calc(100%-60px)] max-w-[370px] items-center justify-center gap-[9px] rounded-[11.1px] border bg-mint transition ${
            custom ? "border-[#048B0B] shadow-[0_0_12px_rgba(4,139,11,0.18)]" : "border-[#999999]"
          }`}
        >
          <span
            aria-hidden="true"
            className="grid h-[16px] w-[16px] flex-none place-items-center rounded-full bg-[#001701]"
          >
            <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden>
              <path d="M6 1v10M1 6h10" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[17.34px] leading-[24px] font-semibold">
            Other Custom Subscription
          </span>
        </button>
        {custom && (
          <>
            <div className="mx-[30px] mt-[24px] flex h-[69px] w-[calc(100%-60px)] max-w-[370px] items-center rounded-[11.1px] border-[0.69px] border-clyse bg-white pl-[35px]">
              <input
                placeholder="Subscription name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-transparent text-[17.34px] font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-[#999999]"
              />
            </div>
            <div className="mx-[30px] mt-[25px] flex h-[69px] w-[calc(100%-60px)] max-w-[370px] items-center rounded-[11.1px] border-[0.69px] border-clyse bg-white pl-[35px]">
              <input
                placeholder="Monthly price"
                value={customPlan}
                onChange={(e) =>
                  setCustomPlan(e.target.value.replace(/\D/g, ""))
                }
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full bg-transparent text-[17.34px] font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-[#999999]"
              />
            </div>
          </>
        )}
        <div className="mx-[30px] mt-[32px] flex items-center gap-[24px]">
          <Link
            to="/dashboard"
            className="grid h-[50px] flex-1 place-items-center rounded-[11.1px] border border-clyse text-[11.66px] font-semibold text-ink flex-1"
          >
            Go Back
          </Link>
          <Link
            to={(custom && !customName.trim()) || (custom && !customPriceKobo) ? "/create-group" : "/create-group/plan"}
            state={nextState}
            aria-disabled={(custom && (!customName.trim() || !customPriceKobo)) || undefined}
            className={`grid h-[50px] flex-1 place-items-center rounded-[11.1px] text-[11.66px] font-semibold ${
              custom && (!customName.trim() || !customPriceKobo)
                ? "bg-[#EDF3ED] text-[#8A9A8D]"
                : "bg-btn text-mint"
            }`}
          >
            Continue
          </Link>
        </div>
        <div className="pb-[63px]" />
      </main>
    </div>
  );
}
