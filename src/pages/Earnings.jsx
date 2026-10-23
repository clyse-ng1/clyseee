import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import { BlurBg } from "../components/Decor";
import DetailModal, { DetailRow } from "../components/DetailModal";
import { EarningTxRow, EarnMini, EarnSummaryMini, TX_DATE } from "../components/EarningRows";
import { api, brandOf, fmtDate, fmtTx, kobo2, nairaNum } from "../lib/api";
import iconNaira from "../assets/naira-green.svg";
import iconWallet from "../assets/wallet-box.svg";
import iconClock from "../assets/qa-clock.svg";
import iconCheck from "../assets/check-green-circle.svg";

const SUB = "Track your earnings, manage payouts and grow with Clyse.";

const MINIS = [
  { tile: "bg-[#DFFFE0]", glyph: iconNaira, label: "Total Earning", value: "124,000", sub: "All time", vdTo: "/earnings/per-group" },
  { tile: "bg-[#F2F1FF]", glyph: iconWallet, label: "Available Balance", value: "50,000", sub: "Available for Withdraw", vdTo: "/wallet" },
  { tile: "bg-[#FFEEE2]", glyph: iconClock, label: "Pending/Held", value: "40,000", sub: "Under Review", vdTo: "/earnings/per-member" },
  { tile: "bg-[#DFFFE0] xl:bg-[#DAFDDD]", glyph: iconCheck, label: "Withdrawn", value: "39,000", sub: "Last payout Apr 12, 2026", vdTo: "/wallet" },
];

const MONTHS = [
  { label: "January", width: "w-[84px] xl:w-[134px]", active: true },
  { label: "February", width: "w-[93px] xl:w-[146px]" },
  { label: "March", width: "w-[75px] xl:w-[121px]" },
  { label: "April", width: "w-[64px] xl:w-[106px]" },
  { label: "May", width: "w-[60px] xl:w-[101px]" },
  { label: "June", width: "w-[66px] xl:w-[108px]" },
  { label: "July", width: "w-[62px] xl:w-[100px]" },
];

/* Figma repeats the Adobe row twice (byte-identical); deduped to 4.
   Shown while the live lots load. */
const ROWS = [
  { brand: "adobe", name: "Adobe Creative Cloud", sub: "From Bank Transfer", mSub: "Group Subscription", earning: "N10,000.00", count: "12", date: TX_DATE, status: "Pending" },
  { brand: "amazon", name: "Amazon", sub: TX_DATE, mSub: "Group Subscription", earning: "N20,000.00", count: "20", date: TX_DATE, status: "Successful" },
  { brand: "capcut", name: "CapCut Pro", sub: TX_DATE, mSub: "Group Subscription", earning: "N50,000.00", count: "24", date: TX_DATE, status: "Successful" },
  { brand: "youtube", name: "YouTube Premium", sub: TX_DATE, mSub: "Group Subscription", earning: "N50,000.00", count: "32", date: TX_DATE, status: "Successful" },
];
const M_ROWS = ROWS;

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";

function mapLot(lot, groupById) {
  const g = groupById[lot.group_id] || {};
  const name = [g.service?.name, g.plan?.name].filter(Boolean).join(" ") || "Earning";
  return {
    key: lot.id,
    brand: brandOf(g.service),
    name,
    sub: fmtTx(lot.created_at),
    mSub: "Group Subscription",
    earning: kobo2(lot.amount_kobo),
    count: g.id != null ? String(g.occupied_slots ?? 0) : "—",
    date: fmtTx(lot.created_at),
    status: lot.status === "available" ? "Successful" : "Pending",
  };
}

function WithdrawModal({ open, onClose, earn, onDone }) {
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    if (!open) return;
    let live = true;
    (async () => {
      const { data } = await api("/member/bank-accounts");
      if (live) setAccounts(data || { accounts: [], payout_ready: false });
    })();
    return () => {
      live = false;
    };
  }, [open ]);

  if (!open) return null;

  const min = Math.max(1000, Math.round((earn?.min_payout_kobo ?? 100000) / 100));
  const avail = (earn?.available_kobo ?? 0) / 100;
  const naira = Number(String(amount).replace(/[^0-9.]/g, "")) || 0;
  const valid = naira >= min && naira <= avail && accounts?.payout_ready;
  const payout = accounts?.accounts?.find((a) => a.account_id === accounts?.payout_account_id)
    || accounts?.accounts?.find((a) => a.is_default)
    || accounts?.accounts?.[0];

  const withdraw = async () => {
    if (!valid || busy || !accounts?.payout_ready) return;
    setBusy(true);
    setError("");
    const { error: apiError } = await api("/member/earnings/withdraw", {
      method: "POST",
      body: { amount_kobo: Math.round(naira * 100) },
    });
    setBusy(false);
    if (apiError) {
      setError(
        apiError.code === "no_payout_account"
          ? "Add a verified bank account to receive payouts."
          : apiError.message || "Could not start the withdrawal. Please try again.",
      );
      return;
    }
    setDone(true);
    onDone();
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
        {done ? (
          <>
            <h3 className="text-[25px] leading-[30px] font-bold text-ink">
              Withdrawal started
            </h3>
            <p className="mt-[8px] text-[15px] leading-[20px] font-semibold text-[#6B6B6B]">
              Your payout is on its way to your bank account.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-[20px] h-[50px] w-full rounded-[10px] bg-[#048B0B] text-[18px] font-semibold text-white"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h3 className="text-[25px] leading-[30px] font-bold text-ink">
              Withdraw Earning
            </h3>
            <p className="mt-[8px] text-[15px] leading-[20px] font-semibold text-[#6B6B6B]">
              Available: {kobo2(earn?.available_kobo)} · Minimum ₦{min.toLocaleString("en-NG")}
            </p>
            {!accounts || accounts.payout_ready ? (
              <>
                {payout && (
                  <p className="mt-[12px] rounded-[10px] bg-[#F1F8F1] px-[16px] py-[12px] text-[14px] leading-[18px] font-semibold text-ink">
                    To: {payout.bank?.name} ···· {payout.account_last4}{" "}
                    <Link
                      to="/withdraw/select-bank"
                      state={{ from: "/earnings" }}
                      className="text-clyse"
                    >
                      Change
                    </Link>
                  </p>
                )}
                <label className="mt-[20px] block text-[15px] leading-[20px] font-semibold text-ink">
                  Amount (₦)
                </label>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  inputMode="decimal"
                  placeholder={String(min)}
                  className="mt-[8px] h-[50px] w-full rounded-[10px] border border-[#999999] px-[16px] text-[18px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
                />
                {error && (
                  <p className="mt-[10px] text-[14px] leading-[18px] font-semibold text-[#FF0000]">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  onClick={withdraw}
                  disabled={!valid || busy}
                  className={`mt-[20px] h-[50px] w-full rounded-[10px] text-[18px] font-semibold text-white ${
                    valid && !busy ? "bg-[#048B0B]" : "bg-[#999999]"
                  }`}
                >
                  {busy ? "Starting withdrawal…" : "Withdraw"}
                </button>
              </>
            ) : (
              <>
                <p className="mt-[12px] rounded-[10px] bg-[#FDE9E9] px-[16px] py-[12px] text-[14px] leading-[18px] font-semibold text-[#FF0000]">
                  Add a bank account first to receive payouts.
                </p>
                <Link
                  to="/withdraw/select-bank"
                  state={{ from: "/earnings" }}
                  className="mt-[20px] grid h-[50px] w-full place-items-center rounded-[10px] bg-[#048B0B] text-[18px] font-semibold text-white"
                >
                  Add Bank Account
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="mt-[10px] h-[40px] w-full text-[16px] font-semibold text-[#6B6B6B]"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MonthPills() {
  return (
    <div className="flex gap-[20px] overflow-x-auto">
      {MONTHS.map((m) => (
        <button
          key={m.label}
          className={`h-[44px] flex-none rounded-[10px] ${m.width} ${
            m.active ? "bg-[#B1DBB3]" : "border border-[#E6E6E6] bg-white"
          }`}
        >
          <span className="text-[18px] leading-[22px] font-semibold text-ink">
            {m.label}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function Earnings() {
  const [earn, setEarn] = useState(null);
  const [lots, setLots] = useState(null);
  const [lastPayout, setLastPayout] = useState(null);
  const [groupById, setGroupById] = useState({});
  const [wdOpen, setWdOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payout, setPayout] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState("");

  const openPayout = async () => {
    const id = lastPayout?.id || lastPayout?.payout_id;
    if (!id) return;
    setPayoutOpen(true);
    setPayout(null);
    setPayoutError("");
    setPayoutLoading(true);
    const { data, error } = await api(
      `/member/earnings/payouts/detail?payout_id=${id}`,
    );
    setPayoutLoading(false);
    if (error) setPayoutError(error.message || "Could not load this payout.");
    else setPayout(data || {});
  };

  useEffect(() => {
    let live = true;
    (async () => {
      const [e, l, p, g] = await Promise.all([
        api("/member/earnings"),
        api("/member/earnings/lots?limit=20"),
        api("/member/earnings/payouts?limit=1"),
        api("/member/groups"),
      ]);
      if (!live) return;
      if (e.data) setEarn(e.data);
      if (!l.error) setLots(l.data?.earnings || l.data?.lots || []);
      const payouts = p.data?.payouts || [];
      if (payouts.length) setLastPayout(payouts[0]);
      const map = {};
      for (const grp of g.data?.groups || []) map[grp.id] = grp;
      setGroupById(map);
    })();
    return () => {
      live = false;
    };
  }, [tick]);

  const minis = earn
    ? [
        { ...MINIS[0], value: nairaNum(earn.lifetime_earned_kobo) },
        { ...MINIS[1], value: nairaNum(earn.available_kobo) },
        {
          ...MINIS[2],
          value: nairaNum((earn.pending_kobo || 0) + (earn.on_hold_kobo || 0)),
        },
        {
          ...MINIS[3],
          value: nairaNum(earn.withdrawn_kobo),
          sub: lastPayout
            ? `Last payout ${fmtDate(lastPayout.completed_at || lastPayout.created_at)}`
            : "No payouts yet",
        },
      ]
    : MINIS;

  const rows = lots ? lots.map((l) => mapLot(l, groupById)) : ROWS;
  const total = earn ? nairaNum(earn.lifetime_earned_kobo) : "124,000";
  const fees = lots
    ? nairaNum(
        lots.reduce((s, l) => s + (groupById[l.group_id]?.plan?.platform_fee_kobo || 0), 0),
      )
    : "124,000";
  const empty = lots && lots.length === 0;

  const withdrawBtn =
    "bg-btn mt-[7px] grid h-[60px] place-items-center rounded-[10px] w-[748px]";

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <WithdrawModal
        key={String(wdOpen)}
        open={wdOpen}
        onClose={() => setWdOpen(false)}
        earn={earn}
        onDone={() => setTick((t) => t + 1)}
      />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="Earning" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Earnings
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className={`mt-[50px] rounded-[20px] bg-white px-[41px] pt-[51px] pb-[51px] ${SHADOW}`}>
              <div className="flex gap-[50px]">
                <EarnMini {...minis[0]} />
                <EarnMini {...minis[1]} />
              </div>
              <div className="mt-[7px] flex gap-[50px]">
                <EarnMini {...minis[2]} />
                <EarnMini {...minis[3]} onVd={lastPayout ? openPayout : undefined} />
              </div>
              <button
                type="button"
                onClick={() => setWdOpen(true)}
                className={`${withdrawBtn}`}
              >
                <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                  Withdraw
                </span>
              </button>
            </div>
            <div className={`mt-[50px] rounded-[20px] bg-white px-[41px] pt-[51px] pb-[51px] ${SHADOW}`}>
              <h2 className="text-[25px] leading-[30px] font-bold text-black">
                Earnings Summary
              </h2>
              <div className="mt-[35px] flex gap-[20px]">
                <EarnSummaryMini label="Earning Per Group" value={total} btnTo="/earnings/per-group" />
                <EarnSummaryMini label="Earning Per Member" value={total} btnTo="/earnings/per-member" />
              </div>
            </div>
            <h2 className="mt-[101px] ml-[41px] text-[25px] leading-[30px] font-bold text-black">
              Clyse Fees
            </h2>
            <div className="mt-[35px] ml-[41px]">
              <EarnMini
                tile="bg-[#DFFFE0]"
                glyph={iconNaira}
                label="Total Clyse Fees"
                value={fees}
                sub="For the selected period"
                vdTo="/earnings/per-group"
                wide
                dark
              />
            </div>
            <div className="mt-[20px] ml-[41px] w-[748px]">
              <MonthPills />
            </div>
            <div className="mt-[20px] ml-[30px]">
              {rows.map((r) => (
                <EarningTxRow key={r.key || r.name} {...r} />
              ))}
              {empty && (
                <p className="py-[20px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No earnings yet. Share a group to start earning.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M17 768:24019): 20px title, stacked full-bleed cards */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <h1 className="text-[20px] leading-[24px] font-bold text-black">
            Earnings
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
        </div>
        <div className={`relative mt-[70px] rounded-[20px] bg-white px-[31px] pt-[51px] pb-[51px] ${SHADOW}`}>
          <div className="flex flex-col gap-[50px]">
            <EarnMini {...minis[0]} />
            <EarnMini {...minis[1]} />
            <EarnMini {...minis[2]} />
            <EarnMini {...minis[3]} onVd={lastPayout ? openPayout : undefined} />
          </div>
          <button
            type="button"
            onClick={() => setWdOpen(true)}
            className="bg-btn mt-[7px] grid h-[60px] w-full place-items-center rounded-[10px]"
          >
            <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
              Withdraw
            </span>
          </button>
        </div>
        <div className={`relative mt-[50px] rounded-[20px] bg-white px-[31px] pt-[51px] pb-[51px] ${SHADOW}`}>
          <h2 className="text-[25px] leading-[30px] font-bold text-black">
            Earnings Summary
          </h2>
          <div className="mt-[30px] flex flex-col gap-[20px]">
            <EarnSummaryMini label="Earning Per Group" value={total} btnTo="/earnings/per-group" />
            <EarnSummaryMini label="Earning Per Member" value={total} btnTo="/earnings/per-member" />
          </div>
        </div>
        <div className={`relative mt-[50px] rounded-[20px] bg-white px-[31px] pt-[51px] pb-[51px] ${SHADOW}`}>
          <h2 className="text-[25px] leading-[30px] font-bold text-black">
            Clyse Fees
          </h2>
          <div className="mt-[30px]">
            <EarnMini
              tile="bg-[#DFFFE0]"
              glyph={iconNaira}
              label="Total Clyse Fees"
              value={fees}
              sub="For the selected period"
              vdTo="/earnings/per-group"
              wide
              dark
              noVd
            />
          </div>
          <div className="mt-[20px]">
            <MonthPills />
          </div>
          <Link to="/earnings/per-group" className="mt-[8px] ml-[198px] block text-[18px] leading-[22px] font-semibold text-clyse">
            View Details
          </Link>
        </div>
        <div className={`relative mt-[50px] rounded-[20px] bg-white pt-[30px] pb-[30px] ${SHADOW}`}>
          <div className="flex items-center px-[30px]">
            <h2 className="text-[18px] leading-[22px] font-bold text-ink">
              Payout History
            </h2>
            <span className="ml-auto text-[13px] leading-[16px] font-semibold text-clyse">
              View all
            </span>
          </div>
          <div className="mt-[30px] flex flex-col gap-[15px] px-[10px]">
            {(lots ? rows : M_ROWS).map((r, i) => (
              <EarningTxRow key={`${r.key || r.name}-${i}`} {...r} />
            ))}
            {empty && (
              <p className="px-[20px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No earnings yet. Share a group to start earning.
              </p>
            )}
          </div>
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
      {payoutOpen && (
        <DetailModal
          title="Payout details"
          onClose={() => setPayoutOpen(false)}
          loading={payoutLoading}
          error={payoutError}
        >
          {payout?.payout && (
            <>
              <DetailRow label="Status" value={payout.payout.status || "—"} />
              <DetailRow label="Amount" value={kobo2(payout.payout.amount_kobo ?? 0)} />
              <DetailRow
                label="Account"
                value={
                  payout.payout.account_last4
                    ? `···· ${payout.payout.account_last4}`
                    : "—"
                }
              />
              <DetailRow
                label="Requested"
                value={fmtDate(payout.payout.created_at) || "—"}
              />
              <DetailRow
                label="Completed"
                value={fmtDate(payout.payout.completed_at) || "—"}
              />
              {payout.payout.failure_reason && (
                <DetailRow label="Note" value={payout.payout.failure_reason} />
              )}
              {(payout.events || []).length > 0 && (
                <>
                  <p className="mt-[16px] mb-[6px] text-[15px] font-bold text-ink">
                    Events
                  </p>
                  {(payout.events || []).map((e, i) => (
                    <DetailRow
                      key={`${e.id || ""}-${i}`}
                      label={fmtDate(e.created_at) || e.event_type || "Event"}
                      value={e.event_type || "—"}
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
