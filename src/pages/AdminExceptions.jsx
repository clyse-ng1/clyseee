import AdminShell, { BackTitle } from "../components/AdminShell";
import { FinPill, CheckBox, Pagination } from "../components/FinanceShared";

/* Finance > Reconciliation > Exceptions — Figma 1195:27128 (desktop).
   Static. Frame-name typo "Reslution" fixed in the title. The Selected
   Transaction card has no fill in Figma (black) — built white so the
   black text is readable, matching the selected row. */

const STEPS = [
  { n: "1", title: "Auto Detection", sub: "System flagged", active: true },
  { n: "2", title: "Manual Review", sub: "Admin investigating", active: false },
  { n: "3", title: "Resolution", sub: "Action taken", active: false },
  { n: "4", title: "Closure", sub: "Exception closed", active: false },
];

const ROWS = [
  { ref: "TRN-0004455", user: "Maria Philips", type: "Amount Mismatched", typeTone: "orange", issue: "Transaction amount differs from payment record.", amount: "N3,200", date: "Sep. 20, 2026", resolved: true },
  { ref: "TRN-0004455", user: "Maria Philips", type: "Missing Record", typeTone: "red", issue: "Payment record not found in wallet", amount: "N3,200", date: "Sep. 20, 2026", resolved: true },
  { ref: "TRN-0004455", user: "Maria Philips", type: "Duplicate", typeTone: "purple", issue: "Duplicate transaction detected", amount: "N3,200", date: "Sep. 20, 2026", resolved: true },
  { ref: "TRN-0004455", user: "Maria Philips", type: "Refund Requirement", typeTone: "blue", issue: "User requested refund (Verification needed)", amount: "N3,200", date: "Sep. 20, 2026", resolved: true },
];

const COLS = [71, 186, 212, 254, 276, 159, 185, 186];
const HEADERS = ["", "Transaction Ref", "User", "Exception Type", "Issue", "Amount", "Date", "Action"];

export default function AdminExceptions() {
  return (
    <AdminShell active="finance" sub="recon">
      <BackTitle title="Exception Resolution Flow" />
      <div className="mt-[30px] w-fit min-w-full rounded-[20px] border border-[#999999] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <div className="flex min-w-[1625px] px-[1px] py-[21px]">
          {STEPS.map((s) => (
            <div key={s.n} className="flex w-[406px] flex-none items-center px-[20px]">
              <span
                className={`grid h-[40px] w-[40px] flex-none place-items-center rounded-full text-[18px] leading-[22px] font-semibold ${
                  s.active ? "bg-[#048B0B] text-white" : "bg-[#E9E9E9] text-black"
                }`}
              >
                {s.n}
              </span>
              <span className="ml-[10px]">
                <span className="block text-[20px] leading-[24px] font-bold text-[#001701]">
                  {s.title}
                </span>
                <span className="mt-[3px] block text-[18px] leading-[22px] font-semibold text-[#001701]">
                  {s.sub}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-[30px] w-fit min-w-full rounded-[20px] border border-[#999999] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <div className="min-w-[1529px]">
          <p className="px-[21px] pt-[18px] pb-[16px] text-[20px] leading-[24px] font-bold text-[#001701]">
            Pending Exceptions
          </p>
          <div className="flex h-[50px] items-center bg-[#DFFFE0]/80">
            {HEADERS.map((h, i) => (
              <div
                key={h || "check"}
                className="flex-none text-[16px] leading-[20px] font-semibold text-[#4E4E4E]"
                style={{ width: COLS[i], paddingLeft: i === 0 ? 21 : 0 }}
              >
                {i === 0 ? <CheckBox label="Select all" /> : h}
              </div>
            ))}
          </div>
          <div className="divide-y divide-[#999999]">
            {ROWS.map((r, i) => (
              <div key={i} className="flex h-[111px] items-center">
                <div className="flex-none pl-[21px]" style={{ width: COLS[0] }}>
                  <CheckBox label="Select exception" />
                </div>
                <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[1] }}>
                  {r.ref}
                </div>
                <div className="flex-none text-[18px] leading-[22px] font-bold text-[#001701]" style={{ width: COLS[2] }}>
                  {r.user}
                </div>
                <div className="flex-none" style={{ width: COLS[3] }}>
                  <FinPill tone={r.typeTone}>{r.type}</FinPill>
                </div>
                <div className="flex-none pr-[10px] text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[4] }}>
                  {r.issue}
                </div>
                <div className="flex-none text-[16px] leading-[20px] font-semibold text-[#001701]" style={{ width: COLS[5] }}>
                  {r.amount}
                </div>
                <div className="flex-none text-[18px] leading-[22px] font-semibold text-[#001701]" style={{ width: COLS[6] }}>
                  {r.date}
                </div>
                <div className="flex-none" style={{ width: COLS[7] }}>
                  {r.resolved && (
                    <span className="bg-btn inline-flex h-[37px] items-center rounded-[10px] px-[15px] text-[14px] leading-[17px] font-semibold whitespace-nowrap text-white">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination />
        </div>
      </div>
      <div className="mt-[30px] w-[1110px] rounded-[20px] border border-[#999999] bg-white px-[31px] pt-[31px] pb-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <p className="text-[20px] leading-[24px] font-bold text-[#001701]">
          Selected Transaction
        </p>
        <div className="mt-[11px]">
          <FinPill tone="orange">Amount Mismatched</FinPill>
        </div>
        <div className="mt-[24px] flex">
          <div className="w-[271px] flex-none">
            <p className="text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">User</p>
            <p className="mt-[8px] text-[20px] leading-[24px] font-semibold text-[#001701]">
              Sarah Johnson
            </p>
          </div>
          <div className="w-[271px] flex-none">
            <p className="text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
              Subscription
            </p>
            <p className="mt-[8px] text-[20px] leading-[24px] font-semibold text-[#001701]">
              Netflix Premium
            </p>
          </div>
          <div className="flex-1">
            <p className="text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
              Expected Amount
            </p>
            <p className="mt-[8px] text-[20px] leading-[24px] font-semibold text-[#001701]">
              N3,000
            </p>
          </div>
        </div>
        <div className="mt-[24px] flex">
          <div className="w-[271px] flex-none">
            <p className="text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
              Recorded Amount
            </p>
            <p className="mt-[8px] text-[20px] leading-[24px] font-semibold text-[#001701]">
              N2,500
            </p>
          </div>
          <div className="flex-1">
            <p className="text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
              Difference
            </p>
            <p className="mt-[8px] text-[20px] leading-[24px] font-semibold text-[#FF0000]">
              N500
            </p>
          </div>
        </div>
        <div className="mt-[24px] flex items-baseline gap-[16px]">
          <p className="text-[20px] leading-[24px] font-semibold whitespace-nowrap text-[#048B0B]">
            Reason
          </p>
          <p className="text-[20px] leading-[24px] font-semibold text-[#001701]">
            Payment provider returned a different amount than expected
          </p>
        </div>
        <div className="mt-[24px] flex justify-end">
          <button
            type="button"
            className="h-[60px] w-[366px] rounded-[10px] bg-[#036F09] text-[18px] leading-[22px] font-semibold text-[#F1F8F1]"
          >
            Group Approved
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
