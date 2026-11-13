import { useEffect, useMemo, useState } from "react";
import { api, fmtTx } from "../lib/api";
import {
  MemberPage,
  Panel,
  EventRow,
  Empty,
  ErrorText,
  humanise,
} from "../components/MemberPage";
import iconQaClock from "../assets/qa-clock.svg";

/* Waitlist activity — GET /member/waitlist/history (joined / left / notified /
   converted). The My Waitlist page only shows the current state, so this is
   the trail behind it. Plan names are resolved from the waitlist rows and the
   public catalogue, so the trail prints "Canva Pro · Team" instead of a uuid. */

const VERB = {
  joined: "Joined the waitlist",
  left: "Left the waitlist",
  notified: "A group became available",
  converted: "Converted to a membership",
};

function planLabelFor(planId, { waits, catalogue }) {
  for (const w of waits || []) {
    if (w.plan_id === planId) {
      return [w.service?.name, w.plan?.name].filter(Boolean).join(" · ") || "Plan";
    }
  }
  for (const s of catalogue || []) {
    const p = (s.plans || []).find((x) => x.id === planId);
    if (p) return [s.name, p.name].filter(Boolean).join(" · ");
  }
  return "Plan";
}

export function WaitlistHistory() {
  const [events, setEvents] = useState(null);
  const [waits, setWaits] = useState([]);
  const [catalogue, setCatalogue] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      const [hist, wl, cat] = await Promise.all([
        api("/member/waitlist/history?limit=50"),
        api("/member/waitlist"),
        api("/catalogue?limit=100", { auth: false }),
      ]);
      if (!live) return;
      if (hist.error) {
        setError(hist.error.message || "Could not load your waitlist activity.");
        setEvents([]);
        return;
      }
      setEvents(hist.data?.events || []);
      setWaits(wl.data?.waitlists || []);
      setCatalogue(cat.data?.services || []);
    })();
    return () => {
      live = false;
    };
  }, []);

  const rows = useMemo(
    () =>
      (events || []).map((e, i) => ({
        key: `${e.event_type}-${e.created_at}-${i}`,
        title: VERB[e.event_type] || humanise(e.event_type),
        note: planLabelFor(e.plan_id, { waits, catalogue }),
        time: fmtTx(e.created_at),
        tone:
          e.event_type === "converted"
            ? "good"
            : e.event_type === "left"
              ? "bad"
              : e.event_type === "notified"
                ? "open"
                : "info",
      })),
    [events, waits, catalogue],
  );

  return (
    <MemberPage
      active="My Waitlist"
      title="Waitlist Activity"
      sub="Every time you joined, left or were notified about a waitlist."
      icon={<img src={iconQaClock} alt="" className="h-[24px] w-[24px]" />}
    >
      <Panel>
        {error ? (
          <ErrorText text={error} />
        ) : events === null ? (
          <p className="text-[15px] font-semibold text-[#6B6B6B]">Loading activity…</p>
        ) : rows.length === 0 ? (
          <Empty text="No waitlist activity yet. Join a waitlist to start the trail." />
        ) : (
          <ol className="m-0 list-none p-0">
            {rows.map((r, i) => (
              <EventRow key={r.key} {...r} last={i === rows.length - 1} />
            ))}
          </ol>
        )}
      </Panel>
    </MemberPage>
  );
}
