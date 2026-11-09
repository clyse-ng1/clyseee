import avatarAccount from "../assets/avatar-account.webp";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import { displayName, fmtDay } from "../lib/api";

/* Mobile member header (join flow): 50px avatar + name + since. */
export default function MemberMini() {
  const { user } = useAuth();
  const name = displayName(user) || "Marcus Saris";
  const since = fmtDay(user?.created_at) || "20/11/2026";
  return (
    <div className="flex items-center gap-[6px]">
      <img
        src={user?.avatar_url || avatarAccount}
        alt={name}
        className="h-[50px] w-[50px] rounded-full object-cover"
      />
      <div>
        <p className="text-[24.77px] leading-[28px] font-bold text-ink">
          {name}
        </p>
        <p className="text-[12.88px] leading-[20px] font-semibold text-[#6B6B6B]">
          Member on Clyse Since {since}
        </p>
      </div>
    </div>
  );
}

/* Mobile header chevron. Figma puts the ▼ inside a bordered box; the old
   dropdown that duplicated the sidebar is gone — the navbar's full-screen
   menu is the single navigation surface on mobile now. */
export function MemberMenuButton() {
  /* Deliberately renders nothing. This was the empty bordered box with a grey
     chevron under the member header on every mobile page — no label, no menu,
     nothing to open. Removed on the owner's instruction; the navbar's
     full-screen menu is the single navigation surface on mobile. */
  return null;
}

/* Mobile back chevron for the member pages (card 4: "ensure back btn is on all
   major pages"). Figma draws it as a white disc with a hairline border and a
   thin chevron, sitting above the page title — see JOIN GROUP page 2 (b04).
   Uses history where there is any, so it returns to the page you came from,
   and falls back to `to` on a deep link. */
export function MobileBack({ to = "/dashboard" }) {
  const navigate = useNavigate();
  const back = () => {
    const idx = window.history.state?.idx;
    if (typeof idx === "number" && idx > 0) navigate(-1);
    else navigate(to);
  };
  return (
    <button
      type="button"
      onClick={back}
      aria-label="Back"
      className="mb-[16px] grid h-[36px] w-[36px] place-items-center rounded-full border border-[#BABABA] bg-white text-ink shadow-[0_4px_10px_rgba(0,23,1,0.08)]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="m14.5 5.5-7 6.5 7 6.5"
          stroke="#001701"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
