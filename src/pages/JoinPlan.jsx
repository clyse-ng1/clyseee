import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlanCard from "../components/PlanCard";
import PairButtons from "../components/PairButtons";
import LogoMarquee from "../components/LogoMarquee";
import SectionHead from "../components/SectionHead";
import { BlurBg } from "../components/Decor";
import { api, kobo } from "../lib/api";
import { matchService, planTotal, useCatalogue } from "../lib/useCatalogue";

/* Figma shows the middle plan selected — selection is live: tapping any
   Select moves the pill + dark button + green stroke to that card.
   The three placeholder cards that shipped as a fallback ("Standard with ads"
   three times) are gone: with no navigation state the page now reads the real
   catalogue, which is what the PM was looking at when they flagged the icons
   and spacing (board card 33). */

function mapPlan(a, service, brand) {
  const title =
    [a.service?.name, a.plan?.name].filter(Boolean).join(" ") || "Subscription";
  const cap = a.plan?.member_slot_capacity ?? a.plan?.capacity;
  return {
    name: a.plan?.name || "Standard",
    price: a.price?.total_kobo != null ? kobo(a.price.total_kobo) : "—",
    features:
      cap != null ? `${cap} slots · monthly billing` : "Monthly billing",
    state: {
      plan_id: a.plan_id,
      service: a.service?.name || service,
      plan: a.plan?.name || "",
      title,
      brand,
      price_kobo: a.price?.total_kobo ?? null,
      open_slots: a.open_slots ?? 0,
      people_waiting: a.people_waiting ?? 0,
    },
  };
}

export default function JoinPlan() {
  const incoming = useLocation().state || null;
  const incomingService = incoming?.service || null;
  const incomingBrand = incoming?.brand || null;
  const incomingPlanId = incoming?.plan_id || null;
  const incomingPlan = incoming?.plan || "";
  const incomingPrice = incoming?.price_kobo ?? null;
  const incomingSlots = incoming?.open_slots ?? 0;
  const incomingWaiting = incoming?.people_waiting ?? 0;
  const [sel, setSel] = useState(0);
  const [plans, setPlans] = useState(null);
  const [openService, setOpenService] = useState(null);

  useEffect(() => {
    if (incomingService) return;
    let on = true;
    (async () => {
      const { data } = await api("/member/dashboard");
      const rows = data?.available_subscriptions || [];
      const withSlots = rows.filter((a) => (a.open_slots ?? 0) > 0);
      const pick = (withSlots[0] || rows[0])?.service?.name || null;
      if (on) setOpenService(pick);
    })();
    return () => {
      on = false;
    };
  }, [incomingService]);

  /* Arriving from a group card the plan is already known — preselect it so
     Continue does not silently swap the user onto a different plan. */
  useEffect(() => {
    if (!incomingPlanId || !plans?.length) return;
    const i = plans.findIndex((p) => p.state?.plan_id === incomingPlanId);
    if (i > 0) setSel(i);
  }, [incomingPlanId, plans]);

  useEffect(() => {
    if (!incomingService) return;
    let on = true;
    (async () => {
      const { data } = await api("/member/dashboard");
      if (!on) return;
      const rows = (data?.available_subscriptions || []).filter(
        (a) => (a.service?.name || "").toLowerCase() === incomingService.toLowerCase(),
      );
      const list = rows.length
        ? rows
        : incomingPlanId
          ? [
              {
                plan_id: incomingPlanId,
                service: { name: incomingService },
                plan: { name: incomingPlan },
                price: { total_kobo: incomingPrice },
                open_slots: incomingSlots,
                people_waiting: incomingWaiting,
              },
            ]
          : [];
      if (on && list.length) {
        setPlans(list.map((a) => mapPlan(a, incomingService, incomingBrand)));
        setSel(0);
      }
    })();
    return () => {
      on = false;
    };
  }, [incomingService, incomingBrand, incomingPlanId, incomingPlan, incomingPrice, incomingSlots, incomingWaiting]);

  /* Catalogue fallback: the incoming service when we have one, otherwise the
     first service that actually has a priced plan. */
  const services = useCatalogue();
  const cataloguePlans = (() => {
    if (plans) return null;
    if (!services) return null;
    const target = incomingService || openService;
    const entry =
      (target && matchService(services, target)) ||
      services.find((a) => (a.plans || a.catalogue_plans || []).some((p) => Number.isFinite(planTotal(p))));
    if (!entry) return null;
    const svc = entry.service || entry;
    return (entry.plans || entry.catalogue_plans || [])
      .filter((p) => Number.isFinite(planTotal(p)))
      .map((p) => ({
        name: p.name || "Plan",
        price: kobo(planTotal(p)),
        features:
          p.member_slot_capacity != null
            ? `${p.member_slot_capacity} slots · monthly billing`
            : "Monthly billing",
        state: {
          plan_id: p.id,
          service: svc.name || incomingService || "",
          plan: p.name || "",
          title: [svc.name, p.name].filter(Boolean).join(" "),
          brand: incomingBrand,
          price_kobo: planTotal(p),
          open_slots: p.open_slots ?? 0,
          people_waiting: p.people_waiting ?? 0,
        },
      }));
  })();

  const list = plans || cataloguePlans || [];
  const heading = incoming?.service
    ? `Choose your ${incoming.service} plan`
    : openService
      ? `Choose your ${openService} plan`
      : cataloguePlans?.[0]?.state?.service
        ? `Choose your ${cataloguePlans[0].state.service} plan`
        : "Choose your plan";
  /* Step 2 is the group-details card (889:52206), which also carries the
     Payment Summary. When the user came in from a specific group card we keep
     that group in the state so the details page shows the group they tapped,
     not whichever group happens to sort first. */
  const groupCtx =
    incoming?.preview || incoming?.group
      ? { preview: incoming.preview || incoming.group, group_id: incoming.group_id }
      : {};
  const nextState = {
    ...(list.length ? list[sel]?.state || list[0].state : incoming || {}),
    ...groupCtx,
  };
  /* This page serves both flows; Figma labels it "Join Group" for the group
     flow. It said "Join Waitlist" on both. */
  const headTitle = incoming?.fromWaitlist ? "Join Waitlist" : "Join Group";
  const backTo = incoming?.fromWaitlist ? "/join" : "/browse";

  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const goNext = async () => {
    if (busy) return;
    if (incoming?.fromWaitlist) {
      navigate("/join/details", { state: nextState });
      return;
    }
    setBusy(true);
    let group = incoming?.preview || incoming?.group || null;
    if (!group) {
      const { data } = await api("/catalogue/groups?limit=50", { auth: false });
      const rows = data?.groups || [];
      const svc = (nextState?.service || "").toLowerCase();
      group =
        rows.find((g) => g.plan_id === nextState?.plan_id || g.plan?.id === nextState?.plan_id) ||
        (svc ? rows.find((g) => (g.service?.name || "").toLowerCase() === svc) : null) ||
        rows[0] ||
        null;
    }
    setBusy(false);
    navigate("/join/preview", {
      state: {
        ...nextState,
        group_id: group?.group_id || group?.id || nextState?.group_id,
        preview: group,
      },
    });
  };
  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma 889:52181 — the join-flow BLUR BG, not the landing hero blobs. */}
      <BlurBg variant="join" />
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] hidden xl:block min-[1440px]:mx-[100px]">
        {/* Figma 889:53386: the back chevron sits above the card, not a sidebar. */}
        <Link
          to={backTo}
          state={incoming}
          aria-label="Back"
          className="mt-[27px] grid h-[45px] w-[45px] place-items-center rounded-full border border-[#BABABA] bg-white pb-[3px] text-[20px] leading-none text-ink shadow-[0_4px_10px_rgba(0,23,1,0.10)]"
        >
          ‹
        </Link>
        {/* Figma 889:52178: one white card, header row separated by a divider. */}
        <div className="relative mt-[30px] rounded-[20px] bg-white shadow-[0_0_20px_rgba(0,23,1,0.08)]">
          <div className="border-b border-[#BABABA] py-[30px] pl-[63px]">
            <SectionHead title={headTitle} />
          </div>
          <div className="px-[63px] pt-[30px] pb-[40px]">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              {heading}
            </h1>
            <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Pick the access level you want to buy. You can change this before joining a group
            </p>
            <div className="mt-[70px] flex gap-[20px]">
              {list.map((p, i) => (
                <PlanCard
                  key={i}
                  {...p}
                  status={sel === i ? "Selected" : null}
                  selected={sel === i}
                  onSelect={() => setSel(i)}
                />
              ))}
            </div>
            <PairButtons
              backTo={backTo}
              backState={incoming}
              onNext={goNext}
              busy={busy}
              className="mt-[70px]"
            />
          </div>
        </div>
      </main>
      <div className="hidden xl:block">
        <LogoMarquee className="mt-[60px]" />
        <div className="pb-[60px]" />
      </div>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <div className="px-[30px] pt-[20px]">
          <Link
            to={backTo}
            state={incoming}
            aria-label="Back"
            className="grid h-[40px] w-[40px] place-items-center rounded-full border border-[#BABABA] bg-white pb-[2px] text-[18px] leading-none text-ink shadow-[0_4px_10px_rgba(0,23,1,0.10)]"
          >
            ‹
          </Link>
        </div>
        <div className="mt-[16px] relative border-y border-[#BABABA] bg-white">
          <div className="px-[30px] py-[30px]">
            <SectionHead mobile />
          </div>
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[30px] pb-[30px]">
            <h1 className="text-[25px] leading-[30px] font-bold text-black">
              {heading}
            </h1>
            <p className="mt-[15px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
              Pick the access level you want to buy. You can change this before joining a group
            </p>
            <div className="mt-[34px] flex flex-col gap-[20px]">
              {list.map((p, i) => (
                <PlanCard
                  key={i}
                  {...p}
                  status={sel === i ? "Selected" : null}
                  selected={sel === i}
                  onSelect={() => setSel(i)}
                />
              ))}
            </div>
            <PairButtons
              backTo={backTo}
              backState={incoming}
              onNext={goNext}
              busy={busy}
              className="mt-[70px]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
