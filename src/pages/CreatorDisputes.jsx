import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { BlurBg } from "../components/Decor";
import { api, fmtDate } from "../lib/api";

const BOX = "rounded-[16px] border border-[#D8E2D9] bg-white p-5 shadow-[0_0_16px_rgba(0,23,1,0.07)]";
const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "application/pdf"];

function statusTone(status) {
  if (["resolved", "rejected", "closed"].includes(String(status).toLowerCase())) return "bg-[#E8E8E8] text-[#555]";
  return "bg-[#FFF3DB] text-[#995C00]";
}

function Evidence({ items = [] }) {
  if (!items.length) return <p className="text-sm text-[#66726C]">No evidence attached.</p>;
  return <ul className="mt-2 space-y-2">{items.map((item, i) => <li key={item.evidence_id || i}><a className="font-semibold text-[#048B0B] underline" href={item.evidence_url} target="_blank" rel="noreferrer">Open {item.content_type || "evidence"} · {fmtDate(item.created_at)}</a></li>)}</ul>;
}

export default function CreatorDisputes() {
  const [items, setItems] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [detailBusy, setDetailBusy] = useState(false);
  const [response, setResponse] = useState("");
  const [files, setFiles] = useState([]);
  const [notice, setNotice] = useState("");

  const loadList = async () => {
    const { data, error: apiError } = await api("/member/reports/disputes?open=true&limit=50");
    if (apiError) { setError(apiError.message || "Could not load creator disputes."); setItems([]); }
    else { setError(""); setItems(data?.disputes || []); }
  };
  useEffect(() => { let live = true; (async () => { const { data, error: apiError } = await api("/member/reports/disputes?open=true&limit=50"); if (!live) return; if (apiError) { setError(apiError.message || "Could not load creator disputes."); setItems([]); } else setItems(data?.disputes || []); })(); return () => { live = false; }; }, []);

  const openDetail = async (reportId) => {
    setSelectedId(reportId); setDetail(null); setError(""); setNotice(""); setDetailBusy(true);
    const { data, error: apiError } = await api(`/member/reports/disputes/detail?report_id=${encodeURIComponent(reportId)}`);
    setDetailBusy(false);
    if (apiError) setError(apiError.message || "Could not load dispute details.");
    else setDetail(data || null);
  };

  const chooseFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    const invalid = selectedFiles.find((f) => !TYPES.includes(f.type) || f.size > MAX_SIZE);
    if (invalid) { setError("Attachments must be JPG, PNG, or PDF files no larger than 5 MB each."); return; }
    setFiles(selectedFiles);
    setError("");
  };

  const sendResponse = async (event) => {
    event.preventDefault();
    if (!selectedId || !detail || busy || !response.trim() || response.trim().length > 2000) return;
    setBusy(true); setError(""); setNotice("");
    const { data, error: apiError } = await api("/member/reports/disputes/respond", { method: "POST", body: { report_id: selectedId, response: response.trim() } });
    if (apiError) { setBusy(false); setError(apiError.message || "Could not submit your response."); return; }
    const responseId = data?.response_id || data?.response?.id;
    let evidenceError = "";
    if (files.length && responseId) {
      for (const file of files) {
        const uploaded = await api(`/member/reports/disputes/evidence?report_id=${encodeURIComponent(selectedId)}&response_id=${encodeURIComponent(responseId)}`, { method: "POST", raw: true, contentType: file.type, body: file });
        if (uploaded.error && !evidenceError) evidenceError = uploaded.error.message || "Response saved, but an attachment could not be uploaded.";
      }
    }
    setBusy(false); setResponse(""); setFiles([]);
    setNotice(evidenceError || "Your response was sent to Clyse for investigation.");
    await openDetail(selectedId);
    await loadList();
  };

  const activeDetail = detail?.report || detail?.dispute || detail || {};
  const currentStatus = String(activeDetail.status || "").toLowerCase();
  const canRespond = ["open", "under_review"].includes(currentStatus);
  const evidence = activeDetail.report_evidence || activeDetail.evidence || [];
  const timeline = activeDetail.history || activeDetail.timeline || [];
  const creatorResponses = activeDetail.responses || [];

  return <div className="min-h-screen bg-white font-sans text-ink"><Navbar loggedIn/><main className="relative mx-[20px] min-[1440px]:mx-[100px] pb-16"><BlurBg variant="hero"/><div className="relative mt-10 flex gap-[38px] xl:mt-[89px]"><div className="hidden xl:block"><Sidebar active="Access Disputes"/></div><div className="min-w-0 flex-1 xl:max-w-[830px]"><div className="flex flex-wrap items-end justify-between gap-3"><div><h1 className="text-[28px] font-bold xl:text-[35px]">Access Disputes</h1><p className="mt-1 text-sm font-semibold text-[#66726C]">Respond to reports connected to groups you created.</p></div><button type="button" onClick={loadList} className="rounded-lg border border-[#AFC0AF] px-4 py-2 text-sm font-bold">Refresh</button></div>
      {error && <p role="alert" className="mt-4 rounded-lg bg-[#FDE9E9] p-4 text-sm font-semibold text-[#B42318]">{error}</p>}
      <div className="mt-5 space-y-3">{items === null ? <div className={BOX}>Loading disputes…</div> : items.length ? items.map((item) => <button key={item.report_id} type="button" onClick={() => openDetail(item.report_id)} className={`${BOX} block w-full text-left transition hover:border-[#048B0B]`}><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-bold">{[item.service?.name, item.plan?.name].filter(Boolean).join(" ") || "Subscription access issue"}</h2><p className="mt-1 text-sm text-[#66726C]">{item.reporter?.first_name || "Member"} · {fmtDate(item.created_at)} · {item.response_count || 0} response(s)</p><p className="mt-2 text-sm">{item.details || item.reason || "No further description."}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusTone(item.status)}`}>{String(item.status || "open").replaceAll("_", " ")}</span></div></button>) : <div className={`${BOX} text-center text-sm font-semibold text-[#66726C]`}>No open disputes need a creator response.</div>}</div>
      {selectedId && <section className={`${BOX} mt-6`}><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold">Dispute details</h2><p className="mt-1 text-sm text-[#66726C]">{[activeDetail.service?.name, activeDetail.plan?.name].filter(Boolean).join(" ") || "Access issue"} · {activeDetail.reporter?.first_name || "Member"}</p></div><button type="button" onClick={() => {setSelectedId(null); setDetail(null); setError("");}} className="rounded-lg border px-3 py-2 text-sm font-semibold">Close</button></div>
        {detailBusy ? <p className="mt-4">Loading dispute details…</p> : detail && <>
          <div className="mt-4 grid gap-3 sm:grid-cols-2"><p><b>Status:</b> <span className="capitalize">{String(activeDetail.status || "—").replaceAll("_", " ")}</span></p><p><b>Reported:</b> {fmtDate(activeDetail.created_at)}</p><p><b>Reason:</b> {String(activeDetail.reason || "other").replaceAll("_", " ")}</p><p><b>Group ID:</b> {activeDetail.group_id || "—"}</p></div>
          <p className="mt-4 whitespace-pre-wrap rounded-lg bg-[#F7FAF7] p-4 text-sm">{activeDetail.details || "No additional details were provided."}</p>
          <div className="mt-4"><h3 className="font-bold">Member evidence</h3><Evidence items={evidence}/></div>
          <div className="mt-5"><h3 className="font-bold">Response history</h3>{creatorResponses.length ? <div className="mt-2 space-y-3">{creatorResponses.map((r,i)=><div key={r.response_id || i} className="rounded-lg border border-[#E2E8E2] p-3"><p className="whitespace-pre-wrap text-sm">{r.response || r.message}</p><p className="mt-2 text-xs text-[#66726C]">{fmtDate(r.created_at)}</p><Evidence items={r.evidence || []}/></div>)}</div> : <p className="mt-2 text-sm text-[#66726C]">No creator responses yet.</p>}</div>
          {timeline.length > 0 && <div className="mt-5"><h3 className="font-bold">Investigation history</h3><ol className="mt-2 space-y-2">{timeline.map((entry,i)=><li key={entry.id || i} className="border-l-2 border-[#B1DBB3] pl-3 text-sm"><b className="capitalize">{String(entry.to_status || entry.event_type || "Update").replaceAll("_", " ")}</b><span className="ml-2 text-[#66726C]">{fmtDate(entry.created_at || entry.occurred_at)}</span>{entry.note && <p>{entry.note}</p>}</li>)}</ol></div>}
          {canRespond ? <form onSubmit={sendResponse} className="mt-5 border-t border-[#E2E8E2] pt-5"><label htmlFor="creator-dispute-response" className="font-bold">Your response</label><textarea id="creator-dispute-response" value={response} onChange={(e)=>setResponse(e.target.value)} rows={4} maxLength={2000} required className="mt-2 w-full rounded-lg border border-[#AFC0AF] p-3 outline-none focus:border-[#048B0B]" placeholder="Explain the action you took or provide information for Clyse."/><label className="mt-3 block text-sm font-semibold">Attach evidence (JPG, PNG, PDF; up to 5 MB each)<input type="file" accept="image/jpeg,image/png,application/pdf" multiple onChange={chooseFiles} className="mt-2 block w-full text-sm"/></label>{files.length>0&&<p className="mt-2 text-xs text-[#66726C]">{files.map(f=>f.name).join(", ")}</p>}{notice&&<p role="status" className="mt-3 rounded-lg bg-[#E8F7E8] p-3 text-sm font-semibold text-[#176B21]">{notice}</p>}{error&&<p role="alert" className="mt-3 rounded-lg bg-[#FDE9E9] p-3 text-sm font-semibold text-[#B42318]">{error}</p>}<button disabled={busy||!response.trim()} className="mt-4 h-12 w-full rounded-lg bg-[#048B0B] font-bold text-white disabled:opacity-60">{busy?"Sending…":"Send response to Clyse"}</button></form> : <p className="mt-5 rounded-lg bg-[#F2F4F2] p-3 text-sm font-semibold text-[#66726C]">This dispute is closed to creator responses.</p>}
        </>}
      </section>}
      <Link to="/earnings" className="mt-5 inline-block font-semibold text-[#048B0B]">← Back to earnings</Link>
    </div></div></main></div>;
}
