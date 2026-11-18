import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
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
  return (
    <AdminShell active="subscriptions" sub="services" expand>
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
        <DarkButton className="ml-auto h-[60px] w-[231px] gap-[10px] text-[18px]" onClick={() => nav("/admin/subscriptions/add")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
            <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
          Add Subscription
        </DarkButton>
      </div>

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
          <DarkButton className="h-[56px] w-[230px] gap-[10px] text-[18px]" onClick={() => nav("/admin/subscriptions/add")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
              <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
            Edit Subscription
          </DarkButton>
        </div>
      </div>
    </AdminShell>
  );
}
