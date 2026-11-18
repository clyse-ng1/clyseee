import { useCallback, useEffect, useState } from "react";
import { api, kobo } from "../lib/api";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";

/* Live-data adapter for the Figma admin list pages. No sample records are
   rendered: each list exposes loading, live, empty and error states. The
   cursor API is used for records beyond the first 50 as well. */

const AVATARS = [avatarAshlynn, avatarAspen, avatarKianna, avatar1, avatar2, avatar3];
const av = (i) => AVATARS[i % AVATARS.length];
const date = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/(\d{2}) ([A-Za-z]{3}) (\d{4})/, "$2 $1, $3");
};
const money = (v) => (v == null ? "—" : kobo(v));
const num = (v) => (v == null ? "—" : Number(v).toLocaleString("en-NG"));
const serviceName = (g) => g?.service?.name || g?.service_name || g?.subscription_name || null;
const planName = (g) => g?.plan?.name || g?.plan_name || null;
const brandOf = (g) => String(g?.service?.slug || g?.service_slug || serviceName(g) || "generic").split(" ")[0].toLowerCase();
const ownerName = (g) => g?.owner_name || g?.creator?.full_name || g?.creator?.first_name || g?.user?.full_name || g?.user?.first_name || g?.owner_email?.split("@")[0] || g?.user?.email?.split("@")[0] || null;
const ownerEmail = (g) => g?.owner_email || g?.creator?.email || g?.user?.email || null;
const slots = (g) => {
  const used = g?.occupied_slots ?? g?.member_count ?? g?.members_count;
  const cap = g?.slots_offered ?? g?.capacity;
  return `${used ?? "—"}/${cap ?? "—"}`;
};
const titleCase = (s) => String(s || "").replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const tone = (s) => {
  const v = String(s || "").toLowerCase();
  if (/fail|reject|suspend|deactivat|cancel|closed|revoked|urgent|critical|high/.test(v)) return "red";
  if (/pend|process|review|waiting|draft|scheduled|medium|monitor/.test(v)) return "orange";
  return "green";
};

const MAPPERS = {
  users: (u, i) => ({
    id: u.id || u.user_id, name: u.full_name || u.name || String(u.email || "user").split("@")[0],
    img: u.avatar_url || av(i), email: u.email || "—", phone: u.phone || u.phone_number || "—",
    role: u.role || (Array.isArray(u.roles) && u.roles.length ? u.roles.map((r) => r.label || r).join(", ") : "Member"),
    acct: u.status || "unknown", ver: u.email_verified || u.email_verified_at || u.verified ? "verified" : "unverified",
    date: date(u.created_at), grp: u.groups_count != null ? String(u.groups_count) : u.group_count != null ? String(u.group_count) : "—",
    mem: u.active_memberships_count != null ? String(u.active_memberships_count) : "—",
    slots: u.active_memberships_count != null || u.groups_count != null || u.group_count != null ? `${u.active_memberships_count ?? "—"} / ${u.groups_count ?? u.group_count ?? "—"}` : "—",
    wallet: money(u.wallet_balance_kobo), status: u.status || "—",
  }),
  groups: (g) => ({
    id: g.id || g.group_id, name: ownerName(g) ? `${ownerName(g)}'s group` : serviceName(g) || "Group",
    owner: ownerName(g) || "—", email: ownerEmail(g) || "—", brand: brandOf(g), sub: serviceName(g) || "—",
    plan: planName(g) || "—", slot: slots(g), member: g.member_count ?? g.members_count ?? g.occupied_slots ?? "—",
    date: date(g.created_at), status: g.status || "—", verified: g.verification_status || "—",
  }),
  verification: (g) => ({
    id: g.id || g.group_id, name: ownerName(g) ? `${ownerName(g)}'s group` : serviceName(g) || "Group",
    email: ownerEmail(g) || "—", brand: brandOf(g), sub: serviceName(g) || "—", plan: planName(g) || "—",
    price: g.price?.total_kobo != null ? money(g.price.total_kobo) : g.plan?.total_price_kobo != null ? money(g.plan.total_price_kobo) : g.price_kobo != null ? money(g.price_kobo) : "—",
    slot: slots(g), date: date(g.created_at || g.submitted_at), status: g.verification_status || g.status || "—",
  }),
  transactions: (t) => ({
    id: t.id, name: t.user_name || t.user?.full_name || t.user_email || t.user?.email || "Customer", email: t.user_email || t.user?.email || "—",
    brand: brandOf(t), item: serviceName(t) || t.description || titleCase(t.kind) || "Transaction",
    kind: t.group_id ? "Group" : t.membership_id ? "Subscription" : "—", type: t.category ? titleCase(t.category) : titleCase(t.kind) || "Payment",
    tone: tone(t.category || t.kind), amount: money(t.amount_kobo), amountKobo: t.amount_kobo ?? 0, createdAt: t.created_at || null,
    fee: money(t.fee_kobo ?? t.platform_fee_kobo), feeKobo: t.fee_kobo ?? t.platform_fee_kobo ?? 0,
    status: t.status || "—", ref: t.reference || t.id || "—", when: date(t.created_at), date: date(t.created_at),
  }),
  payouts: (p) => ({
    id: p.id, name: p.account_name || p.creator_name || p.creator?.full_name || p.creator_email || "Creator", email: p.creator_email || p.creator?.email || "—",
    bank: p.bank_code && p.account_last4 ? `${p.bank_code} ····${p.account_last4}` : p.account_last4 ? `····${p.account_last4}` : "—",
    amount: money(p.amount_kobo), amountKobo: p.amount_kobo ?? 0, fee: money(p.fee_kobo), net: money(p.net_kobo), netKobo: p.net_kobo ?? 0,
    createdAt: p.created_at || null, date: date(p.created_at), when: date(p.created_at), status: p.status || "pending",
  }),
  disputes: (d) => ({
    id: d.report_id || d.id || "—", date: date(d.created_at || d.reported_at),
    name: d.user_name || d.reporter?.full_name || d.reporter_name || d.user_email || "Member", email: d.user_email || d.reporter?.email || d.reporter_email || "—",
    brand: brandOf(d), item: serviceName(d) || d.group?.service?.name || d.group_name || "—", kind: d.group_id || d.group_name ? "Group" : d.membership_id ? "Subscription" : "—",
    issue: titleCase(d.reason || d.issue_type || d.category || "—"), status: d.status || "—",
  }),
  reconciliation: (r) => ({
    id: r.id, type: titleCase(r.status || "run"), typeTone: tone(r.status), total: num(r.checked_count ?? r.total_count ?? r.entries_checked),
    matched: num(r.matched_count ?? r.ok_count), match: r.discrepancy_count != null ? `${num(r.discrepancy_count)} issues` : "—",
    matchTone: r.discrepancy_count ? "red" : "green", status: r.status || "—", statusTone: tone(r.status), date: date(r.created_at || r.started_at),
  }),
  exceptions: (e, i) => ({
    id: e.exception_id || e.id, n: i + 1, type: titleCase(e.kind || e.type || "exception"), typeTone: tone(e.kind),
    ref: e.reference || e.entry_id || e.id || "—", user: e.user_email || e.creator_email || "—", amount: money(e.amount_kobo ?? e.difference_kobo),
    issue: e.note || e.description || titleCase(e.status || "—"), date: date(e.created_at), resolved: /resolved|ignored/.test(String(e.status || "")),
  }),
  support: (s, i) => ({
    id: s.id || s.issue_id, name: s.user?.full_name || s.user?.email || "Member", email: s.user?.email || "—", issue: s.subject || "—",
    sub: titleCase(s.category), type: titleCase(s.status), rep: s.assignee?.full_name || s.assignee?.email || "Unassigned", av: av(i),
    status: s.status || "open", tile: titleCase(s.priority || "normal"), date: date(s.created_at),
  }),
  moderation: (m, i) => {
    const target = m.target || m.target_user || m.target_group || {};
    return {
      id: m.id, name: target.full_name || target.name || target.service?.name || target.email?.split("@")[0] || "Target",
      email: target.email || m.target_user?.email || "—", sub: titleCase(m.target_type || "—"), targetType: String(m.target_type || "").toLowerCase(),
      targetId: m.target_id || target.id || null, type: titleCase(m.action || "action"), issue: m.reason || "—",
      rep: m.actor?.full_name || m.actor?.email || "—", repEmail: m.actor?.email || "—", av: av(i), status: m.result || "—",
      tile: titleCase(m.action || "—"), channel: m.channel || m.channel_type || m.template_channel || null, date: date(m.created_at),
    };
  },
  security: (e) => ({
    id: e.id, name: e.actor?.email || e.user_email || e.ip || "System", sub: titleCase(e.event_type || "event"),
    type: titleCase(e.severity || "info"), issue: e.description || e.message || e.route || "—", rep: e.ip || "—",
    status: e.severity || "info", tile: titleCase(e.severity || "info"), createdAt: e.created_at || null, date: date(e.created_at),
  }),
  health: (c) => ({
    id: c.id, name: c.name || c.service_key || "Check", sub: titleCase(c.service_key || "service"), type: titleCase(c.status || "—"),
    issue: c.message || c.detail || "—", rep: c.latency_ms != null ? `${c.latency_ms}ms` : "—", status: c.status || "—",
    tile: titleCase(c.status || "—"), latencyMs: c.latency_ms ?? null, createdAt: c.created_at || null, date: date(c.created_at),
  }),
  audit: (a) => ({
    id: a.id, name: a.actor?.full_name || a.actor?.email || a.actor_email || "Administrator", email: a.actor?.email || a.actor_email || "—",
    action: titleCase(a.action || a.event_type || "activity"), issue: a.description || a.entity_name || a.entity_type || "—",
    status: a.result || a.status || "—", date: date(a.created_at), createdAt: a.created_at || null,
  }),
};

const SOURCES = {
  users: { path: "/admin/users?limit=50", key: "users" }, groups: { path: "/admin/groups?limit=50", key: "groups" },
  verification: { path: "/admin/groups/review?limit=50", key: "groups" }, transactions: { path: "/admin/finance/transactions?limit=50", key: "transactions" },
  fundings: { path: "/admin/finance/wallet-fundings?limit=50", key: "fundings" }, earnings: { path: "/admin/finance/creator-earnings?limit=50", key: "earnings" },
  payouts: { path: "/admin/finance/payouts?limit=50", key: "payouts" }, disputes: { path: "/admin/disputes?limit=50", key: "disputes" },
  reconciliation: { path: "/admin/finance/reconciliations?limit=50", key: "runs" }, exceptions: { path: "/admin/finance/reconciliations/exceptions?limit=50", key: "exceptions" },
  support: { path: "/admin/support/issues?limit=50", key: "issues" }, moderation: { path: "/admin/moderation/records?limit=50", key: "records" },
  security: { path: "/admin/security/events?limit=50", key: "events" }, health: { path: "/admin/health/history?limit=50", key: "checks" },
  templates: { path: "/admin/templates?limit=50", key: "templates" }, communications: { path: "/admin/communications?limit=50", key: "communications" },
  admins: { path: "/admin/admins?limit=50", key: "admins" }, audit: { path: "/admin/audit-logs?limit=50", key: "logs" },
  config: { path: "/admin/config", key: "settings" }, services: { path: "/admin/catalogue/services?limit=50", key: "services" }, plans: { path: "/admin/catalogue/plans?limit=50", key: "plans" },
};
const generic = (r, i) => ({
  id: r.id || r.key || i, name: r.name || r.full_name || r.title || r.subject || r.key || r.email || "—", email: r.email || "—",
  sub: titleCase(r.category || r.type || r.kind || r.status || "—"), type: titleCase(r.status || r.type || "—"),
  issue: r.description || r.message || r.detail || "—", status: r.status || "—", tile: titleCase(r.status || "—"), date: date(r.created_at),
});

export default function useAdminRows(kind, params = {}) {
  const paramsKey = new URLSearchParams(Object.entries(params).filter(([, value]) => value != null && value !== "")).toString();
  const [state, setState] = useState({ rows: null, total: 0, status: "loading", hasMore: false, moreError: "" });
  const [cursor, setCursor] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [moreLoading, setMoreLoading] = useState(false);

  useEffect(() => {
    const src = SOURCES[kind];
    let alive = true;
    setState({ rows: null, total: 0, status: src ? "loading" : "error", hasMore: false, moreError: "" });
    setCursor(null);
    if (!src) return () => { alive = false; };
    const requestPath = paramsKey ? `${src.path}${src.path.includes("?") ? "&" : "?"}${paramsKey}` : src.path;
    api(requestPath).then((res) => {
      if (!alive) return;
      if (res.error) {
        setState({ rows: null, total: 0, status: "error", hasMore: false, moreError: "" });
        return;
      }
      const raw = res.data?.[src.key];
      const items = Array.isArray(raw) ? raw : Array.isArray(res.data) ? res.data : null;
      if (!items) {
        setState({ rows: null, total: 0, status: "error", hasMore: false, moreError: "" });
        return;
      }
      const map = MAPPERS[kind] || generic;
      const rows = items.map((record, index) => map(record, index));
      const nextCursor = res.data?.page?.next_cursor || res.data?.next_cursor || null;
      setCursor(nextCursor);
      setState({ rows, total: res.data?.total ?? rows.length, status: rows.length ? "live" : "empty", hasMore: Boolean(nextCursor), moreError: "" });
    }).catch(() => {
      if (alive) setState({ rows: null, total: 0, status: "error", hasMore: false, moreError: "" });
    });
    return () => { alive = false; };
  }, [kind, refreshKey, paramsKey]);

  const reload = useCallback(() => setRefreshKey((value) => value + 1), []);
  const loadMore = useCallback(async () => {
    const src = SOURCES[kind];
    if (!src || !cursor || moreLoading) return;
    setMoreLoading(true);
    const base = paramsKey ? `${src.path}${src.path.includes("?") ? "&" : "?"}${paramsKey}` : src.path;
    const joiner = base.includes("?") ? "&" : "?";
    const res = await api(`${base}${joiner}before=${encodeURIComponent(cursor)}`);
    setMoreLoading(false);
    if (res.error) {
      setState((old) => ({ ...old, moreError: res.error.message || "Could not load more records." }));
      return;
    }
    const raw = res.data?.[src.key];
    const items = Array.isArray(raw) ? raw : Array.isArray(res.data) ? res.data : [];
    const offset = state.rows?.length || 0;
    const map = MAPPERS[kind] || generic;
    const nextRows = items.map((record, index) => map(record, offset + index));
    const nextCursor = res.data?.page?.next_cursor || res.data?.next_cursor || null;
    setCursor(nextCursor);
    setState((old) => ({
      ...old,
      rows: [...(old.rows || []), ...nextRows],
      total: res.data?.total ?? old.total + nextRows.length,
      status: old.rows?.length || nextRows.length ? "live" : "empty",
      hasMore: Boolean(nextCursor),
      moreError: "",
    }));
  }, [kind, cursor, moreLoading, paramsKey, state.rows?.length]);

  return { ...state, moreLoading, reload, loadMore };
}
