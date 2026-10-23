import { Link } from "react-router-dom";
import BrandTile from "./BrandTile";
import iconChevRight from "../assets/icon-chev-right.svg";

/* Subscription list row. Desktop 830x144: brand + title/chip/plan, hairline
   divider, price + renews, Activated pill, chevron. Mobile is a 370 card:
   header, price, renews + pill row, View Details button (grey 1px border).
   Mobile data differs (uniform Premium Plan / N 2,000, YouTube short title)
   so mobile values arrive via mTitle/mPlan/mPrice. */
export default function SubCard({
  brand,
  title,
  plan,
  price,
  mTitle,
  mPlan,
  mPrice,
  to = "/subscriptions/details",
  subLine = "Renews in 12 days",
  statusLabel = "Activated",
  statusBg = "bg-[#DFFFE0]",
  statusText = "text-clyse",
  statusDot = "bg-clyse",
  dim = false,
  mSub = subLine,
  mLabel = statusLabel,
  mBg = statusBg,
  mText = statusText,
  mDot = statusDot,
  noView = false,
  linkState,
}) {
  const dimCls = dim ? "xl:opacity-60" : "";
  return (
    <Link
      to={to}
      state={linkState}
      className={`block w-full rounded-[20px] bg-white px-[31px] py-[26px] shadow-[0_0_20px_rgba(0,23,1,0.10)] xl:h-[144px] xl:w-[830px] xl:py-0 ${dimCls}`}
    >
      <span className="flex items-start xl:h-full xl:items-center">
        <BrandTile brand={brand} size={75} plain />
        <span className="ml-[20px] min-w-0 flex-1 xl:w-[200px] xl:flex-none">
          <span className="block text-[25px] leading-[28px] font-bold text-ink xl:leading-[28px]">
            <span className="xl:hidden">{mTitle || title}</span>
            <span className="hidden xl:inline">{title}</span>
          </span>
          <span className="mt-[8px] block text-[10px] leading-[12px] font-semibold text-clyse xl:mt-[1px]">
            Entertainment
          </span>
          <span className="mt-[8px] block text-[13px] leading-[20px] font-semibold text-[#6B6B6B] xl:mt-[29px] xl:text-[18px] xl:leading-[22px]">
            <span className="xl:hidden">{mPlan || plan}</span>
            <span className="hidden xl:inline">{plan}</span>
          </span>
        </span>
        <span className="ml-[31px] hidden h-[85px] w-[1px] flex-none self-center bg-[#999999] xl:block" />
        <span className="ml-[30px] hidden flex-none xl:block">
          <span className="flex items-baseline">
            <span className="text-[25px] leading-[30px] font-bold text-ink">
              {price}
            </span>
            <span className="ml-[2px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              /Monthly
            </span>
          </span>
          <span className="mt-[10px] block text-[18px] leading-[22px] font-semibold whitespace-nowrap text-[#6B6B6B]">
            {subLine}
          </span>
        </span>
        <span className={`ml-[30px] hidden h-[40px] w-[140px] flex-none items-center justify-center gap-[10px] rounded-[10px] xl:flex ${statusBg}`}>
          <span className={`h-[13px] w-[13px] rounded-full ${statusDot}`} />
          <span className={`text-[18px] leading-[22px] font-semibold ${statusText}`}>
            {statusLabel}
          </span>
        </span>
        <span className="ml-auto hidden h-[35px] w-[35px] flex-none place-items-center self-center text-ink xl:grid">
          <img src={iconChevRight} alt="" className="h-[22px] w-[12px]" />
        </span>
      </span>
      {/* Mobile lower block */}
      <span className="mt-[34px] block xl:hidden">
        <span className="flex items-end">
          <span className="text-[25px] leading-[30px] font-bold whitespace-nowrap text-ink">
            {mPrice || price}
          </span>
          <span className="ml-[2px] text-[13px] leading-[20px] font-semibold whitespace-nowrap text-[#6B6B6B]">
            /Monthly
          </span>
        </span>
        <span className="mt-[11px] flex items-center justify-between gap-[12px]">
          <span className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {mSub || subLine}
          </span>
          <span className={`flex h-[37px] w-[132px] flex-none items-center justify-center gap-[5px] rounded-[10px] ${mBg}`}>
            <span className={`h-[10px] w-[10px] rounded-full ${mDot}`} />
            <span className={`text-[14px] leading-[17px] font-semibold ${mText}`}>
              {mLabel}
            </span>
          </span>
        </span>
        {!noView && (
          <span className="mt-[20px] flex h-[50px] w-full items-center justify-center rounded-[10px] border border-[#999999] bg-white">
            <span className="text-[18px] leading-[22px] font-semibold text-clyse">
              View Details
            </span>
          </span>
        )}
      </span>
    </Link>
  );
}
