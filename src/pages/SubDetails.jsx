import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import {
  ConfirmButton,
  SubDetailsDesktop,
  SubDetailsMobile,
} from "../components/SubDetailView";
import { useMembershipId, useSubscription } from "../lib/useSubscription";
import { api } from "../lib/api";
import iconDone from "../assets/done-white.svg";

/* Standalone subscription details — Figma 912:19224 (no sidebar): header
   card with stats + Renew, info card with access link + Confirm Access,
   Back to Dashboard. Renew pays POST /member/renewals/confirm {renewal_id}
   for the pending renewal on this membership; Confirm posts
   POST /member/access/confirm {group_id}. Report + Cancel survive as small
   links so no wired flow is lost. Copy fix: "ttps://" -> "https://". */

function RenewButton({ renewal }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  const renew = async () => {
    if (busy) return;
    if (!renewal) {
      setNotice({ ok: true, text: "No renewal due yet." });
      return;
    }
    setBusy(true);
    setNotice(null);
    const { data, error: apiError } = await api("/member/renewals/confirm", {
      method: "POST",
      body: { renewal_id: renewal.renewal_id || renewal.id },
    });
    setBusy(false);
    if (apiError) {
      setNotice({
        ok: false,
        text:
          apiError.code === "insufficient_balance"
            ? "Wallet balance too low. Fund your wallet first."
            : apiError.message || "Could not renew. Please try again.",
      });
      return;
    }
    const r = data?.renewal || {};
    setNotice({
      ok: true,
      text: r.period_end
        ? `Renewed — covered until ${r.period_end.slice(0, 10)}.`
        : "Renewed successfully.",
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={renew}
        disabled={busy}
        className="bg-btn flex h-[60px] w-full items-center justify-center rounded-[9.75px] border border-clyse text-[18px] leading-[22px] font-semibold text-white shadow-[0_0_7px_rgba(0,23,1,0.25)] disabled:opacity-60"
      >
        {busy ? "Renewing…" : "Renew Subscription"}
      </button>
      {notice && (
        <p
          className={`mt-[10px] text-center text-[14px] font-semibold ${notice.ok ? "text-clyse" : "text-clyse-red"}`}
        >
          {notice.text}
        </p>
      )}
    </>
  );
}

function ConfirmedState() {
  return (
    <button
      type="button"
      disabled
      className="flex h-[60px] w-full items-center justify-center gap-[20px] rounded-[9.75px] border border-clyse bg-[#048B0B] opacity-80 shadow-[0_0_7px_rgba(0,23,1,0.25)]"
    >
      <img src={iconDone} alt="" className="h-[30px] w-[30px]" />
      <span className="text-[18px] leading-[22px] font-semibold text-white">
        Access Confirmed
      </span>
    </button>
  );
}

function KeepLinks({ membershipId }) {
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState("");

  const leave = async () => {
    if (leaving || !membershipId) return;
    if (!window.confirm("Leave this group? Your access ends but nothing else changes.")) return;
    setLeaving(true);
    setLeaveError("");
    const { error: apiError } = await api("/member/memberships/cancel", {
      method: "POST",
      body: { membership_id: membershipId },
    });
    setLeaving(false);
    if (apiError) {
      setLeaveError(apiError.message || "Could not leave the group. Please try again.");
      return;
    }
    navigate("/subscriptions");
  };

  return (
    <div className="mt-[16px] text-center">
      <Link
        to="/subscriptions/report"
        state={{ membership_id: membershipId }}
        className="text-[16px] leading-[20px] font-semibold text-clyse"
      >
        Report an issue
      </Link>
      <span className="mx-[12px] text-[#999999]">·</span>
      <button
        type="button"
        onClick={leave}
        className="text-[16px] leading-[20px] font-semibold text-[#E31B00]"
      >
        {leaving ? "Leaving…" : "Cancel subscription"}
      </button>
      {leaveError && (
        <p className="mt-[8px] text-[14px] font-semibold text-clyse-red">{leaveError}</p>
      )}
    </div>
  );
}

export default function SubDetails() {
  const location = useLocation();
  const [membershipId, resolved] = useMembershipId(location.state?.membership_id);
  const { membership, access, error } = useSubscription(membershipId);
  const [renewal, setRenewal] = useState(undefined);
  const [confirmed, setConfirmed] = useState(false);
  const groupId = membership?.group_id;

  useEffect(() => {
    if (!membershipId) return;
    let live = true;
    (async () => {
      const { data } = await api("/member/renewals");
      if (!live) return;
      const list = data?.renewals || [];
      setRenewal(
        list.find(
          (x) =>
            x.status === "pending" &&
            (x.membership_id === membershipId || (groupId && x.group_id === groupId)),
        ) ||
          list.find((x) => x.status === "pending" && x.can_renew !== false) ||
          null,
      );
    })();
    return () => {
      live = false;
    };
  }, [membershipId, groupId]);

  if (resolved && !membershipId) return <Navigate to="/subscriptions/empty" replace />;
  if (error) return <Navigate to="/subscriptions/error" replace />;

  const alreadyConfirmed =
    access?.membership?.access_confirmed && !access?.membership?.needs_reconfirmation;
  const confirmSlot =
    confirmed || alreadyConfirmed ? (
      <ConfirmedState />
    ) : (
      <ConfirmButton groupId={groupId} done={() => setConfirmed(true)} />
    );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop (912:19224) */}
      <main className="relative hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mx-auto mt-[120px] w-[830px]">
          <SubDetailsDesktop
            variant="details"
            membership={membership}
            access={access}
            actionSlot={confirmSlot}
            renewSlot={<RenewButton renewal={renewal || null} />}
          />
          <div className="mt-[66px] text-center">
            <Link
              to="/dashboard"
              className="text-[25px] leading-[35px] font-semibold text-[#048B0B]"
            >
              Back to Dashboard
            </Link>
          </div>
          <KeepLinks membershipId={membershipId} />
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px] pb-[60px]">
          <SubDetailsMobile
            variant="details"
            membership={membership}
            access={access}
            actionSlot={confirmSlot}
            renewSlot={<RenewButton renewal={renewal || null} />}
          />
          <div className="mt-[40px] text-center">
            <Link
              to="/dashboard"
              className="text-[20px] leading-[24px] font-semibold text-[#048B0B]"
            >
              Back to Dashboard
            </Link>
          </div>
          <KeepLinks membershipId={membershipId} />
        </div>
      </main>
    </div>
  );
}
