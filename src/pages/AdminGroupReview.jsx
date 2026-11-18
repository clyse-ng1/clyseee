import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
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

function ConfirmModal({ icon, title, sub, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">
      <div className="flex max-h-[92vh] w-full lg:w-[1110px] max-w-[94vw] flex-col items-center overflow-y-auto rounded-[30px] bg-white px-[40px] py-[45px]">
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
  const [params] = useSearchParams();
  const groupId = params.get("group_id") || params.get("id") || "";
  const [approved, setApproved] = useState(false);
  const [modal, setModal] = useState(null); // approve | reject | suspend
  /* Live review data: GET /admin/groups/review/detail?group_id (creator contact,
     plan/service, verification evidence, history). Mutations go to
     POST /admin/groups/review with action approve|reject|suspend|resume and a
     reason where required. Figma values only fill the layout until it answers. */
  const [group, setGroup] = useState(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!groupId) return;
    let alive = true;
    api(`/admin/groups/review/detail?group_id=${encodeURIComponent(groupId)}`).then((res) => {
      if (!alive || res.error || !res.data) return;
      setGroup(res.data);
      if (["active", "verified"].includes(String(res.data?.group?.status))) setApproved(true);
    });
    return () => { alive = false; };
  }, [groupId]);

  const g = group?.group || {};
  const creator = g.creator || group?.creator || {};
  const evidence = group?.verification?.evidence_url || group?.evidence_url || "";
  const canAct = Boolean(groupId) && !busy;

  const review = async (action) => {
    if (!groupId) return setNote("Open this screen from the review queue — no group selected.");
    if ((action === "reject" || action === "suspend") && !reason.trim())
      return setNote("A reason is required to reject or suspend.");
    setBusy(true);
    setNote("");
    const res = await api("/admin/groups/review", {
      method: "POST",
      body: { group_id: groupId, action, reason: reason.trim() || null },
    });
    setBusy(false);
    if (res.error) return setNote(res.error.message || `Could not ${action} this group.`);
    setModal(null);
    if (action === "approve") setApproved(true);
    if (action === "reject" || action === "suspend") nav("/admin/group-verification");
    setNote("Group updated.");
  };

  return (
    <AdminShell active="verification" sub="review">
      <BackTitle title="Group Details & Review" />
      <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white p-[41px]">
        <div className="flex gap-[40px]">
          {/* Left card */}
          <div className="w-full lg:w-[420px] shrink-0 rounded-[20px] border border-[#999999] bg-white px-[31px] py-[31px]">
            <h2 className="text-[20px] font-bold text-[#000000]">Creator</h2>
            <div className="mt-[15px] flex items-center gap-[15px] border-b border-[#999999] pb-[20px]">
              <img src={creator.avatar_url || avatarAshlynn} alt="" className="h-[59px] w-[59px] rounded-full object-cover" />
              <span>
                <span className="block text-[20px] font-bold text-[#000000]">
                  {creator.full_name || creator.name || group?.group?.creator_name || "—"}
                </span>
                <span className="block text-[16px] font-semibold text-[#6B6B6B]">
                  {creator.email || group?.group?.creator_email || "—"}
                </span>
                <button
                  onClick={() => creator.id && nav(`/admin/users/details?id=${creator.id}`)}
                  className="text-[16px] font-semibold text-[#048B0B]"
                >
                  View Profile
                </button>
              </span>
            </div>
            <h2 className="mt-[20px] text-[20px] font-bold text-[#000000]">Subscription & Plan</h2>
            <div className="flex h-[81px] items-center gap-[15px] border-b border-[#6B6B6B]">
              <BrandTile brand="netflix" size={50} />
              <span>
                <span className="block text-[18px] font-semibold text-[#000000]">{g.service_name || g.service?.name || "—"}</span>
                <span className="block text-[18px] font-semibold text-[#6B6B6B]">{g.plan_name || g.plan?.name || "—"}</span>
              </span>
            </div>
            <DetailRow label="Capacity" value={g.capacity != null ? `${g.capacity} Slots` : "—"} />
            <DetailRow label="Billing Period" value={g.billing_period || "—"} />
            <DetailRow label="Fixed Unit Price" value={g.price != null ? `N${Number(g.price / 100).toLocaleString("en-US")}` : "—"} />
            <DetailRow label="Access Type" value={g.access_type || g.access_method || "—"} />
            <DetailRow label="Start Date" value={g.start_date ? new Date(g.start_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"} />
            <DetailRow label="Shared Slot" value={g.filled_slots != null ? `${g.filled_slots}/${g.capacity ?? "—"}` : "—"} />
          </div>

          {/* Right card */}
          <div className="w-full lg:w-[568px] shrink-0 rounded-[20px] border border-[#999999] bg-white px-[31px] py-[31px]">
            <h2 className="text-[20px] font-bold text-[#000000]">Proof of Subscription</h2>
            <div className="mt-[15px] flex gap-[50px]">
              <div>
                <p className="mb-[10px] text-[18px] font-bold text-[#000000]">Subscription Invoice</p>
                {evidence ? (
                  <a href={evidence} target="_blank" rel="noreferrer" className="block">
                    <img src={evidence} alt="Subscription invoice" className="h-[140px] w-[180px] rounded-[10px] border border-[#999999] object-cover" />
                  </a>
                ) : (
                  <p className="grid h-[140px] w-[180px] place-items-center rounded-[10px] border border-dashed border-[#999999] text-[14px] font-semibold text-[#6B6B6B]">
                    No evidence uploaded
                  </p>
                )}
              </div>
              <div>
                <p className="mb-[10px] text-[18px] font-bold text-[#000000]">Payment Receipt</p>
                {group?.verification?.receipt_url || group?.receipt_url ? (
                  <a href={group?.verification?.receipt_url || group?.receipt_url} target="_blank" rel="noreferrer" className="block">
                    <img src={group?.verification?.receipt_url || group?.receipt_url} alt="Payment receipt" className="h-[140px] w-[180px] rounded-[10px] border border-[#999999] object-cover" />
                  </a>
                ) : (
                  <p className="grid h-[140px] w-[180px] place-items-center rounded-[10px] border border-dashed border-[#999999] text-[14px] font-semibold text-[#6B6B6B]">
                    No receipt uploaded
                  </p>
                )}
              </div>
            </div>
            <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white p-[30px]">
              <h3 className="text-[20px] font-bold text-[#000000]">Rejection reason</h3>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Give reason for rejection"
                className="mt-[15px] h-[150px] w-full rounded-[10px] border border-[#999999] bg-white p-[20px] text-[18px] font-semibold text-[#001701] placeholder-[#999999] placeholder:font-bold focus:outline-none resize-none"
              />
            </div>
            {note && (
              <p className="mt-[20px] text-[16px] font-semibold text-[#FF0000]">{note}</p>
            )}
            <div className="mt-[30px] flex flex-col gap-[40px]">
              {approved ? (
                <>
                  <div className="flex h-[60px] items-center justify-center rounded-[10px] bg-[#036F09] text-[18px] font-semibold text-white">
                    Group Approved
                  </div>
                  <button
                    onClick={() => canAct && setModal("suspend")}
                    disabled={!canAct}
                    className="flex h-[60px] items-center justify-center rounded-[10px] border border-[#FF0000] bg-white text-[18px] font-semibold text-[#FF0000] disabled:opacity-60"
                  >
                    Suspend Group
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => canAct && setModal("approve")}
                    disabled={!canAct}
                    className="bg-btn flex h-[60px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-[#F1F8F2] disabled:opacity-60"
                  >
                    Approve Group
                  </button>
                  <button
                    onClick={() => canAct && setModal("reject")}
                    disabled={!canAct}
                    className="flex h-[60px] items-center justify-center rounded-[10px] border border-[#FF0000] bg-white text-[18px] font-semibold text-[#FF0000] disabled:opacity-60"
                  >
                    Reject Group
                  </button>
                  {/* Group review has no "request information" action on the API;
                      the nearest documented note channel is the dispute
                      info-request endpoint, which needs a report. Explained. */}
                  <span className="text-center text-[14px] font-semibold text-[#6B6B6B]">
                    Request More Information isn’t available — the review API only supports
                    approve, reject, suspend and resume.
                  </span>
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
          onConfirm={() => review("approve")}
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
          onConfirm={() => review("reject")}
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
          onConfirm={() => review("suspend")}
        />
      )}
    </AdminShell>
  );
}
