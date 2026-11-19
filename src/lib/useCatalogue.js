import { useEffect, useState } from "react";
import { api } from "./api";

/* Public GET /catalogue returns only approved, active services with active plans.
   Cache briefly to avoid repeated requests, but wake mounted consumers whenever
   an admin catalogue mutation invalidates it. */
let cache = null;
let cacheAt = 0;
let catCache = null;
let catCacheAt = 0;
let catalogueRevision = 0;
let catalogueRequest = null;
let categoriesRequest = null;
const subscribers = new Set();
const CACHE_TTL = 30_000;
let focusRefreshBound = false;

function bindFocusRefresh() {
  if (focusRefreshBound || typeof window === "undefined") return;
  focusRefreshBound = true;
  window.addEventListener("focus", () => {
    const staleServices = cache === null || Date.now() - cacheAt >= CACHE_TTL;
    const staleCategories = catCache === null || Date.now() - catCacheAt >= CACHE_TTL;
    if (staleServices || staleCategories) invalidateCatalogue();
  });
}

export function invalidateCatalogue() {
  cache = null;
  cacheAt = 0;
  catCache = null;
  catCacheAt = 0;
  catalogueRequest = null;
  categoriesRequest = null;
  catalogueRevision += 1;
  subscribers.forEach((notify) => notify(catalogueRevision));
}

export const refreshCatalogue = invalidateCatalogue;

function requestServices(revision) {
  if (cache !== null && Date.now() - cacheAt < CACHE_TTL) return Promise.resolve(cache);
  if (catalogueRequest?.revision === revision) return catalogueRequest.promise;

  const promise = (async () => {
    try {
      const { data, error } = await api("/catalogue", { auth: false });
      if (revision !== catalogueRevision) return null;
      if (error) return [];
      const rows = Array.isArray(data?.services)
        ? data.services
        : Array.isArray(data?.catalogue)
          ? data.catalogue
          : [];
      cache = rows;
      cacheAt = Date.now();
      return rows;
    } catch {
      return [];
    }
  })().finally(() => {
    if (catalogueRequest?.promise === promise) catalogueRequest = null;
  });
  catalogueRequest = { revision, promise };
  return promise;
}

function requestCategories(revision) {
  if (catCache !== null && Date.now() - catCacheAt < CACHE_TTL) return Promise.resolve(catCache);
  if (categoriesRequest?.revision === revision) return categoriesRequest.promise;

  const promise = (async () => {
    try {
      const { data, error } = await api("/catalogue/categories", { auth: false });
      if (revision !== catalogueRevision) return null;
      if (error) return [];
      const rows = Array.isArray(data?.categories) ? data.categories : [];
      catCache = rows;
      catCacheAt = Date.now();
      return rows;
    } catch {
      return [];
    }
  })().finally(() => {
    if (categoriesRequest?.promise === promise) categoriesRequest = null;
  });
  categoriesRequest = { revision, promise };
  return promise;
}

function subscribe(setRevision, reset) {
  const notify = (revision) => {
    reset();
    setRevision(revision);
  };
  subscribers.add(notify);
  bindFocusRefresh();
  return () => subscribers.delete(notify);
}

export function useCatalogue() {
  const [revision, setRevision] = useState(catalogueRevision);
  const [services, setServices] = useState(cache);

  useEffect(() => subscribe(setRevision, () => setServices(null)), []);

  useEffect(() => {
    let live = true;
    const requestRevision = revision;
    requestServices(requestRevision).then((rows) => {
      if (live && requestRevision === catalogueRevision) setServices(rows || []);
    });
    return () => { live = false; };
  }, [revision]);

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

/** Pick the cheapest priced plan (matches the cards' "From ₦…" price). */
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

export function useCatalogueCategories() {
  const [revision, setRevision] = useState(catalogueRevision);
  const [cats, setCats] = useState(catCache);

  useEffect(() => subscribe(setRevision, () => setCats(null)), []);

  useEffect(() => {
    let live = true;
    const requestRevision = revision;
    requestCategories(requestRevision).then((rows) => {
      if (live && requestRevision === catalogueRevision) setCats(rows || []);
    });
    return () => { live = false; };
  }, [revision]);

  return cats;
}
