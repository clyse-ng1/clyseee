import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandTile from "./BrandTile";
import { api, brandOf, fmtDate, kobo } from "../lib/api";
import iconDone from "../assets/done-white.svg";
import iconCopy from "../assets/copy-black.svg";
import iconNaira from "../assets/naira-green.svg";
import iconCal from "../assets/calendar-glyph.svg";
import { useCopy, CopiedPill } from "../lib/useCopy";

/* Shared subscription-details view (SubDetails + SubReport markup, Figma-identical).
   `variant` flips the measured differences between the two screens:
   desktop h1 vs in-card eyebrow, mobile tag/placement, desktop how-to size.
   Pages provide the Navbar/Sidebar/BlurBg frame; this renders the columns. */

const HOWTO =
  "Open the access details shared by your group creator, then return here to confirm access or report a problem.";
const HOWTO_MOBILE = "Open the shared access details, then return here to confirm access or report a problem.";

function statusText(value, fallback = "Not available") {
  const labels = {
    active: "Active",
    renewal_required: "Renewal due",
    renewal: "Renewal due",
    expired: "Expired",
    ended: "Ended",
    cancelled: "Cancelled",
    removed: "Removed",
    suspended: "Suspended",
    paid: "Paid",
    due: "Due",
    overdue: "Overdue",
    unpaid: "Unpaid",
    needs_confirmation: "Needs confirmation",
    unavailable: "Unavailable",
    not_due: "Not due",
    declined: "Declined",
  };
  const key = String(value || "").toLowerCase();
  return labels[key] || (value ? String(value).replaceAll("_", " ") : fallback);
}

const SHADOW = "shadow-[0_0_20px_rgba(0,23,1,0.10)]";

function statusPill(membership) {
  const s = (membership?.derived_status || membership?.status || membership?.membership_status || "").toLowerCase();
  if (s === "renewal_required" || s === "renewal") {
    return { label: "Renewal Due", bg: "bg-[#FFE4D3]", text: "text-[#CB5300]", dot: "bg-[#CB5300]" };
  }
  if (["expired", "cancelled", "removed", "ended", "suspended"].includes(s)) {
    const label = s === "cancelled" ? "Cancelled" : s === "removed" ? "Removed" : s[0].toUpperCase() + s.slice(1);
    return { label, bg: "bg-[#F1F1F1]", text: "text-[#6B6B6B]", dot: "bg-[#999999]" };
  }
  if (!s) return { label: "Status unavailable", bg: "bg-[#F1F1F1]", text: "text-[#6B6B6B]", dot: "bg-[#999999]" };
  return { label: "Active", bg: "bg-[#DFFFE0]", text: "text-clyse", dot: "bg-clyse" };
}

function derive(membership, access) {
  const service = membership?.service || {};
  const plan = membership?.plan || {};
  const group = membership?.group || {};
  const title = [service.name, plan.name].filter(Boolean).join(" ") || "Subscription";
  const planLine = plan.name ? `${plan.name} Plan` : "Plan details unavailable";
  const months = plan.billing_interval_months || plan.interval_months;
  const groupId = membership?.group_id || group.id || "";
  const lifecycle = String(membership?.membership_status || membership?.status || membership?.derived_status || "").toLowerCase();
  const accessStatus = String(membership?.access_status || "").toLowerCase();
  // The access endpoint is authorized only for active/current memberships.
  // Keep any credentials out of the UI if status says access is unavailable.
  const canShowAccess = !!access && lifecycle === "active" && accessStatus !== "unavailable";
  /* Figma 912:19224 prints a short code ("AD-234250569575"), never the raw
     UUID — bug 26 called out the long id. Fall back to a derived short code,
     not to the UUID itself. */
  const code =
    group.invite_code ||
    membership?.group_code ||
    (groupId
      ? `AD-${String(groupId).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10).toUpperCase()}`
      : "");
  // Access payload: { group_id, ..., access: { method, credentials,
  // invite_link, instructions } }. Credentials are a { field: value } map.
  const inner = canShowAccess ? access?.access || {} : {};
  const creds = inner.credentials;
  const credText =
    typeof creds === "string"
      ? creds
      : creds && typeof creds === "object"
        ? Object.entries(creds)
            .map(([k, v]) => `${k}: ${v}`)
            .join("  ·  ")
        : "";
  return {
    brand: brandOf(service),
    title,
    planLine,
    pill: statusPill(membership),
    axes: [
      { label: "Membership", value: statusText(membership?.status || membership?.membership_status || membership?.derived_status) },
      { label: "Access", value: statusText(membership?.access_status || (access?.membership?.access_confirmed ? "active" : access ? "needs_confirmation" : "unavailable")) },
      { label: "Payment", value: statusText(membership?.payment_status || (membership?.payment?.paid_at ? "paid" : "unpaid")) },
      { label: "Renewal", value: statusText(membership?.renewal_status || (membership?.renewal_required ? "due" : "not_due")) },
    ],
    stats: [
      {
        label: "Current Price",
        value:
          membership?.price?.total_kobo != null
            ? kobo(membership.price.total_kobo)
            : plan.total_price_kobo != null
              ? kobo(plan.total_price_kobo)
              : "—",
        chip: "bg-[#DFFFE0]",
        icon: iconNaira,
        iconCls: "",
      },
      {
        label: "Started On",
        value:
          fmtDate(
            membership?.start_date ||
              membership?.current_period_start ||
              membership?.joined_at,
          ) || "—",
        chip: "bg-[#FFE4D3]",
        icon: iconCal,
        iconCls: "text-[#CB5300]",
      },
      {
        label: "Next Renews",
        value:
          fmtDate(membership?.paid_through || membership?.current_period_end || membership?.next_renewal_date) ||
          "—",
        chip: "bg-[#E6E5FF]",
        icon: iconCal,
        iconCls: "text-[#7E00CD]",
      },
    ],
    info: [
      { label: "Subscription Plan", value: plan.name || "Premium" },
      {
        label: "Billing",
        value: !months || months === 1 ? "Monthly" : `Every ${months} Months`,
      },
      { label: "Payment Method", value: "Wallet" },
    ],
    groupId: code ? `Group ID: ${code}` : "Group ID unavailable",
    rawGroupId: groupId,
    canShowAccess,
    /* Backend only hands us the invite token for invite-link groups (no full
       URL), so the link is built here — same shape the share screen already
       uses: /join/<token>. Credentials groups keep their credential block. */
    link:
      inner.invite_link ||
      (String(inner.method || group.access_method || "") === "invite_link" && code
        ? `${typeof window !== "undefined" ? window.location.origin : ""}/join/${encodeURIComponent(code)}`
        : "") ||
      credText ||
      inner.instructions ||
      "",
    accessMessage: canShowAccess
      ? "The creator has not shared access details yet."
      : "Access is unavailable for this membership status.",
    howto: inner.instructions || HOWTO,
    howtoMobile: inner.instructions || HOWTO_MOBILE,
  };
}


/** Green confirm button: POSTs /member/access/confirm, then calls done(). */
export function ConfirmButton({ groupId, done }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handle = async () => {
    if (busy || !groupId) return;
    setBusy(true);
    setError("");
    const { error: apiError } = await api("/member/access/confirm", {
      method: "POST",
      body: { group_id: groupId },
    });
    setBusy(false);
    if (apiError) {
      setError(apiError.message || "Could not confirm access. Please try again.");
      return;
    }
    done();
  };

  return (
    <>
      <button
        type="button"
        onClick={handle}
        className="flex h-[60px] w-full items-center justify-center gap-[20px] rounded-[9.75px] border border-clyse bg-[#048B0B] shadow-[0_0_7px_rgba(0,23,1,0.25)]"
      >
        <img src={iconDone} alt="" className="h-[30px] w-[30px]" />
        <span className="text-[18px] leading-[22px] font-semibold text-white">
          {busy ? "Confirming…" : "Confirm Access"}
        </span>
      </button>
      {error && (
        <p className="mt-[10px] text-center text-[14px] font-semibold text-clyse-red">{error}</p>
      )}
    </>
  );
}

export function ConfirmAndGo({ groupId }) {
  const navigate = useNavigate();
  return <ConfirmButton groupId={groupId} done={() => navigate("/subscriptions")} />;
}

export function SubDetailsDesktop({
  variant = "details",
  membership,
  access,
  actionSlot,
  afterSlot,
  renewSlot,
}) {
  const v = derive(membership, access);
  const { copied, copy } = useCopy();
  const isReport = variant === "report";

  return (
    <div className="w-[830px] flex-none">
      <CopiedPill show={copied} />
      {!isReport && (
        <h1 className="text-[35px] leading-[43px] font-bold text-black">
          Subscription Details
        </h1>
      )}
      <div
        className={`${isReport ? "" : `mt-[30px] border border-[#BABABA] ${SHADOW} `}rounded-[20px] bg-white px-[31px] pt-[51px] pb-[51px]`}
      >
        {isReport && (
          <p className="text-[18px] leading-[22px] font-semibold text-ink">
            Subscription Details
          </p>
        )}
        <div className={`${isReport ? "mt-[20px] " : ""}flex items-start`}>
          <BrandTile brand={v.brand} size={75} plain />
          <div className="ml-[20px]">
            <p className="text-[35px] leading-[43px] font-bold text-ink">{v.title}</p>
            {isReport && (
              <p className="mt-[10px] text-[10px] leading-[12px] font-semibold text-clyse">
                Entertainment
              </p>
            )}
            <p className="mt-[10px] text-[25px] leading-[30px] font-semibold text-[#6B6B6B]">
              {v.planLine}
            </p>
          </div>
          <div
            className={`mt-[19px] ml-auto flex h-[40px] w-[140px] flex-none items-center justify-center gap-[10px] rounded-[10px] ${v.pill.bg}`}
          >
            <span className={`h-[13px] w-[13px] rounded-full ${v.pill.dot}`} />
            <span className={`text-[18px] leading-[22px] font-semibold ${v.pill.text}`}>
              {v.pill.label}
            </span>
          </div>
        </div>
        <div className="mt-[23px] flex gap-[20px]">
          {v.stats.map((s) => (
            <div
              key={s.label}
              className={`h-[156px] w-[243px] rounded-[10px] bg-white px-[21px] pt-[21px] ${SHADOW}`}
            >
              <span className={`grid h-[42px] w-[42px] place-items-center rounded-[5px] ${s.chip}`}>
                <img src={s.icon} alt="" className={`h-[30px] w-[30px] ${s.iconCls}`} />
              </span>
              <p className="mt-[15px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                {s.label}
              </p>
              <p className="text-[25px] leading-[30px] font-bold text-ink">{s.value}</p>
            </div>
          ))}
        </div>
        {renewSlot && <div className="mt-[50px]">{renewSlot}</div>}
      </div>
      <div className={`mt-[30px] rounded-[20px] bg-white px-[30px] pt-[50px] pb-[50px] ${isReport ? "" : SHADOW}`}>
        <h2 className="text-[35px] leading-[43px] font-bold text-ink">
          Subscription Info
        </h2>
        <div className="mt-[50px] flex items-center justify-end gap-[10px]">
          <p className="text-[25px] leading-[35px] font-semibold text-ink">{v.groupId}</p>
          <button type="button" onClick={() => v.rawGroupId && copy(v.rawGroupId)} aria-label="Copy group ID" disabled={!v.rawGroupId}>
            <img src={iconCopy} alt="Copy group ID" className="h-[24px] w-[24px]" />
          </button>
        </div>
        <div className="mt-[20px] flex gap-[20px]">
          {v.info.map((r) => (
            <div
              key={r.label}
              className={`h-[101px] w-[243px] rounded-[10px] bg-white px-[26px] pt-[21px] ${SHADOW}`}
            >
              <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                {r.label}
              </p>
              <p className="mt-[2px] text-[25px] leading-[30px] font-bold text-ink">
                {r.value}
              </p>
            </div>
          ))}
        </div>
        {/* Figma's Subscription Info card carries Plan / Billing / Payment
            Method only; the four status tiles here were live-only. */}
        {v.canShowAccess && v.link ? (
          <div className={`mt-[50px] flex rounded-[10px] bg-white ${SHADOW}`}>
            <div className="min-w-0 py-[21px] pl-[26px]">
              <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">Shared access details</p>
              <p className="mt-[2px] text-[18px] leading-[25px] font-bold break-all text-ink">{v.link}</p>
            </div>
            <button type="button" onClick={() => copy(v.link)} className="mr-[26px] ml-auto flex h-[44px] w-[111px] flex-none items-center justify-center gap-[10px] self-center rounded-[10px] bg-[#D9D9D9]">
              <img src={iconCopy} alt="" className="h-[24px] w-[24px]" />
              <span className="text-[18px] leading-[22px] font-semibold text-black">Copy</span>
            </button>
          </div>
        ) : (
          <p className={`mt-[50px] rounded-[10px] bg-[#F7F7F7] px-[20px] py-[18px] text-[16px] font-semibold text-[#6B6B6B] ${SHADOW}`}>
            {v.accessMessage}
          </p>
        )}
        <h3 className="mt-[50px] text-[23px] leading-[28px] font-bold text-black">How to Access Your Subscription</h3>
        <p className={`mt-[12px] font-semibold text-[#0E0E0E] ${isReport ? "text-[18px] leading-[22px]" : "text-[19px] leading-[23px]"}`}>
          {v.canShowAccess ? v.howto : v.accessMessage}
        </p>
        <div className="mt-[50px]">{actionSlot}</div>
        {afterSlot && <div className="mt-[50px]">{afterSlot}</div>}
      </div>
    </div>
  );
}

export function SubDetailsMobile({
  variant = "details",
  membership,
  access,
  actionSlot,
  afterSlot,
  renewSlot,
}) {
  const v = derive(membership, access);
  const { copied, copy } = useCopy();
  const isReport = variant === "report";

  return (
    <>
      <CopiedPill show={copied} />
      <div
        className={`relative px-[32px] pt-[51px] ${
          isReport ? "rounded-[20px] bg-white pb-[51px]" : ""
        }`}
      >
        <p className="text-[18px] leading-[22px] font-semibold text-ink">
          Subscription Details
        </p>
        <div className="mt-[20px] flex items-start">
          <BrandTile brand={v.brand} size={75} plain />
          <div className="ml-[20px]">
            <p className="text-[30px] leading-[37px] font-bold text-ink">{v.title}</p>
            {isReport && (
              <p className="mt-[1px] text-[10px] leading-[12px] font-semibold text-clyse">
                Entertainment
              </p>
            )}
            <p
              className={`text-[25px] leading-[30px] font-semibold text-[#6B6B6B] ${
                isReport ? "mt-[24px]" : "mt-[37px]"
              }`}
            >
              {v.planLine}
            </p>
          </div>
        </div>
        <div
          className={`mt-[25px] flex h-[40px] w-full items-center justify-center gap-[10px] rounded-[10px] ${v.pill.bg}`}
        >
          <span className={`h-[13px] w-[13px] rounded-full ${v.pill.dot}`} />
          <span className={`text-[18px] leading-[22px] font-semibold ${v.pill.text}`}>
            {v.pill.label}
          </span>
        </div>
        <div className="mt-[50px] flex flex-col gap-[20px]">
          {v.stats.map((s) => (
            <div
              key={s.label}
              className={`flex h-[57px] items-center rounded-[10px] bg-white ${SHADOW}`}
            >
              <span
                className={`ml-[16px] grid h-[30px] w-[30px] flex-none place-items-center rounded-[3.57px] ${s.chip}`}
              >
                <img src={s.icon} alt="" className={`h-[21px] w-[21px] ${s.iconCls}`} />
              </span>
              <span className="ml-[10px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                {s.label}
              </span>
              <span className="mr-[15px] ml-auto text-[18px] leading-[22px] font-semibold text-ink">
                {s.value}
              </span>
            </div>
          ))}
        </div>
        {renewSlot && <div className="mt-[30px]">{renewSlot}</div>}
      </div>
      <div className="relative mt-[30px] rounded-[20px] bg-white px-[31px] pt-[50px] pb-[50px]">
        <h2 className="text-[30px] leading-[37px] font-bold text-ink">
          Subscription Info
        </h2>
        <div className={`${isReport ? "pl-[72px]" : "ml-[72px]"} mt-[51px] flex items-center`}>
          <p className="text-[18px] leading-[22px] font-semibold text-ink">{v.groupId}</p>
          <button type="button" onClick={() => v.rawGroupId && copy(v.rawGroupId)} aria-label="Copy group ID" disabled={!v.rawGroupId}>
            <img src={iconCopy} alt="Copy group ID" className="ml-[10px] h-[24px] w-[24px]" />
          </button>
        </div>
        <div className="mt-[11px] flex flex-col gap-[20px]">
          {v.info.map((r) => (
            <div
              key={r.label}
              className={`flex h-[57px] items-center rounded-[10px] bg-white ${SHADOW}`}
            >
              <span className="ml-[16px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                {r.label}
              </span>
              <span className="mr-[16px] ml-auto text-[18px] leading-[22px] font-semibold text-ink">
                {r.value}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-[20px] flex flex-col gap-[10px]">
          {v.axes.map((item) => (
            <div key={item.label} className={`flex min-h-[50px] items-center rounded-[10px] bg-white px-[16px] ${SHADOW}`}>
              <span className="text-[13px] font-semibold text-[#6B6B6B]">{item.label} status</span>
              <span className="ml-auto text-right text-[15px] font-bold capitalize text-ink">{item.value}</span>
            </div>
          ))}
        </div>
        {v.canShowAccess && v.link ? (
          <div className={`mt-[50px] flex gap-[16px] rounded-[10px] bg-white ${SHADOW}`}>
            <div className="min-w-0 flex-1 pt-[11px] pl-[16px] pb-[11px]">
              <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">Shared access details</p>
              <p className="mt-[2px] break-all text-[13px] leading-[20px] font-bold text-ink">{v.link}</p>
            </div>
            <button type="button" onClick={() => copy(v.link)} className="mr-[16px] flex h-[44px] w-[80px] flex-none items-center justify-center gap-[6px] self-center rounded-[10px] bg-[#D9D9D9]">
              <img src={iconCopy} alt="" className="h-[20px] w-[20px]" />
              <span className="text-[14px] font-semibold text-black">Copy</span>
            </button>
          </div>
        ) : (
          <p className={`mt-[50px] rounded-[10px] bg-[#F7F7F7] px-[16px] py-[14px] text-[13px] font-semibold text-[#6B6B6B] ${SHADOW}`}>
            {v.accessMessage}
          </p>
        )}
        <h3 className="mt-[50px] text-[18px] leading-[22px] font-bold text-black">How to Access Your Subscription</h3>
        <p className="mt-[18px] text-[13px] leading-[20px] font-semibold text-[#0E0E0E]">
          {v.canShowAccess ? v.howtoMobile : v.accessMessage}
        </p>
        <div className="mt-[90px]">{actionSlot}</div>
        {afterSlot && <div className="mt-[50px]">{afterSlot}</div>}
      </div>
    </>
  );
}
