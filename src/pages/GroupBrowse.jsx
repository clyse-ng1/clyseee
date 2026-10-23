import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubCard from "../components/SubCard";
import GroupTabs from "../components/GroupTabs";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import { api, brandOf, kobo } from "../lib/api";
import { groupBucket } from "../lib/useGroup";
import iconSearch from "../assets/icon-search.svg";

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

/* Figma lists 16 rows: the 8 services pasted twice (Netflix/YouTube/Canva
   triplicated). Deduped to the 8 unique services in first-appearance order.
   Shown while the live groups load. */
const ROWS = [
  { brand: "adobe", title: "Adobe Creative Cloud", plan: "Standard Plan", price: "N3,000", subLine: "12 Slot Shared", ...ACTIVE },
  { brand: "netflix", title: "Netflix Premium", plan: "Premium Plan", price: "N2,000", subLine: "50 Members", ...ACTIVE },
  { brand: "youtube", title: "YouTube Premium", plan: "Premium Plan", price: "N2,000", subLine: "Renews in 12 days", ...PENDING },
  { brand: "spotify", title: "Spotify Premium", plan: "Premium Plan", price: "N2,000", subLine: "Renews in 12 days", ...ACTIVE },
  { brand: "canva", title: "Canva Pro", plan: "Premium Plan", price: "N5,000", subLine: "Renews in 12 days", ...FAILED },
  { brand: "amazon", title: "Amazon", plan: "Premium Plan", price: "N2,000", subLine: "Renews in 12 days", ...ACTIVE },
  { brand: "capcut", title: "CapCut Pro", plan: "Premium Plan", price: "N3,300", subLine: "Renews in 12 days", ...EXPIRED, dim: true },
  { brand: "prime", title: "Cloud", plan: "Prime Video", price: "N2,000", subLine: "Renews in 12 days", ...EXPIRED },
];

const TABS = [
  { label: "All (8)", width: "w-[69px] xl:w-[94px]" },
  { label: "Activated (4)", width: "w-[120px] xl:w-[140px]" },
  { label: "Pending (1)", width: "w-[120px] xl:w-[140px]" },
  { label: "Expired (2)", width: "w-[120px] xl:w-[140px]" },
  { label: "Failed (1)", width: "w-[120px] xl:w-[140px]" },
];

/* Mobile card data (M10 691:20651): 14 Figma rows deduped to 8 unique
   services in first-appearance order; uniform Premium Plan / N 2,000. */
const M_ACTIVE = {
  mLabel: "Activated",
  mBg: "bg-[#DFFFE0]",
  mText: "text-clyse",
  mDot: "bg-clyse",
};
const M_PENDING = {
  mLabel: "Pending",
  mBg: "bg-[#FDEED9]",
  mText: "text-[#FF9400]",
  mDot: "bg-[#FF9400]",
};
const M_FAILED = {
  mLabel: "Failed",
  mBg: "bg-[#FFF1F1]",
  mText: "text-[#FF0000]",
  mDot: "bg-[#FF0000]",
};
const M_EXPIRED = {
  mLabel: "Expired",
  mBg: "bg-[#E9E9E9]",
  mText: "text-black",
  mDot: "bg-black",
};

const M_ROWS = [
  { brand: "adobe", mPlan: "Premium Plan", mPrice: "N2,000" },
  { brand: "netflix", mPlan: "Premium Plan", mPrice: "N2,000", mSub: "13 Slot Shared" },
  { brand: "amazon", mPlan: "Premium Plan", mPrice: "N2,000", mSub: "30 Slot Shared", ...M_PENDING },
  { brand: "canva", mPlan: "Premium Plan", mPrice: "N2,000", mSub: "30 Slot Shared" },
  { brand: "capcut", mPlan: "Premium Plan", mPrice: "N2,000", mSub: "14 Slot Shared", ...M_FAILED },
  { brand: "youtube", mTitle: "YouTube", ...M_ACTIVE },
  { brand: "prime", mTitle: "Prime Video Premium", mPlan: "Premium Plan", mSub: "20 Slot Shared", ...M_ACTIVE },
  { brand: "spotify", ...M_EXPIRED },
].map((m) => ({ ...ROWS.find((r) => r.brand === m.brand), ...m }));

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
  const price = g.plan?.total_price_kobo != null ? kobo(g.plan.total_price_kobo) : "N2,000";
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

export default function GroupBrowse() {
  const [groups, setGroups] = useState(null);
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error } = await api("/member/groups");
      if (live && !error) setGroups(data?.groups || []);
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
        { label: `All (${counts.all})`, width: "w-[69px] xl:w-[94px]" },
        { label: `Activated (${counts.active})`, width: "w-[120px] xl:w-[140px]" },
        { label: `Pending (${counts.pending})`, width: "w-[120px] xl:w-[140px]" },
        { label: `Expired (${counts.expired})`, width: "w-[120px] xl:w-[140px]" },
        { label: `Failed (${counts.failed})`, width: "w-[120px] xl:w-[140px]" },
      ]
    : TABS;
  const bucketOf = (r) => r.bucket || labelBucket(r.statusLabel);
  const mrows = groups ? rows : M_ROWS;
  const shown = mrows.filter(
    (r) =>
      (tab === 0 || bucketOf(r) === FILTERS[tab]) &&
      (!query.trim() || r.title.toLowerCase().includes(query.trim().toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              My Group
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <p className="mt-[77px] ml-[114px] text-[25px] leading-[30px] font-bold text-[#999999]">
              Browse Subscription
            </p>
            <div className="mt-[177px] flex flex-col gap-[30px]">
              {rows.map((r) => (
                <SubCard key={r.key || r.title} to="/groups/details" {...r} />
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M10 691:20651) */}
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
            My Group
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[50px] flex h-[55px] w-full items-center rounded-[10px] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
            <img src={iconSearch} alt="" className="ml-[30px] h-[31px] w-[31px] flex-none" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Browse Subscription"
              className="ml-[27px] w-full bg-transparent text-[17px] leading-[24px] font-semibold text-ink outline-none placeholder:text-[#999999]"
            />
          </div>
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
