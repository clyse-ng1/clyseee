import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";
import avatarCurtis from "../assets/avatar-ashlynn-curtis.webp";

/* Messages — Figma 889:86886 (list) + 889:86954 (chat overlay).
   No messaging endpoint exists, so the screen stays a static preview:
   conversations are Figma content and sending is disabled (never faked).
   Clicking a row opens the chat panel as an overlay on desktop, full
   view on mobile. */
const PREVIEW = "Track your earnings, manage payouts and grow with Clyse.";
const CONVOS = [
  { name: "Marley Dias", avatar: avatar2 },
  { name: "Aspen Gouse", avatar: avatarAspen },
  { name: "Maria Saris", avatar: avatarAshlynn },
  { name: "Abram Botosh", avatar: avatar3 },
  { name: "Maria Stanton", avatar: avatarKianna },
  { name: "Kaylynn Vetrovs", avatar: avatar1 },
  { name: "Corey Donin", avatar: avatarCurtis },
];

function seed() {
  return [
    { mine: false, text: PREVIEW, time: "10:00AM" },
    { mine: true, text: PREVIEW, time: "10:00AM" },
    { mine: false, text: PREVIEW, time: "10:00AM" },
  ];
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className="grid h-[45px] w-[45px] place-items-center rounded-full bg-mint shadow-[0_0_10px_rgba(0,23,1,0.12)] transition hover:bg-white"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 5l-7 7 7 7"
          stroke="#048B0B"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function ChatPanel({ convo, onClose }) {
  const [msgs] = useState(seed);
  const send = (e) => {
    e.preventDefault();
  };
  return (
    <div className="w-full rounded-[10px] bg-white p-[20px] shadow-[0_0_30px_rgba(0,23,1,0.18)] xl:w-[430px]">
      <div className="flex items-center">
        <img
          src={convo.avatar}
          alt={convo.name}
          className="h-[60px] w-[60px] rounded-full bg-[#D9D9D9] object-cover"
        />
        <div className="ml-[18px]">
          <p className="text-[20px] leading-[24px] font-bold text-ink">
            {convo.name}
          </p>
          <p className="mt-[6px] flex items-center gap-[8px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            <span className="h-[10px] w-[10px] rounded-full bg-clyse" />
            Online
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="ml-auto self-start rounded-full p-[6px] text-[#6B6B6B] transition hover:bg-mint hover:text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <p className="mt-[40px] text-center text-[20px] leading-[24px] font-bold text-[#6B6B6B]">
        Today
      </p>
      <div className="mt-[40px] flex max-h-[420px] flex-col gap-[40px] overflow-y-auto pr-[4px]">
        {msgs.map((m, i) => (
          <div key={i} className={m.mine ? "ml-auto w-[340px] max-w-full" : "w-[340px] max-w-full"}>
            <div
              className={`rounded-[15px] p-[20px] text-[18px] leading-[22px] font-semibold text-[#0E0E0E] ${
                m.mine ? "bg-[#DFFFE0]" : "bg-[#E9E9E9]"
              }`}
            >
              {m.text}
            </div>
            <p
              className={`mt-[15px] text-[18px] leading-[22px] font-semibold text-[#0E0E0E] ${
                m.mine ? "text-right" : "text-right"
              }`}
            >
              {m.time}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={send} className="relative mt-[40px]">
        <input
          value=""
          disabled
          placeholder="Messaging is coming soon"
          aria-label="Messaging is coming soon"
          className="h-[60px] w-full rounded-[15px] border border-ink bg-[#F5F5F5] pr-[100px] pl-[20px] text-[18px] font-semibold text-ink outline-none placeholder:font-semibold placeholder:text-[#999999]"
        />
        <button
          type="submit"
          disabled
          className="absolute top-1/2 right-[10px] h-[40px] w-[80px] -translate-y-1/2 rounded-[10px] bg-[#999999] text-[18px] font-semibold text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative">
          <div className="mt-[29px] mb-[28px]">
            <BackButton onClick={() => navigate(-1)} />
          </div>
          <div className="flex gap-[38px]">
            <Sidebar active="Message" />
            <div className="relative w-[830px] flex-none">
              <h1 className="text-[35px] leading-[43px] font-bold text-black">
                Message
              </h1>
              <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                Stay Connected with your creators and members
              </p>
              <div className="mt-[50px] rounded-[20px] bg-white p-[30px] pt-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
                <div className="flex flex-col gap-[10px]">
                  {CONVOS.map((c, i) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setOpen(i)}
                      className="flex h-[122px] w-full items-center gap-[18px] rounded-[15px] border border-[#999999] bg-white px-[21px] py-[21px] text-left transition hover:border-clyse hover:shadow-[0_0_12px_rgba(4,139,11,0.15)]"
                    >
                      <img
                        src={c.avatar}
                        alt=""
                        className="h-[80px] w-[80px] flex-none rounded-full bg-[#D9D9D9] object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[20px] leading-[24px] font-bold text-ink">
                          {c.name}
                        </span>
                        <span className="mt-[6px] line-clamp-2 block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                          {PREVIEW}
                        </span>
                      </span>
                      <span className="flex-none self-start text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                        10:00AM
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {open != null && (
                <div className="absolute top-[245px] left-[400px] z-20">
                  <ChatPanel convo={CONVOS[open]} onClose={() => setOpen(null)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
          <div className="mt-[14px] flex h-[33px] items-center justify-center rounded-[5px] border border-line bg-white">
            <svg width="16" height="8" viewBox="0 0 19 9" fill="none" aria-hidden>
              <path
                d="M1.5 1.5 9.5 7.5l8-6"
                stroke="#6B6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-[24px]">
            <BackButton onClick={() => (open != null ? setOpen(null) : navigate(-1))} />
          </div>
          {open == null ? (
            <>
              <h1 className="mt-[24px] text-[20px] leading-[25px] font-bold text-black">
                Message
              </h1>
              <p className="text-[14px] leading-[20px] font-semibold text-[#6B6B6B]">
                Stay Connected with your creators and members
              </p>
              <div className="mt-[30px] flex flex-col gap-[10px]">
                {CONVOS.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setOpen(i)}
                    className="flex min-h-[133px] w-full items-center gap-[14px] rounded-[15px] border border-[#999999] bg-white p-[14px] text-left"
                  >
                    <img
                      src={c.avatar}
                      alt=""
                      className="h-[58px] w-[58px] flex-none rounded-full bg-[#D9D9D9] object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[18px] leading-[22px] font-bold text-ink">
                        {c.name}
                      </span>
                      <span className="mt-[4px] line-clamp-2 block text-[13px] leading-[18px] font-semibold text-[#6B6B6B]">
                        {PREVIEW}
                      </span>
                    </span>
                    <span className="flex flex-none self-stretch flex-col justify-end pb-[6px] text-[14px] font-semibold text-[#6B6B6B]">
                      10:00AM
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h1 className="mt-[24px] text-[20px] leading-[25px] font-bold text-black">
                {CONVOS[open].name}
              </h1>
              <p className="text-[14px] leading-[20px] font-semibold text-[#6B6B6B]">
                Stay Connected with your creators and members
              </p>
              <div className="mt-[30px]">
                <ChatPanel convo={CONVOS[open]} onClose={() => setOpen(null)} />
              </div>
            </>
          )}
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
