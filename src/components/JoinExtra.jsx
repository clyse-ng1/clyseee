import { Link } from "react-router-dom";
import iconArrowBadge from "../assets/extra-arrow-badge.svg";
import iconCirclePlus from "../assets/extra-circle-plus.svg";

/* Sidebar / tail-band "extra" rows (desktop + mobile). Figma 768:24019:
   white pill 310x58 r10, centred [label 16/19 semibold + 24px + dark round
   badge] unit; arrow badge 24 (filled circle, RIGHT arrow), plus badge 28. */
const ROWS = [
  {
    label: "View Available Group",
    trail: iconArrowBadge,
    trailCls: "h-[24px] w-[24px] xl:h-[25px] xl:w-[25px]",
    to: "/browse",
  },
  {
    label: "Create Group",
    trail: iconCirclePlus,
    trailCls: "h-[28px] w-[28px]",
    to: "/create-group",
  },
];

export default function JoinExtra({ width = "w-[310px]" }) {
  return (
    <>
      {ROWS.map((r) => (
        <Link
          key={r.label}
          to={r.to}
          className={`flex h-[58px] ${width} items-center justify-center gap-[24px] rounded-[10px] border border-clyse bg-white shadow-[0_0_7px_rgba(0,23,1,0.25)]`}
        >
          <span className="text-[16px] leading-[19px] font-semibold text-ink">
            {r.label}
          </span>
          <img src={r.trail} alt="" className={r.trailCls} />
        </Link>
      ))}
    </>
  );
}
