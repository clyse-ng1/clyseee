import { Link } from "react-router-dom";
import Sk from "./Skeleton";

/* Filter tab row (My Group / Member pages). First tab dark gradient +
   white text; rest white + ink text; hairline border (white-on-white).
   Optional green View All at right (desktop G2 only; mobile renders View All
   above the tabs). Mobile: 13px text, h42, first w69 rest w120, scroll-x.
   Tab widths arrive as responsive pairs (w-[120px] xl:w-[140px]).
   Pass `active` + `onSelect` to make the tabs filter. */
export default function GroupTabs({ tabs, viewAll = false, className = "", active = 0, onSelect = null, loading = false }) {
  if (loading) {
    return (
      <div className={`flex items-center ${className}`} aria-hidden>
        <div className="scrollbar-none flex gap-[10px] overflow-x-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <Sk
              key={i}
              className={`h-[42px] flex-none !rounded-[10px] xl:h-[54px] ${i === 0 ? "w-[69px] xl:w-[94px]" : "w-[120px] xl:w-[140px]"}`}
            />
          ))}
        </div>
      </div>
    );
  }
  const current = onSelect ? active : 0;
  return (
    <div className={`flex items-center gap-[16px] ${className}`}>
      <div className="scrollbar-none flex min-w-0 flex-1 gap-[10px] overflow-x-auto">
        {tabs.map((t, i) => {
          const dark = i === current;
          const shell = dark
            ? "bg-btn grid h-[42px] flex-none place-items-center rounded-[10px] px-[14px] xl:h-[54px] xl:px-[20px]"
            : "grid h-[42px] flex-none place-items-center rounded-[10px] border border-[#BABABA] bg-white px-[14px] xl:h-[54px] xl:px-[20px]";
          /* Auto width on both viewports: the fixed 140px chips clipped
             "Pending (0)" on a 430 screen. */
          const width = t.width || "";
          const inner = (
            <span
              className={`text-[13px] leading-[16px] font-semibold whitespace-nowrap xl:text-[18px] xl:leading-[22px] ${
                dark ? "text-white" : "text-ink"
              }`}
            >
              <span className="xl:hidden">{t.mLabel || t.label}</span>
              <span className="hidden xl:inline">{t.label}</span>
            </span>
          );
          return onSelect ? (
            <button
              key={t.label}
              type="button"
              onClick={() => onSelect(i)}
              className={`${shell} ${width} cursor-pointer`}
            >
              {inner}
            </button>
          ) : (
            <span key={t.label} className={`${shell} ${width}`}>
              {inner}
            </span>
          );
        })}
      </div>
      {viewAll && (
        <Link
          to="/groups/browse"
          className="hidden flex-none text-[18px] leading-[22px] font-bold text-clyse xl:block"
        >
          View All
        </Link>
      )}
    </div>
  );
}
