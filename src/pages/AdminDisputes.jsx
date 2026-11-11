import AdminShell, { DCARD, DarkZone, DarkFilter } from "../components/AdminShell";
import { StatCard, badgeMint, UsersGlyph, CheckGlyph, FinAvatar, CheckBox } from "../components/FinanceShared";
import BrandTile from "../components/BrandTile";

/* Dispute List — Figma 1222:29220 (1440, desktop only). Dark canvas, five
   stat cards in one row, then the Transaction Comparison card with the
   dispute columns (Dispute ID / Date Reported / User / Subscription-Group /
   Issue Type). Static design screen. */

const ROWS = [
  { name: "Haylie Siphron", brand: "netflix", item: "Netflix Premium", kind: "Group", issue: "Payment Issue" },
  { name: "Maria Philips", brand: "adobe", item: "Adobe Create Cloud", kind: "Subscription", issue: "Refund Request" },
  { name: "Jocelyn Schleifer", brand: "canva", item: "Canva Pro", kind: "Group", issue: "Access Issue" },
  { name: "Kaylynn Dokidis", brand: "spotify", item: "Spotify Pro", kind: "Subscription", issue: "Membership Issue" },
  { name: "Dulce Press", brand: "youtube", item: "YouTube Premium", kind: "Group", issue: "Payment Refund" },
  { name: "Terry Torff", brand: "prime", item: "Prime Video Pro", kind: "Subscription", issue: "Payment Issue" },
  { name: "Makenna Vetrovs", brand: "amazon", item: "Amazon", kind: "Group", issue: "Payment Issue" },
];

const HEAD = ["Dispute ID", "Date Reported", "User", "Subscription / Group", "Issue Type"];

export default function AdminDisputes() {
  return (
    <AdminShell active="disputes" sub="dlist" expand nav2>
      <DarkZone>
        <div className="mt-[22px] flex flex-wrap gap-[20px]">
          <StatCard dark gap10 className="min-w-[190px] flex-1" label="Total Dispute" value="48" badge={badgeMint} glyph={<UsersGlyph />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label="Open" value="124" badge={badgeMint} glyph={<CheckGlyph />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label="In Investigation" value="122" badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label="Resolved" value="122" badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
          <StatCard dark gap10 className="min-w-[190px] flex-1" label="Close" value="122" badge={badgeMint} glyph={<UsersGlyph color="#FF6B02" />} />
        </div>
        <DarkFilter />
        <div className={`mt-[26px] overflow-hidden ${DCARD}`}>
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
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i}>
                  <td className="border-t border-[#E4E4E4] px-[16px] py-[26px]">
                    <CheckBox label={`Select ${r.name}`} />
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px] text-[16px] font-bold text-[#001701]">
                    DSP-0004455
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px] text-[16px] font-bold text-[#001701]">
                    Sep. 20, 2026
                  </td>
                  <td className="border-t border-[#E4E4E4] px-[10px] py-[26px]">
                    <span className="flex items-center gap-[14px]">
                      <FinAvatar i={i} size={44} />
                      <span>
                        <span className="block text-[17px] font-bold text-[#001701]">{r.name}</span>
                        <span className="mt-[2px] block text-[15px] font-semibold text-[#8A8A8A]">clysewebapp@gmail.com</span>
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
