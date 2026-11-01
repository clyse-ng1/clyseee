import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import LogoMarquee from "../components/LogoMarquee";
import { Footer, MobileFooter } from "../components/Footer";

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
      <rect x="3" y="6.5" width="18" height="12" rx="2.5" stroke={color} strokeWidth="1.8" />
      <path d="M3 10h18M16.5 14.5h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function DollarGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
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
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <path
        d="m8.5 12.2 2.5 2.5 4.8-5.4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GridGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
    </svg>
  );
}

function HeadsetGlyph({ color }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 13.5v-2a7.5 7.5 0 0 1 15 0v2"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="3.5" y="13" width="4.5" height="6" rx="2" stroke={color} strokeWidth="1.8" />
      <rect x="16" y="13" width="4.5" height="6" rx="2" stroke={color} strokeWidth="1.8" />
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
    body: "Manage your groups, access details, payments, and subscription activity from one place.",
  },
  {
    bg: "bg-[#FFDFEB]",
    glyph: <HeadsetGlyph color="#E31B00" />,
    title: "Support When You Need It",
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
      className={`rounded-[30px] border border-white/40 bg-white/10 ${
        mobile ? "px-[30px] pt-[40px] pb-[40px]" : "h-[380px] px-[30px] pt-[70px]"
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
            ? "mt-[20px] text-[20px] leading-[24px]"
            : "mt-[26px] text-[35px] leading-[43px]"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-center font-semibold text-white ${
          mobile
            ? "mt-[16px] text-[14px] leading-[20px]"
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
        className={`flex items-center justify-center rounded-[20px] border border-white bg-clyse font-bold text-white ${
          mobile ? "h-[64px] text-[20px]" : "h-[81px] text-[35px] leading-[43px]"
        }`}
      >
        {label}
      </div>
      <div className={mobile ? "mt-[30px] flex flex-col gap-[30px]" : "mt-[40px] grid grid-cols-3 gap-[30px]"}>
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
    <div className={mobile ? "flex flex-col gap-[8px]" : "flex flex-col gap-[7px]"}>
      {items.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`flex w-full items-center bg-[#B1DBB3] text-left font-semibold text-ink ${
                mobile ? "min-h-[60px] px-[20px] py-[14px] text-[16px]" : "h-[99px] px-[28px] text-[27px]"
              } ${i >= 4 && mobile ? "max-xl:text-[14px]" : ""}`}
            >
              <span className="flex-1">{f.q}</span>
              <span className="ml-[16px] flex-none">
                <PlusIcon open={isOpen} />
              </span>
            </button>
            {isOpen && (
              <div
                className={`border border-t-0 border-clyse bg-white font-semibold text-ink ${
                  mobile ? "px-[20px] py-[16px] text-[14px] leading-[22px]" : "px-[28px] py-[24px] text-[20px] leading-[30px]"
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

export default function Landing() {
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
          <h1 className="mx-auto max-w-[1054px] text-[80px] leading-[98px] font-bold text-ink">
            Cut up to <span className="text-clyse">75%</span> off the
            <br />
            price of your subscriptions
          </h1>
          <p className="mx-auto mt-[30px] max-w-[1054px] text-[25px] leading-[35px] font-semibold text-[#6B6B6B]">
            Clyse helps you share premium subscriptions with friends and family. Create
            groups, split costs, and get access instantly.
          </p>
          <div className="mt-[70px] flex justify-center gap-[50px]">
            <Link
              to="/create-group"
              className="bg-btn flex h-[60px] w-[200px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-mint transition hover:opacity-90"
            >
              Create Group
            </Link>
            <Link
              to="/marketplace"
              className="flex h-[60px] w-[200px] items-center justify-center rounded-[10px] border border-clyse bg-mint text-[18px] font-semibold text-ink transition hover:bg-white"
            >
              Browse Group
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
            Clyse helps you share premium subscriptions with friends and family. Create
            groups, split costs, and get access instantly.
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

      <LogoMarquee />

      {/* Desktop How It Works */}
      <section id="how-it-works" className="mx-auto hidden max-w-[1440px] scroll-mt-[20px] px-[20px] min-[1440px]:px-[100px] xl:block">
        <h2 className="mt-[100px] text-center text-[35px] leading-[43px] font-bold text-ink">
          How It Works
        </h2>
        <p className="mx-auto mt-[10px] max-w-[840px] text-center text-[25px] leading-[35px] font-semibold text-ink">
          Getting access to your favorite subscriptions is simple. Choose a service, join
          an available group, and pay securely through CLYSE to enjoy your subscription.
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
      <section id="how-it-works-m" className="scroll-mt-[20px] px-[30px] xl:hidden">
        <h2 className="mt-[60px] text-center text-[30px] leading-[37px] font-bold text-ink">
          How It Works
        </h2>
        <p className="mx-auto mt-[10px] max-w-[370px] text-center text-[16px] leading-[22px] font-semibold text-ink">
          Getting access to your favorite subscriptions is simple. Choose a service, join
          an available group, and pay securely through CLYSE to enjoy your subscription.
        </p>
      </section>
      <section className="bg-deep relative mt-[60px] xl:hidden">
        <div className="relative space-y-[60px] px-[30px] py-[60px]">
          <FlowBlock label="Member Flow" cards={MEMBER_FLOW} mobile />
          <FlowBlock label="Creator Flow" cards={CREATOR_FLOW} mobile />
        </div>
      </section>

      {/* Desktop Why */}
      <section id="why-clyse" className="mx-auto hidden max-w-[1440px] scroll-mt-[20px] px-[20px] min-[1440px]:px-[100px] xl:block">
        <h2 className="mt-[100px] text-center text-[35px] leading-[43px] font-bold text-ink">
          Why Choose CLYSE?
        </h2>
        <p className="mx-auto mt-[10px] max-w-[841px] text-center text-[25px] leading-[35px] font-semibold text-ink">
          Enjoy your favorite subscriptions for less by joining available groups, or share
          unused subscription slots and earn from them. CLYSE makes subscription sharing
          easier with secure payments, verified groups, and a simple way to manage your
          access.
        </p>
        <div className="mt-[100px] overflow-hidden rounded-[40px] border border-[#999999]">
          <div className="grid grid-cols-3 divide-x divide-[#999999]">
            {WHY.slice(0, 3).map((w) => (
              <div key={w.title} className="flex h-[364px] flex-col items-center px-[40px] pt-[64px]">
                <span className={`grid h-[80px] w-[80px] place-items-center rounded-[10px] ${w.bg}`}>
                  {w.glyph}
                </span>
                <h3 className="mt-[32px] text-center text-[35px] leading-[43px] font-bold text-ink">
                  {w.title}
                </h3>
                <p className="mt-[20px] text-center text-[18px] leading-[25px] font-semibold text-ink">
                  {w.body}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#999999] border-t border-[#999999]">
            {WHY.slice(3).map((w) => (
              <div key={w.title} className="flex h-[364px] flex-col items-center px-[40px] pt-[64px]">
                <span className={`grid h-[80px] w-[80px] place-items-center rounded-[10px] ${w.bg}`}>
                  {w.glyph}
                </span>
                <h3 className="mt-[32px] text-center text-[35px] leading-[43px] font-bold text-ink">
                  {w.title}
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
      <section id="why-clyse-m" className="scroll-mt-[20px] px-[30px] xl:hidden">
        <h2 className="mt-[60px] text-center text-[20px] leading-[24px] font-bold text-ink">
          Why Choose CLYSE?
        </h2>
        <p className="mx-auto mt-[10px] max-w-[370px] text-center text-[16px] leading-[22px] font-semibold text-ink">
          Enjoy your favorite subscriptions for less by joining available groups, or share
          unused subscription slots and earn from them. CLYSE makes subscription sharing
          easier with secure payments, verified groups, and a simple way to manage your
          access.
        </p>
        <div className="mt-[40px] overflow-hidden rounded-[24px] border border-[#999999] divide-y divide-[#999999]">
          {WHY.map((w) => (
            <div key={w.title} className="flex flex-col items-center px-[30px] py-[30px]">
              <span className={`grid h-[64px] w-[64px] place-items-center rounded-[10px] ${w.bg}`}>
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

      {/* Desktop FAQ */}
      <section className="mx-auto hidden max-w-[1440px] px-[20px] min-[1440px]:px-[100px] xl:block">
        <h2 className="mt-[155px] text-[35px] leading-[43px] font-bold text-ink">
          Frequently Asked Questions
        </h2>
        <div className="mt-[50px]">
          <Faq items={FAQ_DESKTOP} />
        </div>
      </section>

      {/* Mobile FAQ */}
      <section className="mt-[60px] xl:hidden">
        <h2 className="px-[30px] text-[20px] leading-[24px] font-bold text-ink">
          Frequently Asked Questions
        </h2>
        <div className="mt-[24px]">
          <Faq items={FAQ_MOBILE} mobile />
        </div>
      </section>

      <Footer mt="mt-[152px]" />
      <MobileFooter />
    </div>
  );
}
