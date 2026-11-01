import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LogoMarquee from "../components/LogoMarquee";
import CreateGroupHead from "../components/CreateGroupHead";
import CardBrands from "../components/CardBrands";
import { BlurBg } from "../components/Decor";
import iconCard from "../assets/card-ink.svg";
import iconEye from "../assets/icon-eye.png";

const INPUT =
  "w-full bg-transparent outline-none placeholder:text-[#999999]";

function Eye() {
  return <img src={iconEye} alt="" className="h-[24px] w-[24px] flex-none" />;
}

export default function JoinCardFilled() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[102px] bg-white">
          <CreateGroupHead title="Payment Method" chip="#DFFFE0" />
        </div>
        <div className="relative bg-white">
          <div className="px-[63px] pt-[50px] pb-[100px]">
            <div className="flex h-[103px] items-center rounded-[15px] rounded-b-none bg-[#D9D9D9] pl-[56px]">
              <img src={iconCard} alt="" className="h-[35px] w-[68px] flex-none" />
              <span className="ml-[25px] text-[35px] leading-[43px] font-bold text-black">
                Card
              </span>
            </div>
            <p className="mt-[30px] text-[25px] leading-[22px] font-semibold text-ink">
              Card Holder Name
            </p>
            <div className="mt-[30px] flex h-[95px] items-center rounded-[16px] border border-[#999999] px-[20px]">
              <input
                defaultValue="Yusuff Sodiq Akanni"
                className={`${INPUT} text-[25px] leading-[30px] font-semibold text-ink`}
              />
              <Eye />
            </div>
            <div className="mt-[50px] flex items-start">
              <p className="mt-[2px] text-[25px] leading-[30px] font-semibold text-black">
                Card Number
              </p>
              <span className="ml-auto">
                <CardBrands />
              </span>
            </div>
            <div className="mt-[15px] flex h-[95px] items-center rounded-[16px] border border-[#999999] px-[20px]">
              <input
                defaultValue="1234566789075333"
                className={`${INPUT} text-[25px] leading-[30px] font-semibold text-ink`}
              />
              <Eye />
            </div>
            <div className="mt-[50px] flex gap-[50px]">
              <div className="w-[532px] flex-none">
                <p className="text-[25px] leading-[22px] font-semibold text-ink">
                  Expired Date
                </p>
                <div className="mt-[30px] flex h-[95px] items-center rounded-[16px] border border-[#999999] px-[20px]">
                  <input
                    defaultValue="23/29"
                    className={`${INPUT} text-[25px] leading-[30px] font-semibold text-ink`}
                  />
                  <Eye />
                </div>
              </div>
              <div className="w-[532px] flex-none">
                <p className="text-[25px] leading-[22px] font-semibold text-ink">
                  Security Code
                </p>
                <div className="mt-[30px] flex h-[95px] items-center rounded-[16px] border border-[#999999] px-[20px]">
                  <input
                    defaultValue="2344"
                    className={`${INPUT} text-[25px] leading-[30px] font-semibold text-[#013104]`}
                  />
                  <Eye />
                </div>
              </div>
            </div>
            <Link
              to="/join/confirmed"
              className="bg-btn mt-[70px] flex h-[60px] w-full items-center justify-center rounded-[16px]"
            >
              <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                Confirm Payment
              </span>
            </Link>
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
            <div className="flex h-[75px] items-center bg-[#D9D9D9]">
              <img src={iconCard} alt="" className="h-[21px] w-[40px] flex-none" />
              <span className="ml-[20px] text-[20px] leading-[24px] font-bold text-black">
                Card
              </span>
            </div>
            <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-ink">
              Card Holder Name
            </p>
            <div className="mt-[10px] flex h-[54px] items-center rounded-[7px] border border-[#999999] px-[20px]">
              <input
                defaultValue="Yusuff Sodiq Akanni"
                className={`${INPUT} text-[18px] leading-[22px] font-semibold text-ink`}
              />
              <Eye />
            </div>
            <div className="mt-[30px] flex items-start">
              <p className="text-[18px] leading-[22px] font-semibold text-black">
                Card Number
              </p>
              <span className="mt-[8px] ml-auto">
                <CardBrands className="h-[19px] w-[35px]" />
              </span>
            </div>
            <div className="mt-[15px] flex h-[54px] items-center rounded-[7px] border border-[#999999] px-[20px]">
              <input
                defaultValue="123456789909776"
                className={`${INPUT} text-[18px] leading-[22px] font-semibold text-ink`}
              />
              <Eye />
            </div>
            <div className="mt-[30px] flex gap-[50px]">
              <div className="w-[160px] flex-none">
                <p className="text-[18px] leading-[22px] font-semibold text-ink">
                  Expired Date
                </p>
                <div className="mt-[30px] flex h-[54px] items-center rounded-[7px] border border-[#999999] px-[20px]">
                  <input
                    defaultValue="26/29"
                    className={`${INPUT} text-[18px] leading-[22px] font-semibold text-ink`}
                  />
                  <Eye />
                </div>
              </div>
              <div className="w-[160px] flex-none">
                <p className="text-[18px] leading-[22px] font-semibold text-ink">
                  Security Code
                </p>
                <div className="mt-[30px] flex h-[54px] items-center rounded-[7px] border border-[#999999] px-[20px]">
                  <input
                    defaultValue="2344"
                    className={`${INPUT} text-[18px] leading-[22px] font-semibold text-ink`}
                  />
                  <Eye />
                </div>
              </div>
            </div>
            <Link
              to="/join/confirmed"
              className="bg-btn mt-[50px] flex h-[60px] w-full items-center justify-center rounded-[16px]"
            >
              <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                Confirm Payment
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
