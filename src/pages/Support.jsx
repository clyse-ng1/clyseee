import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, fmtTx } from "../lib/api";
import {
  MemberPage,
  Panel,
  Pill,
  statusTone,
  humanise,
  Empty,
  ErrorText,
  BackLink,
} from "../components/MemberPage";
import iconQaSupport from "../assets/qa-support.svg";

/* Support centre — built from the endpoints the docs added:
   POST /member/support/issues            open a ticket
   GET  /member/support/issues            the caller's issues
   GET  /member/support/issues/detail     the issue + public conversation
   POST /member/support/issues/reply      reply (moves waiting_user/resolved back to in_progress)
   No Figma artboard exists for this screen; it follows the member-page shell
   and card language used by the wallet/transaction history. */

/* The allowed values are only documented in the ADMIN-009 section:
   account, payments, subscription, group, technical, other. Anything else is
   rejected with 422 "Choose a valid category." — verified against the live API. */
const CATEGORIES = [
  { value: "payments", label: "Payments & wallet" },
  { value: "subscription", label: "Subscription & renewal" },
  { value: "group", label: "Groups, slots & access" },
  { value: "account", label: "Account & security" },
  { value: "technical", label: "Technical problem" },
  { value: "other", label: "Something else" },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

function issueTone(status) {
  const s = `${status || ""}`.toLowerCase();
  if (s === "resolved" || s === "closed") return "good";
  if (s === "waiting_user") return "open";
  return "progress";
}

/* ---------------- list ---------------- */

function IssueRow({ issue, to }) {
  return (
    <Link
      to={to}
      className="block rounded-[12px] border border-clyse bg-white px-[16px] py-[16px] shadow-[0_0_13.87px_rgba(0,23,1,0.06)] transition hover:shadow-[0_0_16px_rgba(0,23,1,0.12)]"
    >
      <div className="flex items-start gap-[12px]">
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] leading-[22px] font-semibold text-black xl:text-[18px]">
            {issue.subject || "Untitled issue"}
          </span>
          <span className="mt-[2px] block text-[13px] leading-[20px] font-semibold text-[#66726C]">
            {CATEGORY_LABEL[issue.category] || humanise(issue.category)}
            {issue.message_count > 0
              ? ` · ${issue.message_count} message${issue.message_count === 1 ? "" : "s"}`
              : ""}
          </span>
        </span>
        <Pill tone={issueTone(issue.status)}>{humanise(issue.status)}</Pill>
      </div>
      <p className="mt-[10px] line-clamp-2 text-[13px] leading-[20px] text-[#66726C]">
        {issue.description || ""}
      </p>
      <p className="mt-[8px] text-[12px] leading-[18px] font-semibold text-[#98A29B]">
        Opened {fmtTx(issue.created_at) || "—"}
        {issue.updated_at && issue.updated_at !== issue.created_at
          ? ` · updated ${fmtTx(issue.updated_at)}`
          : ""}
      </p>
    </Link>
  );
}

export function SupportInbox() {
  const [issues, setIssues] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error: apiError } = await api("/member/support/issues?limit=50");
      if (!live) return;
      if (apiError) {
        setError(apiError.message || "Could not load your support tickets.");
        setIssues([]);
        return;
      }
      setIssues(data?.issues || []);
    })();
    return () => {
      live = false;
    };
  }, []);

  return (
    <MemberPage
      active="Profile"
      title="Support"
      sub="Message the Clyse team about a payment, a group, or your account."
      icon={<img src={iconQaSupport} alt="" className="h-[24px] w-[24px]" />}
      action={
        <Link
          to="/support/new"
          className="hidden h-[47px] items-center justify-center rounded-[20px] bg-btn px-[24px] text-[16px] font-semibold text-white xl:inline-flex"
        >
          + New ticket
        </Link>
      }
    >
      <Link
        to="/support/new"
        className="mb-[16px] flex h-[46px] w-full items-center justify-center rounded-[23px] bg-btn text-[15px] font-semibold text-white xl:hidden"
      >
        + New ticket
      </Link>

      <Panel>
        {error ? (
          <ErrorText text={error} />
        ) : issues === null ? (
          <p className="text-[15px] font-semibold text-[#6B6B6B]">Loading your tickets…</p>
        ) : issues.length === 0 ? (
          <div className="py-[20px] text-center">
            <img src={iconQaSupport} alt="" className="mx-auto h-[54px] w-[54px] opacity-60" />
            <p className="mt-[12px] text-[17px] font-bold text-ink">No support tickets yet</p>
            <p className="mt-[4px] text-[14px] font-semibold text-[#6B6B6B]">
              Open a ticket and the team will reply here.
            </p>
          </div>
        ) : (
          <div className="space-y-[14px]">
            {issues.map((i) => (
              <IssueRow key={i.id} issue={i} to={`/support/${i.id}`} />
            ))}
          </div>
        )}
      </Panel>
    </MemberPage>
  );
}

/* ---------------- thread ---------------- */

function Bubble({ m }) {
  const mine = (m.author_role || "").toLowerCase() === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[86%] rounded-[14px] px-[14px] py-[10px] ${
          mine ? "bg-btn text-white" : "bg-[#F1F5F2] text-ink"
        }`}
      >
        <p className="text-[12px] leading-[16px] font-bold opacity-80">
          {mine ? "You" : (m.author_role || "Clyse").replace(/_/g, " ")}
        </p>
        <p className="mt-[4px] text-[15px] leading-[22px] whitespace-pre-wrap">{m.message}</p>
        {m.created_at && (
          <p className="mt-[6px] text-[11px] leading-[15px] font-semibold opacity-70">
            {fmtTx(m.created_at)}
          </p>
        )}
      </div>
    </div>
  );
}

export function SupportThread() {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [replyError, setReplyError] = useState("");

  const load = useCallback(async () => {
    const { data, error: apiError } = await api(
      `/member/support/issues/detail?issue_id=${encodeURIComponent(issueId)}`,
    );
    if (apiError) {
      setError(apiError.message || "Could not load this ticket.");
      return;
    }
    setIssue(data?.issue || null);
    setMessages(data?.messages || []);
  }, [issueId]);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error: apiError } = await api(
        `/member/support/issues/detail?issue_id=${encodeURIComponent(issueId)}`,
      );
      if (!live) return;
      if (apiError) {
        setError(apiError.message || "Could not load this ticket.");
        return;
      }
      setIssue(data?.issue || null);
      setMessages(data?.messages || []);
    })();
    return () => {
      live = false;
    };
  }, [issueId]);

  const closed = issue && `${issue.status}`.toLowerCase() === "closed";

  const send = async () => {
    const text = reply.trim();
    if (!text || busy) return;
    setBusy(true);
    setReplyError("");
    const { error: apiError } = await api("/member/support/issues/reply", {
      method: "POST",
      body: { issue_id: issueId, message: text },
    });
    setBusy(false);
    if (apiError) {
      setReplyError(apiError.message || "Could not send your reply. Please try again.");
      return;
    }
    setReply("");
    load();
  };

  return (
    <MemberPage
      active="Profile"
      title={issue?.subject || "Support ticket"}
      sub={
        issue
          ? `${CATEGORY_LABEL[issue.category] || humanise(issue.category)} · opened ${
              fmtTx(issue.created_at) || "—"
            }`
          : ""
      }
      icon={<img src={iconQaSupport} alt="" className="h-[24px] w-[24px]" />}
    >
      <div className="mb-[16px] flex items-center justify-between">
        <BackLink to="/support">All tickets</BackLink>
        {issue && <Pill tone={issueTone(issue.status)}>{humanise(issue.status)}</Pill>}
      </div>

      {error ? (
        <Panel>
          <ErrorText text={error} />
        </Panel>
      ) : !issue ? (
        <Panel>
          <p className="text-[15px] font-semibold text-[#6B6B6B]">Loading ticket…</p>
        </Panel>
      ) : (
        <>
          <Panel>
            <p className="text-[12px] leading-[18px] font-bold tracking-wide text-[#98A29B] uppercase">
              Your message
            </p>
            <p className="mt-[6px] text-[15px] leading-[23px] whitespace-pre-wrap text-ink xl:text-[16px]">
              {issue.description || "—"}
            </p>
            {issue.resolution_note && (
              <div className="mt-[16px] rounded-[12px] bg-[#E9F7EA] px-[14px] py-[12px]">
                <p className="text-[12px] font-bold tracking-wide text-[#04640A] uppercase">
                  Resolution
                </p>
                <p className="mt-[4px] text-[14px] leading-[21px] font-semibold text-ink">
                  {issue.resolution_note}
                </p>
              </div>
            )}
          </Panel>

          <Panel className="mt-[16px]">
            <p className="mb-[14px] text-[15px] font-bold text-ink">Conversation</p>
            {messages.length === 0 ? (
              <Empty text="No replies yet. The team will respond here." />
            ) : (
              <div className="space-y-[12px]">
                {messages.map((m) => (
                  <Bubble key={m.id} m={m} />
                ))}
              </div>
            )}
          </Panel>

          <Panel className="mt-[16px]">
            {closed ? (
              <p className="text-[15px] font-semibold text-[#6B6B6B]">
                This ticket is closed. Open a new ticket if you still need help.
              </p>
            ) : (
              <>
                <label
                  htmlFor="support-reply"
                  className="mb-[8px] block text-[14px] font-semibold text-ink"
                >
                  Reply
                </label>
                <textarea
                  id="support-reply"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={3}
                  placeholder="Add to this ticket…"
                  className="w-full rounded-[12px] border border-clyse bg-white px-[14px] py-[12px] text-[15px] leading-[22px] text-ink outline-none focus:border-[#048B0B]"
                />
                {replyError && (
                  <p className="mt-[8px] text-[13px] font-semibold text-[#D22]">{replyError}</p>
                )}
                <button
                  type="button"
                  onClick={send}
                  disabled={!reply.trim() || busy}
                  className="mt-[12px] flex h-[46px] w-full items-center justify-center rounded-[23px] bg-btn text-[15px] font-semibold text-white disabled:opacity-40 xl:w-[200px]"
                >
                  {busy ? "Sending…" : "Send reply"}
                </button>
              </>
            )}
          </Panel>
        </>
      )}

      <button
        type="button"
        onClick={() => navigate("/support")}
        className="mt-[16px] w-full text-[14px] font-semibold text-[#048B0B] hover:underline"
      >
        Back to all tickets
      </button>
    </MemberPage>
  );
}

/* ---------------- new ticket ---------------- */

export function SupportNew() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("payments");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const canSend = useMemo(
    () => subject.trim().length >= 3 && description.trim().length >= 10 && !busy,
    [subject, description, busy],
  );

  const submit = async (e) => {
    e.preventDefault();
    if (!canSend) return;
    setBusy(true);
    setError("");
    const { data, error: apiError } = await api("/member/support/issues", {
      method: "POST",
      body: {
        category,
        subject: subject.trim(),
        description: description.trim(),
      },
    });
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not open your ticket. Please try again.");
      return;
    }
    if (data?.id) navigate(`/support/${data.id}`, { replace: true });
    else navigate("/support", { replace: true });
  };

  return (
    <MemberPage
      active="Profile"
      title="New ticket"
      sub="Tell us what happened and the team will pick it up."
      icon={<img src={iconQaSupport} alt="" className="h-[24px] w-[24px]" />}
    >
      <div className="mb-[16px]">
        <BackLink to="/support">All tickets</BackLink>
      </div>

      <Panel>
        <form onSubmit={submit}>
          <label htmlFor="ticket-category" className="mb-[8px] block text-[14px] font-semibold text-ink">
            What is this about?
          </label>
          <select
            id="ticket-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-[48px] w-full rounded-[12px] border border-clyse bg-white px-[14px] text-[15px] font-semibold text-ink outline-none focus:border-[#048B0B]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label htmlFor="ticket-subject" className="mt-[18px] mb-[8px] block text-[14px] font-semibold text-ink">
            Subject
          </label>
          <input
            id="ticket-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Wallet funding not credited"
            maxLength={120}
            className="h-[48px] w-full rounded-[12px] border border-clyse bg-white px-[14px] text-[15px] text-ink outline-none focus:border-[#048B0B]"
          />

          <label htmlFor="ticket-body" className="mt-[18px] mb-[8px] block text-[14px] font-semibold text-ink">
            Details
          </label>
          <textarea
            id="ticket-body"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="What happened, and what did you expect?"
            className="w-full rounded-[12px] border border-clyse bg-white px-[14px] py-[12px] text-[15px] leading-[22px] text-ink outline-none focus:border-[#048B0B]"
          />

          {error && <p className="mt-[10px] text-[13px] font-semibold text-[#D22]">{error}</p>}

          <div className="mt-[18px] flex flex-col gap-[10px] xl:flex-row">
            <button
              type="submit"
              disabled={!canSend}
              className="flex h-[48px] items-center justify-center rounded-[24px] bg-btn px-[28px] text-[15px] font-semibold text-white disabled:opacity-40"
            >
              {busy ? "Opening…" : "Open ticket"}
            </button>
            <Link
              to="/support"
              className="flex h-[48px] items-center justify-center rounded-[24px] border border-clyse px-[28px] text-[15px] font-semibold text-ink"
            >
              Cancel
            </Link>
          </div>
        </form>
      </Panel>
    </MemberPage>
  );
}

/* Attach-evidence control used by the report flow (POST /member/reports/evidence
   takes raw bytes, not multipart, so the file is sent as the request body). */
export function EvidenceUpload({ reportId, onUploaded }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(0);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "application/pdf"].includes(file.type)) {
      setError("Attach a JPEG, PNG or PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("That file is over 5 MB.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: apiError } = await api(
      `/member/reports/evidence?report_id=${encodeURIComponent(reportId)}`,
      { method: "POST", raw: true, contentType: file.type, body: file },
    );
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not attach that file.");
      return;
    }
    setDone((n) => n + 1);
    onUploaded?.();
  };

  return (
    <div className="mt-[10px]">
      <label className="inline-flex cursor-pointer items-center gap-[8px] rounded-[18px] border border-clyse px-[16px] py-[8px] text-[13px] font-semibold text-ink">
        <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={pick} className="hidden" />
        {busy ? "Uploading…" : "Attach evidence"}
      </label>
      {done > 0 && (
        <span className="ml-[10px] text-[12px] font-semibold text-[#04640A]">
          {done} attached
        </span>
      )}
      {error && <p className="mt-[6px] text-[12px] font-semibold text-[#D22]">{error}</p>}
    </div>
  );
}
