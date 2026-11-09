import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import { BlurBg } from "../components/Decor";
import { api } from "../lib/api";
import { useGroupId } from "../lib/useGroup";

function LinkGlyph({ className = "h-[60px] w-[60px]" }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" className={className} aria-hidden>
      <path
        d="M25 35a8 8 0 0 0 11.3 0l6.4-6.4a8 8 0 0 0-11.3-11.3l-3.2 3.2"
        stroke="#048B0B"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M35 25a8 8 0 0 0-11.3 0l-6.4 6.4a8 8 0 0 0 11.3 11.3l3.2-3.2"
        stroke="#048B0B"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function WhatsGlyph() {
  return (
    <svg viewBox="0 0 30 30" className="h-[30px] w-[30px]" aria-hidden>
      <circle cx="15" cy="15" r="15" fill="#25D366" />
      <path
        d="M15 7.5c-4.1 0-7.5 3.4-7.5 7.5 0 1.3.4 2.6 1 3.7l-1 3.8 3.9-1c1.1.6 2.3.9 3.6.9 4.1 0 7.5-3.4 7.5-7.5S19.1 7.5 15 7.5Zm0 13.6c-1.1 0-2.2-.3-3.1-.9l-.2-.1-2.3.6.6-2.2-.2-.2c-.6-.9-.9-2-.9-3.2 0-3.3 2.7-6 6.1-6s6.1 2.7 6.1 6-2.7 5.9-6.1 5.9Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function TeleGlyph() {
  return (
    <svg viewBox="0 0 30 30" className="h-[30px] w-[30px]" aria-hidden>
      <circle cx="15" cy="15" r="15" fill="#229ED9" />
      <path
        d="m8.5 15.3 14-6.1c.6-.2 1 .4.6.9l-6 6.5-.3 4.1c0 .6-.7.8-1.1.4l-2-1.9-3.4 2.1c-.4.3-1 0-.9-.5l1.1-5.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function MoreGlyph() {
  return (
    <span className="grid h-[30px] w-[30px] place-items-center rounded-[5px] bg-[#E9E9E9]">
      <svg viewBox="0 0 20 6" className="h-[6px] w-[20px]" aria-hidden>
        <circle cx="3" cy="3" r="2.4" fill="#001701" />
        <circle cx="10" cy="3" r="2.4" fill="#001701" />
        <circle cx="17" cy="3" r="2.4" fill="#001701" />
      </svg>
    </span>
  );
}

export default function GroupShare() {
  const location = useLocation();
  const [groupId, resolved] = useGroupId(location.state?.group_id);
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState(null);
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    if (!groupId) return;
    let live = true;
    (async () => {
      const list = await api(`/member/groups/invites?group_id=${groupId}`);
      if (!live) return;
      const active = (list.data?.invites || []).find((i) => i.status === "active");
      if (active?.token) {
        setToken(active.token);
        return;
      }
      const created = await api("/member/groups/invites", {
        method: "POST",
        body: { group_id: groupId },
      });
      if (!live) return;
      if (created.data?.invite?.token) setToken(created.data.invite.token);
      else setInviteError(created.error?.message || "This group can't take invites right now.");
    })();
    return () => {
      live = false;
    };
  }, [groupId]);

  if (resolved && !groupId) return <Navigate to="/groups/empty" replace />;

  /* Backend: group invite token = 24 uppercase chars, URL-safe, so no
     encoding. A group with no active invite (still awaiting admin approval)
     gets a message, never a stand-in link. */
  const link = token ? `${window.location.origin}/join/${token}` : null;
  const pendingMsg = "Your group can be shared after admin approval.";
  const wa = link ? `https://wa.me/?text=${encodeURIComponent(`Join my group: ${link}`)}` : null;
  const tg = link ? `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent("Join my group")}` : null;
  function doCopy() {
    if (link && navigator.clipboard) navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  function doMore() {
    if (!link) return;
    if (navigator.share) {
      navigator.share({ title: "Join my group", text: "Join my group", url: link });
    } else {
      doCopy();
    }
  }
  const tiles = [
    { label: "WhatsApp", glyph: <WhatsGlyph />, href: wa },
    { label: "Telegram", glyph: <TeleGlyph />, href: tg },
    { label: "More", glyph: <MoreGlyph />, action: doMore },
  ];
  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma BLUR BG at page level so the mobile branch gets it too. */}
      <BlurBg variant="hero" />
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Invite Member
            </h1>
            <div className="mt-[50px] rounded-[20px] border border-clyse bg-white px-[63px] pt-[70px] pb-[70px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <p className="text-center text-[35px] leading-[43px] font-bold text-ink">
                Share your group link
              </p>
              <p className="mt-[10px] text-center text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
                Copy the link and share it with people you want to invite
              </p>
              <div className="mt-[10px] flex h-[66px] items-center rounded-[15px] border border-[#999999] px-[16px]">
                <span className={`truncate text-[18px] leading-[22px] font-semibold ${link ? "text-black" : "text-[#6B6B6B]"}`}>
                  {link || pendingMsg}
                </span>
                <button
                  onClick={doCopy}
                  disabled={!link}
                  className={`ml-auto grid h-[44px] w-[111px] flex-none place-items-center rounded-[10px] bg-[#D9D9D9] ${link ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                >
                  <span className="text-[18px] leading-[22px] font-semibold text-black">
                    {copied ? "Copied" : "Copy"}
                  </span>
                </button>
              </div>
              {inviteError && (
                <p className="mt-[12px] text-center text-[14px] font-semibold text-[#FF0000]">
                  {inviteError}
                </p>
              )}
              {link && (
                <p className="mt-[50px] text-center text-[18px] leading-[22px] font-semibold text-ink">
                  Or invite via
                </p>
              )}
              <div className={`mt-[50px] flex justify-center gap-[10px] ${link ? "" : "hidden"}`}>
                {tiles.map((t) =>
                  t.href ? (
                    <a
                      key={t.label}
                      href={t.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-[100px] w-[221px] flex-col items-center rounded-[15px] bg-white pt-[21px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
                    >
                      {t.glyph}
                      <span className="mt-[5px] text-[18px] leading-[22px] font-semibold text-ink">
                        {t.label}
                      </span>
                    </a>
                  ) : (
                    <button
                      key={t.label}
                      onClick={t.action}
                      className="flex h-[100px] w-[221px] cursor-pointer flex-col items-center rounded-[15px] bg-white pt-[21px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
                    >
                      {t.glyph}
                      <span className="mt-[5px] text-[18px] leading-[22px] font-semibold text-ink">
                        {t.label}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (responsive: no mobile Figma) */}
      <main className="relative xl:hidden">
        <div className="relative bg-white px-[30px] pt-[30px] pb-[40px]">
          <h1 className="mt-[0px] text-[30px] leading-[37px] font-bold text-black">
            Invite Member
          </h1>
          <div className="mt-[26px] rounded-[20px] border border-clyse bg-white px-[20px] pt-[30px] pb-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
            <p className="text-center text-[25px] leading-[30px] font-bold text-ink">
              Share your group link
            </p>
            <p className="mt-[10px] text-center text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
              Copy the link and share it with people you want to invite
            </p>
            <div className="mt-[20px] flex h-[66px] items-center rounded-[15px] border border-[#999999] px-[16px]">
              <span className={`truncate text-[14px] leading-[17px] font-semibold ${link ? "text-black" : "text-[#6B6B6B]"}`}>
                {link || pendingMsg}
              </span>
              <button
                onClick={doCopy}
                disabled={!link}
                className={`ml-[8px] grid h-[44px] w-[80px] flex-none place-items-center rounded-[10px] bg-[#D9D9D9] ${link ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
              >
                <span className="text-[16px] leading-[20px] font-semibold text-black">
                  {copied ? "Copied" : "Copy"}
                </span>
              </button>
            </div>
            {inviteError && (
              <p className="mt-[12px] text-center text-[13px] font-semibold text-[#FF0000]">
                {inviteError}
              </p>
            )}
            {link && (
              <p className="mt-[30px] text-center text-[16px] leading-[20px] font-semibold text-ink">
                Or invite via
              </p>
            )}
            <div className={`mt-[20px] flex justify-center gap-[10px] ${link ? "" : "hidden"}`}>
              {tiles.map((t) => {
                const inner = (
                  <>
                    {t.glyph}
                    <span className="mt-[5px] text-[14px] leading-[17px] font-semibold text-ink">
                      {t.label}
                    </span>
                  </>
                );
                return t.href ? (
                  <a
                    key={t.label}
                    href={t.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-[90px] w-[96px] flex-col items-center rounded-[15px] bg-white pt-[16px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
                  >
                    {inner}
                  </a>
                ) : (
                  <button
                    key={t.label}
                    onClick={t.action}
                    className="flex h-[90px] w-[96px] cursor-pointer flex-col items-center rounded-[15px] bg-white pt-[16px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
