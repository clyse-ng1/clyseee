import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { BackTitle, Pill } from "../components/AdminShell";
import { SuccessSeal } from "../components/AdminGlyphs";
import avatarKianna from "../assets/avatar-kianna.webp";

/* Request Details + Approve Request panel — Figma 1156:44392 / 1157:45079
   (1440, desktop only). Static: Approve swaps to the confirmation panel,
   Reject opens a confirmation modal (mirrors the group-review reject
   modal language). Copy fix: "Webite" -> "Website". */

function SlackTile({ size = 50 }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-black" style={{ width: size, height: size }}>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <path d="M9.5 2.5a2.5 2.5 0 0 1 2.5 2.5v5H7a2.5 2.5 0 0 1 2.5-2.5Z" fill="#fff" />
        <path d="M14.5 2.5a2.5 2.5 0 0 0-2.5 2.5v5h5a2.5 2.5 0 0 0-2.5-2.5Z" fill="#fff" opacity=".85" />
        <path d="M21.5 9.5a2.5 2.5 0 0 0-2.5-2.5h-5v5a2.5 2.5 0 0 0 2.5 2.5Z" fill="#fff" opacity=".7" />
        <path d="M21.5 14.5a2.5 2.5 0 0 1-2.5 2.5h-5v-5a2.5 2.5 0 0 1 2.5-2.5Z" fill="#fff" opacity=".85" />
        <path d="M14.5 21.5a2.5 2.5 0 0 1-2.5-2.5v-5h5a2.5 2.5 0 0 1-2.5 2.5Z" fill="#fff" />
        <path d="M9.5 21.5a2.5 2.5 0 0 0 2.5-2.5v-5H7a2.5 2.5 0 0 0 2.5 2.5Z" fill="#fff" opacity=".85" />
        <path d="M2.5 14.5a2.5 2.5 0 0 0 2.5 2.5h5v-5a2.5 2.5 0 0 0-2.5-2.5Z" fill="#fff" opacity=".7" />
        <path d="M2.5 9.5A2.5 2.5 0 0 1 5 7h5v5a2.5 2.5 0 0 1-2.5 2.5Z" fill="#fff" opacity=".85" />
      </svg>
    </span>
  );
}

function InfoRow({ label, children }) {
  return (
    <div className="flex flex-col gap-[8px] border-b border-[#999999] py-[15px]">
      <span className="text-[18px] font-semibold text-[#6B6B6B]">{label}</span>
      <span className="text-[20px] font-semibold text-[#000000]">{children}</span>
    </div>
  );
}

export default function AdminRequestDetails() {
  const nav = useNavigate();
  const [approved, setApproved] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (approved) {
    return (
      <AdminShell active="subscriptions" sub="requests">
        <div className="mx-auto mt-[60px] flex w-[500px] flex-col items-center rounded-[20px] border border-[#999999] bg-white px-[15px] py-[50px]">
          <SuccessSeal />
          <h2 className="mt-[20px] text-center text-[35px] font-bold leading-tight text-[#001701]">Approve Request</h2>
          <p className="mt-[10px] text-center text-[18px] font-semibold text-[#4E4E4E]">
            Are you sure you want to approve this request?
          </p>
          <button
            onClick={() => nav("/admin/subscriptions/requests")}
            className="bg-btn mt-[30px] flex h-[60px] w-[470px] max-w-full items-center justify-center rounded-[16px] text-[18px] font-semibold text-[#F1F8F2]"
          >
            Approve
          </button>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell active="subscriptions" sub="requests">
      <BackTitle title="Request Details" />
      <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white px-[41px] py-[41px]">
        <div className="flex gap-[50px]">
          {/* Requester */}
          <div className="h-[407px] w-[489px] rounded-[20px] border border-[#999999] bg-white p-[30px]">
            <h2 className="text-[20px] font-bold text-[#000000]">Requester Information</h2>
            <div className="mt-[15px] flex items-center gap-[15px]">
              <img src={avatarKianna} alt="Kianna Franci" className="h-[50px] w-[50px] rounded-full object-cover" />
              <span>
                <span className="block text-[18px] font-bold text-[#000000]">Kianna Franci</span>
                <span className="block text-[16px] font-semibold text-[#6B6B6B]">kianna@gmail.com</span>
              </span>
            </div>
            <div className="mt-[10px]">
              <InfoRow label="Account Status">
                <span className="text-[#048B0B]">Active</span>
              </InfoRow>
              <InfoRow label="Registration Date">Sep. 20, 2026</InfoRow>
            </div>
          </div>
          {/* Subscription */}
          <div className="h-[407px] w-[489px] rounded-[20px] border border-[#999999] bg-white p-[30px]">
            <h2 className="text-[20px] font-bold text-[#000000]">Subscription Details</h2>
            <div className="mt-[15px] flex items-center gap-[15px]">
              <SlackTile />
              <span>
                <span className="block text-[18px] font-bold text-[#000000]">Slack</span>
                <span className="block text-[16px] font-semibold text-[#6B6B6B]">N5,500 / Monthly</span>
              </span>
            </div>
            <div className="mt-[10px] flex flex-col gap-[12px]">
              <div className="flex items-center justify-between border-b border-[#999999] py-[10px]">
                <span className="text-[18px] font-semibold text-[#6B6B6B]">Category</span>
                <span className="text-[18px] font-semibold text-[#000000]">Website</span>
              </div>
              <div className="flex items-center justify-between border-b border-[#999999] py-[10px]">
                <span className="text-[18px] font-semibold text-[#6B6B6B]">Billing Period</span>
                <span className="text-[18px] font-semibold text-[#000000]">Monthly</span>
              </div>
              <div className="flex items-center justify-between py-[10px]">
                <span className="text-[18px] font-semibold text-[#6B6B6B]">Status</span>
                <Pill tone="orange" className="h-[37px] w-[107px]">
                  Pending
                </Pill>
              </div>
            </div>
          </div>
        </div>

        {/* Review */}
        <div className="mt-[50px] rounded-[20px] border border-[#999999] bg-white p-[30px]">
          <h2 className="text-[20px] font-bold text-[#000000]">Review</h2>
          <p className="mt-[15px] text-[18px] font-semibold text-[#6B6B6B]">Reject Reason</p>
          <textarea
            placeholder="Write reason for rejection (optional)"
            className="mt-[10px] h-[150px] w-full rounded-[10px] border border-[#999999] bg-white p-[20px] text-[18px] font-semibold text-[#001701] placeholder-[#999999] focus:outline-none resize-none"
          />
        </div>

        <div className="mt-[50px] flex justify-end gap-[40px]">
          <button
            onClick={() => setRejectOpen(true)}
            className="flex h-[60px] w-[230px] items-center justify-center rounded-[10px] border border-[#FF0000] bg-white text-[18px] font-semibold text-[#FF0000]"
          >
            Reject
          </button>
          <button
            onClick={() => setApproved(true)}
            className="bg-btn flex h-[60px] w-[230px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-[#F1F8F2]"
          >
            Approve
          </button>
        </div>
      </div>

      {/* Reject confirmation modal */}
      {rejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
          <div className="flex w-[560px] flex-col items-center rounded-[30px] bg-white px-[40px] py-[45px]">
            <span className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#FF0000]">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <path d="m6 6 12 12M18 6 6 18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <h2 className="mt-[20px] text-center text-[30px] font-bold leading-tight text-[#001701]">Reject Request</h2>
            <p className="mt-[8px] text-center text-[18px] font-semibold text-[#4E4E4E]">
              This request will be declined and the requester notified.
            </p>
            <div className="mt-[25px] flex w-full gap-[25px]">
              <button
                onClick={() => setRejectOpen(false)}
                className="flex h-[60px] flex-1 items-center justify-center rounded-[16px] border border-[#4E4E4E] bg-white text-[18px] font-semibold text-[#001701]"
              >
                Cancel
              </button>
              <button
                onClick={() => nav("/admin/subscriptions/requests")}
                className="flex h-[60px] flex-1 items-center justify-center rounded-[16px] bg-[#FF0000] text-[18px] font-semibold text-white"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
