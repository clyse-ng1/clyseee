import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Waitlist from "./Waitlist";
import MiniButton from "../components/MiniButton";
import { api } from "../lib/api";
import iconError from "../assets/error-circle-red.svg";

/* Leave confirmation over the waitlist page. Figma labels BOTH buttons
   "Get in touch" (pasted CTA copy) — fixed to Cancel / Leave Waitlist; Figma
   889:82363 labels the pair exactly that way. Its
   backdrop is 100% opaque black; relayed out as a standard 50% dim so the
   page beneath shows through as intended. */
function ModalCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const waitlistId = location.state?.waitlist_id;
  const planId = location.state?.plan_id || null;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const leave = async () => {
    if (busy) return;
    if (!waitlistId) {
      navigate("/waitlist");
      return;
    }
    setBusy(true);
    setError("");
    // Leave is POST /member/waitlist/leave { plan_id } (idempotent). Static
    // fallback rows carry no plan_id, so those leave locally.
    const { error: apiError } = planId
      ? await api("/member/waitlist/leave", { method: "POST", body: { plan_id: planId } })
      : { error: null };
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not leave the waitlist. Please try again.");
      return;
    }
    navigate("/waitlist");
  };

  return (
    <div className="w-full rounded-[20px] border border-clyse bg-white px-[30px] pt-[30px] pb-[30px] shadow-[0_0_30px_rgba(0,23,1,0.20)] xl:w-[700px] xl:px-[40px] xl:pt-[40px] xl:pb-[40px]">
      <img src={iconError} alt="" className="mx-auto h-[70px] w-[70px]" />
      <h2 className="mt-[12px] text-center text-[25px] leading-[35px] font-bold text-ink">
        Leave Waitlist
      </h2>
      <p className="mt-[12px] text-center text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
        Are you sure you want to leave this waitlist?
        <br />
        You'll no longer receive notifications about this subscription
      </p>
      {error && (
        <p className="mt-[16px] text-center text-[15px] font-semibold text-clyse-red">
          {error}
        </p>
      )}
      <div className="mt-[40px] flex items-center justify-center gap-[20px] xl:gap-[30px]">
        <MiniButton variant="gray" to="/waitlist" icons={false}>
          Cancel
        </MiniButton>
        <MiniButton variant="red" onClick={leave} busy={busy} icons={false}>
          Leave Waitlist
        </MiniButton>
      </div>
    </div>
  );
}

export default function WaitlistLeave() {
  return (
    <div className="relative">
      <Waitlist />
      <div className="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/50 p-[20px] xl:p-0">
        <ModalCard />
      </div>
    </div>
  );
}
