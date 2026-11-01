import { useNavigate } from "react-router-dom";
import AdminShell, { BackTitle, DarkButton } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";

/* Subscription Details — Figma 1149:41825 (1440, desktop only). Static.
   Copy fixes: page header "Add Subscription" -> "Subscription Details",
   duplicated "Subscription Name" label -> "Category". Hidden Earning-card
   leftovers (25px title, stat tiles) are not rendered. */

function Cell({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-[18px] ${className}`}>
      <span className="text-[18px] font-bold leading-[22px] text-[#000000]">{label}</span>
      <span className="text-[18px] font-semibold leading-[22px] text-[#000000]">{children}</span>
    </div>
  );
}

export default function AdminSubDetails() {
  const nav = useNavigate();
  return (
    <AdminShell active="subscriptions" sub="plans">
      <BackTitle
        title="Subscription Details"
        right={
          <DarkButton className="h-[60px] w-[231px]" onClick={() => nav("/admin/subscriptions/add")}>
            Add Subscription
          </DarkButton>
        }
      />
      <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white px-[21px] pb-[41px] pt-[41px]">
        <h2 className="text-[25px] font-bold text-[#000000]">Basic Information</h2>
        <div className="mt-[20px] flex gap-[50px]">
          <Cell label="Subscription Name" className="w-[323px]">
            <span className="flex items-center gap-[10px]">
              <BrandTile brand="netflix" size={50} />
              Netflix Premium
            </span>
          </Cell>
          <Cell label="Category" className="w-[323px]">
            Entertainment
          </Cell>
          <Cell label="Subscription Plan" className="w-[323px]">
            Premium
          </Cell>
        </div>
        <div className="mt-[20px] flex gap-[50px]">
          <Cell label="Billing Period" className="w-[323px]">
            Monthly
          </Cell>
          <Cell label="Fixed Unit Price" className="w-[323px]">
            N3,000
          </Cell>
          <Cell label="Subscription Features" className="w-[323px]">
            <span className="text-[#001701]">1080p | 2 screens | limited ads</span>
          </Cell>
        </div>

        <h2 className="mt-[50px] text-[25px] font-bold text-[#000000]">Capacity and Access</h2>
        <div className="mt-[20px] flex gap-[50px]">
          <Cell label="Total Subscription Capacity" className="w-[509px]">
            100 Slot
          </Cell>
          <Cell label="Supported Access Method" className="w-[509px]">
            Access Link
          </Cell>
        </div>

        <div className="mt-[50px] flex justify-end">
          <DarkButton className="h-[60px] w-[230px]" onClick={() => nav("/admin/subscriptions/add")}>
            Edit Subscription
          </DarkButton>
        </div>
      </div>
    </AdminShell>
  );
}
