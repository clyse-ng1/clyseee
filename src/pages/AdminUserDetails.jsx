import { useState } from "react";
import AdminShell, { BackTitle, Pill } from "../components/AdminShell";
import { TabsBar, InfoCard, ModerationCard, ActivitiesList, SubRow } from "../components/AdminDetails";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";

/* User Details & Moderation — Figma 1172:24979 (1440, desktop only).
   Static: tabs switch between the designed Overview / Subscription &
   Group / Moderation History blocks. */

const TABS = ["Overview", "Subscription & Group", "Moderation History"];

function SubsAndGroups() {
  return (
    <div className="mt-[30px]">
      <h2 className="text-[20px] font-bold text-[#000000]">Active Subscription</h2>
      <div className="mt-[15px] divide-y divide-[#E1E1E1] rounded-[10px] border border-[#999999] bg-white px-[20px]">
        <SubRow brand="netflix" name="Netflix Premium" meta="Premium" rightTop="N3,000" rightBottom="Sep. 20, 2026" />
        <SubRow brand="spotify" name="Spotify Basic" meta="Basic" rightTop="N1,000" rightBottom="Sep. 20, 2026" />
        <SubRow brand="canva" name="Canva Premium" meta="Premium" rightTop="N3,000" rightBottom="Sep. 20, 2026" />
      </div>
      <h2 className="mt-[30px] text-[20px] font-bold text-[#000000]">Active Group</h2>
      <div className="mt-[15px] divide-y divide-[#E1E1E1] rounded-[10px] border border-[#999999] bg-white px-[20px]">
        <SubRow brand="netflix" name="Netflix Premium Group" meta="5/10 Members" rightTop="N3,000" rightBottom="Sep. 20, 2026" />
        <SubRow brand="youtube" name="YouTube Basic Group" meta="4/8 Members" rightTop="N1,500" rightBottom="Sep. 20, 2026" />
      </div>
    </div>
  );
}

export default function AdminUserDetails() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <AdminShell active="users" sub="um">
      <BackTitle title="User Details & Moderation" />

      {/* Profile card */}
      <div className="mt-[30px] flex h-[175px] items-center justify-between rounded-[20px] border border-[#999999] bg-white px-[31px]">
        <div className="flex items-center gap-[20px]">
          <img src={avatarAshlynn} alt="Ann Kenter" className="h-[80px] w-[80px] rounded-full object-cover" />
          <span>
            <span className="block text-[25px] font-bold text-[#000000]">Ann Kenter</span>
            <span className="block text-[18px] font-semibold text-[#6B6B6B]">ann@gmail.com . +234 801 234 5678</span>
            <span className="block text-[18px] font-semibold text-[#6B6B6B]">
              User ID: <span className="text-[#000000]">CLY 00044567</span>
            </span>
          </span>
        </div>
        <Pill className="h-[37px] w-[116px]">Activated</Pill>
      </div>

      <TabsBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Overview" && (
        <>
          <h2 className="mt-[30px] text-[25px] font-bold text-[#000000]">Personal Information</h2>
          <div className="mt-[15px] flex gap-[30px]">
            <InfoCard label="Email / Phone Number" className="w-[350px]">
              ann@gmail.com
              <br />
              +234 801 234 5678
            </InfoCard>
            <InfoCard label="Home Address" className="w-[350px]">
              12 Allen Avenue, Ikeja,
              <br />
              Lagos, Nigeria
            </InfoCard>
            <InfoCard label="Member Since" className="w-[350px]">
              Sep. 20, 2026
            </InfoCard>
          </div>
          <SubsAndGroups />
        </>
      )}
      {tab === "Subscription & Group" && <SubsAndGroups />}
      {tab === "Moderation History" && (
        <div className="mt-[30px] rounded-[10px] border border-[#999999] bg-white px-[20px]">
          <ActivitiesList count={5} />
        </div>
      )}

      <ModerationCard />
    </AdminShell>
  );
}
