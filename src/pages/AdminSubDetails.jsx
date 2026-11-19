import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { invalidateCatalogue } from "../lib/useCatalogue";
import { goBackOr } from "../lib/navigation";
import AdminShell, { DarkButton } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";

/* Subscription details (read-only) — Figma 1149:41825. Card r20 border
   #999; three-column label/value grid; Edit Subscription 230x56 dark. */

const LABEL = "text-[16px] leading-[20px] font-semibold text-[#001701]";
const VALUE = "mt-[10px] text-[18px] leading-[22px] font-semibold text-[#001701]";

function Cell({ label, children }) {
  return (
    <div>
      <p className={LABEL}>{label}</p>
      {children}
    </div>
  );
}

export default function AdminSubDetails() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const serviceId = params.get("service_id") || params.get("id") || "";
  /* Live catalogue detail: GET /admin/catalogue/services/detail?service_id.
     Figma values hold the layout until it answers; nothing is invented when an
     id is missing — the fields read "—". */
  const [svc, setSvc] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editNotice, setEditNotice] = useState("");
  useEffect(() => {
    if (!serviceId) return;
    let alive = true;
    api(`/admin/catalogue/services/detail?service_id=${encodeURIComponent(serviceId)}`).then((res) => {
      if (alive && !res.error && res.data) setSvc(res.data.service || null);
    });
    return () => { alive = false; };
  }, [serviceId]);

  const plan0 = svc?.plans?.[0] || {};
  const features = Array.isArray(plan0.features)
    ? plan0.features.join("  |  ")
    : plan0.features || "—";
  const beginEdit = () => {
    setEditError(""); setEditNotice("");
    setDraft({
      name: svc?.name || "", slug: svc?.slug || "", category: svc?.category || "other",
      planId: plan0.id || plan0.plan_id || "",
      unitPrice: String(Number(plan0.unit_price_kobo ?? plan0.price_kobo ?? 0) / 100),
      platformFee: String(Number(plan0.platform_fee_kobo ?? 0) / 100),
      capacity: String(plan0.member_slot_capacity ?? svc?.member_slot_capacity ?? ""),
    });
    setEditing(true);
  };
  const saveEdit = async (event) => {
    event.preventDefault();
    if (!serviceId || !draft.name.trim() || !draft.slug.trim() || !draft.category.trim()) {
      setEditError("Enter the subscription name, slug, and category."); return;
    }
    const unitPrice = Number(draft.unitPrice);
    const fee = Number(draft.platformFee);
    const capacity = Number(draft.capacity);
    if (draft.planId && (!Number.isFinite(unitPrice) || unitPrice < 0 || !Number.isFinite(fee) || fee < 0 || !Number.isInteger(capacity) || capacity < 1)) {
      setEditError("Enter valid plan prices and a whole-number capacity greater than zero."); return;
    }
    setSaving(true); setEditError("");
    try {
      const serviceRes = await api("/admin/catalogue/services", { method: "PATCH", body: { service_id: serviceId, name: draft.name.trim(), slug: draft.slug.trim(), category: draft.category.trim() } });
      if (serviceRes.error) { setEditError(serviceRes.error.message || "Subscription details could not be updated."); return; }
      if (draft.planId) {
        const planRes = await api("/admin/catalogue/plans", { method: "PATCH", body: { plan_id: draft.planId, unit_price_kobo: Math.round(unitPrice * 100), platform_fee_kobo: Math.round(fee * 100), member_slot_capacity: capacity } });
        if (planRes.error) { setEditError(`Subscription was updated, but its plan was not: ${planRes.error.message || "request failed"}`); return; }
      }
      const refreshed = await api(`/admin/catalogue/services/detail?service_id=${encodeURIComponent(serviceId)}`);
      if (!refreshed.error && refreshed.data) setSvc(refreshed.data.service || refreshed.data);
      invalidateCatalogue();
      setEditing(false); setEditNotice("Subscription updated.");
    } catch {
      setEditError("Could not reach the server. Check the catalogue before retrying.");
    } finally { setSaving(false); }
  };
  return (
    <AdminShell active="subscriptions" sub="services" expand>
      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          onClick={() => goBackOr(nav, "/admin/subscriptions")}
          aria-label="Go back"
          className="grid h-[35px] w-[35px] flex-none place-items-center rounded-full bg-[#F1F8F2] shadow-[0_4px_10px_rgba(0,23,1,0.10)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 5 8 12l7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[35px] leading-[43px] font-bold text-[#001701]">Subscription Details</h1>
        <DarkButton className="ml-auto h-[60px] w-[231px] gap-[10px] text-[18px]" onClick={() => nav("/admin/subscriptions/add")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
            <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Add Subscription
        </DarkButton>
      </div>

      {editNotice && <p role="status" className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-900">{editNotice}</p>}
      {editError && !editing && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-800">{editError}</p>}
      <div className="mt-[36px] rounded-[20px] border border-[#999999] bg-white px-[22px] pt-[44px] pb-[34px]">
        <p className="text-[24px] leading-[29px] font-bold text-[#001701]">Basic Information</p>
        <div className="mt-[58px] grid grid-cols-1 gap-[40px] md:grid-cols-3">
          <Cell label="Subscription Name">
            <span className="mt-[10px] flex items-center gap-[16px]">
              <BrandTile brand={svc?.slug || "generic"} size={50} plain />
              <span className="text-[18px] leading-[22px] font-semibold text-[#001701]">{svc?.name || "—"}</span>
            </span>
          </Cell>
          <Cell label="Category">
            <p className={VALUE}>{svc?.category || "—"}</p>
          </Cell>
          <Cell label="Subscription Plan">
            <p className={VALUE}>{plan0.name || "—"}</p>
          </Cell>
        </div>
        <div className="mt-[41px] grid grid-cols-1 gap-[40px] md:grid-cols-3">
          <Cell label="Billing Period">
            <p className={VALUE}>{plan0.billing_period || plan0.interval || "—"}</p>
          </Cell>
          <Cell label="Fixed Unit Price">
            <p className={VALUE}>{plan0.price != null ? `N${Number(plan0.price / 100).toLocaleString("en-US")}` : "—"}</p>
          </Cell>
          <Cell label="Subscription Features">
            <p className={VALUE}>{features}</p>
          </Cell>
        </div>

        <p className="mt-[51px] text-[24px] leading-[29px] font-bold text-[#001701]">Capacity and Access</p>
        <div className="mt-[28px] grid grid-cols-1 gap-[40px] md:grid-cols-2">
          <Cell label="Total Subscription Capacity">
            <p className={VALUE}>{svc?.group_count != null ? `${svc.group_count} Group` : "—"}</p>
          </Cell>
          <Cell label="Supported Access Method">
            <p className={VALUE}>{svc?.access_method || svc?.access_type || "—"}</p>
          </Cell>
        </div>

        <div className="mt-[44px] flex justify-end">
          <DarkButton className="h-[56px] w-[230px] gap-[10px] text-[18px]" onClick={beginEdit} disabled={!svc}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
              <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            Edit Subscription
          </DarkButton>
        </div>
      </div>
      {editing && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
        <section role="dialog" aria-modal="true" aria-labelledby="edit-subscription-title" className="max-h-[90vh] w-full max-w-[640px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <h2 id="edit-subscription-title" className="text-xl font-bold text-[#001701]">Edit Subscription</h2>
          <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={saveEdit}>
            {[["Subscription name", "name", "text"], ["URL slug", "slug", "text"], ["Category", "category", "text"], ...(draft.planId ? [["Fixed unit price (₦)", "unitPrice", "number"], ["Clyse fee (₦)", "platformFee", "number"], ["Member slot capacity", "capacity", "number"]] : [])].map(([label, key, type]) => <label key={key} className="text-sm font-semibold text-[#243724]">{label}<input type={type} min={type === "number" ? "0" : undefined} step={type === "number" ? "0.01" : undefined} value={draft[key] ?? ""} onChange={(event) => setDraft((old) => ({ ...old, [key]: event.target.value }))} className="mt-1 w-full rounded-lg border border-[#BFC9BF] px-3 py-2.5 outline-none focus:border-[#048B0B]" required /></label>)}
            {editError && <p role="alert" className="sm:col-span-2 rounded-lg bg-red-50 p-3 text-sm font-semibold text-red-800">{editError}</p>}
            <div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={() => setEditing(false)} disabled={saving} className="rounded-lg border border-[#BFC9BF] px-4 py-2.5 font-semibold">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-[#001701] px-5 py-2.5 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Save changes"}</button></div>
          </form>
        </section>
      </div>}
    </AdminShell>
  );
}
