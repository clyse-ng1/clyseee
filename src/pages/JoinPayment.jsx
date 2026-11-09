import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LogoMarquee from "../components/LogoMarquee";
import CreateGroupHead from "../components/CreateGroupHead";
import { BlurBg } from "../components/Decor";
import iconCard from "../assets/card-ink.svg";
import iconApple from "../assets/icon-apple.png";
import iconGoogle from "../assets/icon-google.png";

/* Each row gets its own brand glyph — previously all three rendered the
   generic card icon, which is why the list looked like a copy-paste. */
const ROWS = [
  {
    label: "Card",
    to: "/join/card",
    icon: iconCard,
    iw: "w-[68px]",
    miw: "w-[40px]",
    h: "h-[103px]",
    mh: "h-[75px]",
  },
  {
    label: "Apple Pay",
    to: "/join/apple-pay",
    icon: iconApple,
    iw: "w-[36px]",
    miw: "w-[22px]",
    h: "h-[105px]",
    mh: "h-[77px]",
  },
  {
    label: "Google Pay",
    to: "/join/google-pay",
    icon: iconGoogle,
    iw: "w-[36px]",
    miw: "w-[22px]",
    h: "h-[103px]",
    mh: "h-[75px]",
  },
];

export default function JoinPayment() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        {/* Figma 889:52410: white card, and the methods are white rows split by
            hairlines — they were solid grey #D9D9D9 slabs. */}
        <div className="relative mt-[102px] rounded-[20px] bg-white pb-[70px] shadow-[0_0_20px_rgba(0,23,1,0.08)]">
          <div className="border-b border-[#BABABA] py-[30px] pl-[63px]">
            <CreateGroupHead title="Payment Method" chip="#DFFFE0" />
          </div>
          <div className="px-[63px] pt-[42px]">
            <div className="overflow-hidden rounded-[10px] border border-[#999999] bg-white">
              {ROWS.map((r, i) => (
                <Link
                  key={r.label}
                  to={r.to}
                  className={`flex ${r.h} items-center bg-white pl-[30px] ${
                    i ? "border-t border-[#999999]" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="mr-[25px] grid h-[28px] w-[28px] flex-none place-items-center rounded-full border border-[#999999] bg-white"
                  />
                  <span className="grid h-[26px] w-[44px] flex-none place-items-center rounded-[4px] border border-[#D9D9D9]">
                    <img src={r.icon} alt="" className={`h-[15px] ${r.iw} object-contain`} />
                  </span>
                  <span className="ml-[25px] text-[25px] leading-[31px] font-bold text-black">
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
      <main className="relative bg-white xl:hidden">
        <div className="relative bg-white">
          <CreateGroupHead title="Payment Method" mBig />
        </div>
        <div className="px-[30px] pt-[40px] pb-[60px]">
          <div className="overflow-hidden rounded-[10px] border border-[#999999] bg-white">
            {ROWS.map((r, i) => (
              <Link
                key={r.label}
                to={r.to}
                className={`flex ${r.mh} items-center bg-white pl-[20px] ${
                  i ? "border-t border-[#999999]" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="mr-[16px] grid h-[20px] w-[20px] flex-none place-items-center rounded-full border border-[#999999] bg-white"
                />
                <span className="grid h-[20px] w-[34px] flex-none place-items-center rounded-[3px] border border-[#D9D9D9]">
                  <img src={r.icon} alt="" className={`h-[11px] ${r.miw} object-contain`} />
                </span>
                <span className="ml-[14px] text-[18px] leading-[23px] font-bold text-black">
                  {r.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
