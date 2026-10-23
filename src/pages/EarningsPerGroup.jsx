import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { EarningTxRow, FilterSelect, TX_DATE } from "../components/EarningRows";
import { api, brandOf, fmtTx, kobo2 } from "../lib/api";

const SUB = "Track your earnings, manage payouts and grow with Clyse.";

/* Figma lists 11 rows with Adobe x3 and CapCut x2 pasted identically.
   Per-group table = one row per group, deduped to 8.
   Shown while the live groups load. */
const ROWS = [
  { brand: "netflix", name: "Netflix Premium", sub: TX_DATE, mSub: "Group Subscription", earning: "N10,000.00", count: "20", date: TX_DATE, status: "Successful" },
  { brand: "canva", name: "Canva Pro", sub: TX_DATE, mSub: "Group Subscription", earning: "N30,000.00", count: "30", date: TX_DATE, status: "Successful" },
  { brand: "adobe", name: "Adobe Creative Cloud", sub: "From Bank Transfer", mSub: "Group Subscription", earning: "N10,000.00", count: "12", date: TX_DATE, status: "Pending" },
  { brand: "amazon", name: "Amazon", sub: TX_DATE, mSub: "Group Subscription", earning: "N20,000.00", count: "20", date: TX_DATE, status: "Successful" },
  { brand: "capcut", name: "CapCut Pro", sub: TX_DATE, mSub: "Group Subscription", earning: "N50,000.00", count: "24", date: TX_DATE, status: "Successful" },
  { brand: "youtube", name: "YouTube Premium", sub: TX_DATE, mSub: "Group Subscription", earning: "N50,000.00", count: "32", date: TX_DATE, status: "Successful" },
  { brand: "prime", name: "Prime Video Pro", sub: TX_DATE, mSub: "Group Subscription", earning: "N50,000.00", count: "35", date: TX_DATE, status: "Successful" },
  { brand: "spotify", name: "Spotify Pro", sub: TX_DATE, mSub: "Group Subscription", earning: "N50,000.00", count: "20", date: TX_DATE, status: "Successful" },
];
const M_ROWS = ROWS;

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";

export default function EarningsPerGroup() {
  const [groups, setGroups] = useState(null);
  const [lots, setLots] = useState(null);

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
              Earnings Per Group
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className="mt-[50px] flex gap-[40px]">
              <FilterSelect label="All Groups" />
              <FilterSelect label="Last Month" />
            </div>
            <div className={`mt-[50px] rounded-[20px] bg-white px-[30px] ${SHADOW}`}>
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
              {(rows || ROWS).map((r) => (
                <EarningTxRow key={r.key || r.name} {...r} />
              ))}
              {empty && (
                <p className="pb-[30px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No groups yet. Create one to start earning.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M18 777:26094): 20px title, mint filters, no Extra */}
      <main className="relative pb-[26px] xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <h1 className="text-[20px] leading-[24px] font-bold text-black">
            Earnings Per Group
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
            {(rows || M_ROWS).map((r, i) => (
              <EarningTxRow key={`${r.key || r.name}-${i}`} {...r} />
            ))}
            {empty && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No groups yet. Create one to start earning.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
