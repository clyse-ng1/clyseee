import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { Footer, MobileFooter } from "../components/Footer";
import iconBalance from "../assets/balance-glyph.svg";
import iconHeroGlyph from "../assets/hero-glyph.svg";
import iconEmpty from "../assets/empty-icon.svg";
import iconFundPlus from "../assets/fund-plus.svg";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconPlusWhite from "../assets/plus-white.svg";
import iconArrowInk from "../assets/arrow-ink.svg";
import chevronDown from "../assets/sidecard-chevron.svg";
import chevronRight from "../assets/angle-right.svg";
import avatarAccount from "../assets/avatar-account.webp";
import ctaDash from "../assets/cta-dash.webp";

/* Wallet with no transactions (Figma 484:12622 desktop / 484:13057 mobile).
   NOTES: (1) Copy fixes: "transaction" -> "transactions", "ormake" ->
   "or make". (2) The mobile NGN pill sits at a fixed x (219px), so its gap
   from the short "N0.00" amount is much wider than on the wallet page. */
export default function WalletEmpty() {
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
            <div className="mt-[50px] h-[361px] rounded-[12px] bg-white pt-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <span className="mx-auto flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#DFFFE0]">
                <img src={iconEmpty} alt="" className="w-[24px]" />
              </span>
              <p className="mt-[20px] text-center text-[25px] leading-[35px] font-semibold text-black">
                No transactions yet
              </p>
              <p className="mx-auto mt-[8px] max-w-[588px] text-center text-[18px] leading-[22px] font-semibold text-[#66726C]">
                Your wallet transactions will appear here once you fund your
                wallet or make a subscription payment.
              </p>
              <Link
                to="/wallet"
                className="bg-btn mx-auto mt-[24px] flex h-[60px] w-[200px] items-center rounded-[10px] pl-[28px]"
              >
                <span className="relative flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full bg-white">
                  <img src={iconPlusWhite} alt="" className="absolute w-[18px]" />
                  <img src={iconFundArrow} alt="" className="absolute w-[15px]" />
                </span>
                <span className="ml-[10px] text-[18px] font-semibold text-mint">
                  Fund Wallet
                </span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <div className="hidden xl:block">
        <Footer mt="mt-[514px]" />
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

        <div className="bg-btn relative mt-[50px] px-[30px] pt-[32px] pb-[32px]">
          <div className="flex h-[32px] items-center">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#048B0B]">
              <img src={iconBalance} alt="" className="w-[18px]" />
            </span>
            <span className="ml-[8px] text-[18px] leading-[22px] font-semibold text-white">
              Available Balance
            </span>
          </div>
          <div className="relative mt-[28px] flex h-[37px] items-center">
            <p className="text-[30px] leading-[37px] font-bold text-white">
              &#8358;0.00
            </p>
            <span className="absolute top-[2px] left-[219px] flex h-[28px] w-[62px] items-center justify-center rounded-[9px] bg-[#048B0B] text-[13px] leading-[20px] font-semibold text-white">
              NGN
            </span>
          </div>
          <p className="mt-[5px] text-[14px] leading-[20px] text-white">
            Ready for your next shared subscription.
          </p>
          <div className="mt-[32px] space-y-[25px]">
            <button
              type="button"
              className="relative flex h-[60px] w-full items-center justify-center rounded-[6.94px] bg-[#F1F8F1]"
            >
              <img
                src={iconFundArrow}
                alt=""
                className="absolute left-[30px] w-[15px]"
              />
              <span className="flex items-center">
                <img src={iconFundPlus} alt="" className="w-[18px]" />
                <span className="ml-[12px] text-[18px] font-semibold text-ink">
                  Add Fund
                </span>
              </span>
            </button>
            <button
              type="button"
              className="relative flex h-[60px] w-full items-center justify-center rounded-[6.94px] bg-[#048B0B]"
            >
              <img
                src={iconPlusWhite}
                alt=""
                className="absolute left-[28px] w-[18px]"
              />
              <span className="flex items-center">
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
                  <img src={iconArrowInk} alt="" className="w-[15px] rotate-180" />
                </span>
                <span className="ml-[10px] text-[18px] font-semibold text-white">
                  Add Fund
                </span>
              </span>
            </button>
          </div>
          <span className="absolute top-[58px] right-[30px] flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white">
            <img src={iconHeroGlyph} alt="" className="w-[44px]" />
          </span>
        </div>

        <div className="relative mt-[50px] bg-white pt-[64px] pb-[40px]">
          <span className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#DFFFE0]">
            <img src={iconEmpty} alt="" className="w-[24px]" />
          </span>
          <p className="mt-[20px] text-center text-[18px] leading-[22px] font-semibold text-black">
            No transactions yet
          </p>
          <p className="mx-[40px] mt-[8px] text-center text-[13px] leading-[20px] font-semibold text-[#66726C]">
            Your wallet transactions will appear here once you fund your wallet
            or make a subscription payment.
          </p>
          <Link
            to="/wallet"
            className="bg-btn mx-auto mt-[24px] flex h-[50px] w-[200px] items-center rounded-[6.94px] pl-[29px]"
          >
            <span className="relative flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full bg-white">
              <img src={iconPlusWhite} alt="" className="absolute w-[18px]" />
              <img src={iconFundArrow} alt="" className="absolute w-[15px]" />
            </span>
            <span className="ml-[10px] text-[18px] font-semibold text-mint">
              Fund Wallet
            </span>
          </Link>
        </div>

        <div className="bg-mintband relative mt-[50px] rounded-[13.87px] pb-[20px]">
          <h2 className="pt-[20px] text-center text-[24.27px] leading-[30px] font-bold text-ink">
            Become an Owner
          </h2>
          <p className="mt-[20px] text-center text-[17.34px] leading-[25px] font-semibold text-ink">
            Save money by offering your subscription
          </p>
          <Link
            to="/create-group"
            className="bg-btn mx-auto mt-[21px] flex h-[42px] w-[139px] items-center rounded-[6.94px] pl-[20px]"
          >
            <span className="relative h-[13px] w-[26px] flex-none">
              <img
                src={iconFundArrow}
                alt=""
                className="absolute top-[1px] left-0 w-[10px]"
              />
              <img
                src={iconPlusWhite}
                alt=""
                className="absolute top-0 left-[13px] w-[13px]"
              />
            </span>
            <span className="ml-[2px] text-[12.48px] font-semibold text-mint">
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
