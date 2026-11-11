import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAdminRows from "../components/useAdminRows";
import AdminShell, { Pill, DotsIcon, DCARD, DarkZone, DarkFilter } from "../components/AdminShell";
import { StatCard, badgeMint, UsersGlyph, CheckGlyph, Pagination } from "../components/FinanceShared";
import BrandTile from "../components/BrandTile";

/* Group Management — Figma 1176:26649 (1440, desktop only). Black band holds
   the moon toggle, stats and filters; the table card sits on the mint body
   below it, with pager bottom-right. Live rows merge over dummies. */

const ROWS = [
  { name: "Maria Philips", brand: "netflix", sub: "Netflix Premium", plan: "Premium", member: "34", slot: "5/10", status: "approved" },
  { name: "Maria Philips", brand: "adobe", sub: "Adobe Creative Cloud", plan: "Premium", member: "34", slot: "5/10", status: "reject" },
  { name: "Maria Philips", brand: "canva", sub: "Canva Pro", plan: "Premium", member: "55", slot: "5/10", status: "pending" },
  { name: "Maria Philips", brand: "spotify", sub: "Spotify", plan: "Premium", member: "12", slot: "5/10", status: "approved" },
  { name: "Maria Philips", brand: "prime", sub: "Prime Video", plan: "Premium", member: "22", slot: "5/10", status: "approved" },
  { name: "Maria Philips", brand: "youtube", sub: "YouTube Premium", plan: "Premium", member: "12", slot: "5/10", status: "review" },
  { name: "Maria Philips", brand: "capcut", sub: "CapCut Pro", plan: "Premium", member: "23", slot: "5/10", status: "approved" },
];

const STATUS = {
  approved: { tone: "green", label: "Approved" },
  reject: { tone: "red", label: "Reject" },
  pending: { tone: "orange", label: "Pending" },
  review: { tone: "gray", label: "Under Review" },
  open: { tone: "green", label: "Approved" },
  full: { tone: "orange", label: "Pending" },
  closed: { tone: "gray", label: "Under Review" },
};

const HEAD = ["Creator", "Subscription & Plan", "Member", "Shared Slot", "Start Date", "Status", "Action"];

export default function AdminGroups() {
  const live = useAdminRows("groups");
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [checked, setChecked] = useState([]);
  const rows = useMemo(
    () =>
      (live || ROWS).map((r) => ({
        ...r,
        member: r.member || (r.slot ? String(r.slot).split("/")[0] : "12"),
        sub: r.sub || "Subscription",
        plan: r.plan || "Premium",
      })),
    [live]
  );
  const all = rows.length > 0 && rows.every((r, i) => checked.includes(i));
  const toggle = (i) => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));

  return (
    <AdminShell active="users" sub="gm" expand nav2>
      <DarkZone band width="75%">
        <div className="mt-[22px] flex flex-wrap gap-[20px]">
          <StatCard dark className="min-w-[220px] flex-1" label="Total User" value="124,000" badge={badgeMint} glyph={<UsersGlyph />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Active Group" value="124,000" badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Suspended User" value="122" badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
          <StatCard dark className="min-w-[220px] flex-1" label="Close Group" value="122" badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
        </div>
        <DarkFilter value={q} onChange={(e) => setQ(e.target.value)} />
      </DarkZone>
      <div className="bg-[#E5FFEB] px-[24px] pb-[40px] pt-[26px]">
        <div className={`overflow-hidden ${DCARD}`}>
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="h-[58px] w-[52px] bg-[#E5FFEB] px-[16px] align-middle">
                  <input
                    type="checkbox"
                    aria-label="Select all"
                    checked={all}
                    onChange={() => setChecked(all ? [] : rows.map((_, i) => i))}
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
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="border-t border-[#E4E4E4] px-[16px] py-[24px]">
                    <input
                      type="checkbox"
                      aria-label={`Select row ${i + 1}`}
                      checked={checked.includes(i)}
                      onChange={() => toggle(i)}
                      className="h-[18px] w-[18px] accent-[#048B0B]"
                    />
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px]">
                    <span className="block text-[16px] font-bold text-[#001701]">{r.name}</span>
                    <span className="mt-[4px] block text-[14px] font-semibold text-[#8A8A8A]">{r.email || "clysewebapp@gmail.com"}</span>
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
                    {r.date || "Sep. 20, 2026"}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px]">
                    <Pill dot tone={STATUS[r.status]?.tone || "green"} className="h-[35px] px-[14px]">
                      {STATUS[r.status]?.label || "Approved"}
                    </Pill>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[24px]">
                    <span className="flex items-center gap-[10px]">
                      <button
                        type="button"
                        onClick={() => nav("/admin/groups/details")}
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
          <Pagination />
        </div>
      </div>
    </AdminShell>
  );
}
