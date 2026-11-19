import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LogoMarquee from "../components/LogoMarquee";
import { Footer, MobileFooter } from "../components/Footer";
import { useAuth } from "../lib/useAuth";
import { useCatalogue, matchService, pickPlan } from "../lib/useCatalogue";
import { kobo } from "../lib/api";
import ctaOwner from "../assets/cta-owner.webp";

/* Landing page REDESIGN — desktop Figma 875:34275 (1440x5435), mobile
   Figma 93:274 (430x7352). Sections: hero, brand marquee, How It Works
   (member + creator flows), Why Choose CLYSE?, FAQ accordion, footer.
   Copy fixes: "How It Work" -> "How It Works", "avail able" ->
   "available". FAQ answers are original (Figma holds YouWatch lorem). */

const MEMBER_FLOW = [
  {
    n: "01",
    title: "Choose Service",
    body: "Browse available subscriptions and choose your preferred service and plan that fits your needs.",
  },
  {
    n: "02",
    title: "Join Group",
    body: "Find an available group with open slots and join, or join a waitlist if no suitable group is available.",
  },
  {
    n: "03",
    title: "Pay & Access",
    body: "Pay securely through your CLYSE Wallet, receive your access details, and enjoy your subscription.",
  },
];

const CREATOR_FLOW = [
  {
    n: "01",
    title: "Choose Subscription",
    body: "Select your active subscription and plan, then specify how many available slots you want to share with others.",
  },
  {
    n: "02",
    title: "Create & Verify Group",
    body: "Set your group\u2019s access method and visibility, then submit proof of your active subscription for verification.",
  },
  {
    n: "03",
    title: "Share Access & Earn",
    body: "Once your group is approved, welcome Members, provide their access details, and receive your earnings when eligible for payout.",
  },
];

function WalletGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="3" fill={color} />
      <rect x="13.5" y="10.5" width="5" height="3.2" rx="1" fill="#FFFFFF" />
      <rect
        x="3"
        y="6.5"
        width="18"
        height="12"
        rx="2.5"
        stroke={color}
        strokeWidth="1.8"
      />
      <path
        d="M3 10h18M16.5 14.5h.01"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DollarGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} />
      <path d="M12 6.8v10.4M14.7 9.2c-.5-.9-1.5-1.4-2.7-1.4-1.5 0-2.7.9-2.7 2.1 0 2.8 5.5 1.7 5.5 4.5 0 1.3-1.2 2.1-2.8 2.1-1.4 0-2.5-.6-3-1.6" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <path
        d="M12 7.5v9M14.5 9.5c-.6-1-1.5-1.3-2.5-1.3-1.4 0-2.5.9-2.5 2.1 0 2.9 5 1.4 5 4.3 0 1.2-1.1 2.1-2.5 2.1-1 0-1.9-.4-2.5-1.3"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l7 2.8v5.6c0 4.4-2.9 7.7-7 9.1-4.1-1.4-7-4.7-7-9.1V5.8L12 3z" fill={color} />
      <path d="M9 11.8l2.2 2.2 4.3-4.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8 7.5 10 4.3-2 7.5-5.4 7.5-10v-6L12 2.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9 11.5 2.2 2.2L15.5 9.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill={color} />
      <path
        d="m8.5 12.2 2.5 2.5 4.8-5.4"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="7" height="7" rx="2" fill={color} />
      <rect x="13" y="4" width="7" height="7" rx="2" fill={color} />
      <rect x="4" y="13" width="7" height="7" rx="2" fill={color} />
      <rect x="13" y="13" width="7" height="7" rx="2" fill={color} />
    </svg>
  );
}

function HeadsetGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="5.5" width="17" height="13" rx="3" fill={color} />
      <path d="M7 10h6M7 13.5h10" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="3.5"
        y="13"
        width="4.5"
        height="6"
        rx="2"
        stroke={color}
        strokeWidth="1.8"
      />
      <rect
        x="16"
        y="13"
        width="4.5"
        height="6"
        rx="2"
        stroke={color}
        strokeWidth="1.8"
      />
    </svg>
  );
}

const WHY = [
  {
    bg: "bg-[#FFEBDF]",
    glyph: <WalletGlyph color="#CB5300" />,
    title: "Affordable Access",
    body: "Join available subscription groups and enjoy your favorite services without paying the full cost alone.",
  },
  {
    bg: "bg-[#EEDFFF]",
    glyph: <DollarGlyph color="#6A5ACD" />,
    title: "Earn From Unused Slots",
    lines: ["Earn From", "Unused Slots"],
    body: "Share available slots in your active subscriptions and earn when Members join your group.",
  },
  {
    bg: "bg-[#FFEFDF]",
    glyph: <ShieldGlyph color="#CB5300" />,
    title: "Secure Payments",
    body: "Manage your subscription payments through your CLYSE Wallet, with clear transaction records.",
  },
  {
    bg: "bg-[#DFFFE0]",
    glyph: <CheckGlyph color="#048B0B" />,
    title: "Verified Groups",
    body: "Subscription groups go through verification to help build trust between Creators and Members.",
  },
  {
    bg: "bg-[#E9DFFF]",
    glyph: <GridGlyph color="#6A5ACD" />,
    title: "Simple Management",
    lines: ["Simple", "Management"],
    body: "Manage your groups, access details, payments, and subscription activity from one place.",
  },
  {
    bg: "bg-[#FFDFEB]",
    glyph: <HeadsetGlyph color="#E31B00" />,
    title: "Support When You Need It",
    lines: ["Support When", "You Need It"],
    body: "Report access problems and raise disputes through CLYSE when something goes wrong.",
  },
];

const FAQ_DESKTOP = [
  {
    q: "What is CLYSE, and how does it work?",
    a: "CLYSE is a cost-sharing platform that lets you share premium subscriptions with friends, family and other members. Creators open groups for services they pay for, Members join open slots and pay their share securely through the CLYSE Wallet, and everyone enjoys full access at a fraction of the full price.",
  },
  {
    q: "How can I join a subscription group?",
    a: "Browse available groups, pick the service and plan you want, then pay your share securely to get your access details instantly. If no group is open for a service, you can join the waitlist and we\u2019ll notify you when a slot frees up.",
  },
  {
    q: "How can I become a Creator on CLYSE?",
    a: "Create a group in minutes: choose your active subscription, set how many slots to share, pick your access method and visibility, then submit proof of your subscription for verification. Once approved, Members can join and you start earning.",
  },
  {
    q: "How much does it cost to join a subscription group?",
    a: "You only pay your share of the subscription \u2014 often up to 75% less than the full price. The exact amount depends on the service, the plan and the number of slots in the group, and it\u2019s always shown before you pay.",
  },
  {
    q: "What happens if no subscription group is available?",
    a: "Join the waitlist for that service and we\u2019ll notify you as soon as a slot opens. You can also suggest the service or create your own group as a Creator.",
  },
  {
    q: "What happens if I experience a problem with my subscription access?",
    a: "Report it from your subscription in a few taps and our team will step in. Groups go through verification and payments stay protected while disputes are resolved.",
  },
];

const FAQ_MOBILE = [
  FAQ_DESKTOP[0],
  FAQ_DESKTOP[1],
  FAQ_DESKTOP[2],
  {
    q: "How do I pay for a subscription on CLYSE?",
    a: "Fund your CLYSE Wallet with a card or bank transfer, then pay your share in one tap. Every payment is recorded with a clear transaction history you can review anytime.",
  },
  FAQ_DESKTOP[4],
  FAQ_DESKTOP[5],
];

function PlusIcon({ open }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path
        d={open ? "M6 14h16" : "M14 6v16M6 14h16"}
        stroke="#001701"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FlowCard({ n, title, body, odd, mobile = false }) {
  return (
    <div
      className={`rounded-[30px] border border-white/40 ${odd ? "bg-[#d9d9d9]/[0.02]" : "bg-[#d9d9d9]/20"} ${
        mobile
          ? "h-[380px] px-[30px] pt-[83px]"
          : "h-[380px] px-[30px] pt-[70px]"
      }`}
    >
      <span
        className={`mx-auto grid h-[80px] w-[80px] place-items-center rounded-[15px] text-[40px] leading-[49px] font-bold ${
          odd ? "bg-[#F1F8F1] text-[#013104]" : "bg-clyse text-white"
        }`}
      >
        {n}
      </span>
      <h3
        className={`text-center font-bold text-white ${
          mobile
            ? "mt-[25px] text-[20px] leading-[24px]"
            : "mt-[26px] text-[35px] leading-[43px]"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-center font-semibold text-white ${
          mobile
            ? "mt-[25px] text-[14px] leading-[20px]"
            : "mt-[20px] text-[18px] leading-[22px]"
        }`}
      >
        {body}
      </p>
    </div>
  );
}

function FlowBlock({ label, cards, mobile = false }) {
  return (
    <div>
      <div
        className={`flex items-center justify-center rounded-[20px] border border-white bg-clyse/20 font-bold text-white ${
          mobile
            ? "h-[64px] text-[20px]"
            : "h-[81px] text-[35px] leading-[43px]"
        }`}
      >
        {label}
      </div>
      <div
        className={
          mobile
            ? "mt-[30px] flex flex-col gap-[30px]"
            : "mt-[40px] grid grid-cols-3 gap-[30px]"
        }
      >
        {cards.map((c, i) => (
          <FlowCard key={c.title} {...c} odd={i % 2 === 0} mobile={mobile} />
        ))}
      </div>
    </div>
  );
}

function Faq({ items, mobile = false }) {
  const [open, setOpen] = useState(null);
  return (
    <div
      className={mobile ? "flex flex-col gap-[8px]" : "flex flex-col gap-[7px]"}
    >
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center bg-[#B1DBB3] text-left font-semibold text-ink ${
                mobile
                  ? "min-h-[60px] px-[20px] py-[14px] text-[16px]"
                  : "h-[99px] px-[28px] text-[27px]"
              } ${i >= 4 && mobile ? "max-xl:text-[14px]" : ""}`}
            >
              <span className="flex-1">{f.q}</span>
              <span className="ml-[16px] flex-none">
                <PlusIcon open={isOpen} />
              </span>
            </button>
            {isOpen && (
              <div
                className={`border border-t-0 border-clyse bg-white shadow-[0_16px_30px_rgba(0,23,1,0.12)] font-semibold text-ink ${
                  mobile
                    ? "px-[20px] py-[16px] text-[14px] leading-[22px]"
                    : "px-[28px] py-[24px] text-[20px] leading-[30px]"
                }`}
              >
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

const SAVINGS_SERVICES = [
  { label: "Netflix", key: "netflix" },
  { label: "Spotify", key: "spotify" },
  { label: "Youtube", key: "youtube-premium" },
  { label: "Canva Pro", key: "canva-pro" },
  { label: "Nord VPN", key: "nordvpn" },
  { label: "Prime Video", key: "prime-video" },
  { label: "CapCut", key: "capcut-pro" },
  { label: "Adobe", key: "adobe-creative-cloud" },
  { label: "Cloud", key: "cloud" },
];

function SavingsCalculator() {
  const catalogue = useCatalogue();
  const [selected, setSelected] = useState([]);
  const availablePrices = SAVINGS_SERVICES.map((service) => {
    const entry = matchService(catalogue || [], service.key);
    const plan = pickPlan(entry);
    if (!plan) return { ...service, monthlyKobo: null };
    const totalKobo = Number(plan.total_kobo ?? plan.total_price_kobo ?? plan.unit_price_kobo);
    const months = Math.max(1, Number(plan.billing_interval_months) || 1);
    return { ...service, monthlyKobo: Number.isFinite(totalKobo) ? totalKobo / months : null };
  });
  const pricedSelected = availablePrices.filter((service) => selected.includes(service.label) && service.monthlyKobo != null);
  const withClyseKobo = pricedSelected.reduce((sum, service) => sum + service.monthlyKobo, 0);
  // The public catalogue provides CLYSE group prices, but not retail subscription
  // prices. Show the Figma's 75%-saving scenario as an estimate, not an asserted
  // retail comparison, until original retail prices are available from the API.
  const normalKobo = withClyseKobo * 4;
  const savedKobo = normalKobo - withClyseKobo;
  const toggle = (service) => setSelected((current) =>
    current.includes(service) ? current.filter((item) => item !== service) : [...current, service]
  );

  return (
    <section className="mx-auto mt-[60px] w-full max-w-[1240px] px-[20px] xl:mt-[100px] min-[1440px]:px-0">
      <div className="overflow-hidden rounded-[24px] border border-[#D3D3D3] xl:rounded-[30px]">
        <div className="flex flex-wrap items-center justify-between gap-[18px] bg-[#048B0B] px-[22px] py-[20px] text-white xl:px-[36px] xl:py-[24px]">
          <div>
            <p className="text-[13px] leading-[18px] xl:text-[16px]">Interactive Calculator</p>
            <h2 className="text-[20px] leading-[26px] font-semibold xl:text-[25px] xl:leading-[32px]">Calculate your savings</h2>
          </div>
          <Link to="/signup" className="flex h-[46px] items-center justify-center rounded-[12px] bg-white px-[22px] text-[15px] font-semibold text-ink hover:bg-[#F1F8F1] xl:h-[55px] xl:px-[28px] xl:text-[18px]">
            Start Savings
          </Link>
        </div>
        <div className="grid gap-[24px] bg-white p-[20px] xl:grid-cols-[1fr_360px] xl:gap-[30px] xl:p-[36px]">
          <div>
            <h3 className="mb-[15px] text-[14px] font-semibold text-ink xl:text-[17px]">Select your subscriptions</h3>
            <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3 xl:max-w-[600px]">
              {SAVINGS_SERVICES.map((service) => {
                const active = selected.includes(service.label);
                const hasPrice = availablePrices.find((item) => item.label === service.label)?.monthlyKobo != null;
                return <button key={service.label} type="button" aria-pressed={active} onClick={() => toggle(service.label)} className={`min-h-[38px] rounded-full px-[12px] text-[13px] font-semibold transition xl:text-[15px] ${active ? "bg-[#E8E8E8] text-ink" : "border border-[#D0D0D0] bg-white text-[#666]"}`}>
                  {service.label}{catalogue !== null && !hasPrice ? " · unavailable" : ""}
                </button>;
              })}
            </div>
          </div>
          <div className="rounded-[18px] border border-[#D0D0D0] p-[18px] xl:p-[20px]">
            <h3 className="mb-[14px] text-[14px] font-bold tracking-[0.14em] text-ink xl:text-[16px]">SUMMARY</h3>
            <div className="flex justify-between gap-3 text-[13px] xl:text-[15px]"><span>Normal Price <small className="text-[#777]">(est.)</small></span><strong className="text-right">{catalogue === null ? "Loading…" : selected.length === 0 ? "Select subscriptions" : pricedSelected.length ? kobo(normalKobo) : "—"}</strong></div>
            <div className="mt-[8px] flex justify-between gap-3 text-[13px] xl:text-[15px]"><span>With Clyse</span><strong className="text-right text-[#048B0B]">{catalogue === null ? "Loading…" : selected.length === 0 ? "Select subscriptions" : pricedSelected.length ? kobo(withClyseKobo) : "—"}</strong></div>
            <div className="my-[14px] border-t border-[#BDBDBD]" />
            <p className="text-[12px] text-[#555]">You save</p>
            <div className="mt-[3px] flex flex-wrap items-baseline justify-between gap-2 text-[14px] font-bold text-[#048B0B]">
              {selected.length === 0 ? <span className="w-full text-center text-[12px] font-semibold text-[#777]">Select subscriptions to see savings</span> : <><span>{catalogue === null || !pricedSelected.length ? "—" : kobo(savedKobo)} <small className="font-normal text-ink">/mth</small></span><span>{catalogue === null || !pricedSelected.length ? "—" : kobo(savedKobo * 12)} <small className="font-normal text-ink">/yr</small></span></>}
            </div>
            {selected.length > 0 && <p className="mt-[7px] text-[12px] font-semibold text-[#048B0B]">Illustrative savings at 75% off</p>}
            <p className="mt-[10px] text-[10px] leading-[14px] text-[#777]">{selected.length === 0 ? "Select one or more subscriptions to see an estimate." : `CLYSE prices load from the live catalogue. The catalogue does not include retail prices, so the normal price and savings are an estimate using the design’s 75% example. ${catalogue !== null ? `${pricedSelected.length} of ${selected.length} selected services have current prices.` : ""}`}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const COMMUNITY_STATS = [
  { value: "2,400+", label: "Member", icon: "people" },
  { value: "180+", label: "Verified Creators", icon: "shield" },
  { value: "500+", label: "Active Groups", icon: "grid" },
  { value: "95%", mobileValue: "180+", label: "Successful Access", icon: "bolt" },
];

function CommunityIcon({ type }) {
  if (type === "people") return <svg viewBox="0 0 24 24" className="h-[24px] w-[24px] fill-[#048B0B]" aria-hidden="true"><circle cx="8" cy="8" r="4"/><circle cx="17" cy="9" r="3"/><path d="M1 20c0-4 3-7 7-7s7 3 7 7v1H1zm14-6c4-.8 8 2 8 6v1h-6v-1c0-2.4-.7-4.5-2-6z"/></svg>;
  if (type === "shield") return <svg viewBox="0 0 24 24" className="h-[24px] w-[24px] fill-[#048B0B]" aria-hidden="true"><path d="M12 1 22 5v6c0 6-4 10-10 12C6 21 2 17 2 11V5zm-1 14 7-7-1.5-1.5L11 12l-2.5-2.5L7 11z"/></svg>;
  if (type === "grid") return <svg viewBox="0 0 24 24" className="h-[24px] w-[24px] fill-[#048B0B]" aria-hidden="true"><rect x="2" y="2" width="8" height="8" rx="2"/><rect x="14" y="2" width="8" height="8" rx="2"/><rect x="2" y="14" width="8" height="8" rx="2"/><rect x="14" y="14" width="8" height="8" rx="2"/></svg>;
  return <svg viewBox="0 0 24 24" className="h-[26px] w-[26px] fill-[#048B0B]" aria-hidden="true"><path d="M13 1 3 14h7l-1 9 12-15h-8z"/></svg>;
}

function GrowingTogether() {
  return <section className="mx-auto mt-[50px] w-full max-w-[1240px] bg-[#E5FFE6] px-[20px] py-[28px] xl:mt-[80px] xl:px-[36px] xl:py-[40px] min-[1440px]:rounded-[0px]">
    <h2 className="text-center text-[19px] leading-[25px] font-bold text-ink xl:text-[25px] xl:leading-[32px]">Growing Together with <span className="text-[#048B0B]">CLYSE</span></h2>
    <p className="mt-[5px] text-center text-[13px] leading-[19px] text-ink xl:text-[17px] xl:leading-[24px]">A thriving community of users, creators and subscription lovers.</p>
    <div className="mt-[24px] grid grid-cols-2 xl:mt-[38px] xl:grid-cols-4">
      {COMMUNITY_STATS.map((item, index) => <div key={item.label} className={`flex min-h-[50px] items-center justify-center gap-[8px] px-[7px] xl:gap-[12px] ${index % 2 === 0 ? "border-r border-[#9AB19E]" : ""} ${index < 2 ? "pb-[8px]" : "pt-[8px]"} xl:border-r xl:border-[#9AB19E] xl:py-0 xl:last:border-r-0`}>
        <CommunityIcon type={item.icon}/><div className="min-w-0"><strong className="block whitespace-nowrap text-[14px] leading-[17px] font-bold text-ink xl:text-[21px] xl:leading-[25px]"><span className="xl:hidden">{item.mobileValue || item.value}</span><span className="hidden xl:inline">{item.value}</span></strong><span className="block text-[10px] leading-[13px] text-ink xl:text-[14px] xl:leading-[18px]">{item.label}</span></div>
      </div>)}
    </div>
  </section>;
}

function OwnerCallout() {
  return <section className="mx-[20px] mt-[40px] xl:mx-auto xl:mt-[45px] xl:max-w-[1240px]">
    <div className="relative h-[320px] overflow-hidden rounded-[20px] bg-[linear-gradient(110deg,#F5FFF5_0%,#E5FFE8_100%)] px-[20px] pt-[20px] text-center xl:flex xl:h-[250px] xl:items-center xl:rounded-[28px] xl:px-[42px] xl:pt-0 xl:text-left">
      <div className="relative z-10 xl:w-[52%]">
        <h2 className="text-[20px] leading-[25px] font-bold text-ink xl:text-[35px] xl:leading-[43px]">Become an Owner</h2>
        <p className="mt-[10px] text-[14px] leading-[20px] font-semibold text-ink xl:text-[20px] xl:leading-[26px]">Save money by offering your subscription</p>
        <Link to="/create-group" className="mx-auto mt-[18px] flex h-[44px] w-[155px] items-center justify-center rounded-[9px] bg-[#001701] text-[14px] font-semibold text-white hover:opacity-90 xl:mx-0 xl:mt-[24px]">Create</Link>
      </div>
      <img loading="lazy" decoding="async" src={ctaOwner} alt="Creator wearing a VR headset surrounded by subscription service icons" className="pointer-events-none absolute right-0 bottom-[-14px] w-[270px] xl:right-[8px] xl:bottom-[-8px] xl:w-[480px]" />
    </div>
  </section>;
}

export default function Landing() {
  const { user } = useAuth();
  // Signed-in members never see the marketing page (and its footer).
  if (user) return <Navigate to="/browse" replace />;
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar landing />
      {/* Desktop hero */}
      <section className="relative hidden overflow-hidden xl:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 420px at 50% 0%, rgba(215,255,217,0.9), rgba(255,255,255,0) 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1440px] px-[20px] min-[1440px]:px-[100px] pt-[122px] pb-[120px] text-center">
          <h1 className="mx-auto max-w-[1054px] text-[80px] leading-[97.5px] font-bold tracking-[-4px] text-ink">
            Cut up to <span className="text-clyse">75%</span> off the
            <br />
            price of your subscriptions
          </h1>
          <p className="mx-auto mt-[30px] max-w-[1054px] text-[25px] leading-[35px] font-semibold text-[#6B6B6B]">
            Clyse helps you share premium subscriptions with friends and family.
            Create groups, split costs, and get access instantly.
          </p>
          <div className="mt-[70px] flex justify-center">
            <Link
              to="/signup"
              className="bg-btn flex h-[60px] w-[200px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-mint transition hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile hero */}
      <section className="relative overflow-hidden xl:hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(420px 260px at 50% 0%, rgba(215,255,217,0.9), rgba(255,255,255,0) 70%)",
          }}
        />
        <div className="relative px-[20px] pt-[60px] pb-[50px] text-center">
          <h1 className="text-[30px] leading-[37px] font-bold text-ink">
            Cut up to <span className="text-clyse">75%</span> off the
            <br />
            price of your subscriptions
          </h1>
          <p className="mx-auto mt-[10px] max-w-[390px] text-[14px] leading-[20px] font-semibold text-[#6B6B6B]">
            Clyse helps you share premium subscriptions with friends and family.
            Create groups, split costs, and get access instantly.
          </p>
          <div className="mx-auto mt-[40px] flex max-w-[340px] justify-center gap-[30px]">
            <Link
              to="/create-group"
              className="bg-btn flex h-[50px] w-[155px] items-center justify-center rounded-[10px] text-[14px] font-semibold text-mint transition hover:opacity-90"
            >
              Create Group
            </Link>
            <Link
              to="/join"
              className="flex h-[50px] w-[155px] items-center justify-center rounded-[10px] border border-clyse bg-mint text-[14px] font-semibold text-ink transition hover:bg-white"
            >
              Join Group
            </Link>
          </div>
        </div>
      </section>

      <LogoMarquee boxed />

      {/* Desktop How It Works */}
      <section
        id="how-it-works"
        className="mx-auto hidden max-w-[1440px] scroll-mt-[20px] px-[20px] min-[1440px]:px-[100px] xl:block"
      >
        <h2 className="mt-[100px] text-center text-[35px] leading-[43px] font-bold text-ink">
          How It Works
        </h2>
        <p className="mx-auto mt-[10px] max-w-[1040px] text-center text-[25px] leading-[35px] font-semibold text-ink">
          Getting access to your favorite subscriptions is simple. Choose a
          service, join an available group, and pay securely through CLYSE to
          enjoy your subscription.
        </p>
      </section>

      {/* Desktop flows */}
      <section className="bg-deep relative mt-[155px] hidden overflow-hidden xl:block">
        <div className="relative mx-auto max-w-[1440px] space-y-[100px] px-[20px] min-[1440px]:px-[100px] py-[100px]">
          <FlowBlock label="Member Flow" cards={MEMBER_FLOW} />
          <FlowBlock label="Creator Flow" cards={CREATOR_FLOW} />
        </div>
      </section>

      {/* Mobile How + flows */}
      <section
        id="how-it-works-m"
        className="scroll-mt-[20px] px-[30px] xl:hidden"
      >
        <h2 className="mt-[60px] text-center text-[30px] leading-[37px] font-bold text-ink">
          How It Works
        </h2>
        <p className="mx-auto mt-[10px] max-w-[370px] text-center text-[16px] leading-[22px] font-semibold text-ink">
          Getting access to your favorite subscriptions is simple. Choose a
          service, join an available group, and pay securely through CLYSE to
          enjoy your subscription.
        </p>
      </section>
      <section className="bg-deep relative mt-[60px] xl:hidden">
        <div className="relative space-y-[60px] px-[30px] py-[60px]">
          <FlowBlock label="Member Flow" cards={MEMBER_FLOW} mobile />
          <FlowBlock label="Creator Flow" cards={CREATOR_FLOW} mobile />
        </div>
      </section>

      <SavingsCalculator />

      {/* Desktop Why */}
      <section
        id="why-clyse"
        className="mx-auto hidden max-w-[1440px] scroll-mt-[20px] px-[20px] min-[1440px]:px-[100px] xl:block"
      >
        <h2 className="mt-[100px] text-center text-[35px] leading-[43px] font-bold text-ink">
          Why Choose CLYSE?
        </h2>
        <p className="mx-auto mt-[10px] max-w-[841px] text-center text-[25px] leading-[35px] font-semibold text-ink">
          Enjoy your favorite subscriptions for less by joining available
          groups, or share unused subscription slots and earn from them. CLYSE
          makes subscription sharing easier with secure payments, verified
          groups, and a simple way to manage your access.
        </p>
        <div className="mt-[100px] overflow-hidden rounded-[40px] border border-[#999999]">
          <div className="grid grid-cols-3 divide-x divide-[#999999]">
            {WHY.slice(0, 3).map((w) => (
              <div
                key={w.title}
                className="flex h-[364px] flex-col items-center px-[36px] pt-[64px]"
              >
                <span
                  className={`grid h-[79px] w-[80px] place-items-center rounded-[11px] ${w.bg} opacity-80`}
                >
                  {w.glyph}
                </span>
                <h3 className="mt-[32px] text-center text-[35px] leading-[43px] font-bold text-ink">
                  {w.lines
                    ? w.lines.map((t, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {t}
                        </span>
                      ))
                    : w.title}
                </h3>
                <p className="mt-[20px] text-center text-[18px] leading-[25px] font-semibold text-ink">
                  {w.body}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#999999] border-t border-[#999999]">
            {WHY.slice(3).map((w) => (
              <div
                key={w.title}
                className="flex h-[364px] flex-col items-center px-[36px] pt-[64px]"
              >
                <span
                  className={`grid h-[79px] w-[80px] place-items-center rounded-[11px] ${w.bg} opacity-80`}
                >
                  {w.glyph}
                </span>
                <h3 className="mt-[32px] text-center text-[35px] leading-[43px] font-bold text-ink">
                  {w.lines
                    ? w.lines.map((t, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {t}
                        </span>
                      ))
                    : w.title}
                </h3>
                <p className="mt-[20px] text-center text-[18px] leading-[25px] font-semibold text-ink">
                  {w.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Why */}
      <section
        id="why-clyse-m"
        className="scroll-mt-[20px] px-[30px] xl:hidden"
      >
        <h2 className="mt-[60px] text-center text-[20px] leading-[24px] font-bold text-ink">
          Why Choose CLYSE?
        </h2>
        <p className="mx-auto mt-[10px] max-w-[370px] text-center text-[16px] leading-[22px] font-semibold text-ink">
          Enjoy your favorite subscriptions for less by joining available
          groups, or share unused subscription slots and earn from them. CLYSE
          makes subscription sharing easier with secure payments, verified
          groups, and a simple way to manage your access.
        </p>
        <div className="mt-[40px] overflow-hidden rounded-[24px] border border-[#999999] divide-y divide-[#999999]">
          {WHY.map((w) => (
            <div
              key={w.title}
              className="flex h-[364px] flex-col items-center px-[40px] pt-[81px]"
            >
              <span
                className={`grid h-[79px] w-[80px] place-items-center rounded-[11px] opacity-80 ${w.bg}`}
              >
                {w.glyph}
              </span>
              <h3 className="mt-[20px] text-center text-[20px] leading-[24px] font-bold text-ink">
                {w.title}
              </h3>
              <p className="mt-[12px] text-center text-[14px] leading-[20px] font-semibold text-ink">
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <GrowingTogether />
      <div className="xl:hidden"><OwnerCallout /></div>

      {/* Desktop FAQ */}
      <section className="mx-auto hidden max-w-[1440px] px-[20px] min-[1440px]:px-[100px] xl:block">
        <h2 className="mt-[155px] text-[35px] leading-[43px] font-bold text-ink">
          Frequently Asked Questions
        </h2>
        <div className="mt-[50px]">
          <Faq items={FAQ_DESKTOP} />
        </div>
      </section>

      <div className="hidden xl:block"><OwnerCallout /></div>

      {/* Mobile FAQ */}
      <section className="mt-[60px] xl:hidden">
        <h2 className="px-[30px] text-[20px] leading-[24px] font-bold text-ink">
          Frequently Asked Questions
        </h2>
        <div className="mt-[24px]">
          <Faq items={FAQ_MOBILE} mobile />
        </div>
      </section>

      <Footer mt="mt-[40px]" />
      <MobileFooter />
    </div>
  );
}
