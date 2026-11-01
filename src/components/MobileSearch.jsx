import iconSearch from "../assets/icon-search.svg";

/* Mobile search bar — Figma 263:4402/263:4893 "Search Bar" (full-bleed 430x56,
   white + 1.39px #58A35B + shadow; chevron is off-canvas in Figma = omitted). */
export default function MobileSearch() {
  return (
    <button
      type="button"
      className="mt-[30px] flex h-[56px] w-full items-start rounded-[10.4px] border-[1.4px] border-[#58A35B] bg-white text-left shadow-[1.39px_1.39px_4.85px_rgba(0,23,1,0.25)]"
    >
      <img src={iconSearch} alt="" className="mt-[16px] ml-[22px] h-[31px] w-[31px]" />
      <span className="mt-[19px] ml-[27px] text-[17.34px] leading-[24.27px] font-semibold text-muted">
        Browse Subscription
      </span>
    </button>
  );
}
