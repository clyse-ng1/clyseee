import { useEffect, useState } from "react";
import { api } from "./api";

/** Resolve the creator group id: route state first, else the user's first group. */
export function useGroupId(stateId) {
  const [id, setId] = useState(stateId || null);
  const [resolved, setResolved] = useState(!!stateId);

  useEffect(() => {
    if (stateId) return;
    let live = true;
    (async () => {
      const { data } = await api("/member/groups");
      const list = data?.groups || [];
      if (live) {
        setId(list[0]?.id || null);
        setResolved(true);
      }
    })();
    return () => {
      live = false;
    };
  }, [stateId]);

  return [id, resolved];
}

/** API group status -> UI bucket: active | pending | expired | failed. */
export function groupBucket(g) {
  const s = (g?.status || "active").toLowerCase();
  if (s === "active") return "active";
  if (s === "pending_review" || s === "pending") return "pending";
  if (s === "closed" || s === "expired") return "expired";
  return "failed";
}
