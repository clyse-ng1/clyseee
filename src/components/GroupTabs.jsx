/* Filter tab row (My Group / Member pages). First tab dark gradient +
   white text; rest white + ink text; hairline border (white-on-white).
   Optional green View All at right (desktop G2 only; mobile renders View All
   above the tabs). Mobile: 13px text, h42, first w69 rest w120, scroll-x.
   Tab widths arrive as responsive pairs (w-[120px] xl:w-[140px]).
   Pass `active` + `onSelect` to make the tabs filter. */
export default function GroupTabs({ tabs, viewAll = false, className = "", active = 0, onSelect = null }) {
  const current = onSelect ? active : 0;
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex gap-[10px] overflow-x-auto">
        {tabs.map((t, i) => {
          const dark = i === current;
          const shell = dark
            ? "bg-btn grid h-[42px] flex-none place-items-center rounded-[10px] px-[10px] xl:h-[54px]"
            : "grid h-[42px] flex-none place-items-center rounded-[10px] border border-[#E6E6E6] bg-white px-[10px] xl:h-[54px]";
          const width = t.width || (dark ? "w-[69px] xl:w-[94px]" : "w-[120px]");
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
        <span className="ml-[32px] hidden flex-none text-[25px] leading-[30px] font-bold text-clyse xl:block">
          View All
        </span>
      )}
    </div>
  );
}
