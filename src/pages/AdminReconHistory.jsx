import { useState } from "react";
import useAdminRows from "../components/useAdminRows";
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
  const [fType, setFType] = useState("All");
  /* Live history (ADMIN-012 reconciliations). */
  const { rows: live, status } = useAdminRows("reconciliation");
  const base = live || [];
  const typeOpts = ["All", ...new Set(base.map((r) => r.type))];
  const shown = base.filter((r) => fType === "All" || r.type === fType);
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
        <FilterBar
          labels={["Reconciliation Type", "Status", "Date Range"]}
          options={{ "Reconciliation Type": typeOpts }}
          values={{ "Reconciliation Type": fType }}
          onPick={(l, v) => {
            if (l === "Reconciliation Type") setFType(v);
          }}
        />
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
            {shown.map((r, i) => (
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
