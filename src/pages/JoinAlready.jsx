import { useLocation } from "react-router-dom";
import JoinStatus from "../components/JoinStatus";
import iconCheckGreen from "../assets/check-green-circle.svg";

export default function JoinAlready() {
  const s = useLocation().state || {};
  return (
    <JoinStatus
      title={s.title || "You're already on the waitlist!"}
      body={s.body || "You've already joined the waitlist for this subscription"}
      btnLabel={s.btnLabel || "OK"}
      btnVariant={s.btnVariant || "outline"}
      btnVariantMobile={s.btnVariantMobile || "outline"}
      btnTo={s.btnTo || "/waitlist"}
      hideBack={s.hideBack}
      iconD={<img src={iconCheckGreen} alt="" className="h-[110px] w-[110px]" />}
      iconM={<img src={iconCheckGreen} alt="" className="h-[84px] w-[84px]" />}
      marqueeMt="mt-[100px]"
    />
  );
}
