import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer, MobileFooter } from "../components/Footer";
import MobileCta from "../components/MobileCta";
import DesktopCta from "../components/DesktopCta";
import { BlurBg } from "../components/Decor";
import iconMovies from "../assets/icon-movies.svg";
import iconCheckBadge from "../assets/icon-check-badge.svg";
import iconFlash from "../assets/icon-flash.svg";
import iconSort from "../assets/icon-sort.svg";
import iconChevRight from "../assets/icon-chev-right.svg";
import iconChevDown from "../assets/icon-chev-down.svg";
import iconChevron from "../assets/icon-chevron.svg";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";
import avatarLydia from "../assets/avatar-ashlynn.webp";
import avatarKianna from "../assets/avatar-kianna.webp";
import avatarLydiaCurtis from "../assets/avatar-ashlynn-curtis.webp";
import avatarAspen from "../assets/avatar-aspen.webp";

/* Subscription group page — desktop Figma 257:3624 "Group Page New", mobile
   Figma 263:5282 "Group Page Mobile" (back buttons return to "/"). Only the 7
   unique member cards are built (Figma shows 12: 5 Aspen Dupes are omitted). */

const MEMBERS = [
  { avatar: avatar1, name: "Marcus" },
  { avatar: avatarLydia, name: "Ashlynn" },
  { avatar: avatar2, name: "Davis" },
  { avatar: avatarKianna, name: "Kianna" },
  { avatar: avatarLydiaCurtis, name: "Ashlynn C." },
  { avatar: avatar3, name: "Abram" },
  { avatar: avatarAspen, name: "Aspen" },
];

function GroupCard({ avatar, name }) {
  return (
    <div className="flex h-[150px] items-center rounded-[20px] border border-line bg-white pl-[31px] shadow-[0_0_10px_rgba(0,23,1,0.25)]">
      <img
        src={avatar}
        alt=""
        className="h-[100px] w-[100px] rounded-full border-2 border-mint object-cover shadow-[0_2px_2px_rgba(0,23,1,0.25)]"
      />
      <div className="ml-[31px] w-[250px]">
        <h3 className="text-[25px] leading-[28px] font-bold text-ink">
          {name}&rsquo;s Offer
        </h3>
        <p className="mt-[3px] text-[13px] leading-[20px] text-ink">
          <span className="font-semibold">Share a</span>{" "}
          <span className="font-bold">Netflix Premium</span>
        </p>
        <span className="mt-[3px] inline-flex h-[24px] items-center gap-[4px] rounded-[3.58px] bg-[#D9EEDA] px-[10px] text-[12px] leading-[20px] font-semibold text-clyse">
          <img src={iconCheckBadge} alt="" className="h-[16px] w-[16px]" />
          VERIFIED INVOICE
        </span>
        <p className="mt-[16px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
          Last place available
        </p>
      </div>
      <div className="ml-auto w-[193px]">
        <div className="flex h-[47px] items-center justify-center rounded-[10px] bg-[#B1DBB3] text-[25px] leading-[35px] font-semibold text-ink">
          N 2,000
          <span className="text-[10px] leading-[20px] font-semibold text-[#013104]">
            /Monthly
          </span>
        </div>
        <div className="mt-[28px] flex justify-end pr-[15px]">
          <img src={iconChevRight} alt="" className="h-[22px] w-[12px] text-ink" />
        </div>
      </div>
    </div>
  );
}

function MobileGroupCard({ avatar, name }) {
  return (
    <div className="flex h-[92px] items-start rounded-[12.29px] border-[0.61px] border-[#BABABA] bg-white shadow-[0_0_6.14px_rgba(0,23,1,0.25)]">
      <img
        src={avatar}
        alt=""
        className="mt-[15px] ml-[19px] h-[61px] w-[61px] rounded-full border-2 border-mint object-cover shadow-[1.23px_1.23px_4.3px_rgba(0,23,1,0.25)]"
      />
      <div className="mt-[11px] ml-[20px]">
        <h3 className="text-[15.36px] leading-[17.2px] font-bold text-ink">
          {name}&rsquo;s Offer
        </h3>
        <p className="mt-[3px] text-[7.99px] leading-[12.29px] text-ink">
          <span className="font-semibold">Share a</span>{" "}
          <span className="font-bold">Netflix Premium</span>
        </p>
        <span className="mt-[2px] inline-flex h-[15px] items-center gap-[3px] rounded-[2.2px] bg-[#D9EEDA] px-[6px] text-[7.37px] leading-[12.29px] font-semibold text-clyse">
          <img src={iconCheckBadge} alt="" className="h-[10px] w-[10px]" />
          VERIFIED INVOICE
        </span>
        <p className="mt-[10px] text-[7.99px] leading-[12.29px] font-semibold text-[#6B6B6B]">
          Last place
        </p>
      </div>
      <div className="ml-auto w-[119px]">
        <div className="flex h-[29px] items-center justify-center rounded-[6.14px] bg-[#B1DBB3] text-[15.36px] leading-[21.5px] font-semibold text-ink">
          N 2,000
          <span className="text-[6.14px] leading-[12.29px] font-semibold text-[#013104]">
            /Monthly
          </span>
        </div>
        <div className="mt-[17px] flex justify-end pr-[9px]">
          <img src={iconChevRight} alt="" className="h-[13px] w-[7px] text-ink" />
        </div>
      </div>
    </div>
  );
}

export default function Group() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ---------- Desktop ---------- */}
      <main className="relative hidden overflow-x-clip xl:block">
        <BlurBg variant="hero" />
        <div className="relative mx-auto max-w-[1440px] px-[20px] min-[1440px]:px-[100px]">
          <div className="relative mt-[103px] flex h-[50px] items-center">
            <Link
              to="/marketplace"
              aria-label="Back to home"
              className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-mint shadow-[2.5px_2.5px_8.75px_rgba(0,23,1,0.25)] transition hover:opacity-90"
            >
              <img src={iconChevron} alt="" className="h-[30px] w-[30px] rotate-90" />
            </Link>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <img src={iconMovies} alt="" className="h-[50px] w-[50px]" />
              <h1 className="ml-[14px] text-[35px] leading-[42.67px] font-bold text-ink">
                Movies &amp; Series
              </h1>
            </div>
          </div>

          <div className="mt-[50px] flex items-start gap-[17px]">
            <aside className="w-[360px] flex-none rounded-[20px] border border-line bg-white px-[21px] pt-[31px] pb-[31px] shadow-[2px_2px_7px_rgba(0,23,1,0.25)]">
              <div className="bg-btn flex h-[50px] items-center rounded-[10px] border border-line pl-[21px] text-[25px] leading-[35px] font-semibold text-mint">
                Netflix Premium
              </div>
              <div className="mt-[23px] flex h-[50px] items-center justify-between rounded-[10px] border border-line bg-white px-[21px] text-[18px] leading-[22px] font-semibold text-black">
                Service name
                <img src={iconChevRight} alt="" className="h-[22px] w-[12px] text-ink" />
              </div>
              <div className="mt-[23px]">
                <p className="flex items-center text-[18px] leading-[22px] font-semibold text-black">
                  <img src={iconCheckBadge} alt="" className="h-[20px] w-[20px]" />
                  <span className="ml-[10px]">Verified Ownership</span>
                </p>
                <p className="mt-[10px] text-[15px] leading-[18.28px] font-semibold text-[#4E4E4E]">
                  The owner had their subscription verified by providing an invoice.
                </p>
              </div>
              <div className="mt-[22px]">
                <p className="flex items-center text-[18px] leading-[22px] font-semibold text-black">
                  <img
                    src={iconFlash}
                    alt=""
                    className="mt-[1px] ml-[4px] h-[18px] w-[12px]"
                  />
                  <span className="ml-[10px]">Instant Approval</span>
                </p>
                <p className="mt-[10px] text-[15px] leading-[18.28px] font-semibold text-[#4E4E4E]">
                  The owner instantly accepts new co-subscribers
                </p>
              </div>
              <div className="mt-[23px] flex h-[50px] items-center justify-between rounded-[10px] border border-line bg-white px-[21px] text-[18px] leading-[22px] font-semibold text-black">
                Sort
                <img src={iconSort} alt="" className="h-[12px] w-[18px]" />
              </div>
            </aside>

            <div className="flex w-[862px] flex-none flex-col gap-[10px]">
              {MEMBERS.map((m) => (
                <GroupCard key={m.name} avatar={m.avatar} name={m.name} />
              ))}
            </div>
          </div>

          <DesktopCta />
        </div>
      </main>

      {/* ---------- Mobile ---------- */}
      <main className="relative overflow-x-clip xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[20px]">
          <div className="mt-[35px] flex h-[40px] items-center">
            <Link
              to="/marketplace"
              aria-label="Back to home"
              className="flex h-[40px] w-[40px] flex-none items-center justify-center rounded-full bg-mint shadow-[1.78px_1.78px_6.22px_rgba(0,23,1,0.25)]"
            >
              <img src={iconChevron} alt="" className="h-[21px] w-[21px] rotate-90" />
            </Link>
            <img src={iconMovies} alt="" className="ml-[25px] h-[40px] w-[40px] flex-none" />
            <h1 className="ml-[14px] text-[30px] leading-[36.57px] font-bold whitespace-nowrap text-ink">
              Movies &amp; Series
            </h1>
          </div>

          <div className="mt-[50px] rounded-[20px] border border-line bg-white px-[21px] pt-[31px] pb-[20px] shadow-[2px_2px_7px_rgba(0,23,1,0.25)]">
            <div className="bg-btn flex h-[50px] items-center rounded-[10px] border border-line pl-[21px] text-[25px] leading-[35px] font-semibold text-mint">
              Netflix Premium
            </div>
            <div className="relative mt-[20px] h-[33px] rounded-[5px] border border-line bg-white">
              <img
                src={iconChevDown}
                alt=""
                className="absolute top-1/2 left-1/2 h-[9px] w-[16px] -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>
          <div className="mt-[20px] flex h-[50px] items-center justify-between rounded-[10px] border border-line bg-white px-[21px] text-[18px] leading-[22px] font-semibold text-black">
            Service name
            <img src={iconChevRight} alt="" className="h-[22px] w-[12px] text-ink" />
          </div>

          <div className="flex flex-col gap-[6px]">
            {MEMBERS.map((m) => (
              <MobileGroupCard key={m.name} avatar={m.avatar} name={m.name} />
            ))}
          </div>
        </div>

        <MobileCta />
      </main>

      <Footer />
      <MobileFooter />
    </div>
  );
}
