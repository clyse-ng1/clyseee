import { useNavigate } from "react-router-dom";
import iconUserHead from "../assets/icon-user-head.svg";

/* Group-creation step header — desktop: 50px #B1DBB3 icon + 35/700 title +
   25/600 step + 1114x15 progress (fill = step/5). Mobile step 1 uses the
   0.6476 scale family (32px icon, 22.67/16.19), steps 2-4 use 0.6935
   (35px icon, 24.27/17.34); progress 370x10. */
const MOBILE = {
  1: { icon: 32, iconX: 30, textX: 75, title: 22.67, titleLh: 27.63, step: 16.19, stepLh: 22.67, glyph: 17, mt: 80, pmt: 51 },
  2: { icon: 35, iconX: 44, textX: 92, title: 24.27, titleLh: 29.59, step: 17.34, stepLh: 24.27, glyph: 18, mt: 71, pmt: 57 },
  3: { icon: 35, iconX: 30, textX: 79, title: 24.27, titleLh: 29.59, step: 17.34, stepLh: 24.27, glyph: 18, mt: 100, pmt: 52 },
  4: { icon: 35, iconX: 30, textX: 79, title: 24.27, titleLh: 29.59, step: 17.34, stepLh: 24.27, glyph: 18, mt: 100, pmt: 57 },
  5: { icon: 35, iconX: 30, textX: 79, title: 24.27, titleLh: 29.59, step: 17.34, stepLh: 24.27, glyph: 18, mt: 100, pmt: 57 },
};

/* Steps 2-4 get a Back control. Step 1 does not: it is the first screen of the
   flow, so "back" there means leaving the flow, not undoing a step.
   Forward is deliberately not added — the "Continue" CTA at the bottom of every
   step already is the forward action, and a second control that advances would
   let people walk past a step's validation (details, or the proof uploads).
   The block uses a negative top margin equal to its own height, so adding it
   does not move the step header or anything below it. */
const PREV = { 2: "/create-group", 3: "/create-group/plan", 4: "/create-group/details", 5: "/create-group/verify" };

function Chevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m14.5 5.5-7 6.5 7 6.5"
        stroke="#001701"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function StepHeader({ step }) {
  const m = MOBILE[step] || MOBILE[1];
  const nav = useNavigate();

  /* nav(-1) keeps the flow's route state (plan, slots, chosen proofs) intact.
     A direct link has no history to pop, so fall back to the previous step. */
  const goBack = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === "number" && idx > 0) nav(-1);
    else nav(PREV[step] || "/create-group", { replace: true });
  };

  const backD =
    step >= 2 ? (
      <div className="-mt-[59px] mb-[24px]">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back to the previous step"
          className="flex items-center gap-[11px] text-[18px] font-semibold text-ink"
        >
          <span className="grid h-[35px] w-[35px] place-items-center rounded-full bg-white shadow-[0_0_7px_rgba(0,23,1,0.18)]">
            <Chevron />
          </span>
          Back
        </button>
      </div>
    ) : null;

  const backM =
    step >= 2 ? (
      <div className="-mt-[52px] mb-[22px] ml-[30px] xl:hidden">
        <button
          type="button"
          onClick={goBack}
          aria-label="Go back to the previous step"
          className="flex items-center gap-[8px] text-[13px] font-semibold text-ink"
        >
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full bg-white shadow-[0_0_6px_rgba(0,23,1,0.18)]">
            <Chevron />
          </span>
          Back
        </button>
      </div>
    ) : null;

  return (
    <>
      {/* Desktop */}
      <div className="hidden pb-[31px] xl:block">
        {backD}
        <div className="flex items-center">
          <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-[10px] bg-[#B1DBB3]">
            <img src={iconUserHead} alt="" className="h-[31px] w-[27px]" />
          </span>
          <span className="ml-[20px]">
            <span className="block text-[35px] leading-[43px] font-bold text-ink">
              Create Group
            </span>
            <span className="block text-[25px] leading-[35px] font-semibold text-ash">
              Step {step}/5
            </span>
          </span>
        </div>
        <div className="mt-[50px] h-[15px] w-full rounded-full bg-[#B1DBB3]">
          <div
            className="h-[15px] rounded-full bg-clyse"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="xl:hidden" style={{ marginTop: m.mt }}>
        {backM}
        <div className="flex items-center" style={{ marginLeft: m.iconX }}>
          <span
            className="grid flex-none place-items-center bg-[#B1DBB3]"
            style={{
              width: m.icon,
              height: m.icon,
              borderRadius: m.icon === 32 ? 6.48 : 6.94,
            }}
          >
            <img src={iconUserHead} alt="" style={{ width: m.glyph }} />
          </span>
          <span style={{ marginLeft: m.textX - m.iconX - m.icon }}>
            <span
              className="block font-bold text-ink"
              style={{ fontSize: m.title, lineHeight: `${m.titleLh}px` }}
            >
              Create Group
            </span>
            <span
              className="block font-semibold text-ash"
              style={{ fontSize: m.step, lineHeight: `${m.stepLh}px` }}
            >
              Step {step}/5
            </span>
          </span>
        </div>
        <div
          className="mx-[30px] h-[10px] rounded-full bg-[#B1DBB3]"
          style={{ marginTop: m.pmt }}
        >
          <div
            className="h-[10px] rounded-full bg-clyse"
            style={{ width: `${Math.min(100, (step / 5) * 100)}%` }}
          />
        </div>
      </div>
    </>
  );
}
