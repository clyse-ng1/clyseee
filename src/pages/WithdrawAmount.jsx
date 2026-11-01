import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import { api, nairaNum } from "../lib/api";
import iconWallet from "../assets/wallet-box.svg";

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

  const avail = (earn?.available_kobo ?? 0) / 100;
  const naira = Number(String(amount).replace(/,/g, "")) || 0;

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
          <div className="mt-[28px] flex h-[139px] w-[1240px] items-center rounded-[20px] bg-white px-[63px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
            <span className="grid h-[60px] w-[60px] flex-none place-items-center rounded-[5px] bg-[#F2F1FF]">
              <img src={iconWallet} alt="" className="h-[30px] w-[30px]" />
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
          <form
            onSubmit={cont}
            className="mt-[20px] w-[1240px] rounded-[20px] bg-white px-[63px] pt-[50px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
          >
            <div className="h-[15px] w-full overflow-hidden rounded-full bg-[#B1DBB3]">
              <div className="h-full w-1/3 rounded-full bg-clyse" />
            </div>
            <h1 className="mt-[50px] text-[35px] leading-[43px] font-bold text-ink">
              Withdrawn Amount
            </h1>
            <p className="mt-[5px] text-[25px] leading-[30px] font-semibold text-ink">
              Enter the amount you want to withdraw from your earnings
            </p>
            <div className="mt-[50px] rounded-[15px] border border-clyse bg-white px-[40px] py-[40px] text-center">
              <p className="text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                Available Balance
              </p>
              <p className="mt-[10px] text-[35px] leading-[43px] font-bold text-ink">
                {earn ? nairaNum(earn.available_kobo) : "50,000"}
              </p>
              <p className="mt-[10px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                Available for Withdrawal
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
                setAmount(e.target.value.replace(/[^\d.,]/g, ""));
                setError("");
              }}
              inputMode="decimal"
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
                className="bg-btn grid h-[60px] w-[470px] flex-none place-items-center rounded-[16px]"
              >
                <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                  Continue
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
      {/* Mobile — no mobile design in Figma; stacked fallback */}
      <main className="relative px-[30px] pb-[60px] xl:hidden">
        <BlurBg variant="page" />
        <div className="relative pt-[46px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="grid h-[45px] w-[45px] place-items-center rounded-full bg-mint shadow-[0_0_10px_rgba(0,23,1,0.12)]"
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
          <div className="mt-[24px] flex items-center rounded-[20px] bg-white px-[24px] py-[24px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
            <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-[5px] bg-[#F2F1FF]">
              <img src={iconWallet} alt="" className="h-[25px] w-[25px]" />
            </span>
            <span className="ml-[16px]">
              <span className="block text-[30px] leading-[37px] font-bold text-ink">
                Withdrawn Earning
              </span>
              <span className="block text-[20px] leading-[24px] font-semibold text-[#4E4E4E]">
                Step 1/3
              </span>
            </span>
          </div>
          <form
            onSubmit={cont}
            className="mt-[20px] rounded-[20px] bg-white px-[24px] py-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
          >
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
                {earn ? nairaNum(earn.available_kobo) : "50,000"}
              </p>
              <p className="mt-[8px] text-[14px] font-semibold text-[#6B6B6B]">
                Available for Withdrawal
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
                setAmount(e.target.value.replace(/[^\d.,]/g, ""));
                setError("");
              }}
              inputMode="decimal"
              placeholder="Enter the amount you want to withdraw"
              className="mt-[12px] h-[56px] w-full rounded-[12px] border border-[#999999] bg-white px-[18px] text-[16px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
            />
            {error && (
              <p className="mt-[16px] text-center text-[14px] font-semibold text-[#FF0000]">
                {error}
              </p>
            )}
            <div className="mt-[30px] flex flex-col gap-[16px]">
              <button
                type="submit"
                className="bg-btn flex h-[55px] w-full items-center justify-center rounded-[12px] text-[16px] font-semibold text-mint"
              >
                Continue
              </button>
              <Link
                to={from}
                className="flex h-[55px] w-full items-center justify-center rounded-[12px] border border-clyse bg-[#F1F8F1] text-[16px] font-semibold text-ink"
              >
                Go Back
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
