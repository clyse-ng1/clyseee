import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SectionHead from "../components/SectionHead";
import BrandTile from "../components/BrandTile";
import PairButtons from "../components/PairButtons";
import LogoMarquee from "../components/LogoMarquee";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import iconBellGreen from "../assets/side-notification-green.svg";
import { api, kobo } from "../lib/api";

const STEPS = [
  "Join the queue without paying today.",
  "CLYSE matches you when a compatible space or new group becomes available.",
  "We'll notify you by email and in-app message so you can confirm your place.",
];

function Stat({ label, value, sub, mint, valueCls, subCls }) {
  return (
    <div
      className={`h-[169px] px-[30px] pt-[30px] pb-[26px] xl:w-[541px] ${
        mint ? "rounded-[7px] bg-[#DFFFE0]" : "rounded-[7px] border border-[#E2F4E9] bg-[#F1F8F1]"
      } ${!mint ? "xl:w-[543px]" : ""}`}
    >
      <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
        {label}
      </p>
      <p className={`mt-[18px] text-[35px] leading-[43px] font-bold ${valueCls}`}>
        {value}
      </p>
      <p className={`mt-[8px] text-[18px] leading-[22px] font-semibold ${subCls}`}>
        {sub}
      </p>
    </div>
  );
}

function StepRow({ n, text, small }) {
  return (
    <div className="flex items-center">
      <span className="grid h-[24px] w-[24px] flex-none place-items-center rounded-[12px] bg-clyse">
        <span className="text-[15px] leading-[18px] font-semibold text-white">
          {n}
        </span>
      </span>
      <span
        className={`ml-[20px] font-semibold text-[#6B6B6B] ${
          small ? "text-[13px] leading-[20px]" : "text-[18px] leading-[22px]"
        }`}
      >
        {text}
      </span>
    </div>
  );
}

export default function JoinDetails() {
  const incoming = useLocation().state || null;
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const brand = incoming?.brand || "netflix";
  const title = incoming?.title || "Netflix Premium";
  const slots = incoming?.open_slots ?? 3;
  const waiting = incoming?.people_waiting ?? 12;
  const price = incoming?.price_kobo != null ? kobo(incoming.price_kobo) : "N2,000";

  const join = async () => {
    if (busy) return;
    if (!incoming?.plan_id) {
      navigate("/join/failed", {
        state: {
          body: "We lost track of which plan you picked. Please start again.",
          btnLabel: "Back to Join",
          btnVariant: "dark",
          btnTo: "/join",
          hideBack: true,
        },
      });
      return;
    }
    setBusy(true);
    setError("");
    const { data, error: apiError } = await api("/member/waitlist", {
      method: "POST",
      body: { plan_id: incoming.plan_id },
    });
    setBusy(false);
    if (!apiError) {
      const pos = data?.waitlist?.queue_position || data?.queue_position;
      navigate("/join/success", {
        state: {
          body: (
            <>
              You&apos;ve successfully joined the waitlist for {title}.
              {pos ? (
                <>
                  <br />
                  Your position: #{pos} — we&apos;ll notify you as soon as a
                  spot is available.
                </>
              ) : (
                <>
                  <br />
                  We&apos;ll notify you as soon as a spot is available.
                </>
              )}
            </>
          ),
        },
      });
      return;
    }
    if (apiError.code === "already_on_waitlist") {
      navigate("/join/already", {
        state: {
          body: `You've already joined the waitlist for ${title}.`,
        },
      });
      return;
    }
    navigate("/join/failed", {
      state: {
        body: apiError.message || "We couldn't add you to the waitlist. Please try again.",
      },
    });
  };

  const pairProps = { backTo: "/join/plan", onNext: join, busy };
  const errorNote = error && (
    <p className="mt-[20px] text-center text-[15px] font-semibold text-clyse-red">
      {error}
    </p>
  );
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[102px] border-y border-[#BABABA] bg-white">
          <div className="py-[30px] pl-[63px]">
            <SectionHead />
          </div>
        </div>
        <div className="relative bg-white">
          <div className="px-[63px] pt-[30px] pb-[30px]">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <BrandTile brand={brand} size={75} plain />
                <div className="ml-[20px]">
                  <p className="text-[18px] leading-[22px] font-semibold text-clyse">
                    WAITLIST DETAILS
                  </p>
                  <h1 className="mt-[16px] text-[35px] leading-[43px] font-bold text-ink">
                    {title}
                  </h1>
                  <p className="mt-[5px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Subscription Plan · {slots} Slot{slots === 1 ? '' : 's'} Available
                  </p>
                </div>
              </div>
              <p className="mt-[33px] flex items-baseline">
                <span className="text-[35px] leading-[43px] font-bold text-ink">
                  {price}
                </span>
                <span className="ml-[2px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  /Monthly
                </span>
              </p>
            </div>
            <div className="mt-[60px] flex gap-[30px]">
              <Stat
                label="Currently waiting"
                value={String(waiting)}
                sub="members hoping to join"
                mint
                valueCls="text-ink"
                subCls="text-[#929D9E]"
              />
              <Stat
                label="Your expected position"
                value={`#${waiting + 1}`}
                sub="once you join this queue"
                valueCls="text-clyse"
                subCls="text-[#6B6B6B]"
              />
            </div>
            <div className="mt-[30px] rounded-[9px] border border-[#999999] bg-white">
              <div className="px-[31px] pt-[31px] pb-[31px]">
                <h2 className="text-[25px] leading-[30px] font-bold text-[#013104]">
                  What happens next?
                </h2>
                <div className="mt-[20px] flex flex-col gap-[13px]">
                  {STEPS.map((s, i) => (
                    <StepRow key={i} n={i + 1} text={s} />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-[45px] flex items-center">
              <img src={iconBellGreen} alt="" className="h-[30px] w-[30px] flex-none" />
              <span className="ml-[12px] text-[18px] leading-[22px] font-semibold text-[#646D6D]">
                Notifications are on. We&apos;ll keep you updated.
              </span>
              <span className="mr-[46px] ml-auto text-[18px] leading-[22px] font-semibold text-clyse">
                Manage
              </span>
            </div>
            {errorNote}
            <PairButtons {...pairProps} nextLabel="Join Waitlist" className="mt-[45px]" />
          </div>
        </div>
      </main>
      <div className="hidden xl:block">
        <LogoMarquee className="mt-[60px]" />
        <div className="pb-[60px]" />
      </div>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
        </div>
        <div className="relative mt-[103px] border-y border-[#BABABA] bg-white">
          <div className="px-[30px] py-[30px]">
            <SectionHead />
          </div>
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[30px] pb-[30px]">
            <div className="flex items-center">
              <BrandTile brand={brand} size={75} plain />
              <div className="ml-[20px]">
                <p className="text-[18px] leading-[22px] font-semibold text-clyse">
                  WAITLIST DETAILS
                </p>
                <h1 className="mt-[6px] text-[25px] leading-[30px] font-bold text-ink">
                  {title}
                </h1>
                <p className="mt-[8px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Subscription Plan · {slots} Slot{slots === 1 ? '' : 's'} Available
                </p>
              </div>
            </div>
            <p className="mt-[20px] flex items-baseline justify-center">
              <span className="text-[35px] leading-[43px] font-bold text-ink">
                {price}
              </span>
              <span className="ml-[2px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                /Monthly
              </span>
            </p>
            <div className="mt-[60px] flex flex-col gap-[30px]">
              <Stat
                label="Currently waiting"
                value={String(waiting)}
                sub="members hoping to join"
                mint
                valueCls="text-ink"
                subCls="text-[#929D9E]"
              />
              <Stat
                label="Your expected position"
                value={`#${waiting + 1}`}
                sub="once you join this queue"
                valueCls="text-clyse"
                subCls="text-[#6B6B6B]"
              />
            </div>
            <div className="mt-[30px] rounded-[9px] border border-[#999999] bg-white">
              <div className="px-[16px] pt-[31px] pb-[31px]">
                <h2 className="text-[25px] leading-[30px] font-bold text-[#013104]">
                  What happens next?
                </h2>
                <div className="mt-[20px] flex flex-col gap-[13px]">
                  {STEPS.map((s, i) => (
                    <StepRow key={i} n={i + 1} text={s} small />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-[30px] rounded-[9px] bg-[#F1F8F1] px-[15px] pt-[15px] pb-[15px]">
              <div className="flex items-start">
                <span className="grid h-[30px] w-[30px] flex-none place-items-center">
                  <img src={iconBellGreen} alt="" className="h-[30px] w-[30px]" />
                </span>
                <span className="mt-[5px] ml-[12px] text-[13px] leading-[20px] font-semibold text-[#646D6D]">
                  Notifications are on. We'll keep you updated.
                </span>
              </div>
              <p className="mt-[5px] text-center text-[13px] leading-[20px] font-semibold text-clyse">
                Manage
              </p>
            </div>
            {errorNote}
            <PairButtons {...pairProps} nextLabel="Join Waitlist" className="mt-[30px]" />
          </div>
        </div>
      </main>
    </div>
  );
}
