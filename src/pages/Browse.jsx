import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import BrandTile from "../components/BrandTile";
import { BlurBg } from "../components/Decor";
import { accessLabel, api, brandOf, kobo } from "../lib/api";
import { useCatalogue } from "../lib/useCatalogue";
import iconSearch from "../assets/side-search.svg";
import iconDocSearch from "../assets/icon-doc-search-green.svg";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";
import avatarAshlynn from "../assets/avatar-ashlynn.webp";
import avatarAspen from "../assets/avatar-aspen.webp";
import avatarKianna from "../assets/avatar-kianna.webp";
import avatarCurtis from "../assets/avatar-ashlynn-curtis.webp";
import avatarAccount from "../assets/avatar-account.webp";

/* Logged-in browse — desktop Figma 806:31476 (results) + 807:34801
   (no-result), mobile Figma 807:37875 (EVM9) + 807:38349 (EVM10).
   Brand cards come from GET /catalogue and the Available Groups tab from
   GET /catalogue/groups (public); search + category chips filter them
   client-side, and an empty filter renders the "No Result" state. Copy fix: "Sbcription" ->
   "Subscription", "Suggeste" -> "Suggest", "Availabe" -> "Available". */

const CATS = [
  "All",
  "Movies & Series",
  "Streaming",
  "Music",
  "Security & VPN",
  "Delivery",
  "Cloud",
  "Productivity",
];

const BRANDS = [
  { brand: "netflix", name: "Netflix Premium", cat: "Movies & Series" },
  { brand: "adobe", name: "Adobe Creative Cloud", cat: "Productivity" },
  { brand: "amazon", name: "Amazon", cat: "Cloud" },
  { brand: "spotify", name: "Spotify Premium", cat: "Music" },
  { brand: "canva", name: "Canva Pro", cat: "Productivity" },
  { brand: "capcut", name: "CapCut Pro", cat: "Streaming" },
  { brand: "youtube", name: "YouTube Premium", cat: "Streaming" },
  { brand: "prime", name: "Prime Video", cat: "Movies & Series" },
];

const GROUPS = [
  { avatar: avatarAccount, name: "Marcus Saris", service: "Netflix Premium", price: "N2,000", left: "1 Slot left", ratio: "3/4" },
  { avatar: avatarAshlynn, name: "Ashlynn Curtis", service: "Spotify Premium", price: "N2,000", left: "1 Slot left", ratio: "3/4" },
  { avatar: avatar2, name: "Davis Ekstrom", service: "YouTube Premium", price: "N2,000", left: "1 Slot left", ratio: "3/4" },
  { avatar: avatarKianna, name: "Kianna Passaquindici", service: "Canva Pro", price: "N2,000", left: "1 Slot left", ratio: "3/4" },
  { avatar: avatarCurtis, name: "Curtis Rhiel Madsen", service: "Prime Video", price: "N2,000", left: "1 Slot left", ratio: "3/4" },
  { avatar: avatarAspen, name: "Aspen Gouse", service: "Adobe Creative Cloud", price: "N2,000", left: "1 Slot left", ratio: "3/4" },
  { avatar: avatar1, name: "Kaylynn Vetrovs", service: "Amazon", price: "N2,000", left: "1 Slot left", ratio: "3/4" },
  { avatar: avatar3, name: "Abram Botosh", service: "CapCut Pro", price: "N2,000", left: "1 Slot left", ratio: "3/4" },
  { avatar: avatarAccount, name: "Yusuff Sodiq", service: "Netflix Premium", price: "N2,500", left: "2 Slots left", ratio: "2/4" },
  { avatar: avatarAshlynn, name: "Maria Saris", service: "Spotify Premium", price: "N2,500", left: "2 Slots left", ratio: "2/4" },
  { avatar: avatar2, name: "Tolu Adeyemi", service: "YouTube Premium", price: "N2,500", left: "2 Slots left", ratio: "2/4" },
  { avatar: avatarKianna, name: "Aisha Bello", service: "Canva Pro", price: "N2,500", left: "2 Slots left", ratio: "2/4" },
];

function JoinCard({ g }) {
  return (
    <div className="bg-btn relative w-[253px] flex-none rounded-[16px] px-[20px] pt-[34px] pb-[20px] text-center">
      <img
        src={g.avatar || avatarAccount}
        alt=""
        className="absolute -top-[32px] left-1/2 h-[64px] w-[64px] -translate-x-1/2 rounded-full border-2 border-white object-cover"
      />
      <p className="mt-[8px] truncate text-[18px] leading-[22px] font-bold text-white">
        {g.name}
      </p>
      <p className="mt-[4px] text-[13px] leading-[16px] font-semibold text-mint">
        Share {g.service}
      </p>
      <p className="mt-[10px] text-[12px] leading-[15px] font-semibold text-mint">
        Your Contribution
      </p>
      <p className="mt-[4px] text-[22px] leading-[27px] font-bold text-white">
        {g.price}
        <span className="text-[12px] font-semibold text-mint">/Monthly</span>
      </p>
      <div className="mt-[10px] border-t border-white/25 pt-[10px]">
        <p className="flex items-center justify-between text-[12px] leading-[15px] font-semibold text-mint">
          <span>{g.left}</span>
          <span>{g.ratio}</span>
        </p>
        <p className="mt-[6px] text-left text-[11px] leading-[14px] font-semibold text-mint">
          Access Method: {g.access || "Login Credential"}
        </p>
      </div>
      <Link
        to={g.linkTo || "/join"}
        state={g.linkState}
        className="mt-[12px] flex h-[36px] w-full items-center justify-center rounded-[8px] bg-white text-[14px] font-bold text-ink transition hover:bg-mint"
      >
        Join
      </Link>
    </div>
  );
}

function mapService(a) {
  const plans = a.plans || [];
  const min = plans.reduce(
    (m, pl) => Math.min(m, pl.total_kobo ?? pl.total_price_kobo ?? Infinity),
    Infinity,
  );
  return {
    brand: brandOf(a.service),
    name: a.service?.name || "Subscription",
    cat: a.service?.category || "Other",
    chip: a.service?.category || "Entertainment",
    price: min !== Infinity ? min : null,
  };
}

function mapGroup(g) {
  const left = g.open_slots ?? g.available_slots ?? 0;
  return {
    avatar: null,
    name: [g.creator?.first_name, g.creator?.last_name].filter(Boolean).join(" ") || "Creator",
    service: [g.service?.name, g.plan?.name].filter(Boolean).join(" ") || "Subscription",
    price: (g.price?.total_kobo ?? g.plan?.total_price_kobo) != null ? kobo(g.price?.total_kobo ?? g.plan.total_price_kobo) : "—",
    left: left === 1 ? "1 Slot left" : `${left} Slots left`,
    ratio: `${left} open`,
    access: accessLabel(g.access_method),
    linkTo: "/join/summary",
    linkState: { group_id: g.group_id || g.id, preview: g },
  };
}

export default function Browse() {
  const services = useCatalogue();
  const [availGroups, setAvailGroups] = useState(null);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllGroups, setShowAllGroups] = useState(false);

  useEffect(() => {
    let on = true;
    (async () => {
      const pub = await api("/catalogue/groups?limit=50", { auth: false });
      if (on && pub.data?.groups?.length) {
        setAvailGroups(pub.data.groups);
        return;
      }
      const { data } = await api("/member/dashboard");
      if (on) setAvailGroups(data?.available_groups || []);
    })();
    return () => {
      on = false;
    };
  }, []);

  const liveBrands = services === null ? null : services.map(mapService);

  const brands = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (liveBrands || BRANDS).filter(
      (b) =>
        (cat === "All" || b.cat === cat) &&
        (!needle || b.name.toLowerCase().includes(needle)),
    );
  }, [q, cat, liveBrands]);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const all = availGroups === null ? GROUPS : availGroups.map(mapGroup);
    if (!needle) return all;
    return all.filter(
      (g) =>
        g.name.toLowerCase().includes(needle) ||
        g.service.toLowerCase().includes(needle),
    );
  }, [q, availGroups]);

  const noResult = brands.length === 0;
  const brandList = showAllBrands ? brands : brands.slice(0, 6);
  const groupList = showAllGroups ? groups : groups.slice(0, 6);

  const chips = (mobile = false) => (
    <div
      className={
        mobile
          ? "scrollbar-none -mx-[30px] flex gap-[10px] overflow-x-auto px-[30px] pb-[4px]"
          : "flex gap-[16px] overflow-x-auto pb-[4px]"
      }
    >
      {CATS.map((c) => {
        const active = cat === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => {
              setCat(c);
              setShowAllBrands(false);
            }}
            className={`flex-none font-semibold whitespace-nowrap transition ${
              mobile
                ? "h-[42px] rounded-[8px] px-[14px] text-[12.5px]"
                : "h-[44px] rounded-[10px] px-[20px] text-[18px]"
            } ${
              active
                ? "bg-btn text-white"
                : "border border-clyse bg-white text-ink hover:bg-mint"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px]">
          <Sidebar active="Browse Group" />
          <div className="w-[830px] flex-none">
            <div className="flex h-[80px] items-center gap-[20px] rounded-[15px] border border-[#57A35B] bg-white px-[32px]">
              <img src={iconSearch} alt="" className="h-[30px] w-[30px]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Browse Subscription"
                aria-label="Browse Subscription"
                className="w-full bg-transparent text-[25px] font-semibold text-ink outline-none placeholder:text-[#999999]"
              />
            </div>
            <p className="mt-[30px] ml-[30px] text-[25px] leading-[35px] font-semibold text-ink">
              Categories
            </p>
            <div className="mt-[10px] ml-[30px]">{chips()}</div>
            {noResult ? (
              <div className="mt-[40px] rounded-[20px] bg-white px-[40px] py-[50px] text-center shadow-[0_0_20px_rgba(0,23,1,0.10)]">
                <img src={iconDocSearch} alt="" className="mx-auto h-[70px] w-[70px]" />
                <h1 className="mt-[20px] text-[25px] leading-[35px] font-semibold text-ink">
                  No Result
                </h1>
                <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
                  The Subscription is not available for now
                </p>
                <Link
                  to="/no-subscription"
                  className="bg-btn mx-auto mt-[24px] flex h-[60px] w-[280px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-mint transition hover:opacity-90"
                >
                  Suggest Service
                </Link>
              </div>
            ) : (
              <>
                <h1 className="mt-[30px] text-[35px] leading-[43px] font-bold text-ink">
                  Available Group Subscription
                </h1>
                <div className="mt-[30px] grid grid-cols-3 gap-x-[82px] gap-y-[50px]">
                  {brandList.map((b) => (
                    <button
                      key={b.brand}
                      type="button"
                      onClick={() => setQ(b.name)}
                      className="flex min-h-[179px] flex-col items-center rounded-[16px] border border-[#E5E5E5] bg-white px-[16px] py-[20px] transition hover:border-clyse hover:shadow-[0_0_12px_rgba(4,139,11,0.15)]"
                    >
                      <BrandTile brand={b.brand} size={64} plain />
                      <span className="mt-[12px] line-clamp-2 min-h-[44px] text-[18px] leading-[22px] font-bold text-ink">
                        {b.name}
                      </span>
                      <span className="mt-[10px] rounded-full bg-clyse px-[14px] py-[4px] text-[12px] font-semibold text-white">
                        {b.chip || b.cat || "Entertainment"}
                      </span>
                    </button>
                  ))}
                </div>
                {brands.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllBrands((v) => !v)}
                    className="mt-[30px] flex h-[56px] w-full items-center justify-center rounded-[10px] border border-clyse bg-mint text-[18px] font-semibold text-ink transition hover:bg-white"
                  >
                    {showAllBrands ? "Show Less" : "Load More"}
                  </button>
                )}
              </>
            )}
            <h2 className="mt-[50px] text-[35px] leading-[43px] font-bold text-ink">
              Join Group
            </h2>
            <div className="mt-[62px] grid grid-cols-3 gap-x-[38px] gap-y-[62px]">
              {groupList.map((g, i) => (
                <JoinCard key={`${g.name}-${i}`} g={g} />
              ))}
            </div>
            {groups.length === 0 && (
              <p className="mt-[30px] text-center text-[18px] font-semibold text-[#6B6B6B]">
                {q.trim()
                  ? "No groups match your search."
                  : "No open groups right now — check back soon."}
              </p>
            )}
            {groups.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllGroups((v) => !v)}
                className="mt-[50px] flex h-[56px] w-full items-center justify-center rounded-[10px] border border-clyse bg-mint text-[18px] font-semibold text-ink transition hover:bg-white"
              >
                {showAllGroups ? "Show Less" : "View More"}
              </button>
            )}
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative bg-white px-[30px] py-[12px]">
          <div className="flex h-[32px] items-center gap-[12px]">
            <img src={iconSearch} alt="" className="h-[24px] w-[24px]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Browse Subscription"
              aria-label="Browse Subscription"
              className="w-full bg-transparent text-[17px] font-semibold text-ink outline-none placeholder:text-[#999999]"
            />
          </div>
        </div>
        <div className="relative px-[30px] pt-[16px]">
          <p className="text-[17px] leading-[25px] font-semibold text-ink">
            Categories
          </p>
          <div className="mt-[10px]">{chips(true)}</div>
          <div className="mt-[20px] rounded-[16px] bg-white p-[11px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
            <div className="bg-btn flex h-[50px] items-center rounded-[10px] px-[20px] text-[25px] font-semibold text-white">
              Netflix Group
            </div>
            <div className="mt-[20px] flex h-[33px] items-center justify-center rounded-[5px] border border-line bg-white">
              <svg width="16" height="8" viewBox="0 0 19 9" fill="none" aria-hidden>
                <path
                  d="M1.5 1.5 9.5 7.5l8-6"
                  stroke="#6B6B6B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          {noResult ? (
            <div className="mt-[30px] rounded-[20px] bg-white px-[20px] py-[30px] text-center shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <img src={iconDocSearch} alt="" className="mx-auto h-[60px] w-[60px]" />
              <h1 className="mt-[16px] text-[25px] leading-[30px] font-semibold text-ink">
                No Result
              </h1>
              <p className="mx-auto mt-[8px] max-w-[350px] text-[18px] leading-[24px] font-semibold text-ink">
                The Subscription is not available for now
              </p>
              <Link
                to="/create-group"
                className="bg-btn mx-auto mt-[24px] flex h-[55px] w-full items-center justify-center rounded-[10px] text-[16px] font-semibold text-mint transition hover:opacity-90"
              >
                Custom Subscription
              </Link>
              <Link
                to="/no-subscription"
                className="mx-auto mt-[16px] flex h-[55px] w-full items-center justify-center rounded-[10px] border border-clyse bg-mint text-[16px] font-semibold text-ink transition hover:bg-white"
              >
                Suggest Service
              </Link>
            </div>
          ) : (
            <div className="mt-[24px] grid grid-cols-2 gap-[16px]">
              {(showAllBrands ? brands : brands.slice(0, 8)).map((b) => (
                <button
                  key={b.brand}
                  type="button"
                  onClick={() => setQ(b.name)}
                  className="flex min-h-[130px] flex-col items-center rounded-[16px] border border-[#E5E5E5] bg-white px-[10px] py-[16px]"
                >
                  <BrandTile brand={b.brand} size={48} plain />
                  <span className="mt-[8px] line-clamp-2 min-h-[36px] text-[13px] leading-[18px] font-bold text-ink">
                    {b.name}
                  </span>
                  <span className="mt-[6px] rounded-full bg-clyse px-[10px] py-[2px] text-[10px] font-semibold text-white">
                    {b.chip || b.cat || "Entertainment"}
                  </span>
                  <span className="mt-[6px] text-[11.5px] leading-[14px] font-semibold text-ink">
                    {b.price != null ? <>From {kobo(b.price)}/</> : <>From N2,000/</>}<span className="text-[9px]">Monthly</span>
                  </span>
                </button>
              ))}
            </div>
          )}
          {!noResult && brands.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllBrands((v) => !v)}
              className="mt-[20px] flex h-[50px] w-full items-center justify-center rounded-[10px] border border-clyse bg-mint text-[14px] font-semibold text-ink"
            >
              {showAllBrands ? "Show Less" : "Load More"}
            </button>
          )}
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
