import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubCard from "../components/SubCard";
import GroupStats from "../components/GroupStats";
import GroupTabs from "../components/GroupTabs";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import { api, brandOf, kobo } from "../lib/api";
import { groupBucket } from "../lib/useGroup";

const SUB = "Manage your subscriptions, view details, and track your groups.";

/* Figma samples, shown while the live groups load. */
const TABS = [
  { label: "All (8)" },
  { label: "Activated (4)", width: "w-[140px]" },
  { label: "Pending (1)", width: "w-[140px]" },
  { label: "Expired (2)", width: "w-[140px]" },
  { label: "Failed (1)", width: "w-[140px]" },
];

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

const ROWS = [
  { brand: "adobe", title: "Adobe Creative Cloud", plan: "Standard Plan", price: "N 3,000", subLine: "12 Slot Shared", ...ACTIVE },
  { brand: "netflix", title: "Netflix Premium", plan: "Premium Plan", price: "N 2,000", subLine: "10 Slot Shared", ...ACTIVE },
  { brand: "youtube", title: "YouTube Premium", plan: "Premium Plan", price: "N 2,000", subLine: "30 Slot Shared", ...PENDING },
  { brand: "spotify", title: "Spotify Premium", plan: "Premium Plan", price: "N 2,000", subLine: "10 Slot Shared", ...ACTIVE },
  { brand: "canva", title: "Canva Pro", plan: "Premium Plan", price: "N 5,000", subLine: "20 Slot Shared", ...FAILED },
  { brand: "amazon", title: "Amazon", plan: "Premium Plan", price: "N 2,000", subLine: "20 Slot Shared", ...ACTIVE },
  { brand: "capcut", title: "CapCut Pro", plan: "Premium Plan", price: "N3,300", subLine: "20 Slot Shared", ...EXPIRED, dim: true },
  { brand: "prime", title: "Cloud", plan: "Prime Video", price: "N 2,000", subLine: "20 Slot Shared", ...EXPIRED },
];

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

function labelBucket(label) {
  if (label === "Activated") return "active";
  if (label === "Pending") return "pending";
  if (label === "Expired") return "expired";
  return "failed";
}

function mapRow(g) {
  const b = groupBucket(g);
  const title = [g.service?.name, g.plan?.name].filter(Boolean).join(" ") || "Group";
  const plan = g.plan?.name ? `${g.plan.name} Plan` : "Premium Plan";
  const price = g.plan?.total_price_kobo != null ? kobo(g.plan.total_price_kobo) : "N 2,000";
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
      if (!g.error) setGroups(g.data?.groups || []);
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

  const rows = groups ? groups.map(mapRow) : ROWS;
  const counts = groups
    ? {
        all: rows.length,
        active: rows.filter((r) => r.bucket === "active").length,
        pending: rows.filter((r) => r.bucket === "pending").length,
        expired: rows.filter((r) => r.bucket === "expired").length,
        failed: rows.filter((r) => r.bucket === "failed").length,
      }
    : { all: 8, active: 4, pending: 1, expired: 2, failed: 1 };
  const tabs = groups
    ? [
        { label: `All (${counts.all})` },
        { label: `Activated (${counts.active})`, width: "w-[140px]" },
        { label: `Pending (${counts.pending})`, width: "w-[140px]" },
        { label: `Expired (${counts.expired})`, width: "w-[140px]" },
        { label: `Failed (${counts.failed})`, width: "w-[140px]" },
      ]
    : TABS;
  const shown =
    tab === 0
      ? rows
      : rows.filter((r) => (r.bucket || labelBucket(r.statusLabel)) === FILTERS[tab]);
  const stats = groups
    ? [
        String(groups.length),
        String(groups.reduce((s, g) => s + (g.occupied_slots || 0), 0)),
        monthly != null ? kobo(monthly) : undefined,
      ]
    : undefined;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
            <TitleBlock />
            <GroupStats className="mt-[50px]" values={stats} />
            <GroupTabs tabs={tabs} viewAll className="mt-[50px]" active={tab} onSelect={setTab} />
            <div className="mt-[50px] flex flex-col gap-[30px]">
              {shown.map((r) => (
                <SubCard key={r.key || r.title} to="/groups/details" {...r} />
              ))}
            </div>
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
          <GroupTabs tabs={tabs} className="mt-[12px]" active={tab} onSelect={setTab} />
          <div className="mt-[30px] flex flex-col gap-[10px]">
            {shown.map((r) => (
              <SubCard key={r.key || r.title} to="/groups/details" noView {...r} />
            ))}
          </div>
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
