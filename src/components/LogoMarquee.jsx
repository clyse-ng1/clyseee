import BrandTile from "./BrandTile";
import { useAuth } from "../lib/useAuth";

/* Join-flow footer: gray strip with a scrolling row of brand tiles.
   Figma parks it half-hidden behind the panel — relayed out below it. */
const BRANDS = ["netflix", "spotify", "adobe", "amazon", "canva", "capcut", "prime"];

function Row({ hidden }) {
  return (
    <div aria-hidden={hidden} className="flex gap-[78px] pr-[78px]">
      {BRANDS.map((b) => (
        <span key={b} className="grid w-[110px] flex-none place-items-center">
          <BrandTile brand={b} size={81} plain />
        </span>
      ))}
    </div>
  );
}

export default function LogoMarquee({ className = "" }) {
  const { user } = useAuth();
  // PM: the marquee is marketing furniture — never show it to a signed-in member.
  if (user) return null;
  return (
    <div className={`overflow-hidden bg-white ${className}`}>
      <div className="h-[168px] pt-[29px]">
        <div className="animate-marquee flex w-max">
          <Row hidden={false} />
          <Row hidden />
        </div>
      </div>
    </div>
  );
}
