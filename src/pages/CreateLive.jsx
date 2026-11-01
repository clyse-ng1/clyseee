import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";

const GROUP_LINK = "https://clyse.be/056m_kiH?Tk!suy._ksundhiHS";

/* C8: "visible to member" -> "members". Pasted signup junk omitted. With flow
   state, the link and View Group target go live. */
export function CopyChip({ text = GROUP_LINK, w = "w-[77px]" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={`h-[36px] flex-none rounded-[10px] bg-[#D9D9D9] text-[18px] leading-[22px] font-semibold text-black ${w}`}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default function CreateLive() {
  const s = useLocation().state || {};
  const link = s.link || GROUP_LINK;
  const viewTo = s.group_id
    ? { pathname: "/groups/details", state: { group_id: s.group_id } }
    : "/subscription-group";

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative hidden pb-[100px] xl:block">
        <BlurBg variant="page" />
        <div className="relative mx-[163px] mt-[419px] text-center">
          <h1 className="text-[35px] leading-[43px] font-bold text-ink">
            Group Activated
          </h1>
          <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
            Your group is now live and visible to members
          </p>
          <div className="mx-auto mt-[10px] flex h-[58px] w-[542px] items-center rounded-[15px] px-[16px]">
            <span className="text-[18px] leading-[22px] font-semibold break-all text-black">
              {link}
            </span>
            <span className="ml-auto pl-[16px]">
              <CopyChip text={link} />
            </span>
          </div>
          <Link
            to={viewTo}
            className="bg-btn mx-auto mt-[50px] flex h-[60px] w-[470px] items-center justify-center rounded-[16px] text-[18px] leading-[22px] font-semibold text-[#F1F8F1]"
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
            Group Activated
          </h1>
          <p className="mt-[10px] text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
            Your group is now live and visible to members
          </p>
          <p className="mt-[10px] text-[13px] leading-[20px] font-semibold break-all text-black">
            {link}
          </p>
          <div className="mt-[16px] flex justify-center">
            <CopyChip text={link} />
          </div>
          <Link
            to={viewTo}
            className="bg-btn mt-[50px] flex h-[60px] w-full items-center justify-center rounded-[16px] text-[18px] leading-[22px] font-semibold text-[#F1F8F1]"
          >
            View Group
          </Link>
        </div>
      </main>
    </div>
  );
}
