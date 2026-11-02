import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import { api, brandOf, fmtDate, kobo } from "../lib/api";

function date(value) {
  return value ? fmtDate(value) : "—";
}

function money(value) {
  return value == null ? "—" : kobo(value);
}

function HistoryCard({ item }) {
  const [open, setOpen] = useState(false);
  const title = [item.service?.name, item.plan?.name].filter(Boolean).join(" · ") || "Subscription";
  const status = item.status || item.membership_status || "unknown";
  const payments = item.payments || [];
  const timeline = item.timeline || [];

  return (
    <article className="rounded-2xl border border-[#E7EDE8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#EFF8F0] text-sm font-bold text-[#048B0B]">
            {item.service?.logo_url ? (
              <img src={item.service.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              brandOf(item.service)?.slice(0, 2) || "CL"
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[#18251C]">{title}</h2>
            <p className="mt-1 text-sm text-[#66726C]">Started {date(item.start_date)}</p>
          </div>
        </div>
        <span className="rounded-full bg-[#EFF8F0] px-3 py-1 text-sm font-semibold capitalize text-[#048B0B]">
          {String(status).replaceAll("_", " ")}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-3 border-t border-[#EEF1EF] pt-4 text-sm sm:grid-cols-3">
        <div><dt className="text-[#66726C]">Current period</dt><dd className="mt-1 font-semibold text-[#18251C]">{date(item.current_period?.start)} – {date(item.current_period?.end)}</dd></div>
        <div><dt className="text-[#66726C]">Creator</dt><dd className="mt-1 font-semibold text-[#18251C]">{item.creator?.first_name || "—"}</dd></div>
        <div><dt className="text-[#66726C]">Ended</dt><dd className="mt-1 font-semibold text-[#18251C]">{date(item.ended_at)}</dd></div>
      </dl>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="mt-4 flex w-full items-center justify-between rounded-lg bg-[#F7FAF7] px-4 py-3 text-left text-sm font-semibold text-[#048B0B] hover:bg-[#EFF8F0]"
      >
        <span>{open ? "Hide" : "View"} payments and activity</span>
        <span aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>⌄</span>
      </button>

      {open && (
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          <section>
            <h3 className="mb-2 font-bold text-[#18251C]">Payments</h3>
            {payments.length ? (
              <ul className="space-y-2">
                {payments.map((payment) => (
                  <li key={payment.transaction_id || payment.reference || `${payment.paid_at}-${payment.amount_kobo}`} className="flex flex-wrap justify-between gap-2 rounded-lg border border-[#EEF1EF] p-3 text-sm">
                    <span><span className="font-semibold capitalize">{String(payment.kind || "payment").replaceAll("_", " ")}</span><span className="ml-2 text-[#66726C]">{date(payment.paid_at)}</span></span>
                    <span className="font-semibold">{money(payment.amount_kobo)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-[#66726C]">No payment entries are available.</p>}
          </section>
          <section>
            <h3 className="mb-2 font-bold text-[#18251C]">Activity timeline</h3>
            {timeline.length ? (
              <ol className="space-y-2">
                {timeline.map((event, index) => (
                  <li key={`${event.event_type}-${event.occurred_at}-${index}`} className="rounded-lg border border-[#EEF1EF] p-3 text-sm">
                    <p className="font-semibold capitalize text-[#18251C]">{String(event.event_type || "update").replaceAll("_", " ")}</p>
                    <p className="mt-1 text-[#66726C]">{date(event.occurred_at)}{event.to_status ? ` · ${String(event.to_status).replaceAll("_", " ")}` : ""}</p>
                    {event.note && <p className="mt-1 text-[#66726C]">{event.note}</p>}
                  </li>
                ))}
              </ol>
            ) : <p className="text-sm text-[#66726C]">No activity entries are available.</p>}
          </section>
        </div>
      )}
    </article>
  );
}

export default function SubscriptionHistory() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(null);
  const [busy, setBusy] = useState(true);
  const [moreBusy, setMoreBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (cursor, append = false) => {
    const query = new URLSearchParams({ limit: "20" });
    if (cursor) query.set("before", cursor);
    const { data, error: apiError } = await api(`/member/subscriptions/history?${query.toString()}`);
    if (apiError) {
      setError(apiError.message || "Could not load subscription history.");
    } else {
      const next = data?.history || [];
      setItems((current) => append ? [...current, ...next] : next);
      setPage(data?.page || null);
    }
    setBusy(false);
    setMoreBusy(false);
  }, []);

  // oxlint-disable-next-line react/set-state-in-effect -- load updates state only after the API request resolves.
  useEffect(() => { load(null); }, [load]);
  const retry = () => { setError(""); setBusy(true); load(null); };
  const loadMore = () => { setMoreBusy(true); load(page?.next_cursor, true); };

  return (
    <div className="min-h-screen bg-[#F8FAF8] font-sans text-[#18251C]">
      <Navbar loggedIn />
      <main className="relative mx-auto max-w-[1440px] px-5 pb-16 pt-8 sm:px-8 xl:px-10">
        <BlurBg variant="hero" />
        <div className="relative flex gap-8">
          <div className="hidden xl:block"><Sidebar active="My Subscription" /></div>
          <div className="min-w-0 flex-1">
            <div className="mb-6 xl:hidden"><MemberMini /></div>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Link to="/subscriptions" className="text-sm font-semibold text-[#048B0B] hover:underline">← Back to subscriptions</Link>
                <h1 className="mt-2 text-3xl font-bold">Subscription history</h1>
                <p className="mt-2 max-w-2xl text-sm text-[#66726C]">A read-only timeline of your memberships, payments, renewals and status changes.</p>
              </div>
              <Link to="/subscriptions" className="rounded-lg border border-[#048B0B] px-4 py-2 text-sm font-semibold text-[#048B0B] hover:bg-[#EFF8F0]">Current subscriptions</Link>
            </div>

            {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error} <button type="button" onClick={retry} className="ml-2 font-bold underline">Retry</button></div>}
            {busy ? (
              <div className="space-y-4" aria-label="Loading subscription history">{[1,2,3].map((n) => <div key={n} className="h-40 rounded-2xl bg-[#E8EEE9]" />)}</div>
            ) : items.length ? (
              <div className="space-y-4">{items.map((item) => <HistoryCard key={item.membership_id} item={item} />)}</div>
            ) : !error ? (
              <div className="rounded-2xl border border-dashed border-[#CBD8CE] bg-white p-10 text-center">
                <h2 className="text-lg font-bold">No subscription history yet</h2>
                <p className="mt-2 text-sm text-[#66726C]">Membership and payment activity will appear here after you join a group.</p>
                <Link to="/marketplace" className="mt-5 inline-flex rounded-lg bg-[#048B0B] px-5 py-3 text-sm font-semibold text-white">Browse subscriptions</Link>
              </div>
            ) : null}
            {!busy && page?.has_more && <div className="mt-6 text-center"><button type="button" disabled={moreBusy} onClick={loadMore} className="rounded-lg bg-[#048B0B] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{moreBusy ? "Loading…" : "Load more"}</button></div>}
          </div>
        </div>
      </main>
    </div>
  );
}
