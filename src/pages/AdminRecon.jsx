import { useMemo, useState } from "react";
import useAdminRows from "../components/useAdminRows";
import { Link } from "react-router-dom";
import AdminShell, { DarkZone, DarkFilter } from "../components/AdminShell";
import {
  StatCard,
  badgeGreen,
  badgeMint,
  badgeOrange,
  UsersGlyph,
  CheckGlyph,
  FinPill,
  CheckBox,
  FinAvatar,
  RecentActivities,
  OverviewChart,
  Donut,
} from "../components/FinanceShared";
import { monthlyAmounts } from "../lib/adminMetrics";

/* Finance > Reconciliation — Figma 1214:25954 (desktop). Static.
   Frame name typo "Reconiliation" fixed in the title. */

const COLS = [71, 185, 163, 322, 181, 156, 128, 220, 176, 190, 137];
const HEADERS = ["", "Date and Time", "Transaction ID", "User", "Type", "Amount", "Clyse Fee", "Payment Method", "Status", "Match Status", "Action"];

function Row({ r, i }) {
  return (
    <div className="flex h-[124px] items-center">
      <div className="flex-none pl-[21px]" style={{ width: COLS[0] }}>
        <CheckBox label="Select transaction" />
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[1] }}>
        {r.date || "—"}
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[2] }}>
        {r.id || "—"}
      </div>
      <div className="flex flex-none items-center" style={{ width: COLS[3] }}>
        <FinAvatar i={i} />
        <span className="ml-[10px]">
          <span className="block text-[18px] leading-[22px] font-bold whitespace-nowrap text-[#001701]">
            {r.name || "—"}
          </span>
          <span className="block text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
            {r.email || "—"}
          </span>
        </span>
      </div>
      <div className="flex-none" style={{ width: COLS[4] }}>
        <FinPill tone={r.typeTone}>{r.type}</FinPill>
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[5] }}>
        {r.total || "—"}
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[6] }}>
        {r.matched || "—"}
      </div>
      <div className="flex-none text-[18px] leading-[22px] font-bold text-[#001701]" style={{ width: COLS[7] }}>
        —
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

export function CompareTable({ title = "Transaction Comparison", filters = {}, dark = false }) {
  /* Live reconciliation runs (ADMIN-012). Figma's rows hold the layout while the
     request is in flight; real runs replace them; an empty answer shows the
     empty state instead of invented numbers. */
  const { rows: live, status, total } = useAdminRows("reconciliation");
  const [page, setPage] = useState(1);
  const base = live || [];
  const shown = base.filter(
    (r) =>
      (!filters.type || filters.type === "All" || r.type === filters.type) &&
      (!filters.status || filters.status === "All" || r.status === filters.status),
  );
  const pageSize = 7;
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const pageRows = shown.slice((page - 1) * pageSize, page * pageSize);
  return (
    <div className={`w-fit min-w-full overflow-hidden rounded-[20px] border bg-white ${dark ? "border-black shadow-[0_0_0_2px_#ffffff]" : "border-[#999999] shadow-[0_0_20px_rgba(0,23,1,0.10)]"}`}>
      <div className="min-w-[1929px]">
        <p className="px-[21px] pt-[18px] pb-[16px] text-[20px] leading-[24px] font-bold text-[#001701]">
          {title}
        </p>
        <div className={`flex h-[50px] items-center ${dark ? "bg-[#E5FFEB]" : "bg-[#DFFFE0]/80"}`}>
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
        <div className={`divide-y divide-[#999999] ${shown.length === 0 ? "flex min-h-[868px] items-center justify-center" : ""}`}>
          {status === "loading" && Array.from({ length: pageSize }, (_, i) => <div key={`loading-${i}`} className="h-[124px] animate-pulse border-b border-[#E4E4E4] bg-gradient-to-r from-white via-[#FAFCFA] to-white" aria-hidden />)}
          {(status === "empty" || status === "error" || (status === "live" && shown.length === 0)) && (
            <p className="px-[21px] py-[20px] text-[16px] font-semibold text-[#4E4E4E]">{status === "error" ? "Reconciliation runs could not be loaded." : "No reconciliation runs yet. A run summary will appear here after the next check."}</p>
          )}
          {pageRows.map((r, i) => <Row key={`${r.id || "run"}-${(page - 1) * pageSize + i}`} r={r} i={(page - 1) * pageSize + i} />)}
        </div>
        {shown.length > 0 && <div className="flex min-h-[58px] items-center justify-between px-[24px] text-[13px] font-semibold text-[#4E4E4E]">
          <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, shown.length)} of {total || shown.length} reconciliation runs</span>
          {pageCount > 1 && <div className="flex items-center gap-[4px]">
            <button type="button" aria-label="Previous page" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] bg-white text-[16px] disabled:opacity-40">‹</button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => <button key={number} type="button" aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => setPage(number)} className={`grid h-[28px] min-w-[28px] place-items-center rounded-[5px] border px-1 text-[14px] font-semibold ${page === number ? "border-[#048B0B] bg-[#048B0B] text-white" : "border-[#E9E9E9] bg-white text-[#4E4E4E]"}`}>{number}</button>)}
            <button type="button" aria-label="Next page" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] bg-white text-[16px] disabled:opacity-40">›</button>
          </div>}
        </div>}
      </div>
    </div>
  );
}

/* Legend/details/issues are derived from the live runs + exceptions in the
   component body (see below); these constants only keep the shape/colors. */
const LEGEND_SHAPE = [
  { label: "Matched", color: "#048B0B" },
  { label: "Unmatched", color: "#FF9100" },
  { label: "In Progress", color: "#4E4E4E" },
];
const ISSUE_LABELS = ["Amount Mismatched", "Missing Payment Record", "Duplicate Transaction"];

export default function AdminRecon() {
  const recon = useAdminRows("reconciliation");
  const live = recon.rows;
  const tx = useAdminRows("transactions");
  const payouts = useAdminRows("payouts");
  const exc = useAdminRows("exceptions");
  const runRows = live || [];
  const loading = recon.status === "loading" || tx.status === "loading" || payouts.status === "loading" || exc.status === "loading";
  const revenueSeries = useMemo(() => monthlyAmounts(tx.rows, { predicate: (row) => /posted|successful|completed|paid/i.test(row.status || "") && !/refund|reversal/i.test(row.type || "") }), [tx.rows]);
  const payoutSeries = useMemo(() => monthlyAmounts(payouts.rows, { amount: "netKobo", predicate: (row) => /paid|successful|completed/i.test(row.status || "") }), [payouts.rows]);
  const activityItems = useMemo(() => (live || []).slice(0, 5).map((row) => ({ name: `Reconciliation ${row.type || "run"}`, date: row.date, amount: row.total ? `${row.total} checked` : "", status: row.status, up: !/fail|error/i.test(row.status || "") })), [live]);
  const parseNum = (v) => { const n = parseInt(String(v).replace(/[^0-9-]/g, ""), 10); return Number.isFinite(n) ? n : 0; };
  const matched = runRows.reduce((a, r) => a + parseNum(r.matched), 0);
  const unmatched = runRows.reduce((a, r) => a + parseNum(r.match), 0);
  const inProgress = runRows.filter((r) => /process|running|pending/i.test(r.status || "")).length;
  const legend = LEGEND_SHAPE.map((l) => ({
    ...l,
    value: loading ? "…" : l.label === "Matched" ? matched.toLocaleString("en-US") : l.label === "Unmatched" ? unmatched.toLocaleString("en-US") : String(inProgress),
  }));
  const lastRun = runRows.find((r) => r.date && r.date !== "—");
  const details = [
    { label: "Last Reconciliation", value: loading ? "…" : lastRun ? lastRun.date : "No runs yet" },
    { label: "Next Schedule Run", value: "Automated on the platform schedule" },
    { label: "Method", value: "Automated + Manual Review" },
  ];
  const excRows = exc.rows || [];
  const countIssue = (re) => excRows.filter((r) => re.test(`${r.type || ""} ${r.issue || ""}`)).length;
  const issues = ISSUE_LABELS.map((label, i) => ({
    label,
    value: exc.status === "loading" ? "…" : String(countIssue([/amount|mismatch/i, /missing/i, /duplicate/i][i])),
  }));
  return (
    <AdminShell active="finance" sub="recon" expand nav2 dark>
      <DarkZone>
      <div className="mt-[32px] flex flex-wrap gap-[20px]">
        <StatCard dark center gap10 className="w-full lg:w-[357px] flex-none" label="Total Financial Activity" value={tx.status === "loading" ? "…" : `N${Math.round((tx.rows || []).reduce((a, r) => a + (r.amountKobo || 0), 0) / 100).toLocaleString("en-US")}`} badge={badgeGreen} glyph={<UsersGlyph />} />
        <StatCard dark gap10 className="w-full lg:w-[357px] flex-none" label="Wallet Funding" value={tx.status === "loading" ? "…" : String((tx.rows || []).filter((r) => /funding/i.test(r.type || r.item || "")).length)} badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard dark gap10 className="min-w-[220px] flex-1" label="Subscription Payment" value={tx.status === "loading" ? "…" : String((tx.rows || []).filter((r) => /payment|subscription/i.test(r.type || r.item || "")).length)} badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <div className="mt-[20px] flex flex-wrap gap-[20px]">
        <StatCard dark gap10 className="w-full lg:w-[258px] flex-none" label="Clyse Fee" value={tx.status === "loading" ? "…" : `N${Math.round((tx.rows || []).reduce((a, r) => a + (r.feeKobo || 0), 0) / 100).toLocaleString("en-US")}`} badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard dark gap10 className="w-full lg:w-[258px] flex-none" label="Creator Earning" value={tx.status === "loading" ? "…" : String((tx.rows || []).filter((r) => /earning|payout/i.test(r.type || r.item || "")).length)} badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard dark gap10 className="w-full lg:w-[268px] flex-none" label="Refund" value={tx.status === "loading" ? "…" : String((tx.rows || []).filter((r) => /refund|reversal/i.test(r.type || r.item || "")).length)} badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard dark gap10 className="min-w-[220px] flex-1" label="Payout" value={tx.status === "loading" ? "…" : String((tx.rows || []).filter((r) => /payout/i.test(r.type || r.item || "")).length)} badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <DarkFilter />
      <div className="mt-[26px]">
        <CompareTable dark />
      </div>
      <div className="mt-[26px] flex flex-wrap gap-[20px]">
        <RecentActivities dark className="w-full max-w-full flex-1 lg:w-[473px]" items={loading ? null : activityItems} />
        <OverviewChart dark className="w-full max-w-full flex-1 lg:w-[607px]" revenueValues={revenueSeries} payoutValues={payoutSeries} />
      </div>
      <div className="mt-[26px] flex flex-wrap gap-[20px]">
        {/* Reconciliation Details */}
        <div className="w-full lg:w-[473px] flex-none rounded-[20px] border border-black bg-white px-[30px] pt-[30px] pb-[30px] shadow-[0_0_0_2px_#ffffff]">
          <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
            Reconciliation Details
          </p>
          <div className="mt-[25px]">
            {details.map((d) => (
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
        <div className="w-full lg:w-[607px] flex-none rounded-[10px] border border-black bg-white px-[30px] pt-[25px] pb-[30px] shadow-[0_0_0_2px_#ffffff]">
          <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
            Reconciliation Status
          </p>
          <div className="mt-[20px] flex items-center">
            <Donut matched={matched} unmatched={unmatched} inProgress={inProgress} loading={loading} />
            <div className="ml-[55px] flex-1 space-y-[38px]">
              {legend.map((l) => (
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
              {issues.map((d) => (
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
      </DarkZone>
    </AdminShell>
  );
}
