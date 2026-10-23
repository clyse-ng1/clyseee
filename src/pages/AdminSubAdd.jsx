import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { BackTitle, DarkButton } from "../components/AdminShell";
import { GlyphUpload, SuccessSeal } from "../components/AdminGlyphs";

/* Add Subscription form + success panel — Figma 1112:43005 / 1149:23164 /
   1149:23714 (1440, desktop only). Static: Create flips to the success
   panel. Copy fixes: "defferent" -> "different", "Upload Subscription
   Invoice" -> "Upload Subscription Logo", "visible to member" -> members. */

const inputCls =
  "h-[60px] w-full rounded-[10px] border border-[#048B0B] bg-white px-[20px] text-[18px] font-semibold text-[#001701] placeholder-[#999999] focus:outline-none";

function Field({ label, children, className = "" }) {
  return (
    <label className={`flex flex-col gap-[10px] ${className}`}>
      <span className="text-[18px] font-bold leading-[22px] text-[#001701]">{label}</span>
      {children}
    </label>
  );
}

function SuccessPanel({ onOk }) {
  return (
    <div className="mx-auto mt-[60px] flex w-[470px] flex-col items-center rounded-[20px] border border-[#999999] bg-white px-[0px] py-[50px]">
      <SuccessSeal />
      <h2 className="mt-[20px] text-[35px] font-bold text-[#001701]">Subscription Created</h2>
      <p className="mt-[10px] px-[40px] text-center text-[18px] font-semibold text-[#4E4E4E]">
        Subscription has been created successfully
      </p>
      <button
        onClick={onOk}
        className="bg-btn mt-[30px] flex h-[60px] w-[470px] max-w-[85%] items-center justify-center rounded-[16px] text-[18px] font-semibold text-[#F1F8F2]"
      >
        Ok
      </button>
    </div>
  );
}

export default function AdminSubAdd() {
  const nav = useNavigate();
  const [done, setDone] = useState(false);
  const [logo, setLogo] = useState(null);
  const [plans, setPlans] = useState([0]);
  const fileRef = useRef(null);

  return (
    <AdminShell active="subscriptions" sub="plans">
      {done ? (
        <SuccessPanel onOk={() => nav("/admin/subscriptions")} />
      ) : (
        <>
          <BackTitle
            title="Add Subscription"
            right={
              <div className="flex gap-[20px]">
                <button
                  onClick={() => nav(-1)}
                  className="flex h-[60px] w-[230px] items-center justify-center rounded-[10px] border border-[#FF0000] bg-white text-[18px] font-semibold text-[#FF0000]"
                >
                  Cancel
                </button>
                <DarkButton className="h-[60px] w-[230px]" onClick={() => setDone(true)}>
                  Create
                </DarkButton>
              </div>
            }
          />
          <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white p-[40px]">
            <h2 className="text-[25px] font-bold text-[#001701]">Basic Info</h2>
            <div className="mt-[25px] flex gap-[30px]">
              <Field label="Subscription Name" className="w-[514px]">
                <input placeholder="e.g Netflix" className={inputCls} />
              </Field>
              <Field label="Category" className="w-[514px]">
                <input placeholder="e.g Streaming" className={inputCls} />
              </Field>
            </div>
            <div className="mt-[25px]">
              <Field label="Description">
                <textarea
                  rows={3}
                  placeholder="Short description of the subscription"
                  className="min-h-[120px] w-full resize-none rounded-[10px] border border-[#048B0B] bg-white p-[20px] text-[18px] font-semibold text-[#001701] placeholder-[#999999] focus:outline-none"
                />
              </Field>
            </div>

            <h2 className="mt-[40px] text-[25px] font-bold text-[#001701]">Upload Subscription Logo</h2>
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-[20px] flex h-[225px] w-[514px] flex-col items-center justify-center gap-[12px] rounded-[15px] border-2 border-dashed border-[#048B0B] bg-[#F2FFF3]"
            >
              {logo ? (
                <img src={logo} alt="Subscription logo preview" className="h-[120px] w-[120px] rounded-full object-cover" />
              ) : (
                <>
                  <GlyphUpload />
                  <span className="text-[18px] font-semibold text-[#4E4E4E]">Upload logo (PNG, JPG)</span>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setLogo(URL.createObjectURL(f));
                }}
              />
            </button>

            <h2 className="mt-[40px] text-[25px] font-bold text-[#001701]">Plans & Pricing</h2>
            {plans.map((p) => (
              <div key={p} className="mt-[25px] flex gap-[30px]">
                <Field label="Plans" className="w-[514px]">
                  <input placeholder="e.g Basic" className={inputCls} />
                </Field>
                <Field label="Billing Period" className="w-[242px]">
                  <input placeholder="e.g Monthly" className={inputCls} />
                </Field>
                <Field label="Fixed Unit Price" className="w-[242px]">
                  <input placeholder="e.g N1,500" className={inputCls} />
                </Field>
              </div>
            ))}
            <div className="mt-[25px] flex justify-end">
              <DarkButton className="h-[60px] w-[200px]" onClick={() => setPlans((pl) => [...pl, pl.length])}>
                Add Plan
              </DarkButton>
            </div>

            <h2 className="mt-[40px] text-[25px] font-bold text-[#001701]">Access & Capacity</h2>
            <div className="mt-[25px] flex gap-[30px]">
              <Field label="Maximum Members" className="w-[514px]">
                <input placeholder="e.g 10" className={inputCls} />
              </Field>
              <Field label="Access Type" className="w-[514px]">
                <input placeholder="e.g Public Group" className={inputCls} />
              </Field>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
