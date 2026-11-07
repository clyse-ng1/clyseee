import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { EarningMemberRow, EarningMemberRowSk, FilterSelect } from "../components/EarningRows";
import { api, brandOf, fmtTx, kobo2, nairaNum, monthOf, monthsIn } from "../lib/api";

const SUB = "Track your earnings, manage payouts and grow with Clyse.";

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";

function memberStatus(m, lots) {
  if ((m.status || "").toLowerCase() !== "active") return "Failed";
  const ml = lots.filter((l) => l.membership_id === m.membership_id);
  if (ml.length > 0 && ml.every((l) => l.status === "available")) return "Successful";
  return "Pending";
}

export default function EarningsPerMember() {
  const [rows, setRows] = useState(null);
  const [failed, setFailed] = useState(false);
  const [groupF, setGroupF] = useState("All Groups");
  const [monthF, setMonthF] = useState("All time");

  useEffect(() => {
    let live = true;
    (async () => {
      const g = await api("/member/groups");
      const lotsRes = await api("/member/earnings/lots?limit=50");
      if (!live) return;
      if (g.error || lotsRes.error) {
        setFailed(true);
        return;
      }
      const groups = g.data?.groups || [];
      const lots = lotsRes.data?.earnings || lotsRes.data?.lots || [];
      const perGroup = await Promise.all(
        groups.map(async (grp) => {
          const m = await api(`/member/groups/members?group_id=${grp.id}`);
          return { grp, members: m.data?.members || [] };
        }),
      );
      if (!live) return;
      const out = [];
      for (const { grp, members } of perGroup) {
        const groupName =
          [grp.service?.name, grp.plan?.name].filter(Boolean).join(" ") || "Group";
        const planName = grp.plan?.name ? `${grp.plan.name} Plan` : "Premium Plan";
        for (const m of members) {
          const sum = lots
            .filter((l) => l.membership_id === m.membership_id)
            .reduce((s, l) => s + (l.amount_kobo || 0), 0);
          out.push({
            key: m.membership_id,
            name: m.first_name || m.full_name || "Member",
            date: fmtTx(m.joined_at),
            group: groupName,
            plan: planName,
            payment: nairaNum(sum),
            mPayment: kobo2(sum),
            status: memberStatus(m, lots),
            mBrand: brandOf(grp.service),
          });
        }
      }
      setRows(out);
    })();
    return () => {
      live = false;
    };
  }, []);

  const dRows = rows || [];
  const mRows = (rows || []).map((r) => ({ ...r, payment: r.mPayment }));
  const empty = rows && rows.length === 0;
  const matchF = (r) =>
    (groupF === "All Groups" || r.group === groupF) &&
    (monthF === "All time" || monthOf(r.date) === monthF);
  const groupOpts = ["All Groups", ...new Set([...dRows, ...mRows].map((r) => r.group))];
  const monthOpts = ["All time", ...monthsIn([...dRows, ...mRows].map((r) => r.date))];
  const dShown = dRows.filter(matchF);
  const mShown = mRows.filter(matchF);

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="Earning" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Earnings Per Member
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] flex gap-[40px]">
              <FilterSelect label="All Groups" options={groupOpts} value={groupF} onChange={setGroupF} className="min-w-0 flex-1" />
              <FilterSelect label="Last Month" options={monthOpts} value={monthF} onChange={setMonthF} className="min-w-0 flex-1" />
            </div>
            <div className={`mt-[50px] rounded-[20px] bg-white px-[30px] ${SHADOW}`}>
              <div className="flex h-[70px] items-center">
                <span className="w-[350px] flex-none text-[20px] leading-[24px] font-bold text-black">
                  Members
                </span>
                <span className="w-[180px] flex-none text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Group
                </span>
                <span className="ml-[10px] w-[100px] flex-none text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Payment
                </span>
                <span className="ml-[10px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Status
                </span>
              </div>
              {!rows && !failed ? (
                [0, 1, 2, 3].map((i) => <EarningMemberRowSk key={i} />)
              ) : (
                dShown.map((r) => <EarningMemberRow key={r.key || r.name} {...r} />)
              )}
              {empty && (
                <p className="pb-[30px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No members yet. Share a group to start earning.
                </p>
              )}
              {rows && !empty && dShown.length === 0 && (
                <p className="pb-[30px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No members match these filters.
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
      {/* Mobile (M19 777:26955): 20px title, mint filters, no Extra */}
      <main className="relative pb-[50px] xl:hidden">
        <BlurBg variant="page" />
        <div className="relative bg-white px-[30px] pt-[46px] pb-[40px]">
          <h1 className="text-[20px] leading-[24px] font-bold text-black">
            Earnings Per Member
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[50px] flex gap-[16px]">
            <FilterSelect label="All Groups" options={groupOpts} value={groupF} onChange={setGroupF} className="min-w-0 flex-1 shadow-[0_0_12px_rgba(0,23,1,0.10)]" />
            <FilterSelect label="Last Month" options={monthOpts} value={monthF} onChange={setMonthF} className="min-w-0 flex-1 shadow-[0_0_12px_rgba(0,23,1,0.10)]" />
          </div>
        </div>
        <div className={`relative mt-[30px] rounded-[20px] bg-white pt-[30px] pb-[30px] ${SHADOW}`}>
          <div className="flex items-center px-[50px]">
            <h2 className="text-[18px] leading-[22px] font-bold text-ink">
              Transaction History
            </h2>
            <span className="ml-auto text-[13px] leading-[16px] font-semibold text-clyse">
              View all
            </span>
          </div>
          <div className="mt-[30px] flex flex-col gap-[15px] px-[30px]">
            {!rows && !failed ? (
              [0, 1, 2, 3].map((i) => <EarningMemberRowSk key={i} />)
            ) : (
              mShown.map((r) => <EarningMemberRow key={r.key || r.name} {...r} />)
            )}
            {empty && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No members yet. Share a group to start earning.
              </p>
            )}
            {rows && !empty && mShown.length === 0 && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No members match these filters.
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
