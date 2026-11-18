import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PlanCard from "../components/PlanCard";
import WaitPosition from "../components/WaitPosition";
import PairButtons from "../components/PairButtons";
import LogoMarquee from "../components/LogoMarquee";
import SectionHead from "../components/SectionHead";
import { BlurBg, MobileTopWash } from "../components/Decor";
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
  const location = useLocation();
  const incoming = location.state || null;
  const queryGroupId = new URLSearchParams(location.search).get("group_id");
  const [queriedGroup, setQueriedGroup] = useState(null);
  const incomingGroup = incoming?.preview || incoming?.group || queriedGroup || null;
  const incomingService = incoming?.service || incomingGroup?.service?.name || null;
  const incomingBrand = incoming?.brand || (incomingGroup?.service ? incomingGroup.service.slug || incomingGroup.service.name : null);
  const incomingPlanId = incoming?.plan_id || incomingGroup?.plan_id || incomingGroup?.plan?.id || null;
  const incomingPlan = incoming?.plan || incomingGroup?.plan?.name || "";
  const incomingPrice = incoming?.price_kobo ?? incomingGroup?.price?.total_kobo ?? incomingGroup?.price?.total_price_kobo ?? incomingGroup?.plan?.total_price_kobo ?? null;
  const incomingSlots = incoming?.open_slots ?? incomingGroup?.open_slots ?? incomingGroup?.available_slots ?? 0;
  const incomingWaiting = incoming?.people_waiting ?? incomingGroup?.people_waiting ?? 0;
  const [sel, setSel] = useState(0);
  const [plans, setPlans] = useState(null);
  const [plansFor, setPlansFor] = useState(null);
  const selectionKey = `${incomingService || ""}|${incomingPlanId || ""}`;

  useEffect(() => {
    if (!queryGroupId || incoming?.preview || incoming?.group) return;
    let on = true;
    (async () => {
      const { data } = await api("/catalogue/groups?limit=50", { auth: false });
      if (!on) return;
      const rows = data?.groups || [];
      const found = rows.find((group) => String(group.group_id || group.id) === String(queryGroupId));
      if (found) setQueriedGroup(found);
    })();
    return () => { on = false; };
  }, [queryGroupId, incoming?.preview, incoming?.group]);

  /* Arriving from a group card the plan is already known — preselect it so
     Continue does not silently swap the user onto a different plan. */
  useEffect(() => {
    if (!incomingPlanId || plansFor !== selectionKey || !plans?.length) return;
    const i = plans.findIndex((p) => String(p.state?.plan_id) === String(incomingPlanId));
    if (i >= 0) setSel(i);
  }, [incomingPlanId, plans, plansFor, selectionKey]);

  useEffect(() => {
    if (!incomingService) return;
    let on = true;
    (async () => {
      const { data } = await api("/member/dashboard");
      if (!on) return;
      const rows = (data?.available_subscriptions || []).filter((a) => {
        if (incomingPlanId) return String(a.plan_id || a.plan?.id || "") === String(incomingPlanId);
        return (a.service?.name || "").toLowerCase() === incomingService.toLowerCase();
      });
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
        setPlansFor(selectionKey);
        setSel(0);
      }
    })();
    return () => {
      on = false;
    };
  }, [incomingService, incomingBrand, incomingPlanId, incomingPlan, incomingPrice, incomingSlots, incomingWaiting, selectionKey]);

  /* Catalogue fallback is scoped to the selected group/service. Never silently
     substitute the first service in the catalogue when route state is missing. */
  const services = useCatalogue();
  const cataloguePlans = (() => {
    if (plans && plansFor === selectionKey) return null;
    if (!services || !incomingService) return null;
    const entry = matchService(services, incomingService);
    if (!entry) return [];
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

  const list = (plansFor === selectionKey ? plans : null) || cataloguePlans || [];
  const selectedPlanIndex = plansFor === selectionKey ? sel : 0;
  const heading = incomingService
    ? `Choose your ${incomingService} plan`
    : cataloguePlans?.[0]?.state?.service
      ? `Choose your ${cataloguePlans[0].state.service} plan`
      : "Choose your plan";
  /* Step 2 is the group-details card (889:52206), which also carries the
     Payment Summary. When the user came in from a specific group card we keep
     that group in the state so the details page shows the group they tapped,
     not whichever group happens to sort first. */
  const groupCtx = incomingGroup
    ? { preview: incomingGroup, group_id: incoming?.group_id || incomingGroup.group_id || incomingGroup.id || queryGroupId }
    : queryGroupId ? { group_id: queryGroupId } : {};
  const nextState = {
    ...(list.length ? list[selectedPlanIndex]?.state || list[0].state : incoming || {}),
    ...groupCtx,
  };
  /* This page serves both flows; Figma labels it "Join Group" for the group
     flow. It said "Join Waitlist" on both. */
  const headTitle = incoming?.fromWaitlist ? "Join Waitlist" : "Join Group";
  const backTo = incoming?.fromWaitlist ? "/join" : "/browse";

  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [joinError, setJoinError] = useState("");
  const flowState = {
    ...(incoming || {}),
    ...nextState,
    ...(incomingService ? { service: incomingService } : {}),
    ...(incomingBrand ? { brand: incomingBrand } : {}),
  };
  const goNext = async () => {
    if (busy) return;
    if (incoming?.fromWaitlist) {
      navigate("/join/details", { state: nextState });
      return;
    }
    setBusy(true);
    setJoinError("");
    let group = incomingGroup;
    if (!group) {
      const path = nextState?.plan_id
        ? `/catalogue/groups?plan_id=${encodeURIComponent(nextState.plan_id)}&limit=50`
        : "/catalogue/groups?limit=50";
      const { data, error } = await api(path, { auth: false });
      const rows = data?.groups || [];
      group = error ? null : rows.find((g) => String(g.plan_id || g.plan?.id || "") === String(nextState?.plan_id || "")) || null;
    }
    setBusy(false);
    if (!group) {
      setJoinError("No open group is available for this selected plan right now. Choose another open group from Browse.");
      return;
    }
    navigate("/join/summary", {
      state: {
        ...flowState,
        group_id: group.group_id || group.id || nextState?.group_id,
        preview: group,
      },
    });
  };
  return (
    /* Figma paints the BACKGROUND BLUR circles straight onto white — no flat
       wash. The old #E4F6E5 linear gradient sat on top of them and killed the
       gradient's depth, which is why the top read as one flat green. */
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma 889:52181 — the join-flow BLUR BG, not the landing hero blobs. */}
      <BlurBg variant="join" />
      <MobileTopWash />
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] hidden xl:block min-[1440px]:mx-[100px]">
        {/* Figma 889:53386: the back chevron sits above the card, not a sidebar. */}
        <Link
          to={backTo}
          state={flowState}
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
            {!list.length && <p role="status" className="mt-8 rounded-xl border border-[#D8E2D9] bg-[#F7FAF7] p-6 text-center font-semibold text-[#596659]">{incomingService ? `No active plans were found for ${incomingService}.` : queryGroupId && !incomingGroup ? "Loading the selected group's details…" : "Choose an available group from Browse to see its service and plan."} <Link to="/browse" className="ml-1 text-[#048B0B] underline">Browse groups</Link></p>}
            {joinError && <p role="alert" className="mt-5 font-semibold text-red-700">{joinError}</p>}
            <div className="mt-[70px] flex gap-[20px]">
              {list.map((p, i) => (
                <div key={i} className="flex-1">
                  <PlanCard
                    {...p}
                    status={selectedPlanIndex === i ? "Selected" : null}
                    selected={selectedPlanIndex === i}
                    onSelect={() => setSel(i)}
                  />
                  {incoming?.fromWaitlist && <WaitPosition planId={p.state?.plan_id} />}
                </div>
              ))}
            </div>
            <PairButtons
              backTo={backTo}
              backState={flowState}
              onNext={goNext}
              busy={busy}
              disabled={!list.length && !incomingGroup}
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
            state={flowState}
            aria-label="Back"
            className="grid h-[40px] w-[40px] place-items-center rounded-full border border-[#BABABA] bg-white pb-[2px] text-[18px] leading-none text-ink shadow-[0_4px_10px_rgba(0,23,1,0.10)]"
          >
            ‹
          </Link>
        </div>
        <div className="mt-[16px] relative border-y border-[#BABABA] bg-white">
          <div className="px-[30px] py-[30px]">
            {/* Was <SectionHead mobile /> with no title, so the waitlist flow
                fell back to SectionHead's "Join Group" default. */}
            <SectionHead mobile title={headTitle} />
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
            {!list.length && <p role="status" className="mt-6 rounded-xl border border-[#D8E2D9] bg-[#F7FAF7] p-4 text-center text-sm font-semibold text-[#596659]">{incomingService ? `No active plans were found for ${incomingService}.` : queryGroupId && !incomingGroup ? "Loading the selected group's details…" : "Choose an available group from Browse to see its service and plan."} <Link to="/browse" className="ml-1 text-[#048B0B] underline">Browse groups</Link></p>}
            {joinError && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{joinError}</p>}
            <div className="mt-[34px] flex flex-col gap-[20px]">
              {list.map((p, i) => (
                <div key={i}>
                  <PlanCard
                    {...p}
                    status={selectedPlanIndex === i ? "Selected" : null}
                    selected={selectedPlanIndex === i}
                    onSelect={() => setSel(i)}
                  />
                  {incoming?.fromWaitlist && <WaitPosition planId={p.state?.plan_id} />}
                </div>
              ))}
            </div>
            <PairButtons
              backTo={backTo}
              backState={flowState}
              onNext={goNext}
              busy={busy}
              disabled={!list.length && !incomingGroup}
              className="mt-[70px]"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
