import { useEffect, useState } from "react";
import { api } from "./api";

/** Resolve the membership id: route state first, else the user's first subscription. */
export function useMembershipId(stateId) {
  const [id, setId] = useState(stateId || null);
  const [resolved, setResolved] = useState(!!stateId);

  useEffect(() => {
    if (stateId) return;
    let live = true;
    (async () => {
      const { data } = await api("/member/subscriptions");
      const list = data?.subscriptions || data?.memberships || [];
      if (live) {
        setId(list[0]?.membership_id || list[0]?.id || null);
        setResolved(true);
      }
    })();
    return () => {
      live = false;
    };
  }, [stateId]);

  return [id, resolved];
}

/** One membership's detail + access credentials. Access is keyed by group_id,
 *  so the detail fetch runs first and its group_id drives the access call. */
export function useSubscription(membershipId) {
  const [state, setState] = useState({
    loading: true,
    membership: null,
    access: null,
    error: null,
  });

  useEffect(() => {
    if (!membershipId) return;
    let live = true;
    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      const m = await api(
        `/member/memberships/detail?membership_id=${membershipId}`,
      );
      if (!live) return;
      if (m.error) {
        setState({ loading: false, membership: null, access: null, error: m.error });
        return;
      }
      const membership = m.data?.membership || m.data || null;
      const groupId = membership?.group_id;
      // Access may legitimately be missing; only a detail failure is fatal.
      const a = groupId
        ? await api(`/member/access?group_id=${groupId}`)
        : { data: null };
      if (!live) return;
      setState({ loading: false, membership, access: a.data || null, error: null });
    })();
    return () => {
      live = false;
    };
  }, [membershipId]);

  return state;
}
