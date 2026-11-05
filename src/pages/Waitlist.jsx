import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import WaitlistCard, { WaitlistCardSk } from "../components/WaitlistCard";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { EmptyCard } from "./WaitlistEmpty";
import { BlurBg } from "../components/Decor";
import { api, brandOf, fmtDay, kobo } from "../lib/api";


const SUB = "Subscription you've joined the waitlist for, We'll notify you when a group becomes available";

function mapEntry(w, priceByPlan) {
  const name =
    [w.service?.name, w.plan?.name].filter(Boolean).join(" ") || "Subscription";
  const total = priceByPlan[w.plan_id];
  return {
    key: w.waitlist_id || w.id,
    brand: brandOf(w.service),
    title: name,
    price: total != null ? `${kobo(total)} / monthly` : null,
    posValue: w.queue_position ? `#${w.queue_position}` : "—",
    date: fmtDay(w.joined_at || w.created_at) || "—",
    leaveState: { waitlist_id: w.waitlist_id || w.id, plan_id: w.plan_id || null },
    planId: w.plan_id || null,
  };
}

export default function Waitlist() {
  const [entries, setEntries] = useState(null);
  const [prices, setPrices] = useState({});
  const [notifOn, setNotifOn] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const [w, d, p] = await Promise.all([
        api("/member/waitlist"),
        api("/member/dashboard"),
        api("/member/notifications/preferences"),
      ]);
      if (!live) return;
      setEntries(w.data?.waitlist || w.data?.waitlists || []);
      const byPlan = {};
      for (const a of d.data?.available_subscriptions || []) {
        if (a.plan_id && a.price?.total_kobo != null) byPlan[a.plan_id] = a.price.total_kobo;
      }
      setPrices(byPlan);
      // The card toggle drives the account-wide waitlist in-app preference.
      const wl = p.data?.preferences?.waitlist ?? p.data?.waitlist;
      if (wl && typeof wl.in_app === "boolean") setNotifOn(wl.in_app);
    })();
    return () => {
      live = false;
    };
  }, []);

  const toggleNotif = async () => {
    const next = !(notifOn ?? true);
    setNotifOn(next);
    const { error } = await api("/member/notifications/preferences", {
      method: "PUT",
      body: { waitlist: { in_app: next } },
    });
    if (error) setNotifOn(!next);
  };

  const cards = entries ? entries.map((w) => mapEntry(w, prices)) : null;

  const renderCards = () =>
    !entries
      ? [0, 1, 2].map((i) => <WaitlistCardSk key={i} />)
      : cards.map((c) => (
          <WaitlistCard
            key={c.key || c.title}
            brand={c.brand}
            title={c.title}
            posLabel="Your Position"
            posValue={c.posValue}
            date={c.date}
            price={c.price}
            leaveState={c.leaveState}
            createPlanId={c.planId}
            notifOn={notifOn}
            onNotifToggle={toggleNotif}
          />
        ));

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="My Waitlist" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Waitlist
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            {entries && entries.length === 0 ? (
              <div className="mt-[50px] rounded-[20px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
                <EmptyCard />
              </div>
            ) : (
              <div className="mt-[50px] flex flex-col gap-[30px]">{renderCards()}</div>
            )}
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
          <div className="mt-[19px] flex h-[33px] items-center justify-center rounded-[5px] border border-line bg-white">
            <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden>
              <path d="M0 0h22L11 10z" fill="#9E9E9E" />
            </svg>
          </div>
          <h1 className="mt-[51px] text-[30px] leading-[37px] font-bold text-black">
            Waitlist
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          {entries && entries.length === 0 ? (
            <div className="mt-[30px]">
              <EmptyCard />
            </div>
          ) : (
            <div className="mt-[50px] -mx-[30px] flex flex-col gap-[30px]">
              {renderCards()}
            </div>
          )}
        </div>
        <ExtraBlock mobile className="mt-[50px]" />
        <div className="pb-[60px]" />
      </main>
    </div>
  );
}
