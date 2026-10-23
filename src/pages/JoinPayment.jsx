import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LogoMarquee from "../components/LogoMarquee";
import CreateGroupHead from "../components/CreateGroupHead";
import { BlurBg } from "../components/Decor";
import iconCard from "../assets/card-ink.svg";

const ROWS = [
  { label: "Card", to: "/join/card", h: "h-[103px] xl:h-[103px]", mh: "h-[75px]" },
  { label: "Apple Pay", to: "/join/apple-pay", h: "h-[105px] xl:h-[105px]", mh: "h-[77px]" },
  { label: "Google Pay", to: "/join/google-pay", h: "h-[103px] xl:h-[103px]", mh: "h-[75px]" },
];

export default function JoinPayment() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[102px] bg-white">
          <CreateGroupHead title="Payment Method" chip="#DFFFE0" />
        </div>
        <div className="relative bg-white">
          <div className="px-[63px] pt-[50px] pb-[101px]">
            <div className="overflow-hidden rounded-[15px]">
              {ROWS.map((r) => (
                <Link
                  key={r.label}
                  to={r.to}
                  className={`flex ${r.h} items-center bg-[#D9D9D9] pl-[95px]`}
                >
                  <img src={iconCard} alt="" className="h-[35px] w-[68px] flex-none" />
                  <span className="ml-[25px] text-[35px] leading-[43px] font-bold text-black">
                    {r.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <div className="hidden xl:block">
        <LogoMarquee className="mt-[60px]" />
        <div className="pb-[60px]" />
      </div>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative bg-white">
          <CreateGroupHead title="Payment Method" mBig />
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[50px] pb-[60px]">
            <div className="overflow-hidden rounded-[15px]">
              {ROWS.map((r) => (
                <Link
                  key={r.label}
                  to={r.to}
                  className={`flex ${r.mh} items-center bg-[#D9D9D9] pl-[75px]`}
                >
                  <img src={iconCard} alt="" className="h-[21px] w-[40px] flex-none" />
                  <span className="ml-[25px] text-[25px] leading-[30px] font-bold text-black">
                    {r.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
