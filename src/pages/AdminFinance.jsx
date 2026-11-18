import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAdminRows from "../components/useAdminRows";
import AdminShell, { DotsIcon, DCARD, DarkZone } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";
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
} from "../components/FinanceShared";
import { monthlyAmounts } from "../lib/adminMetrics";

/* Finance > Transactions — Figma 1187:28004 (desktop). Static: no admin
   finance endpoints exist, so search/filters/pagination are display-only.
   Copy fix: designer email typo "gmial" -> "gmail". */


const COLS = [71, 244, 299, 322, 299, 156, 129, 178, 157, 74];
const FINANCE_FILTER_NOW = Date.now();
const EMPTY_ROWS = [];

function Row({ r, i }) {
  return (
    <div className="flex h-[112px] items-center">
      <div className="flex-none pl-[21px]" style={{ width: COLS[0] }}>
        <CheckBox label={`Select ${r.item}`} />
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[1] }}>
        {r.when || "—"}
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
            {r.email || "—"}
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
          {r.fee || "—"}
      </div>
      <div className="flex-none" style={{ width: COLS[7] }}>
        <FinPill tone={/fail|revers/.test(r.status || "") ? "red" : /pend|process/.test(r.status || "") ? "orange" : "green"}>
          {r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "—"}
        </FinPill>
      </div>
      <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[8] }}>
        {r.ref || "—"}
      </div>
      <div className="flex-none" style={{ width: COLS[9] }}>
        <Link
          to={r.id ? `/admin/finance/transactions/details?id=${encodeURIComponent(r.id)}` : "/admin/finance"}
          aria-label={`Open ${r.item} details`}
          className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full hover:bg-[#F1F8F2]"
        >
          <DotsIcon />
        </Link>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="relative flex h-[40px] w-[215px] min-w-[160px] flex-1 items-center rounded-[8px] border border-black bg-[#DEFFE1] px-[14px] shadow-[0_0_0_2px_#ffffff]">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={onChange} className="w-full appearance-none bg-transparent pr-7 text-[15px] font-semibold text-[#001701] outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <span className="pointer-events-none absolute right-[12px]"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="m6 9 6 6 6-6" stroke="#001701" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    </label>
  );
}

export default function AdminFinance() {
  const { rows: live, status, total, hasMore, loadMore, moreLoading } = useAdminRows("transactions");
  const pay = useAdminRows("payouts");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All time");
  const allRows = live ?? EMPTY_ROWS;
  const typeOptions = [...new Set(allRows.map((row) => row.type).filter(Boolean))].sort();
  const statusOptions = [...new Set(allRows.map((row) => row.status).filter(Boolean))].sort();
  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const days = ({ "Last 7 days": 7, "Last 30 days": 30, "Last 90 days": 90 })[dateFilter];
    const cutoff = days ? FINANCE_FILTER_NOW - days * 86400000 : null;
    return allRows.filter((row) => {
      const matchesQuery = !needle || [row.name, row.email, row.item, row.kind, row.ref, row.type, row.status].some((value) => String(value || "").toLowerCase().includes(needle));
      const matchesDate = !cutoff || (row.createdAt && new Date(row.createdAt).getTime() >= cutoff);
      return matchesQuery && (typeFilter === "All" || row.type === typeFilter) && (statusFilter === "All" || row.status === statusFilter) && matchesDate;
    });
  }, [allRows, query, typeFilter, statusFilter, dateFilter]);
  const pageSize = 7;
  const pageCount = Math.max(1, Math.ceil(shown.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageRows = shown.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const revenueSeries = useMemo(() => monthlyAmounts(live, { predicate: (row) => /posted|successful|completed|paid/i.test(row.status || "") && !/refund|reversal/i.test(row.type || "") }), [live]);
  const payoutSeries = useMemo(() => monthlyAmounts(pay.rows, { amount: "netKobo", predicate: (row) => /paid|successful|completed/i.test(row.status || "") }), [pay.rows]);
  const headers = ["", "Date and Time", "Type", "User", "Group / Subscription", "Amount", "Clyse Fee", "Status", "Reference", "Action"];
  return (
    <AdminShell active="finance" sub="transactions" expand nav2 dark>
      <DarkZone>
      <div className="mt-[32px] flex flex-wrap gap-[20px]">
        <StatCard dark className="min-w-[220px] flex-1" label="Total Revenue" value={status === "live" || status === "empty" ? `N${Math.round((live || []).reduce((a, r) => a + (r.tone === "green" ? r.amountKobo : 0), 0) / 100).toLocaleString("en-US")}` : "…"} badge={badgeGreen} glyph={<UsersGlyph />} />
        <StatCard dark className="min-w-[220px] flex-1" label="Clyse Fee" value={status === "live" || status === "empty" ? `N${Math.round((live || []).reduce((a, r) => a + (r.feeKobo || 0), 0) / 100).toLocaleString("en-US")}` : "…"} badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard dark className="min-w-[220px] flex-1" label="Total Payout" value={pay.status === "live" || pay.status === "empty" ? `N${Math.round((pay.rows || []).filter((p) => p.status === "paid" || p.status === "successful").reduce((a, p) => a + (p.netKobo || 0), 0) / 100).toLocaleString("en-US")}` : "…"} badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard dark className="min-w-[220px] flex-1" label="Pending Payout" value={pay.status === "live" || pay.status === "empty" ? String((pay.rows || []).filter((p) => p.status === "pending" || p.status === "processing").length) : "…"} badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <div className="mt-[26px] flex flex-wrap items-center gap-x-[26px] gap-y-[12px]">
        <label className="flex h-[40px] w-[380px] max-w-full items-center gap-[10px] rounded-full border border-black bg-white px-[18px] shadow-[0_0_0_2px_#ffffff]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="10.8" cy="10.8" r="6.8" stroke="#4E4E4E" strokeWidth="1.8"/><path d="m16 16 4.5 4.5" stroke="#4E4E4E" strokeWidth="1.8" strokeLinecap="round"/></svg>
          <input placeholder="Search transactions" value={query} onChange={(event) => { setPage(1); setQuery(event.target.value); }} aria-label="Search transactions" className="w-full bg-transparent text-[14px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none" />
        </label>
        <FilterSelect label="Type" value={typeFilter} options={["All", ...typeOptions]} onChange={(event) => { setPage(1); setTypeFilter(event.target.value); }} />
        <FilterSelect label="Status" value={statusFilter} options={["All", ...statusOptions]} onChange={(event) => { setPage(1); setStatusFilter(event.target.value); }} />
        <FilterSelect label="Date range" value={dateFilter} options={["All time", "Last 7 days", "Last 30 days", "Last 90 days"]} onChange={(event) => { setPage(1); setDateFilter(event.target.value); }} />
      </div>
      <div className={`mt-[26px] w-fit min-w-full overflow-hidden ${DCARD}`}>
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
          <div className={`divide-y divide-[#999999] ${shown.length === 0 ? "min-h-[784px]" : ""}`}>
            {status === "loading" && Array.from({ length: pageSize }, (_, i) => (
              <div key={`loading-${i}`} className="flex h-[112px] items-center gap-[30px] px-[24px]" aria-hidden>
                {["w-[130px]", "w-[110px]", "w-[230px]", "w-[250px]", "w-[120px]", "w-[140px]"].map((width, j) => <span key={j} className={`h-[14px] animate-pulse rounded bg-[#ECEFEC] ${width}`} />)}
              </div>
            ))}
            {(status === "empty" || status === "error" || (status === "live" && shown.length === 0)) && (
              <div className="flex min-h-[784px] items-center justify-center px-[24px] text-center">
                <p className="max-w-[520px] text-[16px] leading-[24px] font-semibold text-[#4E4E4E]">{status === "error" ? "Transactions could not be loaded. Try again in a moment." : "No transactions match these filters."}</p>
              </div>
            )}
            {pageRows.map((r, i) => <Row key={`${r.id || r.item}-${(currentPage - 1) * pageSize + i}`} r={r} i={(currentPage - 1) * pageSize + i} />)}
          </div>
          {shown.length > 0 && (
            <div className="flex min-h-[58px] items-center justify-between px-[24px] text-[13px] font-semibold text-[#4E4E4E]">
              <span>Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, shown.length)} of {shown.length} loaded transactions{!query && typeFilter === "All" && statusFilter === "All" && dateFilter === "All time" && total > shown.length ? ` (${total} total)` : ""}</span>
              <div className="flex items-center gap-[10px]">
                {hasMore && <button type="button" onClick={loadMore} disabled={moreLoading} className="rounded-[6px] border border-[#048B0B] px-3 py-1 text-[13px] font-semibold text-[#048B0B] disabled:opacity-50">{moreLoading ? "Loading…" : "Load more"}</button>}
                {pageCount > 1 && <div className="flex items-center gap-[4px]">
                  <button type="button" aria-label="Previous page" onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] bg-white text-[16px] disabled:opacity-40">‹</button>
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => <button key={number} type="button" aria-label={`Page ${number}`} aria-current={currentPage === number ? "page" : undefined} onClick={() => setPage(number)} className={`grid h-[28px] min-w-[28px] place-items-center rounded-[5px] border px-1 text-[14px] font-semibold ${currentPage === number ? "border-[#048B0B] bg-[#048B0B] text-white" : "border-[#E9E9E9] bg-white text-[#4E4E4E]"}`}>{number}</button>)}
                  <button type="button" aria-label="Next page" onClick={() => setPage(Math.min(pageCount, currentPage + 1))} disabled={currentPage === pageCount} className="grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] bg-white text-[16px] disabled:opacity-40">›</button>
                </div>}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[26px] flex flex-wrap gap-[20px]">
        <RecentActivities dark className="w-full max-w-full flex-1 lg:w-[473px]" items={status === "live" || status === "empty" ? (live || []).slice(0, 4).map((r) => ({ name: `${r.type} — ${r.name}`, date: r.when, amount: r.amount, up: r.tone === "green", status: r.status })) : null} />
        <OverviewChart dark className="w-full max-w-full flex-1 lg:w-[607px]" revenueValues={revenueSeries} payoutValues={payoutSeries} />
      </div>
      </DarkZone>
    </AdminShell>
  );
}
