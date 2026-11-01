import { useEffect } from "react";

/* Shared read-only detail modal for live-data drill-downs (member, wallet
   transaction, payout). No Figma design exists for these, so this minimal
   overlay reuses app tokens instead of inventing page layouts. */
export default function DetailModal({ title, onClose, loading, error, children }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[20px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="max-h-[85vh] w-full max-w-[560px] overflow-y-auto rounded-[20px] bg-white p-[24px] xl:p-[30px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          <h2 className="text-[20px] leading-[24px] font-bold text-ink xl:text-[25px] xl:leading-[30px]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="ml-auto grid h-[36px] w-[36px] flex-none place-items-center rounded-full bg-[#F1F8F1] text-[22px] leading-none font-bold text-[#6B6B6B]"
          >
            ×
          </button>
        </div>
        {loading ? (
          <p className="mt-[20px] text-[15px] font-semibold text-[#6B6B6B]">Loading…</p>
        ) : error ? (
          <p className="mt-[20px] text-[15px] font-semibold text-[#FF0000]">{error}</p>
        ) : (
          <div className="mt-[20px]">{children}</div>
        )}
      </div>
    </div>
  );
}

export function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-[16px] border-b border-[#E9E9E9] py-[10px]">
      <span className="flex-none text-[14px] leading-[20px] font-semibold text-[#6B6B6B]">
        {label}
      </span>
      <span className="text-right text-[14px] leading-[20px] font-semibold break-all text-ink">
        {value}
      </span>
    </div>
  );
}
