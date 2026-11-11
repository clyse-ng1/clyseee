import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminRows from "../components/useAdminRows";
import AdminShell, { Pill, DotsIcon, DCARD, DarkZone, DarkFilter } from "../components/AdminShell";
import { StatCard, badgeMint, UsersGlyph, CheckGlyph, FinAvatar } from "../components/FinanceShared";

/* User Management — Figma 1170:23344 (1440, desktop only). Dark canvas:
   black body, moon toggle, white cards with black stroke + white ring, no
   page title. Live admin rows merge over the design dummies when the API
   answers (useAdminRows), same column shape. */

const ROWS = [
  { name: "Ann Kenter", acct: "activated", ver: "verified", slots: "5/10" },
  { name: "Paityn Kenter", acct: "activated", ver: "pending", slots: "5/5" },
  { name: "James Lipshutz", acct: "suspended", ver: "verified", slots: "2/2" },
  { name: "Dulce Press", acct: "pending", ver: "notverified", slots: "5/10" },
  { name: "Jakob Lubin", acct: "activated", ver: "pending", slots: "5/15" },
  { name: "Kaylynn Dokidis", acct: "activated", ver: "verified", slots: "15/10" },
  { name: "Emerson Dokidis", acct: "activated", ver: "verified", slots: "5/14" },
];

const ACCT = {
  activated: { tone: "green", label: "Activated" },
  suspended: { tone: "red", label: "Suspended" },
  pending: { tone: "orange", label: "Pending" },
  active: { tone: "green", label: "Activated" },
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
  const { rows: live, status, total } = useAdminRows("users");
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [checked, setChecked] = useState([]);
  const rows = useMemo(
    () => (live || ROWS).filter((r) => r.name.toLowerCase().includes(q.trim().toLowerCase())),
    [q, live]
  );
  const all = rows.length > 0 && rows.every((r) => checked.includes(r.name));
  const toggle = (name) => setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="users" sub="um" expand nav2>
      <DarkZone>
        <div className="mt-[22px] flex flex-wrap gap-[20px]">
          <StatCard dark className="min-w-[220px] flex-1" label="Total User" value={status === "live" || status === "empty" ? String(total) : "124,000"} badge={badgeMint} glyph={<UsersGlyph />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Active User" value={status === "live" || status === "empty" ? String((live || []).filter((r) => r.acct === "active").length) : "124,000"} badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Verified User" value={status === "live" || status === "empty" ? String((live || []).filter((r) => r.ver === "verified").length) : "124,000"} badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Susspended User" value={status === "live" || status === "empty" ? String((live || []).filter((r) => r.acct === "suspended").length) : "122"} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
        </div>
        <DarkFilter value={q} onChange={(e) => setQ(e.target.value)} />
        {status === "empty" && (
          <AdminEmpty dark title="No users yet" hint="Members who register on Clyse will appear here with their contact details, account status, verification and group counts." />
        )}
        <div className={`mt-[26px] overflow-hidden ${status === "empty" ? "hidden" : ""} ${DCARD}`}>
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
              {rows.map((r, i) => (
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
                    <span className="block text-[15px] font-semibold text-[#4E4E4E]">{r.email || "clysewebapp@gmail.com"}</span>
                    <span className="mt-[4px] block text-[15px] font-semibold text-[#4E4E4E]">{r.phone || "+234 702 122 457"}</span>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px]">
                    <Pill dot tone={ACCT[r.acct]?.tone || "green"} className="h-[37px] px-[16px]">
                      {ACCT[r.acct]?.label || "Activated"}
                    </Pill>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px]">
                    <Pill dot tone={VER[r.ver]?.tone || "green"} className="h-[37px] px-[16px]">
                      {VER[r.ver]?.label || "Verified"}
                    </Pill>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px] text-[15px] font-bold text-[#001701]">
                    {r.date || "Sep. 20, 2026"}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px] text-[15px] font-bold text-[#001701]">
                    {r.slots || (r.grp && r.grp !== "—" ? `${r.mem ?? 0}/${r.grp}` : "5/10")}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[28px]">
                    <span className="flex items-center gap-[10px]">
                      <button
                        type="button"
                        onClick={() => nav("/admin/users/details")}
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
          <div className="h-[70px]" />
        </div>
      </DarkZone>
    </AdminShell>
  );
}
