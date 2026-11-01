import { Link } from "react-router-dom";
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

const TIMELINE = [
  { title: "Payment Initiated", desc: "User completed payment for Netflix Premium", date: "Sep. 20, 2026 14:24" },
  { title: "Payment Confirmed", desc: "Transaction verified and confirmed", date: "Sep. 20, 2026 14:24" },
  { title: "Subscription Activated", desc: "Subscription Granted to user.", date: "Sep. 20, 2026 14:24" },
];

const PAYOUT_ROWS = [
  [
    { label: "Payout Status", value: "Paid" },
    { label: "Payout Amount", value: "N40,000" },
  ],
  [
    { label: "Payout Date", value: "Sep. 20, 2026 14:24" },
    { label: "Payout Reference", value: "N40,000" },
  ],
  [
    { label: "Payment Method", value: "Bank Transfer" },
    { label: "Recipient", value: "Lindsey Lubin", sub: "Creator" },
  ],
];

const REFUND_COLS = [
  { label: "Refund Status", value: "Not Initiated" },
  { label: "Refund Amount", value: "N40,000" },
  { label: "Refund Method", value: "Bank Transfer" },
  { label: "Refund Reference", value: "TXN-00012345" },
  { label: "Refund Date", value: "Sep. 20, 2026 14:24" },
];

export default function AdminFinanceDetails() {
  return (
    <AdminShell active="finance" sub="transactions">
      <BackTitle title="Transaction Details" />
      <div className="mt-[30px] flex gap-[30px]">
        <div className="w-[458px] flex-none rounded-[20px] border border-[#999999] bg-white px-[31px] pt-[46px] pb-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
          <div className="space-y-[14px]">
            <Field label="Transaction Reference">
              <Value>TXN-000056879</Value>
            </Field>
            <Field label="Transaction Date & Time">
              <Value>Sep. 20, 2026 - 10:00AM</Value>
            </Field>
            <Field label="Type">
              <Value>Subscription Payment</Value>
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
        <div className="w-[622px] flex-none rounded-[20px] border border-[#999999] bg-white px-[31px] pt-[31px] pb-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
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
                { label: "Amount", value: "N3,000", w: "w-[147px] flex-none" },
                { label: "Clyse Fee", value: "N200", w: "w-[285px] flex-none" },
                { label: "Total", value: "N3,200", w: "flex-1" },
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
                  Reconciled
                </span>
                <span className="mt-[8px] block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  Transaction reconciled with payment methods
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
        <div className="w-[420px] flex-none">
          <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
            Transaction Timeline
          </p>
          <div className="mt-[31px]">
            {TIMELINE.map((t, i) => (
              <div key={t.title} className="relative pb-[40px] last:pb-0">
                {i < TIMELINE.length - 1 && (
                  <span className="absolute top-[40px] bottom-[-8px] w-[2px] bg-[#048B0B]" style={{ left: 17 }} />
                )}
                <div className="flex">
                  <CheckDisc size={35} />
                  <span className="ml-[18px]">
                    <span className="block text-[20px] leading-[24px] font-bold text-[#001701]">
                      {t.title}
                    </span>
                    <span className="mt-[12px] block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                      {t.date}
                    </span>
                    <span className="mt-[6px] block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                      {t.desc}
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
          <div className="mt-[40px] space-y-[34px]">
            {PAYOUT_ROWS.map((row, i) => (
              <div key={i} className="flex">
                {row.map((c, j) => (
                  <div key={c.label} className={j === 0 ? "w-[301px] flex-none" : "flex-1"}>
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
          {REFUND_COLS.map((c, i) => (
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
