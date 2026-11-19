import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import AdminShell, { BackTitle } from "../components/AdminShell";

/* Finance > Transactions > Details.
   This view deliberately follows the published response for
   GET /admin/finance/transactions/detail?transaction_id=<uuid>:
   data = { id, kind, status, amount_kobo, entries[] }.
   Each documented entry has account_type, owner, and amount_kobo. We do not
   infer user/service/payout/refund fields from other API responses. */

function moneyFromKobo(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return `₦${(value / 100).toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function textValue(value, fallback = "—") {
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  /* The documented owner field is rendered only when scalar. If the server
     supplies a nested object, keep it from becoming an invalid React child. */
  return fallback;
}

function Summary({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E1E8E1] bg-white p-4">
      <p className="text-sm font-semibold text-[#657165]">{label}</p>
      <p className="mt-2 break-words text-lg font-bold capitalize text-[#001701]">{value}</p>
    </div>
  );
}

export default function AdminFinanceDetails() {
  const [params] = useSearchParams();
  const transactionId = params.get("id") || params.get("transaction_id") || "";
  const [transaction, setTransaction] = useState(null);
  const [loadState, setLoadState] = useState("loading");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let alive = true;
    if (!transactionId) {
      setTransaction(null);
      setLoadError("No transaction ID was provided in the page URL.");
      setLoadState("error");
      return () => { alive = false; };
    }

    setLoadState("loading");
    setLoadError("");
    api(`/admin/finance/transactions/detail?transaction_id=${encodeURIComponent(transactionId)}`)
      .then(({ data, error, status }) => {
        if (!alive) return;
        if (error) {
          setTransaction(null);
          setLoadError(error.message || `Transaction detail request failed${status ? ` (HTTP ${status})` : ""}.`);
          setLoadState("error");
          return;
        }
        /* api() unwraps the standard { data: ... } envelope. The documented
           transaction object is directly inside that `data` value. */
        if (!data || typeof data !== "object" || Array.isArray(data) || !Array.isArray(data.entries)) {
          setTransaction(null);
          setLoadError("The transaction detail response did not match the documented schema.");
          setLoadState("error");
          return;
        }
        setTransaction({
          id: data.id,
          kind: data.kind,
          status: data.status,
          amount_kobo: data.amount_kobo,
          entries: data.entries.filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry)),
        });
        setLoadState("live");
      })
      .catch((error) => {
        if (!alive) return;
        setTransaction(null);
        setLoadError(error?.message || "Unexpected error while loading transaction details.");
        setLoadState("error");
      });
    return () => { alive = false; };
  }, [transactionId]);

  const statusLabel = textValue(transaction?.status).replaceAll("_", " ");
  const entries = transaction?.entries || [];

  return (
    <AdminShell active="finance" sub="transactions">
      <BackTitle title="Transaction Details" />

      {loadState === "error" && (
        <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 font-semibold text-red-800">
          {loadError}
        </p>
      )}
      {loadState === "loading" && (
        <p role="status" className="mt-5 rounded-xl border border-[#E1E8E1] bg-white p-4 font-semibold text-[#4E4E4E]">
          Loading transaction details…
        </p>
      )}

      {transaction && (
        <div className="mt-6 max-w-[1000px] space-y-6">
          <section className="rounded-2xl border border-[#D8E2D9] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-[#001701]">Transaction</h2>
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Summary label="Transaction ID" value={textValue(transaction.id)} />
              <Summary label="Type" value={textValue(transaction.kind).replaceAll("_", " ")} />
              <Summary label="Status" value={statusLabel} />
              <Summary label="Amount" value={moneyFromKobo(transaction.amount_kobo)} />
            </div>
          </section>

          <section className="rounded-2xl border border-[#D8E2D9] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-xl font-bold text-[#001701]">Ledger entries</h2>
            {entries.length === 0 ? (
              <p className="mt-4 rounded-xl bg-[#F6F9F6] p-4 font-semibold text-[#657165]">
                No ledger entries were returned for this transaction.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-[#E8EEE8] overflow-hidden rounded-xl border border-[#E1E8E1]">
                {entries.map((entry, index) => (
                  <div key={`${textValue(entry.account_type, "entry")}-${index}`} className="grid grid-cols-1 gap-2 bg-white p-4 sm:grid-cols-3 sm:items-center">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#657165]">Account type</p>
                      <p className="mt-1 font-bold capitalize text-[#001701]">{textValue(entry.account_type)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#657165]">Owner</p>
                      <p className="mt-1 font-semibold text-[#253725]">{textValue(entry.owner, typeof entry.owner === "object" && entry.owner ? "Owner details" : "—")}</p>
                    </div>
                    <div className="sm:text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#657165]">Amount</p>
                      <p className="mt-1 font-bold text-[#001701]">{moneyFromKobo(entry.amount_kobo)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </AdminShell>
  );
}
