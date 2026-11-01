import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import { api, fmtDate } from "../lib/api";
import { useGroupId } from "../lib/useGroup";
import iconCopy from "../assets/copy-black.svg";

/* Standalone group details — Figma 908:20971 (no sidebar): Group Info card
   with slots, dates, type/plan/cycle, Back to Dashboard. Live values come
   from GET /member/groups/detail. The refresh icon rotates the invite code
   (POST /member/groups/code/regenerate); Manage/Invite survive as small
   links so the creator flow stays reachable. Copy fix: "30, Sep" -> "30 Sep". */

const SLOTS = [
  { label: "Shared slots", value: "12" },
  { label: "Occupied slots", value: "0" },
  { label: "Remaining Slots", value: "12" },
];

const DATES = [
  { label: "Created Date", value: "25 Sep 2026" },
  { label: "Start Date", value: "30 Sep 2026" },
  { label: "Expired Date", value: "30 Oct 2026" },
];

const META = [
  { label: "Group Type", value: "Public Group" },
  { label: "Group Plan", value: "Premium" },
  { label: "Billing Cycle", value: "Monthly" },
];

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";
const TILE = `rounded-[10px] border border-[#999999] bg-white ${SHADOW}`;

function copyId(code) {
  if (navigator.clipboard) navigator.clipboard.writeText(code).catch(() => {});
}

function RefreshIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 12a8 8 0 1 1-2.34-5.66"
        stroke="#001701"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 3v4h-4"
        stroke="#001701"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GroupDetails() {
  const location = useLocation();
  const [groupId, resolved] = useGroupId(location.state?.group_id);
  const [detail, setDetail] = useState(null);
  const [code, setCode] = useState(null);
  const [regenBusy, setRegenBusy] = useState(false);
  const [regenMsg, setRegenMsg] = useState("");

  useEffect(() => {
    if (!groupId) return;
    let live = true;
    (async () => {
      const { data, error } = await api(`/member/groups/detail?group_id=${groupId}`);
      if (!live || error) return;
      setDetail(data);
      const g = data?.group || data || {};
      if (g.invite_code) setCode(g.invite_code);
    })();
    return () => {
      live = false;
    };
  }, [groupId]);

  if (resolved && !groupId) return <Navigate to="/groups/empty" replace />;

  const g = detail?.group || detail || null;
  const months = g?.plan?.billing_interval_months;
  const shownCode = code || g?.invite_code || "AD-234250569575";

  const slots = g
    ? [
        { label: "Shared slots", value: String(g.slots_offered ?? 0) },
        { label: "Occupied slots", value: String(g.occupied_slots ?? 0) },
        { label: "Remaining Slots", value: String(g.available_slots ?? 0) },
      ]
    : SLOTS;
  const dates = g
    ? [
        { label: "Created Date", value: fmtDate(g.created_at) },
        { label: "Start Date", value: fmtDate(g.start_date) },
        { label: "Expired Date", value: fmtDate(g.current_period_end) },
      ]
    : DATES;
  const meta = g
    ? [
        {
          label: "Group Type",
          value: g.visibility === "private" ? "Private Group" : "Public Group",
        },
        { label: "Group Plan", value: g.plan?.name || "Premium" },
        {
          label: "Billing Cycle",
          value: !months || months === 1 ? "Monthly" : `Every ${months} Months`,
        },
      ]
    : META;

  const regenerate = async () => {
    if (regenBusy || !groupId) return;
    setRegenBusy(true);
    setRegenMsg("");
    const { data, error } = await api("/member/groups/code/regenerate", {
      method: "POST",
      body: { group_id: groupId },
    });
    setRegenBusy(false);
    if (error || !data?.invite_code) {
      setRegenMsg(error?.message || "Could not generate a new code.");
      return;
    }
    setCode(data.invite_code);
    setRegenMsg("New invite code generated — the old one stops working.");
  };

  const idRow = (small = false) => (
    <div className="flex items-center justify-end gap-[10px]">
      <p
        className={`font-semibold text-ink ${small ? "text-[18px] leading-[22px]" : "text-[25px] leading-[35px]"}`}
      >
        Group ID: {shownCode}
      </p>
      <button type="button" onClick={() => copyId(shownCode)} aria-label="Copy group ID">
        <img src={iconCopy} alt="" className="h-[24px] w-[24px]" />
      </button>
      <button
        type="button"
        onClick={regenerate}
        disabled={regenBusy}
        title="Generate new invite code"
        aria-label="Generate new invite code"
        className="disabled:opacity-40"
      >
        <RefreshIcon />
      </button>
    </div>
  );

  const tiles = (items, small = false) => (
    <div className={small ? "flex flex-col gap-[15px]" : "grid grid-cols-3 gap-[20px]"}>
      {items.map((r) => (
        <div
          key={r.label}
          className={`${small ? "px-[20px] py-[16px]" : "h-[101px] px-[26px] pt-[21px]"} ${TILE}`}
        >
          <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            {r.label}
          </p>
          <p
            className={`font-bold whitespace-nowrap text-ink ${small ? "mt-[4px] text-[20px] leading-[24px]" : "mt-[2px] text-[20px] leading-[35px]"}`}
          >
            {r.value}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop (908:20971) */}
      <main className="relative hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative mx-auto mt-[121px] w-[830px]">
          <h1 className="text-[35px] leading-[43px] font-bold text-black">
            Group Details
          </h1>
          <div className={`mt-[50px] rounded-[20px] bg-white px-[40px] pt-[50px] pb-[50px] ${SHADOW}`}>
            <h2 className="text-[35px] leading-[43px] font-bold text-ink">
              Group Info
            </h2>
            <div className="mt-[35px]">{idRow()}</div>
            {regenMsg && (
              <p className="mt-[8px] text-right text-[14px] font-semibold text-clyse">
                {regenMsg}
              </p>
            )}
            <div className="mt-[35px] h-[2px] w-[742px] bg-[#048B0B]" />
            <div className="mt-[35px]">{tiles(slots)}</div>
            <div className="mt-[30px]">{tiles(dates)}</div>
            <div className="mt-[35px] h-[2px] w-[742px] bg-[#048B0B]" />
            <div className="mt-[35px] flex justify-between px-[85px]">
              {meta.map((m) => (
                <div key={m.label}>
                  <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    {m.label}
                  </p>
                  <p className="mt-[7px] text-[20px] leading-[24px] font-bold text-ink">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-[35px] h-[2px] w-[742px] bg-[#048B0B]" />
          </div>
          <div className="mt-[53px] text-center">
            <Link
              to="/dashboard"
              className="text-[25px] leading-[35px] font-semibold text-[#048B0B]"
            >
              Back to Dashboard
            </Link>
          </div>
          <div className="mt-[16px] text-center">
            <Link
              to="/groups/manage"
              state={{ group_id: groupId }}
              className="text-[16px] leading-[20px] font-semibold text-clyse"
            >
              Manage Group
            </Link>
            <span className="mx-[12px] text-[#999999]">·</span>
            <Link
              to="/groups/share"
              state={{ group_id: groupId }}
              className="text-[16px] leading-[20px] font-semibold text-clyse"
            >
              Invite Member
            </Link>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px] pb-[60px]">
          <h1 className="text-[30px] leading-[37px] font-bold text-black">
            Group Details
          </h1>
          <div className={`mt-[30px] rounded-[20px] bg-white p-[24px] ${SHADOW}`}>
            <h2 className="text-[25px] leading-[30px] font-bold text-ink">
              Group Info
            </h2>
            <div className="mt-[20px]">{idRow(true)}</div>
            {regenMsg && (
              <p className="mt-[8px] text-right text-[13px] font-semibold text-clyse">
                {regenMsg}
              </p>
            )}
            <div className="mt-[20px] h-[2px] w-full bg-[#048B0B]" />
            <div className="mt-[20px]">{tiles(slots, true)}</div>
            <div className="mt-[15px]">{tiles(dates, true)}</div>
            <div className="mt-[20px] h-[2px] w-full bg-[#048B0B]" />
            <div className="mt-[20px] flex flex-col gap-[16px]">
              {meta.map((m) => (
                <div key={m.label} className="flex items-baseline justify-between">
                  <p className="text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                    {m.label}
                  </p>
                  <p className="text-[18px] leading-[22px] font-bold text-ink">
                    {m.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-[20px] h-[2px] w-full bg-[#048B0B]" />
          </div>
          <div className="mt-[40px] text-center">
            <Link
              to="/dashboard"
              className="text-[20px] leading-[24px] font-semibold text-[#048B0B]"
            >
              Back to Dashboard
            </Link>
          </div>
          <div className="mt-[16px] text-center">
            <Link
              to="/groups/manage"
              state={{ group_id: groupId }}
              className="text-[16px] leading-[20px] font-semibold text-clyse"
            >
              Manage Group
            </Link>
            <span className="mx-[12px] text-[#999999]">·</span>
            <Link
              to="/groups/share"
              state={{ group_id: groupId }}
              className="text-[16px] leading-[20px] font-semibold text-clyse"
            >
              Invite Member
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
