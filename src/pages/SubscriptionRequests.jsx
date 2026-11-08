import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { api, fmtDate } from "../lib/api";

const CATEGORIES = ["streaming", "music", "gaming", "software", "education", "productivity", "news", "sports", "other"];
const BOX = "rounded-[16px] border border-[#D8E2D9] bg-white p-5 shadow-[0_0_16px_rgba(0,23,1,0.07)]";
const FIELD = "mt-2 h-12 w-full rounded-lg border border-[#AFC0AF] bg-white px-3 text-[15px] outline-none focus:border-[#048B0B]";

function Status({ value }) {
  const status = String(value || "pending").toLowerCase();
  const colors = status === "approved" ? "bg-[#DFFFE0] text-[#048B0B]" : status === "rejected" ? "bg-[#FDE9E9] text-[#B42318]" : "bg-[#FFF3DB] text-[#995C00]";
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${colors}`}>{status.replaceAll("_", " ")}</span>;
}

function Shell({ title, children }) {
  return <div className="min-h-screen bg-white font-sans text-ink"><Navbar loggedIn /><main className="relative mx-[20px] min-[1440px]:mx-[100px] pb-16"><BlurBg variant="hero"/><div className="relative mt-10 flex gap-[38px] xl:mt-[89px]"><div className="hidden xl:block"><Sidebar active="Subscription Requests"/></div><div className="min-w-0 flex-1 xl:max-w-[830px]"><h1 className="text-[28px] font-bold text-black xl:text-[35px]">{title}</h1>{children}</div></div></main></div>;
}

function RequestForm({ initial = {}, requestId, onComplete }) {
  const [form, setForm] = useState({ name: initial.name || "", website: initial.website || "", category: initial.category || "streaming", plan_name: initial.plan?.name || initial.plan_name || "", member_slot_capacity: String(initial.plan?.member_slot_capacity || initial.member_slot_capacity || 4), description: initial.description || "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    const body = { ...form, member_slot_capacity: Number(form.member_slot_capacity) };
    if (!body.name.trim() || !body.website.trim() || !body.plan_name.trim()) { setError("Enter the subscription name, website, and plan name."); return; }
    if (!Number.isInteger(body.member_slot_capacity) || body.member_slot_capacity < 1 || body.member_slot_capacity > 20) { setError("Member slot capacity must be between 1 and 20."); return; }
    setBusy(true); setError("");
    const res = requestId
      ? await api("/member/subscription-requests/resubmit", { method: "POST", body: { id: requestId, ...body } })
      : await api("/member/subscription-requests", { method: "POST", body });
    setBusy(false);
    if (res.error) { setError(res.error.message || "Could not submit your request."); return; }
    onComplete?.(res.data?.request || res.data);
  };
  return <form onSubmit={submit} className={`${BOX} mt-6 space-y-4`}>
    <label className="block text-sm font-bold">Subscription name<input className={FIELD} value={form.name} onChange={(e) => set("name", e.target.value)} maxLength={100} required placeholder="e.g. StreamPlus"/></label>
    <label className="block text-sm font-bold">Website or app URL<input className={FIELD} type="url" value={form.website} onChange={(e) => set("website", e.target.value)} required placeholder="https://example.com"/></label>
    <label className="block text-sm font-bold">Category<select className={FIELD} value={form.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c} value={c}>{c[0].toUpperCase()+c.slice(1)}</option>)}</select></label>
    <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-bold">Plan name<input className={FIELD} value={form.plan_name} onChange={(e) => set("plan_name", e.target.value)} required placeholder="e.g. Premium"/></label><label className="block text-sm font-bold">Member slot capacity<input className={FIELD} type="number" min="1" max="20" value={form.member_slot_capacity} onChange={(e) => set("member_slot_capacity", e.target.value)}/></label></div>
    <label className="block text-sm font-bold">Additional details (optional)<textarea className="mt-2 min-h-28 w-full rounded-lg border border-[#AFC0AF] p-3 text-[15px] outline-none focus:border-[#048B0B]" value={form.description} onChange={(e) => set("description", e.target.value)} maxLength={2000} placeholder="Tell us why you would like this subscription on Clyse."/></label>
    {error && <p role="alert" className="rounded-lg bg-[#FDE9E9] px-4 py-3 text-sm font-semibold text-[#B42318]">{error}</p>}
    <p className="text-xs text-[#66726C]">A request starts as Pending. Approval does not publish the service until Clyse finishes catalogue setup.</p>
    <button disabled={busy} className="h-12 w-full rounded-lg bg-[#048B0B] font-bold text-white disabled:opacity-60">{busy ? "Submitting…" : requestId ? "Resubmit request" : "Submit request"}</button>
  </form>;
}

export function SubscriptionRequestList() {
  const [requests, setRequests] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [more, setMore] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { let live = true; (async () => { const { data, error: apiError } = await api("/member/subscription-requests?limit=20"); if (!live) return; if (apiError) setError(apiError.message || "Could not load requests."); else { setRequests(data?.requests || []); setCursor(data?.page?.next_cursor || null); setMore(!!data?.page?.has_more); } })(); return () => { live = false; }; }, []);
  const loadMore = async () => { if (!cursor) return; const { data, error: apiError } = await api(`/member/subscription-requests?limit=20&before=${encodeURIComponent(cursor)}`); if (apiError) { setError(apiError.message); return; } setRequests((items) => [...(items || []), ...(data?.requests || [])]); setCursor(data?.page?.next_cursor || null); setMore(!!data?.page?.has_more); };
  return <Shell title="My Subscription Requests"><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-[#66726C]">Track requests for services not yet available on Clyse.</p><Link to="/subscription-requests/new" className="rounded-lg bg-[#001701] px-4 py-3 text-sm font-bold text-white">Request a subscription</Link></div>
    {error && <p role="alert" className="mt-5 rounded-lg bg-[#FDE9E9] p-4 text-sm font-semibold text-[#B42318]">{error}</p>}
    <div className="mt-5 space-y-3">{requests === null && !error ? <div className={BOX}>Loading your requests…</div> : requests?.length ? requests.map((r) => <Link key={r.id} to={`/subscription-requests/${r.id}`} className={`${BOX} block transition hover:border-[#048B0B]`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{r.name}</h2><p className="mt-1 text-sm text-[#66726C]">{r.category || "—"} · {r.plan?.name || r.plan_name || "Plan details pending"} · Submitted {fmtDate(r.created_at)}</p></div><Status value={r.status}/></div>{r.status === "rejected" && r.rejection_reason && <p className="mt-3 text-sm font-semibold text-[#B42318]">Reason: {r.rejection_reason}</p>}{r.configured === false && r.status === "approved" && <p className="mt-3 text-sm text-[#66726C]">Approved; catalogue setup is still pending.</p>}</Link>) : <div className={`${BOX} text-center text-sm font-semibold text-[#66726C]`}>You have not submitted a subscription request yet.</div>}</div>
    {more && <button onClick={loadMore} className="mt-4 h-11 w-full rounded-lg border border-[#AFC0AF] font-semibold text-[#048B0B]">Show more requests</button>}
  </Shell>;
}

export function SubscriptionRequestNew() {
  const navigate = useNavigate();
  return <Shell title="Request a Subscription"><p className="mt-2 text-sm text-[#66726C]">Tell us which subscription you would like Clyse to support.</p><RequestForm onComplete={() => navigate("/subscription-requests", { state: { submitted: true } })}/></Shell>;
}

export function SubscriptionRequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState("");
  const [resubmitting, setResubmitting] = useState(false);
  useEffect(() => { let live = true; (async () => { const { data, error: apiError } = await api(`/member/subscription-requests/detail?id=${encodeURIComponent(id)}`); if (!live) return; if (apiError) setError(apiError.message || "Could not load this request."); else setRequest(data?.request || data || null); })(); return () => { live = false; }; }, [id]);
  if (error) return <Shell title="Request details"><p role="alert" className="mt-5 rounded-lg bg-[#FDE9E9] p-4 font-semibold text-[#B42318]">{error}</p><Link className="mt-4 inline-block text-[#048B0B]" to="/subscription-requests">Back to requests</Link></Shell>;
  if (!request) return <Shell title="Request details"><p className="mt-5">Loading request…</p></Shell>;
  const history = request.history || [];
  return <Shell title="Request details"><div className={`${BOX} mt-5`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-xl font-bold">{request.name}</h2><p className="mt-1 text-sm text-[#66726C]">{request.website || "Website not supplied"} · {request.category}</p></div><Status value={request.status}/></div><dl className="mt-5 grid gap-4 sm:grid-cols-2">{[["Plan", request.plan?.name || request.plan_name || "—"],["Capacity", request.plan?.member_slot_capacity || request.member_slot_capacity || "—"],["Submitted", fmtDate(request.created_at)],["Configured", request.configured ? "Yes" : "Not yet"]].map(([k,v]) => <div key={k}><dt className="text-xs font-bold uppercase text-[#66726C]">{k}</dt><dd className="mt-1 font-semibold">{v}</dd></div>)}</dl>{request.rejection_reason && <p className="mt-5 rounded-lg bg-[#FDE9E9] p-4 text-sm font-semibold text-[#B42318]">Rejection reason: {request.rejection_reason}</p>}
    {request.can_resubmit && <button onClick={() => setResubmitting((v) => !v)} className="mt-5 rounded-lg border border-[#048B0B] px-4 py-3 font-bold text-[#048B0B]">{resubmitting ? "Close resubmission" : "Resubmit request"}</button>}
    {resubmitting && <RequestForm key={request.id} initial={request} requestId={request.id} onComplete={(updated) => { setRequest((old) => ({ ...old, ...(updated || {}), status: "pending", can_resubmit: false, rejection_reason: null })); setResubmitting(false); }}/>}</div>
    <section className={`${BOX} mt-4`}><h3 className="font-bold">Request history</h3>{history.length ? <ol className="mt-4 space-y-3">{history.map((h, i) => <li key={h.id || `${h.event_type}-${i}`} className="border-l-2 border-[#B1DBB3] pl-4"><p className="font-semibold capitalize">{String(h.event_type || "update").replaceAll("_", " ")}{h.to_status ? ` · ${h.to_status}` : ""}</p><p className="text-sm text-[#66726C]">{fmtDate(h.occurred_at || h.created_at)}{h.metadata?.reason ? ` · ${h.metadata.reason}` : ""}</p></li>)}</ol> : <p className="mt-3 text-sm text-[#66726C]">No status changes yet.</p>}</section><Link to="/subscription-requests" className="mt-4 inline-block font-semibold text-[#048B0B]">← Back to requests</Link>
  </Shell>;
}
