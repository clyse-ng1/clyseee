import { Link } from "react-router-dom";
import avatarAccount from "../assets/avatar-account.webp";
import { useAuth } from "../lib/useAuth";
import { displayName, fmtDay } from "../lib/api";
import ExtraBlock from "./ExtraBlock";
import { SECTIONS } from "./sidebarNav";

function Row({ r, active }) {
  const cls = `relative flex h-[56px] w-[292px] items-center rounded-[10px] pl-[16px] pr-[14px] ${
    active
      ? "bg-btn"
      : "border border-clyse bg-white shadow-[0_0_7px_rgba(0,23,1,0.25)]"
  }`;
  const inner = (
    <>
      <img
        src={active && r.activeIcon ? r.activeIcon : r.icon}
        alt=""
        className="h-[26px] w-[26px] flex-none"
      />
      <span
        className={`ml-[12px] truncate font-semibold ${
          active
            ? "text-[22px] leading-[30px] text-[#F1F8F1]"
            : "text-[18px] leading-[22px] text-ink"
        }`}
      >
        {r.label}
      </span>
    </>
  );
  return r.to ? (
    <Link key={r.label} to={r.to} className={cls}>
      {inner}
    </Link>
  ) : (
    <div key={r.label} className={cls}>
      {inner}
    </div>
  );
}

export default function Sidebar({ active }) {
  const { user } = useAuth();
  const name = displayName(user) || "Marcus Saris";
  const since = fmtDay(user?.created_at) || "20/11/2026";
  return (
    <aside className="w-[372px] flex-none">
      <div className="bg-white px-[40px] pt-[50px] pb-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
        <div className="flex items-center">
          <img
            src={user?.avatar_url || avatarAccount}
            alt={name}
            className="h-[50px] w-[50px] rounded-full border-[0.5px] border-mint object-cover shadow-[0_0_7px_rgba(0,23,1,0.25)]"
          />
          <div className="ml-[12px]">
            <p className="text-[25px] leading-[28px] font-bold text-ink">
              {name}
            </p>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              Member on Clyse Since {since}
            </p>
          </div>
        </div>
        <nav className="mt-[36px]">
          {SECTIONS.map((s, si) => (
            <div key={s.title} className={si > 0 ? "mt-[22px]" : ""}>
              <p className="pl-[4px] text-[12px] leading-[16px] font-bold tracking-[0.14em] text-[#6B6B6B] uppercase">
                {s.title}
              </p>
              <div className="mt-[10px] space-y-[12px]">
                {s.rows.map((r) => (
                  <Row key={r.label} r={r} active={r.label === active} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <ExtraBlock className="mt-[48px]" />
    </aside>
  );
}
