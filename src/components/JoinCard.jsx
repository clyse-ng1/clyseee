import { Link } from "react-router-dom";
import BrandTile from "./BrandTile";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconPlusWhite from "../assets/plus-white.svg";

/* Discover / Join Waitlist card. Desktop 400px, mobile 370px — identical
   internals, 30px side padding, right-aligned price + waiting count. */
export default function JoinCard({ brand, chip, title, slots, price, waiting, linkState }) {
  return (
    <article className="h-[406px] w-[370px] rounded-[25px] bg-white px-[30px] pt-[24px] pb-[24px] shadow-[0_0_20px_rgba(0,23,1,0.10)] xl:w-[400px]">
      <div className="flex items-start justify-between">
        <BrandTile brand={brand} size={75} plain />
        <span className="grid h-[36px] w-[123px] place-items-center rounded-[7.74px] bg-[#DFFFE0]">
          <span className="text-[13px] leading-[20px] font-semibold text-clyse">
            {chip}
          </span>
        </span>
      </div>
      <h3 className="mt-[20px] text-[25px] leading-[30px] font-bold text-ink">
        {title}
      </h3>
      <p className="text-[15px] leading-[18px] font-semibold text-[#6B6B6B]">
        Subscription Plan · {slots} Slots Available
      </p>
      <div className="mt-[51px] space-y-[21px]">
        <p className="flex items-center justify-between text-[18px] leading-[22px] font-semibold">
          <span className="text-[#6B6B6B]">Monthly share</span>
          <span className="text-ink">{price}</span>
        </p>
        <p className="flex items-center justify-between text-[18px] leading-[22px] font-semibold">
          <span className="text-[#6B6B6B]">Waiting now</span>
          <span className="text-clyse">{waiting} people</span>
        </p>
      </div>
      <Link
        to="/join/plan"
        state={linkState}
        className="bg-btn relative mt-[39px] flex h-[60px] items-center justify-center rounded-[10px] text-[18px] leading-[22px] font-semibold text-[#F1F8F1]"
      >
        <span className="absolute top-1/2 left-[30px] flex -translate-y-1/2 items-center gap-[3px]">
          <img src={iconFundArrow} alt="" className="h-[15px] w-[15px]" />
          <img src={iconPlusWhite} alt="" className="h-[18px] w-[18px]" />
        </span>
        Join Waitlist
      </Link>
    </article>
  );
}
