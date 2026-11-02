import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/useAuth";
import AdminLogin from "../pages/AdminLogin";

export default function RequireAdmin() {
  const { user, ready } = useAuth();
  const [probe, setProbe] = useState({ userId: null, attempt: null, status: "checking" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!ready || !user?.id) return undefined;
    let live = true;
    (async () => {
      const { error, status } = await api("/admin/dashboard");
      if (!live) return;
      setProbe({
        userId: user.id,
        attempt,
        status: error ? (status === 403 ? "denied" : "error") : "allowed",
      });
    })();
    return () => { live = false; };
  }, [ready, user?.id, attempt]);

  if (!ready) {
    return <div role="status" aria-live="polite" className="grid min-h-screen place-items-center bg-[#F4F8F4] text-sm font-semibold text-[#66726C]">Checking your Clyse account…</div>;
  }
  if (!user) return <AdminLogin />;
  if (probe.userId !== user.id || probe.attempt !== attempt || probe.status === "checking") {
    return <div role="status" aria-live="polite" className="grid min-h-screen place-items-center bg-[#F4F8F4] text-sm font-semibold text-[#66726C]">Verifying administrator access…</div>;
  }
  if (probe.status === "denied") return <AdminLogin denied />;
  if (probe.status === "error") return <AdminLogin onRetry={() => setAttempt((value) => value + 1)} />;
  return <Outlet />;
}
