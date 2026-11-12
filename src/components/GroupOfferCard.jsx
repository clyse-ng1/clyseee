import { Link } from "react-router-dom";
import avatarAccount from "../assets/avatar-account.webp";

/* The group offer card exactly as Figma draws it (dashboard frame 481:10033,
   pixel-sampled): deep uniform green body with a subtle left-to-right lift
   (#011A02 -> #013203), avatar overhanging the top, DARK green contribution
   box (#19391A) with white text, brand-green slot-bar fill (#048B0B) on a #023303
   track, and a pale-mint Join button. One component is shared by Browse,
   Dashboard and any future list so the card never drifts between pages
   again. g = { avatar, name, service, price, pct (0-100), left, ratio,
   access, linkTo, linkState }. */

const CARD_BG =
  "linear-gradient(90deg, #011A02 0%, #012403 45%, #013203 100%) #012403";

function SlotIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="2.6" r="2" fill="currentColor" />
      <path d="M1 8.2c0-1.9 1.6-3.1 3.5-3.1S8 6.3 8 8.2H1Z" fill="currentColor" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <circle cx="3" cy="3" r="2.1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.4 4.4 8 8M6.2 6.2l1-1M7.2 7.2l1-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

export default function GroupOfferCard({ g, className = "" }) {
  const pct = g.pct == null ? 0 : Math.max(0, Math.min(100, g.pct));
  return (
    <article className={`relative w-full ${className}`}>
      <div
        className="rounded-[20px] px-[16px] pt-[39px] pb-[12px] xl:rounded-[16px] xl:px-[23px] xl:pt-[20px] xl:pb-[20px]"
        style={{ background: CARD_BG }}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={g.avatar || avatarAccount}
            alt=""
            className="-mt-[45px] h-[67px] w-[67px] rounded-full border-[2.5px] border-[#F1F8F2] object-cover xl:mt-0 xl:h-[74px] xl:w-[74px]"
          />
          <p className="mt-[6px] w-full truncate text-[15px] leading-[16px] font-bold text-white xl:mt-[8px] xl:text-[22px] xl:leading-[26px]">
            {g.name}
          </p>
          <p className="w-full truncate text-[8px] leading-[12.6px] font-semibold text-white xl:mt-[2px] xl:text-[11px] xl:leading-[16px]">
            Share <span className="text-[8px] font-bold xl:text-[13px]">{g.service}</span>
          </p>
        </div>

        <div className="mt-[10px] h-px w-full bg-[#7F8C80]/70 xl:mt-[12px]" />

        <div className="mt-[12px] flex h-[39px] flex-col justify-center rounded-[8px] bg-[#19391A] px-[10px] text-center xl:h-auto xl:py-[8px]">
          <p className="text-[6px] leading-[10px] font-semibold text-white xl:text-[9px] xl:leading-[12px]">
            Your Contribution
          </p>
          <p className="flex items-baseline justify-center gap-[2px]">
            <span className="text-[15px] leading-[18px] font-semibold text-white xl:text-[21px] xl:leading-[25px]">
              {g.price}
            </span>
            <span className="text-[8px] leading-[12px] font-semibold text-[#9FD8A3] xl:text-[10px] xl:leading-[16px]">
              /Monthly
            </span>
          </p>
        </div>

        <div className="mt-[7px] h-[4px] w-full overflow-hidden rounded-full bg-[#023303] xl:mt-[10px] xl:h-[6px]">
          <span
            className="block h-full rounded-full bg-[#048B0B]"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-[4px] flex items-center justify-between gap-[6px] text-[8px] leading-[12px] font-semibold text-[#F1F8F2] xl:mt-[8px] xl:text-[13px] xl:leading-[17px]">
          <span className="flex min-w-0 items-center gap-[3px]">
            <SlotIcon />
            <span className="truncate">{g.left}</span>
          </span>
          <span className="flex-none">{g.ratio}</span>
        </div>

        <div className="mt-[2px] flex items-center gap-[3px] text-white xl:mt-[6px] xl:gap-[6px]">
          <KeyIcon />
          <span className="flex-none text-[8px] leading-[12px] font-semibold whitespace-nowrap opacity-90 xl:text-[10px] xl:leading-[15px]">
            Access Method:
          </span>
          <span className="truncate text-[8px] leading-[12px] font-semibold xl:text-[11px] xl:leading-[15px]">
            {g.access || "Login Credential"}
          </span>
        </div>

        <Link
          to={g.linkTo || "/join"}
          state={g.linkState}
          className="mt-[12px] flex h-[22px] w-full items-center justify-center rounded-[8px] bg-[#EFFFF0] text-[11px] font-semibold text-[#001701] transition hover:bg-white xl:mt-[14px] xl:h-[38px] xl:text-[16px]"
        >
          Join
        </Link>
      </div>
    </article>
  );
}
