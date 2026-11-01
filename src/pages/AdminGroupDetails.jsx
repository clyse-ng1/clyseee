import { useState } from "react";
import AdminShell, { BackTitle } from "../components/AdminShell";
import { TabsBar, InfoCard, ModerationCard, ActivitiesList, MemberRow } from "../components/AdminDetails";
import BrandTile from "../components/BrandTile";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";

/* Group Details & Moderation — Figma 1175:26039 (1440, desktop only).
   Static: tabs switch between the designed Overview / Members /
   Moderation History blocks. Copy fix: page title "User Details &
   Moderation" -> "Group Details & Moderation". */

const TABS = ["Overview", "Members", "Moderation History"];

const MEMBERS = [
  { img: avatarAshlynn, name: "Lindsey Lubin", meta: "Creator | Netflix Premium Plan", pill: { tone: "green", label: "Activated" } },
  { img: avatarAspen, name: "Paityn Kenter", meta: "Member | Netflix Premium Plan", pill: { tone: "green", label: "Activated" } },
  { img: avatarKianna, name: "Kianna Franci", meta: "Member | Netflix Premium Plan", pill: { tone: "green", label: "Activated" } },
  { img: avatar1, name: "James Lipshutz", meta: "Member | Netflix Premium Plan", pill: { tone: "red", label: "Suspended" } },
  { img: avatar2, name: "Dulce Press", meta: "Member | Netflix Premium Plan", pill: { tone: "green", label: "Activated" } },
];

function MembersList({ count = 5 }) {
  return (
    <div className="mt-[15px] divide-y divide-[#E1E1E1] rounded-[10px] border border-[#999999] bg-white px-[20px]">
      {MEMBERS.slice(0, count).map((m) => (
        <MemberRow key={m.name} {...m} />
      ))}
    </div>
  );
}

export default function AdminGroupDetails() {
  const [tab, setTab] = useState(TABS[0]);
  return (
    <AdminShell active="users" sub="gm">
      <BackTitle title="Group Details & Moderation" />

      {/* Profile card */}
      <div className="mt-[30px] flex h-[175px] items-center justify-between rounded-[20px] border border-[#999999] bg-white px-[31px]">
        <div className="flex items-center gap-[20px]">
          <BrandTile brand="netflix" size={80} />
          <span>
            <span className="block text-[25px] font-bold text-[#000000]">Netflix Premium Group</span>
            <span className="block text-[18px] font-semibold text-[#6B6B6B]">Created by Lindsey Lubin</span>
            <span className="block text-[18px] font-semibold text-[#6B6B6B]">
              Group ID: <span className="text-[#000000]">CLY 00044567</span>
            </span>
          </span>
        </div>
        <div className="flex gap-[15px]">
          <div className="flex h-[100px] w-[150px] flex-col items-center justify-center rounded-[10px] border border-[#999999] bg-white">
            <span className="text-[18px] font-semibold text-[#4E4E4E]">Member</span>
            <span className="text-[20px] font-bold text-[#000000]">12/20</span>
          </div>
          <div className="flex h-[100px] w-[150px] flex-col items-center justify-center rounded-[10px] border border-[#999999] bg-white">
            <span className="text-[18px] font-semibold text-[#4E4E4E]">Start Date</span>
            <span className="text-[20px] font-bold text-[#000000]">12 Jan 2025</span>
          </div>
          <div className="flex h-[100px] w-[150px] flex-col items-center justify-center rounded-[10px] border border-[#999999] bg-white">
            <span className="text-[18px] font-semibold text-[#4E4E4E]">Status</span>
            <span className="text-[20px] font-bold text-[#048B0B]">Publish</span>
          </div>
        </div>
      </div>

      <TabsBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Overview" && (
        <>
          <h2 className="mt-[30px] text-[25px] font-bold text-[#000000]">Group Information</h2>
          <div className="mt-[15px] flex gap-[30px]">
            <InfoCard label="Creator" className="w-[350px]">
              Lindsey Lubin
              <br />
              lindsey@gmail.com
            </InfoCard>
            <InfoCard label="Subscription" className="w-[350px]">
              Netflix Premium
              <br />
              N3,000 / Monthly
            </InfoCard>
            <InfoCard label="Capacity" className="w-[350px]">
              10 Slots
              <br />
              Shared Slot 5/10
            </InfoCard>
          </div>
          <h2 className="mt-[30px] text-[20px] font-bold text-[#000000]">Joined Member</h2>
          <MembersList count={3} />
        </>
      )}
      {tab === "Members" && (
        <>
          <h2 className="mt-[30px] text-[20px] font-bold text-[#000000]">Joined Member</h2>
          <MembersList count={5} />
        </>
      )}
      {tab === "Moderation History" && (
        <>
          <h2 className="mt-[30px] text-[20px] font-bold text-[#000000]">Moderation History</h2>
          <div className="mt-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px]">
            <ActivitiesList count={5} />
          </div>
        </>
      )}

      <ModerationCard />
    </AdminShell>
  );
}
