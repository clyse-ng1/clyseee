import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import { api, nairaNum } from "../lib/api";
import iconWalletGreen from "../assets/wallet-box-green.svg";

/* Withdraw step 1/3 — Figma 889:78043 (GC23). Balance is live from
   /member/earnings; Continue carries the amount to /withdraw/select-bank.
   Copy fixes: "withdrawn" -> "withdraw", "withdrawns" -> "withdraw". */
export default function WithdrawAmount() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/earnings";
  const [earn, setEarn] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      const { data } = await api("/member/earnings");
      if (live) setEarn(data?.earnings || data || null);
    })();
    return () => {
      live = false;
    };
  }, []);

  /* Arriving from the wallet, the pot is the wallet balance, not earnings —
     without this the page opened on ₦0 whenever earnings were empty. */
  const fromWallet = location.state?.from === "/wallet";
  const stateAvail = location.state?.availableKobo;
  const availKobo = stateAvail ?? earn?.available_kobo ?? 0;
  const hasAvail = stateAvail != null || !!earn;
  const avail = availKobo / 100;
  const naira = Number(String(amount).replace(/,/g, "")) || 0;
  /* Continue used to look ready with an empty field (and with nothing to
     withdraw at all). It is disabled until the amount is valid, and the page
     says why underneath when the balance is empty. */
  const can = naira > 0 && (!earn || naira <= avail);
  const empty = !!earn && avail <= 0;

  const cont = (e) => {
    e.preventDefault();
    if (!naira || naira <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    if (earn && naira > avail) {
      setError("That amount is more than your available balance.");
      return;
    }
    setError("");
    navigate("/withdraw/select-bank", { state: { amount: naira, from } });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative hidden pb-[100px] xl:block">
        <BlurBg variant="page" />
        <div className="relative mx-[20px] min-[1440px]:mx-[100px] mt-[29px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="grid h-[45px] w-[45px] place-items-center rounded-full bg-mint shadow-[0_0_10px_rgba(0,23,1,0.12)] transition hover:bg-white"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 5l-7 7 7 7"
                stroke="#048B0B"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Figma 889:78043: one card — header, rule, progress, form, buttons. */}
          <form
            onSubmit={cont}
            className="mt-[28px] w-[1240px] overflow-hidden rounded-[20px] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]"
          >
            <div className="flex items-center border-b border-[#BABABA] px-[63px] py-[30px]">
              <span className="grid h-[60px] w-[60px] flex-none place-items-center rounded-[5px] bg-[#DFFFE0]">
                <img src={iconWalletGreen} alt="" className="h-[25px] w-[25px]" />
              </span>
              <span className="ml-[20px]">
                <span className="block text-[35px] leading-[43px] font-bold text-ink">
                  Withdrawn Earning
                </span>
                <span className="block text-[25px] leading-[30px] font-semibold text-[#4E4E4E]">
                  Step 1/3
                </span>
              </span>
            </div>
            <div className="px-[63px] pt-[50px] pb-[50px]">
            <div className="h-[15px] w-full overflow-hidden rounded-full bg-[#B1DBB3]">
              <div className="h-full w-1/3 rounded-full bg-clyse" />
            </div>
            <h1 className="mt-[50px] text-[35px] leading-[43px] font-bold text-ink">
              Withdrawn Amount
            </h1>
            <p className="mt-[5px] text-[25px] leading-[30px] font-semibold text-ink">
              {fromWallet
                ? "Enter the amount you want to withdraw from your wallet balance"
                : "Enter the amount you want to withdraw from your earnings"}
            </p>
            <div className="mt-[50px] rounded-[15px] border border-clyse bg-white px-[40px] py-[40px] text-center">
              <p className="text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                Available Balance
              </p>
              <p className="mt-[10px] text-[35px] leading-[43px] font-bold text-ink">
                {hasAvail ? nairaNum(availKobo) : "50,000"}
              </p>
              <p className="mt-[10px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                Available for Withdraw
              </p>
            </div>
            <label
              htmlFor="wd-amount"
              className="mt-[50px] block text-[25px] leading-[30px] font-bold text-ink"
            >
              Enter Amount
            </label>
            <input
              id="wd-amount"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              inputMode="numeric"
              placeholder="Enter the amount you want to withdraw"
              className="mt-[15px] h-[60px] w-full rounded-[16px] border border-[#999999] bg-white px-[24px] text-[20px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
            />
            {error && (
              <p className="mt-[20px] text-center text-[16px] font-semibold text-[#FF0000]">
                {error}
              </p>
            )}
            <div className="mt-[51px] flex justify-center gap-[50px]">
              <Link
                to={from}
                className="grid h-[60px] w-[470px] flex-none place-items-center rounded-[16px] border border-clyse bg-[#F1F8F1]"
              >
                <span className="text-[18px] leading-[22px] font-semibold text-ink">
                  Go Back
                </span>
              </Link>
              <button
                type="submit"
                disabled={!can}
                className={`grid h-[60px] w-[470px] flex-none place-items-center rounded-[16px] ${
                  can ? "bg-btn" : "bg-[#999999]"
                }`}
              >
                <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                  Continue
                </span>
              </button>
            </div>
            </div>
          </form>
        </div>
      </main>
      {/* Mobile — JOINT WAITLIST MOBILE PAGE 20 / GROUP CREATION PAGE 7 (782:28346 / 777:27694) */}
      <main className="relative bg-white pb-[60px] xl:hidden">
        <div className="flex items-center gap-[20px] border-b border-[#BABABA] bg-white px-[30px] py-[34px]">
          <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-[5px] bg-[#DFFFE0]">
            <img src={iconWalletGreen} alt="" className="h-[25px] w-[25px]" />
          </span>
          <span>
            <span className="block text-[28px] leading-[34px] font-bold whitespace-nowrap text-ink">
              Withdrawn Earning
            </span>
            <span className="block text-[14px] leading-[20px] font-medium text-[#4E4E4E]">
              Step 1/3
            </span>
          </span>
        </div>
        <div className="px-[30px]">
          <form onSubmit={cont}>
            <div className="h-[12px] w-full overflow-hidden rounded-full bg-[#B1DBB3]">
              <div className="h-full w-1/3 rounded-full bg-clyse" />
            </div>
            <h1 className="mt-[30px] text-[30px] leading-[37px] font-bold text-ink">
              Withdrawn Amount
            </h1>
            <p className="mt-[6px] text-[16px] leading-[22px] font-semibold text-ink">
              Enter the amount you want to withdraw from your earnings
            </p>
            <div className="mt-[30px] rounded-[15px] border border-clyse bg-white px-[20px] py-[24px] text-center">
              <p className="text-[14px] font-semibold text-[#6B6B6B]">
                Available Balance
              </p>
              <p className="mt-[8px] text-[30px] leading-[37px] font-bold text-ink">
                {hasAvail ? nairaNum(availKobo) : "50,000"}
              </p>
              <p className="mt-[8px] text-[14px] font-semibold text-[#6B6B6B]">
                Available for Withdraw
              </p>
            </div>
            <label
              htmlFor="wd-amount-m"
              className="mt-[30px] block text-[20px] font-bold text-ink"
            >
              Enter Amount
            </label>
            <input
              id="wd-amount-m"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              inputMode="numeric"
              placeholder="Enter the amount you want to withdraw"
              className="mt-[12px] h-[56px] w-full rounded-[12px] border border-[#999999] bg-white px-[18px] text-[16px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
            />
            {error && (
              <p className="mt-[16px] text-center text-[14px] font-semibold text-[#FF0000]">
                {error}
              </p>
            )}
            {/* Figma 782:28346 mobile: Go Back left, Continue right, side by side. */}
            <div className="mt-[30px] flex gap-[14px]">
              <Link
                to={from}
                className="flex h-[50px] flex-[176] items-center justify-center rounded-[10px] border border-clyse bg-[#F1F8F1] text-[13px] font-semibold text-ink"
              >
                Go Back
              </Link>
              <button
                type="submit"
                disabled={!can}
                className={`flex h-[50px] flex-[174] items-center justify-center rounded-[10px] text-[13px] font-semibold text-mint ${
                  can ? "bg-btn" : "bg-[#999999]"
                }`}
              >
                Continue
              </button>
            </div>
            {empty && (
              <p className="mt-[14px] text-center text-[13px] leading-[18px] font-semibold text-[#6B6B6B]">
                You have no available earnings to withdraw yet.
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
