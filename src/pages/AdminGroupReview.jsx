import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { BackTitle } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";

/* Group Details & Review — Figma 1159:47088 (pending), 1160:47828
   (approved), 1160:48378 (approve modal), 1162:48688 (reject modal),
   1162:48990 (suspend modal). 1440, desktop only, static. Copy fixes:
   "Aprove" -> "Approve", suspend sub-copy rewritten with "until". */

function DetailRow({ label, value }) {
  return (
    <div className="flex h-[101px] flex-col justify-center gap-[8px] border-b border-[#999999]">
      <span className="text-[18px] font-semibold text-[#6B6B6B]">{label}</span>
      <span className="text-[20px] font-semibold text-[#000000]">{value}</span>
    </div>
  );
}

function InvoiceThumb({ variant }) {
  return (
    <div className="flex h-[218px] w-[228px] flex-col rounded-[12px] border border-[#048B0B] bg-white p-[14px]">
      <span className="text-[11px] font-extrabold tracking-widest text-[#E31B00]">NETFLIX</span>
      <span className="mt-[6px] h-[8px] w-[70%] rounded-sm bg-[#E31B00]" />
      <span className="mt-[10px] flex flex-col gap-[6px]">
        <span className="h-[6px] w-full rounded-sm bg-[#D9D9D9]" />
        <span className="h-[6px] w-[85%] rounded-sm bg-[#D9D9D9]" />
        <span className="h-[6px] w-[92%] rounded-sm bg-[#D9D9D9]" />
        <span className="h-[6px] w-[70%] rounded-sm bg-[#D9D9D9]" />
      </span>
      <span className="mt-auto flex items-center justify-between">
        <span className="text-[12px] font-bold text-[#000000]">{variant === 0 ? "N5,500" : "PAID"}</span>
        <span className="h-[16px] w-[70px] rounded-[4px] bg-[#E31B00]" />
      </span>
    </div>
  );
}

function ConfirmModal({ icon, title, sub, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="flex max-h-[92vh] w-[1110px] max-w-[94vw] flex-col items-center overflow-y-auto rounded-[30px] bg-white px-[40px] py-[45px]">
        {icon}
        <h2 className="mt-[25px] text-center text-[35px] font-bold leading-tight text-[#001701]">{title}</h2>
        <p className="mt-[8px] text-center text-[18px] font-semibold text-[#4E4E4E]">{sub}</p>
        <div className="mt-[30px] flex w-full max-w-[950px] gap-[50px]">
          <button
            onClick={onCancel}
            className="flex h-[60px] flex-1 items-center justify-center rounded-[16px] border border-[#4E4E4E] bg-white text-[18px] font-semibold text-[#001701]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-btn flex h-[60px] flex-1 items-center justify-center rounded-[16px] text-[18px] font-semibold text-[#F1F8F2]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminGroupReview() {
  const nav = useNavigate();
  const [approved, setApproved] = useState(false);
  const [modal, setModal] = useState(null); // approve | reject | suspend
  const [infoSent, setInfoSent] = useState(false);

  return (
    <AdminShell active="verification" sub="review">
      <BackTitle title="Group Details & Review" />
      <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white p-[41px]">
        <div className="flex gap-[40px]">
          {/* Left card */}
          <div className="w-[420px] shrink-0 rounded-[20px] border border-[#999999] bg-white px-[31px] py-[31px]">
            <h2 className="text-[20px] font-bold text-[#000000]">Creator</h2>
            <div className="mt-[15px] flex items-center gap-[15px] border-b border-[#999999] pb-[20px]">
              <img src={avatarAshlynn} alt="Lindsey Lubin" className="h-[59px] w-[59px] rounded-full object-cover" />
              <span>
                <span className="block text-[20px] font-bold text-[#000000]">Lindsey Lubin</span>
                <span className="block text-[16px] font-semibold text-[#6B6B6B]">lindsey@gmail.com</span>
                <button className="text-[16px] font-semibold text-[#048B0B]">View Profile</button>
              </span>
            </div>
            <h2 className="mt-[20px] text-[20px] font-bold text-[#000000]">Subscription & Plan</h2>
            <div className="flex h-[81px] items-center gap-[15px] border-b border-[#6B6B6B]">
              <BrandTile brand="netflix" size={50} />
              <span>
                <span className="block text-[18px] font-semibold text-[#000000]">Netflix Premium</span>
                <span className="block text-[18px] font-semibold text-[#6B6B6B]">Premium</span>
              </span>
            </div>
            <DetailRow label="Capacity" value="10 Slots" />
            <DetailRow label="Billing Period" value="Monthly" />
            <DetailRow label="Fixed Unit Price" value="N3,000" />
            <DetailRow label="Access Type" value="Access Link" />
            <DetailRow label="Start Date" value="Sep. 20, 2026" />
            <DetailRow label="Shared Slot" value="5/10" />
          </div>

          {/* Right card */}
          <div className="w-[568px] shrink-0 rounded-[20px] border border-[#999999] bg-white px-[31px] py-[31px]">
            <h2 className="text-[20px] font-bold text-[#000000]">Proof of Subscription</h2>
            <div className="mt-[15px] flex gap-[50px]">
              <div>
                <p className="mb-[10px] text-[18px] font-bold text-[#000000]">Subscription Invoice</p>
                <InvoiceThumb variant={0} />
              </div>
              <div>
                <p className="mb-[10px] text-[18px] font-bold text-[#000000]">Payment Receipt</p>
                <InvoiceThumb variant={1} />
              </div>
            </div>
            <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white p-[30px]">
              <h3 className="text-[20px] font-bold text-[#000000]">Rejection reason</h3>
              <textarea
                placeholder="Give reason for rejection"
                className="mt-[15px] h-[150px] w-full rounded-[10px] border border-[#999999] bg-white p-[20px] text-[18px] font-semibold text-[#001701] placeholder-[#999999] placeholder:font-bold focus:outline-none resize-none"
              />
            </div>
            <div className="mt-[30px] flex flex-col gap-[40px]">
              {approved ? (
                <>
                  <div className="flex h-[60px] items-center justify-center rounded-[10px] bg-[#036F09] text-[18px] font-semibold text-white">
                    Group Approved
                  </div>
                  <button
                    onClick={() => setModal("suspend")}
                    className="flex h-[60px] items-center justify-center rounded-[10px] border border-[#FF0000] bg-white text-[18px] font-semibold text-[#FF0000]"
                  >
                    Suspend Group
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setModal("approve")}
                    className="bg-btn flex h-[60px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-[#F1F8F2]"
                  >
                    Approve Group
                  </button>
                  <button
                    onClick={() => setModal("reject")}
                    className="flex h-[60px] items-center justify-center rounded-[10px] border border-[#FF0000] bg-white text-[18px] font-semibold text-[#FF0000]"
                  >
                    Reject Group
                  </button>
                  <button
                    onClick={() => setInfoSent(true)}
                    disabled={infoSent}
                    className="flex h-[60px] items-center justify-center rounded-[10px] border border-[#048B0B] bg-[#F1F8F2] text-[18px] font-semibold text-[#001701] disabled:opacity-70"
                  >
                    {infoSent ? "Request Sent" : "Request More Information"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {modal === "approve" && (
        <ConfirmModal
          icon={
            <span className="flex h-[130px] w-[130px] items-center justify-center rounded-full bg-[#048B0B]">
              <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
                <path d="m5 12.5 4.5 4.5L19 7.5" stroke="#DFFFE1" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          }
          title="Are you sure you want to approve this group?"
          sub="The group will be activated and members will be able to join"
          confirmLabel="Approve"
          onCancel={() => setModal(null)}
          onConfirm={() => {
            setModal(null);
            setApproved(true);
          }}
        />
      )}
      {modal === "reject" && (
        <ConfirmModal
          icon={
            <span className="flex h-[130px] w-[130px] items-center justify-center rounded-full bg-[#FF0000]">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="m6 6 12 12M18 6 6 18" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </span>
          }
          title="Reject Group"
          sub="The group will be rejected and members will not be able to join"
          confirmLabel="Reject"
          onCancel={() => setModal(null)}
          onConfirm={() => nav("/admin/group-verification")}
        />
      )}
      {modal === "suspend" && (
        <ConfirmModal
          icon={
            <span className="flex h-[130px] w-[130px] items-center justify-center rounded-full bg-[#F04C00]">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path d="M10 6v12M14 6v12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </span>
          }
          title="Suspend Group"
          sub="Members will not be able to access this group until the suspension is lifted"
          confirmLabel="Suspend"
          onCancel={() => setModal(null)}
          onConfirm={() => nav("/admin/group-verification")}
        />
      )}
    </AdminShell>
  );
}
