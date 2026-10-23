import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { ConfirmAndGo, SubDetailsDesktop, SubDetailsMobile } from "../components/SubDetailView";
import { useMembershipId, useSubscription } from "../lib/useSubscription";
import { api } from "../lib/api";
import iconError from "../assets/error-ink.svg";

function ActionButtons({ groupId }) {
  return (
    <>
      <ConfirmAndGo groupId={groupId} />
      <span className="mt-[10px] flex h-[60px] w-full items-center justify-center gap-[20px] rounded-[9.75px] border border-clyse bg-white shadow-[0_0_7px_rgba(0,23,1,0.25)]">
        <img src={iconError} alt="" className="h-[30px] w-[30px]" />
        <span className="text-[18px] leading-[22px] font-semibold text-ink">
          Report Issue
        </span>
      </span>
    </>
  );
}

function ReportForm({ membershipId, groupId }) {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const send = async () => {
    if (busy || !text.trim() || !membershipId) return;
    if (!groupId) {
      setError("We couldn't identify this group yet. Please go back and try again.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: apiError } = await api("/member/reports", {
      method: "POST",
      body: { group_id: groupId, reason: "other", details: text.trim() },
    });
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not send your report. Please try again.");
      return;
    }
    navigate("/subscriptions/details", { state: { membership_id: membershipId } });
  };

  return (
    <>
      <h3 className="text-[19px] leading-[22px] font-bold text-black">
        Report Issue
      </h3>
      <div className="relative mt-[21px] h-[240px] rounded-[10px] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Send your report"
          className="absolute top-[51px] right-[26px] left-[26px] h-[110px] resize-none bg-transparent text-[19px] leading-[23px] font-semibold text-ink outline-none placeholder:text-[#999999]"
        />
        {error && (
          <p className="absolute bottom-[26px] left-[26px] max-w-[60%] text-[14px] leading-[18px] font-semibold text-clyse-red">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={send}
          className="absolute right-[26px] bottom-[21px] flex h-[48px] w-[108px] items-center justify-center rounded-[10px] bg-[#D9D9D9]"
        >
          <span className="text-[18px] leading-[22px] font-semibold text-black">
            {busy ? "Sending…" : "Send"}
          </span>
        </button>
      </div>
    </>
  );
}

export default function SubReport() {
  const location = useLocation();
  const [membershipId, resolved] = useMembershipId(location.state?.membership_id);
  const { membership, access, error } = useSubscription(membershipId);

  if (resolved && !membershipId) return <Navigate to="/subscriptions/empty" replace />;
  if (error) return <Navigate to="/subscriptions/error" replace />;

  const actions = <ActionButtons groupId={membership?.group_id} />;
  const form = <ReportForm membershipId={membershipId} groupId={membership?.group_id} />;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="My Subscription" />
          <SubDetailsDesktop
            variant="report"
            membership={membership}
            access={access}
            actionSlot={actions}
            afterSlot={form}
          />
        </div>
      </main>
      {/* Mobile (M16 737:22246) */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <SubDetailsMobile
          variant="report"
          membership={membership}
          access={access}
          actionSlot={actions}
          afterSlot={form}
        />
      </main>
    </div>
  );
}
