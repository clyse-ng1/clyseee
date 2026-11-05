import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import iconError from "../assets/error-icon.svg";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconPlusWhite from "../assets/plus-white.svg";
import chevronRight from "../assets/angle-right.svg";
import MemberMini, { MemberMenuButton } from "../components/MemberMini";
import ctaDash from "../assets/cta-dash.webp";

/* Wallet failed-to-load state (Figma 484:13797 desktop / 484:13879 mobile).
   NOTES: (1) The mobile layout omits the explanatory sub-copy the desktop
   layout shows, and compensates with a taller 54px gap above the button.
   (2) Both "Try Again" buttons centre their label over a left-aligned icon
   pair that slightly overlaps the text, as drawn in Figma. */
export default function WalletError() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="My Wallet" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Wallet
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Manage your balance, fund your wallet and track your transactions
            </p>
            <div className="mt-[50px] h-[351px] rounded-[12px] bg-white pt-[69px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <span className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#F0F4F1]">
                <img src={iconError} alt="" className="w-[29px]" />
              </span>
              <p className="mt-[20px] text-center text-[25px] leading-[35px] font-semibold text-black">
                Wallet unavailable
              </p>
              <p className="mt-[8px] text-center text-[18px] leading-[22px] font-semibold text-[#66726C]">
                We couldn&apos;t load your wallet information
              </p>
              <Link
                to="/wallet"
                className="bg-btn relative mx-auto mt-[24px] flex h-[60px] w-[200px] items-center justify-center rounded-[10px]"
              >
                <span className="absolute left-[30px] h-[18px] w-[36px]">
                  <img
                    src={iconFundArrow}
                    alt=""
                    className="absolute top-[2px] left-0 w-[15px]"
                  />
                  <img
                    src={iconPlusWhite}
                    alt=""
                    className="absolute top-0 left-[18px] w-[18px]"
                  />
                </span>
                <span className="text-[18px] font-semibold text-mint">
                  Try Again
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <div className="hidden xl:block">
      </div>

      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative bg-white px-[30px] pt-[30px] pb-[21px]">
          <MemberMini />
          <MemberMenuButton active="My Wallet" />
        </div>

        <div className="relative z-10 mx-[30px] -mt-[1px] flex h-[50px] items-center rounded-[15px] border border-line bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
          <img src={chevronRight} alt="" className="mr-[21px] ml-auto w-[24px]" />
        </div>

        <div className="relative mx-[30px] mt-[18px]">
          <h1 className="text-[30px] leading-[37px] font-bold text-black">Wallet</h1>
          <p className="mt-[3px] text-[14px] leading-[20px] font-semibold text-[#6B6B6B]">
            Manage your balance, fund your wallet and track your transactions
          </p>
        </div>

        <div className="relative mt-[50px] h-[341px] rounded-[12px] border border-[#DCE6E0] bg-white pt-[69px]">
          <span className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-[12px] bg-[#F0F4F1]">
            <img src={iconError} alt="" className="w-[29px]" />
          </span>
          <p className="mt-[20px] text-center text-[25px] leading-[35px] font-semibold text-black">
            Wallet unavailable
          </p>
          <p className="mx-[40px] mt-[3px] text-center text-[18px] leading-[22px] font-semibold text-[#66726C]">
            We couldn&apos;t load your wallet information. Please try again.
          </p>
          <Link
            to="/wallet"
            className="relative mx-auto mt-[24px] flex h-[50px] w-[200px] items-center justify-center rounded-[10px] bg-[#E31B00]"
          >
            <span className="absolute top-[20px] left-[30px] h-[18px] w-[36px]">
              <img
                src={iconFundArrow}
                alt=""
                className="absolute top-[2px] left-0 w-[15px]"
              />
              <img
                src={iconPlusWhite}
                alt=""
                className="absolute top-0 left-[18px] w-[18px]"
              />
            </span>
            <span className="text-[18px] font-semibold text-[#F1F8F1]">
              Try Again
            </span>
          </Link>
        </div>

        <div className="bg-mintband relative mt-[50px] rounded-[13.87px] pb-[16px]">
          <h2 className="pt-[15px] text-center text-[24.27px] leading-[30px] font-bold text-ink">
            Become an Owner
          </h2>
          <p className="mt-[21px] text-center text-[17.34px] leading-[25px] font-semibold text-ink">
            Save money by offering your subscription
          </p>
          <Link
            to="/create-group"
            className="bg-btn relative mx-auto mt-[21px] flex h-[50px] w-[200px] items-center justify-center rounded-[6.94px]"
          >
            <span className="absolute top-[14px] left-[21px] h-[13px] w-[26px]">
              <img
                src={iconFundArrow}
                alt=""
                className="absolute top-[2px] left-0 w-[10px]"
              />
              <img
                src={iconPlusWhite}
                alt=""
                className="absolute top-0 left-[13px] w-[13px]"
              />
            </span>
            <span className="text-[12.48px] font-semibold text-mint">
              Create
            </span>
          </Link>
          <img
            loading="lazy" decoding="async" src={ctaDash}
            alt=""
            className="mx-[28px] mt-[21px] aspect-[375/209] w-[calc(100%-56px)] max-w-[375px] object-cover"
          />
        </div>
      </main>
      <div className="xl:hidden">
      </div>
    </div>
  );
}
