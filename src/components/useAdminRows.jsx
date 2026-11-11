import { useEffect, useState } from "react";
import { api, kobo } from "../lib/api";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";

/* Live-data merge for the Figma admin list pages. Each Figma screen ships
   with design dummy rows used only while the request is in flight; once the
   admin API answers, real records replace them (same column shape) and an
   empty answer renders the page's empty state instead of made-up people.
   Returns { rows, status } with status = loading | live | empty | error. */

const AVATARS = [avatarAshlynn, avatarAspen, avatarKianna, avatar1, avatar2, avatar3];
const av = (i) => AVATARS[i % AVATARS.length];
const date = (v) =>
  v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/(\d{2}) ([A-Za-z]{3}) (\d{4})/, "$2 $1, $3") : "—";
const money = (v) => (v == null ? "—" : kobo(v));
const serviceName = (g) => g?.service?.name || g?.service_name || g?.subscription_name || null;
const planName = (g) => g?.plan?.name || g?.plan_name || null;
const brandOf = (g) => String(g?.service?.slug || g?.service_slug || serviceName(g) || "generic").split(" ")[0].toLowerCase();
const ownerName = (g) => g?.owner_name || g?.creator?.full_name || g?.creator?.first_name || g?.owner_email?.split("@")[0] || null;
const ownerEmail = (g) => g?.owner_email || g?.creator?.email || null;
const slots = (g) => {
  const used = g?.occupied_slots ?? g?.member_count ?? g?.members ?? 0;
  const cap = g?.slots_offered ?? g?.capacity ?? 0;
  return `${used}/${cap}`;
};

const MAPPERS = {
  users: (u, i) => ({
    name: u.full_name || u.name || String(u.email || "user").split("@")[0],
    img: av(i),
    email: u.email || "—",
    phone: u.phone || u.phone_number || "—",
    role: Array.isArray(u.roles) && u.roles.length ? u.roles.map((r) => r.label || r).join(", ") : "Member",
    acct: u.status === "suspended" ? "suspended" : u.status === "restricted" ? "restricted" : u.status === "deactivated" ? "deactivated" : u.status === "pending" ? "pending" : "active",
    ver: u.email_verified || u.email_verified_at || u.verified ? "verified" : "unverified",
    date: date(u.created_at),
    grp: u.groups_count != null ? `${u.groups_count}` : u.group_count != null ? `${u.group_count}` : "0",
    mem: u.active_memberships_count != null ? `${u.active_memberships_count}` : "0",
    wallet: money(u.wallet_balance_kobo),
  }),
  groups: (g, i) => ({
    name: ownerName(g) ? `${ownerName(g)}'s group` : serviceName(g) || "Group",
    owner: ownerName(g) || "—",
    email: ownerEmail(g) || "—",
    brand: brandOf(g),
    sub: serviceName(g) || "Subscription",
    plan: planName(g) || "Premium",
    slot: slots(g),
    date: date(g.created_at),
    status: g.status === "full" ? "full" : g.status === "closed" ? "closed" : g.status === "suspended" ? "suspended" : g.status === "pending_review" ? "review" : g.status === "rejected" ? "rejected" : "open",
    verified: g.verification_status || (g.verified ? "verified" : "pending"),
  }),
  verification: (g, i) => ({
    name: ownerName(g) ? `${ownerName(g)}'s group` : serviceName(g) || "Group",
    email: ownerEmail(g) || "—",
    brand: brandOf(g),
    sub: serviceName(g) || "Subscription",
    plan: planName(g) || "Premium",
    price: g.price?.total_kobo != null ? money(g.price.total_kobo) : g.price_kobo != null ? money(g.price_kobo) : "—",
    slot: slots(g),
    date: date(g.created_at || g.submitted_at),
    status: g.verification_status || g.status || "pending",
  }),
  transactions: (t, i) => ({
    name: t.user_name || t.user_email || "Customer",
    brand: brandOf(t),
    item: serviceName(t) || t.description || "Transaction",
    kind: t.group_id ? "Group" : "Subscription",
    type: t.type || t.transaction_type || t.category || "Subscription Payment",
    tone: String(t.type || t.category || "").toLowerCase().match(/refund|payout|reversal/) ? "red" : "green",
    amount: money(t.amount_kobo),
    fee: money(t.fee_kobo ?? t.platform_fee_kobo),
    feeKobo: t.fee_kobo ?? t.platform_fee_kobo ?? 0,
    amountKobo: t.amount_kobo ?? 0,
    email: t.user_email || "—",
    status: t.status || "posted",
    ref: t.reference || t.id || "—",
    when: date(t.created_at),
  }),
  payouts: (p, i) => ({
    name: p.account_name || p.creator_name || p.creator_email || "Creator",
    email: p.creator_email || "—",
    bank: p.bank_code && p.account_last4 ? `${p.bank_code} ····${p.account_last4}` : p.account_last4 ? `····${p.account_last4}` : "—",
    amount: money(p.amount_kobo),
    fee: money(p.fee_kobo),
    net: money(p.net_kobo),
    netKobo: p.net_kobo ?? 0,
    date: date(p.created_at),
    status: p.status || "pending",
  }),
  disputes: (d, i) => ({
    id: d.report_id || d.id || "—",
    date: date(d.created_at || d.reported_at),
    name: d.user_name || d.reporter_name || d.user_email || "Member",
    email: d.user_email || d.reporter_email || "—",
    brand: brandOf(d),
    item: serviceName(d) || d.group_name || "Subscription",
    kind: d.group_id || d.group_name ? "Group" : "Subscription",
    issue: d.issue_type || d.category || d.reason || "Payment Issue",
    status: d.status || "open",
  }),
};

const ENDPOINTS = {
  users: "/admin/users",
  groups: "/admin/groups",
  verification: "/admin/groups?verification_status=pending",
  transactions: "/admin/transactions",
  payouts: "/admin/finance/payouts",
  disputes: "/admin/disputes",
};

export default function useAdminRows(kind) {
  const [state, setState] = useState({ rows: null, status: "loading" });
  useEffect(() => {
    let alive = true;
    api(ENDPOINTS[kind]).then((res) => {
      if (!alive) return;
      if (res.error) return setState({ rows: null, status: "error" });
      const items = Array.isArray(res.data) ? res.data : res.data?.[kind] || res.data?.items || res.data?.records;
      if (!Array.isArray(items)) return setState({ rows: null, status: "error" });
      if (!items.length) return setState({ rows: [], total: 0, status: "empty" });
      setState({ rows: items.slice(0, 50).map((r, i) => MAPPERS[kind](r, i)), total: items.length, status: "live" });
    });
    return () => { alive = false; };
  }, [kind]);
  return state;
}
