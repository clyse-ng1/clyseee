import AdminShell, { BackTitle } from "../components/AdminShell";
import {
  StatCard,
  badgeGreen,
  badgeMint,
  badgeOrange,
  UsersGlyph,
  CheckGlyph,
  FilterBar,
} from "../components/FinanceShared";
import { CompareTable } from "./AdminRecon";

/* Finance > Reconciliation > Disputes — Figma 1222:29220 (desktop). Static.
   The comparison table is identical to the Reconciliation page, reused here. */

export default function AdminDisputes() {
  return (
    <AdminShell active="finance" sub="recon">
      <BackTitle title="Transaction Reconciliation" />
      <div className="mt-[30px] flex gap-[20px]">
        <StatCard gap10 className="w-[206px] flex-none" label="Total Dispute" value="48" badge={badgeGreen} glyph={<UsersGlyph />} />
        <StatCard gap10 className="w-[206px] flex-none" label="Open" value="124" badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard gap10 className="w-[206px] flex-none" label="In Investigation" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard gap10 className="w-[206px] flex-none" label="In Investigation" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard gap10 className="flex-1" label="In Investigation" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <div className="mt-[20px] flex gap-[20px]">
        <StatCard gap10 className="w-[258px] flex-none" label="Clyse Fee" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard gap10 className="w-[258px] flex-none" label="Creator Earning" value="124" badge={badgeMint} glyph={<CheckGlyph />} />
        <StatCard gap10 className="w-[268px] flex-none" label="Refund" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
        <StatCard gap10 className="flex-1" label="Payout" value="122" badge={badgeOrange} glyph={<UsersGlyph color="#FF6B02" />} />
      </div>
      <div className="mt-[30px]">
        <FilterBar labels={["Transaction Type", "Status", "Date Range"]} />
      </div>
      <div className="mt-[30px]">
        <CompareTable />
      </div>
    </AdminShell>
  );
}
