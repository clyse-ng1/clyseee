import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubCard, { SubCardSk } from "../components/SubCard";
import GroupStats from "../components/GroupStats";
import GroupTabs from "../components/GroupTabs";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import { api, brandOf, kobo, totalPriceKobo } from "../lib/api";
import { groupBucket } from "../lib/useGroup";

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
  const [groups, setGroups] = useState(null);
  const [failed, setFailed] = useState(false);
  const [lotsFailed, setLotsFailed] = useState(false);
  const [monthly, setMonthly] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      const [g, l] = await Promise.all([
        api("/member/groups"),
        api("/member/earnings/lots?limit=50"),
      ]);
      if (!live) return;
      if (g.error) setFailed(true);
      else setGroups(g.data?.groups || []);
      if (l.error) setLotsFailed(true);
      if (!l.error) {
        const now = new Date();
        const sum = (l.data?.earnings || l.data?.lots || [])
          .filter((lot) => {
            const d = new Date(lot.created_at);
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          })
          .reduce((s, lot) => s + (lot.amount_kobo || 0), 0);
        setMonthly(sum);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  if (groups && groups.length === 0) return <Navigate to="/groups/empty" replace />;

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
    { label: `Activated (${counts.active})`, width: "w-[140px]" },
    { label: `Pending (${counts.pending})`, width: "w-[140px]" },
    { label: `Expired (${counts.expired})`, width: "w-[140px]" },
    { label: `Failed (${counts.failed})`, width: "w-[140px]" },
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
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[101px] flex gap-[38px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
            <TitleBlock />
            <GroupStats className="mt-[50px]" values={stats} />
            <GroupTabs tabs={tabs} viewAll className="mt-[50px]" active={tab} onSelect={setTab} loading={!groups && !failed} />
            <div className="mt-[50px] flex flex-col gap-[30px]">
              {!groups && !failed ? (
                [0, 1, 2, 3].map((i) => <SubCardSk key={i} />)
              ) : (
                shown.map((r) => (
                  <SubCard key={r.key || r.title} to="/groups/details" {...r} />
                ))
              )}
            </div>
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
          <div className="mt-[51px]">
            <TitleBlock />
          </div>
          <GroupStats className="mt-[50px]" values={stats} />
          <p className="mt-[30px] text-right text-[13px] leading-[16px] font-semibold text-clyse">
            View All
          </p>
          <GroupTabs tabs={tabs} className="mt-[12px]" active={tab} onSelect={setTab} loading={!groups && !failed} />
          <div className="mt-[30px] flex flex-col gap-[10px]">
            {!groups && !failed ? (
              [0, 1, 2, 3].map((i) => <SubCardSk key={i} />)
            ) : (
              shown.map((r) => (
                <SubCard key={r.key || r.title} to="/groups/details" noView {...r} />
              ))
            )}
          </div>
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
