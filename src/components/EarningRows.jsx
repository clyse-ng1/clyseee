import { Link } from "react-router-dom";
import BrandTile from "./BrandTile";

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";
export const TX_DATE = "Sep 20, 2025 · 11:17 AM";

const PILL = {
  Successful: { bg: "bg-[#DFFFE0]", text: "text-clyse" },
  Pending: { bg: "bg-[#FDEED9]", text: "text-[#FF9400]" },
  "Pending ": { bg: "bg-[#DFFFE0]", text: "text-clyse" },
  Failed: { bg: "bg-[#FFDCDC]", text: "text-[#FF0000]" },
};

export function StatusPill({ status, small = false, h40 = false }) {
  const pill = PILL[status] || PILL.Successful;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[10px] ${pill.bg} ${
        small ? "h-[30px] w-[90px]" : h40 ? "h-[40px] w-[100px]" : "h-[37px] w-[100px]"
      }`}
    >
      <span className={`font-semibold whitespace-nowrap ${pill.text} ${small ? "text-[12px] leading-[15px]" : "text-[14px] leading-[17px]"}`}>
        {status}
      </span>
    </span>
  );
}

/* Mobile txn row (M17/M18): h114 r12 card, 40px tile + name/sub + amount,
   date + 101x28 pill below. CapCut tile draws no glyph (Figma's white
   glyph on #E6E6E6 is invisible). Desktop 770x111 table row. */
export function EarningTxRow({ brand, name, sub, mSub, earning, count, date, status }) {
  const pill = PILL[status] || PILL.Successful;
  return (
    <>
      <div className={`rounded-[12px] bg-white px-[21px] pt-[17px] pb-[17px] xl:hidden ${SHADOW}`}>
        <div className="flex">
          {brand === "capcut" ? (
            <span className="h-[40px] w-[40px] flex-none rounded-full bg-[#E6E6E6]" />
          ) : (
            <BrandTile brand={brand} size={40} plain />
          )}
          <span className="ml-[12px] min-w-0">
            <span className="block truncate text-[16px] leading-[20px] font-semibold text-black">
              {name}
            </span>
            <span className="block truncate text-[13px] leading-[20px] font-semibold text-[#66726C]">
              {mSub || "Group Subscription"}
            </span>
          </span>
          <span className="mt-[13px] ml-auto flex-none text-[16px] leading-[20px] font-semibold whitespace-nowrap text-[#6B6B6B]">
            {earning}
          </span>
        </div>
        <div className="mt-[12px] flex items-center justify-between gap-[12px]">
          <span className="truncate text-[13px] leading-[20px] font-semibold text-[#66726C]">
            {date}
          </span>
          <span className={`flex h-[28px] w-[101px] flex-none items-center justify-center rounded-[14px] ${pill.bg}`}>
            <span className={`text-[13px] leading-[16px] font-semibold whitespace-nowrap ${pill.text}`}>
              {status}
            </span>
          </span>
        </div>
      </div>
      <div className="hidden items-center bg-white xl:flex xl:h-[111px] xl:w-[770px]">
        <BrandTile brand={brand} size={70} plain />
        <span className="ml-[22px] w-[266px] flex-none">
          <span className="block truncate text-[20px] leading-[24px] font-bold text-ink">
            {name}
          </span>
          <span className="mt-[6px] block truncate text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
            {sub}
          </span>
        </span>
        <span className="ml-[22px] w-[170px] flex-none text-[18px] leading-[22px] font-bold text-ink">
          {earning}
        </span>
        <span className="ml-[10px] w-[100px] flex-none text-[18px] leading-[22px] font-bold text-ink">
          {count}
        </span>
        <span className="ml-[10px] flex-none">
          <StatusPill status={status} />
        </span>
      </div>
    </>
  );
}

/* Mobile member row (M19): h120 r12 card, 40px tile (service-mismatched
   per Figma via mBrand) + name/group/plan + payment, date + pill below.
   Desktop 750x111 table row with initial avatar. */
export function EarningMemberRow({ name, date = TX_DATE, group, plan, payment, status, mBrand }) {
  const parts = name.split(" ");
  const init = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  const pill = PILL[status] || PILL.Successful;
  return (
    <>
      <div className={`rounded-[12px] bg-white px-[21px] pt-[17px] pb-[17px] xl:hidden ${SHADOW}`}>
        <div className="flex">
          <BrandTile brand={mBrand} size={40} plain />
          <span className="ml-[18px] min-w-0">
            <span className="block truncate text-[16px] leading-[20px] font-semibold text-black">
              {name}
            </span>
            <span className="block truncate text-[13px] leading-[18px] font-semibold text-[#66726C]">
              {group}
            </span>
            <span className="block truncate text-[13px] leading-[18px] font-semibold text-[#66726C]">
              {plan}
            </span>
          </span>
          <span className="mt-[13px] ml-auto flex-none text-[16px] leading-[20px] font-semibold whitespace-nowrap text-[#6B6B6B]">
            {payment}
          </span>
        </div>
        <div className="mt-[2px] flex items-center justify-between gap-[12px]">
          <span className="truncate text-[13px] leading-[20px] font-semibold text-[#66726C]">
            {date}
          </span>
          <span className={`flex h-[28px] w-[101px] flex-none items-center justify-center rounded-[14px] ${pill.bg}`}>
            <span className={`text-[13px] leading-[16px] font-semibold whitespace-nowrap ${pill.text}`}>
              {status}
            </span>
          </span>
        </div>
      </div>
      <div className="hidden items-center bg-white xl:flex xl:h-[111px] xl:w-[750px]">
        <span className="grid h-[70px] w-[70px] flex-none place-items-center rounded-full bg-[#DFFFE0] text-[25px] font-bold text-ink">
          {init}
        </span>
        <span className="ml-[22px] w-[236px] flex-none">
          <span className="block truncate text-[20px] leading-[24px] font-bold text-ink">
            {name}
          </span>
          <span className="mt-[6px] block truncate text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
            {date}
          </span>
        </span>
        <span className="ml-[22px] w-[180px] flex-none">
          <span className="block truncate text-[18px] leading-[22px] font-bold text-ink">
            {group}
          </span>
          <span className="mt-[4px] block text-[15px] leading-[18px] font-semibold text-[#6B6B6B]">
            {plan}
          </span>
        </span>
        <span className="ml-[10px] w-[100px] flex-none text-[18px] leading-[22px] font-bold text-ink">
          {payment}
        </span>
        <span className="ml-[10px] flex-none">
          <StatusPill status={status} h40 />
        </span>
      </div>
    </>
  );
}

/* E1 overview mini card: 349x156, 42px tile + label/value/sub column,
   green View Details below at literal +198. */
export function EarnMini({ tile, glyph, label, value, sub, vdTo, onVd, wide = false, dark = false, noVd = false }) {
  const sub2 = dark ? "text-[#013104]" : "text-[#6B6B6B]";
  const valueCls = wide
    ? "text-[35px] leading-[43px]"
    : "text-[30px] leading-[37px] xl:text-[35px] xl:leading-[43px]";
  return (
    <div className={wide ? "w-full xl:w-[748px]" : "w-full xl:w-[349px]"}>
      <div className={`rounded-[10px] bg-white px-[21px] pt-[21px] ${wide ? "h-[149px]" : "h-[156px]"} ${SHADOW}`}>
        <div className="flex">
          <span className={`grid h-[42px] w-[42px] flex-none place-items-center rounded-[5px] ${tile}`}>
            <img src={glyph} alt="" className="h-[30px] w-[30px]" />
          </span>
          <span className="ml-[30px]">
            <span className={`block text-[18px] leading-[22px] font-semibold whitespace-nowrap ${sub2}`}>
              {label}
            </span>
            <span className={`mt-[10px] block font-bold whitespace-nowrap text-ink ${valueCls}`}>
              {value}
            </span>
            <span className={`mt-[10px] block text-[18px] leading-[22px] font-semibold whitespace-nowrap ${sub2}`}>
              {sub}
            </span>
          </span>
        </div>
      </div>
      {!noVd &&
        (onVd ? (
          <button
            type="button"
            onClick={onVd}
            className="mt-[21px] ml-[198px] block text-[18px] leading-[22px] font-semibold text-clyse"
          >
            View Details
          </button>
        ) : (
          <Link to={vdTo} className="mt-[21px] ml-[198px] block text-[18px] leading-[22px] font-semibold text-clyse">
            View Details
          </Link>
        ))}
    </div>
  );
}

/* E1 summary mini: 364x197, centered label/value + white View button.
   Mobile: h191, value 30px, button w326. */
export function EarnSummaryMini({ label, value, btnTo }) {
  return (
    <div className={`h-[191px] w-full rounded-[10px] bg-white pt-[21px] xl:h-[197px] xl:w-[364px] ${SHADOW}`}>
      <p className="text-center text-[18px] leading-[22px] font-semibold text-[#013104]">
        {label}
      </p>
      <p className="mt-[10px] text-center text-[30px] leading-[37px] font-bold text-ink xl:text-[35px] xl:leading-[43px]">
        {value}
      </p>
      <div className="mt-[24px] flex justify-center xl:mt-[30px]">
        <Link
          to={btnTo}
          className="grid h-[50px] w-[326px] place-items-center rounded-[10px] border border-clyse bg-white xl:w-[322px]"
        >
          <span className="text-[18px] leading-[22px] font-semibold text-clyse">
            View Transaction
          </span>
        </Link>
      </div>
    </div>
  );
}

/* E2/E3 filter dropdown (visual): 395x56, mint fill, 16px label + chevron.
   Mobile: w165 h46, 13px label. Second filter reads October on mobile. */
export function FilterSelect({ label, mLabel, className = "" }) {
  return (
    <button className={`flex h-[46px] w-[165px] items-center rounded-[6px] bg-[#F1F8F1] px-[21px] xl:h-[56px] xl:w-[395px] xl:px-[11px] ${className}`}>
      <span className="text-[13px] leading-[16px] font-semibold whitespace-nowrap text-ink xl:text-[16px] xl:leading-[20px]">
        <span className="xl:hidden">{mLabel || label}</span>
        <span className="hidden xl:inline">{label}</span>
      </span>
      <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden className="ml-auto">
        <path d="M1.5 1.5 7 6.5l5.5-5" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
