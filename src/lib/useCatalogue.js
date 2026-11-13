import { useEffect, useState } from "react";
import { api } from "./api";

/* Public catalogue (GET /catalogue, no auth): rows may be the service fields
   at the root or nested under `service`, with plans beside them. API plan totals
   are `total_kobo`. Cached module-wide for the session. */
let cache = null;

export function useCatalogue() {
  const [services, setServices] = useState(cache);

  useEffect(() => {
    if (cache) return;
    let live = true;
    (async () => {
      const { data, error } = await api("/catalogue", { auth: false });
      if (!live) return;
      cache = error ? [] : data?.services || data?.catalogue || [];
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
    list.find((a) => `${a.service?.slug || a.slug || ""}`.toLowerCase().includes(key)) ||
    list.find((a) => `${a.service?.name || a.name || ""}`.toLowerCase().includes(key)) ||
    null
  );
}

export function planTotal(p) {
  return p.total_kobo ?? p.total_price_kobo ?? p.unit_price_kobo ?? Infinity;
}

/** Pick the cheapest priced plan (matches the cards' "From ₦…" price).
    Rows with no total (e.g. youtube-premium has none today) are skipped: they
    used to win the reduce with Infinity and then print "N—" all the way
    through the create-group flow. */
export function pickPlan(entry) {
  const plans = (entry?.plans || entry?.catalogue_plans || []).filter((p) =>
    Number.isFinite(planTotal(p)),
  );
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

/* GET /catalogue/categories (docs addition): the categories that actually have
   services, e.g. [{ category: "movies_series", services: 2 }]. Shared cache so
   every screen that renders the chip row makes one request per session. */
let catCache = null;

export function useCatalogueCategories() {
  const [cats, setCats] = useState(catCache);

  useEffect(() => {
    if (catCache) return;
    let live = true;
    (async () => {
      const { data, error } = await api("/catalogue/categories", { auth: false });
      if (!live) return;
      catCache = error ? [] : data?.categories || [];
      setCats(catCache);
    })();
    return () => {
      live = false;
    };
  }, []);

  return cats;
}
