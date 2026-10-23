import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { Footer, MobileFooter } from "../components/Footer";
import DetailModal, { DetailRow } from "../components/DetailModal";
import { api, brandOf, displayName, fmtDay, fmtTx, kobo2 } from "../lib/api";
import { useAuth } from "../lib/useAuth";
import iconBalance from "../assets/balance-glyph.svg";
import iconHeroGlyph from "../assets/hero-glyph.svg";
import iconFundPlus from "../assets/fund-plus.svg";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconPlusWhite from "../assets/plus-white.svg";
import iconArrowInk from "../assets/arrow-ink.svg";
import iconTransArrow from "../assets/trans-arrow.svg";
import iconQaPlus from "../assets/qa-plus.svg";
import iconQaSliders from "../assets/qa-sliders.svg";
import iconQaClock from "../assets/qa-clock.svg";
import iconQaSupport from "../assets/qa-support.svg";
import iconMovies from "../assets/glyph-movies.svg";
import iconMusic from "../assets/glyph-music.svg";
import iconProductivity from "../assets/glyph-productivity.svg";
import iconNavArrow from "../assets/nav-arrow.svg";
import chevronDown from "../assets/sidecard-chevron.svg";
import chevronRight from "../assets/angle-right.svg";
import avatarAccount from "../assets/avatar-account.webp";
import ctaDash from "../assets/cta-dash.webp";

/* My Wallet (Figma 460:10563 desktop / 481:11028 mobile).
   NOTES: (1) A duplicated second "Status" header (+750) is omitted. (2) Each
   desktop row ends with a stack of mutually-covering icon drafts (black box,
   red glyph, white box, arrow) — only the ">" reads as intent, so only it
   is built. (3) Mobile row 6 labels "Pending" on a green Successful-style
   pill; it gets the standard orange Pending treatment. (4) Copy fixes:
   "transaction" -> "transactions", "-10:24" -> "· 10:24", "Transfar" ->
   "Transfer". Funding amounts keep Figma's per-platform literal ("+N" on
   desktop, "+₦" on mobile). (5) The brand glyphs (movies/music/
   productivity), button-cluster icons and row arrows are redrawn — Figma
   component internals with no token-free path source. */
const QA = [
  { icon: "plus", label: "Fund Wallet", key: "fund" },
  { icon: "sliders", label: "View Limits" },
  { icon: "clock", label: "Transaction History" },
  { icon: "support", label: "Help & Support" },
];
const QA_MOBILE = [QA[0], QA[2], QA[1], QA[3]];
const QA_ICONS = {
  plus: iconQaPlus,
  sliders: iconQaSliders,
  clock: iconQaClock,
  support: iconQaSupport,
};
/* Figma rows, shown while the live ledger loads. */
const DESKTOP_ROWS = [
  { date: "Sep 28, 2025 · 10:24", desc: "Wallet Funding", sub: "From Bank Transfer", amount: "+N10,000.00", status: "Successful", icon: "withdraw" },
  { date: "Sep 26, 2025 · 04:12 PM", desc: "Netflix Premium", sub: "Group Subscription", amount: "− ₦3,500.00", status: "Successful", icon: "netflix" },
  { date: "Sep 22, 2025 · 07:33 PM", desc: "Spotify Premium", sub: "Group Subscription", amount: "− ₦2,000.00", status: "Successful", icon: "spotify" },
  { date: "Sep 28, 2025 · 10:24", desc: "Wallet Funding", sub: "From Bank Transfer", amount: "+N7,000.00", status: "Pending", icon: "withdraw" },
  { date: "Sep 20, 2025 · 11:17 AM", desc: "YouTube Premium", sub: "Group Subscription", amount: "− ₦2,500.00", status: "Pending", icon: "youtube" },
  { date: "Sep 16, 2025 · 06:21 PM", desc: "Canva Pro", sub: "Group Subscription", amount: "− ₦1,500.00", status: "Successful", icon: "canva" },
  { date: "Sep 28, 2025 · 10:24", desc: "Amazon", sub: "Group Subscription", amount: "+N2,000.00", status: "Fail", icon: "amazon" },
];
const MOBILE_ROWS = [
  { desc: "Wallet Funding", sub: "From Bank Transfer", amount: "+₦10,000.00", date: "Sep 26, 2025 · 04:12 AM", status: "Successful", icon: "withdraw" },
  { desc: "Netflix Premium", sub: "Group Subscription", amount: "− ₦3,500.00", date: "Sep 26, 2025 · 04:12 PM", status: "Successful", icon: "netflix" },
  { desc: "Spotify Premium", sub: "From Bank Transfer", amount: "+ ₦5,000.00", date: "Sep 24, 2025 · 09:02 AM", status: "Successful", icon: "spotify" },
  { desc: "Wallet Funding", sub: "From Bank Transfer", amount: "+ ₦5,000.00", date: "28 Sep 2026", status: "Pending", icon: "withdraw" },
  { desc: "YouTube Premium", sub: "Group Subscription", amount: "+₦10,000.00", date: "Sep 20, 2025 · 11:17 AM", status: "Pending", icon: "youtube" },
  { desc: "Canva Pro", sub: "Group Subscription", amount: "− ₦1,500.00", date: "Sep 16, 2025 · 06:21 PM", status: "Pending", icon: "canva" },
  { desc: "Amazon", sub: "Group Subscription", amount: "− ₦1,500.00", date: "Sep 16, 2025 · 06:21 PM", status: "Fail", icon: "amazon" },
];
const PILL = {
  Successful: "bg-[#DFFFE0] text-[#048B0B]",
  Pending: "bg-[#FFEACC] text-[#FF9400]",
  Fail: "bg-[#FDE9E9] text-[#FF0000]",
};
const DOT = {
  Successful: "bg-[#048B0B]",
  Pending: "bg-[#FF9400]",
  Fail: "bg-[#FF0000]",
};

const TX_ICONS = new Set(["netflix", "spotify", "youtube", "canva", "amazon"]);

function mapTx(t) {
  const kind = (t.kind || "").toLowerCase();
  const funding = kind === "wallet_funding";
  const desc = t.description || (funding ? "Wallet Funding" : "Group Subscription");
  const sub = funding
    ? "From Bank Transfer"
    : kind === "adjustment"
      ? "Wallet Adjustment"
      : "Group Subscription";
  const signed = t.signed_amount_kobo ?? t.amount_kobo ?? 0;
  const credit =
    (t.direction || "").toLowerCase() === "credit" ||
    ((t.direction || "").toLowerCase() !== "debit" && signed >= 0);
  const amount = `${credit ? "+" : "−"}${kobo2(Math.abs(signed))}`;
  const st = (t.status || "").toLowerCase();
  const status =
    st === "successful" ? "Successful" : st === "pending" || st === "reversed_pending" ? "Pending" : "Fail";
  let icon = "withdraw";
  if (!funding) {
    const b = brandOf({ name: desc });
    if (b && TX_ICONS.has(b)) icon = b;
  }
  return {
    key: t.id || t.reference,
    id: t.id || null,
    date: fmtTx(t.created_at),
    desc,
    sub,
    amount,
    status,
    icon,
  };
}

function Notice({ notice }) {
  if (!notice) return null;
  return (
    <p
      className={`mt-[30px] rounded-[10px] px-[20px] py-[14px] text-[15px] leading-[20px] font-semibold ${
        notice.ok ? "bg-[#DFFFE0] text-[#048B0B]" : "bg-[#FDE9E9] text-[#FF0000]"
      }`}
    >
      {notice.text}
    </p>
  );
}

function FundModal({ open, onClose }) {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (!open) return null;

  const naira = Number(String(amount).replace(/[^0-9.]/g, "")) || 0;
  const valid = naira >= 100 && naira <= 1000000;

  const pay = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    const { data, error: apiError } = await api("/member/wallet/fund", {
      method: "POST",
      body: {
        amount_kobo: Math.round(naira * 100),
        callback_url: `${window.location.origin}/wallet`,
      },
    });
    if (apiError || !data?.authorization_url) {
      setBusy(false);
      setError(apiError?.message || "No checkout link returned. Please try again.");
      return;
    }
    window.location.href = data.authorization_url;
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
          Top up with Paystack — card, transfer or USSD.
        </p>
        <label className="mt-[20px] block text-[15px] leading-[20px] font-semibold text-ink">
          Amount (₦)
        </label>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="decimal"
          placeholder="5,000"
          className="mt-[8px] h-[50px] w-full rounded-[10px] border border-[#999999] px-[16px] text-[18px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
        />
        <p className="mt-[8px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
          Minimum ₦100 · Maximum ₦1,000,000
        </p>
        {error && (
          <p className="mt-[10px] text-[14px] leading-[18px] font-semibold text-[#FF0000]">
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
          {busy ? "Opening checkout…" : "Continue to Payment"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-[10px] h-[40px] w-full text-[16px] font-semibold text-[#6B6B6B]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function RowIcon({ icon, size = 30 }) {
  const px = size === 40 ? "h-[40px] w-[40px]" : "h-[30px] w-[30px]";
  if (icon === "withdraw") {
    return (
      <span
        className={`${px} flex flex-none items-center justify-center rounded-full bg-[#048B0B]`}
      >
        <img src={iconTransArrow} alt="" className="w-[21px]" />
      </span>
    );
  }
  const conf = {
    netflix: {
      bg: "bg-black",
      glyph: iconMovies,
      cls: "text-[#FF0000]",
      w: size === 40 ? "w-[22px]" : "w-[17px]",
      mt: "mt-[3px]",
    },
    spotify: {
      bg: "bg-[#46C04C]",
      glyph: iconMusic,
      cls: "",
      w: size === 40 ? "w-[23px]" : "w-[17px]",
      mt: "mt-[3px]",
    },
    youtube: {
      bg: "bg-[#FF0000]",
      glyph: iconMovies,
      cls: "text-white",
      w: size === 40 ? "w-[22px]" : "w-[17px]",
      mt: "mt-[2px]",
    },
    canva: {
      bg: "bg-gradient-to-b from-[#408EF9] to-[#4E0082]",
      glyph: iconProductivity,
      cls: "",
      w: size === 40 ? "w-[24px]" : "w-[18px]",
      mt: "mt-[3px]",
    },
    amazon: {
      bg: "",
      glyph: iconProductivity,
      cls: "",
      w: size === 40 ? "w-[24px]" : "w-[18px]",
      mt: "mt-[3px]",
      conic: true,
    },
  }[icon];
  return (
    <span
      className={`${px} flex flex-none items-center justify-center overflow-hidden rounded-full ${conf.bg}`}
      style={
        conf.conic
          ? { background: "conic-gradient(#DE00EA, #1884FF, #F50004, #DCEB00, #DE00EA)" }
          : undefined
      }
    >
      <img
        src={conf.glyph}
        alt=""
        className={`${conf.w} ${conf.cls} ${size === 30 ? conf.mt : ""}`}
      />
    </span>
  );
}

function QACard({ item, onFund }) {
  const inner = (
    <>
      <img src={QA_ICONS[item.icon]} alt="" className="mx-auto w-[30px]" />
      <p className="mt-[10px] text-center text-[15px] leading-[18px] font-semibold text-[#013104]">
        {item.label}
      </p>
    </>
  );
  if (item.key === "fund") {
    return (
      <button
        type="button"
        onClick={onFund}
        className="h-[100px] w-full cursor-pointer rounded-[10px] bg-white pt-[21px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
      >
        {inner}
      </button>
    );
  }
  return (
    <div className="h-[100px] rounded-[10px] bg-white pt-[21px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      {inner}
    </div>
  );
}

export default function Wallet() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [wallet, setWallet] = useState(null);
  const [txns, setTxns] = useState(null);
  const [txError, setTxError] = useState(false);
  const [limit, setLimit] = useState(7);
  const [fundOpen, setFundOpen] = useState(false);
  const [notice, setNotice] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const openDetail = async (id) => {
    if (!id) return;
    setDetailId(id);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    const { data, error } = await api(`/member/wallet/transactions/detail?id=${id}`);
    setDetailLoading(false);
    if (error) setDetailError(error.message || "Could not load this transaction.");
    else setDetail(data || {});
  };

  const fundingRef = searchParams.get("reference") || searchParams.get("trxref");
  const name = displayName(user) || "Marcus Saris";
  const since = fmtDay(user?.created_at) || "20/11/2026";
  const balance = wallet ? kobo2(wallet.wallet?.balance_kobo ?? wallet.balance_kobo) : "₦25,000.00";
  const rows = txns ? txns.map(mapTx) : null;

  useEffect(() => {
    let live = true;
    (async () => {
      const { data } = await api("/member/wallet");
      if (live && data) setWallet(data);
    })();
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error } = await api(`/member/wallet/transactions?limit=${limit}`);
      if (!live) return;
      if (error) setTxError(true);
      else setTxns(data?.transactions || []);
    })();
    return () => {
      live = false;
    };
  }, [limit]);

  // Returning from Paystack: confirm the funding and refresh the balance.
  useEffect(() => {
    if (!fundingRef) return;
    let live = true;
    (async () => {
      const { data, error } = await api(
        `/member/wallet/fundings?reference=${encodeURIComponent(fundingRef)}`,
      );
      if (!live) return;
      const f = data?.funding;
      if (error || !f) {
        setNotice({
          ok: false,
          text: "Could not confirm that payment. If you were charged, it will land shortly.",
        });
      } else if (f.status === "successful") {
        setNotice({ ok: true, text: `Wallet funded with ${kobo2(f.amount_kobo)}.` });
        const w = await api("/member/wallet");
        if (live && w.data) setWallet(w.data);
        const t = await api("/member/wallet/transactions?limit=7");
        if (live && !t.error) setTxns(t.data?.transactions || []);
      } else {
        setNotice({ ok: false, text: `Funding ${f.status}. No money left your account.` });
      }
    })();
    return () => {
      live = false;
    };
  }, [fundingRef]);

  const openFund = () => setFundOpen(true);

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <FundModal key={String(fundOpen)} open={fundOpen} onClose={() => setFundOpen(false)} />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px]">
          <Sidebar active="My Wallet" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Wallet
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Manage your balance, fund your wallet and track your transactions
            </p>
            <Notice notice={notice} />

            <div className="bg-btn relative mt-[50px] h-[346px] rounded-[20px] px-[32px] pt-[32px] pb-[32px]">
              <div className="flex h-[32px] items-center">
                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#048B0B]">
                  <img src={iconBalance} alt="" className="w-[18px]" />
                </span>
                <span className="ml-[8px] text-[18px] leading-[22px] font-semibold text-white">
                  Available Balance
                </span>
              </div>
              <div className="mt-[28px] flex items-center">
                <p className="text-[80px] leading-[98px] font-bold text-white">
                  {balance}
                </p>
                <span className="ml-[12px] flex h-[43px] w-[90px] items-center justify-center rounded-[14px] bg-[#048B0B] text-[25px] leading-[35px] font-semibold text-white">
                  NGN
                </span>
              </div>
              <p className="mt-[12px] text-[14px] leading-[20px] text-white">
                Ready for your next shared subscription.
              </p>
              <div className="mt-[32px] flex gap-[40px]">
                <button
                  type="button"
                  onClick={openFund}
                  className="flex h-[60px] w-[200px] items-center rounded-[10px] bg-[#F1F8F1] pl-[30px]"
                >
                  <span className="relative h-[18px] w-[28px] flex-none">
                    <img
                      src={iconFundArrow}
                      alt=""
                      className="absolute top-[2px] left-0 w-[15px]"
                    />
                    <img
                      src={iconFundPlus}
                      alt=""
                      className="absolute top-0 left-[10px] w-[18px]"
                    />
                  </span>
                  <span className="ml-[11px] text-[18px] font-semibold text-ink">
                    Add Fund
                  </span>
                </button>
                <button
                  type="button"
                  onClick={openFund}
                  className="flex h-[60px] w-[200px] items-center rounded-[10px] bg-[#048B0B] pl-[28px]"
                >
                  <span className="relative h-[30px] w-[36px] flex-none">
                    <img
                      src={iconPlusWhite}
                      alt=""
                      className="absolute top-[6px] left-0 w-[18px]"
                    />
                    <span className="absolute top-0 left-[6px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
                      <img
                        src={iconArrowInk}
                        alt=""
                        className="w-[15px] rotate-180"
                      />
                    </span>
                  </span>
                  <span className="ml-[10px] text-[18px] font-semibold text-white">
                    Add Fund
                  </span>
                </button>
              </div>
              <span className="absolute top-[71px] right-[32px] flex h-[112px] w-[112px] items-center justify-center rounded-full bg-white">
                <img src={iconHeroGlyph} alt="" className="w-[44px]" />
              </span>
            </div>

            <div className="bg-btn mt-[50px] rounded-[20px] pb-[40px]">
              <h2 className="mt-[40px] ml-[90px] text-[35px] leading-[43px] font-semibold text-white">
                Quick Actions
              </h2>
              <div className="mx-[30px] mt-[30px] grid grid-cols-4 gap-[10px]">
                {QA.map((q) => (
                  <QACard key={q.label} item={q} onFund={openFund} />
                ))}
              </div>
            </div>

            <div className="mt-[50px] rounded-[20px] bg-white pb-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <div className="flex items-start">
                <h2 className="mt-[40px] ml-[90px] text-[35px] leading-[43px] font-bold">
                  Transaction History
                </h2>
                <button
                  type="button"
                  onClick={() => setLimit(50)}
                  className="mt-[44px] mr-[30px] ml-auto text-[25px] leading-[35px] font-semibold text-[#048B0B]"
                >
                  View all
                </button>
              </div>
              <div className="relative mt-[40px] h-[50px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                <span className="absolute top-[13px] left-[30px]">Date &amp; Time</span>
                <span className="absolute top-[13px] left-[213px]">Description</span>
                <span className="absolute top-[13px] left-[397px]">Amount</span>
                <span className="absolute top-[13px] left-[567px]">Status</span>
              </div>
              {(rows || DESKTOP_ROWS).map((r, i) => (
                <div
                  key={r.key || i}
                  className={`relative h-[88px] ${r.id ? "cursor-pointer" : ""}`}
                  onClick={r.id ? () => openDetail(r.id) : undefined}
                  role={r.id ? "button" : undefined}
                  tabIndex={r.id ? 0 : undefined}
                  onKeyDown={r.id ? (e) => e.key === "Enter" && openDetail(r.id) : undefined}
                >
                  <span className="absolute top-[28px] left-[30px]">
                    <RowIcon icon={r.icon} />
                  </span>
                  <span className="absolute top-[33px] left-[67px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                    {r.date}
                  </span>
                  <span className="absolute top-[25px] left-[250px]">
                    <span className="block text-[18px] leading-[22px] font-semibold text-ink">
                      {r.desc}
                    </span>
                    <span className="-mt-[4px] block text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                      {r.sub}
                    </span>
                  </span>
                  <span className="absolute top-[33px] left-[440px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    {r.amount}
                  </span>
                  <span
                    className={`absolute top-[31px] left-[610px] flex h-[30px] w-[140px] items-center rounded-[10px] pl-[20px] ${PILL[r.status]}`}
                  >
                    <span className={`h-[8px] w-[8px] rounded-full ${DOT[r.status]}`} />
                    <span className="ml-[10px] text-[15px] leading-[18px] font-semibold">
                      {r.status}
                    </span>
                  </span>
                  <img
                    src={iconNavArrow}
                    alt=""
                    className="absolute top-[39px] right-[35px] w-[6px]"
                  />
                </div>
              ))}
              {txns && txns.length === 0 && (
                <p className="px-[30px] pt-[10px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No transactions yet. Fund your wallet to get started.
                </p>
              )}
              {txError && (
                <p className="px-[30px] pt-[10px] text-[18px] leading-[22px] font-semibold text-[#FF0000]">
                  Could not load transactions. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <div className="hidden xl:block">
        <Footer mt="mt-[29px]" />
      </div>

      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative bg-white px-[30px] pt-[30px] pb-[21px]">
          <div className="flex items-center gap-[6px]">
            <img
              src={user?.avatar_url || avatarAccount}
              alt={name}
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="text-[24.77px] leading-[28px] font-bold text-ink">
                {name}
              </p>
              <p className="text-[12.88px] leading-[20px] font-semibold text-[#6B6B6B]">
                Member on Clyse Since {since}
              </p>
            </div>
          </div>
          <div className="mt-[19px] flex h-[33px] items-center justify-center bg-white">
            <img src={chevronDown} alt="" className="w-[19px]" />
          </div>
        </div>

        <div className="relative mx-[30px] -mt-[1px] flex h-[50px] items-center bg-white">
          <span className="pl-[21px] text-[17.83px] font-semibold text-black">
            Service name
          </span>
          <img src={chevronRight} alt="" className="mr-[21px] ml-auto w-[24px]" />
        </div>

        <div className="relative mx-[30px] mt-[18px]">
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            Manage your balance, fund your wallet and track your transactions
          </p>
          <Notice notice={notice} />
        </div>

        <div className="bg-btn relative mt-[50px] px-[30px] pt-[32px] pb-[32px]">
          <div className="flex h-[32px] items-center">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#048B0B]">
              <img src={iconBalance} alt="" className="w-[18px]" />
            </span>
            <span className="ml-[8px] text-[18px] leading-[22px] font-semibold text-white">
              Available Balance
            </span>
          </div>
          <div className="relative mt-[28px] flex h-[37px] items-center">
            <p className="text-[30px] leading-[37px] font-bold text-white">
              {balance}
            </p>
            <span className="absolute top-[2px] left-[219px] flex h-[28px] w-[62px] items-center justify-center rounded-[9px] bg-[#048B0B] text-[13px] leading-[20px] font-semibold text-white">
              NGN
            </span>
          </div>
          <p className="mt-[5px] text-[14px] leading-[20px] text-white">
            Ready for your next shared subscription.
          </p>
          <div className="mt-[32px] space-y-[25px]">
            <button
              type="button"
              onClick={openFund}
              className="relative flex h-[60px] w-full items-center justify-center rounded-[6.94px] bg-[#F1F8F1]"
            >
              <img
                src={iconFundArrow}
                alt=""
                className="absolute left-[30px] w-[15px]"
              />
              <span className="flex items-center">
                <img src={iconFundPlus} alt="" className="w-[18px]" />
                <span className="ml-[12px] text-[18px] font-semibold text-ink">
                  Add Fund
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={openFund}
              className="relative flex h-[60px] w-full items-center justify-center rounded-[6.94px] bg-[#048B0B]"
            >
              <img
                src={iconPlusWhite}
                alt=""
                className="absolute left-[28px] w-[18px]"
              />
              <span className="flex items-center">
                <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
                  <img src={iconArrowInk} alt="" className="w-[15px] rotate-180" />
                </span>
                <span className="ml-[10px] text-[18px] font-semibold text-white">
                  Add Fund
                </span>
              </span>
            </button>
          </div>
          <span className="absolute top-[58px] right-[30px] flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white">
            <img src={iconHeroGlyph} alt="" className="w-[44px]" />
          </span>
        </div>

        <div className="bg-btn relative mt-[50px] pb-[40px]">
          <h2 className="mt-[40px] ml-[90px] text-[35px] leading-[43px] font-semibold text-white">
            Quick Actions
          </h2>
          <div className="mx-[30px] mt-[30px] grid grid-cols-2 gap-[10px]">
            {QA_MOBILE.map((q) => (
              <QACard key={q.label} item={q} onFund={openFund} />
            ))}
          </div>
        </div>

        <div className="relative mt-[50px] rounded-[20px] bg-white pt-[30px] pb-[30px]">
          <div className="flex items-start">
            <h2 className="ml-[30px] w-[249px] text-center text-[25px] leading-[35px] font-semibold">
              Transaction History
            </h2>
            <button
              type="button"
              onClick={() => setLimit(50)}
              className="mt-[6px] mr-[30px] ml-auto text-[18px] leading-[22px] font-semibold text-[#048B0B]"
            >
              View all
            </button>
          </div>
          <div className="mt-[30px] space-y-[15px]">
            {(rows || MOBILE_ROWS).map((r, i) => (
              <div
                key={r.key || i}
                className={`mx-[10px] h-[114px] px-[21px] pt-[17px] ${r.id ? "cursor-pointer" : ""}`}
                onClick={r.id ? () => openDetail(r.id) : undefined}
                role={r.id ? "button" : undefined}
                tabIndex={r.id ? 0 : undefined}
                onKeyDown={r.id ? (e) => e.key === "Enter" && openDetail(r.id) : undefined}
              >
                <div className="flex items-start">
                  <RowIcon icon={r.icon} size={40} />
                  <span className="ml-[12px]">
                    <span className="block text-[18px] leading-[22px] font-semibold text-black">
                      {r.desc}
                    </span>
                    <span className="block text-[13px] leading-[20px] font-semibold text-[#66726C]">
                      {r.sub}
                    </span>
                  </span>
                  <span className="ml-auto text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    {r.amount}
                  </span>
                </div>
                <div className="relative mt-[10px] h-[28px]">
                  <span className="absolute top-[4px] left-0 text-[13px] leading-[20px] font-semibold text-[#66726C]">
                    {r.date}
                  </span>
                  <span
                    className={`absolute top-0 right-0 flex h-[28px] w-[101px] items-center rounded-[14px] pl-[15px] ${PILL[r.status]}`}
                  >
                    <span className="text-[13px] leading-[20px] font-semibold">
                      {r.status}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {txns && txns.length === 0 && (
            <p className="px-[30px] pt-[10px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
              No transactions yet. Fund your wallet to get started.
            </p>
          )}
          {txError && (
            <p className="px-[30px] pt-[10px] text-[13px] leading-[20px] font-semibold text-[#FF0000]">
              Could not load transactions. Please try again.
            </p>
          )}
        </div>

        <div className="bg-mintband relative mt-[50px] rounded-[13.87px] pb-[16px]">
          <h2 className="pt-[15px] text-center text-[24.27px] leading-[30px] font-bold text-ink">
            Become an Owner
          </h2>
          <p className="mt-[21px] text-center text-[17.34px] leading-[25px] font-semibold text-ink">
            Save money by offering your subscription
          </p>
          <Link
            to="/create-group"
            className="bg-btn mx-auto mt-[21px] flex h-[50px] w-[200px] items-center justify-center rounded-[6.94px] text-[12.48px] font-semibold text-mint"
          >
            Create
          </Link>
          <img
            loading="lazy" decoding="async" src={ctaDash}
            alt=""
            className="mx-[28px] mt-[21px] aspect-[375/209] w-[calc(100%-56px)] max-w-[375px] object-cover"
          />
        </div>
      </main>
      <div className="xl:hidden">
        <MobileFooter />
      </div>
      {detailId && (
        <DetailModal
          title="Transaction details"
          onClose={() => setDetailId(null)}
          loading={detailLoading}
          error={detailError}
        >
          {detail?.transaction && (
            <>
              <DetailRow label="Description" value={detail.transaction.description || "—"} />
              <DetailRow label="Type" value={detail.transaction.type || detail.transaction.kind || "—"} />
              <DetailRow label="Status" value={detail.transaction.status || "—"} />
              <DetailRow
                label="Amount"
                value={kobo2(detail.transaction.amount_kobo ?? 0)}
              />
              <DetailRow label="Reference" value={detail.transaction.reference || "—"} />
              <DetailRow
                label="Date"
                value={fmtTx(detail.transaction.created_at) || "—"}
              />
              {(detail.entries || []).length > 0 && (
                <>
                  <p className="mt-[16px] mb-[6px] text-[15px] font-bold text-ink">
                    Ledger entries
                  </p>
                  {(detail.entries || []).map((e, i) => (
                    <DetailRow
                      key={`${e.account_type || ""}-${i}`}
                      label={(e.account_type || "entry").replace(/_/g, " ")}
                      value={kobo2(e.amount_kobo ?? 0)}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </DetailModal>
      )}
    </div>
  );
}
