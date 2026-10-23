import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import BrandTile from "../components/BrandTile";
import LogoMarquee from "../components/LogoMarquee";
import CreateGroupHead from "../components/CreateGroupHead";
import { BlurBg } from "../components/Decor";
import iconErrX from "../assets/error-red-x.svg";
import iconBanknote from "../assets/banknote-white.svg";
import iconPlusInk from "../assets/plus-circle-ink.svg";

const INFO = [
  ["Available Slot:", "12 Slot left"],
  ["Access Method:", "Access Link"],
  ["Group Visibility:", "Public Group"],
  ["Group ID:", "AD-234250569575"],
];

function ErrorButtons() {
  return (
    <>
      <Link
        to="/join/payment-failed"
        className="flex h-[60px] w-full items-center justify-center rounded-[16px] bg-[#E31B00]"
      >
        <span className="text-[18px] leading-[22px] font-semibold text-white">
          Payment Error
        </span>
      </Link>
      <Link
        to="/wallet"
        className="mt-[30px] flex h-[60px] w-full items-center justify-center gap-[10px] rounded-[10px] border border-[#999999] bg-white"
      >
        <img src={iconPlusInk} alt="" className="h-[20px] w-[20px]" />
        <span className="text-[18px] leading-[22px] font-semibold text-ink">
          Fund Wallet
        </span>
      </Link>
    </>
  );
}

export default function JoinSummaryError() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[102px] flex gap-[50px] bg-white">
          <div className="w-[690px] flex-none">
            <CreateGroupHead chip="#DFFFE0" />
            <div className="px-[63px] pt-[30px] pb-[30px]">
              <div className="flex items-start">
                <BrandTile brand="netflix" size={75} plain />
                <div className="ml-[20px]">
                  <p className="text-[18px] leading-[22px] font-semibold text-clyse">
                    WAITLIST DETAILS
                  </p>
                  <p className="mt-[16px] text-[35px] leading-[43px] font-bold text-ink">
                    Netflix Premium
                  </p>
                  <p className="mt-[5px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Premium Plan | Monthly Plan
                  </p>
                </div>
                <p className="mr-[-83px] ml-auto flex items-start">
                  <span className="text-[35px] leading-[43px] font-bold text-ink">
                    N 2,000
                  </span>
                  <span className="mt-[11px] ml-[2px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    /Monthly
                  </span>
                </p>
              </div>
              <div className="mt-[60px] flex gap-[30px]">
                <div className="h-[153px] w-[266px] rounded-[7px] bg-[#DFFFE0] px-[30px] pt-[40px]">
                  <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Fixed Unit Price
                  </p>
                  <p className="mt-[8px] text-[35px] leading-[43px] font-bold text-ink">
                    N 2,000
                  </p>
                </div>
                <div className="h-[151px] w-[268px] rounded-[7px] bg-[#F1F8F1] px-[31px] pt-[41px]">
                  <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Clyse Fee
                  </p>
                  <p className="mt-[17px] text-[35px] leading-[43px] font-bold text-clyse">
                    N200
                  </p>
                </div>
              </div>
              <h2 className="mt-[50px] text-[35px] leading-[43px] font-bold text-ink">
                Group Information
              </h2>
              <div className="mt-[35px] rounded-[30px] bg-white px-[30px] pt-[30px] pb-[30px]">
                {INFO.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-[10px] first:pt-0 last:pb-0">
                    <span className="text-[25px] leading-[35px] font-semibold text-[#4E4E4E]">
                      {k}
                    </span>
                    <span className="text-[25px] leading-[35px] font-semibold text-[#013104]">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[500px] flex-none">
            <div className="px-[50px] pt-[30px] pb-[31px]">
              <p className="text-[35px] leading-[43px] font-bold text-ink">
                Payment Summary
              </p>
            </div>
            <div className="px-[30px] pt-[30px] pb-[30px]">
              <div className="mx-[20px] flex items-center justify-between">
                <span className="text-[25px] leading-[35px] font-semibold text-[#4E4E4E]">
                  Fixed Unit Price
                </span>
                <span className="text-[25px] leading-[35px] font-semibold text-[#013104]">
                  N2,000
                </span>
              </div>
              <div className="mt-[41px] mx-[20px] flex items-center justify-between">
                <span className="text-[25px] leading-[35px] font-semibold text-[#4E4E4E]">
                  Clyse Fee
                </span>
                <span className="text-[25px] leading-[35px] font-semibold text-[#013104]">
                  N200
                </span>
              </div>
              <div className="mt-[61px] flex h-[85px] items-center rounded-[15px] bg-[#DFFFE0] px-[21px]">
                <span className="text-[25px] leading-[35px] font-semibold text-[#036F09]">
                  Total Amount
                </span>
                <span className="ml-auto text-[35px] leading-[43px] font-bold text-[#036F09]">
                  N2,500
                </span>
              </div>
              <p className="mt-[40px] text-[18px] leading-[22px] font-semibold text-black">
                Have a Promo Code or Coupon?
              </p>
              <input
                placeholder="Enter Code or Coupon"
                className="mt-[10px] h-[64px] w-full rounded-[10px] border border-[#999999] bg-white px-[21px] text-[18px] leading-[22px] font-semibold text-ink outline-none placeholder:text-[#999999]"
              />
              <div className="mt-[40px] rounded-[20px] bg-white px-[21px] pt-[31px] pb-[31px]">
                <p className="text-[18px] leading-[22px] font-semibold text-[#FF5038]">
                  Current Wallet Balance
                </p>
                <p className="mt-[10px] ml-[42px] text-[35px] leading-[43px] font-bold text-[#E31B00]">
                  N 2,000
                </p>
              </div>
              <p className="mt-[40px] ml-[60px] text-[25px] leading-[35px] font-semibold text-[#E31B00]">
                Insufficient Balance
              </p>
              <p className="mt-[10px] ml-[20px] text-[18px] leading-[22px] font-semibold text-[#E31B00]">
                Your wallet balance is not enough to cover this payment
              </p>
              <div className="mt-[62px]">
                <ErrorButtons />
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
          <CreateGroupHead />
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[30px] pb-[30px]">
            <div className="flex items-start">
              <BrandTile brand="netflix" size={50} plain />
              <div className="ml-[20px]">
                <p className="text-[18px] leading-[22px] font-semibold text-clyse">
                  WAITLIST DETAILS
                </p>
                <p className="mt-[6px] text-[30px] leading-[37px] font-bold text-ink">
                  Netflix Premium
                </p>
                <p className="mt-[1px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Premium Plan | Monthly Plan
                </p>
              </div>
            </div>
            <div className="mt-[60px] flex gap-[30px]">
              <div className="h-[95px] w-[169px] rounded-[7px] bg-[#DFFFE0] px-[32px] pt-[20px]">
                <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Fixed Unit Price
                </p>
                <p className="text-[25px] leading-[30px] font-bold text-ink">
                  N 2,000
                </p>
              </div>
              <div className="h-[97px] w-[171px] rounded-[7px] bg-[#F1F8F1] px-[53px] pt-[21px]">
                <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Clyse Fee
                </p>
                <p className="text-[25px] leading-[30px] font-bold text-clyse">
                  N200
                </p>
              </div>
            </div>
            <h2 className="mt-[30px] text-[25px] leading-[30px] font-bold text-ink">
              Group Information
            </h2>
            <div className="mt-[28px] rounded-[30px] bg-white px-[14px] pt-[30px] pb-[30px]">
              {INFO.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-[10px] first:pt-0 last:pb-0">
                  <span className="text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
                    {k}
                  </span>
                  <span className="text-[18px] leading-[22px] font-semibold text-[#013104]">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[30px] pb-[99px]">
            <p className="text-[20px] leading-[24px] font-bold text-ink">
              Payment Summary
            </p>
            <div className="mt-[30px] flex items-center justify-between">
              <span className="ml-[20px] text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
                Fixed Unit Price
              </span>
              <span className="mr-[20px] text-[25px] leading-[35px] font-semibold text-[#013104]">
                N2,000
              </span>
            </div>
            <div className="mt-[41px] flex items-center justify-between">
              <span className="ml-[20px] text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
                Clyse Fee
              </span>
              <span className="mr-[20px] text-[25px] leading-[35px] font-semibold text-[#013104]">
                N200
              </span>
            </div>
            <div className="mt-[61px] flex h-[79px] items-center rounded-[15px] bg-[#DFFFE0] px-[21px]">
              <span className="text-[18px] leading-[22px] font-semibold text-[#036F09]">
                Total Amount
              </span>
              <span className="ml-auto text-[30px] leading-[37px] font-bold text-[#036F09]">
                N2,500
              </span>
            </div>
            <p className="mt-[40px] text-[18px] leading-[22px] font-semibold text-black">
              Have a Promo Code or Coupon?
            </p>
            <input
              placeholder="Enter Code or Coupon"
              className="mt-[10px] h-[64px] w-full rounded-[10px] border border-[#999999] bg-white px-[21px] text-[18px] leading-[22px] font-semibold text-ink outline-none placeholder:text-[#999999]"
            />
            <div className="mt-[40px] rounded-[20px] bg-white px-[21px] pt-[31px] pb-[31px]">
              <p className="text-[18px] leading-[22px] font-semibold text-[#FF5038]">
                Current Wallet Balance
              </p>
              <div className="mt-[10px] flex items-center gap-[10px]">
                <span className="grid h-[32px] w-[32px] flex-none place-items-center rounded-[14px] bg-[#E31B00]">
                  <img src={iconBanknote} alt="" className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[35px] leading-[43px] font-bold text-[#E31B00]">
                  N 2,000
                </span>
              </div>
            </div>
            <div className="mt-[40px] ml-[20px] flex items-center gap-[10px]">
              <img src={iconErrX} alt="" className="h-[30px] w-[30px]" />
              <p className="text-[25px] leading-[35px] font-semibold text-[#E31B00]">
                Insufficient Balance
              </p>
            </div>
            <p className="mt-[10px] ml-[20px] text-[18px] leading-[22px] font-semibold text-[#E31B00]">
              Your wallet balance is not enough to cover this payment
            </p>
            <div className="mt-[62px]">
              <ErrorButtons />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
