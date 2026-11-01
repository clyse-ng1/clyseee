import { Link } from "react-router-dom";
import iconArrowLeft from "../assets/extra-arrow-left.svg";
import iconCirclePlus from "../assets/extra-circle-plus.svg";

/* Sidebar "extra" rows under the main menu (desktop + mobile). Centred
   [label + 20px + trailing icon] unit, 1px green border + shadow. The
   leading glyphs in Figma are leftover variant strays (a red error icon
   and an overflowing black check) — omitted. Arrow points left in Figma. */
const ROWS = [
  {
    label: "View Available Group",
    trail: iconArrowLeft,
    trailCls: "h-[30px] w-[30px] xl:h-[25px] xl:w-[25px]",
    to: "/groups",
  },
  {
    label: "Create Group",
    trail: iconCirclePlus,
    trailCls: "h-[30px] w-[30px] xl:h-[28px] xl:w-[28px]",
    to: "/create-group",
  },
];

export default function JoinExtra({ width = "w-[312px]" }) {
  return (
    <>
      {ROWS.map((r) => (
        <Link
          key={r.label}
          to={r.to}
          className={`flex h-[60px] ${width} items-center justify-center gap-[20px] rounded-[9.75px] border border-clyse bg-white shadow-[0_0_7px_rgba(0,23,1,0.25)]`}
        >
          <span className="text-[18px] leading-[22px] font-semibold text-ink">
            {r.label}
          </span>
          <img src={r.trail} alt="" className={r.trailCls} />
        </Link>
      ))}
    </>
  );
}
