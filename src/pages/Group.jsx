import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer, MobileFooter } from "../components/Footer";
import { BlurBg } from "../components/Decor";
import BrandTile from "../components/BrandTile";
import { api, accessLabel, brandOf, kobo, titleCase, totalPriceKobo } from "../lib/api";
import { useCatalogue } from "../lib/useCatalogue";
import iconChevron from "../assets/icon-chevron.svg";

/* Public subscription-group listing. The old version rendered seven invented
   members and a hard-coded Netflix price for every service; this view now loads
   the selected service and its open groups from the public catalogue API. */
function groupOwner(group) {
  return [group.creator?.first_name, group.creator?.last_name].filter(Boolean).join(" ") || "Creator";
}

function slots(group) {
  const open = group.open_slots ?? group.available_slots;
  const capacity = group.slots_offered ?? group.capacity ?? group.plan?.member_slot_capacity;
  const occupied = group.occupied_slots ?? (capacity != null && open != null ? Math.max(0, capacity - open) : null);
  return {
    open: open == null ? "Availability not reported" : `${open} ${Number(open) === 1 ? "slot" : "slots"} left`,
    ratio: occupied == null || capacity == null ? "—" : `${occupied}/${capacity}`,
    pct: occupied == null || !capacity ? 0 : Math.max(0, Math.min(100, Math.round((occupied / capacity) * 100))),
  };
}

function GroupCard({ group }) {
  const service = group.service || {};
  const plan = group.plan || {};
  const slot = slots(group);
  const total = totalPriceKobo(group);
  const verification = group.verification_status ? titleCase(group.verification_status) : "";
  const joinState = { group_id: group.group_id || group.id, preview: group };
  return (
    <article className="overflow-hidden rounded-[18px] border border-[#D7E3D7] bg-white shadow-[0_4px_14px_rgba(0,23,1,0.08)]">
      <div className="flex items-center gap-4 border-b border-[#EDF2ED] p-5">
        <BrandTile brand={brandOf(service)} name={service.name} category={service.category} size={56} plain />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[18px] font-bold text-[#001701]">{service.name || "Subscription group"}</h2>
          <p className="truncate text-[14px] font-semibold text-[#687568]">{plan.name || titleCase(service.category || "Group")}</p>
        </div>
        {verification && <span className="rounded-full bg-[#E5FFE7] px-3 py-1 text-[11px] font-bold text-[#048B0B]">{verification}</span>}
      </div>
      <div className="p-5">
        <p className="text-[16px] font-bold text-[#001701]">{groupOwner(group)}’s group</p>
        <p className="mt-1 text-[13px] font-semibold text-[#687568]">{accessLabel(group.access_method) || "Access method not listed"}</p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E7EEE7]"><span className="block h-full rounded-full bg-[#048B0B]" style={{ width: `${slot.pct}%` }} /></div>
        <div className="mt-2 flex items-center justify-between gap-3 text-[13px] font-semibold text-[#596659]">
          <span>{slot.open}</span><span>{slot.ratio} occupied</span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-4">
          <p className="text-[18px] font-bold text-[#001701]">{total == null ? "Price unavailable" : kobo(total)}<span className="ml-1 text-[12px] font-semibold text-[#687568]">per billing period</span></p>
          <Link to="/join/summary" state={joinState} className="rounded-lg bg-[#001701] px-5 py-3 text-[14px] font-bold text-white hover:bg-[#048B0B]">View group</Link>
        </div>
      </div>
    </article>
  );
}

export default function Group() {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const catalogue = useCatalogue();
  const [service, setService] = useState(null);
  const [groups, setGroups] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("relevant");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let live = true;
    setStatus("loading");
    setError("");
    if (catalogue === null) return () => { live = false; };
    (async () => {
      const key = slug.trim().toLowerCase();
      const normalize = (value) => String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const entry = key ? catalogue.find((row) => {
        const svc = row.service || row;
        return [svc.slug, svc.name, brandOf(svc)].some((candidate) => normalize(candidate) === normalize(key));
      }) : null;
      if (key && !entry) {
        if (live) {
          setService(null);
          setGroups([]);
          setError("This subscription is not in the catalogue.");
          setStatus("error");
        }
        return;
      }
      const selected = entry ? (entry.service || entry) : null;
      const result = await api("/catalogue/groups?limit=50", { auth: false });
      if (!live) return;
      if (result.error) {
        setService(selected);
        setGroups([]);
        setError(result.error.message || "Available groups could not be loaded.");
        setStatus("error");
        return;
      }
      const rows = Array.isArray(result.data?.groups) ? result.data.groups : [];
      const filtered = selected ? rows.filter((group) => {
        const groupService = group.service || {};
        if (selected.id != null && (group.service_id != null || groupService.id != null)) {
          return String(group.service_id ?? groupService.id) === String(selected.id);
        }
        return normalize(groupService.slug) === normalize(selected.slug) || normalize(groupService.name) === normalize(selected.name);
      }) : rows;
      setService(selected);
      setGroups(filtered);
      setStatus("live");
    })().catch((err) => {
      if (!live) return;
      setError(err?.message || "Available groups could not be loaded.");
      setStatus("error");
    });
    return () => { live = false; };
  }, [slug, refreshKey, catalogue]);

  const shown = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = (groups || []).filter((group) => {
      const name = groupOwner(group).toLowerCase();
      const serviceName = String(group.service?.name || "").toLowerCase();
      const planName = String(group.plan?.name || "").toLowerCase();
      return !term || name.includes(term) || serviceName.includes(term) || planName.includes(term);
    });
    if (sort === "owner") list.sort((a, b) => groupOwner(a).localeCompare(groupOwner(b)));
    if (sort === "price-low") list.sort((a, b) => (totalPriceKobo(a) ?? Infinity) - (totalPriceKobo(b) ?? Infinity));
    if (sort === "price-high") list.sort((a, b) => (totalPriceKobo(b) ?? -Infinity) - (totalPriceKobo(a) ?? -Infinity));
    return list;
  }, [groups, query, sort]);

  const title = service?.name || (slug ? titleCase(slug) : "Available Subscription Groups");
  return (
    <div className="min-h-screen bg-white font-sans text-[#001701]">
      <Navbar />
      <main className="relative min-h-[70vh] overflow-hidden">
        <BlurBg variant="hero" />
        <div className="relative mx-auto max-w-[1240px] px-5 py-8 xl:px-0 xl:py-14">
          <Link to="/marketplace" aria-label="Back to marketplace" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#DFFFE1] shadow hover:bg-[#C7F1C9]">
            <img src={iconChevron} alt="" className="h-6 w-6 rotate-90" />
          </Link>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              {service && <BrandTile brand={brandOf(service)} name={service.name} category={service.category} size={58} plain />}
              <div><p className="text-sm font-bold uppercase tracking-wide text-[#048B0B]">Subscription groups</p><h1 className="mt-1 text-[28px] font-bold md:text-[35px]">{title}</h1></div>
            </div>
            <Link to="/marketplace" className="text-sm font-bold text-[#048B0B] hover:underline">Browse all subscriptions</Link>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-[#B9CDB9] bg-white px-4">
              <span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search groups or owners" aria-label="Search groups or owners" className="min-w-0 flex-1 outline-none" />
            </label>
            <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort groups" className="h-12 rounded-xl border border-[#B9CDB9] bg-white px-4 font-semibold">
              <option value="relevant">Sort: Recommended</option><option value="owner">Owner name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option>
            </select>
          </div>
          {status === "loading" && <div role="status" className="mt-8 grid gap-5 md:grid-cols-2">{[0, 1, 2, 3].map((item) => <div key={item} className="h-[205px] animate-pulse rounded-[18px] bg-[#EDF3ED]" />)}</div>}
          {status === "error" && <section role="alert" className="mt-8 rounded-2xl border border-[#F2C1BC] bg-white p-8 text-center"><h2 className="text-xl font-bold">Groups couldn’t be loaded</h2><p className="mt-2 text-[#596659]">{error}</p><button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="mt-5 rounded-lg bg-[#001701] px-5 py-3 font-bold text-white">Try again</button></section>}
          {status === "live" && shown.length === 0 && <section className="mt-8 rounded-2xl border border-dashed border-[#B9CDB9] bg-white p-10 text-center"><h2 className="text-xl font-bold">{groups.length ? "No groups match that search" : "No open groups for this subscription yet"}</h2><p className="mt-2 text-[#596659]">{groups.length ? "Clear the search to see all available groups." : "Check back later; listings are loaded from the live catalogue."}</p></section>}
          {status === "live" && shown.length > 0 && <div className="mt-8 grid gap-5 md:grid-cols-2">{shown.map((group, index) => <GroupCard key={group.group_id || group.id || index} group={group} />)}</div>}
        </div>
      </main>
      <Footer /><MobileFooter />
    </div>
  );
}
