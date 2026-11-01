import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/useAuth";
import logo from "../assets/logo.png";
import avatarAccount from "../assets/avatar-account.webp";
import iconChevDownSm from "../assets/icon-chev-down-sm.svg";

const LINKS = ["Home", "How it Works", "Why Clyse", "About", "Contact"];
/* Logged-in links per newest Figma app frames (D08/D09/D10). */
const LOGGED_LINKS = ["Home", "Join Group", "Create Group", "About Us", "Contact Us"];
const LOGGED_ROUTES = {
  Home: "/",
  "Join Group": "/join",
  "Create Group": "/create-group",
  "About Us": "/about",
  "Contact Us": "/contact",
};
const PUBLIC_ROUTES = {
  "How it Works": "/#how-it-works",
  "Why Clyse": "/#why-clyse",
  About: "/about",
  Contact: "/contact",
};
/* Landing links per redesigned landing (875:34275): How/Why anchor to sections. */
const LANDING_LINKS = ["How It Works", "Why Clyse", "About Us", "Contact Us"];
const LANDING_ROUTES = {
  "How It Works": "/#how-it-works",
  "Why Clyse": "/#why-clyse",
  "About Us": "/about",
  "Contact Us": "/contact",
};
const MLINKS = ["How It Works", "Why Clyse", "About Us", "Contact Us"];
const MROUTES = {
  "How It Works": "/#how-it-works",
  "Why Clyse": "/#why-clyse",
  "About Us": "/about",
  "Contact Us": "/contact",
};
const MLOGGED = ["Home", "Join Group", "Create Group", "My Profile"];
const MLOGGED_ROUTES = {
  Home: "/",
  "Join Group": "/join",
  "Create Group": "/create-group",
  "My Profile": "/profile",
};

function HamburgerIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M4 8h22M4 15h22M4 22h22" stroke="#048B0B" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M7 7l16 16M23 7L7 23" stroke="#FFFFFF" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar({ loggedIn = false, landing = false }) {
  const links = landing ? LANDING_LINKS : loggedIn ? LOGGED_LINKS : LINKS;
  const routeFor = (l) =>
    landing
      ? LANDING_ROUTES[l] || "/"
      : loggedIn
        ? LOGGED_ROUTES[l] || "/"
        : PUBLIC_ROUTES[l] || "/";
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    setOpen(false);
    setAccountOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <header className="relative z-50 bg-white">
      {/* Desktop bar */}
      <div className="hidden border-b border-clyse xl:block">
        <div className="mx-auto flex h-[100px] max-w-[1440px] items-center px-[20px] min-[1440px]:px-[100px]">
          <Link to="/" className="shrink-0">
            <img src={logo} alt="Clyse" className="h-[40px] w-auto" />
          </Link>
          <nav
            className={`${landing ? "ml-[167px]" : "ml-[137px]"} flex items-center gap-[20px]`}
          >
            {links.map((l) => (
              <Link key={l} to={routeFor(l)} className="text-[18px] font-semibold text-ink hover:text-clyse">
                {l}
              </Link>
            ))}
          </nav>
          {loggedIn ? (
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className="flex items-center gap-[10px]"
              >
                <span className="text-[18px] font-semibold text-ink">My Account</span>
                <img
                  src={user?.avatar_url || avatarAccount}
                  alt="My Account"
                  className="h-[50px] w-[50px] rounded-full object-cover"
                />
              </button>
              {accountOpen && (
                <div className="absolute top-full right-0 mt-[8px] w-[200px] rounded-[10px] border border-line bg-white py-[8px] shadow-[0_0_20px_rgba(0,23,1,0.15)]">
                  <Link
                    to="/profile"
                    onClick={() => setAccountOpen(false)}
                    className="block w-full px-[20px] py-[10px] text-left text-[16px] font-semibold text-ink hover:bg-[#F1F8F1]"
                  >
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={signOut}
                    className="block w-full px-[20px] py-[10px] text-left text-[16px] font-semibold text-[#E31B00] hover:bg-[#F1F8F1]"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-[20px]">
              <Link
                to="/signin"
                className="flex h-[45px] w-[105px] items-center justify-center rounded-[10px] border border-clyse bg-mint text-[18px] font-semibold text-ink transition hover:bg-white"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-deep flex h-[45px] w-[105px] items-center justify-center rounded-[10px] text-[18px] font-semibold text-mint transition hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile bar */}
      <div className="border-b border-clyse xl:hidden">
        <div className="flex h-[63px] items-center justify-between px-[20px]">
          <Link to="/" onClick={() => setOpen(false)}>
            <img src={logo} alt="Clyse" className="h-[21px] w-auto" />
          </Link>
          <button aria-label="Open menu" onClick={() => setOpen((v) => !v)} className="p-1">
            {open ? <CloseIconDark /> : <HamburgerIcon />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <div className="bg-deep animate-menu-drop absolute inset-x-0 top-full p-[30px] xl:hidden">
          <button aria-label="Close menu" onClick={() => setOpen(false)} className="block">
            <CloseIcon />
          </button>
          <nav className="mt-[10px] flex flex-col">
            {(loggedIn ? MLOGGED : MLINKS).map((l) => (
              <Link
                key={l}
                to={(loggedIn ? MLOGGED_ROUTES : MROUTES)[l]}
                onClick={() => setOpen(false)}
                className="flex h-[50px] items-center justify-between text-[18px] leading-[22px] font-semibold text-white"
              >
                {l}
                <span className="flex h-[24px] w-[24px] items-center justify-center">
                  <img src={iconChevDownSm} alt="" className="h-[6px] w-[12px]" />
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-[4px] flex gap-[50px]">
            {loggedIn ? (
              <button
                type="button"
                onClick={signOut}
                className="flex h-[45px] w-[105px] items-center justify-center rounded-[10px] bg-clyse text-[18px] font-semibold text-mint"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setOpen(false)}
                  className="flex h-[45px] w-[105px] items-center justify-center rounded-[10px] border border-clyse bg-mint text-[18px] font-semibold text-ink"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="flex h-[45px] w-[105px] items-center justify-center rounded-[10px] bg-clyse text-[18px] font-semibold text-mint"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function CloseIconDark() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M7 7l16 16M23 7L7 23" stroke="#048B0B" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
