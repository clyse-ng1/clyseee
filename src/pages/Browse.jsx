import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MobileBack } from "../components/MemberMini";
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
import JoinCard from "../components/GroupOfferCard";

/* Logged-in browse — desktop Figma 806:31476 (results) + 807:34801
   (no-result), mobile Figma 807:37875 (EVM9) + 807:38349 (EVM10).
   Brand cards come from GET /catalogue and the Available Groups tab from
   GET /catalogue/groups (public); search + category chips filter them
   client-side, and an empty filter renders the "No Result" state. Copy fix: "Sbcription" ->
   "Subscription", "Suggeste" -> "Suggest", "Availabe" -> "Available". */

/* Figma's chip row, in Figma order. Only chips that actually have a service in
   the catalogue are rendered, and any category the catalogue adds later is
   appended — otherwise "Security & VPN" / "Cloud" / "Delivery" filtered to
   nothing and the No Result panel showed up next to a real DStv card. */
const FIGMA_CATS = [
  "Movies & Series",
  "Streaming",
  "Music",
  "Security & VPN",
  "Delivery",
  "Cloud",
  "Productivity",
  "Sports",
  "Software",
  "Other",
];


/* Join Group card — Figma 806:31476 "Join Group" tiles: 251x341, r20, dark
   green; 95px avatar, 25/700 name, "Your Contribution" box r8, a 6px progress
   bar (fill = occupied/capacity), then a slot line and the access method. The
   three little "Cut / N Slots / Coverage" boxes that used to sit here are not
   in any Figma frame. */
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
  /* Slots offered is the denominator Figma draws; occupied is derived from the
     open count because occupied_slots is often 0 while slots are clearly gone. */
  const total = g.slots_offered ?? g.capacity ?? g.total_slots ?? left ?? 0;
  const occupied = total ? Math.max(0, Math.min(total, total - left)) : 0;
  return {
    avatar: null,
    name: [g.creator?.first_name, g.creator?.last_name].filter(Boolean).join(" ") || "Creator",
    service: [g.service?.name, g.plan?.name].filter(Boolean).join(" ") || "Subscription",
    price: totalPriceKobo(g) != null ? kobo(totalPriceKobo(g)) : "\u2014",
    left: left === 1 ? "1 Slot left" : `${left} Slots left`,
    /* Figma prints the occupancy as filled/capacity ("3/4"), not "3 open". */
    ratio: total ? `${occupied}/${total}` : `${left} open`,
    pct: total ? Math.min(100, Math.round((occupied / total) * 100)) : 0,
    access: accessLabel(g.access_method),
    linkTo: "/join/plan",
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

  const presentCats = (liveBrands || []).reduce((acc, b) => {
    const key = (b.cat || "").trim();
    if (key) acc[key.toLowerCase()] = true;
    return acc;
  }, {});
  const hasCat = (c) => !!presentCats[c.trim().toLowerCase()];

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

  const cats = ["All", ...FIGMA_CATS.filter((c) => hasCat(c)),
    ...Object.keys(presentCats).filter(
      (c) => !FIGMA_CATS.some((f) => f.toLowerCase() === c.toLowerCase()),
    ).map(titleCase)];

  const chips = (mobile = false) => (
    <div
      className={
        mobile
          ? "scrollbar-none -mx-[30px] flex gap-[10px] overflow-x-auto px-[30px] pb-[4px]"
          : "scrollbar-none flex gap-[12px] overflow-x-auto pb-[4px]"
      }
    >
      {cats.map((c) => {
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
                : "h-[48px] rounded-[6px] px-[20px] text-[15px]"
            } ${
              active
                ? "bg-[#021E02] text-white"
                : "border border-[#001701] bg-white text-[#001701] hover:bg-[#F1F8F2]"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      {/* Figma BLUR BG at page level so the mobile branch gets it too. */}
      <BlurBg variant="hero" />
      <Navbar loggedIn />
      {/* Desktop */}
      {/* Same shell as every other member page (mx-[20px] / min-[1440px]:mx-[100px])
          so the sidebar does not jump sideways when Browse Group is clicked. The
          372 + 38 + 830 children already measure 1240. */}
      <main className="relative mx-[20px] hidden pb-[100px] min-[1440px]:mx-[100px] xl:block">
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
                <div className="mt-[30px] grid grid-cols-3 gap-x-[40px] gap-y-[24px]">
                  {loadingBrands
                    ? Array.from({ length: 6 }, (_, i) => <Sk key={`brand-loading-${i}`} className="h-[179px] w-full !rounded-[16px]" />)
                    : brandList.map((b) => (
                    <button
                      key={b.brand}
                      type="button"
                      onClick={() => setPicked(picked === b.name ? null : b.name)}
                      aria-pressed={picked === b.name}
                      className={`flex h-[221px] cursor-pointer flex-col items-center rounded-[20px] border bg-[#F1F8F2] px-[16px] pt-[21px] pb-[16px] transition ${
                        picked === b.name
                          ? "border-[#048B0B] shadow-[0_0_12px_rgba(4,139,11,0.25)]"
                          : "border-[#001701] hover:shadow-[0_0_12px_rgba(0,23,1,0.15)]"
                      }`}
                    >
                      <BrandTile brand={b.brand} name={b.name} size={75} plain />
                      <span className="mt-[13px] line-clamp-2 w-full text-[25px] leading-[27px] font-bold text-[#001701]">
                        {b.name}
                      </span>
                      <span className="mt-auto inline-flex h-[19px] w-[96px] flex-none items-center justify-center rounded-[3.58px] bg-[#048B0B] text-[10px] leading-[15px] font-semibold text-white">
                        {b.chip || b.cat || "Entertainment"}
                      </span>
                    </button>
                  ))}
                </div>
                {brands.length > 6 && (
                  <button
                    type="button"
                    onClick={() => setShowAllBrands((v) => !v)}
                    className="mt-[30px] flex h-[47px] w-full items-center justify-center rounded-[20px] border border-[#001701] bg-[#F1F8F2] text-[17px] font-semibold text-[#001701] transition hover:bg-white"
                  >
                    {showAllBrands ? "Show Less" : "View More"}
                  </button>
                )}
              </>
            )}
            <div className="mt-[50px] flex items-baseline justify-between gap-[20px]">
              <h2 className="flex-none text-[35px] leading-[43px] font-bold text-ink">Join Group</h2>
              {picked && (
                <button
                  type="button"
                  onClick={() => setPicked(null)}
                  className="flex h-[36px] items-center gap-[8px] rounded-[18px] bg-mint px-[16px] text-[15px] font-semibold text-clyse"
                >
                  {picked}
                  <span aria-hidden="true">×</span>
                  <span className="sr-only">Clear service filter</span>
                </button>
              )}
            </div>
            <div className="mt-[30px] grid grid-cols-3 gap-x-[24px] gap-y-[24px]">
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
                className="mt-[50px] flex h-[47px] w-full items-center justify-center rounded-[20px] border border-[#001701] bg-[#F1F8F2] text-[17px] font-semibold text-[#001701] transition hover:bg-white"
              >
                {showAllGroups ? "Show Less" : "View More"}
              </button>
            )}
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <div className="relative px-[30px] pt-[30px]">
          <MobileBack />
        </div>
        {/* Figma 263:4402: the search bar is a full-bleed 430x56 white band
            with a hairline under it — no border, no radius, no shadow. */}
        <div className="relative border-b border-[#BABABA] bg-white">
          <div className="flex h-[56px] items-center gap-[12px] px-[30px]">
            <img src={iconSearch} alt="" className="h-[31px] w-[31px] flex-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Browse Subscription"
              aria-label="Browse Subscription"
              className="w-full bg-transparent text-[17.34px] leading-[24.27px] font-semibold text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>
        <div className="relative mx-[10px] mt-[4px] rounded-[20px] bg-[linear-gradient(180deg,#E4F6E5_0%,#EDF8EE_100%)] px-[20px] pt-[16px] pb-[20px]">
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
                        <div className="mt-[16px] grid grid-cols-2 gap-x-[10px] gap-y-[10px]">
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
                  aria-pressed={picked === b.name}
                  className={`flex h-[165px] cursor-pointer flex-col items-center rounded-[16px] border bg-[#F6FCF6] px-[8px] pt-[18px] pb-[19px] ${
                    picked === b.name
                      ? "border-[#048B0B] ring-2 ring-[#B1DBB3]"
                      : "border-[#048B0B55]"
                  }`}
                >
                  <BrandTile brand={b.brand} name={b.name} size={50} plain />
                  <span className="mt-[10px] line-clamp-2 w-full flex-none text-[16px] leading-[19px] font-bold text-[#001701]">
                    {b.name}
                  </span>
                  <span className="mt-auto inline-flex h-[18px] w-[95px] flex-none items-center justify-center rounded-[3.58px] bg-[#048B0B] text-[10px] leading-[15px] font-semibold text-white">
                    {b.chip || b.cat || "Entertainment"}
                  </span>
                </button>
              ))}
            </div>
          )}
          {!noResult && brands.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllBrands((v) => !v)}
              className="mt-[16px] flex h-[40px] w-full items-center justify-center rounded-[20px] border border-[#B1DBB3] bg-[#DFFFE0] text-[14px] font-semibold text-[#001701]"
            >
              {showAllBrands ? "Show Less" : "View More"}
            </button>
          )}

          <div className="mt-[40px] flex items-center justify-between gap-[10px]">
            <h2 className="flex-none text-[25px] leading-[30px] font-bold text-ink">
              Available Group
            </h2>
            {picked && (
              <button
                type="button"
                onClick={() => setPicked(null)}
                className="flex h-[30px] min-w-0 max-w-[45%] items-center gap-[6px] rounded-[15px] bg-mint px-[12px] text-[12.5px] font-semibold text-clyse"
              >
                <span className="truncate">{picked}</span>
                <span aria-hidden="true" className="flex-none">×</span>
                <span className="sr-only">Clear service filter</span>
              </button>
            )}
          </div>
          <div className="mt-[20px] grid grid-cols-2 gap-x-[18px] gap-y-[17px]">
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
