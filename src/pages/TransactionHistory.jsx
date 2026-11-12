import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MobileBack } from "../components/MemberMini";
import Sk from "../components/Skeleton";
import Sidebar from "../components/Sidebar";
import BrandTile from "../components/BrandTile";
import { BlurBg } from "../components/Decor";
import DetailModal, { DetailRow } from "../components/DetailModal";
import { api, fmtTx, kobo2 } from "../lib/api";
import { mapTx, PILL, MONEY_ICONS, RowIcon } from "./Wallet";
import iconQaClock from "../assets/qa-clock.svg";

/* Full Transaction History — no Figma artboard exists for this screen (the
   client asked for it explicitly). It reuses the wallet card's row language
   verbatim: icons, copy, signed amounts and the Successful/Pending/Fail pills
   all come from mapTx/PILL in Wallet.jsx so the two screens can never drift.
   Data is the real GET /member/wallet/transactions endpoint, paged up by
   `limit`, and rows open the same transaction-details modal as the wallet. */

const PAGE = 50;

/* mapTx resolves a service name/brand for subscription debits from this index.
   Built exactly like the wallet's own (public catalogue first, the member's
   groups win on collision) so both screens print the same title and disc. */
async function loadGroupIndex() {
  const own = await api("/member/groups");
  const pub = await api("/catalogue/groups?limit=50", { auth: false });
  const map = {};
  for (const g of pub.data?.groups || []) {
    const id = g.group_id || g.id;
    if (id) map[id] = g;
  }
  for (const g of own.data?.groups || []) if (g?.id) map[g.id] = g;
  return map;
}

function TxRow({ r, onOpen }) {
  return (
    <div
      className={`rounded-[12px] border border-clyse bg-white px-[16px] py-[16px] shadow-[0_0_13.87px_rgba(0,23,1,0.06)] ${
        r.id ? "cursor-pointer" : ""
      }`}
      onClick={r.id ? () => onOpen(r.id) : undefined}
      role={r.id ? "button" : undefined}
      tabIndex={r.id ? 0 : undefined}
      onKeyDown={r.id ? (e) => e.key === "Enter" && onOpen(r.id) : undefined}
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
        <span className="ml-[12px] min-w-0">
          <span className="block text-[16px] leading-[22px] font-semibold text-black xl:text-[18px]">
            {r.desc}
          </span>
          <span className="block text-[13px] leading-[20px] font-semibold text-[#66726C]">
            {r.sub}
          </span>
        </span>
        <span className="ml-auto flex-none text-[16px] leading-[22px] font-semibold text-[#6B6B6B] xl:text-[18px]">
          {r.amount}
        </span>
      </div>
      <div className="relative mt-[12px] flex items-center justify-between">
        <span className="text-[13px] leading-[20px] font-semibold text-[#66726C]">
          {r.date}
        </span>
        <span
          className={`flex h-[28px] w-[101px] items-center justify-center rounded-[14px] ${PILL[r.status] || PILL.Fail}`}
        >
          <span className="text-[13px] leading-[20px] font-semibold">{r.status}</span>
        </span>
      </div>
    </div>
  );
}

function RowSk() {
  return (
    <div className="rounded-[12px] border border-clyse bg-white px-[16px] py-[16px]">
      <div className="flex items-start">
        <Sk className="h-[40px] w-[40px] !rounded-full" />
        <span className="ml-[12px]">
          <Sk className="h-[16px] w-[150px]" />
          <Sk className="mt-[6px] h-[12px] w-[110px]" />
        </span>
        <Sk className="ml-auto h-[16px] w-[70px]" />
      </div>
      <div className="mt-[14px] flex items-center justify-between">
        <Sk className="h-[12px] w-[120px]" />
        <Sk className="h-[28px] w-[101px] !rounded-[14px]" />
      </div>
    </div>
  );
}

export default function TransactionHistory() {
  const [txns, setTxns] = useState(null);
  const [groupById, setGroupById] = useState({});
  const [error, setError] = useState(false);
  const [limit, setLimit] = useState(PAGE);
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
    const { data, error: apiError } = await api(
      `/member/wallet/transactions/detail?id=${id}`,
    );
    setDetailLoading(false);
    if (apiError) setDetailError(apiError.message || "Could not load this transaction.");
    else setDetail(data || {});
  };

  useEffect(() => {
    let live = true;
    (async () => {
      const index = await loadGroupIndex();
      if (!live) return;
      setGroupById(index);
    })();
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error: apiError } = await api(
        `/member/wallet/transactions?limit=${limit}`,
      );
      if (!live) return;
      if (apiError) {
        setError(true);
        setTxns([]);
        return;
      }
      setTxns(data?.transactions || []);
    })();
    return () => {
      live = false;
    };
  }, [limit]);

  const rows = txns ? txns.map((t) => mapTx(t, groupById)) : null;
  const canLoadMore = txns && txns.length >= limit;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      <BlurBg variant="hero" />
      <Navbar loggedIn />

      {/* Desktop */}
      <main className="relative mx-[20px] hidden pb-[100px] min-[1440px]:mx-[100px] xl:block">
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="My Wallet" />
          <div className="w-[830px] flex-none">
            <div className="flex items-center gap-[20px]">
              <span className="grid h-[50px] w-[54px] flex-none place-items-center rounded-[10px] bg-[#B1DBB3]">
                <img src={iconQaClock} alt="" className="h-[26px] w-[26px]" />
              </span>
              <h1 className="text-[35px] leading-[43px] font-bold text-ink">
                Transaction History
              </h1>
            </div>
            <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Every credit and debit on your Clyse wallet, newest first.
            </p>

            <div className="mt-[40px] rounded-[20px] bg-white px-[30px] pt-[40px] pb-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              {!rows && !error ? (
                <div className="space-y-[15px]">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <RowSk key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-[15px]">
                  {(rows || []).map((r, i) => (
                    <TxRow key={r.key || i} r={r} onOpen={openDetail} />
                  ))}
                </div>
              )}
              {rows && rows.length === 0 && !error && (
                <p className="text-[18px] leading-[24px] font-semibold text-[#6B6B6B]">
                  No transactions yet. Fund your wallet to get started.
                </p>
              )}
              {error && (
                <p className="text-[18px] leading-[24px] font-semibold text-[#FF0000]">
                  Could not load transactions. Please try again.
                </p>
              )}
              {canLoadMore && !error && (
                <button
                  type="button"
                  onClick={() => setLimit((n) => n + PAGE)}
                  className="mt-[30px] flex h-[47px] w-full items-center justify-center rounded-[20px] border border-[#001701] bg-[#F1F8F2] text-[17px] font-semibold text-[#001701] transition hover:bg-white"
                >
                  Load more
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile */}
      <main className="relative xl:hidden">
        <div className="px-[30px] pt-[30px]">
          <MobileBack to="/wallet" />
          <h1 className="mt-[20px] text-[30px] leading-[37px] font-bold text-ink">
            Transaction History
          </h1>
          <p className="mt-[4px] text-[15px] leading-[22px] font-semibold text-[#6B6B6B]">
            Every credit and debit on your Clyse wallet, newest first.
          </p>
        </div>
        <div className="mt-[24px] px-[20px]">
          {!rows && !error ? (
            <div className="space-y-[15px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <RowSk key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-[15px]">
              {(rows || []).map((r, i) => (
                <TxRow key={r.key || i} r={r} onOpen={openDetail} />
              ))}
            </div>
          )}
          {rows && rows.length === 0 && !error && (
            <p className="px-[10px] text-[15px] leading-[22px] font-semibold text-[#6B6B6B]">
              No transactions yet. Fund your wallet to get started.
            </p>
          )}
          {error && (
            <p className="px-[10px] text-[15px] leading-[22px] font-semibold text-[#FF0000]">
              Could not load transactions. Please try again.
            </p>
          )}
          {canLoadMore && !error && (
            <button
              type="button"
              onClick={() => setLimit((n) => n + PAGE)}
              className="mt-[20px] flex h-[42px] w-full items-center justify-center rounded-[21px] border border-clyse bg-[#F1F8F2] text-[15px] font-semibold text-ink"
            >
              Load more
            </button>
          )}
        </div>
        <div className="pb-[60px]" />
      </main>

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
              <DetailRow
                label="Type"
                value={detail.transaction.type || detail.transaction.kind || "—"}
              />
              <DetailRow label="Status" value={detail.transaction.status || "—"} />
              <DetailRow label="Amount" value={kobo2(detail.transaction.amount_kobo ?? 0)} />
              <DetailRow label="Reference" value={detail.transaction.reference || "—"} />
              <DetailRow label="Date" value={fmtTx(detail.transaction.created_at) || "—"} />
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
