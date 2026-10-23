import { Link } from "react-router-dom";
import AdminShell, { BackTitle } from "../components/AdminShell";
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
  Donut,
} from "../components/FinanceShared";

/* Finance > Reconciliation — Figma 1214:25954 (desktop). Static.
   Frame name typo "Reconiliation" fixed in the title. */

const ROWS = [
  { type: "Payment", typeTone: "green", status: "Completed", statusTone: "green", match: "Matched", matchTone: "green" },
  { type: "Payout", typeTone: "red", status: "Process", statusTone: "orange", match: "Unmatched", matchTone: "red" },
  { type: "Payment", typeTone: "green", status: "Process", statusTone: "orange", match: "Matched", matchTone: "green" },
  { type: "Refund", typeTone: "red", status: "Completed", statusTone: "green", match: "Unmatched", matchTone: "red" },
  { type: "Payment", typeTone: "green", status: "Process", statusTone: "orange", match: "Unmatched", matchTone: "red" },
  { type: "Subscription", typeTone: "royal", status: "Completed", statusTone: "green", match: "Matched", matchTone: "green" },
  { type: "Payment", typeTone: "green", status: "Completed", statusTone: "green", match: "Matched", matchTone: "green" },
];

const COLS = [71, 185, 163, 322, 181, 156, 128, 220, 176, 190, 137];
const HEADERS = ["", "Date and Time", "Transaction ID", "User", "Type", "Amount", "Clyse Fee", "Payment Method", "Status", "Match Status", "Action"];

function Row({ r, i }) {
  return (
    <div className="flex h-[124px] items-center">
      <div className="flex-none pl-[21px]" style={{ width: COLS[0] }}>
        <CheckBox label="Select transaction" />
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[1] }}>
        Sep. 20, 2026
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[2] }}>
        TRN-0004455
      </div>
      <div className="flex flex-none items-center" style={{ width: COLS[3] }}>
        <FinAvatar i={i} />
        <span className="ml-[10px]">
          <span className="block text-[18px] leading-[22px] font-bold whitespace-nowrap text-[#001701]">
            Maria Philips
          </span>
          <span className="block text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
            clysewebapp@gmail.com
          </span>
        </span>
      </div>
      <div className="flex-none" style={{ width: COLS[4] }}>
        <FinPill tone={r.typeTone}>{r.type}</FinPill>
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[5] }}>
        N3,000
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[6] }}>
        N200
      </div>
      <div className="flex-none text-[18px] leading-[22px] font-bold text-[#001701]" style={{ width: COLS[7] }}>
        Bank Transfer
      </div>
      <div className="flex-none" style={{ width: COLS[8] }}>
        <FinPill tone={r.statusTone}>{r.status}</FinPill>
      </div>
      <div className="flex-none" style={{ width: COLS[9] }}>
        <FinPill tone={r.matchTone}>{r.match}</FinPill>
      </div>
      <div className="flex-none" style={{ width: COLS[10] }} />
    </div>
  );
}

export function CompareTable({ title = "Transaction Comparison" }) {
  return (
    <div className="w-fit min-w-full rounded-[20px] border border-[#999999] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      <div className="min-w-[1929px]">
        <p className="px-[21px] pt-[18px] pb-[16px] text-[20px] leading-[24px] font-bold text-[#001701]">
          {title}
        </p>
        <div className="flex h-[50px] items-center bg-[#DFFFE0]/80">
          {HEADERS.map((h, i) => (
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
            <Row key={i} r={r} i={i} />
          ))}
        </div>
        <Pagination />
      </div>
    </div>
  );
}

const LEGEND = [
  { label: "Matched", value: "8,890", color: "#048B0B" },
  { label: "Unmatched", value: "450", color: "#FF9100" },
  { label: "In Progress", value: "128", color: "#4E4E4E" },
];

const DETAILS = [
  { label: "Last Reconciliation", value: "Sep. 20, 2026 - 10:00AM" },
  { label: "Next Schedule Run", value: "Sep. 20, 2026 - 10:00AM" },
  { label: "Method", value: "Automated + Manual Review" },
];

const ISSUES = [
  { label: "Amount Mismatched", value: "245" },
  { label: "Missing Payment Record", value: "23" },
  { label: "Duplicate Transaction", value: "23" },
];

export default function AdminRecon() {
  return (
    <AdminShell active="finance" sub="recon">
      <BackTitle title="Transaction Reconciliation" />
      <div className="mt-[30px] flex gap-[20px]">
        <StatCard center gap10 className="w-[357px] flex-none" label="Total Financial Activity" value="N124,000" badge={badgeGreen} glyph={<UsersGlyph />} />
        <StatCard gap10 className="w-[357px] flex-none" label="Wallet Funding" value="124" badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard gap10 className="flex-1" label="Subscription Payment" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <div className="mt-[20px] flex gap-[20px]">
        <StatCard gap10 className="w-[258px] flex-none" label="Clyse Fee" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard gap10 className="w-[258px] flex-none" label="Creator Earning" value="124" badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard gap10 className="w-[268px] flex-none" label="Refund" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard gap10 className="flex-1" label="Payout" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <div className="mt-[30px]">
        <FilterBar labels={["Transaction Type", "Status", "Date Range"]} />
      </div>
      <div className="mt-[30px]">
        <CompareTable />
      </div>
      <div className="mt-[30px] flex gap-[30px]">
        <RecentActivities />
        <OverviewChart />
      </div>
      <div className="mt-[30px] flex gap-[30px]">
        {/* Reconciliation Details */}
        <div className="w-[473px] flex-none rounded-[20px] border border-[#999999] bg-white px-[30px] pt-[30px] pb-[30px]">
          <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
            Reconciliation Details
          </p>
          <div className="mt-[25px]">
            {DETAILS.map((d) => (
              <div key={d.label} className="border-b border-[#E5E5E5] py-[11px]">
                <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">{d.label}</p>
                <p className="mt-[13px] text-[20px] leading-[24px] font-semibold text-[#001701]">
                  {d.value}
                </p>
              </div>
            ))}
            <div className="pt-[11px]">
              <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">Status</p>
              <div className="mt-[13px]">
                <FinPill tone="green">Completed</FinPill>
              </div>
            </div>
          </div>
        </div>
        {/* Reconciliation Status */}
        <div className="w-[607px] flex-none rounded-[10px] border border-[#999999] bg-white px-[30px] pt-[25px] pb-[30px]">
          <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
            Reconciliation Status
          </p>
          <div className="mt-[20px] flex items-center">
            <Donut />
            <div className="ml-[55px] flex-1 space-y-[38px]">
              {LEGEND.map((l) => (
                <div key={l.label} className="flex items-center">
                  <span className="h-[16px] w-[16px] rounded-full" style={{ background: l.color }} />
                  <span className="ml-[15px] text-[18px] leading-[22px] font-semibold text-[#001701]">
                    {l.label}
                  </span>
                  {l.label === "Unmatched" ? (
                    <Link
                      to="/admin/finance/disputes"
                      className="ml-auto text-[18px] leading-[22px] font-semibold text-[#001701] underline decoration-[#999999] underline-offset-4"
                    >
                      {l.value}
                    </Link>
                  ) : (
                    <span className="ml-auto text-[18px] leading-[22px] font-semibold text-[#001701]">
                      {l.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-[24px] border-t border-[#E5E5E5] pt-[24px]">
            <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
              Reconciliation Status
            </p>
            <div className="mt-[30px] space-y-[20px]">
              {ISSUES.map((d) => (
                <div key={d.label} className="flex items-center">
                  <span className="text-[20px] leading-[24px] font-semibold text-[#4E4E4E]">
                    {d.label}
                  </span>
                  <span className="ml-auto text-[20px] leading-[24px] font-bold text-[#4E4E4E]">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
