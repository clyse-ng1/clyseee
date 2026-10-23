import { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BlurBg } from "../components/Decor";
import StepHeader from "../components/StepHeader";
import iconUpload from "../assets/icon-upload.svg";
import iconUploadSm from "../assets/icon-upload-sm.svg";
import iconPlusCircle from "../assets/icon-plus-circle.svg";

/* Step 3 — verify subscription. Dropzones open a real file picker; the small
   (i) buttons toggle Figma's "how to find it" popovers (closed by default,
   as on the base page). Files (jpeg/png/pdf, max 5MB each) travel on to the
   review screen, which uploads them as verification evidence once the group
   exists. */
const STEPS = [
  "Open your subscription provider.",
  "Go to Account \u2192 Billing/Payment History.",
  "Find your latest subscription payment.",
  "Download or screenshot the invoice.",
  "Upload it here.",
];

const ACCEPT = ["image/jpeg", "image/png", "application/pdf"];
const MAX_BYTES = 5 * 1024 * 1024;

function checkFile(f) {
  if (!f) return "";
  if (!ACCEPT.includes(f.type)) return "Please upload a JPG, PNG or PDF file.";
  if (f.size > MAX_BYTES) return "That file is over 5MB. Please pick a smaller one.";
  return "";
}

function DesktopDropzone({ label, onFile }) {
  const input = useRef(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [help, setHelp] = useState(false);
  return (
    <div
      onClick={() => input.current?.click()}
      className="relative mt-[20px] h-[400px] cursor-pointer rounded-[30px] bg-white shadow-[0_0_20px_rgba(0,23,1,0.10)]"
    >
      <input
        ref={input}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          const err = checkFile(f);
          setError(err);
          setName(err ? "" : f?.name || "");
          onFile?.(err ? null : f);
        }}
      />
      <img src={iconUpload} alt="" className="mx-auto mt-[110px] h-[114px] w-[179px]" />
      <p className="mx-[60px] mt-[31px] truncate text-center text-[25px] leading-[35px] font-semibold text-[#BABABA]">
        {name || label}
      </p>
      {error && (
        <p className="mx-[60px] mt-[8px] text-center text-[16px] leading-[22px] font-semibold text-clyse-red">
          {error}
        </p>
      )}
      <button
        type="button"
        aria-label="How to find it"
        onClick={(e) => {
          e.stopPropagation();
          setHelp((v) => !v);
        }}
        className="absolute top-[24px] right-[24px] grid h-[32px] w-[32px] place-items-center rounded-full border border-[#BABABA] text-[18px] font-bold text-[#BABABA] italic"
      >
        i
      </button>
      {help && (
        <div className="absolute top-0 left-[530px] w-[485px] bg-white p-[40px] shadow-[0_0_40px_rgba(0,23,1,0.25)]">
          {STEPS.map((s) => (
            <p
              key={s}
              className="text-[18px] leading-[22px] font-semibold text-ash [&:not(:first-child)]:mt-[12px]"
            >
              {s}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileDropzone({ label, onFile }) {
  const input = useRef(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [help, setHelp] = useState(false);
  return (
    <div
      onClick={() => input.current?.click()}
      className="relative mx-[30px] mt-[14px] h-[277px] w-[370px] cursor-pointer rounded-[20.8px] bg-white shadow-[0_0_13.87px_rgba(0,23,1,0.10)]"
    >
      <input
        ref={input}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          const err = checkFile(f);
          setError(err);
          setName(err ? "" : f?.name || "");
          onFile?.(err ? null : f);
        }}
      />
      <img src={iconUploadSm} alt="" className="mx-auto mt-[76px] h-[79px] w-[124px]" />
      <p className="mx-[30px] mt-[21px] truncate text-center text-[17.34px] leading-[24px] font-semibold text-[#BABABA]">
        {name || label}
      </p>
      {error && (
        <p className="mx-[30px] mt-[6px] text-center text-[12px] leading-[18px] font-semibold text-clyse-red">
          {error}
        </p>
      )}
      <button
        type="button"
        aria-label="How to find it"
        onClick={(e) => {
          e.stopPropagation();
          setHelp((v) => !v);
        }}
        className="absolute top-[14px] right-[14px] grid h-[24px] w-[24px] place-items-center rounded-full border border-[#BABABA] text-[14px] font-bold text-[#BABABA] italic"
      >
        i
      </button>
      {help && (
        <div className="absolute top-0 left-[106px] w-[261px] bg-white p-[22px] shadow-[0_0_27.74px_rgba(0,23,1,0.25)]">
          {STEPS.map((s) => (
            <p
              key={s}
              className="text-[9.68px] leading-[11.8px] font-semibold text-ash [&:not(:first-child)]:mt-[6.2px]"
            >
              {s}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CreateVerify() {
  const incoming = useLocation().state || null;
  const [proofs, setProofs] = useState({ invoice: null, receipt: null });
  const nextState = incoming ? { ...incoming, proofs } : null;

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      <BlurBg variant="hero" />
      {/* Desktop */}
      <main className="relative z-10 mx-[163px] mt-[100px] hidden xl:block">
        <StepHeader step={3} />
        <h2 className="mt-[50px] text-center text-[35px] leading-[43px] font-bold">
          Verify Subscription
        </h2>
        <p className="mt-[50px] text-[35px] leading-[43px] font-semibold">
          Upload Subscription Invoice
        </p>
        <DesktopDropzone
          label="Upload Subscription Invoice"
          onFile={(f) => setProofs((p) => ({ ...p, invoice: f }))}
        />
        <p className="mt-[30px] text-[35px] leading-[43px] font-semibold">
          Upload Payment Receipt
        </p>
        <DesktopDropzone
          label="Upload Payment Receipt"
          onFile={(f) => setProofs((p) => ({ ...p, receipt: f }))}
        />
        <button
          type="button"
          className="mt-[30px] flex h-[60px] w-full items-center justify-center gap-[9px] rounded-2xl border border-[#999999] bg-mint"
        >
          <img src={iconPlusCircle} alt="" className="h-[35px] w-[35px]" />
          <span className="text-[25px] leading-[35px] font-semibold">
            Other Custom Subscription
          </span>
        </button>
        <Link
          to="/create-group/review"
          state={nextState}
          className="mx-auto mt-[50px] grid h-[60px] w-[470px] place-items-center rounded-2xl bg-btn text-[18px] font-semibold text-mint"
        >
          Continue
        </Link>
        <div className="pb-[150px]" />
      </main>

      {/* Mobile */}
      <main className="relative z-10 xl:hidden">
        <StepHeader step={3} />
        <h2 className="mt-[36px] text-center text-[24.27px] leading-[30px] font-bold">
          Verify Subscription
        </h2>
        <p className="ml-[30px] mt-[34px] text-[22px] leading-[27px] font-semibold">
          Upload Subscription Invoice
        </p>
        <MobileDropzone
          label="Upload Subscription Invoice"
          onFile={(f) => setProofs((p) => ({ ...p, invoice: f }))}
        />
        <p className="ml-[30px] mt-[21px] text-[22px] leading-[27px] font-semibold">
          Upload Payment Receipt
        </p>
        <MobileDropzone
          label="Upload Payment Receipt"
          onFile={(f) => setProofs((p) => ({ ...p, receipt: f }))}
        />
        <button
          type="button"
          className="mx-[30px] mt-[21px] flex h-[50px] w-[370px] items-center justify-center gap-[7px] rounded-[11.1px] border border-[#999999] bg-mint"
        >
          <img src={iconPlusCircle} alt="" className="h-[24px] w-[24px]" />
          <span className="text-[17.34px] leading-[24px] font-semibold">
            Other Custom Subscription
          </span>
        </button>
        <Link
          to="/create-group/review"
          state={nextState}
          className="mx-[30px] mt-[34px] grid h-[50px] w-[370px] place-items-center rounded-[11.1px] bg-btn text-[12.48px] font-semibold text-mint"
        >
          Continue
        </Link>
        <div className="pb-[91px]" />
      </main>
    </div>
  );
}
