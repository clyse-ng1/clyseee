import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { Footer, MobileFooter } from "../components/Footer";
import iconError from "../assets/error-icon.svg";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconPlusWhite from "../assets/plus-white.svg";
import chevronDown from "../assets/sidecard-chevron.svg";
import chevronRight from "../assets/angle-right.svg";
import avatarAccount from "../assets/avatar-account.webp";
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
      <main className="relative mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px]">
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
        <Footer mt="mt-[524px]" />
      </div>

      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative bg-white px-[30px] pt-[30px] pb-[21px]">
          <div className="flex items-center gap-[6px]">
            <img
              src={avatarAccount}
              alt="Marcus Saris"
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="text-[24.77px] leading-[28px] font-bold text-ink">
                Marcus Saris
              </p>
              <p className="text-[12.88px] leading-[20px] font-semibold text-[#6B6B6B]">
                Member on Clyse Since 20/11/2026
              </p>
            </div>
          </div>
          <div className="mt-[19px] flex h-[33px] items-center justify-center bg-white">
            <img src={chevronDown} alt="" className="w-[19px]" />
          </div>
        </div>

        <div className="relative mx-[30px] -mt-[1px] flex h-[50px] items-center bg-white">
          <span className="pl-[21px] text-[17.83px] font-semibold text-black">
            Service name
          </span>
          <img src={chevronRight} alt="" className="mr-[21px] ml-auto w-[24px]" />
        </div>

        <div className="relative mx-[30px] mt-[18px]">
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            Manage your balance, fund your wallet and track your transactions
          </p>
        </div>

        <div className="relative mt-[50px] bg-white pt-[69px] pb-[49px]">
          <span className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#F0F4F1]">
            <img src={iconError} alt="" className="w-[29px]" />
          </span>
          <p className="mt-[20px] text-center text-[25px] leading-[35px] font-semibold text-black">
            Wallet unavailable
          </p>
          <Link
            to="/wallet"
            className="bg-btn relative mx-auto mt-[54px] flex h-[50px] w-[200px] items-center justify-center rounded-[6.94px]"
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
            <span className="text-[18px] font-semibold text-mint">
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
            src={ctaDash}
            alt=""
            className="mx-[28px] mt-[21px] h-[209px] w-[375px] object-cover"
          />
        </div>
      </main>
      <div className="xl:hidden">
        <MobileFooter />
      </div>
    </div>
  );
}
