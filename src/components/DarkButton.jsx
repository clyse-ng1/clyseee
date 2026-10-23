import { Link } from "react-router-dom";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconPlusWhite from "../assets/plus-white.svg";

/* Dark gradient button with the arrow+plus pair at left-30 and a centered
   label (join flow). Renders a Link when `to` is set, else a <button>. */
export default function DarkButton({ to, onClick, children, className = "" }) {
  const cls = `bg-btn relative flex h-[60px] items-center justify-center rounded-[10px] text-[18px] leading-[22px] font-semibold text-[#F1F8F1] ${className}`;
  const inner = (
    <>
      <span className="absolute top-1/2 left-[30px] flex -translate-y-1/2 items-center gap-[3px]">
        <img src={iconFundArrow} alt="" className="h-[15px] w-[15px]" />
        <img src={iconPlusWhite} alt="" className="h-[18px] w-[18px]" />
      </span>
      {children}
    </>
  );
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
