import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MobileBack } from "../components/MemberMini";
import Sidebar from "../components/Sidebar";
import WaitlistCard, { WaitlistCardSk } from "../components/WaitlistCard";
import ExtraBlock from "../components/ExtraBlock";
import { EmptyCard } from "./WaitlistEmpty";
import { BlurBg } from "../components/Decor";
import { api, brandOf, fmtDay, kobo } from "../lib/api";


const fmtLong = (iso) => {
  const d = new Date(iso || "");
  if (!iso || Number.isNaN(d.getTime())) return "—";
  return `${d.toLocaleDateString("en-US", { month: "short" })}. ${d.getDate()}, ${d.getFullYear()}`;
};

const SUB = "Browse available groups and join the waitlist for, We'll notify you when a group becomes available";

function mapEntry(w, priceByPlan) {
  const name =
    [w.service?.name, w.plan?.name].filter(Boolean).join(" ") || "Subscription";
  const total = priceByPlan[w.plan_id];
  return {
    key: w.waitlist_id || w.id,
    brand: brandOf(w.service),
    title: name,
    price: total != null ? `${kobo(total)} / monthly` : null,
    // API returns `position` (this user's place) and `waiting_count` (total on
    // that plan). Figma 889:82683 labels the cell "Total User Waiting" and
    // prints "<n> People", so we show the total, not the position.
    posValue: (() => {
      const n = w.waiting_count ?? w.position ?? 0;
      return `${n} ${Number(n) === 1 ? "Person" : "People"}`;
    })(),
    // Figma 889:82683 renders the join date as "Sep. 28, 2026".
    date: fmtLong(w.joined_at || w.created_at),
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
      const wlRow = Array.isArray(p.data?.categories)
        ? p.data.categories.find((c) => c.category === "waitlist")
        : null;
      const on = wlRow?.channels?.in_app ?? p.data?.preferences?.waitlist?.in_app;
      if (typeof on === "boolean") setNotifOn(on);
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
      body: { preferences: [{ category: "waitlist", channel: "in_app", enabled: next }] },
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
            posLabel="Total User Waiting"
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
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma BLUR BG at page level so the mobile branch gets it too. */}
      <BlurBg variant="hero" />
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
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
        <div className="relative bg-[linear-gradient(180deg,#E4F6E5_0%,#EFFAF0_55%,#FBFEFB_100%)] px-[30px] pt-[30px] pb-[40px]">
          <MobileBack />
          <h1 className="mt-[0px] text-[35px] leading-[43px] font-bold text-black">
            Waitlist
          </h1>
          <p className="mt-[4px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
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
