import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminRows from "../components/useAdminRows";
import AdminShell, { Pill, DotsIcon, DCARD, DarkZone, AdminEmpty } from "../components/AdminShell";
import { StatCard, badgeMint, UsersGlyph, CheckGlyph, FinAvatar } from "../components/FinanceShared";

/* User Management — Figma 1170:23344 (1440, desktop only). Dark canvas:
   black body, moon toggle, white cards with black stroke + white ring, no
   page title. Live admin rows merge over the design dummies when the API
   answers (useAdminRows), same column shape. */


const ACCT = {
  activated: { tone: "green", label: "Activated" },
  suspended: { tone: "red", label: "Suspended" },
  pending: { tone: "orange", label: "Pending" },
  active: { tone: "green", label: "Activated" },
  deactivated: { tone: "gray", label: "Deactivated" },
  unknown: { tone: "gray", label: "Unknown" },
};
const VER = {
  verified: { tone: "green", label: "Verified" },
  pending: { tone: "orange", label: "Pending" },
  notverified: { tone: "red", label: "Not Verified" },
  unverified: { tone: "red", label: "Not Verified" },
};

const HEAD = ["User", "Email/Phone Number", "Account Status", "Verification Status", "Registration Date", "Active Sub /Group", "Action"];
const COLW = ["w-[220px]", "w-[240px]", "w-[150px]", "w-[160px]", "w-[150px]", "w-[90px]", "w-[110px]"];

export default function AdminUsers() {
  const { rows: live, status, total, hasMore, loadMore, moreLoading, moreError, reload } = useAdminRows("users");
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [verifyFilter, setVerifyFilter] = useState("All");
  const [checked, setChecked] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 7;
  const rows = useMemo(() => (live || []).filter((r) => {
    const query = q.trim().toLowerCase();
    const queryMatch = !query || [r.name, r.email, r.phone].some((value) => String(value || "").toLowerCase().includes(query));
    return queryMatch && (statusFilter === "All" || r.acct === statusFilter) && (roleFilter === "All" || String(r.role || "").toLowerCase().includes(roleFilter.toLowerCase())) && (verifyFilter === "All" || r.ver === verifyFilter);
  }), [q, live, statusFilter, roleFilter, verifyFilter]);
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const visibleFrom = rows.length ? (page - 1) * pageSize + 1 : 0;
  const visibleTo = Math.min(page * pageSize, rows.length);
  const all = rows.length > 0 && rows.every((r) => checked.includes(r.name));
  const toggle = (name) => setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="users" sub="um" expand nav2 dark>
      <DarkZone>
        <div className="mt-[32px] flex flex-wrap gap-[20px]">
          <StatCard dark className="min-w-[220px] flex-1" label="Total User" value={status === "live" || status === "empty" ? String(total) : "…"} badge={badgeMint} glyph={<UsersGlyph />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Active User" value={status === "live" || status === "empty" ? String((live || []).filter((r) => r.acct === "active").length) : "…"} badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Verified User" value={status === "live" || status === "empty" ? String((live || []).filter((r) => r.ver === "verified").length) : "…"} badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Susspended User" value={status === "live" || status === "empty" ? String((live || []).filter((r) => r.acct === "suspended").length) : "…"} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
        </div>
        <div className="mt-[26px] flex flex-wrap items-center gap-x-[26px] gap-y-[12px]">
          <label className="flex h-[40px] w-[380px] max-w-full items-center gap-[10px] rounded-full border border-black bg-white px-[18px] shadow-[0_0_0_2px_#ffffff]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><circle cx="10.8" cy="10.8" r="6.8" stroke="#4E4E4E" strokeWidth="1.8"/><path d="m16 16 4.5 4.5" stroke="#4E4E4E" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <input value={q} onChange={(event) => { setQ(event.target.value); setPage(1); }} placeholder="Search...." aria-label="Search users" className="w-full bg-transparent text-[14px] font-semibold text-[#001701] placeholder-[#4E4E4E] outline-none" />
          </label>
          <select aria-label="Filter users by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-[40px] min-w-[160px] flex-1 rounded-[8px] border border-black bg-[#DEFFE1] px-[14px] shadow-[0_0_0_2px_#ffffff] text-[15px] font-semibold text-[#001701]">
            <option value="All">All statuses</option><option value="active">Active</option><option value="suspended">Suspended</option><option value="deactivated">Deactivated</option>
          </select>
          <select aria-label="Filter users by role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="h-[40px] min-w-[160px] flex-1 rounded-[8px] border border-black bg-[#DEFFE1] px-[14px] shadow-[0_0_0_2px_#ffffff] text-[15px] font-semibold text-[#001701]">
            <option value="All">All roles</option><option value="admin">Admin</option><option value="user">User</option>
          </select>
          <select aria-label="Filter users by verification" value={verifyFilter} onChange={(event) => setVerifyFilter(event.target.value)} className="h-[40px] min-w-[160px] flex-1 rounded-[8px] border border-black bg-[#DEFFE1] px-[14px] shadow-[0_0_0_2px_#ffffff] text-[15px] font-semibold text-[#001701]">
            <option value="All">All verification</option><option value="verified">Verified</option><option value="unverified">Not verified</option>
          </select>
        </div>
        {status === "empty" && (
          <AdminEmpty dark title="No users yet" hint="Members who register on Clyse will appear here with their contact details, account status, verification and group counts." />
        )}
        {status === "loading" && <p role="status" className="mt-6 rounded-xl bg-white p-6 text-center font-semibold">Loading users…</p>}
        {status === "error" && <div role="alert" className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-white p-6 text-red-800"><span>Users could not be loaded.</span><button type="button" onClick={reload} className="rounded-lg bg-[#001701] px-4 py-2 font-semibold text-white">Retry</button></div>}
        <div className={`mt-[26px] overflow-hidden ${status !== "live" ? "hidden" : ""} ${DCARD}`}>
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="h-[64px] w-[52px] bg-[#E5FFEB] px-[16px] align-middle">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={all}
                    onChange={() => setChecked(all ? [] : rows.map((r) => r.name))}
                    className="h-[18px] w-[18px] accent-[#048B0B]"
                  />
                </th>
                {HEAD.map((h, i) => (
                  <th key={h} className={`h-[64px] bg-[#E5FFEB] px-[10px] align-middle text-[15px] font-semibold text-[#4E4E4E] ${COLW[i]}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r, i) => (
                <tr key={r.name}>
                  <td className="border-t border-[#E4E4E4] px-[16px] py-[28px]">
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.name}`}
                      checked={checked.includes(r.name)}
                      onChange={() => toggle(r.name)}
                      className="h-[18px] w-[18px] accent-[#048B0B]"
                    />
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px]">
                    <span className="flex items-center gap-[14px]">
                      {r.img ? (
                        <img src={r.img} alt="" className="h-[44px] w-[44px] rounded-full object-cover" />
                      ) : (
                        <FinAvatar i={i} size={44} />
                      )}
                      <span className="whitespace-nowrap text-[17px] font-bold text-[#001701]">{r.name}</span>
                    </span>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px]">
                    <span className="block text-[15px] font-semibold text-[#4E4E4E]">{r.email || "—"}</span>
                    <span className="mt-[4px] block text-[15px] font-semibold text-[#4E4E4E]">{r.phone || "—"}</span>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px]">
                    <Pill dot tone={ACCT[r.acct]?.tone || "green"} className="h-[37px] px-[16px]">
                      {ACCT[r.acct]?.label || r.acct || "Unknown"}
                    </Pill>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px]">
                    <Pill dot tone={VER[r.ver]?.tone || "green"} className="h-[37px] px-[16px]">
                      {VER[r.ver]?.label || "Verified"}
                    </Pill>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px] text-[15px] font-bold text-[#001701]">
                    {r.date || "—"}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px] text-[15px] font-bold text-[#001701]">
                    {r.slots || "—"}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px]">
                    <span className="flex items-center gap-[10px]">
                      <button
                        type="button"
                        onClick={() => nav(`/admin/users/details?id=${r.id || ""}`)}
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
          <div className="flex min-h-[70px] items-center justify-between px-[28px] py-[16px]">
            <span className="text-[14px] font-semibold text-[#6B6B6B]">Showing {visibleFrom}–{visibleTo} of {total || rows.length} users</span>
            {pageCount > 1 && (
              <div className="flex items-center gap-[5px]">
                <button type="button" aria-label="Previous page" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="grid h-[30px] w-[30px] place-items-center rounded-[5px] border border-[#D8D8D8] bg-white text-[18px] text-[#4E4E4E] disabled:opacity-40">‹</button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
                  <button key={number} type="button" aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => setPage(number)} className={`grid h-[30px] min-w-[30px] place-items-center rounded-[5px] border px-2 text-[14px] font-semibold ${page === number ? "border-[#048B0B] bg-[#048B0B] text-white" : "border-[#D8D8D8] bg-white text-[#4E4E4E]"}`}>{number}</button>
                ))}
                <button type="button" aria-label="Next page" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page === pageCount} className="grid h-[30px] w-[30px] place-items-center rounded-[5px] border border-[#D8D8D8] bg-white text-[18px] text-[#4E4E4E] disabled:opacity-40">›</button>
              </div>
            )}
          </div>
          {hasMore && <div className="border-t border-[#E4E4E4] px-6 py-4 text-right"><button type="button" onClick={loadMore} disabled={moreLoading} className="rounded-lg bg-[#001701] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{moreLoading ? "Loading more…" : "Load more users"}</button>{moreError && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{moreError}</p>}</div>}
        </div>
      </DarkZone>
    </AdminShell>
  );
}
