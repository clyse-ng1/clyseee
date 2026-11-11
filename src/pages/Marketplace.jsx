import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import MobileBrowse from "../components/MobileBrowse";
import Sk from "../components/Skeleton";
import BrandTile from "../components/BrandTile";
import { Footer, MobileFooter } from "../components/Footer";
import iconMovies from "../assets/icon-movies.svg";
import iconMusic from "../assets/icon-music.svg";
import iconProductivity from "../assets/icon-productivity.svg";
import iconSearch from "../assets/icon-search.svg";
import iconChevron from "../assets/icon-chevron.svg";
import iconUser from "../assets/icon-user.svg";
import avatarAccount from "../assets/avatar-account.webp";
import GroupOfferCard from "../components/GroupOfferCard";
import ctaOwner from "../assets/cta-owner.webp";
import { api, brandOf, kobo, titleCase, totalPriceKobo } from "../lib/api";
import { useCatalogue } from "../lib/useCatalogue";

const PILLS = [
  { label: "All", width: 74 },
  { label: "Movies & Series", width: 194 },
  { label: "Streaming", width: 149 },
  { label: "Music", width: 106 },
  { label: "Security & VPN", width: 190 },
  { label: "Delivery", width: 127 },
  { label: "Cloud", width: 106 },
  { label: "Productivity", width: 164 },
];

function catIcon(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("music")) return iconMusic;
  if (c.includes("movie") || c.includes("stream") || c.includes("entertainment")) return iconMovies;
  return iconProductivity;
}

function ServiceCard({ title, brand, category, chip, price }) {
  return (
    <Link
      to="/subscription-group"
      className="bg-mintfade flex h-[290px] flex-col items-center justify-center rounded-[20px] border border-clyse px-[20px] shadow-[0_0_20px_rgba(0,23,1,0.10)] transition hover:opacity-95"
    >
      <BrandTile brand={brand} name={title} category={category} size={75} plain />
      <p className="mt-[11px] max-w-[200px] text-center text-[25px] font-bold leading-[28px] text-ink">{title}</p>
      <div className="mt-[6px] flex h-[19px] w-fit flex-none items-center rounded-[3.5px] bg-[#B1DBB3] px-[10px]">
        <span className="text-[10px] font-semibold text-clyse">{chip || category}</span>
      </div>
      <div className="mt-[14px] h-[4px] w-[73px] flex-none rounded-full bg-[#B1DBB3]" />
      <p className="mt-[16px] text-center text-[18px] font-semibold leading-[22px] text-ink">{price || "Price unavailable"}</p>
    </Link>
  );
}

function mapService(a) {
  const service = a.service || a;
  const plans = a.plans || a.catalogue_plans || [];
  const min = plans.reduce(
    (m, pl) => Math.min(m, pl.total_kobo ?? pl.total_price_kobo ?? Infinity),
    Infinity,
  );
  const cat = service.category || "Entertainment";
  return {
    title: service.name || "Subscription",
    brand: brandOf(service),
    category: cat,
    chip: titleCase(cat),
    price: min !== Infinity ? `From ${kobo(min)}/Monthly` : null,
  };
}

function mapOffer(g) {
  const left = g.open_slots ?? g.available_slots ?? 0;
  const total = totalPriceKobo(g);
  return {
    name:
      [g.creator?.first_name, g.creator?.last_name].filter(Boolean).join(" ") ||
      "Creator",
    avatar: null,
    service: [g.service?.name, g.plan?.name].filter(Boolean).join(" ") || "Subscription",
    price: total != null ? kobo(total) : null,
    left: left === 1 ? "1 Slot left" : `${left} Slots left`,
    ratio: (() => {
      const offered =
        g.slots_offered ?? g.capacity ?? g.plan?.member_slot_capacity ?? null;
      if (!offered) return `${left} open`;
      const free = g.available_slots ?? g.open_slots ?? null;
      const occupied =
        g.occupied_slots ?? (free == null ? null : Math.max(0, offered - free));
      return occupied == null ? `${left} open` : `${occupied}/${offered}`;
    })(),
    /* The bar used to be pinned at 71% for every card because this was null
       and the component fell back to a hard-coded width. Fill it from the
       group's own slot numbers. */
    pct: (() => {
      const offered =
        g.slots_offered ?? g.capacity ?? g.plan?.member_slot_capacity ?? null;
      if (!offered) return null;
      const free = g.available_slots ?? g.open_slots ?? null;
      const occupied =
        g.occupied_slots ?? (free == null ? null : Math.max(0, offered - free));
      if (occupied == null) return null;
      return Math.round((occupied / offered) * 100);
    })(),
    linkTo: "/join/summary",
    linkState: { group_id: g.group_id || g.id, preview: g },
  };
}

function MarketplaceDesktop() {
  const services = useCatalogue();
  const [activePill, setActivePill] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [offers, setOffers] = useState(null);

  // Latest slots need a signed-in member; visitors keep the static cards.
  useEffect(() => {
    let on = true;
    (async () => {
      const { data, error } = await api("/member/dashboard");
      if (on) setOffers(error ? [] : (data?.available_groups || []).slice(0, 6).map(mapOffer));
    })();
    return () => {
      on = false;
    };
  }, []);

  const liveCards = services === null ? null : services.map(mapService);
  const loadingServices = services === null;
  const all = (liveCards || []).filter(
    (c) => activePill === "All" || (c.category || "").toLowerCase() === activePill.toLowerCase(),
  );
  const cards = showAll ? all : all.slice(0, 8);
  const loadingOffers = offers === null;
  return (
    <div className="mx-auto hidden max-w-[1440px] px-[20px] min-[1440px]:px-[100px] xl:block">
      {/* Search */}
      <Link
        to="/browse"
        className="mt-[88px] flex h-[80px] w-full items-start rounded-[15px] border-[2px] border-[#58A35B] bg-white text-left shadow-[2px_2px_7px_rgba(0,23,1,0.25)]"
      >
        <img src={iconSearch} alt="" className="mt-[22px] ml-[32px] h-[45px] w-[45px]" />
        <span className="mt-[27px] ml-[39px] text-[25px] font-semibold text-muted">
          Browse Subscription
        </span>
        <img src={iconChevron} alt="" className="mt-[20px] mr-[32px] ml-auto h-[50px] w-[50px]" />
      </Link>

      {/* Categories */}
      <h2 className="mt-[52px] text-[25px] font-semibold leading-[35px] text-ink">Categories</h2>
      <div className="scrollbar-none mt-[10px] flex justify-between gap-[18px] overflow-x-auto pb-2">
        {PILLS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setActivePill(p.label)}
            style={{ width: p.width }}
            className={`flex h-[60px] flex-none items-center justify-center rounded-[10px] text-[18px] font-semibold transition ${
              activePill === p.label
                ? "bg-btn text-mint"
                : "border border-clyse bg-mint text-ink hover:bg-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Available subscriptions */}
      <div className="mt-[110px] flex h-[63px] items-center">
        <h2 className="text-[35px] font-bold leading-[43px] text-ink">Available Subscription</h2>
      </div>
      {loadingServices ? (
        <div className="mt-[30px] grid grid-cols-4 gap-x-[27px] gap-y-[30px]" role="status" aria-label="Loading subscriptions">
          {Array.from({ length: 8 }, (_, i) => <Sk key={i} className="h-[290px] w-full !rounded-[20px]" />)}
        </div>
      ) : all.length === 0 ? (
        <p className="mt-[30px] text-[18px] font-semibold text-[#6B6B6B]">
          {activePill === "All"
            ? "No subscriptions available yet — check back soon."
            : "No subscriptions in this category yet."}
        </p>
      ) : (
        <div className="mt-[30px] grid grid-cols-4 gap-x-[27px] gap-y-[30px]">
          {cards.map((c) => (
            <ServiceCard key={c.title} {...c} />
          ))}
        </div>
      )}
      {all.length > 8 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-[30px] flex h-[50px] w-full items-center justify-center rounded-[5px] bg-[#D9EEDA] text-[18px] font-semibold text-ink transition hover:opacity-90"
        >
          {showAll ? "Show Less" : "View More"}
        </button>
      )}

      {/* Latest slots */}
      <div className="mt-[100px] flex h-[63px] items-center justify-center">
        <h2 className="text-center text-[35px] font-bold leading-[43px] text-ink">Latest Slots</h2>
      </div>
      {loadingOffers ? (
        <div className="mt-[30px] flex justify-center gap-[40px]" role="status" aria-label="Loading open slots">
          {Array.from({ length: 3 }, (_, i) => <Sk key={i} className="h-[360px] w-[308px] !rounded-[20px]" />)}
        </div>
      ) : offers.length === 0 ? (
        <p className="mt-[30px] text-center text-[18px] font-semibold text-[#6B6B6B]">
          No open slots right now — check back soon.
        </p>
      ) : (
        <>
          <div className="mt-[30px] flex justify-center gap-[40px]">
            {offers.slice(0, 3).map((o, i) => (
              <div key={`${o.name}-${i}`} className="w-[308px]">
                <GroupOfferCard g={o} />
              </div>
            ))}
          </div>
          {offers.length > 3 && (
            <div className="mt-[30px] flex justify-center gap-[40px]">
              {offers.slice(3, 6).map((o, i) => (
                <div key={`${o.name}-more-${i}`} className="w-[308px]">
                  <GroupOfferCard g={o} />
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Become an owner */}
      <div className="bg-mintband relative mt-[100px] h-[300px] rounded-[50px]">
        <div className="max-w-[536px] pt-[51px] pl-[40px]">
          <h2 className="text-[35px] font-bold leading-[43px] text-ink">Become an Owner</h2>
          <p className="mt-[30px] text-[25px] font-semibold leading-[35px] whitespace-nowrap text-ink">
            Save money by offering your subscription
          </p>
          <Link
            to="/create-group"
            className="bg-btn mt-[30px] flex h-[60px] w-[200px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-mint transition hover:opacity-90"
          >
            Create
          </Link>
        </div>
        <img
          loading="lazy" decoding="async" src={ctaOwner}
          alt=""
          className="absolute top-0 right-[40px] h-[300px] w-[387px]"
        />
      </div>
    </div>
  );
}

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="relative overflow-hidden">
        {/* Mobile marketplace (Figma 263:4402) */}
        <div className="relative z-[1] xl:hidden">
          <MobileBrowse />
        </div>
        {/* Desktop marketplace (redesigned) */}
        <div className="relative z-[1]">
          <MarketplaceDesktop />
        </div>
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
