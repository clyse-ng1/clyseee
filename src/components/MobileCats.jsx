import { useState } from "react";

/* Mobile categories — Figma 263:4402 "Categories" (header 17.34 + 8 pills h42,
   horizontal scroll; inactive pills carry border + shadow, active is .bg-btn). */
const PILLS = [
  { label: "All", width: 52 },
  { label: "Movies & Series", width: 136 },
  { label: "Streaming", width: 104 },
  { label: "Music", width: 74 },
  { label: "Security & VPN", width: 132 },
  { label: "Delivery", width: 89 },
  { label: "Cloud", width: 74 },
  { label: "Productivity", width: 115 },
];

export default function MobileCats() {
  const [active, setActive] = useState("All");
  return (
    <div className="mt-[30px]">
      <h2 className="px-[20px] text-[17.34px] leading-[24.27px] font-semibold text-ink">
        Categories
      </h2>
      <div className="mt-[6px] flex gap-[13px] overflow-x-auto pt-[2px] pr-[20px] pb-[4px] pl-[20px]">
        {PILLS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setActive(p.label)}
            style={{ width: p.width }}
            className={`flex h-[42px] flex-none items-center justify-center rounded-[6.76px] text-[12.48px] leading-[15.22px] font-semibold transition ${
              active === p.label
                ? "bg-btn text-mint"
                : "border-[0.5px] border-clyse bg-mint text-ink shadow-[0.9px_0.9px_3.2px_rgba(0,23,1,0.25)]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
