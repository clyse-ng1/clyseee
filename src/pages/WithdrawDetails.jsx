import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import { api } from "../lib/api";

/* Withdraw step 3/3 — Figma 889:78173 "Withdrawn Earning". This step did not
   exist: step 2 posted the withdrawal straight away, so the user never saw the
   amount, the bank or the arrival estimate before the money left. Now step 2
   only picks and saves the account, and the POST happens here on Confirm. */

function Head({ mobile = false }) {
  return (
    <div className="flex items-center">
      <span
        className={`grid flex-none place-items-center rounded-[10px] bg-[#DFFFE0] ${
          mobile ? "h-[38px] w-[42px]" : "h-[50px] w-[54px]"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
          className={mobile ? "h-[18px] w-[18px]" : "h-[24px] w-[24px]"}
        >
          <path
            d="M9 6h10M9 6v12M9 6H7M9 12h6M9 12v6h6"
            stroke="#048B0B"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M12 3v4M15 3v4M10 15h4" stroke="#048B0B" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className={mobile ? "ml-[14px]" : "ml-[20px]"}>
        <span
          className={`block font-bold text-ink ${
            mobile ? "text-[22px] leading-[27px]" : "text-[35px] leading-[43px]"
          }`}
        >
          Withdrawn Earning
        </span>
        <span
          className={`block font-semibold text-[#6B6B6B] ${
            mobile ? "text-[13px] leading-[18px]" : "text-[18px] leading-[24px]"
          }`}
        >
          Step 3/3
        </span>
      </span>
    </div>
  );
}

const naira = (n) => `N${Math.round(Number(n || 0)).toLocaleString("en-US")}`;

/* Router state is the source, but step 2 also mirrors it into sessionStorage so
   a refresh on step 3 (or a back-then-forward) still knows the amount and the
   bank instead of printing "—" and "No account selected". */
function readWd() {
  try {
    const raw = sessionStorage.getItem("clyse-wd");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function WithdrawDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const carried = location.state || readWd() || {};
  const from = carried.from || "/earnings";
  const amount = carried.amount ?? null;
  const account = carried.account || null;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const bankLine = account
    ? `${account.bank || "Bank account"} (****${account.last4 || "––––"})`
    : "No account selected";

  const confirm = async () => {
    if (busy) return;
    if (!account || amount == null) {
      setError("Pick an amount and a bank account before confirming.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: wdError } = await api("/member/earnings/withdraw", {
      method: "POST",
      body: { amount_kobo: Math.round(Number(amount) * 100) },
    });
    setBusy(false);
    if (wdError) {
      setError(
        wdError.code === "no_payout_account"
          ? "Add a verified bank account to receive payouts."
          : wdError.message || "Could not start the withdrawal. Please try again.",
      );
      return;
    }
    navigate(from, { state: { withdrawn: true } });
  };

  const rows = [
    ["Amount", amount == null ? "\u2014" : naira(amount)],
    ["Bank", bankLine],
    ["Estimated Arrival", "Within 1-2 business days"],
  ];

  return (
    <div className="relative min-h-screen bg-[#F5FBF5] font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />

      {/* Desktop */}
      <main className="relative z-10 mx-[100px] mt-[100px] hidden xl:block">
        <div className="rounded-[20px] bg-white px-[63px] pt-[30px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.08)]">
          <Head />
          <div className="mt-[30px] h-[10px] w-full rounded-full bg-[#B1DBB3]">
            <div className="h-[10px] w-full rounded-full bg-clyse" />
          </div>
          <h2 className="mt-[46px] text-[35px] leading-[43px] font-bold">
            Withdrawal Details
          </h2>
          <p className="mt-[8px] text-[18px] leading-[24px] font-semibold text-[#4E4E4E]">
            Choose a bank account to receive your earning
          </p>
          <div className="mt-[36px] rounded-[10px] border border-[#999999] bg-white px-[30px] py-[16px]">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between py-[16px]">
                <span className="text-[20px] leading-[26px] font-semibold text-[#6B6B6B]">
                  {label}
                </span>
                <span className="text-[20px] leading-[26px] font-semibold text-ink">
                  {value}
                </span>
              </div>
            ))}
          </div>
          {error && (
            <p className="mt-[20px] text-[16px] leading-[22px] font-semibold text-[#E31B00]">
              {error}
            </p>
          )}
          <div className="mt-[40px] flex gap-[50px]">
            <Link
              to="/withdraw/select-bank"
              state={{ from, amount }}
              className="grid h-[60px] w-[533px] place-items-center rounded-2xl border border-clyse bg-[#F1F8F1] text-[18px] font-semibold text-ink"
            >
              Go Back
            </Link>
            <button
              type="button"
              onClick={confirm}
              disabled={busy}
              className={`grid h-[60px] w-[531px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint ${
                busy ? "opacity-60" : ""
              }`}
            >
              {busy ? "Withdrawing…" : "Confirm Withdrawn"}
            </button>
          </div>
          <div className="pb-[60px]" />
        </div>
      </main>

      {/* Mobile */}
      <main className="relative z-10 xl:hidden">
        <div className="px-[20px] pt-[30px]">
          <div className="rounded-[16px] bg-white px-[20px] pt-[20px] pb-[26px] shadow-[0_0_14px_rgba(0,23,1,0.08)]">
            <Head mobile />
            <div className="mt-[18px] h-[7px] w-full rounded-full bg-[#B1DBB3]">
              <div className="h-[7px] w-full rounded-full bg-clyse" />
            </div>
            <h2 className="mt-[24px] text-[20px] leading-[25px] font-bold">
              Withdrawal Details
            </h2>
            <p className="mt-[6px] text-[12px] leading-[17px] font-semibold text-[#4E4E4E]">
              Choose a bank account to receive your earning
            </p>
            <div className="mt-[20px] rounded-[10px] border border-[#999999] bg-white px-[16px] py-[6px]">
              {rows.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-[10px]">
                  <span className="text-[12px] leading-[16px] font-semibold text-[#6B6B6B]">
                    {label}
                  </span>
                  <span className="max-w-[58%] text-right text-[12px] leading-[16px] font-semibold text-ink">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            {error && (
              <p className="mt-[14px] text-[12px] leading-[17px] font-semibold text-[#E31B00]">
                {error}
              </p>
            )}
            <div className="mt-[24px] flex gap-[12px]">
              <Link
                to="/withdraw/select-bank"
                state={{ from, amount }}
                className="grid h-[46px] flex-1 place-items-center rounded-[10px] border border-clyse bg-[#F1F8F1] text-[13px] font-semibold text-ink"
              >
                Go Back
              </Link>
              <button
                type="button"
                onClick={confirm}
                disabled={busy}
                className={`bg-btn grid h-[46px] flex-1 place-items-center rounded-[10px] text-[13px] font-semibold text-mint ${
                  busy ? "opacity-60" : ""
                }`}
              >
                {busy ? "Withdrawing…" : "Confirm Withdrawn"}
              </button>
            </div>
          </div>
          <div className="pb-[60px]" />
        </div>
      </main>
    </div>
  );
}
