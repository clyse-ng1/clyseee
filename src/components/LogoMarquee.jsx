import { useEffect, useState } from "react";
import BrandTile from "./BrandTile";
import { useAuth } from "../lib/useAuth";

/* Join-flow footer: gray strip with a scrolling row of brand tiles.
   Figma parks it half-hidden behind the panel — relayed out below it. */
const BRANDS = ["netflix", "spotify", "adobe", "amazon", "canva", "capcut", "prime"];

function Row({ hidden, size = 81, gap = 78, boxed = false }) {
  return (
    <div aria-hidden={hidden} className="flex" style={{ gap, paddingRight: gap }}>
      {BRANDS.map((b) => (
        <span
          key={b}
          className={`grid flex-none place-items-center ${
            boxed ? "rounded-[14px] border border-[#ECECEC] bg-white shadow-[0_6px_18px_rgba(0,23,1,0.06)]" : ""
          }`}
          style={{ width: boxed ? size * 1.54 : size * 1.36, height: boxed ? size * 1.54 : undefined }}
        >
          <BrandTile brand={b} size={size} plain />
        </span>
      ))}
    </div>
  );
}

export default function LogoMarquee({ className = "", boxed = false }) {
  const { user } = useAuth();
  // Phones get a smaller strip: 50px tiles instead of 81.
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const sync = () => setSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  // PM: the marquee is marketing furniture — never show it to a signed-in member.
  if (user) return null;
  const size = small ? 50 : boxed ? 56 : 81;
  const gap = small ? 38 : boxed ? 36 : 78;
  return (
    <div className={`overflow-hidden bg-white ${className}`}>
      <div className={small ? "pt-[14px]" : "h-[168px] pt-[29px]"}>
        <div className="animate-marquee flex w-max">
          <Row hidden={false} size={size} gap={gap} boxed={boxed} />
          <Row hidden size={size} gap={gap} boxed={boxed} />
        </div>
      </div>
    </div>
  );
}
