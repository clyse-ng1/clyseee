import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MiniButton from "../components/MiniButton";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import iconError from "../assets/error-circle-red.svg";

/* Desktop is a bare centred block (no card, no icon): strip, void, title
   at +194, message, then the button pair. The grey "Get in touch" has no
   background in Figma (bare white text) — rendered as the grey button.
   Literal "\n" text fixed to a break. Mobile keeps its white card. */
const SUB = "Browse available groups and join the waitlist for, We'll notify you when a group becomes available";

function ErrorText() {
  return (
    <>
      <h2 className="text-center text-[25px] leading-[35px] font-bold text-ink">
        Something went wrong
      </h2>
      <p className="mt-[12px] text-center text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
        We couldn't load your waitlist
        <br />
        Please try again
      </p>
    </>
  );
}

export default function WaitlistError() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[101px] flex gap-[38px]">
          <Sidebar active="My Waitlist" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Waitlist
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[194px]">
              <ErrorText />
              <div className="mt-[40px] flex items-center justify-center">
                <MiniButton variant="red" to="/waitlist">
                  Try Again
                </MiniButton>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative bg-white xl:hidden">
        <div className="relative bg-white px-[30px] pt-[46px] pb-[40px]">
          <MemberMini />
          <h1 className="mt-[51px] text-[30px] leading-[37px] font-bold text-black">
            Waitlist
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
        </div>
        <div className="relative mt-[50px] bg-white px-[40px] pt-[40px] pb-[40px]">
          <img src={iconError} alt="" className="mx-auto h-[70px] w-[70px]" />
          <div className="mt-[12px]">
            <ErrorText />
          </div>
          <div className="mt-[40px] flex flex-col items-center">
            <MiniButton variant="red" to="/waitlist">
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
