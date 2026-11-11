import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminShell, { DarkButton, PageTitle } from "../components/AdminShell";
import { API_BASE, api, fmtDate, getSession, kobo } from "../lib/api";

/* Live admin workspace. The API reference documents ADMIN-001–018; this
   component renders real response data and never substitutes mock records. */
const PAGE = {
  dashboard: { title: "Admin Dashboard", active: "dashboard", url: () => "/admin/data/dashboard", dashboard: true },
  requests: { title: "Custom Subscription Requests", active: "subscriptions", sub: "requests", unsupported: true, unsupportedMessage: "The current API reference documents subscription requests for members, but does not expose an admin request-queue endpoint. No sample records are shown here; connect this screen when the admin endpoint is available." },
  roleCreate: { title: "Create Admin Role", active: "settings", sub: "create-role", unsupported: true, unsupportedMessage: "The Figma frame shows role creation, but the current API reference does not expose a create-role endpoint. Role permissions and admin assignments are available in their respective screens." },
  services: { title: "Subscription Catalogue", active: "subscriptions", sub: "services", collection: "services", url: (q) => `/admin/catalogue/services${q}`, detail: "/admin/catalogue/services/detail", idKey: "service_id", filters: ["status", "q"], actions: ["Change service status", "Edit service"], create: "service" },
  plans: { title: "Subscription Plans", active: "subscriptions", sub: "plans", collection: "plans", url: (q) => `/admin/catalogue/plans${q}`, detail: "/admin/catalogue/plans/detail", idKey: "plan_id", filters: ["service_id", "status", "q"], actions: ["Change plan status", "Edit plan"], create: "plan" },
  catalogueEvents: { title: "Catalogue Activity", active: "subscriptions", sub: "events", collection: "events", url: (q) => `/admin/catalogue/events${q}`, filters: ["entity_type", "entity_id"] },
  review: { title: "Group Review Queue", active: "verification", sub: "review", collection: "groups", url: (q) => `/admin/groups/review${q}`, detail: "/admin/groups/review/detail", idKey: "group_id", filters: ["status", "verification_status", "q"], actions: ["Review"] },
  users: { title: "User Management", active: "users", sub: "um", collection: "users", url: (q) => `/admin/users${q}`, detail: "/admin/users/detail", idKey: "user_id", filters: ["status", "role", "q"], actions: ["Change status"] },
  groups: { title: "Group Management", active: "users", sub: "gm", collection: "groups", url: (q) => `/admin/groups${q}`, detail: "/admin/groups/detail", idKey: "group_id", filters: ["status", "verification_status", "q"], actions: ["Change status"] },
  disputes: { title: "Disputes", active: "finance", sub: "disputes", collection: "disputes", url: (q) => `/admin/disputes${q}`, detail: "/admin/disputes/detail", idKey: "report_id", filters: ["status", "q"], actions: ["Request information", "Resolve"] },
  transactions: { title: "Transactions", active: "finance", sub: "transactions", collection: "transactions", url: (q) => `/admin/finance/transactions${q}`, detail: "/admin/finance/transactions/detail", idKey: "transaction_id", filters: ["category", "status", "user_id", "group_id", "reference", "q", "from", "to"], actions: ["Run ledger integrity check"] },
  walletFundings: { title: "Wallet Fundings", active: "finance", sub: "fundings", collection: "fundings", url: (q) => `/admin/finance/wallet-fundings${q}`, filters: ["status", "user_id", "q", "from", "to"] },
  creatorEarnings: { title: "Creator Earnings", active: "finance", sub: "earnings", collection: "earnings", url: (q) => `/admin/finance/creator-earnings${q}`, filters: ["status", "creator_id", "q"] },
  payouts: { title: "Payouts", active: "finance", sub: "payouts", collection: "payouts", url: (q) => `/admin/finance/payouts${q}`, filters: ["status", "creator_id", "q", "from", "to"] },
  reconciliation: { title: "Reconciliation", active: "finance", sub: "recon", collection: "reconciliations", url: (q) => `/admin/finance/reconciliations${q}`, detail: "/admin/finance/reconciliations/detail", idKey: "id", filters: ["status", "from", "to"], actions: ["Run reconciliation"] },
  exceptions: { title: "Reconciliation Exceptions", active: "finance", sub: "exceptions", collection: "exceptions", url: (q) => `/admin/finance/reconciliations/exceptions${q}`, filters: ["run_id", "status", "kind"], actions: ["Update exception"] },
  audit: { title: "Audit Logs", active: "audit", collection: "logs", url: (q) => `/admin/audit-logs${q}`, detail: "/admin/audit-logs/detail", idKey: "id", filters: ["action", "entity_type", "entity_id", "actor_id", "target_user_id", "result", "q", "from", "to"] },
  support: { title: "Support Issues", active: "support", collection: "issues", url: (q) => `/admin/support/issues${q}`, detail: "/admin/support/issues/detail", idKey: "issue_id", filters: ["status", "category", "priority", "assigned_to", "q"], actions: ["Reply", "Update status", "Set priority", "Assign issue"], overviewKey: "support" },
  moderation: { title: "Moderation Records", active: "security", sub: "moderation", collection: "records", url: (q) => `/admin/moderation/records${q}`, detail: "/admin/moderation/records/detail", idKey: "id", filters: ["target_type", "target_id", "action", "q", "from", "to"], actions: ["Moderate target"], overviewKey: "moderation" },
  roles: { title: "Roles & Permissions", active: "settings", sub: "roles", collection: "roles", url: (q) => `/admin/roles${q}`, filters: ["q"], actions: ["Change permission"] },
  roleHistory: { title: "Role History", active: "settings", sub: "role-history", collection: "events", url: (q) => `/admin/roles/history${q}`, filters: ["user_id", "role"] },
  admins: { title: "Administrators", active: "settings", sub: "admin-roles", collection: "admins", url: (q) => `/admin/admins${q}`, detail: "/admin/admins/detail", idKey: "user_id", filters: ["status", "role", "q"], actions: ["Assign role", "Change status"] },
  config: { title: "Platform Configuration", active: "settings", sub: "system-configuration", collection: "settings", url: (q) => `/admin/config${q}`, detail: "/admin/config/detail", idKey: "key", filters: ["category", "q"], actions: ["Update setting"] },
  configHistory: { title: "Configuration History", active: "settings", sub: "config-history", collection: "events", url: (q) => `/admin/config/history${q}`, filters: ["key"] },
  templates: { title: "Message Templates", active: "notifications", sub: "templates", collection: "templates", url: (q) => `/admin/templates${q}`, detail: "/admin/templates/detail", idKey: "id", filters: ["category", "channel", "status", "q"], actions: ["Edit template", "Change template status", "Preview template"], create: "template" },
  templateVersions: { title: "Template Versions", active: "notifications", sub: "versions", collection: "versions", url: (q) => `/admin/templates/versions${q}`, filters: ["id"] },
  templatePlaceholders: { title: "Template Placeholders", active: "notifications", sub: "placeholders", collection: null, url: () => "/admin/templates/placeholders", dashboard: true },
  communications: { title: "Communications", active: "notifications", sub: "communications", collection: "communications", url: (q) => `/admin/communications${q}`, detail: "/admin/communications/detail", idKey: "id", filters: ["status", "category", "q", "from", "to"], actions: ["Edit draft", "Preview audience", "Send", "Cancel"], create: "communication" },
  communicationRecipients: { title: "Delivery Recipients", active: "notifications", sub: "recipients", collection: "recipients", url: (q) => `/admin/communications/recipients${q}`, filters: ["id", "status"] },
  communicationChannels: { title: "Delivery Channels", active: "notifications", sub: "channels", collection: null, url: () => "/admin/communications/channels", dashboard: true },
  reportSubscriptions: { title: "Subscription Reports", active: "reports", sub: "subscriptions-report", collection: null, url: (q) => `/admin/reports/subscriptions${q}`, filters: ["from", "to", "service_id", "plan_id", "request_status", "group_status", "q"], export: "/admin/reports/subscriptions/export", dashboard: true },
  reportGroups: { title: "Group Reports", active: "reports", sub: "groups-report", collection: "groups", url: (q) => `/admin/reports/groups${q}`, filters: ["from", "to", "service_id", "plan_id", "status", "verification_status", "q"], export: "/admin/reports/groups/export" },
  securityEvents: { title: "Security Events", active: "security", sub: "events", collection: "events", url: (q) => `/admin/security/events${q}`, filters: ["event_type", "severity", "user_id", "ip", "q", "from", "to"] },
  securityIncidents: { title: "Security Incidents", active: "security", sub: "incidents", collection: "incidents", url: (q) => `/admin/security/incidents${q}`, detail: "/admin/security/incidents/detail", idKey: "id", filters: ["status", "severity", "incident_type", "q", "from", "to"], actions: ["Update incident"] },
  securityAlerts: { title: "Security Alerts", active: "security", sub: "alerts", collection: "alerts", url: (q) => `/admin/security/alerts${q}`, filters: ["status"] },
  securitySummary: { title: "Security Overview", active: "security", sub: "summary", collection: null, url: (q) => `/admin/security/summary${q}`, filters: ["from", "to"], dashboard: true, actions: ["Scan security events", "Run retention preview"] },
  health: { title: "System Health", active: "security", sub: "health", collection: null, url: (q) => `/admin/health/status${q}`, filters: ["from", "to"], dashboard: true, actions: ["Run checks"] },
  healthHistory: { title: "Health Check History", active: "security", sub: "health-history", collection: "checks", url: (q) => `/admin/health/history${q}`, detail: "/admin/health/runs/detail", idKey: "id", filters: ["service_key", "from", "to"] },
  healthIncidents: { title: "System Incidents", active: "security", sub: "health-incidents", collection: "incidents", url: (q) => `/admin/health/incidents${q}`, detail: "/admin/health/incidents/detail", idKey: "id", filters: ["status", "severity", "service_key", "q", "from", "to"], actions: ["Update incident"] },
};

const FILTER_OPTIONS = {
  services: { status: ["active", "inactive", "pending", "rejected"] }, plans: { status: ["active", "inactive"] },
  review: { status: ["pending_review", "active", "rejected", "suspended", "closed"], verification_status: ["pending", "verified", "rejected"] },
  users: { status: ["active", "suspended", "deactivated"], role: ["admin", "user"] }, groups: { status: ["pending_review", "active", "rejected", "suspended", "closed"], verification_status: ["pending", "verified", "rejected"] },
  disputes: { status: ["open", "under_review", "resolved", "rejected"] },
  transactions: { category: ["wallet_funding", "subscription_payment", "fee", "refund", "reversal", "creator_earnings", "adjustment"], status: ["posted", "pending", "successful", "failed", "completed", "reversed", "reversed_pending"] },
  walletFundings: { status: ["pending", "succeeded", "failed", "reversed"] }, payouts: { status: ["pending", "processing", "paid", "failed", "reversed"] },
  reconciliation: { status: ["ok", "discrepancies", "failed"] }, exceptions: { status: ["open", "investigating", "resolved", "ignored"] },
  support: { status: ["open", "in_progress", "waiting_user", "resolved", "closed"], category: ["account", "payments", "subscription", "group", "technical", "other"], priority: ["low", "normal", "high", "urgent"] },
  moderation: { target_type: ["user", "group"], action: ["warning", "restriction", "suspension", "restoration"] }, audit: { result: ["succeeded", "failed"] },
  templates: { channel: ["in_app", "email", "sms", "push"], status: ["active", "inactive"] }, communications: { status: ["draft", "scheduled", "sending", "sent", "cancelled", "failed"] },
  config: { category: ["platform", "subscriptions", "payments", "payouts", "notifications", "security", "health", "audit"] },
  securityEvents: { severity: ["info", "low", "medium", "high", "critical"] },
  securityIncidents: { status: ["open", "acknowledged", "investigating", "resolved", "closed"], severity: ["info", "low", "medium", "high", "critical"] },
  securityAlerts: { status: ["pending", "sent", "acknowledged", "dismissed"] }, healthIncidents: { status: ["open", "monitoring", "resolved", "closed"], severity: ["low", "medium", "high", "critical"] },
};

const LABEL = (s) => String(s).replaceAll("_", " ").replaceAll(".", " ").replace(/\b\w/g, (c) => c.toUpperCase());
const valueText = (value, key = "") => {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  if (typeof value === "object") return value.name || value.full_name || value.title || value.id || "Details";
  if (key.endsWith("_kobo") || key.includes("amount_kobo") || key.includes("price_kobo")) return kobo(value);
  if (/(^|_)(created_at|updated_at|date|at)$/.test(key) && typeof value === "string") return fmtDate(value);
  return String(value);
};
const queryString = (params) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, value]) => {
    if (value === "" || value == null) return;
    let v = value;
    // Date filters are picked in the admin's own timezone. Appending "Z" treated
    // them as UTC, so "from 5 Nov" actually started at 01:00 Lagos time. Parse
    // the local wall-clock value, then send the real UTC instant.
    if ((k === "from" || k === "to") && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
      const local = new Date(`${value}T${k === "from" ? "00:00:00" : "23:59:59"}`);
      v = Number.isNaN(local.getTime()) ? value : local.toISOString();
    }
    q.set(k, v);
  });
  const out = q.toString();
  return out ? `?${out}` : "";
};
function SkeletonTable() {
  return <div className="overflow-hidden rounded-[14px] border border-[#D8E2D9] bg-white">{Array.from({ length: 6 }, (_, i) => <div key={i} className="flex h-[62px] items-center gap-4 border-b border-[#EEF2EE] px-5">{Array.from({ length: 5 }, (_, j) => <span key={j} className="h-4 flex-1 rounded bg-[#EAF0EA]" />)}</div>)}</div>;
}

function flattenMetrics(value, path = [], out = []) {
  if (!value || typeof value !== "object") {
    out.push({ label: path.map(LABEL).join(" / ") || "Summary", value, key: path.at(-1) || "" });
    return out;
  }
  if (Array.isArray(value)) {
    out.push({ label: path.map(LABEL).join(" / "), list: value.slice(0, 5), count: value.length });
    return out;
  }
  Object.entries(value).forEach(([key, child]) => flattenMetrics(child, [...path, key], out));
  return out;
}

function OverviewTiles({ data }) {
  const metrics = flattenMetrics(data).filter((item) => item.label);
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{metrics.map((item, i) => <section key={`${item.label}-${i}`} className="rounded-[14px] border border-[#D8E2D9] bg-white p-5 shadow-sm"><h2 className="text-xs font-bold uppercase tracking-wide text-[#647164]">{item.label}</h2>{item.list ? <><div className="mt-2 text-3xl font-bold text-[#001701]">{item.count}</div><div className="mt-3 space-y-2">{item.list.map((row, j) => <div key={j} className="flex items-center justify-between gap-3 border-t border-[#EDF1ED] pt-2 text-sm"><span className="truncate font-semibold text-[#203020]">{row?.name || row?.service || row?.event || row?.key || `Item ${j + 1}`}</span><span className="shrink-0 text-[#5B6B5C]">{valueText(row?.status || row?.severity || row?.state || row?.result || "", "status")}</span></div>)}</div></> : <div className="mt-2 text-3xl font-bold text-[#001701]">{valueText(item.value, item.key)}</div>}</section>)}</div>;
}

function DetailView({ data, onClose }) {
  if (!data) return null;
  return <section className="mt-5 rounded-[14px] border border-[#B9D8BB] bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold text-[#001701]">Record details</h2><button className="rounded-lg border px-3 py-2 text-sm font-semibold" onClick={onClose}>Close</button></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Object.entries(data).map(([key, value]) => <div key={key} className="min-w-0 rounded-lg bg-[#F7FAF7] p-3"><div className="text-xs font-bold uppercase tracking-wide text-[#687568]">{LABEL(key)}</div>{value && typeof value === "object" ? <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-words text-xs text-[#263526]">{JSON.stringify(value, null, 2)}</pre> : <div className="mt-1 break-words text-sm font-semibold text-[#001701]">{valueText(value, key)}</div>}</div>)}</div></section>;
}

function ConfigEditor({ settings, onSave }) {
  const categories = [...new Set(settings.map((item) => item.category || "platform"))];
  const [active, setActive] = useState(categories[0] || "platform");
  const [drafts, setDrafts] = useState(() => Object.fromEntries(settings.map((item) => [item.key, item.value])));
  const visible = settings.filter((item) => (item.category || "platform") === active);
  const save = () => {
    const updates = settings
      .filter((item) => JSON.stringify(drafts[item.key]) !== JSON.stringify(item.value))
      .map((item) => ({ key: item.key, value: drafts[item.key] }));
    if (updates.length) onSave(updates);
  };
  const reset = () => setDrafts(Object.fromEntries(settings.map((item) => [item.key, item.value])));
  return (
    <section className="mt-6 rounded-[16px] border border-[#D8E2D9] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-[#E5EBE5] pb-4">
        {categories.map((category) => (
          <button key={category} onClick={() => setActive(category)} className={`rounded-lg px-4 py-2 text-sm font-semibold ${active === category ? "bg-[#E6F5E6] text-[#048B0B]" : "text-[#536253] hover:bg-[#F4F8F4]"}`}>
            {LABEL(category)}
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {visible.map((setting) => (
          <label key={setting.key} className="flex min-w-0 flex-col gap-2 rounded-xl border border-[#E3E9E3] p-4">
            <span className="font-bold text-[#001701]">{LABEL(setting.label || setting.key)}</span>
            <span className="text-xs text-[#657165]">{setting.key}{setting.is_secret ? " · secret value" : ""}</span>
            {typeof setting.value === "boolean" || setting.value_type === "boolean" ? (
              <input type="checkbox" checked={Boolean(drafts[setting.key])} onChange={(e) => setDrafts((old) => ({ ...old, [setting.key]: e.target.checked }))} className="h-5 w-5 accent-[#048B0B]" />
            ) : (
              <input type={setting.value_type === "number" || typeof setting.value === "number" ? "number" : "text"} value={drafts[setting.key] ?? ""} placeholder={setting.is_secret ? "Set a new secret value" : ""} onChange={(e) => setDrafts((old) => ({ ...old, [setting.key]: setting.value_type === "number" ? Number(e.target.value) : e.target.value }))} className="h-11 rounded-lg border border-[#AFC0AF] px-3 text-sm outline-none focus:border-[#048B0B]" />
            )}
          </label>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <button onClick={reset} className="h-11 rounded-lg border border-[#9EAE9E] px-5 text-sm font-semibold">Reset</button>
        <button onClick={save} className="h-11 rounded-lg bg-[#001701] px-6 text-sm font-semibold text-white">Save changes</button>
      </div>
    </section>
  );
}

function SupportDetail({ data, reply, setReply, onSend, onClose, sending }) {
  const issue = data?.issue || data?.support_issue || data || {};
  const history = data?.messages || data?.replies || data?.activity || data?.events || [];
  const reporter = issue.reporter || issue.user || {};
  const authorName = (person) => person?.full_name || person?.name || person?.first_name || "Support update";
  const dateText = (value) => value ? new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" }) : "—";
  return <section className="mt-5 space-y-4">
    <div className="flex items-center justify-between"><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-[#EAF4EA] text-xl" aria-label="Back to support issues">‹</button><div className="flex gap-2"><span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-800">{LABEL(issue.status || "open")}</span><span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">{LABEL(issue.priority || "normal")}</span></div></div>
    <div className="rounded-[18px] border border-[#D4DDD4] bg-white p-6 shadow-sm"><div className="grid gap-5 md:grid-cols-4">{[["Reported By",authorName(reporter)], ["Category",LABEL(issue.category || "other")], ["Submitted",dateText(issue.created_at || issue.submitted_at)], ["Assigned To",issue.assigned_admin?.full_name || issue.assignee?.full_name || issue.assigned_to || "Unassigned"]].map(([label, value]) => <div key={label} className="border-l border-[#E2E7E2] pl-4 first:border-0 first:pl-0"><div className="text-sm font-semibold text-[#687568]">{label}</div><div className="mt-2 break-words font-bold text-[#001701]">{value}</div>{label === "Reported By" && reporter.email && <div className="text-sm text-[#657165]">{reporter.email}</div>}</div>)}</div></div>
    <div className="rounded-[18px] border border-[#D4DDD4] bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-[#001701]">Issue Description</h2><p className="mt-3 border-b border-[#E2E7E2] pb-5 text-[#374637]">{issue.description || issue.subject || issue.message || "No description was supplied."}</p><h2 className="mt-5 text-lg font-bold text-[#001701]">Activity & Update</h2><div className="mt-4 space-y-4">{history.length ? history.map((item, i) => <div key={item.id || i} className="border-b border-[#E2E7E2] pb-4"><div className="flex items-center justify-between gap-3"><span className="font-bold text-[#001701]">{authorName(item.author || item.user || item.admin)} <span className="font-normal text-[#657165]">({item.author_role || item.role || "User"})</span></span><time className="text-sm text-[#657165]">{dateText(item.created_at || item.sent_at)}</time></div><p className="mt-2 font-semibold text-[#253725]">{item.message || item.body || item.note || item.description || "Update"}</p></div>) : <p className="text-sm text-[#657165]">No activity has been recorded yet.</p>}</div><form className="mt-5" onSubmit={(e) => { e.preventDefault(); onSend(); }}><label className="mb-2 block font-bold text-[#001701]" htmlFor="support-reply">Reply to User</label><textarea id="support-reply" value={reply} onChange={(e) => setReply(e.target.value)} rows={4} maxLength={4000} placeholder="Write a reply…" className="w-full resize-y rounded-xl border border-[#BFC9BF] px-4 py-3 outline-none focus:border-[#048B0B]" /><button disabled={sending || !reply.trim()} className="mt-4 h-14 w-full rounded-xl bg-[#048B0B] font-bold text-white disabled:opacity-50">{sending ? "Sending…" : "Send"}</button></form></div>
  </section>;
}

export default function AdminDataPage({ page = "dashboard" }) {
  const conf = PAGE[page] || PAGE.dashboard;
  useEffect(() => { document.title = `${conf.title} — Clyse CMS`; }, [conf.title]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => Object.fromEntries((conf.filters || []).map((x) => [x, searchParams.get(x) || ""])));
  const [data, setData] = useState(null);
  const [overview, setOverview] = useState(null);
  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [reply, setReply] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pageInfo, setPageInfo] = useState(null);
  const cursorRef = useRef(null);
  const [refresh, setRefresh] = useState(0);
  const recordId = searchParams.get("id");
  const activeParams = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value)), [filters]);

  const load = useCallback(async (append = false) => {
    if (append) setMoreLoading(true);
    const before = append ? cursorRef.current : null;
    if (!append) cursorRef.current = null;
    const res = await api(conf.url(queryString({ ...activeParams, ...(before ? { before } : {}) })));
    if (res.error) {
      setError(res.error.message || "Could not load this page.");
      if (!append) { setData(null); setRows([]); setPageInfo(null); }
    } else {
      setError("");
      const result = res.data || {};
      setData(result);
      const nextRows = conf.collection ? (Array.isArray(result?.[conf.collection]) ? result[conf.collection] : Array.isArray(result?.data?.[conf.collection]) ? result.data[conf.collection] : []) : [];
      setRows((prior) => append ? [...prior, ...nextRows] : nextRows);
      setPageInfo(result?.page || null);
      cursorRef.current = result?.page?.next_cursor || null;
    }
    setLoading(false); setMoreLoading(false);
  }, [conf, activeParams]);

  // oxlint-disable-next-line react/set-state-in-effect -- this starts an async API request; results update state after the response.
  useEffect(() => { if (!conf.unsupported) load(false); }, [conf.unsupported, load, refresh]);
  useEffect(() => {
    if (!conf.overviewKey) return undefined;
    let alive = true;
    api("/admin/dashboard").then((res) => { if (alive && !res.error) setOverview(res.data?.[conf.overviewKey] || null); });
    return () => { alive = false; };
  }, [conf.overviewKey]);
  useEffect(() => {
    let alive = true;
    if (!recordId || !conf.detail) return () => { alive = false; };
    const suffix = queryString({ [conf.idKey || "id"]: recordId });
    api(`${conf.detail}${suffix}`).then((res) => {
      if (!alive) return;
      if (res.error) { setError(res.error.message || "Could not load record details."); setDetail({ detail_error: res.error.message }); setDetailId(recordId); }
      else { setDetail(res.data || null); setDetailId(recordId); }
    });
    return () => { alive = false; };
  }, [recordId, conf, refresh]);

  const setFilter = (key, value) => setFilters((prior) => ({ ...prior, [key]: value }));
  const openDetails = (row) => {
    const id = row?.[conf.idKey] ?? row?.id ?? row?.service_id ?? row?.plan_id ?? row?.group_id ?? row?.user_id ?? row?.report_id ?? row?.issue_id ?? row?.transaction_id ?? row?.key;
    if (!id) return;
    setSearchParams((prev) => { const next = new URLSearchParams(prev); next.set("id", id); return next; });
  };
  const closeDetails = () => { setReply(""); setSearchParams((prev) => { const next = new URLSearchParams(prev); next.delete("id"); return next; }); };
  const sendSupportReply = async () => {
    if (!reply.trim() || !recordId) return;
    setReplySending(true); setError("");
    const res = await api("/admin/support/issues/reply", { method: "POST", body: { issue_id: recordId, message: reply.trim(), internal: false, request_info: false } });
    setReplySending(false);
    if (res.error) setError(res.error.message || "Reply could not be sent.");
    else { setReply(""); setNotice("Reply sent to the user."); setRefresh((n) => n + 1); }
  };

  const runAction = async (action, row = null) => {
    const id = row?.[conf.idKey] ?? row?.id ?? row?.service_id ?? row?.plan_id ?? row?.group_id ?? row?.user_id ?? row?.report_id ?? row?.issue_id ?? row?.transaction_id ?? row?.key;
    const ask = (label, defaultValue = "") => window.prompt(label, defaultValue)?.trim();
    let endpoint = ""; let body = {}; let method = "POST";
    switch (`${page}:${action}`) {
      case "services:Change service status": endpoint = "/admin/catalogue/services/status"; body = { service_id: id, is_active: !row?.is_active }; break;
      case "services:Edit service": { const name = ask("Service name", row?.name || ""); const slug = ask("Service slug", row?.slug || ""); const category = ask("Category", row?.category || "other"); if (!name || !slug || !category) return; endpoint = "/admin/catalogue/services"; method = "PATCH"; body = { service_id: id, name, slug, category }; break; }
      case "plans:Change plan status": endpoint = "/admin/catalogue/plans/status"; body = { plan_id: id, is_active: !row?.is_active }; break;
      case "plans:Edit plan": { const unit_price_kobo = Number(ask("Unit price in kobo", String(row?.unit_price_kobo || ""))); const platform_fee_kobo = Number(ask("Platform fee in kobo", String(row?.platform_fee_kobo || ""))); const member_slot_capacity = Number(ask("Member slot capacity", String(row?.member_slot_capacity || ""))); if (![unit_price_kobo, platform_fee_kobo, member_slot_capacity].every(Number.isFinite)) return; endpoint = "/admin/catalogue/plans"; method = "PATCH"; body = { plan_id: id, unit_price_kobo, platform_fee_kobo, member_slot_capacity }; break; }
      case "review:Review": { const choice = ask("Action: approve, reject, suspend, or resume", "approve"); if (!choice || !["approve", "reject", "suspend", "resume"].includes(choice)) return; const reason = ["reject", "suspend"].includes(choice) ? ask("Reason (required)") : null; if (["reject", "suspend"].includes(choice) && !reason) return; endpoint = "/admin/groups/review"; body = { group_id: id, action: choice, reason }; break; }
      case "users:Change status": body = { user_id: id, status: ask("New status: active, suspended, or deactivated", row?.status || "suspended"), reason: ask("Reason for this status change") }; endpoint = "/admin/users/status"; break;
      case "groups:Change status": body = { group_id: id, status: ask("New status (as permitted by this group)", row?.status || "suspended"), reason: ask("Reason") }; endpoint = "/admin/groups/status"; break;
      case "disputes:Request information": { const target = ask("Who should provide information? member, creator, or both", "creator"); const message = ask("Message to send"); if (!message) return; endpoint = "/admin/disputes/info-request"; body = { report_id: id, target, message }; break; }
      case "disputes:Resolve": { const outcome = ask("Outcome: refund_full, refund_partial, release, or rejected", "release"); const note = ask("Resolution note"); if (!outcome || !note) return; body = { report_id: id, outcome, note }; if (outcome === "refund_partial") body.amount_kobo = Number(ask("Partial refund amount in kobo", "0")); endpoint = "/admin/disputes/resolve"; break; }
      case "support:Reply": { const message = ask("Reply message"); if (!message) return; endpoint = "/admin/support/issues/reply"; body = { issue_id: id, message, internal: false, request_info: false }; break; }
      case "support:Update status": { const status = ask("Status: open, in_progress, waiting_user, resolved, or closed", row?.status || "in_progress"); const note = ["resolved", "closed"].includes(status) ? ask("Resolution note (required)") : undefined; endpoint = "/admin/support/issues/update"; body = { issue_id: id, status, ...(note ? { note } : {}) }; break; }
      case "support:Set priority": endpoint = "/admin/support/issues/priority"; body = { issue_id: id, priority: ask("Priority: low, normal, high, or urgent", row?.priority || "high") }; break;
      case "support:Assign issue": endpoint = "/admin/support/issues/assign"; body = { issue_id: id, assignee_id: ask("Admin user ID to assign this issue to") }; break;
      case "exceptions:Update exception": { const status = ask("Status: investigating, resolved, or ignored", row?.status || "investigating"); const note = ["resolved", "ignored"].includes(status) ? ask("Note (required)") : undefined; endpoint = "/admin/finance/reconciliations/resolve"; body = { exception_id: id, status, ...(note ? { note } : {}) }; break; }
      case "templates:Edit template": { const subject = ask("Template subject", row?.subject || ""); const bodyText = ask("Template body", row?.body || ""); const change_note = ask("Change note", "Content update"); if (subject == null || bodyText == null || !change_note) return; endpoint = "/admin/templates"; method = "PATCH"; body = { id, subject, body: bodyText, change_note }; break; }
      case "templates:Preview template": endpoint = "/admin/templates/preview"; body = { subject: row?.subject || "", body: row?.body || "", variables: {} }; break;
      case "templates:Change template status": { const active = ask("Set status to active or inactive", row?.active ? "inactive" : "active"); endpoint = "/admin/templates/status"; body = { id, active: active === "active" }; break; }
      case "communications:Edit draft": { const title = ask("Communication title", row?.title || ""); const bodyText = ask("Message body", row?.body || ""); if (title == null || bodyText == null) return; endpoint = "/admin/communications"; method = "PATCH"; body = { id, title, body: bodyText }; break; }
      case "communications:Preview audience": { const title = ask("Message title", row?.title || ""); const bodyText = ask("Message body", row?.body || ""); let audience; try { audience = JSON.parse(ask('Audience JSON (example: {"type":"all"})', JSON.stringify(row?.audience || { type: "all" }))); } catch { setError("Audience must be valid JSON."); return; } if (!title || !bodyText) return; endpoint = "/admin/communications/preview"; body = { audience, title, body: bodyText }; break; }
      case "communications:Send": endpoint = "/admin/communications/send"; body = { id }; break;
      case "communications:Cancel": { const reason = ask("Reason for cancelling this communication"); if (!reason) return; endpoint = "/admin/communications/cancel"; body = { id, reason }; break; }
      case "admins:Assign role": endpoint = "/admin/admins/assign"; body = { user_id: id, role: ask("Role name", row?.role || "support") }; break;
      case "admins:Change status": endpoint = "/admin/admins/status"; body = { user_id: id, status: ask("Status", row?.status || "inactive") }; break;
      case "roles:Change permission": endpoint = "/admin/roles/permissions"; body = { role: ask("Role name", row?.role || "support"), permission: ask("Permission key (e.g. support.manage)", row?.key || ""), granted: ask("Grant or revoke? enter true / false", "true") === "true" }; break;
      case "config:Update setting": { const value = ask("New setting value (JSON or text)"); if (value == null) return; let parsed = value; try { parsed = JSON.parse(value); } catch {} endpoint = "/admin/config"; body = { updates: [{ key: row?.key, value: parsed }] }; break; }
      case "moderation:Moderate target": { const targetType = ask("Target type: user or group", row?.target_type || "user"); const actionValue = ask("Action: warning, restriction, suspension, or restoration", "warning"); const reason = ask("Reason"); if (!reason) return; endpoint = targetType === "group" ? "/admin/moderation/groups" : "/admin/moderation/users"; body = targetType === "group" ? { group_id: row?.target_id || id, action: actionValue, reason } : { user_id: row?.target_id || id, action: actionValue, reason }; break; }
      case "securityIncidents:Update incident": case "healthIncidents:Update incident": { const status = ask("New incident status", row?.status || "investigating"); const note = ["resolved", "closed"].includes(status) ? ask("Required resolution note") : undefined; endpoint = page === "healthIncidents" ? "/admin/health/incidents/update" : "/admin/security/incidents/update"; body = { id, status, ...(note ? { note } : {}) }; break; }
      case "transactions:Run ledger integrity check": if (!window.confirm("Run the ledger integrity check now?")) return; endpoint = "/admin/finance/reconcile"; body = {}; break;
      case "reconciliation:Run reconciliation": if (!window.confirm("Run a reconciliation for the default last 30 days?")) return; endpoint = "/admin/finance/reconciliations/run"; body = {}; break;
      case "health:Run checks": endpoint = "/admin/health/run"; body = {}; break;
      case "securitySummary:Scan security events": endpoint = "/admin/security/scan"; body = {}; break;
      case "securitySummary:Run retention preview": endpoint = "/admin/security/retention"; body = { dry_run: true }; break;
      default: return;
    }
    if (!endpoint || Object.values(body).some((v) => v === null || v === "" || (typeof v === "number" && Number.isNaN(v)))) return;
    setNotice(""); setError("");
    const res = await api(endpoint, { method, body });
    if (res.error) setError(res.error.message || "The action could not be completed.");
    else { setNotice("Action completed successfully."); setDetail(res.data || null); setLoading(true); setRefresh((v) => v + 1); }
  };

  const columns = useMemo(() => {
    const preferred = ["name", "title", "id", "status", "category", "role", "email", "created_at", "updated_at", "amount_kobo", "total_kobo"];
    const keys = rows.length ? Object.keys(rows[0]).filter((key) => typeof rows[0][key] !== "object" || rows[0][key] === null) : [];
    return [...keys].sort((a, b) => { const ai = preferred.indexOf(a); const bi = preferred.indexOf(b); return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi); }).slice(0, 7);
  }, [rows]);

  const performCreate = async () => {
    let endpoint; let body;
    if (conf.create === "service") {
      const name = window.prompt("Service name"); if (!name) return;
      const slug = window.prompt("URL slug"); if (!slug) return;
      const category = window.prompt("Category: streaming, music, gaming, software, education, productivity, news, sports, other", "streaming"); if (!category) return;
      endpoint = "/admin/catalogue/services"; body = { name, slug, category, logo_path: null };
    } else if (conf.create === "plan") {
      const service_id = window.prompt("Service ID"); if (!service_id) return;
      const name = window.prompt("Plan name"); if (!name) return;
      const member_slot_capacity = Number(window.prompt("Member slot capacity", "4"));
      const unit_price_kobo = Number(window.prompt("Unit price in kobo", "200000"));
      const platform_fee_kobo = Number(window.prompt("Platform fee in kobo", "20000"));
      const billing_interval_months = Number(window.prompt("Billing interval in months", "1"));
      endpoint = "/admin/catalogue/plans"; body = { service_id, name, member_slot_capacity, unit_price_kobo, platform_fee_kobo, billing_interval_months, supported_access_methods: ["credentials"] };
    } else if (conf.create === "template") {
      const template_key = window.prompt("Unique template key"); if (!template_key) return;
      const name = window.prompt("Template name"); if (!name) return;
      const category = window.prompt("Category", "account"); if (!category) return;
      const channel = window.prompt("Channel: in_app, email, sms, push", "in_app"); if (!channel) return;
      const subject = window.prompt("Subject", name) || "";
      const bodyText = window.prompt("Message body"); if (!bodyText) return;
      endpoint = "/admin/templates"; body = { template_key, name, category, channel, subject, body: bodyText };
    } else if (conf.create === "communication") {
      const title = window.prompt("Campaign title"); if (!title) return;
      const bodyText = window.prompt("Message body"); if (!bodyText) return;
      let audience; let channels;
      try { audience = JSON.parse(window.prompt('Audience JSON (example: {"type":"all"})', '{"type":"all"}')); } catch { setError("Audience must be valid JSON."); return; }
      try { channels = JSON.parse(window.prompt('Channels JSON (example: ["in_app"])', '["in_app"]')); } catch { setError("Channels must be a valid JSON list."); return; }
      const category = window.prompt("Category", "account"); if (!category) return;
      endpoint = "/admin/communications"; body = { category, title, body: bodyText, channels, audience };
    }
    if (endpoint) {
      const res = await api(endpoint, { method: "POST", body });
      if (res.error) setError(res.error.message); else { setNotice("Record created."); setLoading(true); setRefresh((n) => n + 1); }
    }
  };

  const startSearch = (field, value) => { setLoading(true); setFilter(field, value); };
  const clearFilters = () => { setLoading(true); setFilters(Object.fromEntries((conf.filters || []).map((f) => [f, ""]))); };
  const saveConfig = async (updates) => {
    setError(""); setNotice("");
    const res = await api("/admin/config", { method: "POST", body: { updates } });
    if (res.error) setError(res.error.message || "Configuration could not be saved.");
    else { setNotice("Configuration saved."); setLoading(true); setRefresh((n) => n + 1); }
  };
  const exportReport = async () => {
    const token = getSession()?.access_token;
    if (!token) { setError("Sign in again to export this report."); return; }
    try {
      const response = await fetch(`${API_BASE}${conf.export}${queryString({ ...activeParams, format: "csv" })}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) { const payload = await response.json().catch(() => null); setError(payload?.error?.message || "The report export failed."); return; }
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a"); link.href = objectUrl; link.download = `${page}-report.csv`; link.click(); URL.revokeObjectURL(objectUrl);
    } catch { setError("Could not reach the report export endpoint."); }
  };

  return <AdminShell active={conf.active} sub={conf.sub}>
    <PageTitle title={conf.title} right={<div className="flex flex-wrap gap-2">{conf.create && <DarkButton className="h-11 px-5" onClick={performCreate}>Add {LABEL(conf.create)}</DarkButton>}{conf.export && <DarkButton className="h-11 px-5" onClick={exportReport}>Export CSV</DarkButton>}{(conf.actions || []).filter((a) => ["Run reconciliation", "Run ledger integrity check", "Run checks", "Scan security events", "Run retention preview"].includes(a)).map((action) => <DarkButton key={action} className="h-11 px-5" onClick={() => runAction(action)}>{action}</DarkButton>)}</div>} />
    <div className="mt-2 text-sm text-[#627062]">Live data · Clyse admin API</div>
    {overview && <div className="mt-5"><OverviewTiles data={overview} /></div>}
    {(error || notice) && <div role="status" className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${error ? "border-red-200 bg-red-50 text-red-800" : "border-green-200 bg-green-50 text-green-900"}`}>{error || notice}</div>}
    {(conf.filters || []).length > 0 && <div className="mt-6 flex flex-wrap items-end gap-3 rounded-[14px] border border-[#D8E2D9] bg-white p-4">{conf.filters.map((filter) => <label key={filter} className="flex min-w-[180px] flex-1 flex-col gap-1 text-xs font-bold text-[#455145]"><span>{LABEL(filter)}</span>{FILTER_OPTIONS[page]?.[filter] ? <select aria-label={LABEL(filter)} value={filters[filter] || ""} onChange={(e) => startSearch(filter, e.target.value)} className="h-10 rounded-lg border border-[#C9D2C9] bg-white px-3 text-sm font-medium text-[#001701] outline-none focus:border-[#048B0B]"><option value="">All</option>{FILTER_OPTIONS[page][filter].map((option) => <option key={option} value={option}>{LABEL(option)}</option>)}</select> : <input aria-label={LABEL(filter)} type={filter === "from" || filter === "to" ? "date" : "search"} value={filters[filter] || ""} onChange={(e) => startSearch(filter, e.target.value)} placeholder={filter === "q" ? "Search records…" : `Filter ${LABEL(filter).toLowerCase()}`} className="h-10 rounded-lg border border-[#C9D2C9] bg-white px-3 text-sm font-medium text-[#001701] outline-none focus:border-[#048B0B]" />}</label>)}<button className="h-10 rounded-lg border border-[#C9D2C9] px-4 text-sm font-semibold" onClick={clearFilters}>Clear filters</button></div>}
    {recordId && (detailId === recordId && detail ? page === "support" ? <SupportDetail data={detail} reply={reply} setReply={setReply} onSend={sendSupportReply} onClose={closeDetails} sending={replySending} /> : <DetailView data={detail} onClose={closeDetails} /> : <div className="mt-5 rounded-xl border border-[#D8E2D9] bg-white p-5 text-sm text-[#596659]">Loading record details…</div>)}
    {conf.unsupported ? <div className="mt-6 rounded-[14px] border border-dashed border-[#C8D2C8] bg-white p-12 text-center"><div className="text-lg font-bold text-[#001701]">Not available in the current admin API</div><p className="mx-auto mt-2 max-w-xl text-sm text-[#657165]">{conf.unsupportedMessage}</p></div> : conf.dashboard ? <div className="mt-6">{loading ? <SkeletonTable /> : data ? <OverviewTiles data={data} /> : !error && <div className="mt-6 rounded-xl bg-white p-8 text-center text-sm text-[#657165]">No dashboard data was returned.</div>}</div> : page === "config" && Array.isArray(data?.settings) && !loading ? <ConfigEditor key={refresh} settings={data.settings} onSave={saveConfig} /> : <div className="mt-6">{loading ? <SkeletonTable /> : rows.length ? <><div className="overflow-hidden rounded-[14px] border border-[#D8E2D9] bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[850px] border-collapse text-left"><thead className="bg-[#EAF4EA]"><tr>{columns.map((col) => <th key={col} className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#3F5140]">{LABEL(col)}</th>)}<th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#3F5140]">Actions</th></tr></thead><tbody>{rows.map((row, i) => <tr key={String(row?.[conf.idKey] ?? row?.id ?? i)} className="border-t border-[#EEF2EE] hover:bg-[#FAFCFA]">{columns.map((col) => <td key={col} className="max-w-[260px] px-4 py-4 text-sm font-medium text-[#203020]"><span className="block truncate" title={valueText(row[col], col)}>{valueText(row[col], col)}</span></td>)}<td className="px-4 py-3"><div className="flex flex-wrap items-center gap-2">{conf.detail && <button onClick={() => openDetails(row)} className="rounded-lg border border-[#AEBBAF] px-3 py-2 text-xs font-bold text-[#183119]">View</button>}{(conf.actions || []).filter((a) => !["Run reconciliation", "Run ledger integrity check", "Run checks", "Scan security events", "Run retention preview"].includes(a)).map((action) => <button key={action} onClick={() => runAction(action, row)} className="rounded-lg bg-[#001701] px-3 py-2 text-xs font-bold text-white">{action}</button>)}</div></td></tr>)}</tbody></table></div></div>{page === "roles" && Array.isArray(data?.permissions) && <section className="mt-6 rounded-[14px] border border-[#D8E2D9] bg-white p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-bold text-[#001701]">Permission catalogue</h2><span className="text-sm text-[#657165]">{data.permissions.length} permissions</span></div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{data.permissions.map((permission) => <div key={permission.key} className="rounded-xl border border-[#E3E9E3] p-4"><div className="font-bold text-[#001701]">{LABEL(permission.label || permission.key)}</div><div className="mt-1 text-xs text-[#657165]">{permission.key} · {LABEL(permission.category || "general")} · {LABEL(permission.risk || "low")} risk</div><button onClick={() => runAction("Change permission", permission)} className="mt-3 rounded-lg bg-[#001701] px-3 py-2 text-xs font-semibold text-white">Grant / revoke</button></div>)}</div></section>}<div className="mt-4 flex items-center justify-between text-sm text-[#596659]"><span>{rows.length} records loaded{pageInfo?.has_more ? " · more available" : ""}</span>{pageInfo?.has_more && <button disabled={moreLoading} onClick={() => load(true)} className="rounded-lg bg-[#001701] px-4 py-2 font-semibold text-white disabled:opacity-50">{moreLoading ? "Loading…" : "Load more"}</button>}</div></> : !error && <div className="rounded-[14px] border border-dashed border-[#C8D2C8] bg-white p-12 text-center"><div className="text-lg font-bold text-[#001701]">No records found</div><div className="mt-2 text-sm text-[#657165]">The API returned an empty result for this view. Try clearing filters or check back later.</div></div>}</div>}
    {data?.page?.has_more && conf.dashboard && <div className="mt-4 text-right text-xs text-[#647164]">More records are available in the API.</div>}
  </AdminShell>;
}
