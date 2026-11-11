import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminShell, { BackTitle, Pill } from "../components/AdminShell";
import { TabsBar, InfoCard, ModerationCard } from "../components/AdminDetails";
import { api, kobo } from "../lib/api";

/* User Details & Moderation — Figma 1172:24979 (1440, desktop only).
   The designed layout is filled from the live admin API: the profile card,
   personal information and wallet figures come from GET /admin/users (or the
   ?id= record), moderation history from GET /admin/moderation/records. */

const TABS = ["Overview", "Subscription & Group", "Moderation History"];
const fmtDate = (v) =>
  v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/(\d{2}) ([A-Za-z]{3}) (\d{4})/, "$2 $1, $3") : "—";
const initials = (name) =>
  String(name || "?")
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

function LiveSubsAndGroups({ user }) {
  const groups = user?.groups_count ?? 0;
  const memberships = user?.active_memberships_count ?? 0;
  return (
    <div className="mt-[30px]">
      <h2 className="text-[20px] font-bold text-[#000000]">Active Subscription</h2>
      <div className="mt-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px] py-[18px]">
        {memberships > 0 ? (
          <p className="text-[16px] font-semibold text-[#4E4E4E]">
            {memberships} active membership{memberships === 1 ? "" : "s"} — the per-plan roster is available in Finance → Transactions.
          </p>
        ) : (
          <p className="text-[16px] font-semibold text-[#4E4E4E]">No active subscriptions yet.</p>
        )}
      </div>
      <h2 className="mt-[30px] text-[20px] font-bold text-[#000000]">Active Group</h2>
      <div className="mt-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px] py-[18px]">
        {groups > 0 ? (
          <p className="text-[16px] font-semibold text-[#4E4E4E]">
            {groups} group{groups === 1 ? "" : "s"} owned — open Users → Group Management for the full record.
          </p>
        ) : (
          <p className="text-[16px] font-semibold text-[#4E4E4E]">No groups yet.</p>
        )}
      </div>
    </div>
  );
}

export default function AdminUserDetails() {
  const [tab, setTab] = useState(TABS[0]);
  const [params] = useSearchParams();
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [records, setRecords] = useState(null);

  useEffect(() => {
    let alive = true;
    api("/admin/users").then((res) => {
      if (!alive) return;
      const items = Array.isArray(res.data) ? res.data : res.data?.users || res.data?.items || [];
      const wanted = params.get("id");
      setUser(items.find((u) => u.id === wanted || u.user_id === wanted) || items[0] || null);
      setLoaded(true);
    });
    return () => { alive = false; };
  }, [params]);

  useEffect(() => {
    if (!user?.id) return;
    let alive = true;
    api(`/admin/moderation/records?target_id=${user.id}`).then((res) => {
      if (!alive) return;
      const items = Array.isArray(res.data) ? res.data : res.data?.records || res.data?.items || [];
      setRecords(items);
    });
    return () => { alive = false; };
  }, [user?.id]);

  const statusLabel = useMemo(() => {
    if (!user) return "Activated";
    if (user.status === "suspended") return "Suspended";
    if (user.status === "restricted" || user.restricted_until) return "Restricted";
    if (user.status === "deactivated") return "Deactivated";
    return "Activated";
  }, [user]);

  const name = user?.full_name || user?.name || "—";
  const tiles = [
    { label: "Wallet Balance", value: user ? kobo(user.wallet_balance_kobo ?? 0) : "—" },
    { label: "Creator Pending", value: user ? kobo(user.creator_pending_kobo ?? 0) : "—" },
    { label: "Creator Available", value: user ? kobo(user.creator_available_kobo ?? 0) : "—" },
    { label: "Groups / Memberships", value: user ? `${user.groups_count ?? 0} / ${user.active_memberships_count ?? 0}` : "—" },
  ];

  return (
    <AdminShell active="users" sub="um">
      <BackTitle title="User Details & Moderation" />

      {/* Profile card */}
      <div className="mt-[30px] flex min-h-[175px] items-center justify-between rounded-[20px] border border-[#999999] bg-white px-[31px] py-[20px]">
        <div className="flex items-center gap-[20px]">
          <span className="grid h-[80px] w-[80px] flex-none place-items-center rounded-full bg-[#B1DBB3] text-[28px] font-bold text-[#001701]">
            {user ? initials(name) : "…"}
          </span>
          <span>
            <span className="block text-[25px] font-bold text-[#000000]">{loaded ? name : "Loading member…"}</span>
            <span className="block text-[18px] font-semibold text-[#6B6B6B]">
              {user ? `${user.email || "—"} . ${user.phone || "no phone on file"}` : " "}
            </span>
            <span className="block text-[18px] font-semibold text-[#6B6B6B]">
              User ID: <span className="text-[#000000]">{user ? String(user.id).slice(0, 8).toUpperCase() : "—"}</span>
              {user?.roles?.length ? <span className="text-[#048B0B]"> · {user.roles.map((r) => r.label || r).join(", ")}</span> : null}
            </span>
          </span>
        </div>
        <Pill className="h-[37px] w-[116px]">{statusLabel}</Pill>
      </div>

      {/* Live wallet & activity figures */}
      <div className="mt-[20px] grid gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-[14px] border border-[#999999] bg-white px-[20px] py-[16px]">
            <span className="block text-[14px] font-semibold uppercase tracking-[0.06em] text-[#6B6B6B]">{t.label}</span>
            <span className="mt-[6px] block text-[22px] font-bold text-[#000000]">{t.value}</span>
          </div>
        ))}
      </div>

      <TabsBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Overview" && (
        <>
          <h2 className="mt-[30px] text-[25px] font-bold text-[#000000]">Personal Information</h2>
          <div className="mt-[15px] flex flex-wrap gap-[30px]">
            <InfoCard label="Email / Phone Number" className="w-full lg:w-[350px]">
              {user ? user.email || "—" : "—"}
              <br />
              {user ? user.phone || "no phone on file" : "—"}
            </InfoCard>
            <InfoCard label="Home Address" className="w-full lg:w-[350px]">
              Not provided yet
            </InfoCard>
            <InfoCard label="Member Since" className="w-full lg:w-[350px]">
              {user ? fmtDate(user.created_at) : "—"}
            </InfoCard>
          </div>
          <div className="mt-[15px] flex flex-wrap gap-[30px]">
            <InfoCard label="Email Verification" className="w-full lg:w-[350px]">
              {user ? (user.email_verified ? "Verified" : "Not verified") : "—"}
            </InfoCard>
            <InfoCard label="Phone Verification" className="w-full lg:w-[350px]">
              {user ? (user.phone_verified ? "Verified" : "Not verified") : "—"}
            </InfoCard>
            <InfoCard label="Last Updated" className="w-full lg:w-[350px]">
              {user ? fmtDate(user.updated_at) : "—"}
            </InfoCard>
          </div>
          {user?.suspended_reason || user?.restricted_reason ? (
            <div className="mt-[15px] rounded-[10px] border border-[#E31B00] bg-[#FFF3F2] px-[20px] py-[14px] text-[16px] font-semibold text-[#B31500]">
              {user.suspended_reason || user.restricted_reason}
              {user.restricted_until ? ` · until ${fmtDate(user.restricted_until)}` : ""}
            </div>
          ) : null}
          <LiveSubsAndGroups user={user} />
        </>
      )}
      {tab === "Subscription & Group" && <LiveSubsAndGroups user={user} />}
      {tab === "Moderation History" && (
        <div className="mt-[30px] rounded-[10px] border border-[#999999] bg-white px-[20px] py-[10px]">
          {records && records.length ? (
            <ul className="divide-y divide-[#E1E1E1]">
              {records.slice(0, 8).map((r, i) => (
                <li key={r.id || i} className="flex items-center justify-between gap-[20px] py-[14px]">
                  <span className="text-[16px] font-semibold text-[#000000]">
                    {String(r.action || r.type || "Moderation action").replaceAll("_", " ")}
                    <span className="ml-[10px] text-[14px] font-semibold text-[#6B6B6B]">{r.reason || r.note || ""}</span>
                  </span>
                  <span className="flex-none text-[14px] font-semibold text-[#6B6B6B]">{fmtDate(r.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-[18px] text-[16px] font-semibold text-[#4E4E4E]">
              {records ? "No moderation actions on this member yet." : "Loading moderation history…"}
            </p>
          )}
        </div>
      )}

      <ModerationCard />
    </AdminShell>
  );
}
