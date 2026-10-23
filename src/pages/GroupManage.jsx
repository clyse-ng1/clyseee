import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import { api, fmtTx } from "../lib/api";
import { useGroupId } from "../lib/useGroup";
import iconNaira from "../assets/naira-green.svg";
import iconUsers from "../assets/stat-users.svg";
import iconBell from "../assets/side-notification-green.svg";
import iconChevRight from "../assets/icon-chev-right.svg";
import iconFaMinus from "../assets/icon-fa-minus.svg";
import iconFaPlus from "../assets/icon-fa-plus.svg";

const SUB = "Manage your subscriptions, view details, and track your groups.";

/* Figma samples, shown while the live activity loads. */
const ROWS = [
  { label: "New Members", sub: "Notify when someone joins the group" },
  { label: "Payment reminders", sub: "Remind members before payment is due" },
  { label: "Group updates", sub: "Updates about group activity" },
  { label: "Earning", sub: "Notify when you earn from your group" },
];

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";

function prettyEvent(type) {
  return (type || "Update")
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function Tiles({ groupId }) {
  const tile = `flex h-[169px] w-[400px] items-center rounded-[20px] bg-white px-[31px] ${SHADOW}`;
  return (
    <div className="flex gap-[30px]">
      <Link to="/earnings" className={tile}>
        <img src={iconNaira} alt="" className="h-[70px] w-[70px]" />
        <span className="ml-[20px]">
          <span className="block text-[25px] leading-[30px] font-bold text-black">
            Group Earning
          </span>
          <span className="mt-[11px] block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            {SUB}
          </span>
        </span>
      </Link>
      <Link to="/groups/members" state={{ group_id: groupId }} className={tile}>
        <img src={iconUsers} alt="" className="h-[56px] w-[56px]" />
        <span className="ml-[20px]">
          <span className="block text-[25px] leading-[30px] font-bold text-black">
            Member
          </span>
          <span className="mt-[11px] block text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            View and manage members
          </span>
        </span>
      </Link>
    </div>
  );
}

/* Mobile tiles (M13): h114, 40px icon, label 18 + sub 13, chevron right. */
function TilesM({ groupId }) {
  const tiles = [
    { to: "/earnings", icon: iconNaira, iconCls: "h-[40px] w-[40px]", label: "Group Earning", sub: SUB },
    { to: "/groups/members", icon: iconUsers, iconCls: "h-[32px] w-[40px]", label: "Member", sub: "View and manage members" },
  ];
  return (
    <div className="flex flex-col gap-[30px]">
      {tiles.map((t) => (
        <Link
          key={t.label}
          to={t.to}
          state={t.to === "/groups/members" ? { group_id: groupId } : undefined}
          className={`flex h-[114px] w-full items-center rounded-[20px] bg-white px-[21px] ${SHADOW}`}
        >
          <img src={t.icon} alt="" className={`flex-none ${t.iconCls}`} />
          <span className="ml-[15px] min-w-0">
            <span className="block text-[18px] leading-[22px] font-semibold text-black">
              {t.label}
            </span>
            <span className="block truncate text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
              {t.sub}
            </span>
          </span>
          <span className="ml-auto grid h-[35px] w-[35px] flex-none place-items-center text-ink">
            <img src={iconChevRight} alt="" className="h-[24px] w-auto" />
          </span>
        </Link>
      ))}
    </div>
  );
}

function NotifRows({ items }) {
  return (
    <div className="flex flex-col gap-[15px]">
      {(items || ROWS).map((r) => (
        <div
          key={r.label}
          className={`flex h-[124px] items-center rounded-[20px] bg-white px-[21px] ${SHADOW}`}
        >
          <img src={iconBell} alt="" className="h-[50px] w-[50px]" />
          <div className="ml-[20px]">
            <p className="text-[25px] leading-[30px] font-bold text-black">
              {r.label}
            </p>
            <p className="mt-[8px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {r.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Mobile notif rows (M13): h97, bell 40, label 18 + sub 13. */
function NotifRowsM({ items }) {
  return (
    <div className="flex flex-col gap-[15px]">
      {(items || ROWS).map((r) => (
        <div
          key={r.label}
          className={`flex h-[97px] items-center rounded-[20px] bg-white px-[21px] ${SHADOW}`}
        >
          <img src={iconBell} alt="" className="h-[40px] w-[40px] flex-none" />
          <div className="ml-[10px] min-w-0">
            <p className="text-[18px] leading-[22px] font-semibold text-black">
              {r.label}
            </p>
            <p className="mt-[3px] truncate text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
              {r.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Slots + visibility editor (desktop only; Figma has no mobile edit UI).
   Opens above the buttons when Manage Group is tapped. */
function EditPanel({ group, groupId, onSaved, onCancel }) {
  const occupied = group?.occupied_slots ?? 0;
  const capacity = group?.member_slot_capacity ?? group?.slots_offered ?? 5;
  const min = Math.max(1, occupied);
  const max = Math.max(min, capacity);
  const [slots, setSlots] = useState(group?.slots_offered ?? 3);
  const [vis, setVis] = useState(group?.visibility || "public");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const shown = Math.min(Math.max(slots, min), max);

  const save = async () => {
    if (busy || !groupId) return;
    setBusy(true);
    setError("");
    const { data, error: apiError } = await api("/member/groups", {
      method: "PUT",
      body: { group_id: groupId, slots_offered: shown, visibility: vis },
    });
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not save changes. Please try again.");
      return;
    }
    onSaved(data?.group || null);
  };

  return (
    <div className="mt-[30px] rounded-[20px] border border-clyse bg-white px-[40px] pt-[30px] pb-[30px]">
      <h3 className="text-[25px] leading-[30px] font-bold text-ink">
        Edit Group
      </h3>
      <div className="mt-[20px] flex items-center gap-[30px]">
        <span className="text-[18px] leading-[22px] font-semibold text-ink">
          Slots offered
        </span>
        <span className="flex items-center gap-[16px]">
          <button
            type="button"
            aria-label="Fewer slots"
            onClick={() => setSlots((s) => Math.max(min, s - 1))}
            disabled={shown <= min}
            className="h-[40px] w-[40px] disabled:opacity-40"
          >
            <img src={iconFaMinus} alt="" className="h-[40px] w-[40px]" />
          </button>
          <span className="w-[40px] text-center text-[35px] leading-[43px] font-bold text-ink">
            {shown}
          </span>
          <button
            type="button"
            aria-label="More slots"
            onClick={() => setSlots((s) => Math.min(max, s + 1))}
            disabled={shown >= max}
            className="h-[40px] w-[40px] disabled:opacity-40"
          >
            <img src={iconFaPlus} alt="" className="h-[40px] w-[40px]" />
          </button>
        </span>
        <span className="text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
          {occupied} of {shown} slots taken
        </span>
      </div>
      <div className="mt-[20px] flex items-center gap-[30px]">
        <span className="text-[18px] leading-[22px] font-semibold text-ink">
          Visibility
        </span>
        <span className="flex gap-[16px]">
          <button
            type="button"
            onClick={() => setVis("public")}
            aria-pressed={vis === "public"}
            className={`h-[50px] w-[160px] rounded-[10px] border text-[18px] leading-[22px] font-semibold ${
              vis === "public"
                ? "border-clyse bg-[#F1F8F1] text-ink"
                : "border-[#999999] bg-white text-[#6B6B6B]"
            }`}
          >
            Public
          </button>
          <button
            type="button"
            onClick={() => setVis("private")}
            aria-pressed={vis === "private"}
            className={`h-[50px] w-[160px] rounded-[10px] border text-[18px] leading-[22px] font-semibold ${
              vis === "private"
                ? "border-clyse bg-[#F1F8F1] text-ink"
                : "border-[#999999] bg-white text-[#6B6B6B]"
            }`}
          >
            Private
          </button>
        </span>
      </div>
      {error && (
        <p className="mt-[16px] text-[16px] font-semibold text-[#FF0000]">
          {error}
        </p>
      )}
      <div className="mt-[24px] flex gap-[20px]">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="bg-btn h-[60px] w-[220px] rounded-[16px] text-[18px] leading-[22px] font-semibold text-[#F1F8F1] disabled:opacity-50"
        >
          {busy ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-[60px] w-[220px] rounded-[16px] border border-[#999999] bg-white text-[18px] leading-[22px] font-semibold text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function DeleteButton({ groupId, mobile = false }) {
  const navigate = useNavigate();
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    if (!armed) {
      setArmed(true);
      return;
    }
    if (busy || !groupId) return;
    setBusy(true);
    setError("");
    const { error: apiError } = await api("/member/groups/close", {
      method: "POST",
      body: { group_id: groupId, reason: "Closed by group creator" },
    });
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not close the group. Please try again.");
      setArmed(false);
      return;
    }
    navigate("/groups");
  };

  return (
    <>
      <button
        onClick={handle}
        className={
          mobile
            ? "mt-[70px] h-[60px] w-full cursor-pointer rounded-[16px] bg-[#E31B00]"
            : "h-[60px] w-[354px] flex-none cursor-pointer rounded-[16px] bg-[#E31B00]"
        }
      >
        <span className="text-[18px] leading-[22px] font-semibold text-white">
          {busy ? "Closing…" : armed ? "Tap Again to Confirm" : "Delete Group"}
        </span>
      </button>
      {error && (
        <p
          className={
            mobile
              ? "mt-[12px] text-center text-[14px] font-semibold text-[#FF0000]"
              : "mt-[12px] text-[14px] font-semibold text-[#FF0000]"
          }
        >
          {error}
        </p>
      )}
    </>
  );
}

export default function GroupManage() {
  const location = useLocation();
  const [groupId, resolved] = useGroupId(location.state?.group_id);
  const [items, setItems] = useState(null);
  const [group, setGroup] = useState(null);
  const [visibility, setVisibility] = useState("Public Group");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!groupId) return;
    let live = true;
    (async () => {
      const [e, d] = await Promise.all([
        api(`/member/groups/events?group_id=${groupId}&limit=10`),
        api(`/member/groups/detail?group_id=${groupId}`),
      ]);
      if (!live) return;
      if (!e.error) {
        setItems(
          (e.data?.events || []).map((ev, i) => ({
            label: `${prettyEvent(ev.event_type)}${i === 0 ? "" : ""}`,
            sub: fmtTx(ev.created_at),
            key: ev.id || i,
          })),
        );
      }
      const g = d.data?.group || d.data;
      if (g) {
        setGroup(g);
        setVisibility(g.visibility === "private" ? "Private Group" : "Public Group");
      }
    })();
    return () => {
      live = false;
    };
  }, [groupId]);

  if (resolved && !groupId) return <Navigate to="/groups/empty" replace />;

  // Keys must be unique even when two events share a label.
  const keyed = items?.map((r, i) => ({ ...r, label: r.label, key: `${r.label}-${i}` }));
  const empty = items && items.length === 0;

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
              Manage Group
            </h1>
            <div className="mt-[50px]">
              <Tiles groupId={groupId} />
            </div>
            <div className={`mt-[30px] rounded-[20px] bg-white px-[40px] pt-[50px] pb-[50px] ${SHADOW}`}>
              <div className="flex items-start justify-between">
                <h2 className="text-[35px] leading-[43px] font-bold text-ink">
                  Notification
                </h2>
                <span className="mt-[10px] text-right text-[18px] leading-[22px] font-semibold text-clyse">
                  {visibility}
                  {group?.verification_status && (
                    <span
                      className={`mt-[4px] block text-[15px] ${
                        group.verification_status === "verified" ||
                        group.verification_status === "approved"
                          ? "text-clyse"
                          : group.verification_status === "rejected"
                            ? "text-[#E31B00]"
                            : "text-[#CB5300]"
                      }`}
                    >
                      {group.verification_status === "verified" ||
                      group.verification_status === "approved"
                        ? "Verified"
                        : group.verification_status === "rejected"
                          ? "Verification rejected"
                          : "Verification pending"}
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-[70px]">
                <NotifRows items={keyed} />
                {empty && (
                  <p className="mt-[16px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    No activity yet.
                  </p>
                )}
              </div>
              {editing && group && (
                <EditPanel
                  group={group}
                  groupId={groupId}
                  onCancel={() => setEditing(false)}
                  onSaved={(updated) => {
                    if (updated) {
                      setGroup(updated);
                      setVisibility(
                        updated.visibility === "private" ? "Private Group" : "Public Group",
                      );
                    }
                    setEditing(false);
                  }}
                />
              )}
              <div className="mt-[70px] flex gap-[40px]">
                <button
                  onClick={() => setEditing((v) => !v)}
                  className="h-[60px] w-[356px] flex-none cursor-pointer rounded-[10px] border border-clyse bg-white shadow-[0_0_7px_rgba(0,23,1,0.25)]"
                >
                  <span className="text-[18px] leading-[22px] font-semibold text-ink">
                    {editing ? "Close Editor" : "Manage Group"}
                  </span>
                </button>
                <DeleteButton groupId={groupId} />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Mobile (M13 696:23520): has subtitle, full-bleed card, Delete only */}
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
            Manage Group
          </h1>
          <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
            {SUB}
          </p>
          <div className="mt-[50px]">
            <TilesM groupId={groupId} />
          </div>
        </div>
        <div className="mt-[30px] bg-white px-[30px] pt-[50px] pb-[50px]">
          <h2 className="text-[35px] leading-[43px] font-bold text-ink">
            Notification
          </h2>
          <div className="mt-[70px]">
            <NotifRowsM items={keyed} />
            {empty && (
              <p className="mt-[16px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                No activity yet.
              </p>
            )}
          </div>
          <DeleteButton groupId={groupId} mobile />
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
