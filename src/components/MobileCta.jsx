import { Link } from "react-router-dom";
import ctaOwner from "../assets/cta-owner.webp";

/* Mobile "Become an Owner" CTA — Figma 263:4402 (430x408, full-bleed r13.87
   mintband + shadow; centered texts, sub wraps; same photo as desktop CTA). */
export default function MobileCta() {
  return (
    <div className="bg-mintband mt-[50px] rounded-[13.87px] px-[29px] pt-[20px] pb-[21px] shadow-[0_0_13.87px_rgba(0,23,1,0.10)]">
      <h2 className="text-center text-[24.27px] leading-[29.59px] font-bold text-ink">
        Become an Owner
      </h2>
      <p className="mt-[21px] text-center text-[17.34px] leading-[24.27px] font-semibold text-ink">
        Save money by offering your subscription
      </p>
      <Link
        to="/signup"
        className="bg-btn mx-auto mt-[21px] flex h-[42px] w-[139px] items-center justify-center rounded-[6.94px] text-[12.48px] font-semibold text-mint transition hover:opacity-90"
      >
        Create
      </Link>
      <img src={ctaOwner} alt="" className="mx-auto mt-[20px] h-[208px] w-[268px]" />
    </div>
  );
}
