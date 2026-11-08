import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BrandTile from "../components/BrandTile";
import { BlurBg } from "../components/Decor";
import { accessLabel, api, brandOf, kobo } from "../lib/api";

/* Step 1 of the Join Group flow — the page the PM reported as missing
   ("First page of the Join group section is missing", board card 5).
   It is the group preview: who owns it, what it costs, how access is handed
   over and how many slots are left. Continue hands the same state to
   /join/summary, which is step 2 (price split + wallet + payment). */

const MONTHLY = "/Monthly";

function GroupGlyph({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 10 12 4l9 6M5 10v9m4.5-9v9m5-9v9m4.5-9v9M3 20h18"
        stroke="#048B0B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function JoinPreview() {
  const incoming = useLocation().state || null;
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [fetched, setFetched] = useState(null);

  /* Opened straight from the URL there is no navigation state to read, so fall
     back to the first open group from the public catalogue rather than showing
     a screen full of em dashes. */
  useEffect(() => {
    if (incoming?.preview || incoming?.group) return;
    let on = true;
    (async () => {
      const { data } = await api("/catalogue/groups?limit=1", { auth: false });
      if (on && data?.groups?.length) setFetched(data.groups[0]);
    })();
    return () => {
      on = false;
    };
  }, [incoming]);

  const g = incoming?.preview || incoming?.group || fetched || null;
  const plan = g?.plan || {};
  const service = g?.service || {};

  const brand = brandOf(service) || incoming?.brand || "netflix";
  const title =
    [service.name, plan.name].filter(Boolean).join(" ") ||
    incoming?.title ||
    "Netflix Premium";
  const creator =
    [g?.creator?.first_name, g?.creator?.last_name].filter(Boolean).join(" ") ||
    g?.creator?.first_name ||
    "Creator";
  const unitKobo =
    g?.price?.unit_price_kobo ??
    g?.price?.unit_kobo ??
    plan.unit_price_kobo ??
    incoming?.price_kobo ??
    null;
  const feeKobo =
    g?.price?.platform_fee_kobo ??
    g?.price?.platform_kobo ??
    plan.platform_fee_kobo ??
    null;
  const totalKobo =
    g?.price?.total_kobo ??
    g?.price?.total_price_kobo ??
    plan.total_kobo ??
    (unitKobo != null && feeKobo != null ? unitKobo + feeKobo : null);
  const slots = g?.open_slots ?? g?.available_slots ?? incoming?.open_slots ?? 0;
  const visibility = (g?.visibility || "public") === "private" ? "Private Group" : "Public Group";
  const code_ = g?.invite_code || g?.id || incoming?.group_id || "—";
  const access = accessLabel(g?.access_method) || "Login Access";

  const price = totalKobo != null ? kobo(totalKobo) : "—";
  const unit = unitKobo != null ? kobo(unitKobo) : "—";
  const fee = feeKobo != null ? kobo(feeKobo) : "Included";
  const slotLine = `${slots} Slot${slots === 1 ? "" : "s"} left`;

  const next = () =>
    navigate("/join/summary", {
      state: incoming || { group_id: code_, preview: g },
    });

  const rows = [
    ["Available Slot:", slotLine],
    ["Access Method:", access],
    ["Group Visibility:", visibility],
    ["Group ID:", code_],
  ];

  const PriceBoxes = ({ small = false }) => (
    <div className={`flex ${small ? "gap-[12px]" : "gap-[30px]"}`}>
      <div
        className={`flex-1 rounded-[12px] border border-clyse bg-[#DFFFE0] shadow-[0_0_16px_rgba(0,23,1,0.08)] ${
          small ? "px-[14px] py-[12px]" : "w-[266px] flex-none px-[30px] py-[24px]"
        }`}
      >
        <p className={`font-semibold text-[#4E4E4E] ${small ? "text-[12px] leading-[18px]" : "text-[18px] leading-[22px]"}`}>
          Fixed Unit Price
        </p>
        <p className={`mt-[4px] font-bold text-ink ${small ? "text-[20px] leading-[26px]" : "text-[35px] leading-[43px]"}`}>
          {unit}
        </p>
      </div>
      <div
        className={`flex-1 rounded-[12px] border border-clyse bg-[#F1F8F1] shadow-[0_0_16px_rgba(0,23,1,0.08)] ${
          small ? "px-[14px] py-[12px]" : "w-[266px] flex-none px-[30px] py-[24px]"
        }`}
      >
        <p className={`font-semibold text-[#4E4E4E] ${small ? "text-[12px] leading-[18px]" : "text-[18px] leading-[22px]"}`}>
          Clyse Fee
        </p>
        <p className={`mt-[4px] font-bold text-clyse ${small ? "text-[20px] leading-[26px]" : "text-[35px] leading-[43px]"}`}>
          {fee}
        </p>
      </div>
    </div>
  );

  const InfoRows = ({ small = false }) => (
    <div
      className={`divide-y divide-[#E3EDE3] rounded-[16px] border border-clyse bg-white shadow-[0_0_16px_rgba(0,23,1,0.06)] ${
        small ? "px-[16px]" : "px-[30px]"
      }`}
    >
      {rows.map(([k, v]) => (
        <div
          key={k}
          className={`flex items-center justify-between gap-[12px] ${small ? "py-[14px]" : "py-[18px]"}`}
        >
          <span className={`font-semibold text-[#4E4E4E] ${small ? "text-[13px] leading-[18px]" : "text-[25px] leading-[35px]"}`}>
            {k}
          </span>
          <span
            className={`text-right break-words font-semibold text-[#013104] ${
              small ? "text-[14px] leading-[18px]" : "text-[25px] leading-[35px]"
            }`}
          >
            {v}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />

      {/* Desktop */}
      <main className="relative mx-[20px] hidden pb-[80px] min-[1440px]:mx-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px] pt-[101px]">
          <Sidebar active="Join Group" />
          <div className="w-[830px] flex-none">
            <div className="flex items-center gap-[14px] rounded-[15px] border border-clyse bg-mint px-[24px] py-[16px]">
              <span className="grid h-[40px] w-[40px] place-items-center rounded-[10px] bg-white">
                <GroupGlyph size={20} />
              </span>
              <h1 className="text-[28px] leading-[34px] font-bold text-ink">Join Group</h1>
            </div>

            <div className="mt-[30px] rounded-[20px] border border-clyse bg-white p-[30px] shadow-[0_0_20px_rgba(0,23,1,0.08)]">
              <div className="flex items-start justify-between gap-[20px]">
                <div className="flex items-center gap-[20px]">
                  <BrandTile brand={brand} size={75} plain />
                  <div>
                    <p className="text-[16px] leading-[22px] font-semibold text-clyse">
                      GROUP DETAILS
                    </p>
                    <h2 className="mt-[6px] text-[32px] leading-[40px] font-bold text-ink">
                      {title}
                    </h2>
                    <p className="mt-[4px] text-[16px] leading-[22px] font-semibold text-[#6B6B6B]">
                      {creator}&rsquo;s group · {slotLine}
                    </p>
                  </div>
                </div>
                <p className="flex items-baseline whitespace-nowrap">
                  <span className="text-[32px] leading-[40px] font-bold text-ink">{price}</span>
                  <span className="ml-[2px] text-[16px] leading-[22px] font-semibold text-[#6B6B6B]">
                    {MONTHLY}
                  </span>
                </p>
              </div>

              <div className="mt-[28px]">
                <PriceBoxes />
              </div>

              <h3 className="mt-[30px] text-[24px] leading-[30px] font-bold text-ink">
                Group Information
              </h3>
              <div className="mt-[16px]">
                <InfoRows />
              </div>
            </div>

            <div className="mt-[26px] flex items-center gap-[20px]">
              <Link
                to="/browse"
                className="grid h-[60px] w-[240px] place-items-center rounded-[10px] border border-clyse text-[18px] font-semibold text-ink"
              >
                Go Back
              </Link>
              <button
                type="button"
                onClick={next}
                className="bg-btn grid h-[60px] flex-1 place-items-center rounded-[10px] text-[18px] font-semibold text-mint"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile */}
      <main className="relative bg-white xl:hidden">
        <div className="flex items-center gap-[14px] border-b border-[#BABABA] px-[30px] py-[16px]">
          <Link
            to="/browse"
            aria-label="Back"
            className="grid h-[32px] w-[32px] flex-none place-items-center rounded-full border border-[#BABABA] bg-white text-[15px] text-ink"
          >
            ‹
          </Link>
          <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-[10px] bg-mint">
            <GroupGlyph size={20} />
          </span>
          <h1 className="text-[22px] leading-[28px] font-bold text-ink">Join Group</h1>
        </div>

        <div className="px-[30px] pt-[24px] pb-[40px]">
          <div className="flex items-center gap-[16px]">
            <BrandTile brand={brand} size={50} plain />
            <div className="min-w-0">
              <p className="text-[13px] leading-[18px] font-semibold text-clyse">GROUP DETAILS</p>
              <h2 className="mt-[2px] text-[22px] leading-[28px] font-bold text-ink">{title}</h2>
              <p className="mt-[2px] text-[13px] leading-[18px] font-semibold text-[#6B6B6B]">
                {creator}&rsquo;s group
              </p>
            </div>
          </div>

          <p className="mt-[16px] flex items-baseline">
            <span className="text-[28px] leading-[34px] font-bold text-ink">{price}</span>
            <span className="ml-[2px] text-[13px] leading-[18px] font-semibold text-[#6B6B6B]">
              {MONTHLY}
            </span>
          </p>

          <div className="mt-[18px]">
            <PriceBoxes small />
          </div>

          <h3 className="mt-[26px] text-[20px] leading-[26px] font-bold text-ink">
            Group Information
          </h3>
          <div className="mt-[14px]">
            <InfoRows small />
          </div>

          <div className="mt-[26px] rounded-[16px] border border-clyse bg-[#F1F8F1] px-[16px] py-[14px]">
            <p className="text-[13px] leading-[19px] font-semibold text-[#4E4E4E]">
              Have an invite code instead?
            </p>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.trim())}
              placeholder="Enter invite code"
              aria-label="Invite code"
              className="mt-[10px] h-[48px] w-full rounded-[10px] border border-[#999999] bg-white px-[14px] text-[15px] font-semibold text-ink outline-none placeholder:text-[#999999]"
            />
            <Link
              to={code ? `/join/${code.toUpperCase()}` : "/join"}
              className={`mt-[10px] flex h-[44px] w-full items-center justify-center rounded-[10px] text-[15px] font-semibold ${
                code ? "bg-btn text-mint" : "bg-[#EDF3ED] text-[#8A9A8D]"
              }`}
            >
              Use Invite Code
            </Link>
          </div>

          <div className="mt-[22px] flex gap-[14px]">
            <Link
              to="/browse"
              className="grid h-[50px] flex-1 place-items-center rounded-[11.1px] border border-clyse text-[12.48px] font-semibold text-ink"
            >
              Go Back
            </Link>
            <button
              type="button"
              onClick={next}
              className="bg-btn grid h-[50px] flex-1 place-items-center rounded-[11.1px] text-[12.48px] font-semibold text-mint"
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
