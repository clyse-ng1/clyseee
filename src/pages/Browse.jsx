import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import BrandTile from "../components/BrandTile";
import Sk from "../components/Skeleton";
import { BlurBg } from "../components/Decor";
import DropSelect from "../components/DropSelect";
import { accessLabel, api, brandOf, kobo, titleCase, totalPriceKobo } from "../lib/api";
import { useCatalogue } from "../lib/useCatalogue";
import iconSearch from "../assets/side-search.svg";
import iconDocSearch from "../assets/icon-doc-search-green.svg";
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

function JoinCard({ g, fluid = false }) {
  return (
    <div
      className={`bg-btn relative rounded-[16px] px-[20px] pt-[34px] pb-[20px] text-center ${
        fluid ? "w-full" : "w-[253px] flex-none"
      }`}
    >
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
  const service = a.service || a;
  const plans = a.plans || a.catalogue_plans || [];
  const min = plans.reduce(
    (m, pl) => Math.min(m, pl.total_kobo ?? pl.total_price_kobo ?? Infinity),
    Infinity,
  );
  return {
    brand: brandOf(service),
    name: service.name || "Subscription",
    cat: service.category || "Other",
    chip: titleCase(service.category) || "Entertainment",
    price: min !== Infinity ? min : null,
  };
}

function mapGroup(g) {
  const left = g.open_slots ?? g.available_slots ?? 0;
  return {
    avatar: null,
    name: [g.creator?.first_name, g.creator?.last_name].filter(Boolean).join(" ") || "Creator",
    service: [g.service?.name, g.plan?.name].filter(Boolean).join(" ") || "Subscription",
    price: totalPriceKobo(g) != null ? kobo(totalPriceKobo(g)) : "—",
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
  const [picked, setPicked] = useState(null);

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
  const loadingBrands = services === null;
  const loadingGroups = availGroups === null;

  /* Picking a service must not remove the other services from the grid — it
     narrows the available-groups list below instead. Only the typed search and
     the category chips filter the cards. */
  const brands = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (liveBrands || []).filter(
      (b) =>
        (cat === "All" ||
          (b.cat || "").trim().toLowerCase() === cat.trim().toLowerCase()) &&
        (!needle || b.name.toLowerCase().includes(needle)),
    );
  }, [q, cat, liveBrands]);

  const groups = useMemo(() => {
    const needle = (picked || q).trim().toLowerCase();
    const all = (availGroups || []).map(mapGroup);
    if (!needle) return all;
    return all.filter(
      (g) =>
        g.name.toLowerCase().includes(needle) ||
        g.service.toLowerCase().includes(needle),
    );
  }, [q, picked, availGroups]);

  const noResult = !loadingBrands && brands.length === 0;
  const brandList = showAllBrands ? brands : brands.slice(0, 6);
  const groupList = showAllGroups ? groups : groups.slice(0, 6);

  const chips = (mobile = false) => (
    <div
      className={
        mobile
          ? "scrollbar-none -mx-[30px] flex gap-[10px] overflow-x-auto px-[30px] pb-[4px]"
          : "scrollbar-none flex gap-[16px] overflow-x-auto pb-[4px]"
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
      <main className="relative mx-auto hidden w-[1240px] pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px] pt-[101px]">
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
                  {loadingBrands
                    ? Array.from({ length: 6 }, (_, i) => <Sk key={`brand-loading-${i}`} className="h-[179px] w-full !rounded-[16px]" />)
                    : brandList.map((b) => (
                    <button
                      key={b.brand}
                      type="button"
                      onClick={() => setPicked(picked === b.name ? null : b.name)}
                      className={`flex min-h-[179px] flex-col items-center rounded-[16px] border border-clyse bg-white px-[16px] py-[20px] transition hover:shadow-[0_0_12px_rgba(4,139,11,0.15)] ${
                        picked === b.name ? "shadow-[0_0_12px_rgba(4,139,11,0.15)]" : ""
                      }`}
                    >
                      <BrandTile brand={b.brand} name={b.name} size={75} plain />
                      <span className="mt-[12px] line-clamp-2 min-h-[44px] text-[18px] leading-[22px] font-bold text-ink">
                        {b.name}
                      </span>
                      <span className="mt-[10px] inline-flex h-[19px] w-[96px] items-center justify-center rounded-[3.58px] bg-[#B1DBB3] text-[10px] leading-[15px] font-semibold text-clyse">
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
              {loadingGroups
                ? Array.from({ length: 3 }, (_, i) => <Sk key={`group-loading-${i}`} className="h-[250px] w-full !rounded-[16px]" />)
                : groupList.map((g, i) => <JoinCard key={`${g.name}-${i}`} g={g} />)}
            </div>
            {!loadingGroups && groups.length === 0 && (
              <p className="mt-[30px] text-center text-[18px] font-semibold text-[#6B6B6B]">
                {q.trim()
                  ? "No groups match your search."
                  : "No open groups right now — check back soon."}
              </p>
            )}
            {!loadingGroups && groups.length > 6 && (
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
      <main className="relative bg-white xl:hidden">
        <div className="relative bg-white px-[30px] pt-[30px] pb-[10px]">
          <div className="flex h-[56px] items-center gap-[16px] rounded-[10.4px] border-[1.4px] border-[#58A35B] bg-white px-[22px] shadow-[1.39px_1.39px_4.85px_rgba(0,23,1,0.25)]">
            <img src={iconSearch} alt="" className="h-[24px] w-[24px] flex-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Browse Subscription"
              aria-label="Browse Subscription"
              className="w-full bg-transparent text-[17.34px] leading-[24.27px] font-semibold text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>
        <div className="relative px-[30px] pt-[16px]">
          <p className="text-[17px] leading-[25px] font-semibold text-ink">
            Categories
          </p>
          <div className="mt-[10px]">{chips(true)}</div>
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
              <h2 className="col-span-2 text-[25px] leading-[30px] font-bold text-ink">
                Available Subscription
              </h2>
              {loadingBrands
                ? Array.from({ length: 4 }, (_, i) => <Sk key={`brand-loading-mobile-${i}`} className="h-[130px] w-full !rounded-[16px]" />)
                : (showAllBrands ? brands : brands.slice(0, 8)).map((b) => (
                <button
                  key={b.brand}
                  type="button"
                  onClick={() => setPicked(picked === b.name ? null : b.name)}
                  className="flex min-h-[130px] flex-col items-center rounded-[16px] border border-clyse bg-white px-[10px] py-[16px]"
                >
                  <BrandTile brand={b.brand} name={b.name} size={50} plain />
                  <span className="mt-[8px] line-clamp-2 min-h-[36px] text-[13px] leading-[18px] font-bold text-ink">
                    {b.name}
                  </span>
                  <span className="mt-[6px] inline-flex h-[15px] w-[76px] items-center justify-center rounded-[2.86px] bg-[#B1DBB3] text-[8.93px] leading-[12px] font-semibold text-clyse">
                    {b.chip || b.cat || "Entertainment"}
                  </span>
                  <span className="mt-[6px] text-[11.5px] leading-[14px] font-semibold text-ink">
                    {b.price != null ? <>From {kobo(b.price)}/</> : <>From —/</>}<span className="text-[9px]">Monthly</span>
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

          <h2 className="mt-[40px] text-[25px] leading-[30px] font-bold text-ink">
            Available Group
          </h2>
          <div className="mt-[20px] grid grid-cols-2 gap-x-[16px] gap-y-[16px]">
            {loadingGroups
              ? Array.from({ length: 4 }, (_, i) => (
                  <Sk key={`group-loading-m-${i}`} className="h-[250px] w-full !rounded-[16px]" />
                ))
              : groupList.map((g, i) => <JoinCard key={`${g.name}-${i}`} g={g} fluid />)}
          </div>
          {!loadingGroups && groups.length === 0 && (
            <p className="mt-[20px] text-center text-[15px] font-semibold text-[#6B6B6B]">
              {q.trim() ? "No groups match your search." : "No open groups right now — check back soon."}
            </p>
          )}
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
