import { Link } from "react-router-dom";

/* Go Back (mint) + Continue (dark) button pair — join P2/P3/P7.
   Desktop 533 + 50 + 531, h60 r16, 18px. Mobile 176:174 ratio + 20 gap,
   h50 r10.36, 11.66px. "Contiue" fixed to "Continue". */
export default function PairButtons({
  backTo,
  backState,
  nextTo,
  nextState,
  nextLabel = "Continue",
  onNext,
  busy,
  className = "",
}) {
  const nextCls =
    "bg-btn flex h-[50px] flex-[174] items-center justify-center rounded-[10.36px] text-[11.66px] leading-[14px] font-semibold text-[#F1F8F1] xl:h-[60px] xl:w-[531px] xl:flex-none xl:rounded-[16px] xl:text-[18px] xl:leading-[22px]";
  return (
    <div className={`flex gap-[20px] xl:gap-[50px] ${className}`}>
      <Link
        to={backTo}
        state={backState}
        className="flex h-[50px] flex-[176] items-center justify-center rounded-[10.36px] border border-clyse bg-[#F1F8F1] text-[11.66px] leading-[14px] font-semibold text-ink xl:h-[60px] xl:w-[533px] xl:flex-none xl:rounded-[16px] xl:text-[18px] xl:leading-[22px]"
      >
        Go Back
      </Link>
      {onNext ? (
        <button type="button" onClick={onNext} disabled={busy} className={`${nextCls} ${busy ? "opacity-60" : ""}`}>
          {busy ? "Please wait…" : nextLabel}
        </button>
      ) : (
        <Link to={nextTo} state={nextState} className={nextCls}>
          {nextLabel}
        </Link>
      )}
    </div>
  );
}
