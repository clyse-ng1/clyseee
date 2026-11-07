import {
  MovieGlyph,
  MusicGlyph,
  ProductivityGlyph,
  SecurityGlyph,
  DeliveryGlyph,
  CloudGlyph,
} from "./Glyphs";

/* Brand discs — colours and glyphs taken straight from the Figma file
   (BROWSE SUBSCRIPTION PAGE 804:16031). Every card there is one of two
   glyphs, Music or Movie or Productivity, on the brand's own disc colour;
   glyph occupies two thirds of the disc. Nothing here is hand-drawn. */
/* Glyph colours are the ones Figma actually paints inside each brand-card
   instance — Netflix's mark is red (#FF0000), Prime Video's blue (#02A0F5),
   Adobe's red, CapCut's black, Canva/Amazon/YouTube white, Spotify #191515.
   One shared 7-glyph family, tinted per brand. */
const BRANDS = {
  netflix: { tile: "#000000", glyph: MovieGlyph, ink: "#FF0000" },
  spotify: { tile: "#46C14C", glyph: MusicGlyph, ink: "#191515" },
  youtube: { tile: "#FF0000", glyph: MovieGlyph, ink: "#FFFFFF" },
  prime: { tile: "#000C1D", glyph: MovieGlyph, ink: "#02A0F5" },
  canva: {
    tile: "linear-gradient(156deg, #408EFA 0%, #4E0083 79%)",
    glyph: ProductivityGlyph,
    ink: "#FFFFFF",
  },
  capcut: { tile: "#E6E6E6", glyph: ProductivityGlyph, ink: "#000000" },
  adobe: { tile: "#000000", glyph: ProductivityGlyph, ink: "#FF0000" },
  apple: { tile: "#000000", glyph: MusicGlyph },
  amazon: {
    tile: "conic-gradient(from 72deg at 58% 56%, #DE00EA 27%, #1984FF 51%, #F60004 70%, #DCEC00 84%)",
    glyph: ProductivityGlyph,
    ink: "#FFFFFF",
  },
};

/* Category -> glyph, for services Figma has no brand card for. Uses the same
   seven-glyph family, so an unknown service still belongs to the set instead
   of falling back to a letter. */
const CATEGORY_GLYPH = [
  [/music|audio/, MusicGlyph],
  [/movie|stream|entertain|video|tv/, MovieGlyph],
  [/security|vpn|antivirus/, SecurityGlyph],
  [/delivery|logistics|shipping/, DeliveryGlyph],
  [/cloud|storage/, CloudGlyph],
];
function glyphForCategory(category) {
  const c = (category || "").toLowerCase();
  for (const [re, g] of CATEGORY_GLYPH) if (re.test(c)) return g;
  return ProductivityGlyph;
}


/* A glyph is painted by giving its <svg> the brand colour via `color`; the
   inlined paths use currentColor. */
function Glyph({ As, size, color }) {
  return (
    <span style={{ color: color || "#F1F8F2", display: "flex" }}>
      <As size={size} />
    </span>
  );
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
        <Glyph As={glyphForCategory(category)} size={s * GLYPH} color="#F1F8F2" />
      </span>
    );
  }
  if (plain) {
    return (
      <span
        className="grid flex-none place-items-center rounded-full"
        style={{ width: s, height: s, background: b.tile }}
      >
        <Glyph As={b.glyph} size={s * GLYPH} color={b.ink} />
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
      <Glyph As={b.glyph} size={s * GLYPH} color={b.ink} />
    </span>
  );
}
