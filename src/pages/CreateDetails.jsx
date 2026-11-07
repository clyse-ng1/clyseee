import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import StepHeader from "../components/StepHeader";
import { matchService, pickPlan, useCatalogue } from "../lib/useCatalogue";
import iconFaMinus from "../assets/icon-fa-minus.svg";
import iconFaPlus from "../assets/icon-fa-plus.svg";
import iconRadio from "../assets/icon-radio.svg";
import iconRadioOff from "../assets/icon-radio-off.svg";
import iconAudience from "../assets/figma/icon-audience.svg";

/* Step 2 — group details. Stepper is live (amount = slots x unit price) and
   the access radios swap black/grey exactly as drawn in Figma. The visibility
   options are tappable (needed for the API); the highlight ring is an
   addition. Unit price and slot cap go live from the catalogue plan. */
const ACCESS = [
  "Clyse secure payment",
  "Direct payment to owner",
  "Other method",
];

function VisOption({ icon, title, sub, selected, onSelect, mobile = false }) {
  const inner = (
    <>
      <img
        src={icon}
        alt=""
        className={mobile ? "h-[26px] w-[26px]" : "h-[50px] w-[50px]"}
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
      className={`flex items-center gap-[13px] rounded-[16px] border bg-white ${
        mobile ? "px-[12px] py-[9px]" : "w-[367px] px-[16px] py-[14px]"
      } ${selected ? "border-clyse" : "border-[#BABABA]"}`}
    >
      {inner}
    </button>
  );
}

export default function CreateDetails() {
  const incoming = useLocation().state || null;
  const services = useCatalogue();
  const plan =
    incoming && !incoming.custom
      ? pickPlan(matchService(services, incoming.brand))
      : null;
  const unit =
    incoming?.unit ?? plan?.unit_price_kobo ?? plan?.total_price_kobo ?? null;
  const capacity = plan?.member_slot_capacity ?? null;
  const max = capacity ? Math.min(5, capacity) : 5;

  const [slots, setSlots] = useState(3);
  const [access, setAccess] = useState(0);
  const [accessLink, setAccessLink] = useState(incoming?.accessLink || "");
  const [vis, setVis] = useState("public");
  const shown = Math.min(slots, max);
  const amount =
    unit == null
      ? "—"
      : `N${Math.round((shown * unit) / 100).toLocaleString("en-US")}`;
  const unitLabel =
    unit == null
      ? services === null && !incoming?.custom
        ? "Loading…"
        : "—"
      : Math.round(unit / 100).toLocaleString("en-US");

  const nextState = incoming
    ? {
        ...incoming,
        slots: shown,
        visibility: vis,
        access,
        accessLink: accessLink.trim() || null,
        planId: incoming.planId ?? plan?.id ?? null,
        unit,
      }
    : null;

  return (
    <div className="relative min-h-screen bg-[#F5FBF5] font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-[100px] mt-[100px] hidden xl:block">
        <StepHeader step={3} />
        <h2 className="mt-[50px] text-center text-[35px] leading-[43px] font-bold">
          Group Details
        </h2>
        <p className="mt-[50px] text-center text-[35px] leading-[43px] font-semibold">
          How many slots do you want to share?
        </p>
        <div className="mt-[20px] h-[250px] rounded-[30px] bg-white px-[30px] pt-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
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
            Total slots: {capacity || 5}
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
        <div className="mt-[50px] space-y-[20px]">
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
              <span className="text-[25px] leading-[35px] font-semibold">
                {label}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-[45px] text-[25px] leading-[35px] font-semibold">
          Provide Subscription Access Link
        </p>
        <input
          value={accessLink}
          onChange={(e) => setAccessLink(e.target.value)}
          placeholder="Paste your subscription access link here"
          aria-label="Subscription access link"
          className="mt-[18px] h-[60px] w-[760px] rounded-[10px] border border-[#BABABA] bg-white px-[20px] text-[18px] font-semibold text-ink outline-none placeholder:text-[#999999]"
        />

        <p className="mt-[60px] text-[35px] leading-[43px] font-semibold">
          Group Visibility
        </p>
        <div className="ml-[51px] mt-[66px] flex">
          <div className="flex w-[387px] items-center gap-[13px]">
            <VisOption
              icon={iconAudience}
              title="Public Group"
              sub="Anyone can find and join"
              selected={vis === "public"}
              onSelect={() => setVis("public")}
            />
          </div>
          <div className="flex items-center gap-[13px]">
            <VisOption
              icon={iconAudience}
              title="Private Group"
              sub="Only invited member can join"
              selected={vis === "private"}
              onSelect={() => setVis("private")}
            />
          </div>
        </div>

        <div className="mt-[77px] flex items-start justify-between">
          <p className="text-[25px] leading-[35px] font-semibold">
            Amount you&apos;ll get by the end
          </p>
          <p className="text-[35px] leading-[43px] font-semibold">{amount}</p>
        </div>
        <div className="mx-auto mt-[50px] flex w-[990px] items-center justify-center gap-[50px]">
          <Link
            to="/create-group/plan"
            className="grid h-[60px] w-[470px] place-items-center rounded-2xl border border-clyse text-[18px] font-semibold text-ink"
          >
            Go Back
          </Link>
          <Link
            to="/create-group/verify"
            state={nextState}
            className="grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint"
          >
            Continue
          </Link>
        </div>
        <div className="pb-[230px]" />
      </main>

      {/* Mobile */}
      <main className="relative z-10 xl:hidden">
        <StepHeader step={3} />
        <h2 className="ml-[30px] mt-[34px] text-[24.27px] leading-[29.59px] font-bold">
          Group Details
        </h2>
        <p className="ml-[30px] mt-[34px] text-[22px] leading-[27px] font-semibold">
          How many slots do you want to share?
        </p>
        <div className="mx-[30px] mt-[41px] h-[210px] rounded-[20.8px] bg-white px-[22px] pt-[22px] shadow-[0_0_13.87px_rgba(0,23,1,0.10)]">
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
            Total slots: {capacity || 5}
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

        <p className="ml-[30px] mt-[32px] text-[17.34px] leading-[24px] font-semibold">
          Provide Subscription Access Link
        </p>
        <input
          value={accessLink}
          onChange={(e) => setAccessLink(e.target.value)}
          placeholder="Paste your subscription access link here"
          aria-label="Subscription access link"
          className="mx-[30px] mt-[12px] h-[46px] w-[calc(100%-60px)] rounded-[8px] border border-[#BABABA] bg-white px-[14px] text-[12.48px] font-semibold text-ink outline-none placeholder:text-[#999999]"
        />

        <p className="ml-[30px] mt-[43px] text-[22px] leading-[27px] font-bold">
          Group Visibility
        </p>
        <div className="ml-[66px] mt-[47px] flex items-center gap-[10px]">
          <VisOption
            icon={iconAudience}
            title="Public Group"
            sub="Anyone can find and join"
            selected={vis === "public"}
            onSelect={() => setVis("public")}
            mobile
          />
        </div>
        <div className="ml-[66px] mt-[36px] flex items-center gap-[10px]">
          <VisOption
            icon={iconAudience}
            title="Private Group"
            sub="Only invited member can join"
            selected={vis === "private"}
            onSelect={() => setVis("private")}
            mobile
          />
        </div>

        <div className="mt-[56px] flex items-center justify-between px-[30px]">
          <p className="text-[17.34px] leading-[24px] font-semibold">
            Amount you&apos;ll get by the end
          </p>
          <p className="text-[24.27px] leading-[30px] font-semibold">
            {amount}
          </p>
        </div>
        <div className="mx-[30px] mt-[34px] flex items-center justify-center gap-[24px]">
          <Link
            to="/create-group/plan"
            className="grid h-[50px] place-items-center rounded-[10.36px] border border-clyse text-[12.48px] font-semibold text-ink flex-1"
          >
            Go Back
          </Link>
          <Link
            to="/create-group/verify"
            state={nextState}
            className="grid h-[50px] flex-1 place-items-center rounded-[10.36px] bg-btn text-[12.48px] font-semibold text-mint"
          >
            Continue
          </Link>
        </div>
        <div className="pb-[83px]" />
      </main>
    </div>
  );
}
