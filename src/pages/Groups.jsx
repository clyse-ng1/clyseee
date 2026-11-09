import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubCard, { SubCardSk } from "../components/SubCard";
import GroupStats from "../components/GroupStats";
import GroupTabs from "../components/GroupTabs";
import ExtraBlock from "../components/ExtraBlock";
import { BlurBg } from "../components/Decor";
import { api, brandOf, kobo, totalPriceKobo } from "../lib/api";
import { groupBucket } from "../lib/useGroup";
import { loadGroups, readGroups, subscribeGroups } from "../lib/groupsCache";
import GroupEmpty from "./GroupEmpty";

const SUB = "Manage your subscriptions, view details, and track your groups.";

const ACTIVE = { statusLabel: "Activated" };
const PENDING = {
  statusLabel: "Pending",
  statusBg: "bg-[#FDEED9]",
  statusText: "text-[#FF9400]",
  statusDot: "bg-[#FF9400]",
};
const FAILED = {
  statusLabel: "Failed",
  statusBg: "bg-[#FFF1F1]",
  statusText: "text-[#FF0000]",
  statusDot: "bg-[#FF0000]",
};
const EXPIRED = {
  statusLabel: "Expired",
  statusBg: "bg-[#E9E9E9]",
  statusText: "text-black",
  statusDot: "bg-black",
};
const PILL = { active: ACTIVE, pending: PENDING, expired: EXPIRED, failed: FAILED };
const FILTERS = ["all", "active", "pending", "expired", "failed"];

function TitleBlock() {
  return (
    <>
      <h1 className="text-[30px] leading-[37px] font-bold text-black xl:text-[35px] xl:leading-[43px]">
        My Group
      </h1>
      <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B] xl:text-[18px] xl:leading-[22px]">
        {SUB}
      </p>
    </>
  );
}

function mapRow(g) {
  const b = groupBucket(g);
  const title = [g.service?.name, g.plan?.name].filter(Boolean).join(" ") || "Group";
  const plan = g.plan?.name ? `${g.plan.name} Plan` : "Premium Plan";
  const total = totalPriceKobo(g);
  const price = total != null ? kobo(total) : "—";
  const sub = `${g.slots_offered ?? 0} Slot Shared`;
  return {
    key: g.id,
    bucket: b,
    brand: brandOf(g.service),
    title,
    plan,
    price,
    subLine: sub,
    mTitle: title,
    mPlan: plan,
    mPrice: price,
    mSub: sub,
    linkState: { group_id: g.id },
    dim: b === "expired",
    ...PILL[b],
  };
}

export default function Groups() {
  /* Read synchronously from the shared cache: if the answer is already known the
     first paint is already correct, so there is nothing to flash. */
  const [groups, setGroups] = useState(() => readGroups());
  const [failed, setFailed] = useState(false);
  const [lotsFailed, setLotsFailed] = useState(false);
  const [monthly, setMonthly] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    let live = true;
    /* The two calls are independent: resolve them separately. They were wrapped
       in Promise.all, so a member with no groups still stared at the populated
       page skeleton until the (slower) earnings call came back. */
    const off = subscribeGroups((list) => {
      if (live) setGroups(list);
    });
    loadGroups().then(({ error }) => {
      if (live && error) setFailed(true);
    });
    api("/member/earnings/lots?limit=50").then((l) => {
      if (!live) return;
      if (l.error) {
        setLotsFailed(true);
        return;
      }
      const now = new Date();
      const sum = (l.data?.earnings || l.data?.lots || [])
        .filter((lot) => {
          const d = new Date(lot.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((s, lot) => s + (lot.amount_kobo || 0), 0);
      setMonthly(sum);
    });
    return () => {
      live = false;
      off();
    };
  }, []);

  /* Render the empty state in place. This used to be a redirect, so the page
     painted its full layout first and then jumped to another screen — the
     flash members with no groups saw. */
  if (groups && groups.length === 0) return <GroupEmpty />;

  const rows = (groups || []).map(mapRow);
  const counts = {
    all: rows.length,
    active: rows.filter((r) => r.bucket === "active").length,
    pending: rows.filter((r) => r.bucket === "pending").length,
    expired: rows.filter((r) => r.bucket === "expired").length,
    failed: rows.filter((r) => r.bucket === "failed").length,
  };
  const tabs = [
    { label: `All (${counts.all})` },
    { label: `Activated (${counts.active})` },
    { label: `Pending (${counts.pending})` },
    { label: `Expired (${counts.expired})` },
    { label: `Failed (${counts.failed})` },
  ];
  const shown = tab === 0 ? rows : rows.filter((r) => r.bucket === FILTERS[tab]);
  const stats = groups
    ? [
        String(groups.length),
        String(groups.reduce((s, g) => s + (g.occupied_slots || 0), 0)),
        monthly != null ? kobo(monthly) : lotsFailed ? "\u2014" : undefined,
      ]
    : failed
      ? ["\u2014", "\u2014", "\u2014"]
      : undefined;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma BLUR BG at page level so the mobile branch gets it too. */}
      <BlurBg variant="hero" />
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <div className="relative mt-[101px] flex gap-[38px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
            <TitleBlock />
            {!groups && !failed ? (
              /* Unknown state: one neutral placeholder. The stat cards and tab
                 counts stay out of the DOM until we know there are groups, so a
                 member with none never sees that layout at all. */
              <div className="mt-[50px]">
                <SubCardSk />
              </div>
            ) : (
              <>
                <GroupStats className="mt-[50px]" values={stats} />
                <GroupTabs tabs={tabs} viewAll className="mt-[50px]" active={tab} onSelect={setTab} loading={false} />
                <div className="mt-[50px] flex flex-col gap-[30px]">
                  {shown.map((r) => (
                    <SubCard key={r.key || r.title} to="/groups/details" {...r} />
                  ))}
                </div>
              </>
            )}
            {failed && (
              <p className="pt-[10px] text-[18px] leading-[22px] font-semibold text-[#FF0000]">
                Could not load groups. Please try again.
              </p>
            )}
          </div>
        </div>
      </main>
      {/* Mobile (M9 687:11080) */}
      <main className="relative xl:hidden">
        <div className="relative bg-white px-[30px] pt-[30px] pb-[40px]">
          <div className="mt-[0px]">
            <TitleBlock />
          </div>
          {!groups && !failed ? (
            <div className="mt-[50px]">
              <SubCardSk />
            </div>
          ) : (
            <>
              <GroupStats className="mt-[50px]" values={stats} />
              <div className="mt-[22px] flex justify-end">
                <Link
                  to="/groups/browse"
                  className="flex items-center gap-[6px] text-[13px] leading-[16px] font-semibold text-clyse"
                >
                  View All
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
                    <path d="M1 5h9M6.5 1.5 10 5l-3.5 3.5" stroke="#048B0B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <GroupTabs tabs={tabs} className="mt-[10px]" active={tab} onSelect={setTab} loading={false} />
              {/* pb keeps the last card's shadow from being clipped (card 16) */}
              <div className="mt-[24px] flex flex-col gap-[10px] pb-[8px]">
                {shown.map((r) => (
                  <SubCard key={r.key || r.title} to="/groups/details" noView {...r} />
                ))}
              </div>
            </>
          )}
          {failed && (
            <p className="pt-[10px] text-[13px] leading-[20px] font-semibold text-[#FF0000]">
              Could not load groups. Please try again.
            </p>
          )}
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
