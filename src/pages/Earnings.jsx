import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MobileBack } from "../components/MemberMini";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import { BlurBg } from "../components/Decor";
import DetailModal, { DetailRow } from "../components/DetailModal";
import { EarningTxRow, EarningTxRowSk, EarnMini, EarnMiniSk, EarnSummaryMini, EarnSummaryMiniSk } from "../components/EarningRows";
import { api, brandOf, fmtDate, fmtTx, kobo2, nairaNum } from "../lib/api";
import iconNaira from "../assets/naira-green.svg";
import iconWallet from "../assets/wallet-box.svg";
import iconClock from "../assets/qa-clock.svg";
import iconCheck from "../assets/check-green-circle.svg";

const SUB = "Track your earnings, manage payouts and grow with Clyse.";

/* All four tiles share the mint/green treatment — the PM flagged the
   green / lavender / peach mix as "wrong colours, redesign". */
const TILE = "bg-[#DFFFE0]";
const MINIS = [
  { tile: TILE, glyph: iconNaira, label: "Total Earning", value: "\u2014", sub: "All time", vdTo: "/earnings/per-group" },
  { tile: TILE, glyph: iconWallet, label: "Available Balance", value: "\u2014", sub: "Available for Withdraw", vdTo: "/wallet" },
  { tile: TILE, glyph: iconClock, label: "Pending/Held", value: "\u2014", sub: "Under Review", vdTo: "/earnings/per-member" },
  { tile: TILE, glyph: iconCheck, label: "Withdrawn", value: "\u2014", sub: "\u2014", vdTo: "/wallet" },
];

const MONTHS = [
  { label: "January", active: true },
  { label: "February" },
  { label: "March" },
  { label: "April" },
  { label: "May" },
  { label: "June" },
  { label: "July" },
];


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
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
                  inputMode="numeric"
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

function MonthPills({ small = false }) {
  return (
    <div
      className={`scrollbar-none flex gap-[10px] pb-[2px] ${
        small ? "flex-wrap" : "overflow-x-auto"
      }`}
    >
      {MONTHS.map((m) => (
        <button
          key={m.label}
          className={`flex-none rounded-[10px] whitespace-nowrap outline-none focus:outline-none ${
            small ? "h-[34px] px-[14px]" : "h-[44px] px-[20px]"
          } ${
            m.active
              ? "border border-clyse bg-[#B1DBB3]"
              : "border border-[#D9D9D9] bg-white"
          }`}
        >
          <span
            className={`font-semibold text-ink ${
              small ? "text-[13px] leading-[18px]" : "text-[18px] leading-[22px]"
            }`}
          >
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
  const [failed, setFailed] = useState(false);
  const [lastPayout, setLastPayout] = useState(null);
  const [groupById, setGroupById] = useState({});
  const [wdOpen, setWdOpen] = useState(false);
  const [tick, setTick] = useState(0);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payout, setPayout] = useState(null);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutError, setPayoutError] = useState("");
  /* While the temporary simulator is on, a withdrawal stays `pending` until the
     owner confirms it: POST /member/payments/payout/simulate { payout_id }.
     Nothing in the app called that endpoint, so a simulated payout could never
     reach `successful`. */
  const [simBusy, setSimBusy] = useState(false);
  const [simMsg, setSimMsg] = useState("");

  const confirmSimPayout = async () => {
    const id = payout?.payout?.id || lastPayout?.id;
    if (!id || simBusy) return;
    setSimBusy(true);
    setSimMsg("");
    const { data, error } = await api("/member/payments/payout/simulate", {
      method: "POST",
      body: { payout_id: id },
    });
    setSimBusy(false);
    if (error) {
      setSimMsg(
        error.code === "simulation_disabled"
          ? "Simulation is off — real payouts settle by webhook."
          : error.message || "Could not confirm this payout.",
      );
      return;
    }
    setSimMsg(data?.message || "Simulated payout confirmed.");
    openPayout();
  };

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
      if (e.error || l.error) setFailed(true);
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

  const rows = (lots || []).map((l) => mapLot(l, groupById));
  const total = earn ? nairaNum(earn.lifetime_earned_kobo) : "\u2014";
  const fees = lots
    ? nairaNum(
        lots.reduce((s, l) => s + (groupById[l.group_id]?.plan?.platform_fee_kobo || 0), 0),
      )
    : "\u2014";
  const empty = lots && lots.length === 0;

  const withdrawBtn =
    "bg-btn mt-[7px] grid h-[60px] place-items-center rounded-[10px] w-[748px]";

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma BLUR BG at page level so the mobile branch gets it too. */}
      <BlurBg variant="hero" />
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
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="Earning" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Earnings
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            <div className={`mt-[50px] rounded-[20px] bg-white px-[41px] pt-[51px] pb-[51px] ${SHADOW}`}>
              {!earn && !failed ? (
                <>
                  <div className="flex gap-[50px]">
                    <EarnMiniSk vdTo="/earnings/per-group" />
                    <EarnMiniSk vdTo="/wallet" />
                  </div>
                  <div className="mt-[7px] flex gap-[50px]">
                    <EarnMiniSk vdTo="/earnings/per-member" />
                    <EarnMiniSk vdTo="/wallet" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-[50px]">
                    <EarnMini {...minis[0]} />
                    <EarnMini {...minis[1]} />
                  </div>
                  <div className="mt-[7px] flex gap-[50px]">
                    <EarnMini {...minis[2]} />
                    <EarnMini {...minis[3]} onVd={lastPayout ? openPayout : undefined} />
                  </div>
                </>
              )}
              <Link to="/withdraw/amount" className={`${withdrawBtn}`}>
                <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
                  Withdraw
                </span>
              </Link>
            </div>
            <div className={`mt-[50px] rounded-[20px] bg-white px-[41px] pt-[51px] pb-[51px] ${SHADOW}`}>
              <h2 className="text-[25px] leading-[30px] font-bold text-black">
                Earnings Summary
              </h2>
              <div className="mt-[35px] flex gap-[20px]">
                {!earn && !failed ? (
                  <>
                    <EarnSummaryMiniSk label="Earning Per Group" btnTo="/earnings/per-group" />
                    <EarnSummaryMiniSk label="Earning Per Member" btnTo="/earnings/per-member" />
                  </>
                ) : (
                  <>
                    <EarnSummaryMini label="Earning Per Group" value={total} btnTo="/earnings/per-group" />
                    <EarnSummaryMini label="Earning Per Member" value={total} btnTo="/earnings/per-member" />
                  </>
                )}
              </div>
            </div>
            {/* Card: "remove clyse fees section" — the block is gone. */}
            <div className="mt-[20px] ml-[30px]">
              {!lots && !failed ? (
                [0, 1, 2, 3].map((i) => <EarningTxRowSk key={i} />)
              ) : (
                rows.map((r) => <EarningTxRow key={r.key || r.name} {...r} />)
              )}
              {empty && (
                <p className="py-[20px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  No earnings yet. Share a group to start earning.
                </p>
              )}
              {failed && (
                <p className="py-[20px] text-[18px] leading-[22px] font-semibold text-[#FF0000]">
                  Could not load earnings. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M17 768:24019): 20px title, stacked full-bleed cards */}
      <main className="relative xl:hidden">
        <div className="relative px-[30px] pt-[46px] pb-[30px]">
          <MobileBack />
          <h1 className="text-[35px] leading-[43px] font-bold text-black">
            Earnings
          </h1>
          <p className="mt-[4px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
        </div>
        <div className={`relative mt-[30px] rounded-[20px] bg-white px-[31px] pt-[51px] pb-[51px] ${SHADOW}`}>
          <div className="flex flex-col gap-[50px]">
            {!earn && !failed ? (
              <>
                <EarnMiniSk vdTo="/earnings/per-group" />
                <EarnMiniSk vdTo="/wallet" />
                <EarnMiniSk vdTo="/earnings/per-member" />
                <EarnMiniSk vdTo="/wallet" />
              </>
            ) : (
              <>
                <EarnMini {...minis[0]} />
                <EarnMini {...minis[1]} />
                <EarnMini {...minis[2]} />
                <EarnMini {...minis[3]} onVd={lastPayout ? openPayout : undefined} />
              </>
            )}
          </div>
          <Link
            to="/withdraw/amount"
            className="bg-btn mt-[14px] grid h-[56px] w-full place-items-center rounded-[10px]"
          >
            <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
              Withdraw
            </span>
          </Link>
        </div>
        <div className={`relative mt-[30px] rounded-[20px] bg-white px-[20px] pt-[24px] pb-[24px] ${SHADOW}`}>
          <h2 className="text-[22px] leading-[28px] font-bold text-black">
            Earnings Summary
          </h2>
          <div className="mt-[30px] flex flex-col gap-[20px]">
            {!earn && !failed ? (
              <>
                <EarnSummaryMiniSk label="Earning Per Group" btnTo="/earnings/per-group" />
                <EarnSummaryMiniSk label="Earning Per Member" btnTo="/earnings/per-member" />
              </>
            ) : (
              <>
                <EarnSummaryMini label="Earning Per Group" value={total} btnTo="/earnings/per-group" />
                <EarnSummaryMini label="Earning Per Member" value={total} btnTo="/earnings/per-member" />
              </>
            )}
          </div>
        </div>
        {/* Card: "remove clyse fees section" — the block is gone. */}
        <div className={`relative mt-[24px] rounded-[20px] bg-white pt-[24px] pb-[24px] ${SHADOW}`}>
          <div className="flex items-center px-[30px]">
            <h2 className="text-[18px] leading-[22px] font-bold text-ink">
              Payout History
            </h2>
            <Link
              to="/wallet"
              className="ml-auto text-[13px] leading-[16px] font-semibold text-clyse"
            >
              View all
            </Link>
          </div>
          <div className="mt-[30px] flex flex-col gap-[15px] px-[10px]">
            {!lots && !failed ? (
              [0, 1, 2, 3].map((i) => <EarningTxRowSk key={i} />)
            ) : (
              rows.map((r, i) => (
                <EarningTxRow key={`${r.key || r.name}-${i}`} {...r} />
              ))
            )}
            {empty && (
              <p className="px-[20px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No earnings yet. Share a group to start earning.
              </p>
            )}
            {failed && (
              <p className="px-[20px] text-[13px] leading-[20px] font-semibold text-[#FF0000]">
                Could not load earnings. Please try again.
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
              {`${payout.payout.status || ""}`.toLowerCase() === "pending" && (
                <button
                  type="button"
                  onClick={confirmSimPayout}
                  disabled={simBusy}
                  className="mt-[16px] flex h-[46px] w-full items-center justify-center rounded-[10px] bg-btn text-[15px] font-semibold text-white disabled:opacity-50"
                >
                  {simBusy ? "Confirming…" : "Confirm simulated payout"}
                </button>
              )}
              {simMsg && (
                <p className="mt-[8px] text-[13px] font-semibold text-[#6B6B6B]">{simMsg}</p>
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
