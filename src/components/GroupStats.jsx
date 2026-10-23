import iconUsers from "../assets/stat-users.svg";
import iconNaira from "../assets/naira-green.svg";

/* My Group stat trio: Total Group / Total Member / Monthly Earning.
   White 156px cards r10, 42px tinted tile (users/users/naira glyphs),
   label 18 grey + value 25 ink. Widths differ per page (G2: 243/274/274,
   G3 in-card: 236/236/236) and arrive as responsive pairs. Mobile: 117px
   cards, 25px tile, label 13 + value 18. Pass `values` to override the
   Figma sample numbers. */
const STATS = [
  { label: "Total Group", value: "13", chip: "bg-[#DFFFE0]", icon: iconUsers },
  { label: "Total Member", value: "123", chip: "bg-[#FFE5D3]", icon: iconUsers },
  { label: "Monthly Earning", value: "N42,000", chip: "bg-[#E6E4FF]", icon: iconNaira },
];

export default function GroupStats({
  widths = ["w-[117px] xl:w-[243px]", "w-[117px] xl:w-[274px]", "w-[117px] xl:w-[274px]"],
  className = "",
  values,
}) {
  const stats = STATS.map((s, i) => ({ ...s, value: values?.[i] ?? s.value }));
  return (
    <div className={`flex gap-[10px] xl:gap-[20px] ${className}`}>
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`h-[117px] flex-none rounded-[10px] bg-white px-[21px] pt-[21px] shadow-[0_0_20px_rgba(0,23,1,0.10)] xl:h-[156px] ${widths[i] || "w-[117px] xl:w-[243px]"}`}
        >
          <span className={`grid h-[25px] w-[25px] place-items-center rounded-[5px] xl:h-[42px] xl:w-[42px] ${s.chip}`}>
            <img src={s.icon} alt="" className="h-[18px] w-[18px] xl:h-[30px] xl:w-[30px]" />
          </span>
          <p className="mt-[5px] text-[13px] leading-[20px] font-semibold whitespace-nowrap text-[#6B6B6B] xl:mt-[15px] xl:text-[18px] xl:leading-[22px]">
            {s.label}
          </p>
          <p className="mt-[2px] text-[18px] leading-[22px] font-bold whitespace-nowrap text-ink xl:mt-0 xl:text-[25px] xl:leading-[30px]">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}
