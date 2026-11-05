import { api } from "./api";

/* One shared, synchronous read of the member's groups.
 *
 * Why this exists: /groups used to decide "does this member have any groups?"
 * only after the network answered. Until then it painted the full populated
 * layout — stat cards, tab counts, four card skeletons — and then replaced all
 * of it with the empty state. For a member with no groups that reads as a
 * flash of a page they never had.
 *
 * Now the answer is fetched once, kept in module scope, and read synchronously
 * on first render. A warm cache means the very first paint is already correct,
 * so there is nothing to swap out.
 */

let cached = null; // null = unknown, [] = known-empty, [...] = the groups
let inflight = null;
const listeners = new Set();

/** Synchronous read. null means "not known yet". */
export function readGroups() {
  return cached;
}

export function setGroups(list) {
  if (!Array.isArray(list)) return;
  cached = list;
  listeners.forEach((fn) => fn(cached));
}

/** Force the next read to be treated as unknown (e.g. after creating a group). */
export function invalidateGroups() {
  cached = null;
  inflight = null;
}

export function subscribeGroups(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Fetch once; concurrent callers share the same request. */
export function loadGroups() {
  if (inflight) return inflight;
  inflight = api("/member/groups")
    .then(({ data, error }) => {
      inflight = null;
      if (error) return { error };
      const list = Array.isArray(data?.groups) ? data.groups : [];
      setGroups(list);
      return { data: list };
    })
    .catch((error) => {
      inflight = null;
      return { error };
    });
  return inflight;
}
