import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MiniButton from "../components/MiniButton";
import ExtraBlock from "../components/ExtraBlock";
import { BlurBg } from "../components/Decor";
import iconDocSearch from "../assets/icon-doc-search-green.svg";

/* "You haven't any" -> "don't have any", "Exlore" -> "Explore", literal
   "\n" -> break. Desktop card sits 41px off-centre in Figma — centred. */
const SUB = "Browse available groups and join the waitlist for, We'll notify you when a group becomes available";

export function EmptyCard() {
  return (
    <div className="bg-white px-[40px] pt-[40px] pb-[40px]">
      <img src={iconDocSearch} alt="" className="mx-auto h-[70px] w-[70px]" />
      <h2 className="mt-[12px] text-center text-[25px] leading-[35px] font-bold text-ink">
        No Waitlist Yet
      </h2>
      <p className="mt-[12px] text-center text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
        You don't have any waitlist at the moment.
        <br />
        Explore groups and get started
      </p>
      <div className="mt-[40px] flex flex-col items-center xl:flex-row xl:justify-center">
        <MiniButton variant="dark" to="/join">
          Browse Group
        </MiniButton>
      </div>
    </div>
  );
}

export default function WaitlistEmpty() {
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
            <div className="mx-auto mt-[50px] w-[700px]">
              <EmptyCard />
            </div>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative bg-white xl:hidden">
        <div className="relative bg-white px-[30px] pt-[30px] pb-[40px]">
          <h1 className="mt-[0px] text-[30px] leading-[37px] font-bold text-black">
            Waitlist
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
        </div>
        <div className="relative mt-[50px]">
          <EmptyCard />
        </div>
        <ExtraBlock mobile className="mt-[50px]" />
      </main>
    </div>
  );
}
