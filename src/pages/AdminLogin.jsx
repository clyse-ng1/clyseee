import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { idOf } from "../lib/api";
import { useAuth } from "../lib/useAuth";

export default function AdminLogin({ denied = false, onRetry }) {
  const { user, login, logout } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [switching, setSwitching] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!identifier.trim() || !password || busy) return;
    setBusy(true);
    setError("");
    const result = await login(idOf(identifier.trim()), password);
    setBusy(false);
    if (result.error) {
      setError(result.error.message || "We could not sign you in. Check your credentials and try again.");
    }
    // A successful sign-in updates AuthProvider; RequireAdmin then checks the
    // same server permission used to protect every admin endpoint.
  };

  const changeAccount = async () => {
    setSwitching(true);
    await logout();
    setSwitching(false);
  };

  return (
    <main className="grid min-h-screen bg-[#F4F8F4] px-5 py-10 text-[#001701] lg:grid-cols-[minmax(360px,0.9fr)_1.1fr] lg:px-0 lg:py-0">
      <section className="relative hidden overflow-hidden bg-[#001701] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between xl:px-20 xl:py-16">
        <div className="absolute -right-28 -bottom-32 h-[440px] w-[440px] rounded-full border border-[#1D5120]" />
        <div className="absolute -right-12 -bottom-16 h-[300px] w-[300px] rounded-full border border-[#1D5120]" />
        <div className="relative z-10">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#0A3A0D] text-[#B1DBB3]">
            <svg aria-hidden="true" width="25" height="25" viewBox="0 0 24 24" fill="none">
              <path d="M12 3 4.5 6v5.5c0 4.2 2.9 7.7 7.5 9.5 4.6-1.8 7.5-5.3 7.5-9.5V6L12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.22em] text-[#B1DBB3]">Clyse Admin</p>
          <h1 className="mt-5 max-w-[510px] text-4xl font-bold leading-tight xl:text-5xl">A secure space to manage Clyse.</h1>
          <p className="mt-5 max-w-[430px] text-base leading-7 text-[#D7E7D8]">Sign in with an administrator account to continue to the dashboard and platform tools.</p>
        </div>
        <p className="relative z-10 text-sm font-medium text-[#B1DBB3]">Share the Cost. Enjoy the Access.</p>
      </section>

      <section className="flex items-center justify-center">
        <div className="w-full max-w-[460px] rounded-[24px] border border-[#E0E9E0] bg-white px-7 py-9 shadow-[0_16px_55px_rgba(0,23,1,0.08)] sm:px-11 sm:py-12">
          <img src={logo} alt="Clyse" className="h-auto w-[116px]" />
          {user ? (
            <>
              <div className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#FFF4E5] px-3 py-1.5 text-xs font-bold text-[#87530A]">
                <span className="h-2 w-2 rounded-full bg-[#E59B28]" />
                Administrator access required
              </div>
              <h2 className="mt-5 text-[30px] font-bold leading-9">{denied ? "This account can’t open Admin." : "We couldn’t confirm Admin access."}</h2>
              <p className="mt-3 text-[15px] leading-6 text-[#657065]">
                {denied
                  ? "The signed-in account does not have administrator permission. Switch to an authorized administrator account to continue."
                  : "Your account is signed in, but administrator permission could not be verified. Please try again."}
              </p>
              <div className="mt-6 rounded-xl bg-[#F5F8F5] px-4 py-3 text-sm font-semibold text-[#334333]">
                Signed in as <span className="break-all">{user.email || user.phone || user.full_name || "Clyse account"}</span>
              </div>
              <button
                type="button"
                onClick={changeAccount}
                disabled={switching}
                className="mt-6 h-12 w-full rounded-xl bg-[#048B0B] text-base font-bold text-white transition hover:bg-[#036D09] disabled:opacity-60"
              >
                {switching ? "Signing out…" : "Sign out and use another account"}
              </button>
              {!denied && onRetry && (
                <button type="button" onClick={onRetry} className="mt-3 h-11 w-full rounded-xl border border-[#C7D7C8] text-sm font-bold text-[#184D1B] hover:bg-[#F5F8F5]">
                  Try again
                </button>
              )}
            </>
          ) : (
            <>
              <p className="mt-9 text-sm font-bold uppercase tracking-[0.14em] text-[#048B0B]">Administrator portal</p>
              <h2 className="mt-2 text-[30px] font-bold leading-9">Sign in to continue</h2>
              <p className="mt-2 text-[15px] leading-6 text-[#657065]">Use your administrator email or phone and password.</p>
              <form onSubmit={submit} className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#203020]">Email or phone</span>
                  <input
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(event) => { setIdentifier(event.target.value); setError(""); }}
                    placeholder="Enter your admin email or phone"
                    className="h-[52px] w-full rounded-xl border border-[#C8D2C8] px-4 text-base text-[#001701] outline-none transition placeholder:text-[#9AA49A] focus:border-[#048B0B] focus:ring-4 focus:ring-[#048B0B]/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-[#203020]">Password</span>
                  <span className="relative block">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => { setPassword(event.target.value); setError(""); }}
                      placeholder="Enter your password"
                      className="h-[52px] w-full rounded-xl border border-[#C8D2C8] px-4 pr-16 text-base text-[#001701] outline-none transition placeholder:text-[#9AA49A] focus:border-[#048B0B] focus:ring-4 focus:ring-[#048B0B]/10"
                    />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-0 right-4 text-sm font-bold text-[#048B0B]" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </span>
                </label>
                {error && <p role="alert" className="rounded-lg bg-[#FFF0F0] px-3 py-2.5 text-sm font-semibold leading-5 text-[#B42318]">{error}</p>}
                <button type="submit" disabled={busy || !identifier.trim() || !password} className="h-[52px] w-full rounded-xl bg-[#048B0B] text-base font-bold text-white transition hover:bg-[#036D09] disabled:cursor-not-allowed disabled:bg-[#A6B5A6]">
                  {busy ? "Signing in…" : "Sign in to Admin"}
                </button>
              </form>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm">
                <Link to="/reset-password" className="font-semibold text-[#048B0B] underline underline-offset-2">Forgot password?</Link>
                <Link to="/" className="font-semibold text-[#657065] hover:text-[#048B0B]">Back to Clyse</Link>
              </div>
              <p className="mt-8 border-t border-[#E8EEE8] pt-5 text-xs leading-5 text-[#778177]">Access is verified by Clyse after sign-in. A regular member account will not be granted admin permissions.</p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
