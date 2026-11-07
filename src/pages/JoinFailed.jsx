import { useLocation } from "react-router-dom";
import JoinStatus from "../components/JoinStatus";
import iconErrorRed from "../assets/error-circle-red.svg";

/* P6 waitlist-failed (reconstructed). */
export default function JoinFailed() {
  const s = useLocation().state || {};
  return (
    <JoinStatus
      title={s.title || "Something went wrong"}
      body={s.body || "We couldn't join the waitlist at the moment.\nPlease try again"}
      btnLabel={s.btnLabel || "Complete"}
      btnVariant={s.btnVariant || "red"}
      btnTo={s.btnTo || "/join/details"}
      hideBack={s.hideBack}
      iconD={<img src={iconErrorRed} alt="" className="h-[110px] w-[110px]" />}
      iconM={<img src={iconErrorRed} alt="" className="h-[84px] w-[84px]" />}
      marqueeMt="mt-[100px]"
    />
  );
}
