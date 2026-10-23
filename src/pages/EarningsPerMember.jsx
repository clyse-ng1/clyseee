import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { EarningMemberRow, FilterSelect } from "../components/EarningRows";
import { api, brandOf, fmtTx, kobo2, nairaNum } from "../lib/api";

const SUB = "Track your earnings, manage payouts and grow with Clyse.";

/* Figma samples, shown while the live members load. */
const ROWS = [
  { name: "Makenna Calzoni", group: "Netflix Premium", plan: "Premium Plan", payment: "2,000", status: "Successful" },
  { name: "Makenna Botosh", group: "Adobe Creative Cloud", plan: "Premium Plan", payment: "1,500", status: "Successful" },
  { name: "Brandon Press", group: "Canva Pro", plan: "Standard Plan", payment: "3,000", status: "Successful" },
  { name: "Allison Franci", group: "CapCut Pro", plan: "Premium Plan", payment: "3,000", status: "Successful" },
  { name: "Marcus Saris", group: "Prime Video Premium", plan: "Premium Plan", payment: "2,000", status: "Successful" },
  { name: "Cheyenne Septimus", group: "Amazon", plan: "Premium Plan", payment: "3,000", status: "Successful" },
  { name: "James Rosser", group: "YouTube Premium", plan: "Premium Plan", payment: "2,000", status: "Successful" },
  { name: "Makenna Press", group: "Netflix Premium", plan: "Premium Plan", payment: "3,000", status: "Successful" },
  { name: "Kianna Saris", group: "Spotify", plan: "Premium Plan", payment: "2,000", status: "Successful" },
  { name: "Desirae George", group: "Canva Pro", plan: "Premium Plan", payment: "3,000", status: "Successful" },
  { name: "Marilyn Geidt", group: "Prime Video Premium", plan: "Premium Plan", payment: "2,000", status: "Successful" },
];

/* Mobile rows (M19 777:26955): 7 three-line member transactions. Tiles are
   service-mismatched per Figma (mBrand); "Neflix" fixed to Netflix. */
const M_ROWS = [
  { name: "Aspen Stanton", group: "Netflix Premium", plan: "Premium Plan", payment: "₦10,000.00", date: "Sep 26, 2025 · 04:12 AM", status: "Successful", mBrand: "youtube" },
  { name: "Talan Saris", group: "Adobe Creative Cloud", plan: "Standard Plan", payment: "₦34,500.00", date: "Sep 26, 2025 · 04:12 PM", status: "Successful", mBrand: "netflix" },
  { name: "Martin Siphron", group: "Canva Pro", plan: "Standard Plan", payment: "₦50,000.00", date: "Sep 24, 2025 · 09:02 AM", status: "Successful", mBrand: "spotify" },
  { name: "Jocelyn Torff", group: "Netflix Premium", plan: "Premium Plan", payment: "₦52,000.00", date: "28 Sep 2026", status: "Pending", mBrand: "amazon" },
  { name: "Talan Schleifer", group: "CapCut Pro", plan: "Standard Plan", payment: "₦10,000.00", date: "Sep 20, 2025 · 11:17 AM", status: "Pending", mBrand: "youtube" },
  { name: "Maren Bergson", group: "Amazon", plan: "Premium Plan", payment: "₦1,500.00", date: "Sep 16, 2025 · 06:21 PM", status: "Pending ", mBrand: "canva" },
  { name: "Randy Bergson", group: "CapCut Pro", plan: "Standard Plan", payment: "₦1,500.00", date: "Sep 16, 2025 · 06:21 PM", status: "Failed", mBrand: "amazon" },
];

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";

function memberStatus(m, lots) {
  if ((m.status || "").toLowerCase() !== "active") return "Failed";
  const ml = lots.filter((l) => l.membership_id === m.membership_id);
  if (ml.length > 0 && ml.every((l) => l.status === "available")) return "Successful";
  return "Pending";
}

export default function EarningsPerMember() {
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const g = await api("/member/groups");
      const groups = g.data?.groups || [];
      const lotsRes = await api("/member/earnings/lots?limit=50");
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

  const dRows = rows || ROWS;
  const mRows = rows ? rows.map((r) => ({ ...r, payment: r.mPayment })) : M_ROWS;
  const empty = rows && rows.length === 0;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="Earning" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Earnings Per Member
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] flex gap-[40px]">
              <FilterSelect label="All Groups" />
              <FilterSelect label="Last Month" mLabel="October" />
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
              {dRows.map((r) => (
                <EarningMemberRow key={r.key || r.name} {...r} />
              ))}
              {empty && (
                <p className="pb-[30px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No members yet. Share a group to start earning.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M19 777:26955): 20px title, mint filters, no Extra */}
      <main className="relative pb-[50px] xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <h1 className="text-[20px] leading-[24px] font-bold text-black">
            Earnings Per Member
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[50px] flex gap-[40px]">
            <FilterSelect label="All Groups" />
            <FilterSelect label="Last Month" mLabel="October" />
          </div>
        </div>
        <div className={`mt-[30px] rounded-[20px] bg-white pt-[30px] pb-[30px] ${SHADOW}`}>
          <div className="flex items-center px-[50px]">
            <h2 className="text-[18px] leading-[22px] font-bold text-ink">
              Transaction History
            </h2>
            <span className="ml-auto text-[13px] leading-[16px] font-semibold text-clyse">
              View all
            </span>
          </div>
          <div className="mt-[30px] flex flex-col gap-[15px] px-[30px]">
            {mRows.map((r) => (
              <EarningMemberRow key={r.key || r.name} {...r} />
            ))}
            {empty && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No members yet. Share a group to start earning.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
