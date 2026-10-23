import AdminShell, { BackIcon } from "../components/AdminShell";
import {
  FilterBar,
  FinPill,
  CheckBox,
  Pagination,
  BackLink,
} from "../components/FinanceShared";

/* Finance > Reconciliation > History — Figma 1217:27756 (desktop). Static.
   The design has no page title: back button, then filters, then the
   run-history table titled "Pending Exception". */

const ROWS = [
  { type: "Full Reconciliation", total: "1,204", matched: "1,160", unmatched: "40", rate: "90.0%" },
  { type: "Incremental", total: "1,300", matched: "1,200", unmatched: "100", rate: "95.0%" },
  { type: "Full Reconciliation", total: "1,204", matched: "1,160", unmatched: "40", rate: "90.0%" },
  { type: "Full Reconciliation", total: "1,204", matched: "1,160", unmatched: "40", rate: "90.0%" },
  { type: "Incremental", total: "4,500", matched: "4,000", unmatched: "500", rate: "90.0%" },
  { type: "Full Reconciliation", total: "1,204", matched: "1,160", unmatched: "40", rate: "90.0%" },
  { type: "Incremental", total: "4,500", matched: "4,000", unmatched: "500", rate: "90.0%" },
];
const COLS = [71, 185, 213, 254, 213, 127, 156, 149, 177, 163];
const HEADERS = [
  "",
  "Run ID",
  "Date & Time",
  "Type",
  "Total Transaction",
  "Matched",
  "Unmatched",
  "Match Rate",
  "Status",
  "Action",
];

export default function AdminReconHistory() {
  return (
    <AdminShell active="finance" sub="recon">
      <button
        type="button"
        onClick={() => window.history.back()}
        aria-label="Go back"
        className="grid h-[35px] w-[35px] place-items-center rounded-full bg-[#F1F8F1]"
      >
        <BackIcon />
      </button>
      <div className="mt-[30px]">
        <FilterBar labels={["Reconciliation Type", "Status", "Date Range"]} />
      </div>
      <div className="mt-[30px] w-fit min-w-full rounded-[20px] border border-[#999999] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <div className="min-w-[1708px]">
          <p className="px-[21px] pt-[18px] pb-[16px] text-[20px] leading-[24px] font-bold text-[#001701]">
            Pending Exception
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
              <div key={i} className="flex h-[98px] items-center">
                <div className="flex-none pl-[21px]" style={{ width: COLS[0] }}>
                  <CheckBox label="Select run" />
                </div>
                <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[1] }}>
                  TRN-0004455
                </div>
                <div className="flex-none text-[18px] leading-[22px] font-semibold text-[#001701]" style={{ width: COLS[2] }}>
                  Sep. 20, 2026
                </div>
                <div className="flex-none text-[18px] leading-[22px] font-semibold text-[#001701]" style={{ width: COLS[3] }}>
                  {r.type}
                </div>
                <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[4] }}>
                  {r.total}
                </div>
                <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[5] }}>
                  {r.matched}
                </div>
                <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[6] }}>
                  {r.unmatched}
                </div>
                <div className="flex-none text-[18px] leading-[22px] font-semibold text-[#001701]" style={{ width: COLS[7] }}>
                  {r.rate}
                </div>
                <div className="flex-none" style={{ width: COLS[8] }}>
                  <FinPill tone="green">Completed</FinPill>
                </div>
                <div className="flex-none" style={{ width: COLS[9] }}>
                  <BackLink to="/admin/finance/exceptions">View Details</BackLink>
                </div>
              </div>
            ))}
          </div>
          <Pagination />
        </div>
      </div>
    </AdminShell>
  );
}
