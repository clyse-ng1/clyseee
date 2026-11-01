import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MobileSearch from "./MobileSearch";
import MobileCats from "./MobileCats";
import MobileCta from "./MobileCta";
import iconMovies from "../assets/icon-movies.svg";
import iconMusic from "../assets/icon-music.svg";
import iconProductivity from "../assets/icon-productivity.svg";
import iconUser from "../assets/icon-user.svg";
import avatar1 from "../assets/avatar-1.webp";
import avatar2 from "../assets/avatar-2.webp";
import avatar3 from "../assets/avatar-3.webp";
import { api, kobo } from "../lib/api";
import { useCatalogue } from "../lib/useCatalogue";

/* Mobile marketplace — Figma 263:4402 "Home Page Mobile" (430px): search /
   categories / 8 available-subscription cards / View More / 6 Latest Slots /
   Become an Owner CTA (footer rendered by the page's MobileFooter). */

const ICONS = { movies: iconMovies, music: iconMusic, productivity: iconProductivity };

const CARDS = [
  { icon: "movies", title: "Netflix Premium", chip: "Entertainment", price: "N2,000 /Month" },
  { icon: "music", title: "Apple Music", chip: "Music", price: "N1,500 /Month" },
  { icon: "productivity", title: "Canva Pro", chip: "Others", price: "N1,200 /Month" },
  { icon: "movies", title: "Dstv Stream", chip: "Entertainment", price: "N3,000 /Month" },
  { icon: "music", title: "Audiomack Premium", chip: "Music", price: "N1,000 /Month" },
  { icon: "movies", title: "Disney Plus", chip: "Entertainment", price: "N2,500 /Month" },
  { icon: "movies", title: "Netflix Basic", chip: "Entertainment", price: "N1,200 /Month" },
  { icon: "productivity", title: "Zoom Pro", chip: "Others", price: "N900 /Month" },
];

const OFFERS = [
  { avatar: avatar1, name: "Marcus" },
  { avatar: avatar2, name: "Davis" },
  { avatar: avatar1, name: "Marcus" },
  { avatar: avatar2, name: "Davis" },
  { avatar: avatar3, name: "Cooper" },
  { avatar: avatar3, name: "Cooper" },
];

function catIconKey(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("music")) return "music";
  if (c.includes("movie") || c.includes("stream") || c.includes("entertainment")) return "movies";
  return "productivity";
}

function OfferCard({ avatar, name, service, price, left, linkTo, linkState }) {
  return (
    <div>
      <img
        src={avatar || avatar1}
        alt=""
        className="relative z-10 mx-auto h-[72px] w-[72px] rounded-full border-2 border-mint object-cover shadow-[0_2.47px_2.47px_rgba(0,23,1,0.30)]"
      />
      <div className="bg-deep -mt-[36px] rounded-[12.36px] px-[19px] pt-[42px] pb-[17px]">
        <h3 className="text-center text-[15.45px] leading-[17.3px] font-bold text-white">
          {name}&rsquo;s Offer
        </h3>
        <p className="mt-[3px] text-center text-[8.03px] leading-[12.36px] text-white">
          <span className="font-semibold">Share a</span>{" "}
          <span className="font-bold">{service || "Netflix Premium"}</span>
        </p>
        <div className="mx-auto mt-[12px] h-px w-[153px] bg-[#B1DBB3]" />
        <div className="bg-contrib mt-[13px] h-[43px] rounded-[6.18px] pt-[6px]">
          <p className="text-center text-[6.18px] leading-[12.36px] font-semibold text-white">
            Your Contribution
          </p>
          <p className="flex items-baseline justify-center text-[15.45px] leading-[21.62px] font-semibold text-white">
            {price || "N2,000"}
            <span className="text-[6.18px] leading-[12.36px] font-semibold text-[#B1DBB3]">
              /Monthly
            </span>
          </p>
        </div>
        <div className="mt-[6px] h-[4px] overflow-hidden rounded-full bg-[#023F05]">
          <div className="h-full w-[71%] rounded-full bg-clyse" />
        </div>
        <div className="mt-[3px] flex items-center justify-between text-[8.03px] leading-[12.36px] font-semibold text-[#F1F8F2]">
          <span className="flex items-center gap-[3px]">
            <img src={iconUser} alt="" className="h-[7px] w-[7px]" />
            {left || "1 Slot left"}
          </span>
          <span>3/4</span>
        </div>
        <Link
          to={linkTo || "/join"}
          state={linkState}
          className="mt-[12px] flex h-[25px] w-full items-center justify-center rounded-[6.18px] bg-mintband text-[11.12px] leading-[13.56px] font-semibold text-ink transition hover:opacity-90"
        >
          Join Group
        </Link>
      </div>
    </div>
  );
}

export default function MobileBrowse() {
  const services = useCatalogue();
  const [showAll, setShowAll] = useState(false);
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    let on = true;
    (async () => {
      const { data, error } = await api("/member/dashboard");
      if (on && !error) {
        setOffers(
          (data?.available_groups || []).slice(0, 6).map((g) => {
            const left = g.open_slots ?? g.available_slots ?? 0;
            const first = g.creator?.first_name || "Creator";
            return {
              avatar: null,
              name: first,
              service:
                [g.service?.name, g.plan?.name].filter(Boolean).join(" ") ||
                "Subscription",
              price:
                g.plan?.total_price_kobo != null
                  ? kobo(g.plan.total_price_kobo)
                  : null,
              left: left === 1 ? "1 Slot left" : `${left} Slots left`,
              linkTo: "/join/summary",
              linkState: { group_id: g.group_id || g.id, preview: g },
            };
          }),
        );
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
          const plans = a.plans || [];
          const min = plans.reduce(
            (m, pl) => Math.min(m, pl.total_kobo ?? pl.total_price_kobo ?? Infinity),
            Infinity,
          );
          const cat = a.service?.category || "Others";
          return {
            icon: catIconKey(cat),
            title: a.service?.name || "Subscription",
            chip: cat,
            price: min !== Infinity ? `${kobo(min)} /Month` : "—",
          };
        });
  const all = liveCards || CARDS;
  const cards = showAll ? all : all.slice(0, 8);
  const fetchedOffers = offers !== null;
  const liveOffers = offers && offers.length ? offers : null;
  return (
    <div>
      <MobileSearch />
      <MobileCats />

      <h2 className="mt-[54px] ml-[26px] text-[22.56px] leading-[27.5px] font-bold text-ink">
        Available Subscription
      </h2>
      {all.length === 0 ? (
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
            <span className="bg-deep flex h-[48px] w-[48px] items-center justify-center rounded-full">
              <img src={ICONS[c.icon]} alt="" className="h-[32px] w-[32px]" />
            </span>
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
      {fetchedOffers && !liveOffers ? (
        <p className="mt-[19px] px-[13px] text-center text-[14px] font-semibold text-[#6B6B6B]">
          No open slots right now — check back soon.
        </p>
      ) : (
        <div className="mt-[19px] grid grid-cols-2 gap-x-[20px] gap-y-[12px] px-[13px]">
          {(liveOffers || OFFERS).map((o, i) => (
            <OfferCard key={`${o.name}-${i}`} {...o} />
          ))}
        </div>
      )}

      <MobileCta />
    </div>
  );
}
