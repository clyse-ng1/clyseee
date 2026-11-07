import iconMovie from "../assets/figma/icon-movie.svg";
import iconMusic from "../assets/figma/icon-music.svg";
import iconProductivity from "../assets/figma/icon-productivity.svg";
import iconSecurity from "../assets/figma/icon-security.svg";
import iconDelivery from "../assets/figma/icon-delivery.svg";
import iconCloud from "../assets/figma/icon-cloud.svg";

/* Brand discs — colours and glyphs taken straight from the Figma file
   (BROWSE SUBSCRIPTION PAGE 804:16031). Every card there is one of two
   glyphs, Music or Movie or Productivity, on the brand's own disc colour;
   glyph occupies two thirds of the disc. Nothing here is hand-drawn. */
const BRANDS = {
  netflix: { tile: "#000000", glyph: iconMovie },
  spotify: { tile: "#46C14C", glyph: iconMusic },
  youtube: { tile: "#FF0000", glyph: iconMovie },
  prime: { tile: "#000C1D", glyph: iconMovie },
  canva: {
    tile: "linear-gradient(156deg, #408EFA 0%, #4E0083 79%)",
    glyph: iconProductivity,
  },
  capcut: { tile: "#E6E6E6", glyph: iconProductivity, ink: true },
  adobe: { tile: "#000000", glyph: iconProductivity },
  apple: { tile: "#000000", glyph: iconMusic },
  amazon: {
    tile: "conic-gradient(from 72deg at 58% 56%, #DE00EA 27%, #1984FF 51%, #F60004 70%, #DCEC00 84%)",
    glyph: iconProductivity,
  },
};

/* Category -> glyph, for services Figma has no brand card for. Uses the same
   seven-glyph family, so an unknown service still belongs to the set instead
   of falling back to a letter. */
const CATEGORY_GLYPH = [
  [/music|audio/, iconMusic],
  [/movie|stream|entertain|video|tv/, iconMovie],
  [/security|vpn|antivirus/, iconSecurity],
  [/delivery|logistics|shipping/, iconDelivery],
  [/cloud|storage/, iconCloud],
];
function glyphForCategory(category) {
  const c = (category || "").toLowerCase();
  for (const [re, g] of CATEGORY_GLYPH) if (re.test(c)) return g;
  return iconProductivity;
}

/* Glyph width as a fraction of the disc: Figma places a 50px glyph on a
   75px disc in every card. */
const GLYPH = 2 / 3;

export default function BrandTile({
  brand,
  size = 50,
  mobile = false,
  plain = false,
  name = "",
  category = "",
}) {
  const b = BRANDS[brand];
  const s = mobile ? 32 : size;

  /* No brand card exists in Figma for this service (verified: DStv, Microsoft
     365 and Apple Music appear nowhere in the file). Figma's own card disc is
     black #000000, so an unbranded service keeps that disc plus the matching
     glyph from Figma's three-glyph family — nothing invented. */
  if (!b) {
    return (
      <span
        className="grid flex-none place-items-center rounded-full bg-[#000000]"
        style={{ width: s, height: s }}
        title={name || undefined}
      >
        <img src={glyphForCategory(category)} alt="" style={{ width: s * GLYPH }} />
      </span>
    );
  }
  if (plain) {
    return (
      <span
        className="grid flex-none place-items-center rounded-full"
        style={{ width: s, height: s, background: b.tile }}
      >
        <img
          src={b.glyph}
          alt=""
          style={{ width: s * GLYPH, filter: b.ink ? "invert(1)" : undefined }}
        />
      </span>
    );
  }
  // Figma draws the glyph straight on the coloured disc — there is no white
  // inset square. That square was also hiding every white glyph (YouTube,
  // Prime, Canva, Amazon all rendered as blank tiles).
  return (
    <span
      className="grid flex-none place-items-center rounded-full"
      style={{ width: s, height: s, background: b.tile }}
    >
      <img
        src={b.glyph}
        alt=""
        style={{ width: s * GLYPH, filter: b.ink ? "invert(1)" : undefined }}
      />
    </span>
  );
}
