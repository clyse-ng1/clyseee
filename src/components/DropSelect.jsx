import { useEffect, useRef, useState } from "react";

/* Generic dropdown select: button + popup listbox, outside-click and
   Escape close it, the chevron rotates while open. Closed styling comes
   entirely from props so each Figma button keeps its exact look. */
export function DefaultChev({ color = "#6B6B6B" }) {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden>
      <path
        d="M1.5 1.5 7 6.5l5.5-5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DropSelect({
  value,
  options = [],
  onChange,
  buttonClass = "",
  labelClass = "",
  panelClass = "",
  optionClass = "",
  chevron = null,
  lead = null,
  chevColor = "#6B6B6B",
  ariaLabel = "Select an option",
  align = "left",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={buttonClass}
      >
        {lead}
        <span className={labelClass}>{value}</span>
        <span className={`flex-none transition-transform duration-150 ${open ? "rotate-180" : ""} ${value ? "ml-auto" : "mx-auto"}`}>
          {chevron || <DefaultChev color={chevColor} />}
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          className={`absolute z-30 mt-[8px] max-h-[260px] w-full min-w-[150px] overflow-y-auto rounded-[10px] border border-line bg-white py-[6px] shadow-[0_10px_30px_rgba(0,23,1,0.18)] ${
            align === "right" ? "right-0" : "left-0"
          } ${panelClass}`}
        >
          {options.map((o) => (
            <button
              key={o}
              type="button"
              role="option"
              aria-selected={o === value}
              onClick={() => {
                onChange?.(o);
                setOpen(false);
              }}
              className={`block w-full px-[16px] py-[10px] text-left text-[15px] font-semibold transition hover:bg-mint ${
                o === value ? "text-clyse" : "text-ink"
              } ${optionClass}`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
