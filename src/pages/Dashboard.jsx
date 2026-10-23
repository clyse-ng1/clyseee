import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BrandTile from "../components/BrandTile";
import { BlurBg } from "../components/Decor";
import { Footer, MobileFooter } from "../components/Footer";
import { api, accessLabel, brandOf, daysUntil, displayName, fmtDay, kobo } from "../lib/api";
import { useAuth } from "../lib/useAuth";
import iconSearch from "../assets/icon-search.svg";
import iconUser from "../assets/icon-user.svg";
import iconWalletBox from "../assets/wallet-box.svg";
import iconFundPlus from "../assets/fund-plus.svg";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconExit from "../assets/exit.svg";
import iconAccess from "../assets/access.svg";
import chevronDown from "../assets/sidecard-chevron.svg";
import chevronRight from "../assets/angle-right.svg";
import avatarAccount from "../assets/avatar-account.webp";
import ctaDash from "../assets/cta-dash.webp";

/* Logged-in dashboard home (Figma 481:10033 desktop / 481:10571 mobile).
   NOTES: (1) Active rows show only the green "Active" pill and waitlist rows
   only "Leave Waitlist" — Figma draws both buttons overlapping on every row
   (up to 84px), so the button that fits its card is kept in each case.
   (2) Desktop omits a duplicated third subscription row (a second copy of
   the CapCut/Adobe/Amazon row pasted over "View More" and the group title);
   the measured 44/104/22px margins prove the layout ignores it, and mobile
   shows 6 cards with no dupes. (3) "View More" links to /marketplace and
   "Join" links to the group page. (4) The two small mobile header chevrons
   are redrawn (Figma component internals); everything else is measured. */

/* Figma content, shown while the live dashboard loads. */
const ACTIVE = [
  { brand: "netflix", name: "Netflix Premium", renew: "Renews in 12 days" },
  { brand: "youtube", name: "Youtube Premium", renew: "Renews in 10 days" },
  { brand: "spotify", name: "Spotify", renew: "Renews in 12 days" },
];
const WAITLIST = [
  { brand: "capcut", name: "CapCut", renew: "Renews in 12 days" },
  { brand: "canva", name: "Canva pro", renew: "Renews in 12 days" },
  { brand: "prime", name: "Prime Video", renew: "Renews in 12 days" },
];
const SUBS = ["netflix", "spotify", "youtube", "capcut", "adobe", "amazon"];
const SUB_NAMES = {
  netflix: "Netflix Premium",
  spotify: "Spotify",
  youtube: "YouTube Premium",
  capcut: "CapCut",
  adobe: "Adobe Creative Cloud",
  amazon: "Amazon",
};

function serviceName(s) {
  return [s?.service?.name, s?.plan?.name].filter(Boolean).join(" ") || "Subscription";
}

function mapActive(s) {
  const d = daysUntil(s.current_period_end);
  return {
    key: s.membership_id || s.id,
    brand: brandOf(s.service),
    name: serviceName(s),
    renew:
      d == null ? "Active" : d === 0 ? "Renews today" : `Renews in ${d} day${d === 1 ? "" : "s"}`,
  };
}

function mapWaitlist(w) {
  const pos = w.position || w.queue_position;
  return {
    key: w.id || w.waitlist_id || w.service?.slug,
    id: w.waitlist_id || w.id,
    plan_id: w.plan_id || null,
    brand: brandOf(w.service),
    name: serviceName(w),
    renew: pos
      ? `Position ${pos} on waitlist`
      : w.joined_at || w.created_at
        ? `Joined ${fmtDay(w.joined_at || w.created_at)}`
        : "On waitlist",
  };
}

// Dashboard available_subscriptions rows are per-plan:
// { plan_id, service, plan, price: { total_kobo }, open_slots,
// people_waiting, ... } — no nested plans list.
function mapAvail(a) {
  const total = a.price?.total_kobo ?? a.plan?.total_price_kobo ?? null;
  return {
    key: a.plan_id || a.service?.slug || a.service?.name,
    brand: brandOf(a.service),
    name: serviceName(a),
    price: total != null ? `From ${kobo(total)}/` : null,
  };
}

function mapGroup(g) {
  const offered = g.slots_offered ?? 0;
  const occupied = g.occupied_slots ?? 0;
  const left = g.available_slots ?? Math.max(0, offered - occupied);
  return {
    id: g.group_id || g.id,
    creator: g.creator?.first_name || g.creator_name || "Creator",
    service: g.service?.name || "Subscription",
    price: g.plan?.total_price_kobo != null ? kobo(g.plan.total_price_kobo) : "N2,000",
    left: left === 1 ? "1 Slot left" : `${left} Slots left`,
    frac: offered ? `${occupied}/${offered}` : "",
    pct: offered ? occupied / offered : null,
    access: accessLabel(g.access_method) || "Login Credential",
    raw: g,
  };
}

function EmptyRow({ text, to, cta, mobile = false }) {
  return (
    <p
      className={
        mobile
          ? "text-[12.37px] leading-[15px] font-semibold text-[#6B6B6B]"
          : "text-[18px] leading-[22px] font-semibold text-[#6B6B6B]"
      }
    >
      {text}{" "}
      <Link to={to} className="text-clyse">
        {cta}
      </Link>
    </p>
  );
}

function FundPair() {
  return (
    <span className="relative h-[30px] w-[38px] flex-none">
      <img
        src={iconFundArrow}
        alt=""
        className="absolute top-0 left-[1px] w-[15px]"
      />
      <img
        src={iconFundPlus}
        alt=""
        className="absolute top-[6px] left-[17px] w-[18px]"
      />
    </span>
  );
}

function MemberRow({ row, button, onLeave, busy }) {
  return (
    <div className="flex h-[57px] items-center rounded-[20px] bg-white">
      <BrandTile brand={row.brand} />
      <div className="ml-[20px]">
        <p className="text-[25px] leading-[30px] font-bold text-ink">{row.name}</p>
        <div className="relative h-[27px]">
          <span className="absolute top-0 left-0 flex h-[19px] w-[96px] items-center rounded-[3.58px] bg-[#B1DBB3] pl-[10px] text-[10px] font-semibold text-clyse">
            Entertainment
          </span>
          <span className="absolute top-[8px] left-0 text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
            {row.renew}
          </span>
        </div>
      </div>
      {button === "active" ? (
        <div className="ml-auto flex h-[48px] w-[185px] items-center justify-center gap-[9px] rounded-[10px] bg-[#DFFFE0]">
          <span className="h-[13px] w-[13px] rounded-full bg-clyse" />
          <span className="text-[18px] leading-[22px] font-semibold text-clyse">
            Active
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={onLeave}
          disabled={busy}
          className="ml-auto flex h-[48px] w-[185px] items-center rounded-[10px] border border-[#047D0A] bg-white pl-[12px] shadow-[0_0_7px_rgba(0,23,1,0.25)] disabled:opacity-50"
        >
          <img src={iconExit} alt="" className="h-[25px] w-[25px]" />
          <span className="ml-[5px] text-[18px] leading-[22px] font-semibold text-clyse">
            {busy ? "Leaving…" : "Leave Waitlist"}
          </span>
        </button>
      )}
    </div>
  );
}

function MobileMemberRow({ row, button, onLeave, busy }) {
  return (
    <div className="flex h-[40px] items-center rounded-[13.74px] bg-white">
      <BrandTile brand={row.brand} size={34} />
      <div className="ml-[14px]">
        <p className="text-[17.18px] leading-[21px] font-bold text-ink">{row.name}</p>
        <div className="relative h-[19px]">
          <span className="absolute top-0 left-0 flex h-[13px] w-[66px] items-center rounded-[2.46px] bg-[#B1DBB3] pl-[6px] text-[6.87px] font-semibold text-clyse">
            Entertainment
          </span>
          <span className="absolute top-[6px] left-0 text-[12.37px] leading-[15px] font-semibold text-[#6B6B6B]">
            {row.renew}
          </span>
        </div>
      </div>
      {button === "active" ? (
        <div className="ml-auto flex h-[33px] w-[127px] items-center rounded-[6.87px] bg-[#DFFFE0] pl-[36px]">
          <span className="h-[9px] w-[9px] rounded-full bg-clyse" />
          <span className="ml-[6px] text-[12.37px] leading-[15px] font-semibold text-clyse">
            Active
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={onLeave}
          disabled={busy}
          className="ml-auto flex h-[33px] w-[127px] items-center rounded-[6.87px] border border-[#047D0A] bg-white pl-[9px] shadow-[0_0_5px_rgba(0,23,1,0.25)] disabled:opacity-50"
        >
          <img src={iconExit} alt="" className="h-[17px] w-[17px]" />
          <span className="ml-[3px] text-[12.37px] leading-[15px] font-semibold text-clyse">
            {busy ? "Leaving…" : "Leave Waitlist"}
          </span>
        </button>
      )}
    </div>
  );
}

function SubCard({ brand, name, price }) {
  return (
    <div className="h-[200px] w-[250px] rounded-[20px] border border-clyse bg-white pt-[31px] text-center shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      <span className="flex justify-center">
        <BrandTile brand={brand} />
      </span>
      <p className="mt-[10px] text-[18px] leading-[22px] font-bold text-ink">
        {name || SUB_NAMES[brand]}
      </p>
      <p className="mx-auto mt-[3px] flex h-[19px] w-[96px] items-center rounded-[3.58px] bg-[#B1DBB3] pl-[10px] text-[10px] font-semibold text-clyse">
        Entertainment
      </p>
      <p className="mt-[10px] flex items-baseline justify-center">
        <span className="text-[18px] leading-[22px] font-semibold text-ink">
          {price || <>From &#8358;2,000/</>}
        </span>
        <span className="text-[13px] leading-[20px] font-semibold text-ash">
          Monthly
        </span>
      </p>
    </div>
  );
}

function MobileSubCard({ brand, name, price }) {
  return (
    <div className="h-[137px] rounded-[13.74px] border border-clyse bg-white pt-[22px] text-center shadow-[0_0_13px_rgba(0,23,1,0.10)]">
      <span className="flex justify-center">
        <BrandTile brand={brand} size={34} />
      </span>
      <p className="mt-[7px] text-[12.37px] leading-[15px] font-bold text-ink">
        {name || SUB_NAMES[brand]}
      </p>
      <p className="mx-auto mt-[4px] flex h-[13px] w-[66px] items-center rounded-[2.46px] bg-[#B1DBB3] pl-[6px] text-[6.87px] font-semibold text-clyse">
        Entertainment
      </p>
      <p className="mt-[6px] flex items-baseline justify-center">
        <span className="text-[12.37px] leading-[15px] font-semibold text-ink">
          {price || <>From &#8358;2,000/</>}
        </span>
        <span className="text-[8.93px] leading-[11px] font-semibold text-ash">
          Monthly
        </span>
      </p>
    </div>
  );
}

function GroupCard({ group }) {
  const g = group || {};
  return (
    <div className="w-[253px]">
      <img
        src={avatarAccount}
        alt={g.creator || "Marcus Saris"}
        className="relative z-[1] mx-auto h-[95px] w-[95px] rounded-full object-cover"
      />
      <div className="bg-btn -mt-[51px] rounded-[16.23px] px-[24px] pt-[57px] pb-[24px]">
        <p className="text-[25px] leading-[23px] font-bold text-white">
          {g.creator || "Marcus Saris"}
        </p>
        <p className="flex items-start justify-center gap-[4px]">
          <span className="text-[10.6px] leading-[17px] font-semibold text-white">
            Share
          </span>
          <span className="text-[13px] leading-[17px] font-bold text-white">
            {g.service || "Netflix Premium"}
          </span>
        </p>
        <div className="mt-[17px] ml-[2px] h-[1px] w-[201px] bg-[#B1DBB3]" />
        <div className="bg-mintband mt-[17px] h-[57px] rounded-[8.12px] pt-[8px] text-center">
          <p className="text-[8.1px] leading-[16px] font-semibold text-white">
            Your Contribution
          </p>
          <p className="flex items-baseline justify-center">
            <span className="text-[25px] leading-[24px] font-semibold text-white">
              {g.price || "N2,000"}
            </span>
            <span className="text-[10px] leading-[17px] font-semibold text-[#B1DBB3]">
              /Monthly
            </span>
          </p>
        </div>
        <div className="mt-[7px] ml-[1px] h-[6px] w-[201px] rounded-full bg-[#023F05]">
          <div
            className="h-[6px] w-[143px] rounded-full bg-clyse"
            style={g.pct == null ? undefined : { width: `${Math.round(g.pct * 201)}px` }}
          />
        </div>
        <div className="mt-[3px] flex items-center justify-between text-[13px] leading-[16px] font-semibold text-mint">
          <span className="flex items-center">
            <img src={iconUser} alt="" className="h-[9px] w-[9px]" />
            <span className="ml-[8px]">{g.left || "1 Slot left"}</span>
          </span>
          <span>{g.frac || "3/4"}</span>
        </div>
        <p className="mt-[4px] flex items-center">
          <img src={iconAccess} alt="" className="h-[9px] w-[8px]" />
          <span className="ml-[9px] text-[10px] leading-[17px] font-semibold text-white">
            Access Method:
          </span>
          <span className="ml-[12px] text-[11px] leading-[17px] font-semibold text-white">
            {g.access || "Login Credential"}
          </span>
        </p>
        <Link
          to={g.id && g.raw ? "/join/summary" : "/subscription-group"}
          state={g.id && g.raw ? { group_id: g.id, preview: g.raw } : undefined}
          className="bg-mintband mt-[16px] flex h-[32px] items-center justify-center rounded-[8.12px] text-[18px] font-semibold text-ink"
        >
          Join
        </Link>
      </div>
    </div>
  );
}

function MobileGroupCard({ group }) {
  const g = group || {};
  return (
    <div>
      <img
        src={avatarAccount}
        alt={g.creator || "Marcus Saris"}
        className="relative z-[1] mx-auto h-[66px] w-[66px] rounded-full object-cover"
      />
      <div className="bg-btn -mt-[33px] rounded-[11.16px] px-[17px] pt-[39px] pb-[17px]">
        <p className="text-[17.18px] leading-[16px] font-bold text-white">
          {g.creator || "Marcus Saris"}
        </p>
        <p className="flex items-start justify-center gap-[3px]">
          <span className="text-[7.25px] leading-[12px] font-semibold text-white">
            Share
          </span>
          <span className="text-[8.93px] leading-[12px] font-bold text-white">
            {g.service || "Netflix Premium"}
          </span>
        </p>
        <div className="mt-[12px] ml-[3px] h-[1px] w-[138px] bg-[#B1DBB3]" />
        <div className="bg-mintband mt-[11px] h-[39px] rounded-[5.58px] pt-[6px] text-center">
          <p className="text-[5.58px] leading-[10px] font-semibold text-white">
            Your Contribution
          </p>
          <p className="flex items-baseline justify-center">
            <span className="text-[17.18px] leading-[16px] font-semibold text-white">
              {g.price || "N2,000"}
            </span>
            <span className="text-[6.87px] leading-[12px] font-semibold text-[#B1DBB3]">
              /Monthly
            </span>
          </p>
        </div>
        <div className="mt-[5px] h-[4px] w-[138px] rounded-full bg-[#023F05]">
          <div
            className="h-[4px] w-[98px] rounded-full bg-clyse"
            style={g.pct == null ? undefined : { width: `${Math.round(g.pct * 138)}px` }}
          />
        </div>
        <div className="mt-[2px] flex items-center justify-between text-[8.93px] leading-[12px] font-semibold text-mint">
          <span className="flex items-center">
            <img src={iconUser} alt="" className="h-[6px] w-[6px]" />
            <span className="ml-[5px]">{g.left || "1 Slot left"}</span>
          </span>
          <span>{g.frac || "3/4"}</span>
        </div>
        <p className="mt-[3px] flex items-center">
          <img src={iconAccess} alt="" className="h-[6px] w-[6px]" />
          <span className="ml-[5px] text-[6.87px] leading-[12px] font-semibold text-white">
            Access Method:
          </span>
          <span className="ml-[12px] text-[7.56px] leading-[12px] font-semibold text-white">
            {g.access || "Login Credential"}
          </span>
        </p>
        <Link
          to={g.id && g.raw ? "/join/summary" : "/subscription-group"}
          state={g.id && g.raw ? { group_id: g.id, preview: g.raw } : undefined}
          className="bg-mintband mt-[11px] flex h-[22px] items-center justify-center rounded-[5.58px] text-[12.37px] font-semibold text-ink"
        >
          Join
        </Link>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dash, setDash] = useState(null);
  const [leavingId, setLeavingId] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data } = await api("/member/dashboard");
      if (live) setDash(data || {});
    })();
    return () => {
      live = false;
    };
  }, []);

  const leaveWaitlist = async (row) => {
    const waitlistId = typeof row === "string" ? row : row?.id;
    const planId = typeof row === "string" ? null : row?.plan_id || null;
    if (!waitlistId || leavingId) return;
    setLeavingId(waitlistId);
    const { error } = planId
      ? await api("/member/waitlist/leave", { method: "POST", body: { plan_id: planId } })
      : { error: null };
    setLeavingId(null);
    if (!error) {
      setDash((d) =>
        d
          ? { ...d, waitlists: (d.waitlists || []).filter((w) => (w.waitlist_id || w.id) !== waitlistId) }
          : d,
      );
    }
  };

  const name = displayName(user) || "Cristofer Westervelt";
  const walletText = dash?.wallet ? kobo(dash.wallet.balance_kobo) : "N5,000";
  const since = fmtDay(user?.created_at) || "20/11/2026";

  const activeRows = !dash ? ACTIVE : (dash.active_subscriptions || []).map(mapActive);
  const waitRows = !dash ? WAITLIST : (dash.waitlists || []).map(mapWaitlist);
  const availList = dash?.available_subscriptions || [];
  const availSubs = availList.length
    ? availList.map(mapAvail)
    : SUBS.map((b) => ({ key: b, brand: b }));
  const groupList = dash?.available_groups || [];
  const groups = groupList.length ? groupList.map(mapGroup) : null;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[20px] min-[1440px]:mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px]">
          <Sidebar active="Dashboard" />
          <div className="w-[830px] flex-none">
            <div className="flex gap-[30px]">
              <div className="bg-btn h-[245px] w-[500px] rounded-[20px] px-[35px] pt-[43px]">
                <p className="text-[25px] leading-[35px] font-semibold text-white">
                  Welcome
                </p>
                <p className="text-[35px] leading-[43px] font-bold text-white">
                  {name}
                </p>
                <p className="mt-[15px] text-[18px] leading-[22px] font-semibold text-white">
                  Discover, join or create subscription groups and enjoy the
                  best rate.
                </p>
              </div>
              <div className="bg-btn h-[245px] w-[300px] rounded-[20px] px-[35px] pt-[40px]">
                <div className="flex">
                  <div>
                    <p className="text-[18px] leading-[22px] font-semibold text-white">
                      Wallet Balance
                    </p>
                    <p className="text-[35px] leading-[43px] font-bold text-white">
                      {walletText}
                    </p>
                  </div>
                  <img
                    src={iconWalletBox}
                    alt=""
                    className="mt-[8px] ml-auto h-[50px] w-[50px]"
                  />
                </div>
                <Link
                  to="/wallet"
                  className="bg-mintband mt-[40px] flex h-[60px] w-[230px] items-center rounded-[10px] pl-[23px]"
                >
                  <FundPair />
                  <span className="ml-[12px] text-[18px] font-semibold text-ink">
                    Fund Wallet
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-[50px] rounded-[20px] bg-white px-[35px] pt-[40px] pb-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[35px] leading-[43px] font-bold">
                  My Active Subscription
                </h2>
                <Link to="/subscriptions" className="text-[25px] leading-[35px] font-semibold text-clyse">
                  View all
                </Link>
              </div>
              <div className="mt-[40px] space-y-[20px]">
                {activeRows.map((r) => (
                  <MemberRow key={r.key || r.name} row={r} button="active" />
                ))}
                {dash && activeRows.length === 0 && (
                  <EmptyRow
                    text="You have no active subscriptions yet."
                    to="/marketplace"
                    cta="Browse subscriptions"
                  />
                )}
              </div>
            </div>

            <div className="mt-[50px] rounded-[20px] bg-white px-[35px] pt-[40px] pb-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[35px] leading-[43px] font-bold">My Waitlist</h2>
                <Link to="/waitlist" className="text-[25px] leading-[35px] font-semibold text-clyse">
                  View all
                </Link>
              </div>
              <div className="mt-[40px] space-y-[20px]">
                {waitRows.map((r) => (
                  <MemberRow
                    key={r.key || r.name}
                    row={r}
                    button="leave"
                    busy={leavingId === r.id}
                    onLeave={r.id ? () => leaveWaitlist(r) : undefined}
                  />
                ))}
                {dash && waitRows.length === 0 && (
                  <EmptyRow
                    text="You are not on any waitlist."
                    to="/marketplace"
                    cta="Browse subscriptions"
                  />
                )}
              </div>
            </div>

            <Link
              to="/marketplace"
              className="mt-[50px] flex h-[80px] items-center rounded-[15px] bg-white pl-[30px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
            >
              <img src={iconSearch} alt="" className="h-[45px] w-[45px]" />
              <span className="ml-[39px] text-[25px] font-semibold text-muted">
                Browse Subscription
              </span>
            </Link>

            <h2 className="mt-[80px] text-[35px] leading-[43px] font-bold">
              Available Subscription
            </h2>
            <div className="mt-[30px] grid grid-cols-3 gap-x-[40px] gap-y-[30px]">
              {availSubs.map((s) => (
                <SubCard key={s.key} brand={s.brand} name={s.name} price={s.price} />
              ))}
            </div>
            <Link
              to="/marketplace"
              className="mt-[44px] block text-center text-[18px] leading-[22px] font-semibold"
            >
              View More
            </Link>

            <h2 className="mt-[104px] text-[35px] leading-[43px] font-bold">
              Available Group
            </h2>
            <div className="mt-[22px] grid grid-cols-3 gap-x-[32px] gap-y-[3px]">
              {groups
                ? groups.slice(0, 6).map((g, i) => <GroupCard key={g.id || i} group={g} />)
                : [0, 1, 2, 3, 4, 5].map((i) => (
                    <GroupCard key={i} />
                  ))}
            </div>
          </div>
        </div>

        <div className="bg-mintband relative mt-[113px] h-[300px] rounded-[50px]">
          <div className="max-w-[536px] pt-[56px] pl-[40px]">
            <h2 className="text-[35px] leading-[43px] font-bold">
              Become an Owner
            </h2>
            <p className="mt-[30px] text-[25px] leading-[35px] font-semibold whitespace-nowrap">
              Save money by offering your subscription
            </p>
            <Link
              to="/create-group"
              className="bg-btn mt-[30px] flex h-[50px] w-[200px] items-center rounded-[10px] pl-[30px]"
            >
              <span className="relative mt-[5px] h-[18px] w-[36px] flex-none">
                <img
                  src={iconFundArrow}
                  alt=""
                  className="absolute top-[2px] left-0 w-[15px]"
                />
                <img
                  src={iconFundPlus}
                  alt=""
                  className="absolute top-0 left-[18px] w-[18px]"
                />
              </span>
              <span className="ml-[3px] text-[18px] font-semibold text-mint">
                Create
              </span>
            </Link>
          </div>
          <img
            loading="lazy" decoding="async" src={ctaDash}
            alt=""
            className="absolute top-0 right-[40px] h-[300px] w-[387px] rounded-[50px] object-cover"
          />
        </div>
      </main>
      <div className="hidden xl:block">
        <Footer mt="mt-[48px]" />
      </div>

      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative bg-white px-[30px] pt-[30px] pb-[21px]">
          <div className="flex items-center gap-[6px]">
            <img
              src={user?.avatar_url || avatarAccount}
              alt={name}
              className="h-[50px] w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="text-[24.77px] leading-[28px] font-bold text-ink">
                {name}
              </p>
              <p className="text-[12.88px] leading-[20px] font-semibold text-[#6B6B6B]">
                Member on Clyse Since {since}
              </p>
            </div>
          </div>
          <div className="mt-[19px] flex h-[33px] items-center justify-center bg-white">
            <img src={chevronDown} alt="" className="w-[19px]" />
          </div>
        </div>

        <div className="relative z-10 mx-[30px] -mt-[1px] flex h-[50px] items-center rounded-[15px] border border-line bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]">
          <span className="pl-[21px] text-[17.83px] font-semibold text-black">
            Service name
          </span>
          <img src={chevronRight} alt="" className="mr-[21px] ml-auto w-[24px]" />
        </div>

        <div className="bg-btn relative mt-[16px] px-[30px] pt-[27px] pb-[28px]">
          <p className="text-[17.18px] leading-[25px] font-semibold text-white">
            Welcome
          </p>
          <p className="text-[24.05px] leading-[30px] font-bold text-white">
            {name}
          </p>
          <p className="mt-[10px] text-[12.37px] leading-[15px] font-semibold text-white">
            Discover, join or create subscription groups and enjoy the best
            rate.
          </p>
        </div>

        <div className="bg-btn relative mt-[17px] flex h-[105px] items-center px-[33px]">
          <img src={iconWalletBox} alt="" className="w-[29px]" />
          <div className="ml-[16px]">
            <p className="text-[12.37px] leading-[15px] font-semibold text-white">
              Wallet Balance
            </p>
            <p className="text-[24.05px] leading-[29px] font-bold text-white">
              {walletText}
            </p>
          </div>
          <Link
            to="/wallet"
            className="bg-mintband ml-auto flex h-[50px] w-[150px] items-center rounded-[6.94px] pl-[21px]"
          >
            <span className="relative h-[16px] w-[19px] flex-none">
              <img
                src={iconFundArrow}
                alt=""
                className="absolute top-0 left-0 w-[10px]"
              />
              <img
                src={iconFundPlus}
                alt=""
                className="absolute top-[3px] left-[5px] w-[13px]"
              />
            </span>
            <span className="ml-[7px] text-[12.37px] font-semibold text-ink">
              Fund Wallet
            </span>
          </Link>
        </div>

        <div className="relative mt-[30px] bg-white px-[30px] pt-[27px] pb-[28px]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[22px] leading-[27px] font-bold">
              My Active Subscription
            </h2>
            <Link to="/subscriptions" className="text-[17.18px] leading-[21px] font-semibold text-clyse">
              View all
            </Link>
          </div>
          <div className="mt-[28px] space-y-[14px]">
            {activeRows.map((r) => (
              <MobileMemberRow key={r.key || r.name} row={r} button="active" />
            ))}
            {dash && activeRows.length === 0 && (
              <EmptyRow
                mobile
                text="You have no active subscriptions yet."
                to="/marketplace"
                cta="Browse subscriptions"
              />
            )}
          </div>
        </div>

        <div className="relative mt-[30px] bg-white px-[30px] pt-[27px] pb-[28px]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[22px] leading-[27px] font-bold">My Waitlist</h2>
            <Link to="/waitlist" className="text-[17.18px] leading-[21px] font-semibold text-clyse">
              View all
            </Link>
          </div>
          <div className="mt-[30px] space-y-[14px]">
            {waitRows.map((r) => (
              <MobileMemberRow
                key={r.key || r.name}
                row={r}
                button="leave"
                busy={leavingId === r.id}
                onLeave={r.id ? () => leaveWaitlist(r) : undefined}
              />
            ))}
            {dash && waitRows.length === 0 && (
              <EmptyRow
                mobile
                text="You are not on any waitlist."
                to="/marketplace"
                cta="Browse subscriptions"
              />
            )}
          </div>
        </div>

        <Link
          to="/marketplace"
          className="relative mt-[30px] flex h-[55px] items-center bg-white pl-[30px]"
        >
          <img src={iconSearch} alt="" className="h-[31px] w-[31px]" />
          <span className="ml-[26px] text-[17.18px] font-semibold text-muted">
            Browse Subscription
          </span>
        </Link>

        <div className="relative">
          <h2 className="mt-[51px] ml-[30px] text-[22px] leading-[27px] font-bold">
            Available Subscription
          </h2>
          <div className="mt-[20px] grid grid-cols-2 gap-[18px] px-[30px]">
            {availSubs.map((s) => (
              <MobileSubCard key={s.key} brand={s.brand} name={s.name} price={s.price} />
            ))}
          </div>
        </div>

        <div className="relative">
          <h2 className="mt-[58px] ml-[30px] text-[22px] leading-[27px] font-bold">
            Available Group
          </h2>
          <div className="mt-[15px] grid grid-cols-2 gap-x-[18px] gap-y-[5px] px-[30px]">
            {groups
              ? groups.slice(0, 4).map((g, i) => <MobileGroupCard key={g.id || i} group={g} />)
              : [0, 1, 2, 3].map((i) => (
                  <MobileGroupCard key={i} />
                ))}
          </div>
        </div>

        <div className="bg-mintband relative mt-[31px] h-[408px]">
          <h2 className="pt-[16px] text-center text-[24.27px] leading-[30px] font-bold text-ink">
            Become an Owner
          </h2>
          <p className="mt-[21px] text-center text-[17.34px] leading-[25px] font-semibold text-ink">
            Save money by offering your subscription
          </p>
          <Link
            to="/create-group"
            className="bg-btn mx-auto mt-[21px] flex h-[50px] w-[200px] items-center justify-center rounded-[6.94px] text-[12.48px] font-semibold text-mint"
          >
            Create
          </Link>
          <img
            loading="lazy" decoding="async" src={ctaDash}
            alt=""
            className="mx-[28px] mt-[21px] aspect-[375/209] w-[calc(100%-56px)] max-w-[375px] object-cover"
          />
        </div>
      </main>
      <div className="xl:hidden">
        <MobileFooter mt="mt-[30px]" />
      </div>
    </div>
  );
}
