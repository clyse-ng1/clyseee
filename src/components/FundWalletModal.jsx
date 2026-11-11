import { useState } from "react";
import { api, kobo2 } from "../lib/api";

/* Shared Paystack wallet-funding checkout (extracted from the Wallet page so
   the join flow can open the same checkout directly). POST /member/wallet/fund
   returns a Paystack authorization_url; while payment simulation is enabled
   the documented simulate endpoint confirms instead of redirecting. */

export default function FundWalletModal({ open, onClose, onFunded, initialAmount = "", callbackPath = "/wallet" }) {
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : "");
  const [busy, setBusy] = useState(false);
  const [simulationBusy, setSimulationBusy] = useState(false);
  const [simulation, setSimulation] = useState(null);
  const [error, setError] = useState("");
  if (!open) return null;

  const naira = Number(amount) || 0;
  const valid = naira >= 100 && naira <= 1000000;

  const pay = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    const { data, error: apiError } = await api("/member/wallet/fund", {
      method: "POST",
      body: {
        amount_kobo: Math.round(naira * 100),
        callback_url: `${window.location.origin}${callbackPath}`,
      },
    });
    if (apiError) {
      setBusy(false);
      setError(apiError.message || "Could not start wallet funding. Please try again.");
      return;
    }

    // The API returns a private .local placeholder while payment simulation is
    // enabled. Use its documented confirmation endpoint instead of redirecting
    // the browser to an unreachable host.
    if (data?.simulation?.enabled === true) {
      const reference = data.reference || data.funding?.reference;
      setBusy(false);
      if (!reference) {
        setError("The simulation response did not include a funding reference. Please try again.");
        return;
      }
      setSimulation({
        reference,
        amountKobo: data.amount_kobo ?? data.funding?.amount_kobo ?? Math.round(naira * 100),
        message: data.simulation.message || "This is a simulation. No real money will be charged.",
      });
      return;
    }

    if (!data?.authorization_url) {
      setBusy(false);
      setError("No checkout link was returned. Please try again.");
      return;
    }
    if (/^https?:\/\/[^/]*\.local(?:\/|$)/i.test(data.authorization_url)) {
      setBusy(false);
      setError("The payment service returned a local-only checkout link. Please try again later or contact support.");
      return;
    }
    window.location.href = data.authorization_url;
  };

  const confirmSimulation = async () => {
    if (!simulation?.reference || simulationBusy) return;
    setSimulationBusy(true);
    setError("");
    const { data, error: apiError } = await api("/member/payments/wallet-funding/simulate", {
      method: "POST",
      body: { reference: simulation.reference },
    });
    setSimulationBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not confirm the simulated funding. Please try again.");
      return;
    }
    await onFunded?.(data?.funding?.amount_kobo ?? simulation.amountKobo);
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-[20px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-[20px] bg-white p-[30px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-[25px] leading-[30px] font-bold text-ink">Fund Wallet</h3>
        <p className="mt-[8px] text-[15px] leading-[20px] font-semibold text-[#6B6B6B]">
          Top up your Clyse wallet.
        </p>
        {simulation ? (
          <>
            <div className="mt-[20px] rounded-[12px] bg-[#F1F8F2] p-[16px]">
              <p className="text-[16px] font-bold text-ink">Simulation checkout</p>
              <p className="mt-[8px] text-[14px] leading-[20px] font-semibold text-[#4E4E4E]">
                {simulation.message}
              </p>
              <p className="mt-[10px] text-[16px] font-bold text-ink">
                Amount: {kobo2(simulation.amountKobo)}
              </p>
            </div>
            {error && <p role="alert" className="mt-[10px] text-[14px] leading-[18px] font-semibold text-[#FF0000]">{error}</p>}
            <button
              type="button"
              onClick={confirmSimulation}
              disabled={simulationBusy}
              className={`mt-[20px] h-[50px] w-full rounded-[10px] text-[18px] font-semibold text-white ${simulationBusy ? "bg-[#999999]" : "bg-[#048B0B]"}`}
            >
              {simulationBusy ? "Confirming…" : "Confirm simulated funding"}
            </button>
            <button
              type="button"
              onClick={() => { setSimulation(null); setError(""); }}
              disabled={simulationBusy}
              className="mt-[10px] h-[40px] w-full text-[16px] font-semibold text-[#6B6B6B] disabled:opacity-50"
            >
              Back
            </button>
          </>
        ) : (
          <>
            <label className="mt-[20px] block text-[15px] leading-[20px] font-semibold text-ink">
              Amount (₦)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={7}
              placeholder="5000"
              aria-label="Funding amount in naira"
              className="mt-[8px] h-[50px] w-full rounded-[10px] border border-[#999999] px-[16px] text-[18px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
            />
            <p className="mt-[8px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
              Minimum ₦100 · Maximum ₦1,000,000
            </p>
            {error && (
              <p role="alert" className="mt-[10px] text-[14px] leading-[18px] font-semibold text-[#FF0000]">
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={pay}
              disabled={!valid || busy}
              className={`mt-[20px] h-[50px] w-full rounded-[10px] text-[18px] font-semibold text-white ${
                valid && !busy ? "bg-[#048B0B]" : "bg-[#999999]"
              }`}
            >
              {busy ? "Starting payment…" : "Continue to Payment"}
            </button>
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          disabled={simulationBusy}
          className="mt-[10px] h-[40px] w-full text-[16px] font-semibold text-[#6B6B6B] disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

