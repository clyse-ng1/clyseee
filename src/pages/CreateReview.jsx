import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import StepHeader from "../components/StepHeader";
import { api } from "../lib/api";
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

export default function CreateReview() {
  const incoming = useLocation().state || null;
  const navigate = useNavigate();
  const services = useCatalogue();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fromWaitlist = incoming?.fromWaitlist?.plan_id || null;
  const planId =
    fromWaitlist ||
    incoming?.planId ||
    (!incoming?.custom ? pickPlan(matchService(services, incoming?.brand))?.id : null) ||
    null;
  const unit = incoming?.unit ?? 200000;
  const slots = incoming?.slots ?? 3;
  const vis = incoming?.visibility || "public";
  const title = incoming?.custom?.name || incoming?.title || "Netflix Premium";
  const unitLabel = Math.round(unit / 100).toLocaleString("en-US");

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
  const blockMsg = !incoming
    ? ""
    : services === null
      ? "Loading catalogue…"
      : incoming.custom
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
    });
    if (apiError) {
      setBusy(false);
      if (apiError.code === "group_already_exists") {
        navigate("/groups");
        return;
      }
      navigate("/create-group/failed", { state: { message: apiError.message } });
      return;
    }
    // The group is live now. Upload verification evidence (raw file bytes;
    // never stored client-side) and submit for review — best effort: the
    // group stays active even if verification needs attention later.
    const groupId = data?.group?.id;
    let verifyNote = "";
    if (groupId) {
      const files = [incoming?.proofs?.invoice, incoming?.proofs?.receipt].filter(
        (f) => f instanceof File,
      );
      for (const f of files) {
        const up = await api(
          `/member/verification/evidence?group_id=${groupId}`,
          { method: "POST", raw: true, contentType: f.type || "application/octet-stream", body: f },
        );
        if (up.error) verifyNote = up.error.message || "Evidence upload failed.";
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
      <button
        type="button"
        onClick={create}
        disabled={busy || !!blocked}
        className={`mx-auto grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint ${(busy || blocked) && !error ? "opacity-50" : ""} ${(error || blockMsg) ? "mt-[20px]" : "mt-[80px]"}`}
      >
        {busy ? "Creating…" : "Create Group"}
      </button>
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
      <button
        type="button"
        onClick={create}
        disabled={busy || !!blocked}
        className={`mx-[30px] grid h-[50px] w-[370px] place-items-center rounded-[11.1px] bg-btn text-[12.48px] font-semibold text-mint ${(busy || blocked) && !error ? "opacity-50" : ""} ${(error || blockMsg) ? "mt-[16px]" : "mt-[51px]"}`}
      >
        {busy ? "Creating…" : "Create Group"}
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-[163px] mt-[100px] hidden xl:block">
        <StepHeader step={4} />
        <h2 className="mt-[50px] text-center text-[35px] leading-[43px] font-bold">
          Review Group
        </h2>
        <div className="ml-[20px] mt-[85px] flex items-center gap-[30px]">
          <span
            className="grid h-[60px] w-[60px] flex-none place-items-center rounded-full"
            style={{ background: LOGO_BG }}
          >
            <span className="grid h-[40px] w-[40px] place-items-center bg-white">
              <img src={iconMoviesWhite} alt="" className="w-[33px]" />
            </span>
          </span>
          <span>
            <span className="block text-[35px] leading-[43px] font-semibold">
              {title}
            </span>
            <span className="mt-[5px] flex items-baseline gap-[27px]">
              <span className="text-[18px] leading-[22px] font-semibold">
                From &#8358;{unitLabel}/
              </span>
              <span className="text-[13px] leading-[16px] font-semibold text-ash">
                Monthly
              </span>
            </span>
          </span>
        </div>
        <div className="ml-[30px] mt-[95px] space-y-[20px]">
          {rows.map((r) => (
            <p key={r} className="text-[25px] leading-[35px] font-semibold">
              {r}
            </p>
          ))}
        </div>
        <p className="ml-[30px] mt-[90px] text-[25px] leading-[35px] font-semibold text-ash">
          Subscription Proof
        </p>
        <div className="ml-[33px] mt-[25px] space-y-[30px]">
          {proofs.map((p) => (
            <div key={p} className="flex items-center gap-[11px]">
              <img src={iconProofCheck} alt="" className="h-[25px] w-[25px]" />
              <span className="text-[25px] leading-[35px] font-semibold">{p}</span>
            </div>
          ))}
        </div>
        {desktopCta}
        <div className="pb-[135px]" />
      </main>

      {/* Mobile */}
      <main className="relative z-10 xl:hidden">
        <StepHeader step={4} />
        <h2 className="mt-[35px] text-center text-[22px] leading-[27px] font-bold">
          Review Group
        </h2>
        <div className="ml-[44px] mt-[58px] flex items-center gap-[20px]">
          <span
            className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full"
            style={{ background: LOGO_BG }}
          >
            <span className="grid h-[28px] w-[28px] place-items-center bg-white">
              <img src={iconMoviesWhite} alt="" className="w-[23px]" />
            </span>
          </span>
          <span>
            <span className="block text-[22px] leading-[27px] font-semibold">
              {title}
            </span>
            <span className="mt-[3px] flex items-baseline gap-[18px]">
              <span className="text-[12.48px] leading-[15px] font-semibold">
                From &#8358;{unitLabel}/
              </span>
              <span className="text-[9.02px] leading-[11px] font-semibold text-ash">
                Monthly
              </span>
            </span>
          </span>
        </div>
        <div className="ml-[51px] mt-[64px] text-[17.34px] leading-[24px] font-semibold">
          <p>{rows[0]}</p>
          <p className="mt-[39px]">{rows[1]}</p>
          <p className="mt-[15px]">{rows[2]}</p>
        </div>
        <p className="ml-[51px] mt-[63px] text-[17.34px] leading-[24px] font-semibold text-ash">
          Subscription Proof
        </p>
        <div className="ml-[53px] mt-[19px] space-y-[22px]">
          {proofs.map((p) => (
            <div key={p} className="flex items-center gap-[8px]">
              <img src={iconProofCheckSm} alt="" className="h-[17px] w-[17px]" />
              <span className="text-[17.34px] leading-[24px] font-semibold">{p}</span>
            </div>
          ))}
        </div>
        {mobileCta}
        <div className="pb-[103px]" />
      </main>
    </div>
  );
}
