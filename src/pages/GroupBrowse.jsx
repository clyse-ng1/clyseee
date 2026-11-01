import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SubCard, { SubCardSk } from "../components/SubCard";
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
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState(0);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error } = await api("/member/groups");
      if (!live) return;
      if (error) setFailed(true);
      else setGroups(data?.groups || []);
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
    { label: `All (${counts.all})`, width: "w-[69px] xl:w-[94px]" },
    { label: `Activated (${counts.active})`, width: "w-[120px] xl:w-[140px]" },
    { label: `Pending (${counts.pending})`, width: "w-[120px] xl:w-[140px]" },
    { label: `Expired (${counts.expired})`, width: "w-[120px] xl:w-[140px]" },
    { label: `Failed (${counts.failed})`, width: "w-[120px] xl:w-[140px]" },
  ];
  const mrows = rows;
  const shown = mrows.filter(
    (r) =>
      (tab === 0 || r.bucket === FILTERS[tab]) &&
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
              {!groups && !failed ? (
                [0, 1, 2, 3].map((i) => <SubCardSk key={i} />)
              ) : (
                rows.map((r) => (
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
