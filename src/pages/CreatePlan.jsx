import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import StepHeader from "../components/StepHeader";
import { matchService, useCatalogue } from "../lib/useCatalogue";
import { planTotal } from "../lib/useCatalogue";

/* Step 2/5 — "Choose your <service> plan" (Figma GROUP CREATION PAGE 15,
   887:49262). Sits between picking the subscription and the group details, so
   the slots and price on the next step already know which access level was
   bought. Figma shows three access levels, the middle one selected, with a
   "Selected" chip on the chosen card. */

const money = (kobo) =>
  kobo == null ? "—" : `N${Math.round(kobo / 100).toLocaleString("en-US")}`;

function PlanCard({ plan, active, onPick, mobile = false }) {
  return (
    <button
      type="button"
      onClick={onPick}
      className={`relative text-left transition ${
        mobile
          ? "flex w-full flex-col rounded-[16px] border bg-white px-[20px] py-[18px]"
          : "flex h-[190px] flex-col justify-center rounded-[16px] border bg-white px-[30px]"
      } ${
        active
          ? "border-clyse shadow-[0_0_20px_rgba(4,139,11,0.18)]"
          : "border-[#DFDFDF]"
      }`}
    >
      {active && (
        <span
          className={`absolute top-[14px] right-[14px] rounded-full bg-[#DFFFE1] font-semibold text-clyse ${
            mobile ? "px-[10px] text-[10px]" : "px-[14px] text-[12px]"
          }`}
        >
          Selected
        </span>
      )}
      <span
        className={`font-semibold text-ink ${
          mobile ? "text-[16px] leading-[22px]" : "text-[22px] leading-[28px]"
        }`}
      >
        {plan.name}
      </span>
      {plan.desc && (
        <span
          className={`mt-[6px] font-semibold text-ash ${mobile ? "text-[11px] leading-[16px]" : "text-[13px] leading-[18px]"}`}
        >
          {plan.desc}
        </span>
      )}
      <span
        className={`mt-[10px] flex items-baseline gap-[2px] ${mobile ? "" : "mt-[18px]"}`}
      >
        <span
          className={`font-bold text-ink ${
            mobile ? "text-[18px] leading-[24px]" : "text-[25px] leading-[32px]"
          }`}
        >
          {money(plan.kobo)}
        </span>
        <span className="text-[11px] font-semibold text-ash">/Monthly</span>
      </span>
      <span
        className={`grid place-items-center rounded-[10px] font-semibold ${
          mobile
            ? `mt-[14px] h-[44px] w-full text-[14px] ${active ? "bg-btn text-mint" : "border border-clyse text-ink"}`
            : `mt-[20px] h-[46px] w-full text-[16px] ${active ? "bg-btn text-mint" : "border border-clyse text-ink"}`
        }`}
      >
        Select
      </span>
    </button>
  );
}

function readDraft() {
  try {
    const raw = sessionStorage.getItem("clyse-draft");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CreatePlan() {
  /* Router state first, then the draft CreateGroup mirrors into sessionStorage —
     without it a refresh or a deep link landed on "No plans available". */
  const incoming = useLocation().state || readDraft() || null;
  const services = useCatalogue();
  const [sel, setSel] = useState(0);

  const custom = !!incoming?.custom;
  /* No service in the state (deep link / refresh before step 1 finished) used
     to render "No plans available". Fall back to the first service that
     actually has a priced plan so the step is never empty. */
  const entry = !custom
    ? matchService(services, incoming?.brand) ||
      (services || []).find((a) => (a.plans || a.catalogue_plans || []).some((p) => Number.isFinite(planTotal(p)))) ||
      null
    : null;
  const livePlans = entry?.plans || entry?.catalogue_plans || [];

  /* Only plans that carry a price are offered. `planTotal` returns Infinity
     when the catalogue row has no total, and that used to be printed as
     "N—/Monthly" — a plan you could select but never pay for. */
  const pricedPlans = livePlans
    .map((p) => ({
      id: p.id ?? p.plan_id ?? p.uuid ?? null,
      name: p.name || p.plan_name || "Plan",
      desc: p.description || p.features_label || p.tagline || "",
      kobo: planTotal(p),
      raw: p,
    }))
    .filter((p) => p.id && Number.isFinite(p.kobo));

  /* Custom subscription: the owner typed the monthly price on step 1, so that
     is the plan. Nothing here invents a price. */
  const customPlan = {
    id: null,
    name: incoming?.custom?.plan || "Custom plan",
    desc: "",
    kobo:
      incoming?.custom?.priceKobo != null &&
      Number.isFinite(incoming.custom.priceKobo)
        ? incoming.custom.priceKobo
        : null,
    raw: null,
  };

  const plans = custom ? [customPlan] : pricedPlans;
  const loading = !custom && services === null;

  const chosen = plans[Math.min(sel, Math.max(plans.length - 1, 0))] || null;
  const title = incoming?.custom?.name || incoming?.title || "subscription";
  const nextState = {
    ...(incoming || {}),
    planId: chosen?.id ?? null,
    unit: chosen?.kobo ?? null,
  };

  useEffect(() => {
    if (!chosen) return;
    try {
      const base = readDraft() || {};
      sessionStorage.setItem(
        "clyse-draft",
        JSON.stringify({ ...base, planId: chosen.id ?? null, unit: chosen.kobo ?? null }),
      );
    } catch {}
  }, [chosen?.id, chosen?.kobo]);

  const cards = (mobile) => (
    <div
      className={
        mobile
          ? "mt-[26px] flex flex-col gap-[14px]"
          : "mt-[60px] grid grid-cols-3 gap-[30px]"
      }
    >
      {loading &&
        [0, 1, 2].map((i) => (
          <div
            key={`plan-loading-${i}`}
            className={
              mobile
                ? "h-[130px] w-full animate-pulse rounded-[16px] bg-[#EDF3ED]"
                : "h-[190px] animate-pulse rounded-[16px] bg-[#EDF3ED]"
            }
          />
        ))}
      {plans.map((p, i) => (
        <PlanCard
          key={`${p.id}-${i}`}
          plan={p}
          active={i === sel}
          onPick={() => setSel(i)}
          mobile={mobile}
        />
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[linear-gradient(180deg,#E4F6E5_0%,#EFFAF0_240px,#FBFEFB_420px)] font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />

      {/* Desktop */}
      <main className="relative z-10 mx-[100px] mt-[100px] hidden xl:block">
        <div className="rounded-[20px] bg-white px-[63px] pt-[30px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.08)]">
        <StepHeader step={2} />
        <h2 className="mt-[50px] text-[35px] leading-[43px] font-semibold">
          Choose your {title} plan
        </h2>
        <p className="mt-[10px] text-[18px] leading-[24px] text-ash">
          Pick the access level you want to buy. You can change this before
          joining a group
        </p>
        {cards(false)}
        {!plans.length && (
          <p className="mt-[40px] text-[18px] font-semibold text-ash">
            {loading
              ? "Loading plans…"
              : custom
                ? "Custom subscriptions need an approved catalogue plan before a group can go live. Go back and pick a subscription instead."
                : "No plans available for this subscription yet."}
          </p>
        )}
        <div className="mx-auto mt-[50px] flex w-[990px] items-center justify-center gap-[50px]">
          <Link
            to="/create-group"
            className="grid h-[60px] w-[470px] place-items-center rounded-2xl border border-clyse text-[18px] font-semibold text-ink"
          >
            Go Back
          </Link>
          {chosen?.id ? (
            <Link
              to="/create-group/details"
              state={nextState}
              className="grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint"
            >
              Continue
            </Link>
          ) : (
            <span className="grid h-[60px] w-[470px] place-items-center rounded-2xl bg-[#EDF3ED] text-[18px] font-semibold text-[#8A9A8D]">
              Choose a plan
            </span>
          )}
        </div>
        <div className="pb-[150px]" />
        </div>
      </main>

      {/* Mobile */}
      <main className="relative bg-white xl:hidden">
        <div className="relative px-[30px] pt-[40px]">
          <StepHeader step={2} />
          <h2 className="mt-[34px] text-[22px] leading-[27px] font-semibold">
            Choose your {title} plan
          </h2>
          <p className="mt-[8px] text-[13px] leading-[19px] text-ash">
            Pick the access level you want to buy. You can change this before
            joining a group
          </p>
          {cards(true)}
          {!plans.length && (
            <p className="mt-[24px] text-[13px] font-semibold text-ash">
              {services === null
                ? "Loading plans…"
                : "No plans available for this subscription yet."}
            </p>
          )}
          <div className="mt-[30px] mb-[40px] flex items-center gap-[14px]">
            <Link
              to="/create-group"
              className="grid h-[50px] flex-1 place-items-center rounded-xl border border-clyse text-[15px] font-semibold text-ink"
            >
              Go Back
            </Link>
            <Link
              to="/create-group/details"
              state={nextState}
              className="grid h-[50px] flex-1 place-items-center rounded-xl bg-btn text-[15px] font-semibold text-mint"
            >
              Continue
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
