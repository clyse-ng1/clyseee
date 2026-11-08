import { useLocation } from "react-router-dom";
import JoinStatus from "../components/JoinStatus";
import iconCheckCircle from "../assets/check-green-circle.svg";

/* Board card 35 ("Icon missing"): the circled slot above "You're on the
   waitlist!" was empty. Green tick in a mint disc, drawn from the app's own
   check asset. */
function SuccessMark({ size = 96 }) {
  return (
    <span
      className="grid place-items-center rounded-full bg-[#DFFFE0]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src={iconCheckCircle}
        alt=""
        style={{ width: size * 0.5, height: size * 0.5 }}
      />
    </span>
  );
}

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
      iconD={<SuccessMark size={110} />}
      iconM={<SuccessMark size={96} />}
      iconTopD="mt-[160px]"
      titleMtD="mt-[40px]"
      iconTopM="pt-[60px]"
      titleMtM="mt-[28px]"
      marqueeMt="mt-[78px]"
    />
  );
}
