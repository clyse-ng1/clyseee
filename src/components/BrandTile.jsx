import iconMoviesRed from "../assets/icon-movies-red.svg";
import iconMoviesWhite from "../assets/icon-movies-white.svg";
import iconMusicTile from "../assets/icon-music-tile.svg";
import iconStreaming from "../assets/icon-streaming.svg";
import iconProdWhite from "../assets/icon-productivity-white.svg";
import iconProdBlack from "../assets/icon-productivity-black.svg";
import iconProdRed from "../assets/icon-productivity-red.svg";
import iconApple from "../assets/icon-apple.png";

/* Brand logo tile — the glyphs are the supplied design assets. The `plain`
   variant places them directly on the colored disc, as in the Figma cards. */
const BRANDS = {
  netflix: { tile: "#000000", glyph: iconMoviesRed, gw: 28 },
  spotify: { tile: "#46C04C", glyph: iconMusicTile, gw: 28 },
  youtube: { tile: "#FF0000", glyph: iconMoviesWhite, gw: 28 },
  prime: { tile: "#000C1C", glyph: iconStreaming, gw: 33 },
  canva: {
    tile: "linear-gradient(156deg, #408EF9 0%, #4E0082 79%)",
    glyph: iconProdWhite,
    gw: 29,
  },
  capcut: { tile: "#E6E6E6", glyph: iconProdBlack, gw: 29 },
  adobe: { tile: "#000000", glyph: iconProdRed, gw: 29 },
  apple: { tile: "#000000", glyph: iconApple, gw: 30 },
  amazon: {
    tile: "conic-gradient(from 72deg at 58% 56%, #DE00EA 27%, #1884FF 51%, #F50004 70%, #DCEB00 84%)",
    glyph: iconProdWhite,
    gw: 29,
  },
};

const CARD_GW = {
  netflix: 50,
  spotify: 42,
  youtube: 50,
  prime: 50,
  canva: 44,
  capcut: 44,
  adobe: 44,
  amazon: 44,
  apple: 44,
};


export default function BrandTile({ brand, size = 50, mobile = false, plain = false, name = "" }) {
  const b = BRANDS[brand];
  const s = mobile ? 32 : size;

  /* No artwork for this service: a letter tile. The old generic fallback drew
     one brand's glyph on every unknown service (DStv, Microsoft 365 and CapCut
     all showed the same mark), which read as a broken logo. */
  if (!b) {
    const letter = (name || "?").trim().charAt(0).toUpperCase();
    return (
      <span
        className="grid flex-none place-items-center rounded-full bg-[#001701] font-bold text-[#DFFFE1]"
        style={{ width: s, height: s, fontSize: s * 0.42 }}
      >
        {letter}
      </span>
    );
  }
  if (plain) {
    return (
      <span
        className="grid flex-none place-items-center rounded-full"
        style={{ width: s, height: s, background: b.tile }}
      >
        <img src={b.glyph} alt="" style={{ width: (b.gw * s) / 50 }} />
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
      <img src={b.glyph} alt="" style={{ width: (b.gw * s) / 50 }} />
    </span>
  );
}
