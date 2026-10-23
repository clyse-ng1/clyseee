import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import LogoMarquee from "./LogoMarquee";
import { BlurBg } from "./Decor";

/* Shared join-status layout (success / already / failed). Centered title +
   body + 470/370px text-only button + green back link. Figma scatters 8
   opaque collage photos OVER the text on these pages (broken z-order) —
   deliberately omitted; the clean status card is what's built. */
const BTN = {
  dark: "bg-btn text-white",
  outline: "border border-clyse bg-white text-ink",
  red: "bg-[#E31B00] text-white",
};

/* P5 "already" is outline on desktop but dark on mobile — hence the override. */
export default function JoinStatus({ title, body, btnLabel, btnVariant, btnVariantMobile, btnTo, marqueeMt, iconD, iconM, iconTopD = "mt-[251px]", titleMtD = "mt-[80px]", iconTopM = "pt-[122px]", titleMtM = "mt-[73px]", hideBack, btnLabelM }) {
  const mobileBtn = btnVariantMobile || btnVariant;
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className={`relative mx-[63px] ${iconD ? iconTopD : "mt-[401px]"}`}>
          {iconD && <div className="flex justify-center">{iconD}</div>}
          <h1 className={`${iconD ? titleMtD : ""} text-center text-[35px] leading-[43px] font-bold text-ink`}>
            {title}
          </h1>
          <p className="mt-[10px] text-center text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
            {body}
          </p>
          <Link
            to={btnTo}
            className={`mx-auto mt-[50px] flex h-[60px] w-[470px] items-center justify-center rounded-[16px] text-[18px] leading-[22px] font-semibold ${BTN[btnVariant]}`}
          >
            {btnLabel}
          </Link>
          {!hideBack && (
            <Link
              to="/join"
              className="mt-[20px] block text-[18px] leading-[22px] font-semibold text-clyse"
            >
              Back to Discover
            </Link>
          )}
        </div>
      </main>
      <div className="hidden xl:block">
        <LogoMarquee className={marqueeMt} />
        <div className="pb-[60px]" />
      </div>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className={`relative px-[30px] pb-[60px] ${iconM ? iconTopM : "pt-[250px]"}`}>
          {iconM && <div className="flex justify-center">{iconM}</div>}
          <h1 className={`${iconM ? titleMtM : ""} text-center text-[30px] leading-[37px] font-bold text-ink`}>
            {title}
          </h1>
          <p className="mt-[10px] text-center text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
            {body}
          </p>
          <Link
            to={btnTo}
            className={`mt-[50px] flex h-[60px] w-full items-center justify-center rounded-[16px] text-[18px] leading-[22px] font-semibold ${BTN[mobileBtn]}`}
          >
            {btnLabelM || btnLabel}
          </Link>
          {!hideBack && (
            <Link
              to="/join"
              className="mt-[20px] block text-center text-[18px] leading-[22px] font-semibold text-clyse"
            >
              Back to Discover
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
