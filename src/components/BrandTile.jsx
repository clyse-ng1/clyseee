import iconMoviesRed from "../assets/icon-movies-red.svg";
import iconMoviesWhite from "../assets/icon-movies-white.svg";
import iconMusicTile from "../assets/icon-music-tile.svg";
import iconStreaming from "../assets/icon-streaming.svg";
import iconProdWhite from "../assets/icon-productivity-white.svg";
import iconProdBlack from "../assets/icon-productivity-black.svg";
import iconProdRed from "../assets/icon-productivity-red.svg";

/* Brand logo tile — circle in brand color + sharp white inner square + centered
   glyph. Canva/Amazon tiles use the exact Figma gradients. `size` sets the
   circle diameter (creation: 50/32, dashboard rows: 50/34, Tx rows: 40). */
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
  amazon: {
    tile: "conic-gradient(from 72deg at 58% 56%, #DE00EA 27%, #1884FF 51%, #F50004 70%, #DCEB00 84%)",
    glyph: iconProdWhite,
    gw: 29,
  },
};

/* Join-card tiles: glyph sits directly on the 75px tile (no white square),
   at the exact measured glyph widths. */
const CARD_GW = {
  netflix: 50,
  spotify: 42,
  youtube: 50,
  prime: 50,
  canva: 44,
  capcut: 44,
  adobe: 44,
  amazon: 44,
};

/* Generic tile for services the API returns that have no Figma brand tile. */
const FALLBACK = { tile: "#047D0A", glyph: iconProdWhite, gw: 29 };

export default function BrandTile({ brand, size = 50, mobile = false, plain = false }) {
  const b = BRANDS[brand] || FALLBACK;
  const gw = CARD_GW[brand] || 44;
  const s = mobile ? 32 : size;
  if (plain) {
    return (
      <span
        className="grid flex-none place-items-center rounded-full"
        style={{ width: s, height: s, background: b.tile }}
      >
        <img src={b.glyph} alt="" style={{ width: (gw * s) / 75 }} />
      </span>
    );
  }
  return (
    <span
      className="flex-none rounded-full"
      style={{
        width: s,
        height: s,
        background: b.tile,
        display: "grid",
        placeItems: "center",
      }}
    >
      <span
        className="grid place-items-center bg-white"
        style={{ width: s * 0.66, height: s * 0.66 }}
      >
        <img src={b.glyph} alt="" style={{ width: (b.gw * s) / 50 }} />
      </span>
    </span>
  );
}
