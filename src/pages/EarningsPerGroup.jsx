import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { EarningTxRow, EarningTxRowSk, FilterSelect } from "../components/EarningRows";
import { api, brandOf, fmtTx, kobo2, monthOf, monthsIn } from "../lib/api";

const SUB = "Track your earnings, manage payouts and grow with Clyse.";

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";

const unluckyGroups = (g) => (Array.isArray(g) ? g : []);

export default function EarningsPerGroup() {
  const [groups, setGroups] = useState(null);
  const [lots, setLots] = useState(null);
  const [failed, setFailed] = useState(false);
  const [groupF, setGroupF] = useState("All Groups");
  const [monthF, setMonthF] = useState("All time");

  useEffect(() => {
    let live = true;
    (async () => {
      const [g, l] = await Promise.all([
        api("/member/groups"),
        api("/member/earnings/lots?limit=50"),
      ]);
      if (!live) return;
      if (!g.error) setGroups(g.data?.groups || []);
      if (!l.error) setLots(l.data?.earnings || l.data?.lots || []);
      if (g.error || l.error) setFailed(true);
    })();
    return () => {
      live = false;
    };
  }, []);

  const rows =
    groups && lots
      ? groups.map((g) => {
          const gl = lots.filter((l) => l.group_id === g.id);
          const sum = gl.reduce((s, l) => s + (l.amount_kobo || 0), 0);
          const latest = gl.map((l) => l.created_at).filter(Boolean).sort().pop();
          return {
            key: g.id,
            brand: brandOf(g.service),
            name:
              [g.service?.name, g.plan?.name].filter(Boolean).join(" ") || "Group",
            sub: fmtTx(latest || g.created_at),
            mSub: "Group Subscription",
            earning: kobo2(sum),
            sumKobo: sum,
            count: String(g.occupied_slots ?? 0),
            date: fmtTx(latest || g.created_at),
            status:
              gl.length > 0 && gl.every((l) => l.status === "available")
                ? "Successful"
                : "Pending",
          };
        })
      : null;
  const empty = rows && rows.length === 0;
  const base = rows || [];
  const groupOpts = ["All Groups", ...new Set(base.map((r) => r.name))];
  const monthOpts = ["All time", ...monthsIn(base.map((r) => r.date || r.sub))];
  const shown = base.filter(
    (r) =>
      (groupF === "All Groups" || r.name === groupF) &&
      (monthF === "All time" || monthOf(r.date || r.sub) === monthF),
  );
  const filteredOut = rows && shown.length === 0 && !empty;
  const totalKobo = base.reduce((t, r) => t + (r.sumKobo || 0), 0);
  const memberCount = (groups || unluckyGroups(groups)).reduce
    ? (groups || []).reduce((n, g) => n + (g.occupied_slots || 0), 0)
    : 0;

  /* Card 22 ("redesign | information missing"): the page opened on two filters
     and a transaction list with no totals at all. */
  const Summary = ({ small = false }) => (
    <div
      className={`grid grid-cols-3 gap-[10px] ${small ? "mt-[18px]" : "mt-[30px]"}`}
    >
      {[
        ["Total earning", kobo2(totalKobo)],
        ["Groups", String(base.length)],
        ["Members", String(memberCount)],
      ].map(([label, value]) => (
        <div
          key={label}
          className={`rounded-[12px] border border-clyse bg-white shadow-[0_0_13.87px_rgba(0,23,1,0.06)] ${
            small ? "px-[12px] py-[12px]" : "px-[20px] py-[18px]"
          }`}
        >
          <p
            className={`font-semibold text-[#6B6B6B] ${
              small ? "text-[11px] leading-[15px]" : "text-[16px] leading-[20px]"
            }`}
          >
            {label}
          </p>
          <p
            className={`mt-[2px] font-bold break-words text-ink ${
              small ? "text-[15px] leading-[19px]" : "text-[24px] leading-[30px]"
            }`}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#E4F6E5_0%,#EFFAF0_240px,#FBFEFB_420px)] font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="Earning" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Earnings Per Group
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] flex gap-[40px]">
              <FilterSelect label="All Groups" options={groupOpts} value={groupF} onChange={setGroupF} className="min-w-0 flex-1" />
              <FilterSelect label="Last Month" options={monthOpts} value={monthF} onChange={setMonthF} className="min-w-0 flex-1" />
            </div>
            <Summary />
            <div className={`mt-[24px] rounded-[20px] border border-clyse bg-white px-[30px] ${SHADOW}`}>
              <div className="flex h-[70px] items-center">
                <span className="w-[380px] flex-none text-[20px] leading-[24px] font-bold text-black">
                  Group
                </span>
                <span className="w-[170px] flex-none text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Earning
                </span>
                <span className="ml-[10px] w-[100px] flex-none text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Member
                </span>
                <span className="ml-[10px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Status
                </span>
              </div>
              {!rows && !failed ? (
                [0, 1, 2, 3].map((i) => <EarningTxRowSk key={i} />)
              ) : (
                shown.map((r) => <EarningTxRow key={r.key || r.name} {...r} />)
              )}
              {empty && (
                <p className="pb-[30px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No groups yet. Create one to start earning.
                </p>
              )}
              {filteredOut && (
                <p className="pb-[30px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No earnings match these filters.
                </p>
              )}
              {failed && (
                <p className="pb-[30px] text-[18px] leading-[22px] font-semibold text-[#FF0000]">
                  Could not load earnings. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M18 777:26094): 20px title, mint filters, no Extra */}
      <main className="relative bg-white pb-[26px] xl:hidden">
        <div className="relative bg-white px-[30px] pt-[30px] pb-[24px]">
          <h1 className="text-[20px] leading-[24px] font-bold text-black">
            Earnings Per Group
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[24px] flex gap-[16px]">
            <FilterSelect label="All Groups" options={groupOpts} value={groupF} onChange={setGroupF} className="min-w-0 flex-1 shadow-[0_0_12px_rgba(0,23,1,0.10)]" />
            <FilterSelect label="Last Month" options={monthOpts} value={monthF} onChange={setMonthF} className="min-w-0 flex-1 shadow-[0_0_12px_rgba(0,23,1,0.10)]" />
          </div>
          <Summary small />
        </div>
        <div className={`relative mx-[30px] mt-[18px] rounded-[20px] border border-clyse bg-white pt-[22px] pb-[22px] ${SHADOW}`}>
          <div className="flex items-center px-[20px]">
            <h2 className="text-[18px] leading-[22px] font-bold text-ink">
              Transaction History
            </h2>
            <Link
              to="/earnings"
              className="ml-auto text-[13px] leading-[16px] font-semibold text-clyse"
            >
              View all
            </Link>
          </div>
          <div className="mt-[18px] flex flex-col gap-[12px] px-[16px]">
            {!rows && !failed ? (
              [0, 1, 2, 3].map((i) => <EarningTxRowSk key={i} />)
            ) : (
              shown.map((r, i) => (
                <EarningTxRow key={`${r.key || r.name}-${i}`} {...r} />
              ))
            )}
            {empty && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No groups yet. Create one to start earning.
              </p>
            )}
            {filteredOut && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No earnings match these filters.
              </p>
            )}
            {failed && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#FF0000]">
                Could not load earnings. Please try again.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
