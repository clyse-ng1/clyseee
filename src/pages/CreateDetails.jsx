import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import StepHeader from "../components/StepHeader";
import { matchService, pickPlan, useCatalogue } from "../lib/useCatalogue";
import iconFaMinus from "../assets/icon-fa-minus.svg";
import iconFaPlus from "../assets/icon-fa-plus.svg";
import iconRadio from "../assets/icon-radio.svg";
import iconRadioOff from "../assets/icon-radio-off.svg";
import iconVisToggle from "../assets/icon-vis-toggle.svg";

/* Step 2 — group details. Stepper is live (amount = slots x unit price) and
   the access radios swap black/grey exactly as drawn in Figma. The visibility
   options are tappable (needed for the API); the highlight ring is an
   addition. Unit price and slot cap go live from the catalogue plan. */
const ACCESS = ["Clyse secure payment", "Direct payment to owner", "Other method"];

function VisOption({ icon, title, sub, selected, onSelect, mobile = false }) {
  const inner = (
    <>
      <img
        src={icon}
        alt=""
        className={mobile ? "h-[26px] w-[28px]" : "h-[38px] w-[41px]"}
      />
      <span>
        <span
          className={
            mobile
              ? "block text-[18px] leading-[22px] font-semibold"
              : "block text-[25px] leading-[35px] font-semibold"
          }
        >
          {title}
        </span>
        <span
          className={
            mobile
              ? "block text-[15px] leading-[18px] font-semibold text-[#6B6B6B]"
              : "block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]"
          }
        >
          {sub}
        </span>
      </span>
    </>
  );
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex items-center gap-[13px] rounded-2xl px-[10px] py-[6px] ${
        selected ? "ring-2 ring-clyse" : ""
      } ${mobile ? "" : ""}`}
    >
      {inner}
    </button>
  );
}

export default function CreateDetails() {
  const incoming = useLocation().state || null;
  const services = useCatalogue();
  const entry = incoming?.brand ? matchService(services, incoming.brand) : null;
  const plans = entry?.plans || entry?.catalogue_plans || [];
  const requestedPlanId = incoming?.planId || incoming?.fromWaitlist?.plan_id;
  const [selectedPlanId, setSelectedPlanId] = useState(requestedPlanId ? String(requestedPlanId) : "");
  const plan =
    plans.find((candidate) => String(candidate.id || candidate.plan_id || "") === selectedPlanId) ||
    plans.find((candidate) => String(candidate.id || candidate.plan_id || "") === String(requestedPlanId || "")) ||
    pickPlan(entry);

  const unit = plan?.unit_price_kobo ?? plan?.total_price_kobo ?? plan?.total_kobo ?? null;
  const capacity = plan?.member_slot_capacity ?? plan?.capacity ?? null;
  const max = Number.isFinite(Number(capacity)) && Number(capacity) > 0 ? Math.min(5, Number(capacity)) : 0;

  const [slots, setSlots] = useState(3);
  const [access, setAccess] = useState(0);
  const [vis, setVis] = useState("public");
  const shown = max ? Math.min(slots, max) : 0;
  const canContinue = Boolean(plan && (plan.id || plan.plan_id) && unit != null && max > 0 && incoming?.brand);
  const amount = canContinue ? `₦${Math.round((shown * unit) / 100).toLocaleString("en-US")}` : "—";
  const unitLabel = unit != null ? Math.round(unit / 100).toLocaleString("en-US") : "—";

  const nextState = canContinue
    ? {
        ...incoming,
        slots: shown,
        visibility: vis,
        access,
        planId: plan.id || plan.plan_id,
        unit,
      }
    : null;

  if (!incoming) return <Navigate to="/create-group" replace />;
  if (incoming.custom) return <Navigate to="/subscription-requests/new" replace />;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-auto mt-[60px] hidden w-[calc(100%-40px)] max-w-[1240px] xl:block">
        <StepHeader step={2} />
        <h2 className="mt-[50px] text-center text-[35px] leading-[43px] font-bold">
          Group Details
        </h2>
        <p className="mt-[30px] text-center text-[35px] leading-[43px] font-semibold">
          How many slots do you want to share?
        </p>
        {plans.length > 1 && (
          <label className="mx-auto mt-[20px] block max-w-[600px] text-[16px] font-semibold">
            Plan
            <select
              value={plan?.id || plan?.plan_id || ""}
              onChange={(event) => setSelectedPlanId(event.target.value)}
              className="mt-[8px] block h-[48px] w-full rounded-[10px] border border-[#57A35B] bg-white px-[12px] text-[16px]"
            >
              {plans.map((candidate, index) => (
                <option key={candidate.id || candidate.plan_id || index} value={candidate.id || candidate.plan_id || ""}>
                  {candidate.name || candidate.plan_name || `Plan ${index + 1}`} · ₦{Math.round(((candidate.unit_price_kobo ?? candidate.total_price_kobo ?? candidate.total_kobo ?? 0) / 100)).toLocaleString("en-US")}
                </option>
              ))}
            </select>
          </label>
        )}
        {services !== null && !canContinue && (
          <p role="alert" className="mx-auto mt-[20px] max-w-[800px] text-center text-[16px] font-semibold text-[#9A3412]">
            This service has no valid catalogue plan and capacity yet. Please choose another service or submit a subscription request.
          </p>
        )}
        <div className="mt-[20px] min-h-[250px] rounded-[30px] bg-white px-[30px] pt-[30px] pb-[25px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
          <div className="flex h-[77px] items-center rounded-[10px] bg-[#E6E6E6] px-[10px]">
            <button
              type="button"
              aria-label="Fewer slots"
              onClick={() => setSlots((s) => Math.max(1, s - 1))}
              className="h-[50px] w-[50px] flex-none disabled:opacity-40"
              disabled={shown <= 1}
            >
              <img src={iconFaMinus} alt="" className="h-[50px] w-[50px]" />
            </button>
            <span className="flex-1 text-center text-[45px] leading-[55px] font-bold">
              {shown}
            </span>
            <button
              type="button"
              aria-label="More slots"
              onClick={() => setSlots((s) => Math.min(max, s + 1))}
              className="h-[50px] w-[50px] flex-none disabled:opacity-40"
              disabled={shown >= max}
            >
              <img src={iconFaPlus} alt="" className="h-[50px] w-[50px]" />
            </button>
          </div>
          <p className="mt-[15px] text-[25px] leading-[35px] font-semibold text-[#6B6B6B]">
            Total slots: {capacity ?? "Unavailable"}
          </p>
          <div className="mt-[20px] flex items-start justify-between">
            <p className="text-[35px] leading-[43px] font-semibold">
              Pricing (Fixed by Clyse)
            </p>
            <p className="text-[25px] leading-[35px] font-semibold text-[#6B6B6B]">
              &#8358;{unitLabel}/ per month
            </p>
          </div>
        </div>

        <p className="mt-[30px] text-[35px] leading-[43px] font-semibold">
          How do members get access?
        </p>
        <div className="mt-[30px] space-y-[16px]">
          {ACCESS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setAccess(i)}
              className="flex items-center gap-[11px]"
            >
              <img
                src={access === i ? iconRadio : iconRadioOff}
                alt=""
                className="h-[25px] w-[25px]"
              />
              <span className="text-[25px] leading-[35px] font-semibold">{label}</span>
            </button>
          ))}
        </div>

        <p className="mt-[35px] text-[35px] leading-[43px] font-semibold">
          Group Visibility
        </p>
        <div className="mt-[32px] flex flex-wrap gap-x-[30px] gap-y-[18px]">
          <div className="flex min-w-[330px] items-center gap-[13px]">
            <VisOption
              icon={iconVisToggle}
              title="Public"
              sub="Group is visible to members"
              selected={vis === "public"}
              onSelect={() => setVis("public")}
            />
          </div>
          <div className="flex items-center gap-[13px]">
            <VisOption
              icon={iconVisToggle}
              title="Private"
              sub="Only invited members can join"
              selected={vis === "private"}
              onSelect={() => setVis("private")}
            />
          </div>
        </div>

        <div className="mt-[42px] flex items-start justify-between gap-[20px]">
          <p className="text-[25px] leading-[35px] font-semibold">
            Amount you&apos;ll get by the end
          </p>
          <p className="text-[35px] leading-[43px] font-semibold">{amount}</p>
        </div>
        {canContinue ? (
          <Link
            to="/create-group/verify"
            state={nextState}
            className="mx-auto mt-[32px] grid h-[60px] w-full max-w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint"
          >
            Continue
          </Link>
        ) : (
          <button type="button" disabled className="mx-auto mt-[32px] grid h-[60px] w-full max-w-[470px] cursor-not-allowed place-items-center rounded-2xl bg-[#B8C4B8] text-[18px] font-semibold text-white">
            Continue
          </button>
        )}
        <div className="pb-[60px]" />
      </main>

      {/* Mobile */}
      <main className="relative z-10 pb-[40px] xl:hidden">
        <StepHeader step={2} />
        <h2 className="ml-[30px] mt-[34px] text-[24.27px] leading-[29.59px] font-bold">
          Group Details
        </h2>
        <p className="ml-[30px] mt-[28px] text-[22px] leading-[27px] font-semibold">
          How many slots do you want to share?
        </p>
        {plans.length > 1 && (
          <label className="mx-[30px] mt-[18px] block text-[14px] font-semibold">
            Plan
            <select
              value={plan?.id || plan?.plan_id || ""}
              onChange={(event) => setSelectedPlanId(event.target.value)}
              className="mt-[6px] block h-[44px] w-full rounded-[9px] border border-[#57A35B] bg-white px-[10px] text-[14px]"
            >
              {plans.map((candidate, index) => (
                <option key={candidate.id || candidate.plan_id || index} value={candidate.id || candidate.plan_id || ""}>
                  {candidate.name || candidate.plan_name || `Plan ${index + 1}`} · ₦{Math.round(((candidate.unit_price_kobo ?? candidate.total_price_kobo ?? candidate.total_kobo ?? 0) / 100)).toLocaleString("en-US")}
                </option>
              ))}
            </select>
          </label>
        )}
        {services !== null && !canContinue && (
          <p role="alert" className="mx-[30px] mt-[14px] text-[13px] font-semibold text-[#9A3412]">
            No valid catalogue plan and capacity is available for this service yet.
          </p>
        )}
        <div className="mx-[30px] mt-[30px] min-h-[210px] rounded-[20.8px] bg-white px-[22px] pt-[22px] pb-[18px] shadow-[0_0_13.87px_rgba(0,23,1,0.10)]">
          <div className="flex h-[54px] items-center rounded-[6.9px] bg-[#E6E6E6] px-[6px]">
            <button
              type="button"
              aria-label="Fewer slots"
              onClick={() => setSlots((s) => Math.max(1, s - 1))}
              className="h-[35px] w-[35px] flex-none disabled:opacity-40"
              disabled={shown <= 1}
            >
              <img src={iconFaMinus} alt="" className="h-[35px] w-[35px]" />
            </button>
            <span className="flex-1 text-center text-[31.2px] leading-[38px] font-bold">
              {shown}
            </span>
            <button
              type="button"
              aria-label="More slots"
              onClick={() => setSlots((s) => Math.min(max, s + 1))}
              className="h-[35px] w-[35px] flex-none disabled:opacity-40"
              disabled={shown >= max}
            >
              <img src={iconFaPlus} alt="" className="h-[35px] w-[35px]" />
            </button>
          </div>
          <p className="mt-[10px] text-[17.34px] leading-[24px] font-semibold text-[#6B6B6B]">
            Total slots: {capacity ?? "Unavailable"}
          </p>
          <p className="mt-[14px] text-[24.27px] leading-[30px] font-semibold">
            Pricing (Fixed by Clyse)
          </p>
          <p className="mt-[5px] text-[17.34px] leading-[24px] font-semibold text-[#6B6B6B]">
            &#8358;{unitLabel}/ per month
          </p>
        </div>

        <p className="ml-[30px] mt-[21px] text-[22px] leading-[27px] font-bold">
          How do members get access?
        </p>
        <div className="ml-[53px] mt-[35px] space-y-[15px]">
          {ACCESS.map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => setAccess(i)}
              className="flex items-center gap-[9px]"
            >
              <img
                src={access === i ? iconRadio : iconRadioOff}
                alt=""
                className="h-[17px] w-[17px]"
              />
              <span className="text-[17.34px] leading-[24px] font-semibold">
                {label}
              </span>
            </button>
          ))}
        </div>

        <p className="ml-[30px] mt-[43px] text-[22px] leading-[27px] font-bold">
          Group Visibility
        </p>
        <div className="mt-[30px] flex flex-col gap-[16px] px-[30px]">
          <VisOption
            icon={iconVisToggle}
            title="Public"
            sub="Group is visible to members"
            selected={vis === "public"}
            onSelect={() => setVis("public")}
            mobile
          />
          <VisOption
            icon={iconVisToggle}
            title="Private"
            sub="Only invited members can join"
            selected={vis === "private"}
            onSelect={() => setVis("private")}
            mobile
          />
        </div>

        <div className="mt-[35px] flex items-center justify-between gap-[12px] px-[30px]">
          <p className="text-[15px] leading-[20px] font-semibold">
            Amount you&apos;ll get by the end
          </p>
          <p className="shrink-0 text-[24.27px] leading-[30px] font-semibold">
            {amount}
          </p>
        </div>
        {canContinue ? (
          <Link
            to="/create-group/verify"
            state={nextState}
            className="mx-auto mt-[28px] grid h-[50px] w-[calc(100%-60px)] max-w-[370px] place-items-center rounded-[10.36px] bg-btn text-[12.48px] font-semibold text-mint"
          >
            Continue
          </Link>
        ) : (
          <button type="button" disabled className="mx-auto mt-[28px] grid h-[50px] w-[calc(100%-60px)] max-w-[370px] cursor-not-allowed place-items-center rounded-[10.36px] bg-[#B8C4B8] text-[12.48px] font-semibold text-white">
            Continue
          </button>
        )}
      </main>
    </div>
  );
}
