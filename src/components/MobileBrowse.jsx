import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MobileSearch from "./MobileSearch";
import MobileCats from "./MobileCats";
import MobileCta from "./MobileCta";
import Sk from "./Skeleton";
import BrandTile from "./BrandTile";
import GroupOfferCard from "./GroupOfferCard";
import { brandOf, titleCase } from "../lib/api";
import iconUser from "../assets/icon-user.svg";
import avatarAccount from "../assets/avatar-account.webp";
import { api, kobo, totalPriceKobo } from "../lib/api";
import { useCatalogue } from "../lib/useCatalogue";

/* Mobile marketplace — Figma 263:4402 "Home Page Mobile" (430px): search /
   categories / 8 available-subscription cards / View More / 6 Latest Slots /
   Become an Owner CTA (footer rendered by the page's MobileFooter). */

export default function MobileBrowse() {
  const services = useCatalogue();
  const [showAll, setShowAll] = useState(false);
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    let on = true;
    (async () => {
      const { data, error } = await api("/member/dashboard");
      if (on) {
        setOffers(error ? [] : (data?.available_groups || []).slice(0, 6).map((g) => {
            const left = g.open_slots ?? g.available_slots ?? 0;
            const total = totalPriceKobo(g);
            const first = g.creator?.first_name || "Creator";
            const offered = g.slots_offered ?? g.capacity ?? g.plan?.member_slot_capacity ?? 0;
            const occupied = g.occupied_slots ?? (offered ? Math.max(0, offered - left) : 0);
            return {
              avatar: null,
              name: first,
              service:
                [g.service?.name, g.plan?.name].filter(Boolean).join(" ") ||
                "Subscription",
              price: total != null ? kobo(total) : null,
              left: left === 1 ? "1 Slot left" : `${left} Slots left`,
              ratio: offered ? `${occupied}/${offered}` : `${left} open`,
              pct: offered ? Math.min(100, Math.round((occupied / offered) * 100)) : 0,
              access: (g.access_method || "").replaceAll("_", " ") || undefined,
              linkTo: "/join/plan",
              linkState: { group_id: g.group_id || g.id, preview: g },
            };
          }));
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  const liveCards =
    services === null
      ? null
      : services.map((a) => {
          const service = a.service || a;
          const plans = a.plans || a.catalogue_plans || [];
          const min = plans.reduce(
            (m, pl) => Math.min(m, pl.total_kobo ?? pl.total_price_kobo ?? Infinity),
            Infinity,
          );
          const cat = service.category || "Others";
          return {
            brand: brandOf(service),
            title: service.name || "Subscription",
            category: cat,
            chip: titleCase(cat),
            price: min !== Infinity ? `${kobo(min)} /Month` : "—",
          };
        });
  const all = liveCards || [];
  const loadingServices = services === null;
  const cards = showAll ? all : all.slice(0, 8);
  const liveOffers = offers && offers.length ? offers : null;
  const loadingOffers = offers === null;
  return (
    <div>
      <MobileSearch />
      <MobileCats />

      <h2 className="mt-[54px] ml-[26px] text-[22.56px] leading-[27.5px] font-bold text-ink">
        Available Subscription
      </h2>
      {loadingServices ? (
        <div className="mt-[26px] grid grid-cols-2 gap-x-[18px] gap-y-[15px] px-[19px]" role="status" aria-label="Loading subscriptions">
          {Array.from({ length: 8 }, (_, i) => <Sk key={i} className="h-[187px] w-full !rounded-[12px]" />)}
        </div>
      ) : all.length === 0 ? (
        <p className="mt-[26px] px-[19px] text-center text-[14px] font-semibold text-[#6B6B6B]">
          No subscriptions available yet — check back soon.
        </p>
      ) : (
      <div className="mt-[26px] grid grid-cols-2 gap-x-[18px] gap-y-[15px] px-[19px]">
        {cards.map((c) => (
          <Link
            key={c.title}
            to="/subscription-group"
            className="bg-mintfade flex h-[187px] flex-col items-center rounded-[12.89px] border-[0.5px] border-clyse pt-[17px] shadow-[0_0_12.89px_rgba(0,23,1,0.10)] transition hover:opacity-95"
          >
            <BrandTile brand={c.brand} name={c.title} category={c.category} size={50} plain />
            <span className="mt-[7px] max-w-[129px] text-center text-[16.12px] leading-[18.05px] font-semibold text-ink">
              {c.title}
            </span>
            <span className="mt-[3px] flex h-[13px] items-center rounded-[2.3px] bg-[#B1DBB3] px-[5px] text-[6.45px] leading-[13px] font-semibold text-ink">
              {c.chip}
            </span>
            <span className="mt-[9px] h-[3px] w-[47px] rounded-full bg-clyse" />
            <span className="mt-[9px] text-[11.6px] leading-[14.15px] font-semibold text-ink">
              {c.price}
            </span>
          </Link>
        ))}
      </div>
      )}
      {all.length > 8 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mx-[19px] mt-[19px] flex h-[32px] w-[calc(100%-38px)] items-center justify-center rounded-[3.22px] bg-[#D9EEDA] text-[11.6px] leading-[14.15px] font-semibold text-ink"
        >
          {showAll ? "Show Less" : "View More"}
        </button>
      )}

      <h2 className="mt-[50px] text-center text-[21.62px] leading-[26.36px] font-bold text-ink">
        Latest Slots
      </h2>
      {loadingOffers ? (
        <div className="mt-[19px] grid grid-cols-2 gap-x-[17.2px] gap-y-[16.5px] px-[13px]" role="status" aria-label="Loading open slots">
          {Array.from({ length: 4 }, (_, i) => <Sk key={i} className="h-[210px] w-full !rounded-[12px]" />)}
        </div>
      ) : !liveOffers ? (
        <p className="mt-[19px] px-[13px] text-center text-[14px] font-semibold text-[#6B6B6B]">
          No open slots right now — check back soon.
        </p>
      ) : (
        <div className="mt-[19px] grid grid-cols-2 gap-x-[17.2px] gap-y-[16.5px] px-[13px]">
          {liveOffers.map((o, i) => (
            <GroupOfferCard key={`${o.name}-${i}`} g={{ ...o, name: `${o.name}\u2019s Offer` }} />
          ))}
        </div>
      )}

      <MobileCta />
    </div>
  );
}
