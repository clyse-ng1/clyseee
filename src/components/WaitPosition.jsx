import { useEffect, useState } from "react";
import { api } from "../lib/api";

/* Inline "your position" line for one plan, from the documented
   GET /member/waitlist/status?plan_id= (404 not_on_waitlist = not queued).
   Used on the Join/Join-Waitlist plan picker so a member can see their place
   on a plan before committing to it, instead of only afterwards on My Waitlist.
   Renders nothing at all when the member is not on that waitlist, so the plan
   cards look untouched in the normal case. */
export default function WaitPosition({ planId }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (!planId) return undefined;
    let live = true;
    (async () => {
      const { data, error } = await api(
        `/member/waitlist/status?plan_id=${encodeURIComponent(planId)}`,
      );
      if (!live) return;
      if (error) {
        setState(null);
        return;
      }
      setState(data || null);
    })();
    return () => {
      live = false;
    };
  }, [planId]);

  if (!state) return null;

  const pos = state.position;
  const waiting = state.waiting_count;
  const available = state.group_available === true;

  return (
    <p className="mt-[6px] text-[12px] leading-[17px] font-semibold text-[#66726C]">
      {pos ? `You're #${pos} on this waitlist` : "You're on this waitlist"}
      {waiting != null ? ` · ${waiting} waiting` : ""}
      {available ? " · a group is available" : ""}
    </p>
  );
}
