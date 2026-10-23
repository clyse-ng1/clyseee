import { Link } from "react-router-dom";
import ctaOwner from "../assets/cta-owner.webp";

/* Desktop "Become an Owner" CTA — Figma 255:3349/257:3624 (1240x300 r50
   mintband; same texts + photo on both pages). Lives inside a max-w-1440 px-100
   container (no own side margins). */
export default function DesktopCta() {
  return (
    <div className="bg-mintband relative mt-[100px] h-[300px] rounded-[50px]">
      <div className="max-w-[536px] pt-[51px] pl-[40px]">
        <h2 className="text-[35px] font-bold leading-[43px] text-ink">Become an Owner</h2>
        <p className="mt-[30px] text-[25px] font-semibold leading-[35px] whitespace-nowrap text-ink">
          Save money by offering your subscription
        </p>
        <Link
          to="/signup"
          className="bg-btn mt-[30px] flex h-[60px] w-[200px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-mint transition hover:opacity-90"
        >
          Create
        </Link>
      </div>
      <img src={ctaOwner} alt="" className="absolute top-0 right-[40px] h-[300px] w-[387px]" />
    </div>
  );
}
