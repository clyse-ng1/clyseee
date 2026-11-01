import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MiniButton from "../components/MiniButton";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import iconError from "../assets/error-circle-red.svg";

const SUB = "Manage your subscriptions, view details, and track your groups.";
const MSG = "We couldn't load your subscription information. Please try again.";
const M_MSG = "We couldn't load your wallet information. Please try again.";

export default function SubError() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="My Subscription" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Subscription
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] rounded-[12px] bg-white pt-[69px] pb-[49px]">
              <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-[12px] bg-[#F0F4F1]">
                <img src={iconError} alt="" className="h-[30px] w-[30px]" />
              </div>
              <h2 className="mt-[20px] text-center text-[25px] leading-[35px] font-bold text-black">
                Subscription unavailable
              </h2>
              <p className="mt-[8px] text-center text-[18px] leading-[22px] font-semibold text-[#66726C]">
                {MSG}
              </p>
              <div className="mt-[24px] flex justify-center">
                <MiniButton variant="red" to="/subscriptions">
                  Try Again
                </MiniButton>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (W2 601:26793) */}
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
            Subscription
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
        </div>
        <div className="relative mt-[70px] rounded-[12px] bg-white pt-[69px] pb-[49px]">
          <div className="mx-auto grid h-[64px] w-[64px] place-items-center rounded-[12px] bg-[#F0F4F1]">
            <img src={iconError} alt="" className="h-[30px] w-[30px]" />
          </div>
          <h2 className="mt-[20px] text-center text-[18px] leading-[22px] font-bold text-black">
            Subscription unavailable
          </h2>
          <p className="mx-auto mt-[8px] max-w-[332px] text-center text-[13px] leading-[20px] font-semibold text-[#66726C]">
            {M_MSG}
          </p>
          <div className="mt-[8px] flex justify-center">
            <MiniButton variant="red" to="/subscriptions">
              Try Again
            </MiniButton>
          </div>
        </div>
        <ExtraBlock mobile className="mt-[50px]" />
        <div className="pb-[60px]" />
      </main>
    </div>
  );
}
