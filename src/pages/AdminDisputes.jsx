import AdminShell, { DCARD, DarkZone, DarkFilter, AdminEmpty } from "../components/AdminShell";
import { StatCard, badgeMint, UsersGlyph, CheckGlyph, FinAvatar, FinPill, CheckBox } from "../components/FinanceShared";
import BrandTile from "../components/BrandTile";
import useAdminRows from "../components/useAdminRows";

/* Dispute List — Figma 1222:29220 (1440, desktop only). Dark canvas, five
   stat cards in one row, then the Transaction Comparison card with the
   dispute columns (Dispute ID / Date Reported / User / Subscription-Group /
   Issue Type). Rows, counts and the empty state come from GET /admin/disputes;
   the design dummy rows only show while the request is in flight. */

const ROWS = [
  { id: "DSP-0004455", date: "Sep. 20, 2026", name: "Haylie Siphron", email: "clysewebapp@gmail.com", brand: "netflix", item: "Netflix Premium", kind: "Group", issue: "Payment Issue", status: "open" },
  { id: "DSP-0004454", date: "Sep. 20, 2026", name: "Maria Philips", email: "clysewebapp@gmail.com", brand: "adobe", item: "Adobe Create Cloud", kind: "Subscription", issue: "Refund Request", status: "under_review" },
  { id: "DSP-0004453", date: "Sep. 19, 2026", name: "Jocelyn Schleifer", email: "clysewebapp@gmail.com", brand: "canva", item: "Canva Pro", kind: "Group", issue: "Access Issue", status: "resolved" },
  { id: "DSP-0004452", date: "Sep. 18, 2026", name: "Kaylynn Dokidis", email: "clysewebapp@gmail.com", brand: "spotify", item: "Spotify Pro", kind: "Subscription", issue: "Membership Issue", status: "open" },
  { id: "DSP-0004451", date: "Sep. 17, 2026", name: "Dulce Press", email: "clysewebapp@gmail.com", brand: "youtube", item: "YouTube Premium", kind: "Group", issue: "Payment Refund", status: "rejected" },
  { id: "DSP-0004450", date: "Sep. 16, 2026", name: "Terry Torff", email: "clysewebapp@gmail.com", brand: "prime", item: "Prime Video Pro", kind: "Subscription", issue: "Payment Issue", status: "resolved" },
  { id: "DSP-0004449", date: "Sep. 15, 2026", name: "Makenna Vetrovs", email: "clysewebapp@gmail.com", brand: "amazon", item: "Amazon", kind: "Group", issue: "Payment Issue", status: "under_review" },
];

const HEAD = ["Dispute ID", "Date Reported", "User", "Subscription / Group", "Issue Type"];
const shortId = (id) => (id && id.length > 12 ? `#${String(id).slice(0, 8)}` : id);
const statusTone = (s) => (/resolv|closed/.test(s) ? "green" : /review|invest/.test(s) ? "orange" : /reject/.test(s) ? "red" : "green");

export default function AdminDisputes() {
  const { rows: live, status, total } = useAdminRows("disputes");
  const rows = live || ROWS;
  const liveish = status === "live" || status === "empty";
  const count = (re) => String(liveish ? (live || []).filter((r) => re.test(r.status || "")).length : 0);
  const stats = [
    { label: "Total Dispute", value: liveish ? String(total) : "48" },
    { label: "Open", value: liveish ? count(/^open/) : "124" },
    { label: "In Investigation", value: liveish ? count(/review|invest/) : "122" },
    { label: "Resolved", value: liveish ? count(/resolv/) : "122" },
    { label: "Close", value: liveish ? count(/reject|clos/) : "122" },
  ];
  return (
    <AdminShell active="disputes" sub="dlist" expand nav2>
      <DarkZone>
        <div className="mt-[22px] flex flex-wrap gap-[20px]">
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[0].label} value={stats[0].value} badge={badgeMint} glyph={<UsersGlyph />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[1].label} value={stats[1].value} badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[2].label} value={stats[2].value} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[3].label} value={stats[3].value} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label={stats[4].label} value={stats[4].value} badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
        </div>
        <DarkFilter />
        {status === "empty" && (
          <AdminEmpty dark title="No disputes yet" hint="When a member reports a payment, access or refund problem, the case opens here with its transaction comparison." />
        )}
        <div className={`mt-[26px] overflow-hidden ${status === "empty" ? "hidden" : ""} ${DCARD}`}>
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
                    <FinPill tone={statusTone(r.status)}>{(r.status || "open").replaceAll("_", " ")}</FinPill>
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
