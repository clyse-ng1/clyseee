import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { ConfirmAndGo, SubDetailsDesktop, SubDetailsMobile } from "../components/SubDetailView";
import { useMembershipId, useSubscription } from "../lib/useSubscription";
import { api } from "../lib/api";
import { EvidenceUpload } from "./Support";
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
  const [reportId, setReportId] = useState(null);

  const send = async () => {
    if (busy || !text.trim() || !membershipId) return;
    if (!groupId) {
      setError("We couldn't identify this group yet. Please go back and try again.");
      return;
    }
    setBusy(true);
    setError("");
    const { data, error: apiError } = await api("/member/reports", {
      method: "POST",
      body: { group_id: groupId, reason: "other", details: text.trim() },
    });
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not send your report. Please try again.");
      return;
    }
    /* Docs addition: POST /member/reports/evidence attaches a JPEG/PNG/PDF to
       the report we just filed. The report id comes back on the create call,
       so evidence can be offered immediately instead of being impossible. */
    const newId = data?.report_id || data?.id;
    if (newId) {
      setReportId(newId);
      return;
    }
    navigate("/subscriptions/details", { state: { membership_id: membershipId } });
  };

  return (
    <div className="report-form-anchor scroll-mt-[24px]">
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
        {reportId && (
          <div className="absolute bottom-[18px] left-[26px] right-[26px]">
            <p className="text-[13px] leading-[18px] font-semibold text-[#04640A]">
              Report sent. Add proof if you have it, then continue.
            </p>
            <EvidenceUpload reportId={reportId} />
            <button
              type="button"
              onClick={() =>
                navigate("/subscriptions/details", { state: { membership_id: membershipId } })
              }
              className="mt-[10px] flex h-[40px] items-center justify-center rounded-[20px] bg-btn px-[20px] text-[14px] font-semibold text-white"
            >
              Done
            </button>
          </div>
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
    </div>
  );
}

export default function SubReport() {
  const location = useLocation();
  const [membershipId, resolved] = useMembershipId(location.state?.membership_id);
  const { membership, access, error } = useSubscription(membershipId);

  /* Figma 737:22246 puts the report form at the bottom of this screen, after the
     "How to Access" block. That is fine as a layout, but arriving from Report
     Issue used to land the user at the top of a page that looks pixel-identical
     to the details screen they just left, with the actual form ~2000px below,
     so the tap looked like it did nothing. Land on the form instead. Runs once
     per mount; the header/back affordances are still there if they scroll up. */
  useEffect(() => {
    /* Both responsive trees are in the DOM, so pick the one actually laid out:
       getElementById would return the hidden desktop copy on mobile and
       scrollIntoView on a hidden node does nothing. */
    const t = setTimeout(() => {
      const el = [...document.querySelectorAll(".report-form-anchor")].find(
        (n) => n.getClientRects().length > 0,
      );
      if (el) el.scrollIntoView({ block: "start", behavior: "instant" });
    }, 250);
    return () => clearTimeout(t);
  }, []);

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
        <div className="relative flex gap-[38px] pt-[101px]">
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
      <main className="relative bg-white xl:hidden">
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
