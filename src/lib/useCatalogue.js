import { useEffect, useState } from "react";
import { api } from "./api";

/* Public catalogue (GET /catalogue, no auth): rows shaped
   { service: { id, name, slug, category, ... }, plans: [...] }.
   Plan totals are `total_kobo`. Cached module-wide for the session. */
let cache = null;

export function useCatalogue() {
  const [services, setServices] = useState(cache);

  useEffect(() => {
    if (cache) return;
    let live = true;
    (async () => {
      const { data } = await api("/catalogue", { auth: false });
      if (!live || !data) return;
      cache = data.services || data.catalogue || [];
      setServices(cache);
    })();
    return () => {
      live = false;
    };
  }, []);

  return services;
}

/** Match a creation-flow card (netflix/spotify/…/amazon) to a catalogue entry. */
export function matchService(services, brand) {
  const list = services || [];
  const key = (brand || "").toLowerCase();
  if (!key) return null;
  return (
    list.find((a) => (a.service?.slug || "").toLowerCase().includes(key)) ||
    list.find((a) => (a.service?.name || "").toLowerCase().includes(key)) ||
    null
  );
}

function planTotal(p) {
  return p.total_kobo ?? p.total_price_kobo ?? p.unit_price_kobo ?? Infinity;
}

/** Pick the cheapest plan (matches the cards' "From ₦…" price). */
export function pickPlan(entry) {
  const plans = entry?.plans || entry?.catalogue_plans || [];
  return plans.reduce((best, p) => {
    const t = planTotal(p);
    const b = best ? planTotal(best) : Infinity;
    return t < b ? p : best;
  }, null);
}

/** Lowest plan total for a card, or null while loading/unmatched. */
export function minPrice(services, brand) {
  const entry = matchService(services, brand);
  const plans = entry?.plans || entry?.catalogue_plans || [];
  const min = plans.reduce((m, p) => Math.min(m, planTotal(p)), Infinity);
  return min === Infinity ? null : min;
}
