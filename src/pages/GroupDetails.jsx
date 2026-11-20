import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MobileBack } from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import CreateGroupHead from "../components/CreateGroupHead";
import { api, fmtDate, kobo, brandOf, titleCase } from "../lib/api";
import BrandTile from "../components/BrandTile";
import { useGroupId } from "../lib/useGroup";
import iconCopy from "../assets/copy-black.svg";
import { useCopy, CopiedPill } from "../lib/useCopy";
import Sidebar from "../components/Sidebar";

/* Standalone group details — Figma 908:20971 (no sidebar): Group Info card
   with slots, dates, type/plan/cycle, Back to Dashboard. Live values come
   from GET /member/groups/detail. The refresh icon rotates the invite code
   (POST /member/groups/code/regenerate); Manage/Invite survive as small
   links so the creator flow stays reachable. Copy fix: "30, Sep" -> "30 Sep". */

function GroupGlyph({ size = 19, color = "#048B0B" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3.2" fill={color} />
      <path d="M3.4 19c0-2.9 2.5-5 5.6-5s5.6 2.1 5.6 5" fill={color} />
      <circle cx="17" cy="9.2" r="2.5" fill={color} opacity="0.75" />
      <path d="M14.6 18.6c0-2.2 1.6-3.8 3.6-3.8s3.6 1.6 3.6 3.8" fill={color} opacity="0.75" />
    </svg>
  );
}

function MemberGlyph({ size = 19, color = "#CC5300" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.6" fill={color} />
      <path d="M4.8 20c0-3.4 3.2-5.8 7.2-5.8s7.2 2.4 7.2 5.8" fill={color} />
    </svg>
  );
}

function NairaGlyph({ size = 19, color = "#7F00CD" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 5v14M17 5v14M7 5l10 14M4 10h16M4 14h16"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";
const TILE = `rounded-[10px] border border-[#999999] bg-white ${SHADOW}`;


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
  const { copied, copy } = useCopy();
  const location = useLocation();
  const queryGroupId = new URLSearchParams(location.search).get("group_id");
  const [groupId, resolved] = useGroupId(location.state?.group_id || queryGroupId);
  const [detail, setDetail] = useState(null);
  const [detailState, setDetailState] = useState("loading");
  const [detailError, setDetailError] = useState("");
  const [code, setCode] = useState(null);
  const [regenBusy, setRegenBusy] = useState(false);
  const [regenMsg, setRegenMsg] = useState("");
  const [totals, setTotals] = useState(null);

  useEffect(() => {
    if (!groupId) return;
    let live = true;
    setDetailState("loading");
    setDetailError("");
    (async () => {
      const { data, error } = await api(`/member/groups/detail?group_id=${encodeURIComponent(groupId)}`);
      if (!live) return;
      if (error || !data) {
        setDetailError(error?.message || "Group details were not returned.");
        setDetailState("error");
        return;
      }
      setDetail(data);
      const g = data?.group || data || {};
      if (g.invite_code) setCode(g.invite_code);
      setDetailState("live");
    })().catch((error) => {
      if (!live) return;
      setDetailError(error?.message || "Could not load this group.");
      setDetailState("error");
    });
    return () => {
      live = false;
    };
  }, [groupId]);

  /* Figma 889:53579 opens with a summary card: Total Group, Total Member and
     Monthly Earning. Those are creator-wide, so they come from the group list
     plus the earnings endpoint, not from this one group's record. */
  useEffect(() => {
    let live = true;
    (async () => {
      const [g, e] = await Promise.all([api("/member/groups"), api("/member/earnings")]);
      if (!live) return;
      if (g.error || e.error) return;
      const groups = g.data?.groups || [];
      const earn = e.data?.earnings || e.data || {};
      setTotals({
        groups: groups.length,
        members: groups.reduce((n, x) => n + Number(x.occupied_slots || 0), 0),
        monthly: earn.lifetime_earned_kobo ?? earn.available_kobo ?? null,
      });
    })();
    return () => {
      live = false;
    };
  }, []);

  if (resolved && !groupId) return <Navigate to="/groups/empty" replace />;

  const g = detail?.group || detail || null;
  const months = g?.plan?.billing_interval_months;
  const shownCode = code || g?.invite_code || g?.id || groupId || "—";

  const slots = [
    { label: "Shared slots", value: g?.slots_offered ?? "—" },
    { label: "Occupied slots", value: g?.occupied_slots ?? "—" },
    { label: "Remaining Slots", value: g?.available_slots ?? "—" },
  ];
  const dates = [
    { label: "Created Date", value: fmtDate(g?.created_at) },
    { label: "Start Date", value: fmtDate(g?.start_date) },
    { label: "Expired Date", value: fmtDate(g?.current_period_end) },
  ];
  const meta = [
    { label: "Group Type", value: g?.visibility ? `${titleCase(g.visibility)} Group` : "—" },
    { label: "Group Plan", value: g?.plan?.name || "—" },
    { label: "Billing Cycle", value: !months ? "—" : months === 1 ? "Monthly" : `Every ${months} Months` },
  ];

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
      <button type="button" onClick={() => copy(shownCode)} aria-label="Copy group ID">
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
    <div className={small ? "grid grid-cols-2 gap-[15px]" : "grid grid-cols-3 gap-[20px]"}>
      {items.map((r) => (
        <div
          key={r.label}
          className={`${small ? "min-w-0 px-[16px] py-[16px]" : "min-h-[101px] px-[26px] py-[18px]"} ${TILE}`}
        >
          <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            {r.label}
          </p>
          <p
            className={`font-bold whitespace-normal break-words text-ink ${small ? "mt-[4px] text-[18px] leading-[22px]" : "mt-[2px] text-[20px] leading-[28px]"}`}
          >
            {r.value}
          </p>
        </div>
      ))}
    </div>
  );

  /* Figma 889:53579 — summary card above Group Info: brand disc + group title
     + plan line + Activated pill, then the three creator totals. */
  const summaryCard = (small = false) => {
    const svc = g?.service || {};
    const planName = g?.plan?.name ? `${g.plan.name} Plan` : "";
    const live = totals || { groups: "—", members: "—", monthly: null };
    const stats = [
      {
        label: "Total Group",
        value: String(live.groups),
        bg: "#E5FFE7",
        ink: "#048B0B",
        icon: GroupGlyph,
      },
      {
        label: "Total Member",
        value: String(live.members),
        bg: "#FFE5D3",
        ink: "#CC5300",
        icon: MemberGlyph,
      },
      {
        label: "Monthly Earning",
        value: kobo(live.monthly),
        bg: "#E6E4FF",
        ink: "#7F00CD",
        icon: NairaGlyph,
      },
    ];
    return (
      <div
        className={`rounded-[20px] border border-clyse bg-white ${SHADOW} ${
          small ? "p-[24px]" : "px-[40px] py-[36px]"
        }`}
      >
        <div className="flex items-center">
          <BrandTile brand={brandOf(svc)} name={svc.name} size={small ? 50 : 75} plain />
          <span className={small ? "ml-[14px]" : "ml-[20px]"}>
            <span
              className={`block font-bold text-ink ${
                small ? "text-[20px] leading-[26px]" : "text-[25px] leading-[32px]"
              }`}
            >
              {svc.name || "Group"}
            </span>
            {planName && (
              <span
                className={`block font-semibold text-[#6B6B6B] ${
                  small ? "text-[14px] leading-[18px]" : "text-[18px] leading-[24px]"
                }`}
              >
                {planName}
              </span>
            )}
          </span>
          <span
            className={`ml-auto flex items-center gap-[6px] rounded-[20px] bg-[#DFFFE0] ${
              small ? "h-[26px] px-[10px]" : "h-[34px] px-[16px]"
            }`}
          >
            <span className="h-[7px] w-[7px] rounded-full bg-clyse" />
            <span
              className={`font-semibold text-clyse ${
                small ? "text-[12px]" : "text-[16px]"
              }`}
            >
              {g?.status ? titleCase(g.status) : "Status unavailable"}
            </span>
          </span>
        </div>
        <div
          className={`grid grid-cols-3 ${small ? "mt-[18px] gap-[10px]" : "mt-[30px] gap-[20px]"}`}
        >
          {stats.map((st) => (
            <div
              key={st.label}
              className={`rounded-[10px] border border-clyse bg-white ${
                small ? "px-[10px] py-[9px]" : "px-[20px] py-[14px]"
              }`}
            >
              <span
                className={`grid place-items-center rounded-[6px] ${
                  small ? "h-[24px] w-[24px]" : "h-[34px] w-[34px]"
                }`}
                style={{ background: st.bg }}
              >
                <st.icon size={small ? 14 : 19} color={st.ink} />
              </span>
              <p
                className={`text-[#6B6B6B] ${
                  small ? "mt-[6px] text-[12px] leading-[16px]" : "mt-[10px] text-[18px] leading-[22px]"
                } font-semibold`}
              >
                {st.label}
              </p>
              <p
                className={`font-bold whitespace-nowrap text-ink ${
                  small ? "text-[15px] leading-[19px]" : "text-[20px] leading-[26px]"
                }`}
              >
                {st.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (detailState === "loading") return <div className="min-h-screen bg-white font-sans text-ink"><Navbar loggedIn /><main role="status" className="mx-auto max-w-3xl px-6 py-24 text-center"><h1 className="text-3xl font-bold">Loading group details…</h1></main></div>;
  if (detailState === "error" || !g) return <div className="min-h-screen bg-white font-sans text-ink"><Navbar loggedIn /><main role="alert" className="mx-auto max-w-3xl px-6 py-24 text-center"><h1 className="text-3xl font-bold">Group details unavailable</h1><p className="mt-3 text-[#596659]">{detailError || "The group could not be found."}</p><Link to="/groups" className="mt-6 inline-block rounded-lg bg-[#001701] px-5 py-3 font-bold text-white">Back to My Groups</Link></main></div>;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma BLUR BG at page level so the mobile branch gets it too. */}
      <BlurBg variant="hero" />
      <CopiedPill show={copied} />
      <Navbar loggedIn />
      {/* Desktop — Figma 889:53579: the member sidebar sits beside the 830px
          content column, exactly like every other member page. This screen was
          built to 908:20971 (a sidebar-less variant), which left it as the only
          desktop member page with no nav rail and no green-bordered items. */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden pb-[100px] xl:block">
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="My Group" />
          <div className="w-[830px] flex-none">
          {/* Figma 889:53579 head: plain "Group Details" + subtitle, no icon
              chip and no rule under it — the card starts straight after. */}
          <div className="pb-[10px]">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Group Details
            </h1>
            <p className="mt-[4px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Manage your subscriptions, view details, and track your groups.
            </p>
          </div>
          {summaryCard()}
          <div className={`mt-[30px] rounded-[20px] border border-clyse bg-white px-[40px] pt-[50px] pb-[50px] ${SHADOW}`}>
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
          {/* Card 18: the footer was bare underlined text, including a
              "Back to Dashboard" link the PM asked us to drop. Two contained
              buttons now. */}
          <div className="mt-[40px] flex gap-[30px]">
            <Link
              to="/groups/manage"
              state={{ group_id: groupId }}
              className="grid h-[60px] flex-1 place-items-center rounded-[12px] border border-clyse bg-white text-[18px] font-semibold text-ink transition hover:bg-mint"
            >
              Manage Group
            </Link>
            <Link
              to="/groups/share"
              state={{ group_id: groupId }}
              className="bg-btn grid h-[60px] flex-1 place-items-center rounded-[12px] text-[18px] font-semibold text-mint"
            >
              Invite Member
            </Link>
          </div>
          {/* Activity + invite management come from the newly documented
              invite/verification/access trails; kept below the Figma row so the
              card's own layout is unchanged. */}
          <div className="mt-[16px] flex flex-wrap gap-[16px]">
            <Link
              to="/groups/activity"
              state={{ group_id: groupId }}
              className="text-[16px] font-semibold text-[#048B0B] hover:underline"
            >
              Group activity
            </Link>
            <Link
              to="/groups/invites"
              state={{ group_id: groupId }}
              className="text-[16px] font-semibold text-[#048B0B] hover:underline"
            >
              Invite links
            </Link>
          </div>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <div className="relative px-[30px] pt-[22px]">
          <MobileBack />
          <h1 className="text-[35px] leading-[43px] font-bold text-black">
            Group Details
          </h1>
          <p className="mt-[3px] text-[13px] leading-[18px] font-semibold text-[#6B6B6B]">
            Manage your subscriptions, view details, and track your groups.
          </p>
        </div>
        <div className="relative px-[30px] pt-[24px] pb-[60px]">
          {summaryCard(true)}
          <div className={`mt-[20px] rounded-[20px] border border-clyse bg-white p-[24px] ${SHADOW}`}>
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
            {/* Figma 693:21867 packs all six cells in one flow: Shared |
                Occupied, Remaining | Created, Start | Expired. Two separate
                2-col grids left a hole after each odd third tile. */}
            <div className="mt-[20px]">{tiles([...slots, ...dates], true)}</div>
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
          <div className="mt-[30px] flex gap-[14px]">
            <Link
              to="/groups/manage"
              state={{ group_id: groupId }}
              className="grid h-[50px] flex-1 place-items-center rounded-[11.1px] border border-clyse bg-white text-[14px] font-semibold text-ink"
            >
              Manage Group
            </Link>
            <Link
              to="/groups/share"
              state={{ group_id: groupId }}
              className="bg-btn grid h-[50px] flex-1 place-items-center rounded-[11.1px] text-[14px] font-semibold text-mint"
            >
              Invite Member
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
