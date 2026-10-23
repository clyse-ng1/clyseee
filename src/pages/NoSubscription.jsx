import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import MobileSearch from "../components/MobileSearch";
import MobileCats from "../components/MobileCats";
import { Footer, MobileFooter } from "../components/Footer";
import iconSearch from "../assets/icon-search.svg";
import iconChevron from "../assets/icon-chevron.svg";
import iconPencil from "../assets/icon-pencil.svg";

/* NO SUBSCRIPTION PAGE — Figma 202:1360 (1440x1622).
   "Sugest a Service" designer typo fixed to "Suggest a Service".
   No mobile design exists — fluid responsive fallback below xl. */

const PILLS = [
  { label: "All", width: 74 },
  { label: "Movies & Series", width: 194 },
  { label: "Streaming", width: 149 },
  { label: "Music", width: 106 },
  { label: "Security & VPN", width: 190 },
  { label: "Delivery", width: 127 },
  { label: "Cloud", width: 106 },
  { label: "Productivity", width: 164 },
];

export default function NoSubscription() {
  const [activePill, setActivePill] = useState("All");
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="relative overflow-hidden">
        <BlurBg variant="hero" />
        <div className="relative z-[1] mx-auto hidden max-w-[1440px] px-[100px] xl:block">
          {/* Search */}
          <button
            type="button"
            className="mt-[88px] flex h-[80px] w-full items-start rounded-[15px] border-[2px] border-[#58A35B] bg-white text-left shadow-[2px_2px_7px_rgba(0,23,1,0.25)]"
          >
            <img
              src={iconSearch}
              alt=""
              className="mt-[24px] ml-[16px] h-[32px] w-[32px] xl:mt-[22px] xl:ml-[32px] xl:h-[45px] xl:w-[45px]"
            />
            <span className="mt-[28px] ml-[12px] text-[18px] font-semibold text-muted xl:mt-[27px] xl:ml-[39px] xl:text-[25px]">
              Browse Subscription
            </span>
            <img
              src={iconChevron}
              alt=""
              className="mt-[22px] mr-[12px] ml-auto h-[36px] w-[36px] xl:mt-[20px] xl:mr-[32px] xl:h-[50px] xl:w-[50px]"
            />
          </button>

          {/* Categories */}
          <h2 className="mt-[52px] text-[25px] font-semibold leading-[35px] text-ink">
            Categories
          </h2>
          <div className="mt-[10px] flex justify-between gap-[18px] overflow-x-auto pb-2">
            {PILLS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setActivePill(p.label)}
                style={{ width: p.width }}
                className={`flex h-[60px] flex-none items-center justify-center rounded-[10px] text-[18px] font-semibold transition ${
                  activePill === p.label
                    ? "bg-btn text-mint"
                    : "border border-clyse bg-mint text-ink hover:bg-white"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Suggestion */}
          <p className="mt-[98px] text-center text-[20px] font-semibold leading-[28px] text-muted xl:text-[25px] xl:leading-[35px]">
            Your subscription is not on the list
          </p>
          <div className="mt-[15px] flex justify-center">
            <Link
              to="/contact"
              className="bg-btn flex h-[60px] w-[200px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-mint transition hover:opacity-90"
            >
              Suggest a Service
            </Link>
          </div>

          {/* Message card */}
          <div className="bg-white p-[20px] shadow-[0_0_40px_rgba(0,23,1,0.10)] mt-[77px] xl:flex xl:h-[138px] xl:items-center xl:p-0 xl:pl-[40px]">
            <div className="flex items-center gap-[20px]">
              <div className="flex h-[57px] w-[57px] flex-none items-center justify-center rounded-[10px] bg-[#58A35B]/30">
                <img src={iconPencil} alt="" className="h-[44px] w-[44px]" />
              </div>
              <div>
                <p className="text-[20px] font-semibold leading-[28px] text-black xl:text-[25px] xl:leading-[35px]">
                  Can&rsquo;t find the subscription?
                </p>
                <p className="mt-[1px] text-[16px] font-semibold leading-[20px] text-smoke xl:text-[18px] xl:leading-[22px]">
                  Create a custom split
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Mobile (Figma 263:4893) */}
        <div className="relative z-[1] xl:hidden">
          <MobileSearch />
          <MobileCats />
          <div className="mt-[50px] px-[20px] text-center">
            <p className="text-[13px] leading-[20px] font-semibold text-[#999999]">
              Your subscription is not on the list
            </p>
            <Link
              to="/contact"
              className="bg-btn mx-auto mt-[10px] flex h-[42px] w-[139px] items-center justify-center rounded-[6.94px] text-[12.48px] font-semibold text-mint transition hover:opacity-90"
            >
              Suggest a Service
            </Link>
          </div>
          <div className="mt-[50px] flex h-[95px] items-center bg-white pl-[41px] shadow-[0_0_27.74px_rgba(0,23,1,0.10)]">
            <span className="flex h-[40px] w-[40px] flex-none items-center justify-center rounded-[6.94px] bg-[#58A35B]/30">
              <img src={iconPencil} alt="" className="h-[24px] w-[24px]" />
            </span>
            <span className="ml-[13px]">
              <span className="block text-[17.34px] leading-[24.27px] font-semibold text-black">
                Suggest your Subscription
              </span>
              <span className="-mt-px block text-[12.48px] leading-[15.22px] font-semibold text-[#6B6B6B]">
                Browse other available subscriptions
              </span>
            </span>
          </div>
        </div>
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
