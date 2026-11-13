import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { MobileBack } from "./MemberMini";
import { BlurBg, MobileTopWash } from "./Decor";

/* Shared shell for the member sub-screens added with the API update (support
   centre, waitlist activity, group activity, invite links). None of these have
   a Figma artboard, so rather than five hand-rolled page skeletons they all sit
   on this one — desktop keeps the 292px sidebar + 830px column used by every
   other member page, mobile keeps the green top wash, back chevron and 30px
   margin used by the waitlist/join screens.

   IMPORTANT: children are rendered exactly ONCE. The first version of this
   shell had separate desktop and mobile blocks, which duplicated every form
   field in the DOM (two #ticket-subject inputs, two submit buttons). One
   responsive tree avoids that, so `children` can hold forms safely. */

export function MemberPage({ active, title, sub, icon, action, children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white font-sans text-ink">
      <BlurBg variant="hero" />
      <MobileTopWash />
      <Navbar loggedIn />

      <main className="relative mx-auto flex w-full flex-col px-[20px] pt-[24px] pb-[60px] xl:mx-[20px] xl:flex-row xl:gap-[38px] xl:px-0 xl:pt-[101px] xl:pb-[100px] min-[1440px]:xl:mx-[100px]">
        <div className="hidden flex-none xl:block">
          <Sidebar active={active} />
        </div>

        <div className="min-w-0 flex-1 xl:w-[830px] xl:flex-none">
          <div className="xl:hidden">
            <MobileBack />
          </div>

          <div className="flex items-center gap-[14px] xl:gap-[20px]">
            {icon && (
              <span className="grid h-[40px] w-[44px] flex-none place-items-center rounded-[8px] bg-[#B1DBB3] xl:h-[50px] xl:w-[54px] xl:rounded-[10px]">
                {icon}
              </span>
            )}
            <h1 className="text-[30px] leading-[37px] font-bold text-ink xl:text-[35px] xl:leading-[43px]">
              {title}
            </h1>
          </div>

          {sub && (
            <p className="mt-[4px] text-[15px] leading-[22px] font-semibold text-[#6B6B6B] xl:mt-[10px] xl:text-[18px]">
              {sub}
            </p>
          )}

          {action && <div className="mt-[14px] xl:hidden">{action}</div>}

          <div className="mt-[24px] xl:mt-[40px]">{children}</div>
        </div>

        {/* The desktop-only action lives in the title row for xl. */}
        {action && <div className="hidden xl:absolute xl:top-[101px] xl:right-0 xl:block">{action}</div>}
      </main>
    </div>
  );
}

/* White card used for every list/panel on these screens (matches the wallet
   and transaction-history cards: r20, soft shadow, 30px inner padding). */
export function Panel({ className = "", children }) {
  return (
    <div
      className={`rounded-[20px] bg-white px-[20px] pt-[24px] pb-[24px] shadow-[0_0_20px_rgba(0,23,1,0.10)] xl:px-[30px] xl:pt-[30px] xl:pb-[30px] ${className}`}
    >
      {children}
    </div>
  );
}

/* Small status pill. `tone` picks the palette so every screen colours
   "open / pending / failed" identically instead of inventing shades. */
const TONES = {
  open: "bg-[#FFF3D6] text-[#8A5A00]",
  progress: "bg-[#E3F0FF] text-[#1B4F8F]",
  good: "bg-[#DDF7DF] text-[#04640A]",
  bad: "bg-[#FFE3E3] text-[#A11212]",
  muted: "bg-[#EFEFEF] text-[#5C6660]",
  info: "bg-[#E9F7EA] text-[#001701]",
};

export function Pill({ tone = "muted", children }) {
  return (
    <span
      className={`inline-flex h-[26px] flex-none items-center justify-center rounded-[13px] px-[12px] text-[12px] leading-[16px] font-semibold whitespace-nowrap ${
        TONES[tone] || TONES.muted
      }`}
    >
      {children}
    </span>
  );
}

/* Maps an API status string onto a pill tone once, for every screen. */
export function statusTone(status) {
  const s = `${status || ""}`.toLowerCase();
  if (["open", "waiting", "notified", "pending", "submitted", "under_review"].includes(s)) {
    return s === "notified" ? "progress" : s === "open" ? "open" : "muted";
  }
  if (["in_progress", "inprogress", "waiting_user", "processing"].includes(s)) return "progress";
  if (["resolved", "verified", "approved", "active", "successful", "completed", "joined", "converted"].includes(s)) return "good";
  if (["rejected", "failed", "closed", "revoked", "declined", "expired", "withdrawn", "cancelled"].includes(s)) return "bad";
  return "muted";
}

/* "in_progress" -> "In progress" without title-casing every word. */
export function humanise(s) {
  if (!s) return "—";
  const t = `${s}`.replace(/[_-]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

/* One row in an activity/timeline list: title, optional note, timestamp. */
export function EventRow({ title, note, time, tone = "info", last = false }) {
  return (
    <li className="relative flex gap-[14px]">
      <span className="relative flex flex-none flex-col items-center">
        <span
          className={`mt-[5px] h-[10px] w-[10px] flex-none rounded-full ${
            tone === "good"
              ? "bg-[#048B0B]"
              : tone === "bad"
                ? "bg-[#D22]"
                : tone === "open"
                  ? "bg-[#E8A400]"
                  : "bg-[#B1DBB3]"
          }`}
        />
        {!last && <span className="mt-[4px] w-[1px] flex-1 bg-[#E3E8E3]" />}
      </span>
      <span className="min-w-0 pb-[18px]">
        <span className="block text-[15px] leading-[21px] font-semibold text-black xl:text-[16px]">
          {title}
        </span>
        {note && (
          <span className="mt-[2px] block text-[13px] leading-[19px] font-semibold text-[#66726C]">
            {note}
          </span>
        )}
        {time && (
          <span className="mt-[2px] block text-[12px] leading-[18px] font-semibold text-[#98A29B]">
            {time}
          </span>
        )}
      </span>
    </li>
  );
}

/* Empty + error states, worded once. */
export function Empty({ text }) {
  return (
    <p className="py-[10px] text-[15px] leading-[22px] font-semibold text-[#6B6B6B] xl:text-[17px]">
      {text}
    </p>
  );
}

export function ErrorText({ text }) {
  return (
    <p className="py-[10px] text-[15px] leading-[22px] font-semibold text-[#D22] xl:text-[17px]">
      {text}
    </p>
  );
}

/* "Back to X" link at the top of a sub-screen. */
export function BackLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-[8px] text-[15px] font-semibold text-[#048B0B] hover:underline"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="m14.5 5.5-7 6.5 7 6.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {children}
    </Link>
  );
}
