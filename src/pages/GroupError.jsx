import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import iconError from "../assets/error-circle-red.svg";

const SUB = "Manage your subscriptions, view details, and track your groups.";
const MSG = "We couldn't load your group information. Please try again.";

function TryButton({ full = false }) {
  return (
    <Link
      to="/groups"
      className={`grid h-[60px] place-items-center rounded-[10px] bg-[#E31B00] ${full ? "w-full" : "w-[200px]"}`}
    >
      <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
        Try Again
      </span>
    </Link>
  );
}

export default function GroupError() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              My Group
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] rounded-[12px] bg-white px-[40px] pt-[69px] pb-[49px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-[12px] bg-[#F0F4F1]">
                <img src={iconError} alt="" className="h-[30px] w-[30px]" />
              </div>
              <h2 className="mt-[20px] text-center text-[25px] leading-[28px] font-bold text-black">
                Something went wrong
              </h2>
              <p className="mt-[15px] text-center text-[18px] leading-[22px] font-semibold text-[#66726C]">
                {MSG}
              </p>
              <div className="mt-[24px] flex justify-center">
                <TryButton />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (W4 698:24172) */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
          <div className="mt-[19px] grid h-[33px] place-items-center">
            <svg width="19" height="9" viewBox="0 0 19 9" fill="none" aria-hidden>
              <path
                d="M1.5 1.5 9.5 7.5l8-6"
                stroke="#6B6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-[51px] text-[30px] leading-[37px] font-bold text-black">
            My Group
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
        </div>
        <div className="relative mt-[70px] rounded-[12px] bg-white px-[40px] pt-[69px] pb-[49px]">
          <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-[12px] bg-[#F0F4F1]">
            <img src={iconError} alt="" className="h-[30px] w-[30px]" />
          </div>
          <h2 className="mt-[20px] text-center text-[18px] leading-[22px] font-bold text-black">
            Something went wrong
          </h2>
          <p className="mx-auto mt-[8px] max-w-[332px] text-center text-[13px] leading-[20px] font-semibold text-[#66726C]">
            {M_MSG}
          </p>
          <div className="mt-[8px] flex justify-center">
            <TryButton />
          </div>
        </div>
        <ExtraBlock mobile className="mt-[50px]" />
        <div className="pb-[60px]" />
      </main>
    </div>
  );
}
