import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LogoMarquee from "../components/LogoMarquee";
import CreateGroupHead from "../components/CreateGroupHead";
import { BlurBg } from "../components/Decor";
import iconCard from "../assets/card-ink.svg";
import iconApple from "../assets/icon-apple.png";

function PayButton() {
  return (
    <Link
      to="/join/confirmed"
      className="bg-btn mx-[31px] flex h-[60px] items-center justify-center gap-[12px] rounded-[10px] xl:mx-[31px]"
    >
      <img src={iconApple} alt="" className="h-[28px] w-[28px] object-contain" />
      <span className="text-[13px] leading-[16px] font-semibold text-white xl:text-[18px] xl:leading-[22px]">
        Apple Pay
      </span>
    </Link>
  );
}

function Row({ label, to, h, mh }) {
  const inner = (
    <>
      <img
        src={iconCard}
        alt=""
        className="hidden h-[35px] w-[68px] flex-none xl:block"
      />
      <img
        src={iconCard}
        alt=""
        className="h-[21px] w-[40px] flex-none xl:hidden"
      />
      <span className="ml-[25px] text-[25px] leading-[30px] font-bold text-ink xl:text-[35px] xl:leading-[43px]">
        {label}
      </span>
    </>
  );
  const cls = `flex ${mh} ${h} items-center bg-[#D9D9D9] pl-[75px] xl:pl-[95px]`;
  return to ? (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function JoinApplePay() {
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
              <Row label="Card" to="/join/card" h="xl:h-[103px]" mh="h-[75px]" />
              <Row label="Apple Pay" h="xl:h-[104px]" mh="h-[76px]" />
              <div className="bg-white pt-[20px]">
                <PayButton />
              </div>
              <div className="bg-white pt-[30px]">
                <Row label="Google Pay" to="/join/google-pay" h="xl:h-[103px]" mh="h-[75px]" />
              </div>
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
              <Row label="Card" to="/join/card" h="xl:h-[103px]" mh="h-[75px]" />
              <Row label="Apple Pay" h="xl:h-[104px]" mh="h-[76px]" />
              <div className="bg-white">
                <div className="mx-[31px] xl:hidden">
                  <Link
                    to="/join/confirmed"
                    className="bg-btn flex h-[50px] items-center justify-center gap-[10px] rounded-[10px]"
                  >
                    <img src={iconApple} alt="" className="h-[20px] w-[20px] object-contain" />
                    <span className="text-[13px] leading-[16px] font-semibold text-white">
                      Apple Pay
                    </span>
                  </Link>
                </div>
              </div>
              <Row label="Google Pay" to="/join/google-pay" h="xl:h-[103px]" mh="h-[75px]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
