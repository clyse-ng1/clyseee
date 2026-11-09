import { Link } from "react-router-dom";
import BrandTile from "./BrandTile";
import DropSelect from "./DropSelect";
import Sk from "./Skeleton";

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
      <div
        /* Card 21/23: the fixed 149/156px heights were shorter than the
           content, so "View Details" rendered past the tile's bottom border
           and overlapped the Withdraw button / the next row. Let the padding
           drive the height instead. */
        className={`rounded-[10px] border border-clyse bg-white px-[21px] pt-[21px] pb-[16px] ${SHADOW}`}
      >
        <div className="flex">
          <span className={`grid h-[44px] w-[44px] flex-none place-items-center rounded-[10px] ${tile}`}>
            <img src={glyph} alt="" className="h-[30px] w-[30px]" />
          </span>
          <span className="ml-[30px]">
            <span className={`block pr-[4px] text-[18px] leading-[22px] font-semibold ${sub2}`}>
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
        {/* Card 21: "View Details" used to float outside and below the card.
            Figma M17/M18 tiles carry no such link, so on mobile it is gone; it
            stays on the desktop overview, which has no Figma frame of its own. */}
        {!noVd && (
          <div className="mt-[10px] hidden justify-end xl:flex">
            {onVd ? (
              <button
                type="button"
                onClick={onVd}
                className="text-[14px] leading-[18px] font-semibold text-clyse xl:text-[18px] xl:leading-[22px]"
              >
                View Details
              </button>
            ) : (
              <Link
                to={vdTo}
                className="text-[14px] leading-[18px] font-semibold text-clyse xl:text-[18px] xl:leading-[22px]"
              >
                View Details
              </Link>
            )}
          </div>
        )}
      </div>
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

/* E2/E3 filter dropdown: 395x56, mint fill, 16px label + chevron.
   Mobile: w165 h46, 13px label. Controlled via options/value/onChange. */
export function FilterSelect({ label, className = "", options = [], value, onChange }) {
  return (
    <DropSelect
      value={value ?? label}
      options={options}
      onChange={onChange}
      ariaLabel={label}
      className={className}
      buttonClass="flex h-[46px] w-full items-center rounded-[6px] bg-[#F1F8F1] px-[21px] xl:h-[56px] xl:px-[11px]"
      labelClass="truncate text-[13px] leading-[16px] font-semibold text-ink xl:text-[16px] xl:leading-[20px]"
      chevColor="#6B6B6B"
    />
  );
}
/* Loading stand-ins (shimmer, never mock content). View-links are static
   chrome, so they stay live while the numbers load. */
export function EarningTxRowSk() {
  return (
    <>
      <div className={`rounded-[12px] bg-white px-[21px] pt-[17px] pb-[17px] xl:hidden ${SHADOW}`}>
        <div className="flex">
          <Sk className="h-[40px] w-[40px] flex-none !rounded-full" />
          <span className="ml-[12px] min-w-0">
            <Sk className="h-[18px] w-[150px]" />
            <Sk className="mt-[6px] h-[14px] w-[110px]" />
          </span>
          <Sk className="mt-[13px] ml-auto h-[18px] w-[90px] flex-none" />
        </div>
        <div className="mt-[12px] flex items-center justify-between gap-[12px]">
          <Sk className="h-[14px] w-[130px]" />
          <Sk className="h-[28px] w-[101px] flex-none !rounded-[14px]" />
        </div>
      </div>
      <div className="hidden items-center bg-white xl:flex xl:h-[111px] xl:w-[770px]">
        <Sk className="h-[70px] w-[70px] flex-none !rounded-[18px]" />
        <span className="ml-[22px] w-[266px] flex-none">
          <Sk className="h-[22px] w-[200px]" />
          <Sk className="mt-[6px] h-[18px] w-[150px]" />
        </span>
        <Sk className="ml-[22px] h-[20px] w-[130px] flex-none" />
        <Sk className="ml-[10px] h-[20px] w-[60px] flex-none" />
        <Sk className="ml-[10px] h-[40px] w-[140px] flex-none !rounded-[10px]" />
      </div>
    </>
  );
}

export function EarningMemberRowSk() {
  return (
    <>
      <div className={`rounded-[12px] bg-white px-[21px] pt-[17px] pb-[17px] xl:hidden ${SHADOW}`}>
        <div className="flex">
          <Sk className="h-[40px] w-[40px] flex-none !rounded-full" />
          <span className="ml-[18px] min-w-0">
            <Sk className="h-[18px] w-[140px]" />
            <Sk className="mt-[5px] h-[14px] w-[110px]" />
            <Sk className="mt-[4px] h-[14px] w-[90px]" />
          </span>
          <Sk className="mt-[13px] ml-auto h-[18px] w-[80px] flex-none" />
        </div>
        <div className="mt-[2px] flex items-center justify-between gap-[12px]">
          <Sk className="h-[14px] w-[130px]" />
          <Sk className="h-[28px] w-[101px] flex-none !rounded-[14px]" />
        </div>
      </div>
      <div className="hidden items-center bg-white xl:flex xl:h-[111px] xl:w-[750px]">
        <Sk className="h-[70px] w-[70px] flex-none !rounded-full" />
        <span className="ml-[22px] w-[236px] flex-none">
          <Sk className="h-[22px] w-[180px]" />
          <Sk className="mt-[6px] h-[18px] w-[140px]" />
        </span>
        <span className="ml-[22px] w-[180px] flex-none">
          <Sk className="h-[20px] w-[140px]" />
          <Sk className="mt-[4px] h-[16px] w-[100px]" />
        </span>
        <Sk className="ml-[10px] h-[20px] w-[80px] flex-none" />
        <Sk className="ml-[10px] h-[40px] w-[100px] flex-none !rounded-[10px]" />
      </div>
    </>
  );
}

export function EarnMiniSk({ wide = false, vdTo }) {
  return (
    <div className={wide ? "w-full xl:w-[748px]" : "w-full xl:w-[349px]"}>
      <div
        aria-hidden
        className={`rounded-[10px] bg-white px-[21px] pt-[21px] ${wide ? "h-[149px]" : "h-[156px]"} ${SHADOW}`}
      >
        <div className="flex">
          <Sk className="h-[42px] w-[42px] flex-none !rounded-[5px]" />
          <span className="ml-[30px]">
            <Sk className="h-[20px] w-[150px]" />
            <Sk className="mt-[10px] h-[36px] w-[130px]" />
            <Sk className="mt-[10px] h-[20px] w-[170px]" />
          </span>
        </div>
      </div>
      {vdTo && (
        <Link to={vdTo} className="mt-[21px] ml-[198px] block text-[18px] leading-[22px] font-semibold text-clyse">
          View Details
        </Link>
      )}
    </div>
  );
}

export function EarnSummaryMiniSk({ label, btnTo }) {
  return (
    <div className={`h-[191px] w-full rounded-[10px] bg-white pt-[21px] xl:h-[197px] xl:w-[364px] ${SHADOW}`}>
      <p className="text-center text-[18px] leading-[22px] font-semibold text-[#013104]">
        {label}
      </p>
      <p className="mt-[10px] flex justify-center">
        <Sk className="h-[38px] w-[150px]" />
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
