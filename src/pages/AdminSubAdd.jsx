import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import AdminShell, { DarkButton, ChevDown } from "../components/AdminShell";

/* Add Subscription — Figma 1112:43005 (empty) / 1149:23164 (filled) /
   1149:23714 (success). Card r20 border #999, inputs h56 r10 border
   #048B0B, upload box 515x220, Cancel #F1F8F2, Create dark 250x56. */

const LABEL = "text-[16px] leading-[20px] font-semibold text-[#001701]";
const INPUT =
  "h-[56px] w-full rounded-[10px] border border-[#048B0B] bg-white px-[20px] text-[16px] leading-[20px] font-semibold text-[#001701] placeholder-[#9F9F9F] focus:outline-none";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className={LABEL}>{label}</span>
      <span className="mt-[10px] block">{children}</span>
    </label>
  );
}

/* The catalogue API needs a service, then a plan, then activation — a plan
   carries capacity, unit price, billing interval and supported access methods
   (credentials / invite_link / other). Everything typed here maps onto those
   documented fields; nothing is posted that the API would ignore. */
const CATEGORIES = ["streaming", "music", "gaming", "software", "education", "productivity", "news", "sports", "other"];
const ACCESS_MAP = {
  "Access Link": "invite_link",
  "Login Credential": "credentials",
  Other: "other",
};

export default function AdminSubAdd() {
  const nav = useNavigate();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", plans: [{ name: "", period: "", price: "", fee: "" }], features: "", capacity: "", access: "Access Link" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPlan = (index, key) => (e) => setForm((f) => ({
    ...f,
    plans: f.plans.map((plan, i) => i === index ? { ...plan, [key]: e.target.value } : plan),
  }));
  const addPlan = () => setForm((f) => ({ ...f, plans: [...f.plans, { name: "", period: "", price: "", fee: "" }] }));
  const [busy, setBusy] = useState(false);
  const [logoName, setLogoName] = useState("");
  const [err, setErr] = useState("");

  const slugify = (v) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const create = async () => {
    setErr("");
    if (!form.name.trim()) return setErr("Subscription name is required.");
    if (!form.plans.length) return setErr("Add at least one plan.");
    const capacity = Number(form.capacity);
    if (!Number.isInteger(capacity) || capacity < 1) return setErr("Enter a whole-number slot capacity greater than zero.");
    for (const [index, plan] of form.plans.entries()) {
      if (!plan.name.trim()) return setErr(`Enter a name for Plan ${index + 1}.`);
      if (periodMonths(plan.period) == null) return setErr(`Enter a valid billing period for Plan ${index + 1} (months, quarterly, or yearly).`);
      const price = Number(plan.price);
      if (!plan.price.trim() || !Number.isFinite(price) || price <= 0) return setErr(`Enter a valid price greater than zero for Plan ${index + 1}.`);
      const fee = plan.fee.trim() ? Number(plan.fee) : 0;
      if (!Number.isFinite(fee) || fee < 0) return setErr(`Enter a valid non-negative Clyse fee for Plan ${index + 1}.`);
    }
    setBusy(true);
    let serviceId = null;
    const createdPlanIds = [];
    try {
    const svc = await api("/admin/catalogue/services", {
      method: "POST",
      body: { name: form.name.trim(), slug: slugify(form.name), category: (form.category || "other").toLowerCase().trim(), logo_path: null },
    });
    if (svc.error || !svc.data?.service?.id) {
      setBusy(false);
      return setErr(svc.error?.message || "Could not create the subscription service.");
    }
    serviceId = svc.data.service.id;

    /* Services and plans begin inactive. Create and activate every plan first;
       the API rejects activating a service without an active plan. */
    for (const [index, input] of form.plans.entries()) {
      const plan = await api("/admin/catalogue/plans", {
        method: "POST",
        body: {
          service_id: serviceId,
          name: input.name.trim(),
          member_slot_capacity: capacity,
          unit_price_kobo: Math.round(Number(input.price) * 100),
          platform_fee_kobo: Math.round(Number(input.fee || 0) * 100),
          billing_interval_months: periodMonths(input.period),
          supported_access_methods: [ACCESS_MAP[form.access] || "invite_link"],
        },
      });
      if (plan.error || !plan.data?.plan?.id) {
        setBusy(false);
        return setErr(`Service ${serviceId} was created, but Plan ${index + 1} could not be added${plan.error?.message ? `: ${plan.error.message}` : ". Complete it from the catalogue before activating the service."}`);
      }
      const planId = plan.data.plan.id;
      createdPlanIds.push(planId);
      const planOn = await api("/admin/catalogue/plans/status", { method: "POST", body: { plan_id: planId, is_active: true } });
      if (planOn.error) {
        setBusy(false);
        return setErr(`Plan ${planId} was created but could not be activated${planOn.error.message ? `: ${planOn.error.message}` : "; the service remains inactive."}`);
      }
    }

    const svcOn = await api("/admin/catalogue/services/status", { method: "POST", body: { service_id: serviceId, is_active: true } });
    if (svcOn.error) {
      setBusy(false);
      return setErr(`Plans ${createdPlanIds.join(", ")} were created, but service ${serviceId} could not be activated${svcOn.error.message ? `: ${svcOn.error.message}` : "."}`);
    }
    setBusy(false);
    setDone(true);
    } catch (error) {
      const partial = serviceId ? `Some records may already exist (service ${serviceId}${createdPlanIds.length ? `; plans ${createdPlanIds.join(", ")}` : ""}).` : "No service was confirmed as created.";
      setErr(`${partial} ${error?.message || "The request did not complete; check the catalogue before retrying."}`);
    } finally {
      setBusy(false);
    }
  };

  function periodMonths(v) {
    const k = String(v || "").trim().toLowerCase();
    if (/^(year|yearly|annual|annually|12 months?)$/.test(k)) return 12;
    if (/^(quarter|quarterly|3 months?)$/.test(k)) return 3;
    if (/^(month|monthly|1 month?)$/.test(k)) return 1;
    const months = Number(k);
    return Number.isInteger(months) && months > 0 && months <= 120 ? months : null;
  }

  return (
    <AdminShell active="subscriptions" sub="services" expand>
      {/* Header */}
      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          onClick={() => nav(-1)}
          aria-label="Go back"
          className="grid h-[35px] w-[35px] flex-none place-items-center rounded-full bg-[#F1F8F2] shadow-[0_4px_10px_rgba(0,23,1,0.10)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 5 8 12l7 7" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-[35px] leading-[43px] font-bold text-[#001701]">Add Subscription</h1>
        <DarkButton className="ml-auto h-[60px] w-[231px] gap-[10px] text-[18px]" onClick={create} disabled={busy || done}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
            <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Add Subscription
        </DarkButton>
      </div>

      {done ? (
        /* Success — Figma 1149:23714 */
        <div className="mt-[235px] rounded-[20px] border border-[#999999] bg-white px-[30px] pt-[100px] pb-[101px]">
          <div className="flex flex-col items-center">
            <span className="grid h-[130px] w-[130px] place-items-center rounded-full bg-[#048B0B]">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="m5 12.5 4.5 4.5L19 7.5" stroke="#B1DBB3" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <p className="mt-[53px] text-[35px] leading-[43px] font-bold text-[#001701]">Subscription Created</p>
            <p className="mt-[12px] text-[18px] leading-[22px] font-semibold text-[#4E4E4E]">
              The subscription service and its plans are now active in the catalogue.
            </p>
            <DarkButton className="mt-[43px] h-[56px] w-[470px] text-[18px]" onClick={() => nav("/admin/subscriptions")}>
              Ok
            </DarkButton>
          </div>
        </div>
      ) : (
        <div className="mt-[36px] rounded-[20px] border border-[#999999] bg-white px-[22px] pt-[44px] pb-[42px]">
          <p className="text-[24px] leading-[29px] font-bold text-[#001701]">Basic Information</p>
          <div className="mt-[34px] flex flex-col gap-[40px] lg:flex-row">
            {/* left column */}
            <div className="flex w-full flex-col lg:w-[515px]">
              <Field label="Subscription Name">
                <input className={INPUT} placeholder="Enter Subscription Name" value={form.name} onChange={set("name")} />
              </Field>
              <div className="mt-[39px]">
                <span className={LABEL}>Subscription Logo</span>
                <label className="mt-[10px] flex h-[220px] w-full cursor-pointer flex-col items-center justify-center gap-[24px] rounded-[10px] border border-[#048B0B] bg-white">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="sr-only"
                    onChange={(e) => setLogoName(e.target.files?.[0]?.name || "")}
                  />
                  <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
                    <path d="M25 45a18 18 0 0 1 3-35.7A24 24 0 0 1 74 15a17 17 0 0 1-4 33.5H25Z" fill="#ABABAB" />
                    <path d="M45 52V28m0 0-9 9m9-9 9 9" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[24px] leading-[29px] font-semibold text-[#ABABAB]">
                    {logoName || "Upload Subscription Invoice"}
                  </span>
                </label>
              </div>
              <Field label="Subscription Features" className="mt-[50px]">
                <input className={INPUT} placeholder="Enter Subscription Features" value={form.features} onChange={set("features")} />
              </Field>
            </div>
            {/* right column */}
            <div className="flex w-full flex-1 flex-col">
              <Field label="Category">
                <span className="relative block">
                  <select value={form.category} onChange={set("category")} className={`${INPUT} appearance-none`}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute top-[16px] right-[20px]">
                    <ChevDown color="#ABABAB" />
                  </span>
                </span>
              </Field>
              {form.plans.map((plan, index) => (
                <div key={`plan-${index}`} className={index === 0 ? "mt-[74px]" : "mt-[24px] rounded-[10px] border border-[#D9E5D9] p-[14px]"}>
                  {index > 0 && (
                    <div className="mb-[14px] flex items-center justify-between">
                      <p className={LABEL}>Plan {index + 1}</p>
                      <button type="button" onClick={() => setForm((f) => ({ ...f, plans: f.plans.filter((_, i) => i !== index) }))} className="text-[14px] font-semibold text-[#B42318] hover:underline">Remove</button>
                    </div>
                  )}
                  <div className="flex gap-[21px]">
                    <Field label={index === 0 ? "Plans" : `Plan ${index + 1}`} className="flex-1">
                      <input className={INPUT} placeholder="Enter Plan" value={plan.name} onChange={setPlan(index, "name")} />
                    </Field>
                    <Field label="Billing Period" className="flex-1">
                      <input className={INPUT} placeholder="e.g. Monthly, Quarterly, Yearly" value={plan.period} onChange={setPlan(index, "period")} />
                    </Field>
                  </div>
                  <div className="mt-[24px] flex gap-[21px]">
                    <Field label="Fixed Unit Price (N)" className="flex-1">
                      <input className={INPUT} inputMode="decimal" placeholder="Enter Price" value={plan.price} onChange={setPlan(index, "price")} />
                    </Field>
                    <Field label="Clyse Fee (N)" className="flex-1">
                      <input className={INPUT} inputMode="decimal" placeholder="Enter Fee" value={plan.fee} onChange={setPlan(index, "fee")} />
                    </Field>
                  </div>
                </div>
              ))}
              <div className="mt-[28px] flex justify-end">
                <DarkButton type="button" className="h-[56px] w-[200px] gap-[10px] text-[18px]" onClick={addPlan} disabled={busy}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
                    <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                  Add Plan
                </DarkButton>
              </div>
            </div>
          </div>

          <p className="mt-[34px] text-[24px] leading-[29px] font-bold text-[#001701]">Capacity and Access</p>
          <div className="mt-[34px] flex flex-col gap-[40px] lg:flex-row">
            <Field label="Total Subscription Capacity" className="w-full lg:w-[515px]">
              <input className={INPUT} placeholder="Enter Subscription Capacity" value={form.capacity} onChange={set("capacity")} />
            </Field>
            <label className="block w-full flex-1">
              <span className={LABEL}>Supported Access Method</span>
              <span className="relative mt-[10px] block">
                <select
                  value={form.access}
                  onChange={set("access")}
                  className="h-[56px] w-full appearance-none rounded-[10px] border border-[#B2B2B2] bg-white px-[20px] text-[16px] leading-[20px] font-semibold text-[#001701] focus:outline-none"
                >
                  <option>Access Link</option>
                  <option>Login Credential</option>
                  <option>Other</option>
                </select>
                <span className="pointer-events-none absolute top-[16px] right-[20px]">
                  <ChevDown color="#ABABAB" />
                </span>
              </span>
            </label>
          </div>

          {err && (
            <p className="mt-[30px] text-right text-[16px] leading-[20px] font-semibold text-[#FF0000]">{err}</p>
          )}
          <div className="mt-[58px] flex flex-wrap justify-end gap-[43px]">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="h-[56px] w-[198px] rounded-[10px] bg-[#F1F8F2] text-[18px] leading-[22px] font-semibold text-[#001701]"
            >
              Cancel
            </button>
            <DarkButton className="h-[56px] w-[250px] gap-[10px] text-[18px]" onClick={create}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
                <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              {busy ? "Creating…" : "Create Subscription"}
            </DarkButton>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
