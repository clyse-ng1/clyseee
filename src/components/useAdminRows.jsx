import { useEffect, useState } from "react";
import { api } from "../lib/api";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";

/* Live-data merge for the Figma admin list pages. Each Figma screen ships
   with design dummy rows; when the admin API answers, those rows are
   replaced with real records (same column shape). Falls back silently. */

const AVATARS = [avatarAshlynn, avatarAspen, avatarKianna, avatar1, avatar2, avatar3];
const av = (i) => AVATARS[i % AVATARS.length];
const date = (v) =>
  v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/(\d{2}) ([A-Za-z]{3}) (\d{4})/, "$2 $1, $3") : "—";

const MAPPERS = {
  users: (u, i) => ({
    name: u.full_name || u.name || String(u.email || "user").split("@")[0],
    img: av(i),
    email: u.email || "—",
    phone: u.phone || u.phone_number || "—",
    acct: u.status === "suspended" ? "suspended" : u.status === "pending" ? "pending" : "active",
    ver: u.email_verified_at || u.verified ? "verified" : "unverified",
    date: date(u.created_at),
    grp: u.group_count != null ? `${u.group_count}` : "—",
  }),
  groups: (g, i) => ({
    name: g.owner_name || g.name || "Group",
    email: g.owner_email || "—",
    brand: String(g.service_slug || g.service_name || "generic").split(" ")[0],
    sub: g.service_name || "Subscription",
    plan: g.plan_name || "Premium",
    slot: `${g.member_count ?? g.members ?? 0}/${g.capacity ?? 0}`,
    date: date(g.created_at),
    status: g.status === "full" ? "full" : g.status === "closed" ? "closed" : "open",
  }),
  verification: (g, i) => ({
    name: g.owner_name || g.name || "Group",
    email: g.owner_email || "—",
    brand: String(g.service_slug || g.service_name || "generic").split(" ")[0],
    sub: g.service_name || "Subscription",
    plan: g.plan_name || "Premium",
    price: g.price_kobo != null ? `N${Math.round(g.price_kobo / 100).toLocaleString("en-US")}` : "N3,000",
    slot: `${g.member_count ?? 0}/${g.capacity ?? 0}`,
    date: date(g.created_at || g.submitted_at),
    status: g.verification_status || g.status || "pending",
  }),
  transactions: (t, i) => ({
    name: t.user_name || t.user_email || "Customer",
    brand: String(t.service_slug || t.service_name || "generic").split(" ")[0],
    item: t.service_name || t.description || "Transaction",
    kind: t.kind || (t.group_id ? "Group" : "Subscription"),
    type: t.type || t.transaction_type || "Subscription Payment",
    tone: String(t.type || "").toLowerCase().includes("refund") || String(t.type || "").toLowerCase().includes("payout") ? "red" : "green",
    amount: t.amount_kobo != null ? `N${Math.round(t.amount_kobo / 100).toLocaleString("en-US")}` : "—",
  }),
};

const ENDPOINTS = {
  users: "/admin/users",
  groups: "/admin/groups",
  verification: "/admin/groups?status=pending",
  transactions: "/admin/transactions",
};

export default function useAdminRows(kind) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let alive = true;
    api(ENDPOINTS[kind]).then((res) => {
      if (!alive || res.error) return;
      const items = Array.isArray(res.data) ? res.data : res.data?.items;
      if (!Array.isArray(items) || !items.length) return;
      setRows(items.slice(0, 12).map((r, i) => MAPPERS[kind](r, i)));
    });
    return () => { alive = false; };
  }, [kind]);
  return rows;
}
