import { Link } from "react-router-dom";
import footerLogo from "../assets/footer-logo.webp";

/* Homepage footer — Figma 255:3349 "Footer" (ry 2877–3549) + mobile 93:274 (y 677–1371).
   "Social Medial" designer typo fixed to "Social Media" per standing instruction. */

const DISCLAIMER =
  "Disclaimer: Clyse is a cost-sharing platform and intermediary only. We are not affiliated with third-party services (Netflix, Disney+, Spotify, etc.). Each user is responsible for verifying and complying with each service's terms of use. Mentioned brands belong to their respective owners.";

const COLS = [
  {
    title: "Contact",
    links: ["Who we are", "sayhi@clyse.com", "Ibadan, Nigeria", "+234 706 569 1676"],
  },
  { title: "Social Media", links: ["Tiktok", "Instagram", "LinkedIn", "Facebook"] },
  {
    title: "Legal",
    links: ["Terms of Use", "Privacy Policy", "Legal Terms", "Cookie Terms"],
  },
  {
    title: "Customer Service",
    links: ["Monday - Saturday", "9:00am - 5:00pm", "Help Center"],
  },
];

const COL_WIDTHS = ["w-[186px]", "w-[190px]", "w-[186px]", "w-auto"];

export function Footer({ mt = "mt-[100px]" }) {
  return (
    <footer className={`${mt} hidden xl:block`}>
      <div className="bg-mint px-[20px] min-[1440px]:px-[100px] pt-[50px] pb-[50px]">
        <p className="mx-auto max-w-[1240px] text-center text-[25px] font-semibold leading-[35px] text-muted">
          {DISCLAIMER}
        </p>
        <img
          src={footerLogo}
          alt="Clyse"
          className="mx-auto mt-[50px] h-[83px] w-[369px]"
        />
        <div className="mx-auto mt-[50px] flex max-w-[1240px] gap-[145px]">
          {COLS.map((c, i) => (
            <div key={c.title} className={`${COL_WIDTHS[i]} ${i === 3 ? "mt-[14px]" : ""}`}>
              <h3 className="text-[25px] font-semibold leading-[35px] text-black">
                {c.title}
              </h3>
              <ul className="mt-[10px] space-y-[5px]">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link
                      to="/"
                      className="text-[18px] font-semibold leading-[22px] text-smoke transition hover:text-clyse"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-[86px] items-center justify-center bg-[#013104]">
        <p className="text-[25px] font-semibold leading-[35px] text-white">
          All rights reserved&nbsp;&nbsp;@Clyse 2026
        </p>
      </div>
    </footer>
  );
}

export function MobileFooter({ mt = "mt-[50px]" }) {
  return (
    <footer className={`${mt} xl:hidden`}>
      <div className="bg-mint px-[35px] pt-[35px] pb-[35px]">
        <p className="text-center text-[17.34px] font-semibold leading-[24.27px] text-muted">
          {DISCLAIMER}
        </p>
        <img
          src={footerLogo}
          alt="Clyse"
          className="mx-auto mt-[34px] h-[58px] w-[256px] object-cover"
        />
        <div className="mt-[35px] grid grid-cols-[129px_132px] gap-x-[48px] gap-y-[21px]">
          {COLS.map((c, i) => (
            <div key={c.title} className={i === 3 ? "mt-[9px]" : ""}>
              <h3 className="text-[17.34px] font-semibold leading-[24.27px] text-black">
                {c.title}
              </h3>
              <ul className="mt-[7px] space-y-[3px]">
                {c.links.map((l) => (
                  <li key={l}>
                    <Link
                      to="/"
                      className="text-[12.48px] font-semibold leading-[15.22px] text-smoke"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="flex h-[60px] items-center justify-center bg-[#013104]">
        <p className="text-center text-[17.34px] font-semibold leading-[24.27px] text-white">
          All rights reserved&nbsp;&nbsp;@Clyse 2026
        </p>
      </div>
    </footer>
  );
}
