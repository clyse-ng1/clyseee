import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";

/* C9: title reads "Group Activated" but the body says the group is NOT
   live — fixed to "Group Not Activated". Overlapping signup junk omitted. */
export default function CreateNotActivated() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative hidden pb-[100px] xl:block">
        <BlurBg variant="page" />
        <div className="relative mx-[163px] mt-[419px] text-center">
          <h1 className="text-[35px] leading-[43px] font-bold text-ink">
            Group Not Activated
          </h1>
          <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-[#E31B00]">
            Your group is not live and visible to members
          </p>
          <Link
            to="/subscription-group"
            className="mx-auto mt-[50px] flex h-[60px] w-[470px] items-center justify-center rounded-[16px] bg-[#E31B00] text-[18px] leading-[22px] font-semibold text-white"
          >
            View Group
          </Link>
        </div>
      </main>
      {/* Mobile — no mobile design in Figma; stacked fallback */}
      <main className="relative px-[30px] pb-[60px] xl:hidden">
        <BlurBg variant="page" />
        <div className="relative mt-[250px] text-center">
          <h1 className="text-[30px] leading-[37px] font-bold text-ink">
            Group Not Activated
          </h1>
          <p className="mt-[10px] text-[13px] leading-[20px] font-semibold text-[#E31B00]">
            Your group is not live and visible to members
          </p>
          <Link
            to="/subscription-group"
            className="mt-[50px] flex h-[60px] w-full items-center justify-center rounded-[16px] bg-[#E31B00] text-[18px] leading-[22px] font-semibold text-white"
          >
            View Group
          </Link>
        </div>
      </main>
    </div>
  );
}
