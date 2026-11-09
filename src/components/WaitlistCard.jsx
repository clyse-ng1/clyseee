import { useState } from "react";
import { Link } from "react-router-dom";
import BrandTile from "./BrandTile";
import Sk from "./Skeleton";
import iconUsers from "../assets/stat-users.svg";
import iconDate from "../assets/stat-date.svg";
import iconBell from "../assets/notif-bell-sm.svg";

/* My-waitlist entry card. Desktop 830x258: brand + title + pill left, two
   stat slots right, Leave + notification row below. Mobile stacks the same
   pieces full-bleed (stat slot 1 reads Total/12 People instead of #4).
   Card 6 is "Poitfy Premium" in Figma — corrected to Spotify Premium, since
   it carries Spotify's green tile + arcs icon. */
function Slot({ icon, label, value }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-[10px] xl:w-[190px] xl:flex-none xl:pl-[11px]">
      <img src={icon} alt="" className="h-[18px] w-[18px] flex-none xl:h-[20px] xl:w-[20px]" />
      <div className="min-w-0">
        <p className="text-[13px] leading-[16px] font-semibold text-[#6B6B6B]">
          {label}
        </p>
        <p className="mt-[2px] text-[16px] leading-[20px] font-semibold break-words text-ink xl:mt-[10px] xl:text-[18px] xl:leading-[22px]">
          {value}
        </p>
      </div>
    </div>
  );
}

export default function WaitlistCard({
  brand,
  title,
  posLabel,
  posValue,
  date,
  price,
  leaveState,
  createPlanId,
  notifOn,
  onNotifToggle,
}) {
  const [localOn, setLocalOn] = useState(true);
  const on = notifOn ?? localOn;
  const toggle = onNotifToggle || (() => setLocalOn((v) => !v));
  return (
    <article
      className={`w-full rounded-[20px] border border-[#BABABA] bg-white px-[20px] pt-[22px] pb-[22px] shadow-[0_0_20px_rgba(0,23,1,0.08)] xl:border-clyse xl:px-[31px] xl:pt-[31px] xl:pb-[31px] xl:w-[830px] ${
        createPlanId ? "" : "xl:h-[258px]"
      }`}
    >

      <div className="flex items-start gap-[16px] xl:items-center xl:gap-[31px]">
        <BrandTile brand={brand} size={75} plain />
        <div>
          <h3 className="text-[25px] leading-[28px] font-bold text-ink">
            {title}
          </h3>
          <p className="text-[13px] leading-[21px] font-semibold text-[#6B6B6B] xl:text-[18px] xl:leading-[22px]">
            {price || "\u2014"}
          </p>
          <p className="mt-[15px] grid h-[30px] w-[144px] place-items-center rounded-[10px] bg-[#DFFFE0] xl:mt-[16px]">
            <span className="text-[18px] leading-[22px] font-semibold text-clyse">
              On Waitlist
            </span>
          </p>
          {/* Figma 889:82683 has no "or create this group yourself" line. */}
        </div>
        <div className="ml-auto hidden gap-[2px] self-center xl:flex">
          <Slot icon={iconUsers} label={posLabel} value={posValue} />
          <Slot icon={iconDate} label="Date Joined" value={date} />
        </div>
      </div>
      <div className="mt-[16px] flex flex-col xl:mt-[30px] xl:flex-row xl:items-center xl:gap-[22px]">
        <Link
          to="/waitlist/leave"
          state={leaveState}
          className="flex h-[52px] w-full items-center justify-center gap-[10px] rounded-[10px] border border-[#047D0A] bg-white text-[16px] leading-[22px] font-semibold text-clyse xl:h-[60px] xl:w-[374px] xl:flex-none xl:text-[18px]"
        >
          {/* Figma 889:82683 puts the exit-arrow glyph inside the button. */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10"
              stroke="#048B0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M14 8l4 4-4 4M18 12H9"
              stroke="#048B0B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Leave Waitlist
        </Link>
        {/* Figma: two cells separated by a 1px rule, no filled strip. */}
        <div className="mt-[28px] flex xl:hidden">
          <div className="flex flex-1 items-center gap-[10px] border-l border-[#BABABA] pl-[12px]">
            <Slot icon={iconUsers} label={posLabel} value={posValue} />
          </div>
          <div className="flex flex-1 items-center gap-[10px] border-l border-[#BABABA] pl-[12px]">
            <Slot icon={iconDate} label="Date Joined" value={date} />
          </div>
        </div>
        <div className="mt-[14px] flex h-[44px] items-center xl:mt-0 xl:h-[60px]">
          <img src={iconBell} alt="" className="h-[24px] w-[24px] flex-none" />
          <span className="ml-[20px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            Group Notification
          </span>
          <span className="ml-[22px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            {on ? "On" : "Off"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={on}
            aria-label="Group notification"
            onClick={toggle}
            className={`relative ml-[9px] h-[22px] w-[48px] flex-none rounded-full transition ${
              on ? "bg-clyse" : "bg-[#D9D9D9]"
            }`}
          >
            <span
              className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white transition-all ${
                on ? "right-[3px]" : "left-[3px]"
              }`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
/* Loading stand-in for WaitlistCard rows (shimmer, never mock content). */
export function WaitlistCardSk() {
  return (
    <div
      aria-hidden
      className="w-full rounded-[20px] bg-white px-[31px] pt-[31px] pb-[31px] shadow-[0_0_20px_rgba(0,23,1,0.10)] xl:w-[830px]"
    >
      <div className="flex items-center gap-[43px] xl:gap-[31px]">
        <Sk className="h-[75px] w-[75px] flex-none !rounded-[18px]" />
        <div>
          <Sk className="h-[26px] w-[180px]" />
          <Sk className="mt-[8px] h-[18px] w-[130px]" />
          <Sk className="mt-[15px] h-[30px] w-[144px] !rounded-[10px]" />
        </div>
        <div className="ml-auto hidden gap-[2px] self-center xl:flex">
          <Sk className="h-[60px] w-[150px]" />
          <Sk className="h-[60px] w-[150px]" />
        </div>
      </div>
      <div className="mt-[40px] flex flex-col xl:mt-[30px] xl:flex-row xl:items-center xl:gap-[22px]">
        <Sk className="h-[60px] w-full !rounded-[10px] xl:w-[374px] xl:flex-none" />
        <Sk className="mt-[25px] h-[24px] w-[240px] xl:mt-0" />
      </div>
    </div>
  );
}
