import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import iconCheckBig from "../assets/icon-check-big.svg";

/* Activation result — desktop centers a sharp white card; mobile lays the
   same elements out flat (as drawn). ok=false keeps Figma's title and turns
   the message red. With flow state, the failed message is the server's and
   View Group opens the new group. */
export default function CreateResult({ ok = true }) {
  const s = useLocation().state || {};
  const viewTo = s.group_id
    ? { pathname: "/groups/details", state: { group_id: s.group_id } }
    : "/subscription-group";
  const failedMsg = s.message || "Your group is not live and visible to members";

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-[20px] min-[1440px]:mx-[100px] mt-[100px] hidden xl:block">
        <div className="h-[565px] bg-white pt-[100px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
          <div className="mx-auto grid h-[130px] w-[130px] place-items-center rounded-full bg-clyse">
            <img src={iconCheckBig} alt="" className="w-[70px]" />
          </div>
          <h2 className="mt-[50px] text-center text-[35px] leading-[43px] font-bold">
            Group Activated
          </h2>
          <p
            className={`mt-[10px] text-center text-[18px] leading-[22px] font-semibold ${
              ok ? "text-ash" : "text-[#E31B00]"
            }`}
          >
            {ok ? "Your group is now live and visible to members" : failedMsg}
          </p>
          {ok && s.verifyNote && (
            <p className="mt-[10px] px-[30px] text-center text-[15px] leading-[20px] font-semibold text-[#CB5300]">
              Verification needs attention: {s.verifyNote}
            </p>
          )}
          <Link
            to={viewTo}
            className={`mx-auto mt-[50px] grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold ${
              ok ? "text-mint" : "text-white"
            }`}
          >
            View Group
          </Link>
        </div>
        <div className="pb-[100px]" />
      </main>

      {/* Mobile */}
      <main className="relative z-10 xl:hidden">
        <div className="mx-auto mt-[119px] grid h-[90px] w-[90px] place-items-center rounded-full bg-clyse">
          <img src={iconCheckBig} alt="" className="w-[49px]" />
        </div>
        <h2 className="mt-[35px] text-center text-[22px] leading-[27px] font-bold">
          Group Activated
        </h2>
        <p
          className={`mt-[7px] px-[30px] text-center text-[12.48px] leading-[15px] font-semibold ${
            ok ? "text-ash" : "text-[#E31B00]"
          }`}
        >
          {ok ? "Your group is now live and visible to members" : failedMsg}
        </p>
        {ok && s.verifyNote && (
          <p className="mt-[7px] px-[30px] text-center text-[12.48px] leading-[15px] font-semibold text-[#CB5300]">
            Verification needs attention: {s.verifyNote}
          </p>
        )}
        <Link
          to={viewTo}
          className="mx-[30px] mt-[35px] grid h-[50px] w-[370px] place-items-center rounded-[11.1px] bg-btn text-[12.48px] font-semibold text-mint"
        >
          View Group
        </Link>
        <div className="pb-[114px]" />
      </main>
    </div>
  );
}
