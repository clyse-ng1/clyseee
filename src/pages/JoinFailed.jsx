import { useLocation } from "react-router-dom";
import JoinStatus from "../components/JoinStatus";

/* P6 waitlist-failed (reconstructed). */
export default function JoinFailed() {
  const s = useLocation().state || {};
  return (
    <JoinStatus
      title={s.title || "Something went wrong"}
      body={s.body || "We couldn't add you to the waitlist. Please try again."}
      btnLabel={s.btnLabel || "Try Again"}
      btnVariant={s.btnVariant || "red"}
      btnTo={s.btnTo || "/join/details"}
      hideBack={s.hideBack}
      marqueeMt="mt-[100px]"
    />
  );
}
