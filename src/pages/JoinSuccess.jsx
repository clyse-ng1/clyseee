import { useLocation } from "react-router-dom";
import JoinStatus from "../components/JoinStatus";

export default function JoinSuccess() {
  const s = useLocation().state || {};
  return (
    <JoinStatus
      title={s.title || "You're on the waitlist!"}
      body={
        s.body || (
          <>
            You've successfully joined the waitlist for Netflix.
            <br />
            We'll notify you as soon as a spot is available.
          </>
        )
      }
      btnLabel={s.btnLabel || "Complete"}
      btnVariant={s.btnVariant || "dark"}
      btnTo={s.btnTo || "/waitlist"}
      hideBack={s.hideBack}
      marqueeMt="mt-[78px]"
    />
  );
}
