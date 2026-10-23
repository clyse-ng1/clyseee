import { useLocation } from "react-router-dom";
import JoinStatus from "../components/JoinStatus";

export default function JoinAlready() {
  const s = useLocation().state || {};
  return (
    <JoinStatus
      title={s.title || "You're already on the waitlist!"}
      body={s.body || "You've already joined the waitlist for this subscription"}
      btnLabel={s.btnLabel || "OK"}
      btnVariant={s.btnVariant || "outline"}
      btnVariantMobile={s.btnVariantMobile || "dark"}
      btnTo={s.btnTo || "/waitlist"}
      hideBack={s.hideBack}
      marqueeMt="mt-[100px]"
    />
  );
}
