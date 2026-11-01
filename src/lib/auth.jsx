import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api, getSession, setSession } from "./api";
import { AuthCtx, useAuth } from "./useAuth";

const USER_KEY = "clyse.user";

function loadUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(loadUser);
  const [ready, setReady] = useState(false);

  const saveUser = useCallback((next) => {
    setUserState(next || null);
    if (next) localStorage.setItem(USER_KEY, JSON.stringify(next));
    else localStorage.removeItem(USER_KEY);
  }, []);

  // On boot: if a session exists, validate it against /auth/me.
  useEffect(() => {
    (async () => {
      const session = getSession();
      if (!session?.access_token) {
        setReady(true);
        return;
      }
      const { data } = await api("/auth/me");
      if (data?.user) saveUser(data.user);
      else {
        setSession(null);
        saveUser(null);
      }
      setReady(true);
    })();
  }, [saveUser]);

  // Sessions nest as { data: { session: {...}, user } } — expires_at is
  // unix seconds, kept verbatim (api.js converts when comparing).
  const applySession = useCallback(
    (data) => {
      const s = data?.session;
      if (s?.access_token) {
        setSession({
          access_token: s.access_token,
          refresh_token: s.refresh_token,
          expires_at: s.expires_at,
        });
      }
      if (data?.user) saveUser(data.user);
    },
    [saveUser],
  );

  const register = useCallback(
    ({ fullName, email, phone, password }) =>
      api("/auth/register", {
        method: "POST",
        auth: false,
        body: {
          full_name: fullName,
          ...(email ? { email } : { phone }),
          password,
        },
      }),
    [],
  );

  const verify = useCallback(
    async (identifier, code) => {
      const res = await api("/auth/verify", {
        method: "POST",
        auth: false,
        body: { ...identifier, code },
      });
      if (res.data) applySession(res.data);
      return res;
    },
    [applySession],
  );

  const resend = useCallback(
    (identifier) =>
      api("/auth/otp/resend", { method: "POST", auth: false, body: { ...identifier } }),
    [],
  );

  const login = useCallback(
    async (identifier, password) => {
      const res = await api("/auth/login", {
        method: "POST",
        auth: false,
        body: { ...identifier, password },
      });
      if (res.data) applySession(res.data);
      return res;
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    // Logout takes no body — it revokes the caller's refresh token.
    await api("/auth/logout", { method: "POST" });
    setSession(null);
    saveUser(null);
  }, [saveUser]);

  const forgot = useCallback(
    (identifier) =>
      api("/auth/password/forgot", { method: "POST", auth: false, body: { ...identifier } }),
    [],
  );

  const resetPassword = useCallback(
    (identifier, code, newPassword) =>
      api("/auth/password/reset", {
        method: "POST",
        auth: false,
        body: { ...identifier, code, new_password: newPassword },
      }),
    [],
  );

  // Signed-in password change (needs the current password; signs out
  // everywhere on success, so the caller must log out locally too).
  const changePassword = useCallback(
    async (currentPassword, newPassword) => {
      const res = await api("/auth/password/change", {
        method: "POST",
        body: { current_password: currentPassword, new_password: newPassword },
      });
      if (!res.error) {
        setSession(null);
        saveUser(null);
      }
      return res;
    },
    [saveUser],
  );

  const refreshUser = useCallback(async () => {
    const { data } = await api("/auth/me");
    if (data?.user) saveUser(data.user);
    return data?.user || null;
  }, [saveUser]);

  return (
    <AuthCtx.Provider
      value={{ user, ready, register, verify, resend, login, logout, forgot, resetPassword, changePassword, refreshUser }}
    >
      {children}
    </AuthCtx.Provider>
  );
}

/** Layout route: redirects visitors without a session to /signin. */
export function RequireAuth() {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) return null;
  if (!user) {
    try {
      sessionStorage.setItem("clyse.post_auth", location.pathname + location.search);
    } catch {}
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}
