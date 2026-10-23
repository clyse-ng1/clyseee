import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import { api, kobo2 } from "../lib/api";
import iconWallet from "../assets/wallet-box.svg";

/* Withdraw step 2/3 — Figma 889:78075 (GC24 select) + 889:80152 (GC26 add
   form). Lists live bank accounts; "Add New Bank Account" swaps to the
   GC26 form view. If an amount arrived from /withdraw/amount, Continue
   saves the account and posts the withdrawal; otherwise it just saves
   the default and returns. Copy fix: "Contiue" -> "Continue". */

/* Generic bank-card glyph (dark) on the white chip. */
function CardGlyph({ className = "h-[24px] w-[40px]" }) {
  return (
    <svg viewBox="0 0 40 24" fill="none" aria-hidden className={className}>
      <rect x="1.5" y="1.5" width="37" height="21" rx="4" stroke="#001701" strokeWidth="2.5" />
      <path d="M1.5 8.5h37" stroke="#001701" strokeWidth="2.5" />
      <path d="M6 16.5h10" stroke="#001701" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function BackButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
  );
}

function StepHead({ mobile = false }) {
  return (
    <div
      className={
        mobile
          ? "flex items-center rounded-[20px] bg-white px-[24px] py-[24px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
          : "flex h-[139px] w-[1240px] items-center rounded-[20px] bg-white px-[63px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
      }
    >
      <span
        className={
          mobile
            ? "grid h-[50px] w-[50px] flex-none place-items-center rounded-[5px] bg-[#F2F1FF]"
            : "grid h-[60px] w-[60px] flex-none place-items-center rounded-[5px] bg-[#F2F1FF]"
        }
      >
        <img src={iconWallet} alt="" className={mobile ? "h-[25px] w-[25px]" : "h-[30px] w-[30px]"} />
      </span>
      <span className={mobile ? "ml-[16px]" : "ml-[20px]"}>
        <span
          className={
            mobile
              ? "block text-[30px] leading-[37px] font-bold text-ink"
              : "block text-[35px] leading-[43px] font-bold text-ink"
          }
        >
          Withdrawn Earning
        </span>
        <span
          className={
            mobile
              ? "block text-[20px] leading-[24px] font-semibold text-[#4E4E4E]"
              : "block text-[25px] leading-[30px] font-semibold text-[#4E4E4E]"
          }
        >
          Step 2/3
        </span>
      </span>
    </div>
  );
}

export default function SelectBank() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/earnings";
  const amount = location.state?.amount || null;
  const [accounts, setAccounts] = useState(null);
  const [removing, setRemoving] = useState(null);

  const removeAccount = async (accountId) => {
    if (!accountId || removing) return;
    setRemoving(accountId);
    setError("");
    const { data, error: apiError } = await api(
      `/member/bank-accounts?account_id=${accountId}`,
      { method: "DELETE" },
    );
    setRemoving(null);
    if (apiError) {
      setError(apiError.message || "Could not remove that account. Please try again.");
      return;
    }
    setAccounts((list) => (list || []).filter((a) => a.account_id !== accountId));
    setSelected((cur) =>
      cur === accountId ? data?.default_account_id || null : cur,
    );
  };
  const [banks, setBanks] = useState(null);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("select");
  const [bankCode, setBankCode] = useState("");
  const [number, setNumber] = useState("");
  const [verifiedName, setVerifiedName] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      const [a, b] = await Promise.all([
        api("/member/bank-accounts"),
        api("/member/banks"),
      ]);
      if (!live) return;
      if (!a.error) {
        setAccounts(a.data?.accounts || []);
        setSelected(a.data?.default_account_id || a.data?.accounts?.[0]?.account_id || null);
      } else {
        setAccounts([]);
      }
      if (!b.error) setBanks(b.data?.banks || []);
    })();
    return () => {
      live = false;
    };
  }, []);

  const list = accounts || [];
  const addValid = bankCode && /^\d{10}$/.test(number.trim());

  const addAccount = async () => {
    if (!addValid || busy) return;
    setBusy(true);
    setError("");
    const { data, error: apiError } = await api("/member/bank-accounts", {
      method: "POST",
      body: { bank_code: bankCode, account_number: number.trim(), set_default: true },
    });
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not verify that account. Please try again.");
      return;
    }
    if (data?.account) {
      setAccounts((prev) => [data.account, ...(prev || [])]);
      setSelected(data.account.account_id);
      setVerifiedName(data.account.account_name || "");
    }
    setView("select");
  };

  const cont = async () => {
    if (!selected || busy) return;
    setBusy(true);
    setError("");
    const { error: saveError } = await api("/member/bank-accounts/default", {
      method: "POST",
      body: { account_id: selected },
    });
    if (saveError) {
      setBusy(false);
      setError(saveError.message || "Could not save that account. Please try again.");
      return;
    }
    if (amount != null) {
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
      navigate("/earnings");
      return;
    }
    setBusy(false);
    navigate(from);
  };

  const rows = list.map((a) => {
    const active = selected === a.account_id;
    return (
      <div
        key={a.account_id}
        className="flex min-h-[104px] w-full items-center bg-white px-[24px] py-[16px] transition hover:bg-mint/60 xl:min-h-[138px] xl:px-[40px]"
      >
        <button
          type="button"
          onClick={() => setSelected(a.account_id)}
          aria-pressed={active}
          className="flex min-w-0 flex-1 cursor-pointer items-center text-left"
        >
        <span className="grid h-[35px] w-[68px] flex-none place-items-center rounded-[6px] bg-[#F1F8F1]">
          <CardGlyph />
        </span>
        <span className="ml-[20px] min-w-0 xl:ml-[25px]">
          <span className="block truncate text-[25px] leading-[30px] font-bold text-black xl:text-[35px] xl:leading-[43px]">
            {a.bank?.name || "Bank account"}
          </span>
          <span className="mt-[4px] block text-[16px] leading-[20px] font-semibold text-[#6B6B6B] xl:text-[20px] xl:leading-[24px]">
            ····{a.account_last4 || "––––"}
            {a.is_default ? " · Default" : ""}
          </span>
        </span>
          <span
            className={`ml-auto grid h-[36px] w-[36px] flex-none place-items-center rounded-full border-[3px] xl:h-[40px] xl:w-[40px] ${
              active ? "border-clyse" : "border-[#999999]"
            }`}
          >
            {active && <span className="h-[18px] w-[18px] rounded-full bg-clyse xl:h-[20px] xl:w-[20px]" />}
          </span>
        </button>
        {!a.is_default && (
          <button
            type="button"
            onClick={() => removeAccount(a.account_id)}
            disabled={removing === a.account_id}
            className="ml-[12px] flex-none text-[14px] leading-[18px] font-semibold text-[#E31B00] transition hover:opacity-70 disabled:opacity-50 xl:ml-[16px]"
          >
            {removing === a.account_id ? "Removing…" : "Remove"}
          </button>
        )}
      </div>
    );
  });

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative hidden pb-[100px] xl:block">
        <BlurBg variant="page" />
        <div className="relative mx-[100px] mt-[29px]">
          <BackButton onClick={() => navigate(-1)} />
          <div className="mt-[28px]">
            <StepHead />
          </div>
          {view === "select" ? (
            <div className="mt-[20px] w-[1240px] rounded-[20px] bg-white px-[63px] pt-[50px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <div className="h-[15px] w-full overflow-hidden rounded-full bg-[#B1DBB3]">
                <div className="h-full w-2/3 rounded-full bg-clyse" />
              </div>
              <h1 className="mt-[50px] text-[35px] leading-[43px] font-bold text-ink">
                Select Bank Account
              </h1>
              <p className="mt-[5px] text-[25px] leading-[30px] font-semibold text-ink">
                Choose a bank account to receive your earning
                {amount != null && (
                  <span className="text-clyse"> · {kobo2(Number(amount) * 100)}</span>
                )}
              </p>
              <div className="mt-[50px] divide-y divide-[#999999] overflow-hidden rounded-[15px] border border-[#999999]">
                {rows.length > 0 ? (
                  rows
                ) : (
                  <p className="bg-white px-[40px] py-[40px] text-center text-[18px] font-semibold text-[#6B6B6B]">
                    {accounts ? "No bank accounts yet — add one below." : "Loading accounts…"}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setView("add");
                  setError("");
                }}
                className="mt-[50px] flex h-[60px] w-full items-center justify-center gap-[12px] rounded-[16px] border border-[#999999] bg-[#F1F8F1] text-[25px] font-semibold text-ink transition hover:bg-white"
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#001701" />
                  <path
                    d="M12 8v8M8 12h8"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Add New Bank Account
              </button>
              {error && (
                <p className="mt-[20px] text-center text-[16px] font-semibold text-[#FF0000]">
                  {error}
                </p>
              )}
              <div className="mt-[51px] flex justify-center gap-[50px]">
                <button
                  type="button"
                  onClick={() =>
                    amount != null
                      ? navigate("/withdraw/amount", { state: { from } })
                      : navigate(from)
                  }
                  className="grid h-[60px] w-[470px] flex-none place-items-center rounded-[16px] border border-clyse bg-[#F1F8F1]"
                >
                  <span className="text-[18px] leading-[22px] font-semibold text-ink">
                    Go Back
                  </span>
                </button>
                <button
                  type="button"
                  onClick={cont}
                  disabled={!selected || busy}
                  className={`grid h-[60px] w-[470px] flex-none place-items-center rounded-[16px] ${
                    selected && !busy ? "bg-btn" : "bg-[#999999]"
                  }`}
                >
                  <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                    {busy ? "Saving…" : "Continue"}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-[20px] w-[1240px] rounded-[20px] bg-white px-[63px] pt-[50px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <div className="h-[15px] w-full overflow-hidden rounded-full bg-[#B1DBB3]">
                <div className="h-full w-2/3 rounded-full bg-clyse" />
              </div>
              <h1 className="mt-[50px] text-[35px] leading-[43px] font-bold text-ink">
                Add Bank Account
              </h1>
              <p className="mt-[5px] text-[25px] leading-[30px] font-semibold text-ink">
                Choose a bank account to receive your earning
              </p>
              <div className="mt-[50px] grid grid-cols-2 gap-[40px]">
                <div>
                  <label
                    htmlFor="sb-number"
                    className="block text-[25px] leading-[30px] font-bold text-ink"
                  >
                    Account Number
                  </label>
                  <input
                    id="sb-number"
                    value={number}
                    onChange={(e) => {
                      setNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                      setError("");
                    }}
                    inputMode="numeric"
                    placeholder="Enter your 10-digit account number"
                    className="mt-[15px] h-[60px] w-full rounded-[16px] border border-[#999999] bg-white px-[24px] text-[20px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
                  />
                </div>
                <div>
                  <label className="block text-[25px] leading-[30px] font-bold text-ink">
                    Account Name
                  </label>
                  <div className="mt-[15px] flex h-[60px] w-full items-center rounded-[16px] border border-[#999999] bg-[#F1F8F1] px-[24px] text-[20px] font-semibold text-ink">
                    {verifiedName || "Verifies automatically"}
                  </div>
                </div>
              </div>
              <label
                htmlFor="sb-bank"
                className="mt-[40px] block text-[25px] leading-[30px] font-bold text-ink"
              >
                Select Bank
              </label>
              <select
                id="sb-bank"
                value={bankCode}
                onChange={(e) => {
                  setBankCode(e.target.value);
                  setError("");
                }}
                className="mt-[15px] h-[60px] w-full appearance-none rounded-[16px] border border-[#999999] bg-[#F1F8F1] px-[24px] text-[20px] font-semibold text-ink outline-none focus:border-clyse"
              >
                <option value="">Select your bank</option>
                {(banks || []).map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
              {error && (
                <p className="mt-[20px] text-center text-[16px] font-semibold text-[#FF0000]">
                  {error}
                </p>
              )}
              <div className="mt-[51px] flex justify-center gap-[50px]">
                <button
                  type="button"
                  onClick={() => setView("select")}
                  className="grid h-[60px] w-[470px] flex-none place-items-center rounded-[16px] border border-clyse bg-[#F1F8F1]"
                >
                  <span className="text-[18px] leading-[22px] font-semibold text-ink">
                    Go Back
                  </span>
                </button>
                <button
                  type="button"
                  onClick={addAccount}
                  disabled={!addValid || busy}
                  className={`grid h-[60px] w-[470px] flex-none place-items-center rounded-[16px] ${
                    addValid && !busy ? "bg-btn" : "bg-[#999999]"
                  }`}
                >
                  <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                    {busy ? "Verifying…" : "Continue"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Mobile — stacked fallback */}
      <main className="relative px-[30px] pb-[60px] xl:hidden">
        <BlurBg variant="page" />
        <div className="relative pt-[46px]">
          <BackButton onClick={() => navigate(-1)} />
          <div className="mt-[24px]">
            <StepHead mobile />
          </div>
          {view === "select" ? (
            <div className="mt-[20px] rounded-[20px] bg-white px-[24px] py-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <div className="h-[12px] w-full overflow-hidden rounded-full bg-[#B1DBB3]">
                <div className="h-full w-2/3 rounded-full bg-clyse" />
              </div>
              <h1 className="mt-[30px] text-[30px] leading-[37px] font-bold text-ink">
                Select Bank Account
              </h1>
              <p className="mt-[6px] text-[16px] leading-[22px] font-semibold text-ink">
                Choose a bank account to receive your earning
                {amount != null && (
                  <span className="text-clyse"> · {kobo2(Number(amount) * 100)}</span>
                )}
              </p>
              <div className="mt-[30px] divide-y divide-[#999999] overflow-hidden rounded-[15px] border border-[#999999]">
                {rows.length > 0 ? (
                  rows
                ) : (
                  <p className="bg-white px-[20px] py-[30px] text-center text-[14px] font-semibold text-[#6B6B6B]">
                    {accounts ? "No bank accounts yet — add one below." : "Loading accounts…"}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setView("add");
                  setError("");
                }}
                className="mt-[30px] flex h-[55px] w-full items-center justify-center gap-[10px] rounded-[12px] border border-[#999999] bg-[#F1F8F1] text-[16px] font-semibold text-ink"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#001701" />
                  <path
                    d="M12 8v8M8 12h8"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                Add New Bank Account
              </button>
              {error && (
                <p className="mt-[16px] text-center text-[14px] font-semibold text-[#FF0000]">
                  {error}
                </p>
              )}
              <div className="mt-[30px] flex flex-col gap-[16px]">
                <button
                  type="button"
                  onClick={cont}
                  disabled={!selected || busy}
                  className={`flex h-[55px] w-full items-center justify-center rounded-[12px] text-[16px] font-semibold text-mint ${
                    selected && !busy ? "bg-btn" : "bg-[#999999]"
                  }`}
                >
                  {busy ? "Saving…" : "Continue"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    amount != null
                      ? navigate("/withdraw/amount", { state: { from } })
                      : navigate(from)
                  }
                  className="flex h-[55px] w-full items-center justify-center rounded-[12px] border border-clyse bg-[#F1F8F1] text-[16px] font-semibold text-ink"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-[20px] rounded-[20px] bg-white px-[24px] py-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <div className="h-[12px] w-full overflow-hidden rounded-full bg-[#B1DBB3]">
                <div className="h-full w-2/3 rounded-full bg-clyse" />
              </div>
              <h1 className="mt-[30px] text-[30px] leading-[37px] font-bold text-ink">
                Add Bank Account
              </h1>
              <p className="mt-[6px] text-[16px] leading-[22px] font-semibold text-ink">
                Choose a bank account to receive your earning
              </p>
              <label
                htmlFor="sb-number-m"
                className="mt-[30px] block text-[20px] font-bold text-ink"
              >
                Account Number
              </label>
              <input
                id="sb-number-m"
                value={number}
                onChange={(e) => {
                  setNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setError("");
                }}
                inputMode="numeric"
                placeholder="Enter your 10-digit account number"
                className="mt-[12px] h-[56px] w-full rounded-[12px] border border-[#999999] bg-white px-[18px] text-[16px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
              />
              <p className="mt-[20px] block text-[20px] font-bold text-ink">
                Account Name
              </p>
              <div className="mt-[12px] flex h-[56px] w-full items-center rounded-[12px] border border-[#999999] bg-[#F1F8F1] px-[18px] text-[16px] font-semibold text-ink">
                {verifiedName || "Verifies automatically"}
              </div>
              <label
                htmlFor="sb-bank-m"
                className="mt-[20px] block text-[20px] font-bold text-ink"
              >
                Select Bank
              </label>
              <select
                id="sb-bank-m"
                value={bankCode}
                onChange={(e) => {
                  setBankCode(e.target.value);
                  setError("");
                }}
                className="mt-[12px] h-[56px] w-full appearance-none rounded-[12px] border border-[#999999] bg-[#F1F8F1] px-[18px] text-[16px] font-semibold text-ink outline-none focus:border-clyse"
              >
                <option value="">Select your bank</option>
                {(banks || []).map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.name}
                  </option>
                ))}
              </select>
              {error && (
                <p className="mt-[16px] text-center text-[14px] font-semibold text-[#FF0000]">
                  {error}
                </p>
              )}
              <div className="mt-[30px] flex flex-col gap-[16px]">
                <button
                  type="button"
                  onClick={addAccount}
                  disabled={!addValid || busy}
                  className={`flex h-[55px] w-full items-center justify-center rounded-[12px] text-[16px] font-semibold text-mint ${
                    addValid && !busy ? "bg-btn" : "bg-[#999999]"
                  }`}
                >
                  {busy ? "Verifying…" : "Continue"}
                </button>
                <button
                  type="button"
                  onClick={() => setView("select")}
                  className="flex h-[55px] w-full items-center justify-center rounded-[12px] border border-clyse bg-[#F1F8F1] text-[16px] font-semibold text-ink"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
