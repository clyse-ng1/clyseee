import { useNavigate } from "react-router-dom";
import AdminShell, { DCARD, DarkZone, DarkFilter, AdminEmpty } from "../components/AdminShell";
import { StatCard, badgeMint, UsersGlyph, CheckGlyph, FinAvatar, FinPill, CheckBox } from "../components/FinanceShared";
import BrandTile from "../components/BrandTile";
import useAdminRows from "../components/useAdminRows";

/* Dispute List — Figma 1222:29220 (desktop). Five summary cards and a wide
   comparison table; only live API records are shown, with explicit loading,
   empty and error states instead of sample rows. */


const HEAD = ["Dispute ID", "Date Reported", "User", "Subscription / Group", "Issue Type"];
const shortId = (id) => (id && id.length > 12 ? `#${String(id).slice(0, 8)}` : id);
const statusTone = (s) => (/resolv|closed/.test(s) ? "green" : /review|invest/.test(s) ? "orange" : /reject/.test(s) ? "red" : "green");

export default function AdminDisputes() {
  const nav = useNavigate();
  const { rows: live, status, total } = useAdminRows("disputes");
  const rows = live || [];
  const liveish = status === "live" || status === "empty";
  const count = (re) => String(liveish ? (live || []).filter((r) => re.test(r.status || "")).length : 0);
  const stats = [
    { label: "Total Dispute", value: liveish ? String(total ?? rows.length) : "…" },
    { label: "Open", value: liveish ? count(/^open/) : "…" },
    { label: "In Investigation", value: liveish ? count(/review|invest/) : "…" },
    { label: "Resolved", value: liveish ? count(/resolv/) : "…" },
    { label: "Close", value: liveish ? count(/reject|clos/) : "…" },
  ];
  return (
    <AdminShell active="disputes" sub="dlist" expand nav2 dark>
      <DarkZone>
        <div className="flex justify-end">
          <button type="button" onClick={() => nav("/admin/data/disputes")} className="text-[14px] font-semibold text-[#7FD07F] hover:underline">
            Open dispute workspace (detail, info requests, resolution)
          </button>
        </div>
        <div className="mt-[32px] flex flex-wrap gap-[20px]">
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[0].label} value={stats[0].value} badge={badgeMint} glyph={<UsersGlyph />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[1].label} value={stats[1].value} badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[2].label} value={stats[2].value} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[3].label} value={stats[3].value} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[4].label} value={stats[4].value} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
        </div>
        <DarkFilter />
        {(status === "empty" || status === "error") && (
          <AdminEmpty dark title={status === "error" ? "Disputes could not be loaded" : "No disputes yet"} hint={status === "error" ? "Try again in a moment. The page will not show sample disputes." : "When a member reports a payment, access or refund problem, the case opens here with its transaction comparison."} />
        )}
        <div className={`mt-[26px] overflow-hidden ${(status === "empty" || status === "error") ? "hidden" : ""} ${DCARD}`}>
          <p className="px-[21px] pt-[24px] pb-[16px] text-[20px] leading-[24px] font-bold text-[#001701]">
            Transaction Comparison
          </p>
          <table className="w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th className="h-[50px] w-[52px] bg-[#E5FFEB] px-[16px] align-middle">
                  <CheckBox label="Select all" />
                </th>
                {HEAD.map((h) => (
                  <th key={h} className="h-[50px] bg-[#E5FFEB] px-[10px] align-middle text-[15px] font-semibold text-[#4E4E4E]">
                    {h}
                  </th>
                ))}
                <th className="h-[50px] bg-[#E5FFEB] px-[10px] align-middle text-[15px] font-semibold text-[#4E4E4E]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {status === "loading" && Array.from({ length: 7 }, (_, i) => (
                <tr key={`loading-${i}`} aria-hidden>
                  <td colSpan={HEAD.length + 2} className="h-[105px] border-t border-[#E4E4E4] px-[24px]">
                    <div className="grid grid-cols-5 gap-[32px]">{Array.from({ length: 5 }, (_, j) => <span key={j} className={`h-[14px] animate-pulse rounded bg-[#EFF3EF] ${j === 2 || j === 3 ? "w-[180px]" : "w-[100px]"}`} />)}</div>
                  </td>
                </tr>
              ))}
              {rows.map((r, i) => (
                <tr key={`${r.id}-${i}`}>
                  <td className="border-t border-[#E4E4E4] px-[16px] py-[26px]">
                    <CheckBox label={`Select ${r.name}`} />
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px] text-[16px] font-bold text-[#001701]" title={r.id}>
                    {shortId(r.id)}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px] text-[16px] font-bold text-[#001701]">
                    {r.date}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px]">
                    <span className="flex items-center gap-[14px]">
                      <FinAvatar i={i} size={44} />
                      <span>
                        <span className="block text-[17px] font-bold text-[#001701]">{r.name}</span>
                        <span className="mt-[2px] block text-[15px] font-semibold text-[#8A8A8A]">{r.email}</span>
                      </span>
                    </span>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px]">
                    <span className="flex items-center gap-[14px]">
                      <BrandTile brand={r.brand} size={44} />
                      <span>
                        <span className="block text-[17px] font-bold text-[#001701]">{r.item}</span>
                        <span className="mt-[2px] block text-[15px] font-semibold text-[#8A8A8A]">{r.kind}</span>
                      </span>
                    </span>
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px] text-[16px] font-bold text-[#001701]">
                    {r.issue}
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px]">
                    <FinPill tone={statusTone(r.status)}>{r.status ? r.status.replaceAll("_", " ") : "—"}</FinPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="h-[60px]" />
        </div>
      </DarkZone>
    </AdminShell>
  );
}
