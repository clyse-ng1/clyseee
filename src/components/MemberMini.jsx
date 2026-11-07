import avatarAccount from "../assets/avatar-account.webp";
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
