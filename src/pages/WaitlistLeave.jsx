import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
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
    <div className="w-full max-w-[700px] min-w-0 rounded-[20px] border border-clyse bg-white px-[24px] pt-[30px] pb-[30px] shadow-[0_0_30px_rgba(0,23,1,0.20)] xl:px-[40px] xl:pt-[40px] xl:pb-[40px]">
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
      <div className="mt-[40px] flex flex-wrap items-center justify-center gap-[16px] xl:gap-[30px]">
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
  /* Card "make card static": this was a modal over a dimmed waitlist page.
     The PM wants it as a plain card on its own screen — no backdrop, no
     overlay — so it now sits on the same wash as every other member page. */
  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      <BlurBg variant="hero" />
      <Navbar loggedIn />
      <main className="relative z-10 grid place-items-center px-[20px] pt-[40px] pb-[60px] xl:pt-[120px] xl:pb-[120px]">
        <ModalCard />
      </main>
    </div>
  );
}
