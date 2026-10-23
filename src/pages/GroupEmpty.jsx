import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MiniButton from "../components/MiniButton";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import iconDocSearch from "../assets/icon-doc-search-green.svg";
import iconPlusWhite from "../assets/plus-circle-white.svg";

const SUB = "Manage your subscriptions, view details, and track your groups.";

function CreateButton({ className = "", full = false }) {
  return (
    <Link
      to="/create-group"
      className={`bg-btn flex h-[60px] items-center justify-center rounded-[10px] ${full ? "w-full" : "w-[200px]"} ${className}`}
    >
      <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
        Create Group
      </span>
    </Link>
  );
}

export default function GroupEmpty() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
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
            <div className="mt-[50px] rounded-[20px] bg-white px-[40px] pt-[40px] pb-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <img src={iconDocSearch} alt="" className="mx-auto h-[70px] w-[70px]" />
              <h2 className="mt-[12px] text-center text-[25px] leading-[35px] font-bold text-ink">
                No Activated Group Yet
              </h2>
              <p className="mt-[12px] text-center text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
                You don&apos;t have any activated group at the moment.
                <br />
                Explore groups and get started
              </p>
              <div className="mt-[40px] flex items-center justify-center gap-[30px]">
                <MiniButton variant="gray" to="/" icons={false}>
                  Get in touch
                </MiniButton>
                <CreateButton />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (W3 698:24152): Join Group button, no Get in touch */}
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
        <div className="relative mt-[70px] px-[40px] pt-[40px] pb-[40px]">
          <img src={iconDocSearch} alt="" className="mx-auto h-[70px] w-[70px]" />
          <h2 className="mt-[12px] text-center text-[18px] leading-[22px] font-bold text-ink">
            No Activated Group Yet
          </h2>
          <p className="mt-[12px] text-center text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
            You don&apos;t have any activated group at the moment.
            <br />
            Explore groups and get started
          </p>
          <div className="mt-[40px] flex justify-center">
            <Link
              to="/join"
              className="bg-btn flex h-[60px] w-[200px] items-center justify-center gap-[10px] rounded-[10px]"
            >
              <img src={iconPlusWhite} alt="" className="h-[20px] w-[20px]" />
              <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                Join Group
              </span>
            </Link>
          </div>
        </div>
        <ExtraBlock mobile className="mt-[50px]" />
        <div className="pb-[60px]" />
      </main>
    </div>
  );
}
