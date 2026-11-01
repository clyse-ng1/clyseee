import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatarAccount from "../assets/avatar-account.webp";
import chevronDown from "../assets/sidecard-chevron.svg";
import { useAuth } from "../lib/useAuth";
import { displayName, fmtDay } from "../lib/api";
import { SECTIONS } from "./sidebarNav";

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

/* Mobile header chevron: toggles the account quick-nav dropdown (same
   links as the desktop sidebar), so mobile members can jump anywhere. */
export function MemberMenuButton({ active = "" }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const signOut = async () => {
    setOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <div ref={ref} className="relative mt-[19px] flex h-[33px] items-center justify-center bg-white">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-[33px] w-[48px] place-items-center"
      >
        <img
          src={chevronDown}
          alt=""
          className={`w-[19px] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute top-full right-0 left-0 z-30 max-h-[340px] overflow-y-auto rounded-[15px] border border-line bg-white p-[16px] shadow-[0_10px_30px_rgba(0,23,1,0.18)]">
          {SECTIONS.map((s) => (
            <div key={s.title} className="mt-[12px] first:mt-0">
              <p className="text-[11px] leading-[14px] font-bold tracking-[0.14em] text-[#6B6B6B] uppercase">
                {s.title}
              </p>
              <div className="mt-[6px] space-y-[4px]">
                {s.rows.map((r) => (
                  <Link
                    key={r.label}
                    to={r.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-[10px] rounded-[8px] px-[10px] py-[8px] text-[15px] font-semibold ${
                      active === r.label
                        ? "bg-[#F1F8F1] text-clyse"
                        : "text-ink hover:bg-[#F1F8F1]"
                    }`}
                  >
                    <img src={r.icon} alt="" className="h-[20px] w-[20px] flex-none" />
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={signOut}
            className="mt-[12px] flex w-full items-center justify-center rounded-[8px] border border-[#E31B00]/30 py-[10px] text-[15px] font-semibold text-[#E31B00]"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
