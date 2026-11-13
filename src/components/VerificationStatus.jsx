import { useCallback, useEffect, useState } from "react";
import { api, fmtDate } from "../lib/api";

/* The group's verification state, with the one action the docs added:
   POST /member/verification/withdraw { group_id } pulls back a submission that
   is still pending (403 when the group is already verified). Read side is
   GET /member/verification?group_id=, whose status drives whether the button
   is offered at all. Renders nothing until there is a submission to talk about,
   so the create-group review screen keeps its Figma layout in the common case. */
export default function VerificationStatus({ groupId, className = "" }) {
  const [v, setV] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const load = useCallback(async () => {
    if (!groupId) return;
    const { data, error } = await api(
      `/member/verification?group_id=${encodeURIComponent(groupId)}`,
    );
    if (error) {
      setV(null);
      return;
    }
    setV(data?.verification || null);
  }, [groupId]);

  useEffect(() => {
    let live = true;
    if (!groupId) return undefined;
    (async () => {
      const { data, error } = await api(
        `/member/verification?group_id=${encodeURIComponent(groupId)}`,
      );
      if (!live) return;
      setV(error ? null : data?.verification || null);
    })();
    return () => {
      live = false;
    };
  }, [groupId]);

  if (!v?.status) return null;

  const status = `${v.status}`.toLowerCase();
  const canWithdraw = status === "pending";

  const withdraw = async () => {
    if (busy || !canWithdraw) return;
    setBusy(true);
    setMsg("");
    const { error } = await api("/member/verification/withdraw", {
      method: "POST",
      body: { group_id: groupId },
    });
    setBusy(false);
    if (error) {
      setMsg(
        error.code === "already_verified"
          ? "This group is already verified."
          : error.message || "Could not withdraw the submission.",
      );
      return;
    }
    setMsg("Submission withdrawn. You can submit new evidence any time.");
    load();
  };

  return (
    <div className={`rounded-[12px] border border-clyse bg-white px-[16px] py-[14px] ${className}`}>
      <p className="text-[14px] leading-[20px] font-semibold text-ink">
        Verification: <span className="capitalize">{status.replace(/_/g, " ")}</span>
        {v.submitted_at ? (
          <span className="font-normal text-[#66726C]"> · submitted {fmtDate(v.submitted_at)}</span>
        ) : null}
      </p>
      {canWithdraw && (
        <button
          type="button"
          onClick={withdraw}
          disabled={busy}
          className="mt-[10px] flex h-[38px] items-center justify-center rounded-[19px] border border-clyse px-[18px] text-[13px] font-semibold text-ink disabled:opacity-40"
        >
          {busy ? "Withdrawing…" : "Withdraw submission"}
        </button>
      )}
      {msg && <p className="mt-[8px] text-[12px] leading-[18px] font-semibold text-[#66726C]">{msg}</p>}
    </div>
  );
}
