import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import GroupTabs from "../components/GroupTabs";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import DetailModal, { DetailRow } from "../components/DetailModal";
import { api, fmtDay, kobo } from "../lib/api";
import { useGroupId } from "../lib/useGroup";

/* Figma samples, shown while the live members load. */
const TABS = [
  { label: "All (8)", width: "w-[69px] xl:w-[94px]" },
  { label: "Activated (4)", width: "w-[120px] xl:w-[170px]" },
  { label: "Pending (1)", width: "w-[120px] xl:w-[156px]" },
  { label: "Access Issue (3)", mLabel: "Access Issue (2)", width: "w-[120px] xl:w-[197px]" },
  { label: "Failed (1)", width: "w-[120px] xl:w-[140px]" },
];
const FILTERS = ["all", "active", "pending", "access", "failed"];

const ACTIVE = { label: "Active", bg: "bg-[#DFFFE0]", text: "text-clyse", dot: "bg-clyse" };
const PENDING = {
  label: "Pending",
  bg: "bg-[#FDEED9]",
  text: "text-[#FF9400]",
  dot: "bg-[#FF9400]",
};
const ACCESS = {
  label: "Access Issue",
  bg: "bg-[#FFF1F1]",
  text: "text-[#FF0000]",
  dot: "bg-[#FF0000]",
};

const MEMBERS = [
  { name: "Allison Press", status: ACTIVE },
  { name: "Jocelyn Siphron", status: PENDING },
  { name: "Talan Franci", status: ACCESS },
  { name: "Martin Carder", status: ACTIVE },
  { name: "Makenna Rhiel Madsen", status: PENDING },
  { name: "Zain Ekstrom Bothman", status: ACTIVE },
  { name: "Aspen Dorwart", status: ACCESS },
  { name: "Kaiya Dorwart", status: ACCESS },
  { name: "Carter Torff", status: ACTIVE },
];

/* Mobile member set (M12 693:22289): 8 rows, differs from desktop. */
const M_MEMBERS = [
  { name: "Allison Press", status: ACTIVE },
  { name: "Cristofer Korsgaard", status: ACTIVE },
  { name: "Kaiya Calzoni", status: ACCESS },
  { name: "Wilson Lipshutz", status: ACTIVE },
  { name: "Lindsey Saris", status: PENDING },
  { name: "Aspen Calzoni", status: ACTIVE },
  { name: "Kierra Dias", status: ACCESS },
  { name: "Terry Westervelt", status: ACTIVE },
];

const SUB = "Member | Netflix Premium Plan";

function memberBucket(m) {
  if (m.access?.needs_reconfirmation) return "access";
  const s = (m.status || "active").toLowerCase();
  if (s === "active") return "active";
  if (s === "removed") return "failed";
  return "pending";
}

function memberPill(m) {
  const b = memberBucket(m);
  if (b === "access") return ACCESS;
  if (b === "active") return ACTIVE;
  return PENDING;
}

function initials(name) {
  const parts = (name || "Member").split(" ");
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function RemoveButton({ mid, canRemove, armed, busy, onRemove, mobile = false }) {
  if (!mid || canRemove === false) return null;
  return (
    <button
      type="button"
      onClick={onRemove}
      className={
        mobile
          ? `mt-[4px] text-[11px] leading-[14px] font-semibold ${armed ? "text-[#FF0000]" : "text-[#999999]"}`
          : `mt-[6px] text-[13px] leading-[16px] font-semibold ${armed ? "text-[#FF0000]" : "text-[#999999]"}`
      }
    >
      {busy ? "Removing…" : armed ? "Tap again to remove" : "Remove"}
    </button>
  );
}

/* Desktop row (G4): 75px avatar + name/tag/sub + fixed 160px pill. */
function MemberRow({ name, status, sub, mid, canRemove, armed, busy, onRemove, onDetails }) {
  return (
    <div className="flex h-[127px] items-center rounded-[20px] bg-white px-[31px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      <span className="grid h-[75px] w-[75px] flex-none place-items-center rounded-full bg-[#DFFFE0] text-[25px] font-bold text-ink">
        {initials(name)}
      </span>
      <span className="ml-[20px] min-w-0">
        <span className="block text-[25px] leading-[28px] font-bold whitespace-nowrap text-ink">
          {name}
        </span>
        <span className="mt-[1px] block text-[10px] leading-[12px] font-semibold text-clyse">
          Entertainment
        </span>
        <span className="mt-[8px] block text-[18px] leading-[22px] font-semibold whitespace-nowrap text-[#6B6B6B]">
          {sub || SUB}
        </span>
      </span>
      <span className="ml-auto flex w-[160px] flex-none flex-col items-center">
        <span
          className={`flex h-[40px] w-[160px] items-center justify-center gap-[10px] rounded-[10px] ${status.bg}`}
        >
          <span className={`h-[13px] w-[13px] rounded-full ${status.dot}`} />
          <span className={`text-[18px] leading-[22px] font-semibold whitespace-nowrap ${status.text}`}>
            {status.label}
          </span>
        </span>
        <RemoveButton
          mid={mid}
          canRemove={canRemove}
          armed={armed}
          busy={busy}
          onRemove={onRemove}
        />
        {mid && (
          <button
            type="button"
            onClick={onDetails}
            className="mt-[6px] text-[13px] leading-[16px] font-semibold text-clyse"
          >
            Details
          </button>
        )}
      </span>
    </div>
  );
}

/* Mobile row (M12): h87, 50px avatar + name/sub, hug pill, no tag. */
function MemberRowM({ name, status, sub, mid, canRemove, armed, busy, onRemove, onDetails }) {
  return (
    <div className="flex h-[87px] rounded-[20px] bg-white px-[11px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      <span className="grid h-[50px] w-[50px] flex-none place-items-center self-center rounded-full bg-[#DFFFE0] text-[18px] font-bold text-ink">
        {initials(name)}
      </span>
      <span className="ml-[10px] min-w-0 pt-[16px]">
        <span className="block text-[18px] leading-[22px] font-semibold whitespace-nowrap text-ink">
          {name}
        </span>
        <span className="mt-[13px] block text-[13px] leading-[20px] font-semibold whitespace-nowrap text-[#6B6B6B]">
          {sub || SUB}
        </span>
      </span>
      <span className="mt-[16px] ml-auto flex flex-none flex-col items-end">
        <span
          className={`flex h-[32px] items-center justify-center rounded-[5px] px-[10px] ${status.bg}`}
        >
          <span className={`text-[13px] leading-[16px] font-semibold whitespace-nowrap ${status.text}`}>
            {status.label}
          </span>
        </span>
        <RemoveButton
          mid={mid}
          canRemove={canRemove}
          armed={armed}
          busy={busy}
          onRemove={onRemove}
          mobile
        />
        {mid && (
          <button
            type="button"
            onClick={onDetails}
            className="mt-[4px] text-[12px] leading-[14px] font-semibold text-clyse"
          >
            Details
          </button>
        )}
      </span>
    </div>
  );
}

export default function GroupMembers() {
  const location = useLocation();
  const [groupId, resolved] = useGroupId(location.state?.group_id);
  const [members, setMembers] = useState(null);
  const [group, setGroup] = useState(null);
  const [tab, setTab] = useState(0);
  const [armed, setArmed] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [removeError, setRemoveError] = useState("");
  const [detailMid, setDetailMid] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const openDetail = async (mid) => {
    if (!mid) return;
    setDetailMid(mid);
    setDetail(null);
    setDetailError("");
    setDetailLoading(true);
    const { data, error } = await api(
      `/member/groups/members/detail?membership_id=${mid}`,
    );
    setDetailLoading(false);
    if (error) setDetailError(error.message || "Could not load member details.");
    else setDetail(data || {});
  };

  useEffect(() => {
    if (!groupId) return;
    let live = true;
    (async () => {
      const [m, d] = await Promise.all([
        api(`/member/groups/members?group_id=${groupId}`),
        api(`/member/groups/detail?group_id=${groupId}`),
      ]);
      if (!live) return;
      if (!m.error) setMembers(m.data?.members || []);
      if (!d.error) setGroup(d.data?.group || d.data || null);
    })();
    return () => {
      live = false;
    };
  }, [groupId]);

  if (resolved && !groupId) return <Navigate to="/groups/empty" replace />;

  const doRemove = async (mid) => {
    if (!mid || busyId) return;
    if (armed !== mid) {
      setArmed(mid);
      setRemoveError("");
      return;
    }
    setBusyId(mid);
    setRemoveError("");
    const { error: apiError } = await api("/member/groups/members/remove", {
      method: "POST",
      body: { membership_id: mid, reason: "Removed by group creator" },
    });
    setBusyId(null);
    setArmed(null);
    if (apiError) {
      setRemoveError(apiError.message || "Could not remove this member. Please try again.");
      return;
    }
    setMembers((ms) => (ms || []).filter((m) => m.membership_id !== mid));
  };

  const rows = members
    ? members.map((m) => ({
        key: m.membership_id,
        mid: m.membership_id,
        canRemove: m.permissions?.can_remove !== false,
        bucket: memberBucket(m),
        name: m.first_name || m.full_name || "Member",
        status: memberPill(m),
      }))
    : null;
  const sub = group
    ? `Member | ${[group.service?.name, group.plan?.name].filter(Boolean).join(" ")} Plan`
    : SUB;
  const counts = rows
    ? {
        all: rows.length,
        active: rows.filter((r) => r.bucket === "active").length,
        pending: rows.filter((r) => r.bucket === "pending").length,
        access: rows.filter((r) => r.bucket === "access").length,
        failed: rows.filter((r) => r.bucket === "failed").length,
      }
    : null;
  const tabs = counts
    ? [
        { label: `All (${counts.all})`, width: "w-[69px] xl:w-[94px]" },
        { label: `Activated (${counts.active})`, width: "w-[120px] xl:w-[170px]" },
        { label: `Pending (${counts.pending})`, width: "w-[120px] xl:w-[156px]" },
        {
          label: `Access Issue (${counts.access})`,
          mLabel: `Access Issue (${counts.access})`,
          width: "w-[120px] xl:w-[197px]",
        },
        { label: `Failed (${counts.failed})`, width: "w-[120px] xl:w-[140px]" },
      ]
    : TABS;
  const shown = rows
    ? tab === 0
      ? rows
      : rows.filter((r) => r.bucket === FILTERS[tab])
    : null;
  const empty = rows && rows.length === 0;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Member
            </h1>
            <GroupTabs tabs={tabs} className="mt-[50px]" active={tab} onSelect={setTab} />
            <div className="mt-[30px] rounded-[20px] bg-white px-[40px] pt-[85px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              {removeError && (
                <p className="mb-[16px] text-[16px] leading-[20px] font-semibold text-[#FF0000]">
                  {removeError}
                </p>
              )}
              <div className="flex flex-col gap-[15px]">
                {(shown || MEMBERS).map((m) => (
                  <MemberRow
                    key={m.key || m.name}
                    {...m}
                    sub={sub}
                    armed={m.mid != null && armed === m.mid}
                    busy={m.mid != null && busyId === m.mid}
                    onRemove={() => doRemove(m.mid)}
                    onDetails={() => openDetail(m.mid)}
                  />
                ))}
                {empty && (
                  <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    No members yet. Invite people to fill this group.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M12 693:22289): has subtitle + full-bleed rows card */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
          <div className="mt-[19px] grid h-[33px] place-items-center">
            <svg width="19" height="9" viewBox="0 0 19 9" fill="none" aria-hidden>
              <path
                d="M1.5 1.5 9.5 7.5l8-6"
                stroke="#6B6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="mt-[51px] text-[30px] leading-[37px] font-bold text-black">
            Member
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            Manage your subscriptions, view details, and track your groups.
          </p>
          <p className="mt-[50px] text-right text-[13px] leading-[16px] font-semibold text-clyse">
            View All
          </p>
          <GroupTabs tabs={tabs} className="mt-[12px]" active={tab} onSelect={setTab} />
        </div>
        <div className="mt-[30px] bg-white px-[30px] pt-[85px] pb-[50px]">
          {removeError && (
            <p className="mb-[16px] text-[13px] leading-[20px] font-semibold text-[#FF0000]">
              {removeError}
            </p>
          )}
          <div className="flex flex-col gap-[15px]">
            {(shown || M_MEMBERS).map((m) => (
              <MemberRowM
                key={m.key || m.name}
                {...m}
                sub={sub}
                armed={m.mid != null && armed === m.mid}
                busy={m.mid != null && busyId === m.mid}
                onRemove={() => doRemove(m.mid)}
                onDetails={() => openDetail(m.mid)}
              />
            ))}
            {empty && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No members yet. Invite people to fill this group.
              </p>
            )}
          </div>
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
      {detailMid && (
        <DetailModal
          title="Member details"
          onClose={() => setDetailMid(null)}
          loading={detailLoading}
          error={detailError}
        >
          {detail && (
            <>
              <DetailRow label="Name" value={detail.membership?.first_name || "Member"} />
              <DetailRow label="Email" value={detail.membership?.email || "—"} />
              <DetailRow label="Phone" value={detail.membership?.phone || "—"} />
              <DetailRow label="Status" value={detail.membership?.status || "—"} />
              <DetailRow
                label="Joined"
                value={fmtDay(detail.membership?.joined_at) || "—"}
              />
              <DetailRow
                label="Access confirmed"
                value={detail.membership?.access?.confirmed ? "Yes" : "No"}
              />
              <DetailRow
                label="Paid"
                value={
                  detail.membership?.payment?.amount_kobo != null
                    ? kobo(detail.membership.payment.amount_kobo)
                    : "—"
                }
              />
              {(detail.timeline || []).length > 0 && (
                <>
                  <p className="mt-[16px] mb-[6px] text-[15px] font-bold text-ink">
                    Timeline
                  </p>
                  {(detail.timeline || []).map((t, i) => (
                    <DetailRow
                      key={`${t.occurred_at || ""}-${i}`}
                      label={fmtDay(t.occurred_at) || t.event_type || "Event"}
                      value={
                        [t.from_status, t.to_status].filter(Boolean).join(" → ") ||
                        t.event_type ||
                        "—"
                      }
                    />
                  ))}
                </>
              )}
            </>
          )}
        </DetailModal>
      )}
    </div>
  );
}
