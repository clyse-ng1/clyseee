import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import StepHeader from "../components/StepHeader";
import { api, brandOf } from "../lib/api";
import BrandTile from "../components/BrandTile";
import { invalidateGroups } from "../lib/groupsCache";
import { matchService, pickPlan, useCatalogue } from "../lib/useCatalogue";
import iconMoviesWhite from "../assets/icon-movies-white.svg";
import iconProofCheck from "../assets/icon-proof-check.svg";
import iconProofCheckSm from "../assets/icon-proof-check-sm.svg";

/* Step 4 — review group. The logo disc stacks Figma's three fills (linear +
   radial green gradients over near-black). With flow state, rows go live and
   Create Group posts to the API; direct visits keep the Figma demo. */
const LOGO_BG = [
  "radial-gradient(circle at 50% 50%, #00FF0F 16%, #001601 97%)",
  "linear-gradient(180deg, #001701 8%, #007D07 100%)",
  "#000F00",
].join(", ");

const ROWS = [
  "Available Subscription Shared: 3 Slots",
  "Access Method: Login credentials",
  "Group Visibility: Public Group",
];
const PROOFS = ["Subscription Invoice", "Payment Receipt"];

function readDraft() {
  try {
    const raw = sessionStorage.getItem("clyse-draft");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function CreateReview() {
  const incoming = useLocation().state || null;
  /* A group created earlier in this flow (create-group/activated passes it
     back), so the review screen can show/withdraw its verification. */
  const groupIdForVerify = incoming?.group_id || incoming?.groupId || null;
  const navigate = useNavigate();
  const services = useCatalogue();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fromWaitlist = incoming?.fromWaitlist?.plan_id || null;
  const plan = !incoming?.custom
    ? pickPlan(matchService(services, incoming?.brand))
    : null;
  const planId = fromWaitlist || incoming?.planId || plan?.id || null;
  /* Display fallbacks: on a refresh the router state is gone, so the draft
     CreateGroup mirrors into sessionStorage keeps the name and the price from
     collapsing to "₦—". It does not turn a direct visit into a real create. */
  const draft = readDraft();
  const unit =
    incoming?.unit ??
    incoming?.custom?.priceKobo ??
    draft?.unit ??
    plan?.unit_price_kobo ??
    plan?.total_price_kobo ??
    null;
  const slots = incoming?.slots ?? 3;
  const vis = incoming?.visibility || "public";
  const title =
    incoming?.custom?.name || incoming?.title || draft?.title || "Netflix Premium";
  const unitLabel =
    unit == null ? "—" : Math.round(unit / 100).toLocaleString("en-US");

  const rows = incoming
    ? [
        `Available Subscription Shared: ${slots} Slots`,
        "Access Method: Login credentials",
        `Group Visibility: ${vis === "private" ? "Private" : "Public"} Group`,
      ]
    : ROWS;
  const proofName = (f, fallback) =>
    typeof f === "string" ? f || fallback : f?.name || fallback;
  const proofs = incoming?.proofs
    ? [
        proofName(incoming.proofs.invoice, "Subscription Invoice"),
        proofName(incoming.proofs.receipt, "Payment Receipt"),
      ]
    : PROOFS;

  const blocked = incoming && !planId;
  /* Only warn when there really is no plan to create from. This used to fire
     for every visit once the catalogue had loaded, because the old chain never
     checked planId — so a perfectly valid plan still showed "isn't available
     yet" under the Review screen. */
  const blockMsg = !blocked
    ? ""
    : services === null
      ? "Loading catalogue…"
      : incoming?.custom
        ? "Custom subscriptions need an approved catalogue plan. Go back and pick a subscription instead."
        : "This subscription isn't available yet. Go back and pick another.";

  const create = async () => {
    if (busy || !planId) return;
    setBusy(true);
    setError("");
    const start = new Date();
    const startDate = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
    // Groups created from a waitlist entry use POST /member/groups/from-waitlist
    // (same body); the caller's entry flips to "joined".
    const { data, error: apiError } = await api(
      fromWaitlist ? "/member/groups/from-waitlist" : "/member/groups",
      {
        method: "POST",
        body: {
          plan_id: planId,
          slots_offered: slots,
          visibility: vis,
          start_date: startDate,
          access_method: "credentials",
        },
      },
    );
    if (apiError) {
      setBusy(false);
      if (apiError.code === "group_already_exists") {
        navigate("/groups");
        return;
      }
      navigate("/create-group/failed", {
        state: { message: apiError.message },
      });
      return;
    }
    // The group is live now. Upload verification evidence (raw file bytes;
    // never stored client-side) and submit for review — best effort: the
    // group stays active even if verification needs attention later.
    invalidateGroups();
    const groupId = data?.group?.id;
    let verifyNote = "";
    if (groupId) {
      const files = [
        incoming?.proofs?.invoice,
        incoming?.proofs?.receipt,
      ].filter((f) => f instanceof File);
      for (const f of files) {
        const up = await api(
          `/member/verification/evidence?group_id=${groupId}`,
          {
            method: "POST",
            raw: true,
            contentType: f.type || "application/octet-stream",
            body: f,
          },
        );
        if (up.error)
          verifyNote = up.error.message || "Evidence upload failed.";
      }
      const sub = await api("/member/verification", {
        method: "POST",
        body: { group_id: groupId },
      });
      if (sub.error && !verifyNote) verifyNote = sub.error.message || "";
    }
    setBusy(false);
    navigate("/create-group/activated", {
      state: { group_id: groupId, verifyNote },
    });
  };

  const desktopCta = !incoming ? (
    <Link
      to="/create-group/activated"
      className="mx-auto mt-[80px] grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint"
    >
      Create Group
    </Link>
  ) : (
    <>
      {(error || blockMsg) && (
        <p className="mt-[80px] text-center text-[18px] leading-[22px] font-semibold text-[#E31B00]">
          {error || blockMsg}
        </p>
      )}
      <div className="mx-auto mt-[80px] flex w-[990px] items-center justify-center gap-[50px]">
        <Link
          to="/create-group/verify"
          className="grid h-[60px] w-[470px] place-items-center rounded-2xl border border-clyse text-[18px] font-semibold text-ink"
        >
          Go Back
        </Link>
        <button
          type="button"
          onClick={create}
          disabled={busy || !!blocked}
          className={`grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint ${(busy || blocked) && !error ? "opacity-50" : ""}`}
        >
          {busy ? "Creating…" : "Create Group"}
        </button>
      </div>
    </>
  );

  const mobileCta = !incoming ? (
    <Link
      to="/create-group/activated"
      className="mx-[30px] mt-[51px] grid h-[50px] w-[370px] place-items-center rounded-[11.1px] bg-btn text-[12.48px] font-semibold text-mint"
    >
      Create Group
    </Link>
  ) : (
    <>
      {(error || blockMsg) && (
        <p className="mx-[30px] mt-[51px] text-center text-[13px] leading-[20px] font-semibold text-[#E31B00]">
          {error || blockMsg}
        </p>
      )}
      <div className="mx-[30px] mt-[51px] flex items-center gap-[14px]">
        <Link
          to="/create-group/verify"
          className="grid h-[50px] flex-1 place-items-center rounded-[11.1px] border border-clyse text-[12.48px] font-semibold text-ink"
        >
          Go Back
        </Link>
        <button
          type="button"
          onClick={create}
          disabled={busy || !!blocked}
          className={`grid h-[50px] flex-1 place-items-center rounded-[11.1px] bg-btn text-[12.48px] font-semibold text-mint ${(busy || blocked) && !error ? "opacity-50" : ""}`}
        >
          {busy ? "Creating…" : "Create Group"}
        </button>
      </div>
    </>
  );

  return (
    <div className="relative min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-[100px] mt-[100px] hidden xl:block">
        {/* Figma 887:49477: one white card, and the review split into three
            stacked cards — subscription, details, subscription proof. */}
        <div className="rounded-[20px] bg-white px-[63px] pt-[30px] pb-[50px] shadow-[0_0_20px_rgba(0,23,1,0.08)]">
        <StepHeader step={5} />
        <h2 className="mt-[50px] text-center text-[35px] leading-[43px] font-bold">
          Review Group
        </h2>

        <div className="mt-[40px] rounded-[15px] border border-clyse bg-white px-[30px] py-[24px] shadow-[0_0_12px_rgba(0,23,1,0.06)]">
          <div className="flex items-center gap-[22px]">
            <BrandTile brand={brandOf({ name: title })} name={title} size={60} plain />
            <span>
              <span className="block text-[25px] leading-[32px] font-semibold">
                {title}
              </span>
              <span className="mt-[4px] flex items-baseline">
                <span className="text-[16px] leading-[20px] font-semibold text-[#6B6B6B]">
                  From &#8358;{unitLabel}
                </span>
                <span className="text-[12px] leading-[15px] font-semibold text-ash">
                  /Monthly
                </span>
              </span>
            </span>
          </div>
        </div>

        <div className="mt-[20px] rounded-[15px] border border-clyse bg-white px-[30px] py-[24px] shadow-[0_0_12px_rgba(0,23,1,0.06)]">
          <div className="space-y-[14px]">
            {rows.map((r) => (
              <p key={r} className="text-[20px] leading-[28px] font-semibold">
                {r}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-[20px] rounded-[15px] border border-clyse bg-white px-[30px] py-[24px] shadow-[0_0_12px_rgba(0,23,1,0.06)]">
          <p className="text-[20px] leading-[28px] font-semibold text-ash">
            Subscription Proof
          </p>
          <div className="mt-[18px] space-y-[14px]">
            {proofs.map((p) => (
              <div key={p} className="flex items-center gap-[11px]">
                <img src={iconProofCheck} alt="" className="h-[22px] w-[22px]" />
                <span className="text-[20px] leading-[28px] font-semibold">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-[50px] flex w-[990px] items-center justify-center gap-[50px]">
          <Link
            to="/create-group/verify"
            className="grid h-[60px] w-[470px] place-items-center rounded-2xl border border-clyse text-[18px] font-semibold text-ink"
          >
            Go Back
          </Link>
          <button
            type="button"
            onClick={!incoming ? () => navigate("/create-group/activated") : create}
            disabled={!!incoming && (busy || !!blocked)}
            className={`grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint ${
              incoming && (busy || blocked) && !error ? "opacity-50" : ""
            }`}
          >
            {busy ? "Creating…" : "Create Group"}
          </button>
        </div>
        {(error || blockMsg) && (
          <p className="mt-[20px] text-center text-[18px] leading-[22px] font-semibold text-[#E31B00]">
            {error || blockMsg}
          </p>
        )}
        <div className="pb-[60px]" />
        </div>
      </main>

      {/* Mobile */}
      <main className="relative z-10 xl:hidden">
        <StepHeader step={5} />
        <h2 className="mt-[35px] text-center text-[22px] leading-[27px] font-bold">
          Review Group
        </h2>
        {/* Figma review screen: everything sits in white cards rather than
            floating on the tinted background (PM: "containers missing"). */}
        <div className="mx-[30px] mt-[30px] rounded-[16px] border border-clyse bg-white px-[20px] py-[18px] shadow-[0_0_13.87px_rgba(0,23,1,0.06)]">
          <div className="flex items-center gap-[14px]">
            <span
              className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full"
              style={{ background: LOGO_BG }}
            >
              <img src={iconMoviesWhite} alt="" className="w-[23px]" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[20px] leading-[26px] font-semibold">
                {title}
              </span>
              <span className="mt-[3px] flex items-baseline">
                <span className="text-[13px] leading-[16px] font-semibold">
                  From &#8358;{unitLabel}
                </span>
                <span className="text-[10px] leading-[12px] font-semibold text-ash">
                  /Monthly
                </span>
              </span>
            </span>
          </div>
        </div>

        <div className="mx-[30px] mt-[16px] rounded-[16px] bg-white px-[20px] py-[18px] shadow-[0_0_13.87px_rgba(0,23,1,0.06)]">
          {rows.map((r, i) => (
            <p
              key={r}
              className={`text-[15px] leading-[22px] font-semibold text-ink ${
                i ? "mt-[12px] border-t border-[#EDF3ED] pt-[12px]" : ""
              }`}
            >
              {r}
            </p>
          ))}
        </div>

        <div className="mx-[30px] mt-[16px] rounded-[16px] bg-white px-[20px] py-[18px] shadow-[0_0_13.87px_rgba(0,23,1,0.06)]">
          <p className="text-[13px] leading-[18px] font-semibold text-ash">
            Subscription Proof
          </p>
          <div className="mt-[12px] space-y-[10px]">
            {proofs.map((p) => (
              <div key={p} className="flex items-center gap-[10px]">
                <img src={iconProofCheck} alt="" className="h-[18px] w-[18px]" />
                <span className="text-[15px] leading-[22px] font-semibold">
                  {p}
                </span>
              </div>
            ))}
          </div>
        </div>
        {groupIdForVerify && (
          <VerificationStatus groupId={groupIdForVerify} className="mx-[30px] mt-[20px]" />
        )}
        {mobileCta}
        <div className="pb-[103px]" />
      </main>
    </div>
  );
}
