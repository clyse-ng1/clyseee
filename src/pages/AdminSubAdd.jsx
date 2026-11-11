import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function AdminSubAdd() {
  const nav = useNavigate();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", plans: "", period: "", price: "", features: "", capacity: "", access: "" });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

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
        <DarkButton className="ml-auto h-[60px] w-[231px] gap-[10px] text-[18px]">
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
              Your group is now live and visible to member
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
                <button
                  type="button"
                  className="mt-[10px] flex h-[220px] w-full flex-col items-center justify-center gap-[24px] rounded-[10px] border border-[#048B0B] bg-white"
                >
                  <svg width="90" height="70" viewBox="0 0 90 70" fill="none">
                    <path d="M25 45a18 18 0 0 1 3-35.7A24 24 0 0 1 74 15a17 17 0 0 1-4 33.5H25Z" fill="#ABABAB" />
                    <path d="M45 52V28m0 0-9 9m9-9 9 9" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[24px] leading-[29px] font-semibold text-[#ABABAB]">Upload Subscription Invoice</span>
                </button>
              </div>
              <Field label="Subscription Features" className="mt-[50px]">
                <input className={INPUT} placeholder="Enter Subscription Features" value={form.features} onChange={set("features")} />
              </Field>
            </div>
            {/* right column */}
            <div className="flex w-full flex-1 flex-col">
              <Field label="Category">
                <input className={INPUT} placeholder="Enter Category" value={form.category} onChange={set("category")} />
              </Field>
              <div className="mt-[74px] flex gap-[21px]">
                <Field label="Plans" className="flex-1">
                  <input className={INPUT} placeholder="Enter Plan" value={form.plans} onChange={set("plans")} />
                </Field>
                <Field label="Billing Period" className="flex-1">
                  <input className={INPUT} placeholder="Enter Period" value={form.period} onChange={set("period")} />
                </Field>
              </div>
              <Field label="Fixed Unite Price" className="mt-[46px]">
                <input className={INPUT} placeholder="Enter Price" value={form.price} onChange={set("price")} />
              </Field>
              <div className="mt-[45px] flex justify-end">
                <DarkButton className="h-[56px] w-[200px] gap-[10px] text-[18px]">
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
                <select className="h-[56px] w-full appearance-none rounded-[10px] border border-[#B2B2B2] bg-white px-[20px] text-[16px] leading-[20px] font-semibold text-[#9F9F9F] focus:outline-none">
                  <option>Select Supported Access Method</option>
                  <option>Access Link</option>
                  <option>Login Credential</option>
                </select>
                <span className="pointer-events-none absolute top-[16px] right-[20px]">
                  <ChevDown color="#ABABAB" />
                </span>
              </span>
            </label>
          </div>

          <div className="mt-[58px] flex flex-wrap justify-end gap-[43px]">
            <button
              type="button"
              onClick={() => nav(-1)}
              className="h-[56px] w-[198px] rounded-[10px] bg-[#F1F8F2] text-[18px] leading-[22px] font-semibold text-[#001701]"
            >
              Cancel
            </button>
            <DarkButton className="h-[56px] w-[250px] gap-[10px] text-[18px]" onClick={() => setDone(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FFFFFF" />
                <path d="M12 7.5v9M7.5 12h9" stroke="#001701" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              Create Subscription
            </DarkButton>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
