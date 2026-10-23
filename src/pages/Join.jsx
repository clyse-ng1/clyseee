import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import JoinCard from "../components/JoinCard";
import ExtraBlock from "../components/ExtraBlock";
import { BlurBg } from "../components/Decor";
import MemberMini from "../components/MemberMini";
import { api, brandOf, kobo } from "../lib/api";

/* NOTE — Figma keeps: "Premium Premium" (card 2 carries Spotify's icon but a
   mangled title; kept literal), "CapCup Pro" fixed to CapCut Pro, and the
   card-9 Netflix repeat kept so the 2x5 grid matches the design. */
const CARDS = [
  { brand: "netflix", chip: "Entertainment", title: "Netflix Premium", slots: 3, price: "N2,000", waiting: 12 },
  { brand: "spotify", chip: "Entertainment", title: "Premium Premium", slots: 3, price: "N2,000", waiting: 12 },
  { brand: "adobe", chip: "Productivity", title: "Adobe Creative Cloud", slots: 5, price: "N3,000", waiting: 12 },
  { brand: "amazon", chip: "Entertainment", title: "Amazon", slots: 3, price: "N2,000", waiting: 12 },
  { brand: "canva", chip: "Entertainment", title: "Canva Pro", slots: 3, price: "N2,000", waiting: 12 },
  { brand: "capcut", chip: "Entertainment", title: "CapCut Pro", slots: 3, price: "N2,000", waiting: 12 },
  { brand: "prime", chip: "Entertainment", title: "Prime Video Premium", slots: 3, price: "N2,000", waiting: 12 },
  { brand: "youtube", chip: "Entertainment", title: "YouTube Premium", slots: 3, price: "N2,000", waiting: 12 },
  { brand: "netflix", chip: "Entertainment", title: "Netflix Premium", slots: 3, price: "N2,000", waiting: 12 },
  { brand: "spotify", chip: "Entertainment", title: "Spotify Premium", slots: 3, price: "N2,000", waiting: 12 },
];

const SUB = "Subscription you've joined the waitlist for, We'll notify you when a group becomes available";

function mapAvail(a) {
  const title =
    [a.service?.name, a.plan?.name].filter(Boolean).join(" ") || "Subscription";
  return {
    brand: brandOf(a.service),
    chip: a.service?.category || "Entertainment",
    title,
    slots: a.open_slots ?? 0,
    price: a.price?.total_kobo != null ? kobo(a.price.total_kobo) : "—",
    waiting: a.people_waiting ?? 0,
    linkState: {
      plan_id: a.plan_id,
      service: a.service?.name || "Subscription",
      plan: a.plan?.name || "",
      title,
      brand: brandOf(a.service),
      price_kobo: a.price?.total_kobo ?? null,
      open_slots: a.open_slots ?? 0,
      people_waiting: a.people_waiting ?? 0,
    },
  };
}

export default function Join() {
  const [live, setLive] = useState(null);

  useEffect(() => {
    let on = true;
    (async () => {
      const { data } = await api("/member/dashboard");
      if (on) setLive(data?.available_subscriptions || []);
    })();
    return () => {
      on = false;
    };
  }, []);

  const cards = live === null ? CARDS : live.map(mapAvail);

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px]">
          <Sidebar active="Join Waitlist" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Join Waitlist
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] grid grid-cols-2 gap-[31px]">
              {cards.map((c, i) => (
                <JoinCard key={`${c.title}-${i}`} {...c} />
              ))}
            </div>
            {live && live.length === 0 && (
              <p className="mt-[30px] text-[18px] font-semibold text-[#6B6B6B]">
                No subscriptions are open for joining right now. Please check back soon.
              </p>
            )}
          </div>
        </div>
      </main>
      {/* Mobile — Figma's overlapping sort/filter drafts inside the member
          block are omitted (broken layers); page = member + strip + cards. */}
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
            Join Waitlist
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[50px] flex flex-col gap-[31px]">
            {cards.map((c, i) => (
              <JoinCard key={`${c.title}-${i}`} {...c} />
            ))}
          </div>
          {live && live.length === 0 && (
            <p className="mt-[30px] text-[15px] font-semibold text-[#6B6B6B]">
              No subscriptions are open for joining right now. Please check back soon.
            </p>
          )}

        </div>
        <ExtraBlock mobile className="mt-[131px]" />
        <div className="pb-[60px]" />
      </main>
    </div>
  );
}
