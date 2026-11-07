import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import GroupTabs from "../components/GroupTabs";
import ExtraBlock from "../components/ExtraBlock";
import iconMovie from "../assets/figma/icon-movie.svg";
import iconMusic from "../assets/figma/icon-music.svg";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import Sk from "../components/Skeleton";
import DetailModal, { DetailRow } from "../components/DetailModal";
import { api, fmtDay, kobo } from "../lib/api";
import { useGroupId } from "../lib/useGroup";

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
const ENDED = {
  label: "Ended",
  bg: "bg-[#F1F1F1]",
  text: "text-[#6B6B6B]",
  dot: "bg-[#999999]",
};

const SUB = "Member";

function memberBucket(m) {
  if (m.access?.needs_reconfirmation) return "access";
  const s = (m.status || "active").toLowerCase();
  if (s === "active") return "active";
  if (["removed", "cancelled", "expired", "ended", "suspended"].includes(s)) return "failed";
  if (["pending", "awaiting_payment"].includes(s)) return "pending";
  return "failed";
}

function memberPill(m) {
  const b = memberBucket(m);
  if (b === "access") return ACCESS;
  if (b === "active") return ACTIVE;
  if (b === "pending") return PENDING;
  if (b === "failed") {
    const s = String(m.status || "").toLowerCase();
    return { ...ENDED, label: s === "removed" ? "Removed" : s === "cancelled" ? "Cancelled" : s === "suspended" ? "Suspended" : "Ended" };
  }
  return PENDING;
}

function initials(name) {
  const parts = (name || "Member").split(" ");
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function RemoveButton({ mid, canRemove, busy, onRemove, mobile = false }) {
  if (!mid || canRemove !== true) return null;
  return (
    <button
      type="button"
      onClick={onRemove}
      disabled={busy}
      className={
        mobile
          ? "mt-[4px] text-[11px] leading-[14px] font-semibold text-[#E31B00] disabled:opacity-60"
          : "mt-[6px] text-[13px] leading-[16px] font-semibold text-[#E31B00] disabled:opacity-60"
      }
    >
      {busy ? "Removing…" : "Remove member"}
    </button>
  );
}

/* Loading stand-ins (shimmer, never mock content). */
function MemberRowSk() {
  return (
    <div className="flex h-[127px] items-center rounded-[20px] bg-white px-[31px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      <Sk className="h-[75px] w-[75px] flex-none !rounded-full" />
      <span className="ml-[20px] min-w-0">
        <Sk className="h-[26px] w-[190px]" />
        <Sk className="mt-[8px] h-[20px] w-[240px]" />
      </span>
      <Sk className="ml-auto h-[40px] w-[160px] flex-none !rounded-[10px]" />
    </div>
  );
}

function MemberRowMSk() {
  return (
    <div className="flex h-[87px] rounded-[20px] bg-white px-[11px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      <Sk className="h-[50px] w-[50px] flex-none self-center !rounded-full" />
      <span className="ml-[10px] min-w-0 pt-[16px]">
        <Sk className="h-[20px] w-[140px]" />
        <Sk className="mt-[13px] h-[16px] w-[180px]" />
      </span>
      <Sk className="mt-[16px] ml-auto h-[32px] w-[110px] flex-none !rounded-[5px]" />
    </div>
  );
}

/* Desktop row (G4): 75px avatar + name/tag/sub + fixed 160px pill. */
function MemberRow({ name, status, sub, mid, canRemove, busy, onRemove, onDetails }) {
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
        <span className="mt-[8px] block max-w-[400px] truncate text-[15px] leading-[22px] font-semibold whitespace-nowrap text-[#6B6B6B]">
          {sub}
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

/* Mobile row (Figma PAGE 11): 370x86 card, 56px avatar, name + "Share <group>"
   line, green VERIFIED INVOICE when access is confirmed, slot price pill at the
   top right and a chevron on the right edge. */
function MemberRowM({ name, verified, sub, mid, price, onDetails }) {
  return (
    <div className="flex min-h-[86px] items-center rounded-[12px] bg-white px-[14px] py-[12px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      <span className="grid h-[56px] w-[56px] flex-none place-items-center rounded-full bg-[#DFFFE0] text-[18px] font-bold text-ink">
        {initials(name)}
      </span>
      <span className="ml-[12px] min-w-0 flex-1">
        <span className="block truncate text-[17px] leading-[22px] font-bold text-ink">
          {name}
        </span>
        <span className="mt-[2px] block truncate text-[12.5px] leading-[17px] font-semibold text-[#6B6B6B]">
          {sub}
        </span>
        {verified ? (
          <span className="mt-[4px] flex items-center gap-[4px]">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden>
              <circle cx="12" cy="12" r="12" fill="#048B0B" />
              <path
                d="m7 12.5 3.2 3.2L17 9"
                stroke="#FFFFFF"
                strokeWidth="2.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-[9.5px] leading-[12px] font-bold tracking-[0.4px] text-[#048B0B]">
              VERIFIED INVOICE
            </span>
          </span>
        ) : null}
      </span>
      <span className="ml-[8px] flex flex-none flex-col items-end gap-[10px]">
        {price ? (
          <span className="flex h-[30px] items-center justify-center rounded-[5px] bg-[#B1DBB3] px-[10px]">
            <span className="text-[12.5px] leading-[16px] font-semibold whitespace-nowrap text-ink">
              {price}
            </span>
          </span>
        ) : null}
        {mid ? (
          <button
            type="button"
            onClick={onDetails}
            aria-label={`${name} details`}
            className="grid h-[22px] w-[22px] place-items-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="m9 5 7 7-7 7"
                stroke="#001701"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : null}
      </span>
    </div>
  );
}

export default function GroupMembers() {
  const location = useLocation();
  const [groupId, resolved, idFailed] = useGroupId(location.state?.group_id);
  const [members, setMembers] = useState(null);
  const [failed, setFailed] = useState(false);
  const [group, setGroup] = useState(null);
  const [tab, setTab] = useState(0);
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
      if (m.error) setFailed(true);
      else setMembers(m.data?.members || []);
      if (!d.error) setGroup(d.data?.group || d.data || null);
    })();
    return () => {
      live = false;
    };
  }, [groupId]);

  if (resolved && !groupId && !idFailed)
    return <Navigate to="/groups/empty" replace />;
  const loadFailed = failed || (idFailed && !groupId);

  const doRemove = async (mid) => {
    if (!mid || busyId) return;
    const member = (members || []).find((m) => m.membership_id === mid);
    const memberName = member?.first_name || member?.full_name || "this member";
    const confirmed = window.confirm(
      `Remove ${memberName} from this group? This revokes their access and frees the slot. Their membership history will be kept. This action does not issue a refund.`,
    );
    if (!confirmed) return;
    setBusyId(mid);
    setRemoveError("");
    const { data, error: apiError } = await api("/member/groups/members/remove", {
      method: "POST",
      body: { membership_id: mid, reason: "Removed by group creator" },
    });
    setBusyId(null);
    if (apiError) {
      setRemoveError(apiError.message || "Could not remove this member. Please try again.");
      return;
    }
    setMembers((ms) => (ms || []).filter((m) => m.membership_id !== mid));
    // The removal endpoint returns authoritative slot counts; use those rather
    // than guessing, so the member list stays in sync with the group summary.
    if (data && group) {
      setGroup((g) => ({
        ...g,
        ...(data.occupied_slots != null ? { occupied_slots: data.occupied_slots } : {}),
        ...(data.available_slots != null ? { available_slots: data.available_slots } : {}),
      }));
    }
  };

  const rows = (members || []).map((m) => ({
    key: m.membership_id,
    mid: m.membership_id,
    canRemove: m.permissions?.can_remove === true,
    bucket: memberBucket(m),
    name: m.first_name || m.full_name || "Member",
    status: memberPill(m),
    verified: !!m.access?.confirmed,
    sub: [
      m.joined_at ? `Joined ${fmtDay(m.joined_at)}` : null,
      m.payment?.amount_kobo != null ? `Paid ${kobo(m.payment.amount_kobo)}` : null,
      m.access?.needs_reconfirmation
        ? "Access needs reconfirmation"
        : m.access?.confirmed
          ? "Access confirmed"
          : "Access not confirmed",
    ].filter(Boolean).join(" · "),
  }));
  const groupName = [group?.service?.name, group?.plan?.name].filter(Boolean).join(" ") || "Group";
  const groupGlyph = /music|audio|spotify|apple|boom/i.test(
    [group?.service?.name, group?.service?.category].filter(Boolean).join(" "),
  )
    ? iconMusic
    : iconMovie;
  const slotPrice = (() => {
    const raw = group?.plan?.price_kobo ?? group?.price_kobo ?? group?.slot_price_kobo ?? null;
    return raw != null ? `${kobo(raw)}/Monthly` : null;
  })();
  const groupLabel = group
    ? `Member | ${[group.service?.name, group.plan?.name].filter(Boolean).join(" ")} Plan`
    : SUB;
  const counts = {
    all: rows.length,
    active: rows.filter((r) => r.bucket === "active").length,
    pending: rows.filter((r) => r.bucket === "pending").length,
    access: rows.filter((r) => r.bucket === "access").length,
    failed: rows.filter((r) => r.bucket === "failed").length,
  };
  const tabs = [
    { label: `All (${counts.all})`, width: "w-[69px] xl:w-[94px]" },
    { label: `Activated (${counts.active})`, width: "w-[120px] xl:w-[170px]" },
    { label: `Pending (${counts.pending})`, width: "w-[120px] xl:w-[156px]" },
    {
      label: `Access Issue (${counts.access})`,
      mLabel: `Access Issue (${counts.access})`,
      width: "w-[120px] xl:w-[197px]",
    },
    { label: `Failed (${counts.failed})`, width: "w-[120px] xl:w-[140px]" },
  ];
  const shown = tab === 0 ? rows : rows.filter((r) => r.bucket === FILTERS[tab]);
  const empty = rows && rows.length === 0;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[89px] flex gap-[38px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Member
            </h1>
            <GroupTabs tabs={tabs} className="mt-[50px]" active={tab} onSelect={setTab} loading={!members && !loadFailed} />
            {group && (group.available_slots != null || group.slots_offered != null) && (
              <p className="mt-[14px] text-[15px] font-semibold text-[#6B6B6B]">
                Slots available: {group.available_slots ?? Math.max(0, (group.slots_offered || 0) - (group.occupied_slots || 0))}
                {group.slots_offered != null ? ` of ${group.slots_offered}` : ""}
              </p>
            )}
            <div className="mt-[30px] rounded-[20px] bg-white px-[40px] pt-[85px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              {removeError && (
                <p className="mb-[16px] text-[16px] leading-[20px] font-semibold text-[#FF0000]">
                  {removeError}
                </p>
              )}
              <div className="flex flex-col gap-[15px]">
                {!members && !loadFailed ? (
                  [0, 1, 2, 3].map((i) => <MemberRowSk key={i} />)
                ) : (
                  shown.map((m) => (
                    <MemberRow
                      key={m.key || m.name}
                      {...m}
                      sub={m.sub || groupLabel}
                      busy={m.mid != null && busyId === m.mid}
                      onRemove={() => doRemove(m.mid)}
                      onDetails={() => openDetail(m.mid)}
                    />
                  ))
                )}
                {empty && (
                  <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    No members yet. Invite people to fill this group.
                  </p>
                )}
                {loadFailed && (
                  <p className="text-[18px] leading-[22px] font-semibold text-[#FF0000]">
                    Could not load members. Please try again.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M12 693:22289): has subtitle + full-bleed rows card */}
      <main className="relative bg-white xl:hidden">
        {/* Figma EMAIL VERIFICATION MOBILE PAGE 11 (the member roster): a back
            chevron plus the group name, then the roster cards. No member
            header, no page title, no tabs — those are desktop chrome. */}
        <div className="mx-[30px] mt-[30px] flex items-center gap-[16px]">
          <Link
            to="/groups/browse"
            aria-label="Back to my groups"
            className="grid h-[44px] w-[44px] flex-none place-items-center rounded-full bg-white shadow-[0_0_13.87px_rgba(0,23,1,0.15)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="m14.5 5.5-7 6.5 7 6.5"
                stroke="#001701"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span
            aria-hidden="true"
            className="h-[26px] w-[26px] flex-none"
            style={{
              backgroundColor: "#001701",
              maskImage: `url(${groupGlyph})`,
              WebkitMaskImage: `url(${groupGlyph})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
          <h1 className="min-w-0 truncate text-[25px] leading-[32px] font-bold text-ink">
            {groupName}
          </h1>
        </div>

        <div className="mt-[30px] bg-white px-[30px] pb-[40px]">
          {removeError && (
            <p className="mb-[16px] text-[13px] leading-[20px] font-semibold text-[#FF0000]">
              {removeError}
            </p>
          )}
          <div className="flex flex-col gap-[15px]">
            {!members && !loadFailed ? (
              [0, 1, 2, 3].map((i) => <MemberRowMSk key={i} />)
            ) : (
              shown.map((m) => (
                <MemberRowM
                  key={m.key || m.name}
                  {...m}
                  price={slotPrice}
                  onDetails={() => openDetail(m.mid)}
                />
              ))
            )}
            {empty && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No members yet. Invite people to fill this group.
              </p>
            )}
            {loadFailed && (
              <p className="text-[13px] leading-[20px] font-semibold text-[#FF0000]">
                Could not load members. Please try again.
              </p>
            )}
          </div>
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
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
              <DetailRow
                label="Paid on"
                value={fmtDay(detail.membership?.payment?.paid_at) || "—"}
              />
              <DetailRow
                label="Paid through"
                value={fmtDay(detail.membership?.current_period_end) || "—"}
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
