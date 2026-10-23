import Navbar from "../components/Navbar";
import { Footer, MobileFooter } from "../components/Footer";
import DesktopCta from "../components/DesktopCta";
import MobileCta from "../components/MobileCta";
import aboutMission from "../assets/about-mission.jpg";
import aboutVision from "../assets/about-vision.jpg";
import aboutWhy from "../assets/about-why.jpg";

/* About page — Figma 875:35404 (1440x3682, logged-out navbar).
   NOTE: the gray logo strip parked at y830 in Figma is hidden in the
   design's own render (header flows straight into Our Mission), so it
   is intentionally not built. */
const SUB =
  "At CLYSE, we believe enjoying your favorite subscription services should be simpler and more affordable. We connect people with available subscription slots, helping Members access services at a lower cost while giving Creators a way to share unused slots.";
const MISSION_BODY =
  "Our mission is to simplify subscription sharing by connecting people, improving affordability, and providing a straightforward way to manage subscription access and payments.";
const VISION_BODY =
  "We envision a world where people can make better use of their subscriptions, access the services they need, and share available slots through a platform built around convenience and trust.";
const WHY_BODY =
  "Subscriptions can be expensive when paid for alone, while some subscription accounts have unused slots. CLYSE brings these needs together by connecting people who want affordable access with those who have available slots to share. Our goal is to make subscription sharing simpler, more accessible, and easier to manage.";

function Chip({ children, className = "" }) {
  return (
    <span
      className={`inline-flex h-[65px] items-center rounded-[10px] bg-clyse px-[25px] text-[25px] leading-[35px] font-semibold text-white ${className}`}
    >
      {children}
    </span>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar />
      {/* Desktop header — full-bleed dark band */}
      <section className="bg-deep relative hidden overflow-hidden xl:block">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px 340px at 50% 0%, rgba(70,192,76,0.35), transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-[1440px] px-[100px] pt-[103px] pb-[100px] text-center">
          <h1 className="mx-auto max-w-[875px] text-[80px] leading-[98px] font-bold text-white">
            Making Subscriptions More Accessible
          </h1>
          <p className="mx-auto mt-[25px] max-w-[1148px] text-[25px] leading-[35px] font-semibold text-white">
            {SUB}
          </p>
        </div>
      </section>

      {/* Mobile header */}
      <section className="bg-deep relative overflow-hidden xl:hidden">
        <div className="relative px-[30px] pt-[50px] pb-[50px] text-center">
          <h1 className="text-[36px] leading-[44px] font-bold text-white">
            Making Subscriptions More Accessible
          </h1>
          <p className="mt-[16px] text-[15px] leading-[22px] font-semibold text-white">
            {SUB}
          </p>
        </div>
      </section>

      {/* Desktop mission (white) */}
      <section className="mx-auto hidden max-w-[1440px] px-[100px] py-[70px] xl:block">
        <div className="flex gap-[100px]">
          <div className="w-[570px] flex-none">
            <Chip>Our Mission</Chip>
            <h2 className="mt-[33px] text-[35px] leading-[43px] font-bold text-black">
              Making Access Easier for Everyone
            </h2>
            <p className="mt-[76px] text-justify text-[25px] leading-[35px] font-semibold text-black">
              {MISSION_BODY}
            </p>
          </div>
          <img
            src={aboutMission}
            alt="Members sharing subscriptions"
            className="mt-[15px] h-[362px] w-[570px] flex-none rounded-[30px] object-cover"
          />
        </div>
      </section>

      {/* Desktop vision (dark, reversed) */}
      <section className="bg-deep relative hidden overflow-hidden xl:block">
        <div className="relative mx-auto flex max-w-[1440px] gap-[100px] px-[100px] py-[120px]">
          <img
            src={aboutVision}
            alt="A smarter way to share subscriptions"
            className="h-[362px] w-[570px] flex-none rounded-[30px] object-cover"
          />
          <div className="w-[570px] flex-none">
            <Chip>Our Vision</Chip>
            <h2 className="mt-[33px] text-[35px] leading-[43px] font-bold text-white">
              A Smarter Way to Share Subscriptions
            </h2>
            <p className="mt-[76px] text-[25px] leading-[35px] font-semibold text-white">
              {VISION_BODY}
            </p>
          </div>
        </div>
      </section>

      {/* Desktop why (mint fade) */}
      <section className="bg-mintfade hidden xl:block">
        <div className="mx-auto flex max-w-[1440px] gap-[100px] px-[100px] py-[100px]">
          <div className="w-[570px] flex-none">
            <Chip>Our Vision</Chip>
            <h2 className="mt-[33px] text-[35px] leading-[43px] font-bold text-black">
              Making Subscription Sharing Easier for Everyone
            </h2>
            <p className="mt-[76px] text-justify text-[25px] leading-[35px] font-semibold text-black">
              {WHY_BODY}
            </p>
          </div>
          <img
            src={aboutWhy}
            alt="Why Clyse exists"
            className="mt-[67px] h-[362px] w-[570px] flex-none rounded-[30px] object-cover"
          />
        </div>
      </section>

      {/* Mobile sections */}
      <main className="xl:hidden">
        <section className="px-[30px] pt-[40px]">
          <span className="inline-flex items-center rounded-[8px] bg-clyse px-[18px] py-[10px] text-[16px] font-semibold text-white">
            Our Mission
          </span>
          <h2 className="mt-[20px] text-[30px] leading-[37px] font-bold text-black">
            Making Access Easier for Everyone
          </h2>
          <p className="mt-[20px] text-justify text-[16px] leading-[24px] font-semibold text-black">
            {MISSION_BODY}
          </p>
          <img
            src={aboutMission}
            alt="Members sharing subscriptions"
            className="mt-[24px] h-[220px] w-full rounded-[20px] object-cover"
          />
        </section>
        <section className="bg-deep mt-[40px] px-[30px] py-[40px]">
          <span className="inline-flex items-center rounded-[8px] bg-clyse px-[18px] py-[10px] text-[16px] font-semibold text-white">
            Our Vision
          </span>
          <h2 className="mt-[20px] text-[30px] leading-[37px] font-bold text-white">
            A Smarter Way to Share Subscriptions
          </h2>
          <p className="mt-[20px] text-[16px] leading-[24px] font-semibold text-white">
            {VISION_BODY}
          </p>
          <img
            src={aboutVision}
            alt="A smarter way to share subscriptions"
            className="mt-[24px] h-[220px] w-full rounded-[20px] object-cover"
          />
        </section>
        <section className="bg-mintfade px-[30px] py-[40px]">
          <span className="inline-flex items-center rounded-[8px] bg-clyse px-[18px] py-[10px] text-[16px] font-semibold text-white">
            Our Vision
          </span>
          <h2 className="mt-[20px] text-[30px] leading-[37px] font-bold text-black">
            Making Subscription Sharing Easier for Everyone
          </h2>
          <p className="mt-[20px] text-justify text-[16px] leading-[24px] font-semibold text-black">
            {WHY_BODY}
          </p>
          <img
            src={aboutWhy}
            alt="Why Clyse exists"
            className="mt-[24px] h-[220px] w-full rounded-[20px] object-cover"
          />
        </section>
        <div className="px-[30px]">
          <MobileCta />
          <div className="pb-[60px]" />
        </div>
      </main>

      <div className="mx-auto hidden max-w-[1440px] px-[100px] xl:block">
        <DesktopCta />
      </div>
      <Footer />
      <MobileFooter />
    </div>
  );
}
