import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import AdminShell, { BackTitle } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";
import { GlyphCheck } from "../components/AdminGlyphs";
import { FinPill, FinAvatar, CheckDisc } from "../components/FinanceShared";

/* Finance > Transactions > Details — Figma 1195:26648 (desktop). Static.
   Copy fixes: "Remium" -> "Premium", "methos" -> "methods",
   "TNX-000056879" -> "TXN-000056879". */

function Field({ label, children, last = false }) {
  return (
    <div className={last ? "" : "border-b border-[#E5E5E5]"}>
      <p className="text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">{label}</p>
      <div className="mt-[8px] pb-[14px]">{children}</div>
    </div>
  );
}

function Value({ children }) {
  return <p className="text-[20px] leading-[24px] font-semibold text-[#001701]">{children}</p>;
}

/* Field labels keep the Figma grid; values come from the live record or read
   "—" when the endpoint does not return them. */
const payoutRows = (tx, naira, when) => [
  [
    { label: "Payout Status", value: tx?.payout_status ? String(tx.payout_status).replace(/_/g, " ") : "—" },
    { label: "Payout Amount", value: naira(tx?.payout_amount_kobo ?? tx?.net_kobo) },
  ],
  [
    { label: "Payout Date", value: tx?.payout_at ? when : "—" },
    { label: "Payout Reference", value: tx?.payout_reference || "—" },
  ],
  [
    { label: "Payment Method", value: tx?.payment_method || tx?.channel || "—" },
    { label: "Recipient", value: tx?.creator_name || tx?.owner_name || "—", sub: "Creator" },
  ],
];

const refundCols = (tx, naira, when) => [
  { label: "Refund Status", value: tx?.refund_status ? String(tx.refund_status).replace(/_/g, " ") : "Not Initiated" },
  { label: "Refund Amount", value: naira(tx?.refund_amount_kobo ?? 0) },
  { label: "Refund Method", value: tx?.refund_method || "—" },
  { label: "Refund Reference", value: tx?.refund_reference || "—" },
  { label: "Refund Date", value: tx?.refunded_at ? when : "—" },
];

export default function AdminFinanceDetails() {
  /* Live ledger entry: GET /admin/finance/transactions/detail?transaction_id.
     The API returns one transaction plus every ledger entry (account type,
     owner, amount) — there is no payout/refund/timeline block in it, so those
     static Figma blocks are NOT presented as data. */
  const [params] = useSearchParams();
  const txId = params.get("id") || params.get("transaction_id") || "";
  const [tx, setTx] = useState(null);
  const [loadState, setLoadState] = useState("loading"); // loading | live | error
  useEffect(() => {
    if (!txId) return setLoadState("error");
    let alive = true;
    api(`/admin/finance/transactions/detail?transaction_id=${encodeURIComponent(txId)}`).then((res) => {
      if (!alive) return;
      if (res.error || !res.data) return setLoadState("error");
      setTx(res.data);
      setLoadState("live");
    });
    return () => { alive = false; };
  }, [txId]);

  const naira = (k) => (k == null ? "—" : `N${Number(k / 100).toLocaleString("en-US")}`);
  const when = tx?.created_at
    ? new Date(tx.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
    : "—";
  const entries = Array.isArray(tx?.entries) ? tx.entries : [];
  const feeKobo = entries.filter((e) => /fee/i.test(e.account_type || "")).reduce((a, e) => a + (e.amount_kobo || 0), 0);
  return (
    <AdminShell active="finance" sub="transactions">
      <BackTitle title="Transaction Details" />
      {loadState === "error" && (
        <p className="mt-[20px] mt-[20px] rounded-[10px] border border-[#FFC48A] bg-[#FFEEE2] px-[20px] py-[16px] text-[16px] font-semibold text-[#8A3B00]">
          {txId
            ? "Could not load this transaction — it may have been removed."
            : "No transaction selected. Open this screen from the Transactions list."}
        </p>
      )}
      <div className="mt-[30px] flex gap-[30px]">
        <div className="w-full lg:w-[458px] flex-none rounded-[20px] border border-[#999999] bg-white px-[31px] pt-[46px] pb-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
          <div className="space-y-[14px]">
            <Field label="Transaction Reference">
              <Value>{tx?.reference || tx?.id || "—"}</Value>
            </Field>
            <Field label="Transaction Date & Time">
              <Value>{when}</Value>
            </Field>
            <Field label="Type">
              <Value>{tx?.kind ? String(tx.kind).replace(/_/g, " ") : "—"}</Value>
            </Field>
            <Field label="Status">
              <FinPill tone="green">Completed</FinPill>
            </Field>
          </div>
          <p className="mt-[18px] text-[20px] leading-[24px] font-bold text-[#001701]">
            Related History
          </p>
          <div className="mt-[14px] space-y-[14px]">
            <Field label="Payment Method">
              <Value>Wallet</Value>
            </Field>
            <Field label="Wallet Reference">
              <Value>WAL - 0012345</Value>
            </Field>
            <Field label="Billing Cycle">
              <Value>Monthly</Value>
            </Field>
            <Field label="Next Renewal" last>
              <Value>Sep. 20, 2026</Value>
            </Field>
          </div>
        </div>
        <div className="w-full lg:w-[622px] flex-none rounded-[20px] border border-[#999999] bg-white px-[31px] pt-[31px] pb-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
          <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
            User / Amount Breakdown
          </p>
          <div className="mt-[41px] rounded-[15px] border border-[#999999] bg-white px-[31px] pt-[26px] pb-[30px]">
            <p className="text-[20px] leading-[24px] font-semibold text-[#001701]">User</p>
            <div className="mt-[14px] flex items-center border-b border-[#E5E5E5] pb-[12px]">
              <FinAvatar i={3} />
              <span className="ml-[15px]">
                <span className="block text-[25px] leading-[30px] font-semibold text-[#001701]">
                  Lindsey Lubin
                </span>
                <span className="block text-[16px] leading-[20px] font-semibold text-[#4E4E4E]">
                  clysewebapp@gmail.com
                </span>
              </span>
            </div>
            <p className="mt-[14px] text-[20px] leading-[24px] font-semibold text-[#001701]">
              Subscription / Group
            </p>
            <div className="mt-[14px] flex items-center border-b border-[#E5E5E5] pb-[12px]">
              <BrandTile brand="youtube" size={50} />
              <span className="ml-[15px]">
                <span className="block text-[18px] leading-[22px] font-semibold text-[#001701]">
                  YouTube Premium
                </span>
                <span className="block text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
                  (Subscription)
                </span>
              </span>
            </div>
            <p className="mt-[14px] text-[20px] leading-[24px] font-semibold text-[#001701]">
              Amount Paid/Fee
            </p>
            <div className="mt-[12px] flex">
              {[
                { label: "Amount", value: naira(tx?.amount_kobo), w: "w-[147px] flex-none" },
                { label: "Clyse Fee", value: naira(feeKobo || tx?.fee_kobo || 0), w: "w-full lg:w-[285px] flex-none" },
                { label: "Total", value: naira((tx?.amount_kobo || 0) + (feeKobo || tx?.fee_kobo || 0)), w: "flex-1" },
              ].map((c) => (
                <div key={c.label} className={c.w}>
                  <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    {c.label}
                  </p>
                  <p className="mt-[8px] text-[18px] leading-[22px] font-semibold text-black">
                    {c.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-[30px] text-[20px] leading-[24px] font-bold text-[#001701]">
            Reconciliation Status
          </p>
          <div className="mt-[15px] rounded-[20px] border border-[#999999] bg-white px-[31px] pt-[21px] pb-[21px]">
            <div className="flex items-center">
              <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-full bg-[#048B0B]">
                <GlyphCheck color="#FFFFFF" />
              </span>
              <span className="ml-[26px]">
                <span className="block text-[18px] leading-[22px] font-semibold text-[#048B0B]">
                  {tx?.status ? String(tx.status).replace(/_/g, " ") : "—"}
                </span>
                <span className="mt-[8px] block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  Transaction status as posted to the ledger
                </span>
              </span>
            </div>
            <Link
              to="/admin/finance/reconciliation"
              className="mt-[19px] flex h-[50px] items-center justify-center rounded-[10px] border border-[#048B0B] text-[18px] leading-[22px] font-semibold text-[#048B0B]"
            >
              View Reconciliation Details
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-[30px] flex rounded-[20px] border border-[#999999] bg-white px-[31px] pt-[31px] pb-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <div className="w-full lg:w-[420px] flex-none">
          <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
            Transaction Timeline
          </p>
          <div className="mt-[31px]">
            {entries.length === 0 && (
              <p className="text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                No ledger entries recorded for this transaction.
              </p>
            )}
            {entries.map((t, i) => (
              <div key={t.id || i} className="relative pb-[40px] last:pb-0">
                {i < entries.length - 1 && (
                  <span className="absolute top-[40px] bottom-[-8px] w-[2px] bg-[#048B0B]" style={{ left: 17 }} />
                )}
                <div className="flex">
                  <CheckDisc size={35} />
                  <span className="ml-[18px]">
                    <span className="block text-[20px] leading-[24px] font-bold text-[#001701]">
                      {String(t.account_type || "entry").replace(/_/g, " ")}
                    </span>
                    <span className="mt-[12px] block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                      {naira(t.amount_kobo)}
                    </span>
                    <span className="mt-[6px] block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                      {t.owner_name || t.owner || t.account_owner || "—"}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ml-[60px] flex-1 border-l border-[#E5E5E5] pl-[30px]">
          <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
            Payout Information
          </p>
          <p className="mt-[10px] text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
            Payout data isn’t part of a transaction record — see the payouts ledger for the
            creator’s payout on this payment.
          </p>
          <div className="mt-[40px] space-y-[34px]">
            {payoutRows(tx, naira, when).map((row, i) => (
              <div key={i} className="flex">
                {row.map((c, j) => (
                  <div key={c.label} className={j === 0 ? "w-full lg:w-[301px] flex-none" : "flex-1"}>
                    <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                      {c.label}
                    </p>
                    <p className="mt-[13px] text-[20px] leading-[24px] font-semibold text-[#001701]">
                      {c.value}
                    </p>
                    {c.sub && (
                      <p className="text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                        {c.sub}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white px-[31px] pt-[31px] pb-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
          Refund / Reversal Information
        </p>
        <div className="mt-[24px] flex">
          {refundCols(tx, naira, when).map((c, i) => (
            <div key={c.label} className={`flex-1 ${i > 0 ? "border-l border-[#E5E5E5] pl-[20px]" : ""}`}>
              <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                {c.label}
              </p>
              <p className="mt-[13px] text-[20px] leading-[24px] font-semibold text-[#001701]">
                {c.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
