import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import AdminShell, { BackTitle } from "../components/AdminShell";
import { TabsBar, InfoCard, ModerationCard } from "../components/AdminDetails";
import BrandTile from "../components/BrandTile";
import { api, kobo } from "../lib/api";

/* Group Details & Moderation — Figma 1175:26039 (1440, desktop only).
   The designed layout is filled from GET /admin/groups (record picked with
   ?id=) and GET /admin/moderation/records for the history tab. The member
   roster has no admin endpoint yet (see ADMIN-API-REQUEST.md #6), so the
   Joined Member block reports the occupied-slot count instead of names. */

const TABS = ["Overview", "Members", "Moderation History"];
const fmtDate = (v) =>
  v ? new Date(v).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/(\d{2}) ([A-Za-z]{3}) (\d{4})/, "$2 $1, $3") : "—";

export default function AdminGroupDetails() {
  const [tab, setTab] = useState(TABS[0]);
  const [params] = useSearchParams();
  const [group, setGroup] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [records, setRecords] = useState(null);

  useEffect(() => {
    let alive = true;
    api("/admin/groups").then((res) => {
      if (!alive) return;
      const items = Array.isArray(res.data) ? res.data : res.data?.groups || res.data?.items || [];
      const wanted = params.get("id");
      setGroup(items.find((g) => (g.group_id || g.id) === wanted) || items[0] || null);
      setLoaded(true);
    });
    return () => { alive = false; };
  }, [params]);

  useEffect(() => {
    const gid = group?.group_id || group?.id;
    if (!gid) return;
    let alive = true;
    api(`/admin/moderation/records?target_id=${gid}`).then((res) => {
      if (!alive) return;
      const items = Array.isArray(res.data) ? res.data : res.data?.records || res.data?.items || [];
      setRecords(items);
    });
    return () => { alive = false; };
  }, [group?.group_id, group?.id]);

  const service = group?.service?.name || group?.service_name || "Subscription";
  const plan = group?.plan?.name || group?.plan_name || "Premium";
  const brand = String(group?.service?.slug || group?.service_slug || service).split(" ")[0].toLowerCase();
  const owner = group?.owner_name || group?.creator?.full_name || group?.creator?.first_name || group?.owner_email || "—";
  const ownerEmail = group?.owner_email || group?.creator?.email || "—";
  const occupied = group?.occupied_slots ?? group?.member_count ?? 0;
  const offered = group?.slots_offered ?? group?.capacity ?? 0;
  const price = group?.price?.total_kobo ?? group?.price_kobo ?? null;
  const statusLabel = group ? String(group.status || "active").replaceAll("_", " ") : "—";

  const roster = (
    <div className="mt-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px] py-[18px]">
      {loaded && group ? (
        <p className="text-[16px] font-semibold text-[#4E4E4E]">
          {occupied} of {offered} slots occupied — the named member roster arrives with the
          group-members endpoint (requested from backend, see ADMIN-API-REQUEST.md #6).
        </p>
      ) : (
        <p className="text-[16px] font-semibold text-[#4E4E4E]">Loading group…</p>
      )}
    </div>
  );

  return (
    <AdminShell active="users" sub="gm">
      <BackTitle title="Group Details & Moderation" />

      {/* Profile card */}
      <div className="mt-[30px] flex min-h-[175px] flex-wrap items-center justify-between gap-[20px] rounded-[20px] border border-[#999999] bg-white px-[31px] py-[20px]">
        <div className="flex items-center gap-[20px]">
          <BrandTile brand={brand} size={80} />
          <span>
            <span className="block text-[25px] font-bold text-[#000000]">
              {!loaded ? "Loading group…" : group ? `${service} ${plan} Group` : "No groups yet"}
            </span>
            <span className="block text-[18px] font-semibold text-[#6B6B6B]">{group ? `Created by ${owner}` : "Groups created by members will appear here with their full record."}</span>
            <span className="block text-[18px] font-semibold text-[#6B6B6B]">
              Group ID: <span className="text-[#000000]">{group ? String(group.group_id || group.id).slice(0, 8).toUpperCase() : "—"}</span>
            </span>
          </span>
        </div>
        <div className="flex gap-[15px]">
          <div className="flex h-[100px] w-[150px] flex-col items-center justify-center rounded-[10px] border border-[#999999] bg-white">
            <span className="text-[18px] font-semibold text-[#4E4E4E]">Member</span>
            <span className="text-[20px] font-bold text-[#000000]">{loaded ? `${occupied}/${offered}` : "—"}</span>
          </div>
          <div className="flex h-[100px] w-[150px] flex-col items-center justify-center rounded-[10px] border border-[#999999] bg-white">
            <span className="text-[18px] font-semibold text-[#4E4E4E]">Start Date</span>
            <span className="text-[20px] font-bold text-[#000000]">{group ? fmtDate(group.start_date || group.created_at) : "—"}</span>
          </div>
          <div className="flex h-[100px] w-[150px] flex-col items-center justify-center rounded-[10px] border border-[#999999] bg-white">
            <span className="text-[18px] font-semibold text-[#4E4E4E]">Status</span>
            <span className="text-[20px] font-bold text-[#048B0B] capitalize">{statusLabel}</span>
          </div>
        </div>
      </div>

      <TabsBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === "Overview" && (
        <>
          <h2 className="mt-[30px] text-[25px] font-bold text-[#000000]">Group Information</h2>
          <div className="mt-[15px] flex flex-wrap gap-[30px]">
            <InfoCard label="Creator" className="w-full lg:w-[350px]">
              {owner}
              <br />
              {ownerEmail}
            </InfoCard>
            <InfoCard label="Subscription" className="w-full lg:w-[350px]">
              {service} {plan}
              <br />
              {price != null ? `${kobo(price)} / Monthly` : "—"}
            </InfoCard>
            <InfoCard label="Capacity" className="w-full lg:w-[350px]">
              {offered} Slots
              <br />
              Shared Slot {occupied}/{offered}
            </InfoCard>
          </div>
          <div className="mt-[15px] flex flex-wrap gap-[30px]">
            <InfoCard label="Visibility / Access" className="w-full lg:w-[350px]">
              {String(group?.visibility || "public").replaceAll("_", " ")} · {String(group?.access_method || "credentials").replaceAll("_", " ")}
            </InfoCard>
            <InfoCard label="Verification" className="w-full lg:w-[350px]">
              {String(group?.verification_status || (group?.verified ? "verified" : "pending")).replaceAll("_", " ")}
            </InfoCard>
            <InfoCard label="Created" className="w-full lg:w-[350px]">
              {group ? fmtDate(group.created_at) : "—"}
            </InfoCard>
          </div>
          <h2 className="mt-[30px] text-[20px] font-bold text-[#000000]">Joined Member</h2>
          {roster}
        </>
      )}
      {tab === "Members" && (
        <>
          <h2 className="mt-[30px] text-[20px] font-bold text-[#000000]">Joined Member</h2>
          {roster}
        </>
      )}
      {tab === "Moderation History" && (
        <>
          <h2 className="mt-[30px] text-[20px] font-bold text-[#000000]">Moderation History</h2>
          <div className="mt-[15px] rounded-[10px] border border-[#999999] bg-white px-[20px] py-[10px]">
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
                {records ? "No moderation actions on this group yet." : "Loading moderation history…"}
              </p>
            )}
          </div>
        </>
      )}

      <ModerationCard />
    </AdminShell>
  );
}
