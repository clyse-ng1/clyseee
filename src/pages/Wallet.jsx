import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sk from "../components/Skeleton";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import DetailModal, { DetailRow } from "../components/DetailModal";
import BrandTile from "../components/BrandTile";
import { api, brandOf, displayName, fmtDay, fmtTx, kobo2, titleCase } from "../lib/api";
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
import iconQaBolt from "../assets/qa-bolt.svg";
import ExtraBlock from "../components/ExtraBlock";
import iconMovies from "../assets/glyph-movies.svg";
import iconMusic from "../assets/glyph-music.svg";
import iconProductivity from "../assets/glyph-productivity.svg";
import iconNavArrow from "../assets/nav-arrow.svg";
import { MemberMenuButton } from "../components/MemberMini";
import avatarAccount from "../assets/avatar-account.webp";
import ctaDash from "../assets/cta-dash.webp";
import chevronRight from "../assets/angle-right.svg";

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

const MONEY_ICONS = new Set(["funding", "subscription", "withdraw"]);

const TX_ICONS = new Set([
  "netflix", "spotify", "youtube", "canva", "amazon", "prime", "adobe", "capcut", "apple",
]);

/* Every subscription row used to render the same green arrow because the only
   thing the API gave us was "Join group" — nothing brandable. The row now takes
   the service straight off the matched group when the payload carries a
   group_id, and otherwise looks at any service/description field it can find.
   Figma's rows are titled with the service ("Netflix Premium"), not the ledger
   verb, so the service name is returned alongside the brand key. */
function serviceFromTx(t, groupById) {
  /* group_payment rows carry the group only in metadata.group_id — without it
     every join row stayed generic even though the service was known. */
  const g =
    groupById?.[
      t.group_id || t.groupId || t.metadata?.group_id || t.metadata?.groupId || ""
    ];
  const fromGroup = g?.service || t.service || t.group?.service || null;
  if (fromGroup?.name || fromGroup?.slug) {
    const brand = brandOf(fromGroup);
    return {
      brand: brand && TX_ICONS.has(brand) ? brand : null,
      name: fromGroup.name || titleCase(fromGroup.slug || ""),
      category: fromGroup.category || g?.category || "",
    };
  }
  const candidates = [t.service_name, t.service, t.description, t.reference].filter(Boolean);
  for (const c of candidates) {
    const b = brandOf({ name: String(c) });
    if (b && TX_ICONS.has(b)) return { brand: b, name: String(c), category: "" };
  }
  return null;
}

function mapTx(t, groupById) {
  const kind = (t.kind || "").toLowerCase();
  const funding = kind === "wallet_funding";
  const withdrawal = /withdraw|payout/.test(kind);
  const svc = funding || withdrawal ? null : serviceFromTx(t, groupById);
  /* Figma titles the row with the service; the raw "Join group" ledger text
     only survives when the group could not be resolved. */
  const desc = funding
    ? "Wallet Funding"
    : svc?.name || t.description || "Group Subscription";
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
  /* Only a real payout is a "withdraw"; a subscription debit with no brandable
     service gets a neutral subscription tile instead of the same money-out
     arrow, which read like a withdrawal on every row. */
  /* "service" = a subscription whose service Figma has no brand card for
     (DStv, Microsoft 365). BrandTile paints those with the category glyph on
     Figma's black disc, same as the browse cards. */
  const icon = funding
    ? "funding"
    : withdrawal
      ? "withdraw"
      : svc
        ? svc.brand || "service"
        : "subscription";
  return {
    key: t.id || t.reference,
    id: t.id || null,
    date: fmtTx(t.created_at),
    desc,
    sub,
    amount,
    status,
    icon,
    category: svc?.category || "",
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

function FundModal({ open, onClose, onFunded }) {
  const [amount, setAmount] = useState("");
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
        callback_url: `${window.location.origin}/wallet`,
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

function RowIcon({ icon, size = 30 }) {
  const px = size === 40 ? "h-[40px] w-[40px]" : "h-[30px] w-[30px]";
  /* Figma 481:11028 paints funding as a solid #048B0B disc with a white
     down-arrow — the same shape family as the withdraw arrow, mirrored. */
  if (icon === "funding") {
    return (
      <span
        className={`${px} flex flex-none items-center justify-center rounded-full bg-clyse`}
      >
        <svg
          width={size === 40 ? 20 : 15}
          height={size === 40 ? 20 : 15}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M10 3.5v11M5.5 10.5 10 15l4.5-4.5"
            stroke="#FFFFFF"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (icon === "subscription") {
    return (
      <span
        className={`${px} flex flex-none items-center justify-center rounded-full bg-[#DFFFE0]`}
      >
        <svg
          width={size === 40 ? 20 : 15}
          height={size === 40 ? 20 : 15}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="16" height="12" rx="2.5" stroke="#048B0B" strokeWidth="1.7" />
          <path d="M2 8h16" stroke="#048B0B" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </span>
    );
  }
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

/* Loading stand-ins (shimmer, never mock content). */
function TxRowSk() {
  return (
    <div className="relative h-[111px]">
      <Sk className="absolute top-[20px] left-[30px] h-[70px] w-[70px] !rounded-full" />
      <Sk className="absolute top-[28px] left-[122px] h-[20px] w-[180px]" />
      <Sk className="absolute top-[58px] left-[122px] h-[14px] w-[130px]" />
      <Sk className="absolute top-[42px] left-[380px] h-[14px] w-[110px]" />
      <Sk className="absolute top-[42px] left-[548px] h-[18px] w-[110px]" />
      <Sk className="absolute top-[33px] left-[680px] h-[40px] w-[120px] !rounded-[10px]" />
    </div>
  );
}

function MobileTxRowSk() {
  return (
    <div className="mx-[10px] h-[114px] px-[21px] pt-[17px]">
      <div className="flex items-start">
        <Sk className="h-[40px] w-[40px] !rounded-full" />
        <span className="ml-[12px]">
          <Sk className="h-[20px] w-[150px]" />
          <Sk className="mt-[6px] h-[14px] w-[110px]" />
        </span>
        <Sk className="ml-auto h-[20px] w-[90px]" />
      </div>
      <div className="relative mt-[10px] h-[28px]">
        <Sk className="absolute top-[6px] left-0 h-[14px] w-[130px]" />
        <Sk className="absolute top-0 right-0 h-[28px] w-[101px] !rounded-[14px]" />
      </div>
    </div>
  );
}

export default function Wallet() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [wallet, setWallet] = useState(null);
  const [walletFailed, setWalletFailed] = useState(false);
  const [txns, setTxns] = useState(null);
  const [groupById, setGroupById] = useState({});
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
  const balance = wallet ? kobo2(wallet.wallet?.balance_kobo ?? wallet.balance_kobo) : "\u2014";
  const rows = txns ? txns.map((t) => mapTx(t, groupById)) : null;

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error } = await api("/member/wallet");
      if (!live) return;
      if (error) setWalletFailed(true);
      else if (data) setWallet(data);
    })();
    return () => {
      live = false;
    };
  }, []);

  /* Service names for the transaction rows. A "Join group" debit points at
     somebody else's group, so the member's own list is not enough — the public
     catalogue fills the rest, which is what puts a brand disc on every row
     (bug 28 asked for exactly that). */
  useEffect(() => {
    let live = true;
    (async () => {
      const own = await api("/member/groups");
      const pub = await api("/catalogue/groups?limit=50", { auth: false });
      if (!live) return;
      const map = {};
      for (const g of pub.data?.groups || []) {
        const id = g.group_id || g.id;
        if (id) map[id] = g;
      }
      for (const g of own.data?.groups || []) if (g?.id) map[g.id] = g;
      setGroupById(map);
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

  const completeSimulatedFunding = async (amountKobo) => {
    setFundOpen(false);
    setNotice({ ok: true, text: `Wallet funded with ${kobo2(amountKobo)} (simulation).` });
    const [w, t] = await Promise.all([
      api("/member/wallet"),
      api(`/member/wallet/transactions?limit=${limit}`),
    ]);
    if (w.data) setWallet(w.data);
    if (!t.error) setTxns(t.data?.transactions || []);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <FundModal key={String(fundOpen)} open={fundOpen} onClose={() => setFundOpen(false)} onFunded={completeSimulatedFunding} />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px] pt-[101px]">
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
                  {wallet || walletFailed ? (
                    balance
                  ) : (
                    <Sk light className="h-[90px] w-[320px]" />
                  )}
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
                  className="flex h-[60px] w-[223px] items-center justify-center rounded-[10px] bg-[#048B0B]"
                >
                  {/* Card 27: the white circled arrow read wrong — plain label. */}
                  <span className="whitespace-nowrap text-[18px] font-semibold text-white">
                    Withdraw Fund
                  </span>
                </button>
              </div>
              <span className="absolute top-[71px] right-[32px] flex h-[112px] w-[112px] items-center justify-center rounded-full bg-white">
                <img src={iconHeroGlyph} alt="" className="w-[44px]" />
              </span>
            </div>

            <div className="bg-btn mt-[50px] h-[253px] rounded-[20px] pb-[40px]">
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
              {/* Figma 889:80439 table header: Group (20/700 black) first, then
                  16/600 grey Date & Time / Amount / Status at x 380 / 514 / 689. */}
              <div className="relative mt-[38px] h-[70px]">
                <span className="absolute top-[17px] left-[30px] text-[20px] leading-[35px] font-bold text-black">
                  Group
                </span>
                <span className="absolute top-[24px] left-[380px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Date &amp; Time
                </span>
                <span className="absolute top-[24px] left-[548px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Amount
                </span>
                <span className="absolute top-[24px] left-[689px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Status
                </span>
              </div>
              {!rows && !txError ? (
                [0, 1, 2, 3, 4, 5, 6].map((i) => <TxRowSk key={i} />)
              ) : (
                (rows || []).map((r, i) => (
                <div
                  key={r.key || i}
                  className={`relative h-[111px] ${r.id ? "cursor-pointer" : ""}`}
                  onClick={r.id ? () => openDetail(r.id) : undefined}
                  role={r.id ? "button" : undefined}
                  tabIndex={r.id ? 0 : undefined}
                  onKeyDown={r.id ? (e) => e.key === "Enter" && openDetail(r.id) : undefined}
                >
                  <span className="absolute top-[20px] left-[30px] flex h-[70px] w-[70px] items-center">
                    {MONEY_ICONS.has(r.icon) ? (
                      <span className="flex h-[70px] w-[70px] items-center">
                        <RowIcon icon={r.icon} size={40} />
                      </span>
                    ) : (
                      <BrandTile
                        brand={r.icon === "service" ? null : r.icon}
                        name={r.desc}
                        category={r.category}
                        size={70}
                        plain
                      />
                    )}
                  </span>
                  <span className="absolute top-[28px] left-[122px] block w-[250px] truncate text-[20px] leading-[26px] font-bold text-ink">
                    {r.desc}
                  </span>
                  <span className="absolute top-[58px] left-[122px] block w-[250px] truncate text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                    {r.sub}
                  </span>
                  <span className="absolute top-[42px] left-[380px] w-[152px] text-[14px] leading-[18px] font-semibold text-[#6B6B6B]">
                    {r.date}
                  </span>
                  <span className="absolute top-[42px] left-[548px] text-[18px] leading-[22px] font-semibold whitespace-nowrap text-ink">
                    {r.amount}
                  </span>
                  <span
                    className={`absolute top-[33px] left-[680px] flex h-[40px] w-[120px] items-center rounded-[10px] pl-[16px] ${PILL[r.status]}`}
                  >
                    <span className={`h-[10px] w-[10px] flex-none rounded-full ${DOT[r.status]}`} />
                    <span className="ml-[8px] text-[14px] leading-[17px] font-semibold">
                      {r.status}
                    </span>
                  </span>
                </div>
                ))
              )}
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
      </div>

      {/* Mobile */}
      <main className="relative bg-white xl:hidden">
        <div className="relative mx-[30px] mt-[30px]">
          <h1 className="text-[25px] leading-[32px] font-bold text-black">Wallet</h1>
          <p className="mt-[3px] text-[14px] leading-[20px] font-semibold text-[#6B6B6B]">
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
              {wallet || walletFailed ? (
                balance
              ) : (
                <Sk light className="h-[34px] w-[180px]" />
              )}
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
              <span className="text-[18px] font-semibold whitespace-nowrap text-white">
                Withdraw Fund
              </span>
            </button>
          </div>
          <span className="absolute top-[58px] right-[30px] flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white">
            <img src={iconHeroGlyph} alt="" className="w-[44px]" />
          </span>
        </div>

        <div className="bg-btn relative mt-[50px] pb-[40px]">
          <div className="flex items-center gap-[20px] px-[30px] pt-[40px]">
            <img src={iconQaBolt} alt="" className="h-[40px] w-[40px] flex-none" />
            <h2 className="text-[35px] leading-[43px] font-semibold text-white">
              Quick Actions
            </h2>
          </div>
          <div className="mx-[30px] mt-[30px] grid grid-cols-2 gap-[10px]">
            {QA_MOBILE.map((q) => (
              <QACard key={q.label} item={q} onFund={openFund} />
            ))}
          </div>
        </div>

        <div className="relative mt-[50px] rounded-[20px] bg-white pt-[30px] pb-[30px]">
          <div className="flex items-start">
            <h2 className="ml-[30px] text-[23px] leading-[32px] font-semibold whitespace-nowrap">
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
            {!rows && !txError ? (
              [0, 1, 2, 3, 4, 5, 6].map((i) => <MobileTxRowSk key={i} />)
            ) : (
              (rows || []).map((r, i) => (
              <div
                key={r.key || i}
                className={`mx-[10px] rounded-[12px] border border-clyse bg-white px-[16px] py-[16px] shadow-[0_0_13.87px_rgba(0,23,1,0.06)] ${
                  r.id ? "cursor-pointer" : ""
                }`}
                onClick={r.id ? () => openDetail(r.id) : undefined}
                role={r.id ? "button" : undefined}
                tabIndex={r.id ? 0 : undefined}
                onKeyDown={r.id ? (e) => e.key === "Enter" && openDetail(r.id) : undefined}
              >
                <div className="flex items-start">
                  {MONEY_ICONS.has(r.icon) ? (
                    <RowIcon icon={r.icon} size={40} />
                  ) : (
                    <BrandTile
                      brand={r.icon === "service" ? null : r.icon}
                      name={r.desc}
                      category={r.category}
                      size={40}
                      plain
                    />
                  )}
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
                <div className="relative mt-[12px] flex items-center justify-between">
                  <span className="text-[13px] leading-[20px] font-semibold text-[#66726C]">
                    {r.date}
                  </span>
                  <span
                    className={`flex h-[28px] w-[101px] items-center justify-center rounded-[14px] ${PILL[r.status]}`}
                  >
                    <span className="text-[13px] leading-[20px] font-semibold">
                      {r.status}
                    </span>
                  </span>
                </div>
              </div>
              ))
            )}
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

        {/* Figma WALLET MOBILE PAGE 481:11028 closes on the standard two-row
            extra block (View Available Group / Create Group), not the owner card. */}
        <ExtraBlock mobile className="mt-[50px]" />
      </main>
      <div className="xl:hidden">
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
