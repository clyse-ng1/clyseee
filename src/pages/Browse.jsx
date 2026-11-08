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

function SlotIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <circle cx="4.5" cy="2.6" r="2" fill="currentColor" />
      <path d="M1 8.2c0-1.9 1.6-3.1 3.5-3.1S8 6.3 8 8.2H1Z" fill="currentColor" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
      <circle cx="3" cy="3" r="2.1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M4.4 4.4 8 8M6.2 6.2l1-1M7.2 7.2l1-1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* Join Group card — Figma 806:31476 "Join Group" tiles: 251x341, r20, dark
   green; 95px avatar, 25/700 name, "Your Contribution" box r8, a 6px progress
   bar (fill = occupied/capacity), then a slot line and the access method. The
   three little "Cut / N Slots / Coverage" boxes that used to sit here are not
   in any Figma frame. */
function JoinCard({ g, fluid = false }) {
  return (
    <article
      className={`bg-btn flex w-full flex-col rounded-[20px] px-[14px] pt-[14px] pb-[14px] xl:px-[23px] xl:pt-[20px] xl:pb-[20px] ${
        fluid ? "" : ""
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <img
          src={g.avatar || avatarAccount}
          alt=""
          className="h-[56px] w-[56px] rounded-full border-[2.5px] border-[#F1F8F2] object-cover xl:h-[74px] xl:w-[74px]"
        />
        <p className="mt-[8px] w-full truncate text-[16px] leading-[20px] font-bold text-white xl:text-[22px] xl:leading-[26px]">
          {g.name}
        </p>
        <p className="mt-[2px] w-full truncate text-[10px] leading-[14px] font-semibold text-white xl:text-[11px] xl:leading-[16px]">
          Share <span className="text-[11px] font-bold xl:text-[13px]">{g.service}</span>
        </p>
      </div>

      <div className="mx-auto mt-[12px] h-px w-full bg-[#B1DBB3]/40" />

      <div className="mt-[12px] rounded-[8px] bg-[#02580B] px-[10px] py-[8px] text-center">
        <p className="text-[9px] leading-[12px] font-semibold text-white">
          Your Contribution
        </p>
        <p className="mt-[1px] flex items-baseline justify-center gap-[2px]">
          <span className="text-[16px] leading-[20px] font-semibold text-white xl:text-[21px] xl:leading-[25px]">
            {g.price}
          </span>
          <span className="text-[10px] leading-[16px] font-semibold text-[#B1DBB3]">
            /Monthly
          </span>
        </p>
      </div>

      <div className="mt-[10px] h-[6px] w-full overflow-hidden rounded-full bg-[#B1DBB3]/30 xl:mt-[14px]">
        <span
          className="block h-full rounded-full bg-[#048B0B]"
          style={{ width: `${g.pct}%` }}
        />
      </div>

      <div className="mt-[8px] flex items-center justify-between gap-[8px] text-[11px] leading-[15px] font-semibold text-[#F1F8F2] xl:text-[13px] xl:leading-[17px]">
        <span className="flex min-w-0 items-center gap-[5px]">
          <SlotIcon />
          <span className="truncate">{g.left}</span>
        </span>
        <span className="flex-none">{g.ratio}</span>
      </div>

      <div className="mt-[6px] flex items-center gap-[6px] text-white">
        <KeyIcon />
        <span className="flex-none text-[9px] leading-[13px] font-semibold whitespace-nowrap opacity-90 xl:text-[10px] xl:leading-[15px]">
          Access Method:
        </span>
        <span className="truncate text-[10px] leading-[13px] font-semibold xl:text-[11px] xl:leading-[15px]">
          {g.access || "Login Credential"}
        </span>
      </div>

      <Link
        to={g.linkTo || "/join"}
        state={g.linkState}
        className="mt-[12px] flex h-[34px] w-full items-center justify-center rounded-[8px] bg-[#F1F8F2] text-[14px] font-semibold text-[#001701] transition hover:bg-white xl:mt-[14px] xl:h-[38px] xl:text-[16px]"
      >
        Join
      </Link>
    </article>
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
    linkTo: "/join/preview",
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
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      {/* Same shell as every other member page (mx-[20px] / min-[1440px]:mx-[100px])
          so the sidebar does not jump sideways when Browse Group is clicked. The
          372 + 38 + 830 children already measure 1240. */}
      <main className="relative mx-[20px] hidden pb-[100px] min-[1440px]:mx-[100px] xl:block">
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
                    {showAllBrands ? "Show Less" : "Load More"}
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
                        <div className="mt-[24px] grid grid-cols-2 gap-[18px]">
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
                  className={`flex h-[200px] cursor-pointer flex-col items-center rounded-[20px] border bg-[#F1F8F2] px-[8px] pt-[34px] pb-[16px] ${
                    picked === b.name
                      ? "border-[#048B0B] ring-2 ring-[#B1DBB3]"
                      : "border-[#001701]"
                  }`}
                >
                  <BrandTile brand={b.brand} name={b.name} size={75} plain />
                  <span className="mt-[10px] line-clamp-2 w-full flex-none text-[19px] leading-[21px] font-bold text-[#001701]">
                    {b.name}
                  </span>
                  <span className="mt-auto inline-flex h-[19px] w-[96px] flex-none items-center justify-center rounded-[3.58px] bg-[#048B0B] text-[10px] leading-[15px] font-semibold text-white">
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
              className="mt-[20px] flex h-[47px] w-full items-center justify-center rounded-[20px] border border-[#001701] bg-[#F1F8F2] text-[16px] font-semibold text-[#001701]"
            >
              {showAllBrands ? "Show Less" : "Load More"}
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
