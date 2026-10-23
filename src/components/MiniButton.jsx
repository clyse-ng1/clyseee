import { Link } from "react-router-dom";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconPlusWhite from "../assets/plus-white.svg";

/* 200x60 flow buttons (waitlist leave/error/empty). Gray carries the
   overlaid pair; red/dark carry the side-by-side pair. */
function OverlapPair() {
  return (
    <span className="absolute top-1/2 left-[27px] -translate-y-1/2">
      <img src={iconPlusWhite} alt="" className="h-[18px] w-[18px]" />
      <img
        src={iconFundArrow}
        alt=""
        className="absolute top-1/2 left-1/2 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2"
      />
    </span>
  );
}

function SidePair() {
  return (
    <span className="absolute top-1/2 left-[30px] flex -translate-y-1/2 items-center gap-[3px]">
      <img src={iconFundArrow} alt="" className="h-[15px] w-[15px]" />
      <img src={iconPlusWhite} alt="" className="h-[18px] w-[18px]" />
    </span>
  );
}

const STYLES = {
  gray: "bg-[#999999] text-white",
  red: "bg-[#E31B00] text-[#F1F8F1]",
  dark: "bg-btn text-[#F1F8F1]",
};

export default function MiniButton({ variant = "dark", to, onClick, busy, children, icons = true }) {
  const cls = `relative flex h-[60px] w-[200px] items-center justify-center rounded-[10px] text-[18px] leading-[22px] font-semibold ${STYLES[variant]} ${busy ? "opacity-60" : ""}`;
  const inner = (
    <>
      {icons && (variant === "gray" ? <OverlapPair /> : <SidePair />)}
      {busy ? "Please wait…" : children}
    </>
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} disabled={busy} className={cls}>
        {inner}
      </button>
    );
  }
  return (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  );
}
