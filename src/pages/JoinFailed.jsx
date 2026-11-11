import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JoinStatus from "../components/JoinStatus";
import FundWalletModal from "../components/FundWalletModal";
import iconErrorRed from "../assets/error-circle-red.svg";

/* P6 waitlist-failed (reconstructed). When the failure is an insufficient
   wallet balance, the Fund Wallet button opens the same Paystack funding
   checkout the Wallet page uses — no detour through My Wallet. */
export default function JoinFailed() {
  const s = useLocation().state || {};
  const nav = useNavigate();
  const [fundOpen, setFundOpen] = useState(false);
  const returnTo = s.returnTo || null;
  return (
    <>
      <JoinStatus
        title={s.title || "Something went wrong"}
        body={s.body || "We couldn't join the waitlist at the moment.\nPlease try again"}
        btnLabel={s.btnLabel || "Complete"}
        btnVariant={s.btnVariant || "red"}
        btnTo={s.btnTo || "/join/details"}
        hideBack={s.hideBack}
        onBtn={s.fund ? () => setFundOpen(true) : null}
        iconD={<img src={iconErrorRed} alt="" className="h-[110px] w-[110px]" />}
        iconM={<img src={iconErrorRed} alt="" className="h-[84px] w-[84px]" />}
        marqueeMt="mt-[100px]"
      />
      {s.fund && (
        <FundWalletModal
          open={fundOpen}
          onClose={() => setFundOpen(false)}
          initialAmount={s.fundAmount || ""}
          callbackPath={returnTo || "/wallet"}
          onFunded={() => {
            setFundOpen(false);
            if (returnTo) nav(returnTo);
            else nav(-1);
          }}
        />
      )}
    </>
  );
}
