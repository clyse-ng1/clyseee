import iconUsers from "../assets/stat-users.svg";
import iconNaira from "../assets/naira-green.svg";
import Sk from "./Skeleton";

/* My Group stat trio: Total Group / Total Member / Monthly Earning.
   White 156px cards r10, 42px tinted tile (users/users/naira glyphs),
   label 18 grey + value 25 ink. Widths differ per page (G2: 243/274/274,
   G3 in-card: 236/236/236) and arrive as responsive pairs. Mobile: 117px
   cards, 25px tile, label 13 + value 18. Pass `values` to override the
   Figma sample numbers. */
/* Every tile is the same mint + green glyph. The trio used to be green /
   peach / lavender, which the PM flagged twice as inconsistent card design. */
const STATS = [
  { label: "Total Group", value: "13", chip: "bg-[#DFFFE0]", icon: iconUsers },
  { label: "Total Member", value: "123", chip: "bg-[#DFFFE0]", icon: iconUsers },
  { label: "Monthly Earning", value: "N42,000", chip: "bg-[#DFFFE0]", icon: iconNaira },
];

export default function GroupStats({
  widths = ["w-full xl:w-[243px]", "w-full xl:w-[274px]", "w-full xl:w-[274px]"],
  className = "",
  values,
}) {
  const stats = STATS.map((s, i) => ({ ...s, value: values?.[i] ?? null }));
  return (
    <div className={`grid grid-cols-3 gap-[10px] xl:flex xl:gap-[20px] ${className}`}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex h-[117px] min-w-0 flex-col rounded-[10px] border border-clyse bg-white px-[10px] pt-[16px] pb-[12px] shadow-[0_0_20px_rgba(0,23,1,0.10)] xl:h-[156px] xl:px-[21px] xl:pt-[21px] ${widths[i] || "w-full xl:w-[243px]"}`}
        >
          <span className={`grid h-[25px] w-[25px] place-items-center rounded-[5px] xl:h-[42px] xl:w-[42px] ${s.chip}`}>
            <img src={s.icon} alt="" className="h-[18px] w-[18px] xl:h-[30px] xl:w-[30px]" />
          </span>
          <p className="mt-[6px] text-[11px] leading-[14px] font-semibold text-[#6B6B6B] xl:mt-[15px] xl:whitespace-nowrap xl:text-[18px] xl:leading-[22px]">
            {s.label}
          </p>
          <p className="mt-[2px] text-[14px] leading-[18px] font-bold break-words text-ink xl:mt-0 xl:whitespace-nowrap xl:text-[25px] xl:leading-[30px]">
            {s.value ?? <Sk className="h-[18px] w-[70px] xl:h-[28px] xl:w-[110px]" />}
          </p>
        </div>
      ))}
    </div>
  );
}
