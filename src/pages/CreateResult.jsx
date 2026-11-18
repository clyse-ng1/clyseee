import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import iconCheckBig from "../assets/icon-check-big.svg";

/* Group creation result — Figma GROUP CREATION PAGE 8 (559:20926, success)
   and PAGE 9 (559:20989, failure): white 1240×565 block, 130px status disc,
   title, message, optional share link, 470×60 CTA. ok=false turns the disc
   and CTA red (#FF1E00 / #E31B00) and the message red. */
function CopyChip({ text, size = "desktop" }) {
  const [copied, setCopied] = useState(false);
  const cls =
    size === "desktop"
      ? "h-[44px] w-[111px] text-[18px] leading-[22px]"
      : "h-[36px] w-[77px] text-[12.48px] leading-[15px]";
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`${cls} flex-none rounded-[10px] bg-[#D9D9D9] font-semibold text-black`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function CreateResult({
  ok = true,
  title,
  link,
  viewTo: viewToProp,
  message,
}) {
  const s = useLocation().state || {};
  const groupId = s.group_id || s.groupId || null;
  /* A direct visit to /activated or an incomplete API result must never claim
     success without an actual backend ID to load. */
  const activated = Boolean(ok && groupId);
  const heading = title || (activated ? "Group Activated" : "Group Not Activated");
  const viewTo = viewToProp || (activated
    ? { pathname: "/groups/details", search: `?group_id=${encodeURIComponent(groupId)}`, state: { group_id: groupId } }
    : ok
      ? "/groups"
      : "/create-group");
  const text = message || (activated
    ? "Your group is now live and visible to members"
    : s.message || (ok ? "Activation could not be confirmed. Check My Groups before trying again." : "Your group was not activated. Review the details and try again."));
  const shareLink = activated ? link || s.link || "" : "";
  const actionLabel = activated ? "View Group" : ok ? "View My Groups" : "Try Again";

  return (
    <div className="relative min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-[20px] mt-[100px] hidden min-[1440px]:mx-[100px] xl:block">
        <div className="bg-white pt-[100px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
          <div
            className={`mx-auto grid h-[130px] w-[130px] place-items-center rounded-full ${
              activated ? "bg-clyse" : "bg-[#FF1E00]"
            }`}
          >
            {activated ? <img src={iconCheckBig} alt="" className="w-[70px]" /> : <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="white" strokeWidth="2.6" strokeLinecap="round" /></svg>}
          </div>
          <h2 className="mt-[50px] text-center text-[35px] leading-[43px] font-bold">
            {heading}
          </h2>
          <p
            className={`mt-[10px] text-center text-[18px] leading-[22px] font-semibold ${
              activated ? "text-[#4E4E4E]" : "text-[#E31B00]"
            }`}
          >
            {text}
          </p>
          {activated && s.verifyNote && (
            <p className="mt-[10px] px-[30px] text-center text-[15px] leading-[20px] font-semibold text-[#CB5300]">
              Verification needs attention: {s.verifyNote}
            </p>
          )}
          {activated && shareLink && (
            <div className="mx-auto mt-[10px] flex h-[66px] w-[700px] items-center rounded-[15px] px-[16px]">
              <span className="text-[18px] leading-[22px] font-semibold break-all text-black">
                {shareLink}
              </span>
              <span className="ml-auto pl-[16px]">
                <CopyChip text={shareLink} />
              </span>
            </div>
          )}
          <Link
            to={viewTo}
            className={`mx-auto mt-[50px] grid h-[60px] w-[470px] place-items-center rounded-2xl text-[18px] font-semibold ${
              activated ? "bg-btn text-mint" : "bg-[#E31B00] text-white"
            }`}
          >
            {actionLabel}
          </Link>
        </div>
        <div className="pb-[100px]" />
      </main>

      {/* Mobile */}
      <main className="relative z-10 px-[30px] pb-[114px] xl:hidden">
        <div
          className={`mx-auto mt-[119px] grid h-[90px] w-[90px] place-items-center rounded-full ${
            activated ? "bg-clyse" : "bg-[#FF1E00]"
          }`}
        >
          {activated ? <img src={iconCheckBig} alt="" className="w-[49px]" /> : <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" stroke="white" strokeWidth="2.6" strokeLinecap="round" /></svg>}
        </div>
        <h2 className="mt-[35px] text-center text-[22px] leading-[27px] font-bold">
          {heading}
        </h2>
        <p
          className={`mt-[7px] text-center text-[12.48px] leading-[15px] font-semibold ${
            activated ? "text-[#4E4E4E]" : "text-[#E31B00]"
          }`}
        >
          {text}
        </p>
        {activated && s.verifyNote && (
          <p className="mt-[7px] text-center text-[12.48px] leading-[15px] font-semibold text-[#CB5300]">
            Verification needs attention: {s.verifyNote}
          </p>
        )}
        {activated && shareLink && (
          <div className="mt-[10px] flex items-center rounded-[10px] px-[8px]">
            <span className="text-[12.48px] leading-[15px] font-semibold break-all text-black">
              {shareLink}
            </span>
            <span className="ml-auto pl-[8px]">
              <CopyChip text={shareLink} size="mobile" />
            </span>
          </div>
        )}
        <Link
          to={viewTo}
          className={`mt-[35px] grid h-[50px] w-full place-items-center rounded-[11.1px] text-[12.48px] font-semibold ${
            activated ? "bg-btn text-mint" : "bg-[#E31B00] text-white"
          }`}
        >
          {actionLabel}
        </Link>
      </main>
    </div>
  );
}
