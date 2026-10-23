import { Link } from "react-router-dom";
import AdminShell, { BackTitle, DotsIcon } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";
import {
  StatCard,
  badgeGreen,
  badgeMint,
  badgeOrange,
  UsersGlyph,
  CheckGlyph,
  FilterBar,
  FinPill,
  CheckBox,
  Pagination,
  FinAvatar,
  RecentActivities,
  OverviewChart,
} from "../components/FinanceShared";

/* Finance > Transactions — Figma 1187:28004 (desktop). Static: no admin
   finance endpoints exist, so search/filters/pagination are display-only.
   Copy fix: designer email typo "gmial" -> "gmail". */

const ROWS = [
  { name: "Maria Philips", brand: "netflix", item: "Netflix Premium", kind: "Subscription", type: "Subscription Payment", tone: "green", amount: "N3,000" },
  { name: "James Lipshutz", brand: "spotify", item: "Spotify Premium", kind: "Group", type: "Payout", tone: "red", amount: "N5,000" },
  { name: "Dulce Press", brand: "canva", item: "Canva Pro", kind: "Subscription", type: "Refund", tone: "red", amount: "N6,000" },
  { name: "Kaylynn Dokidis", brand: "adobe", item: "Adobe Creative Cloud", kind: "Group", type: "Group Payment", tone: "purple", amount: "N3,000" },
  { name: "Maria Philips", brand: "capcut", item: "CapCut Pro", kind: "Subscription", type: "Subscription Payment", tone: "green", amount: "N6,000" },
  { name: "Kaylynn Dokidis", brand: "youtube", item: "YouTube Premium", kind: "Group", type: "Payout", tone: "red", amount: "N3,000" },
  { name: "Maria Philips", brand: "netflix", item: "Netflix Premium", kind: "Subscription", type: "Subscription Payment", tone: "green", amount: "N4,000" },
];

const COLS = [71, 244, 299, 322, 299, 156, 129, 178, 157, 74];

function Row({ r, i }) {
  return (
    <div className="flex h-[112px] items-center">
      <div className="flex-none pl-[21px]" style={{ width: COLS[0] }}>
        <CheckBox label={`Select ${r.item}`} />
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[1] }}>
        Sep. 20, 2026
      </div>
      <div className="flex-none" style={{ width: COLS[2] }}>
        <FinPill tone={r.tone}>{r.type}</FinPill>
      </div>
      <div className="flex flex-none items-center" style={{ width: COLS[3] }}>
        <FinAvatar i={i} />
        <span className="ml-[10px]">
          <span className="block text-[18px] leading-[22px] font-bold whitespace-nowrap text-[#001701]">
            {r.name}
          </span>
          <span className="block text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
            clysewebapp@gmail.com
          </span>
        </span>
      </div>
      <div className="flex flex-none items-center" style={{ width: COLS[4] }}>
        <BrandTile brand={r.brand} size={50} />
        <span className="ml-[10px]">
          <span className="block text-[18px] leading-[22px] font-bold whitespace-nowrap text-[#001701]">
            {r.item}
          </span>
          <span className="block text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
            {r.kind}
          </span>
        </span>
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[5] }}>
        {r.amount}
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[6] }}>
        N200
      </div>
      <div className="flex-none" style={{ width: COLS[7] }}>
        <FinPill tone="green">Completed</FinPill>
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[8] }}>
        TRN-0004455
      </div>
      <div className="flex-none" style={{ width: COLS[9] }}>
        <Link
          to="/admin/finance/transactions/details"
          aria-label={`Open ${r.item} details`}
          className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full hover:bg-[#F1F8F2]"
        >
          <DotsIcon />
        </Link>
      </div>
    </div>
  );
}

export default function AdminFinance() {
  const headers = ["", "Date and Time", "Type", "User", "Group / Subscription", "Amount", "Clyse Fee", "Status", "Reference", "Action"];
  return (
    <AdminShell active="finance" sub="transactions">
      <BackTitle title="Transaction" />
      <div className="mt-[47px] flex gap-[30px]">
        <StatCard className="w-[278px] flex-none" label="Total Revenue" value="124,000" badge={badgeGreen} glyph={<UsersGlyph />} />
        <StatCard className="w-[278px] flex-none" label="Clyse Fee" value="124,000" badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard className="w-[231px] flex-none" label="Total Payout" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard className="flex-1" label="Pending Payout" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <div className="mt-[30px]">
        <FilterBar labels={["Transaction Type", "Status", "Date Range"]} />
      </div>
      <div className="mt-[30px] w-fit min-w-full rounded-[20px] border border-[#999999] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <div className="min-w-[1929px]">
          <div className="flex h-[50px] items-center rounded-t-[19px] bg-[#DFFFE0]/80">
            {headers.map((h, i) => (
              <div
                key={h || "check"}
                className="flex-none text-[16px] leading-[20px] font-semibold text-[#4E4E4E]"
                style={{ width: COLS[i], paddingLeft: i === 0 ? 21 : 0 }}
              >
                {i === 0 ? <CheckBox label="Select all" /> : h}
              </div>
            ))}
          </div>
          <div className="divide-y divide-[#999999]">
            {ROWS.map((r, i) => (
              <Row key={`${r.item}-${i}`} r={r} i={i} />
            ))}
          </div>
          <Pagination />
        </div>
      </div>
      <div className="mt-[30px] flex gap-[30px]">
        <RecentActivities />
        <OverviewChart />
      </div>
    </AdminShell>
  );
}
