import { useState } from "react";
import { Link } from "react-router-dom";
import BrandTile from "./BrandTile";
import iconExit from "../assets/exit.svg";
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
    <div className="flex w-[190px] flex-none pl-[11px]">
      <img src={icon} alt="" className="mt-[16px] h-[20px] w-[20px] flex-none" />
      <div className="ml-[20px]">
        <p className="text-[13px] leading-[16px] font-semibold text-[#6B6B6B]">
          {label}
        </p>
        <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-ink">
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
    <article className={`w-full rounded-[20px] bg-white px-[31px] pt-[31px] pb-[31px] shadow-[0_0_20px_rgba(0,23,1,0.10)] xl:w-[830px] ${createPlanId ? "" : "xl:h-[258px]"}`}>

      <div className="flex items-center gap-[43px] xl:gap-[31px]">
        <BrandTile brand={brand} size={75} plain />
        <div>
          <h3 className="text-[25px] leading-[28px] font-bold text-ink">
            {title}
          </h3>
          <p className="text-[13px] leading-[21px] font-semibold text-[#6B6B6B] xl:text-[18px] xl:leading-[22px]">
            {price || "N2000 / monthly"}
          </p>
          <p className="mt-[15px] grid h-[30px] w-[144px] place-items-center rounded-[10px] bg-[#DFFFE0] xl:mt-[16px]">
            <span className="text-[18px] leading-[22px] font-semibold text-clyse">
              On Waitlist
            </span>
          </p>
          {createPlanId && (
            <Link
              to="/create/group"
              state={{ fromWaitlist: { plan_id: createPlanId } }}
              className="mt-[8px] inline-block text-[14px] leading-[18px] font-semibold text-clyse underline"
            >
              or create this group yourself
            </Link>
          )}
        </div>
        <div className="ml-auto hidden gap-[2px] self-center xl:flex">
          <Slot icon={iconUsers} label={posLabel} value={posValue} />
          <Slot icon={iconDate} label="Date Joined" value={date} />
        </div>
      </div>
      <div className="mt-[40px] flex flex-col xl:mt-[30px] xl:flex-row xl:items-center xl:gap-[22px]">
        <Link
          to="/waitlist/leave"
          state={leaveState}
          className="flex h-[60px] w-full items-center justify-center gap-[5px] rounded-[10px] border border-[#047D0A] bg-white text-[18px] leading-[22px] font-semibold text-clyse xl:w-[374px] xl:flex-none"
        >
          <img src={iconExit} alt="" className="h-[25px] w-[25px]" />
          Leave Waitlist
        </Link>
        <div className="mt-[40px] flex gap-[2px] xl:hidden">
          <Slot icon={iconUsers} label="Total User Waiting" value="12 People" />
          <Slot icon={iconDate} label="Date Joined" value={date} />
        </div>
        <div className="mt-[25px] flex h-[60px] items-center xl:mt-0">
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
            className="relative ml-[9px] h-[18px] w-[70px] flex-none rounded-[12.5px] bg-[#D9D9D9]"
          >
            <span
              className={`absolute top-[2px] h-[14px] w-[14px] rounded-full bg-white transition-all ${
                on ? "right-[2px]" : "left-[2px]"
              }`}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
