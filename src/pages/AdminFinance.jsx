import { useState } from "react";
import { Link } from "react-router-dom";
import useAdminRows from "../components/useAdminRows";
import AdminShell, { DotsIcon, DCARD, DarkZone, DarkFilter, AdminEmpty} from "../components/AdminShell";
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
        {r.when || "Sep. 20, 2026"}
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
            {r.email || "clysewebapp@gmail.com"}
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
        {r.fee || "N200"}
      </div>
      <div className="flex-none" style={{ width: COLS[7] }}>
        <FinPill tone={/fail|revers/.test(r.status || "") ? "red" : /pend|process/.test(r.status || "") ? "orange" : "green"}>
          {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Completed"}
        </FinPill>
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[8] }}>
        {r.ref || "TRN-0004455"}
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
  const { rows: live, status } = useAdminRows("transactions");
  const pay = useAdminRows("payouts");
  const [fType, setFType] = useState("All");
  const typeOpts = ["All", ...new Set((live || ROWS).map((r) => r.type))];
  const shown = (live || ROWS).filter((r) => fType === "All" || r.type === fType);
  const headers = ["", "Date and Time", "Type", "User", "Group / Subscription", "Amount", "Clyse Fee", "Status", "Reference", "Action"];
  return (
    <AdminShell active="finance" sub="transactions" expand nav2>
      <DarkZone>
      <div className="mt-[22px] flex flex-wrap gap-[20px]">
        <StatCard dark className="min-w-[220px] flex-1" label="Total Revenue" value={status === "live" || status === "empty" ? `N${Math.round((live || []).reduce((a, r) => a + (r.tone === "green" ? r.amountKobo : 0), 0) / 100).toLocaleString("en-US")}` : "124,000"} badge={badgeGreen} glyph={<UsersGlyph />} />
        <StatCard dark className="min-w-[220px] flex-1" label="Clyse Fee" value={status === "live" || status === "empty" ? `N${Math.round((live || []).reduce((a, r) => a + (r.feeKobo || 0), 0) / 100).toLocaleString("en-US")}` : "124,000"} badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard dark className="min-w-[220px] flex-1" label="Total Payout" value={pay.status === "live" || pay.status === "empty" ? `N${Math.round((pay.rows || []).filter((p) => p.status === "paid" || p.status === "successful").reduce((a, p) => a + (p.netKobo || 0), 0) / 100).toLocaleString("en-US")}` : "122"} badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard dark className="min-w-[220px] flex-1" label="Pending Payout" value={pay.status === "live" || pay.status === "empty" ? String((pay.rows || []).filter((p) => p.status === "pending" || p.status === "processing").length) : "122"} badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <DarkFilter />
      {status === "empty" && (
        <AdminEmpty dark title="No transactions yet" hint="Wallet fundings, subscription payments, Clyse fees, refunds and payouts will appear here as soon as they post." />
      )}
      <div className={`mt-[26px] w-fit min-w-full overflow-hidden ${status === "empty" ? "hidden" : ""} ${DCARD}`}>
        <div className="min-w-[1929px]">
          <div className="flex h-[50px] items-center rounded-t-[11px] bg-[#E5FFEB]">
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
            {shown.map((r, i) => (
              <Row key={`${r.item}-${i}`} r={r} i={i} />
            ))}
            {shown.length === 0 && (
              <p className="px-[21px] py-[20px] text-[16px] font-semibold text-[#4E4E4E]">
                No transactions match these filters.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-[26px] flex flex-wrap gap-[20px]">
        <RecentActivities dark className="w-full max-w-full flex-1 lg:w-[473px]" items={status === "live" || status === "empty" ? (live || []).slice(0, 4).map((r) => ({ name: `${r.type} — ${r.name}`, date: r.when, amount: r.amount, up: r.tone === "green", status: r.status })) : null} />
        <OverviewChart dark className="w-full max-w-full flex-1 lg:w-[607px]" />
      </div>
      </DarkZone>
    </AdminShell>
  );
}
