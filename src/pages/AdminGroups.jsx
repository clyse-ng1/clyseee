import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminRows from "../components/useAdminRows";
import AdminShell, { Pill, DotsIcon, DCARD, DarkZone, AdminEmpty } from "../components/AdminShell";
import { StatCard, badgeMint, UsersGlyph, CheckGlyph } from "../components/FinanceShared";
import BrandTile from "../components/BrandTile";

/* Group Management — Figma 1176:26649 (desktop). The dark band holds the
   summary cards and live filters; the table sits on the mint body below it.
   Only API records render; loading, empty, and error states never use samples. */


const STATUS = {
  approved: { tone: "green", label: "Approved" },
  reject: { tone: "red", label: "Reject" },
  pending: { tone: "orange", label: "Pending" },
  review: { tone: "gray", label: "Under Review" },
  open: { tone: "green", label: "Approved" },
  active: { tone: "green", label: "Active" },
  suspended: { tone: "red", label: "Suspended" },
  inactive: { tone: "gray", label: "Inactive" },
  full: { tone: "orange", label: "Pending" },
  closed: { tone: "gray", label: "Closed" },
};

const HEAD = ["Creator", "Subscription & Plan", "Member", "Shared Slot", "Start Date", "Status", "Action"];
const FILTER = "h-[40px] rounded-[8px] border border-black bg-[#DEFFE1] px-[14px] text-[15px] font-semibold text-[#001701] shadow-[0_0_0_2px_#fff]";
const labelStatus = (value) => String(value || "—").replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

function GroupFilters({ q, onQuery, status, onStatus, service, onService, verified, onVerified, rows }) {
  const options = (field) => [...new Set(rows.map((r) => r[field]).filter(Boolean))];
  return (
    <div className="mt-[26px] flex flex-wrap items-center gap-x-[26px] gap-y-[12px]">
      <label className="flex h-[40px] w-[380px] max-w-full items-center gap-[10px] rounded-full border border-black bg-white px-[18px] shadow-[0_0_0_2px_#ffffff]">
        <input value={q} onChange={onQuery} placeholder="Search...." aria-label="Search groups" className="w-full bg-transparent text-[14px] font-semibold text-[#001701] placeholder-[#4E4E4E] focus:outline-none" />
      </label>
      {[[status, onStatus, "status", "All status"], [service, onService, "sub", "All subscriptions"], [verified, onVerified, "verified", "All verification"]].map(([value, handler, field, allLabel]) => (
        <select key={field} value={value} onChange={(e) => handler(e.target.value)} aria-label={allLabel} className={`${FILTER} min-w-[160px] flex-1`}>
          <option value="All">All</option>
          {options(field).map((option) => <option key={option} value={option}>{labelStatus(option)}</option>)}
        </select>
      ))}
    </div>
  );
}

export default function AdminGroups() {
  const { rows: live, status, total, hasMore, loadMore, moreLoading, moreError, reload } = useAdminRows("groups");
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [verifiedFilter, setVerifiedFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState([]);
  const rows = useMemo(() => (live || []).map((r, i) => ({
    ...r,
    rowKey: String(r.id ?? i),
    member: r.member ?? "—",
    sub: r.sub ?? "—",
    plan: r.plan ?? "—",
  })).filter((r) => {
    const query = q.trim().toLowerCase();
    return (!query || [r.name, r.email, r.sub, r.plan].some((v) => String(v || "").toLowerCase().includes(query))) &&
      (statusFilter === "All" || r.status === statusFilter) &&
      (serviceFilter === "All" || r.sub === serviceFilter) &&
      (verifiedFilter === "All" || r.verified === verifiedFilter);
  }), [live, q, statusFilter, serviceFilter, verifiedFilter]);
  const pageSize = 7;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const all = pageRows.length > 0 && pageRows.every((r) => checked.includes(r.rowKey));
  const toggle = (key) => setChecked((c) => (c.includes(key) ? c.filter((x) => x !== key) : [...c, key]));

  return (
    <AdminShell active="users" sub="gm" expand nav2>
      <DarkZone band width="min(100%, 1080px)">
        <div className="mt-[22px] flex flex-wrap gap-[20px]">
          <StatCard dark gap10 className="min-w-[220px] flex-1" label="Total Group" value={status === "live" || status === "empty" ? String(total ?? (live || []).length) : "…"} badge={badgeMint} glyph={<UsersGlyph />} />
          <StatCard dark gap10 className="min-w-[220px] flex-1" label="Active Group" value={status === "live" || status === "empty" ? String((live || []).filter((r) => /^(open|active|approved)$/i.test(r.status || "")).length) : "…"} badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark gap10 className="min-w-[220px] flex-1" label="Suspended Group" value={status === "live" || status === "empty" ? String((live || []).filter((r) => r.status === "suspended").length) : "…"} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
          <StatCard dark gap10 className="min-w-[220px] flex-1" label="Close Group" value={status === "live" || status === "empty" ? String((live || []).filter((r) => r.status === "closed" || r.status === "full").length) : "…"} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
        </div>
        <GroupFilters
          q={q}
          onQuery={(e) => { setQ(e.target.value); setPage(1); }}
          status={statusFilter}
          onStatus={(value) => { setStatusFilter(value); setPage(1); }}
          service={serviceFilter}
          onService={(value) => { setServiceFilter(value); setPage(1); }}
          verified={verifiedFilter}
          onVerified={(value) => { setVerifiedFilter(value); setPage(1); }}
          rows={live || []}
        />
      </DarkZone>
      <div className="bg-[#E5FFEB] px-[24px] pb-[40px] pt-[26px]">
        {status === "empty" && (
          <AdminEmpty title="No groups yet" hint="Groups created by members will appear here with their owner, subscription, plan, slots and status." />
        )}
        <div className={`overflow-hidden ${status === "empty" ? "hidden" : ""} ${DCARD}`}>
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="h-[58px] w-[52px] bg-[#E5FFEB] px-[16px] align-middle">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={all}
                    onChange={() => setChecked(all ? [] : pageRows.map((r) => r.rowKey))}
                    className="h-[18px] w-[18px] accent-[#048B0B]"
                  />
                </th>
                {HEAD.map((h) => (
                  <th key={h} className="h-[58px] bg-[#E5FFEB] px-[10px] align-middle text-[15px] font-semibold text-[#4E4E4E]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {status === "loading" && Array.from({ length: pageSize }, (_, i) => (
                <tr key={`loading-${i}`} aria-hidden>
                  {Array.from({ length: HEAD.length + 1 }, (_, j) => <td key={j} className="border-t border-[#E4E4E4] px-[10px] py-[30px]"><div className={`h-[14px] animate-pulse rounded bg-[#EFF3EF] ${j === 2 ? "w-[140px]" : "w-[75px]"}`} /></td>)}
                </tr>
              ))}
              {(status === "empty" || status === "error" || (status === "live" && rows.length === 0)) && (
                <tr><td colSpan={HEAD.length + 1} className="border-t border-[#E4E4E4] px-[24px] py-[36px] text-center text-[15px] font-semibold text-[#4E4E4E]">{status === "error" ? <span>Groups could not be loaded. <button type="button" onClick={reload} className="underline">Try again</button></span> : status === "empty" ? "No groups yet. Groups created by members will appear here." : "No groups match these filters. Load more records to search beyond the current page."}</td></tr>
              )}
              {pageRows.map((r, i) => (
                <tr key={r.rowKey}>
                  <td className="border-t border-[#E4E4E4] px-[16px] py-[24px]">
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.name || `group ${i + 1}`}`}
                      checked={checked.includes(r.rowKey)}
                      onChange={() => toggle(r.rowKey)}
                      className="h-[18px] w-[18px] accent-[#048B0B]"
                    />
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px]">
                    <span className="block text-[16px] font-bold text-[#001701]">{r.name}</span>
                    <span className="mt-[4px] block text-[14px] font-semibold text-[#8A8A8A]">{r.email || "—"}</span>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px]">
                    <span className="flex items-center gap-[14px]">
                      <BrandTile brand={r.brand} />
                      <span>
                        <span className="block text-[16px] font-bold text-[#001701]">{r.sub}</span>
                        <span className="mt-[2px] block text-[14px] font-semibold text-[#8A8A8A]">{r.plan}</span>
                      </span>
                    </span>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px] text-[15px] font-bold text-[#001701]">{r.member}</td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px] text-[15px] font-bold text-[#001701]">{r.slot}</td>
                  <td className="whitespace-nowrap border-t border-[#E4E4E4] px-[10px] py-[24px] text-[15px] font-bold text-[#001701]">
                    {r.date || "—"}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px]">
                    <Pill dot tone={STATUS[r.status]?.tone || "gray"} className="h-[35px] px-[14px]">
                      {STATUS[r.status]?.label || (r.status ? labelStatus(r.status) : "—")}
                    </Pill>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px]">
                    <span className="flex items-center gap-[10px]">
                      <button
                        type="button"
                        onClick={() => r.id && nav(`/admin/groups/details?group_id=${encodeURIComponent(r.id)}`)}
                        className="h-[35px] rounded-[8px] border border-[#999999] bg-white px-[14px] text-[14px] font-semibold text-[#001701]"
                      >
                        View
                      </button>
                      <button type="button" aria-label="More actions">
                        <DotsIcon />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {status === "live" && rows.length > 0 && <div className="flex min-h-[58px] items-center justify-between px-[24px] text-[13px] font-semibold text-[#4E4E4E]">
            <span>Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, rows.length)} of {total ?? rows.length} groups</span>
            {pageCount > 1 && <div className="flex items-center gap-[4px]">
              <button type="button" aria-label="Previous page" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] disabled:opacity-40">‹</button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => <button key={n} type="button" aria-label={`Page ${n}`} aria-current={page === n ? "page" : undefined} onClick={() => setPage(n)} className={`grid h-[28px] min-w-[28px] place-items-center rounded-[5px] border px-1 text-[14px] font-semibold ${page === n ? "border-[#048B0B] bg-[#048B0B] text-white" : "border-[#E9E9E9] bg-white text-[#4E4E4E]"}`}>{n}</button>)}
              <button type="button" aria-label="Next page" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount} className="grid h-[28px] w-[28px] place-items-center rounded-[5px] border border-[#E9E9E9] disabled:opacity-40">›</button>
            </div>}
          </div>}
          {hasMore && <div className="border-t border-[#E4E4E4] px-6 py-4 text-right"><button type="button" onClick={loadMore} disabled={moreLoading} className="rounded-lg bg-[#001701] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{moreLoading ? "Loading more…" : "Load more groups"}</button>{moreError && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{moreError}</p>}</div>}
        </div>
      </div>
    </AdminShell>
  );
}
