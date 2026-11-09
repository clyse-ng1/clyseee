import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import JoinCard from "../components/JoinCard";
import Sk from "../components/Skeleton";
import ExtraBlock from "../components/ExtraBlock";
import { BlurBg } from "../components/Decor";
import { api, brandOf, kobo } from "../lib/api";

const SUB = "Browse available groups and join the waitlist for, We'll notify you when a group becomes available";

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
      const { data, error } = await api("/member/dashboard");
      if (on) setLive(error ? [] : data?.available_subscriptions || []);
    })();
    return () => {
      on = false;
    };
  }, []);

  const cards = live === null ? [] : live.map(mapAvail);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma BLUR BG at page level so the mobile branch gets it too. */}
      <BlurBg variant="hero" />
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="Join Waitlist" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Join Waitlist
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] grid grid-cols-2 gap-[30px]">
              {live === null
                ? Array.from({ length: 4 }, (_, i) => <Sk key={i} className="h-[406px] w-[400px] !rounded-[25px]" />)
                : cards.map((c, i) => <JoinCard key={`${c.title}-${i}`} {...c} />)}
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
        <div className="relative px-[30px] pt-[30px] pb-[40px]">
          <Link
            to="/dashboard"
            aria-label="Back"
            className="grid h-[40px] w-[40px] place-items-center rounded-full border border-[#BABABA] bg-white pb-[2px] text-[18px] leading-none text-ink shadow-[0_4px_10px_rgba(0,23,1,0.10)]"
          >
            ‹
          </Link>
          <h1 className="mt-[20px] text-[35px] leading-[43px] font-bold text-black">
            Join Waitlist
          </h1>
          <p className="mt-[4px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[50px] flex flex-col gap-[31px]">
            {live === null
              ? Array.from({ length: 2 }, (_, i) => <Sk key={i} className="h-[406px] w-full !rounded-[25px]" />)
              : cards.map((c, i) => <JoinCard key={`${c.title}-${i}`} {...c} />)}
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
