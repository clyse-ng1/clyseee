/* Small stroke glyphs for admin stat cards / moderation buttons. */

function G({ children, s = 24 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      {children}
    </svg>
  );
}
export function GlyphUsers({ color = "#048B0B" }) {
  return (
    <G>
      <circle cx="9" cy="8.5" r="3.2" stroke={color} strokeWidth="1.8" />
      <path d="M3.5 19.5c.6-3.2 2.9-5 5.5-5s4.9 1.8 5.5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16.5" cy="9.5" r="2.6" stroke={color} strokeWidth="1.8" />
      <path d="M16 14.7c2.2.2 3.9 1.8 4.4 4.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function GlyphUserCheck({ color = "#048B0B" }) {
  return (
    <G>
      <circle cx="10" cy="8.5" r="3.5" stroke={color} strokeWidth="1.8" />
      <path d="M4 20c.7-3.6 3.1-5.5 6-5.5 1.2 0 2.3.3 3.2.9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="m14.5 17.5 2 2 3.5-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  );
}
export function GlyphBadge({ color = "#048B0B" }) {
  return (
    <G>
      <circle cx="12" cy="10" r="6.5" stroke={color} strokeWidth="1.8" />
      <path d="m9 10 2.2 2.2L15.5 8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 15.5 8 21l4-2.2L16 21l-1.5-5.5" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </G>
  );
}
export function GlyphClock({ color = "#FF6C03" }) {
  return (
    <G>
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function GlyphWarn({ color = "#E31B00" }) {
  return (
    <G>
      <path d="M12 3.5 21 20H3L12 3.5Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 9.5v4.5M12 17h.01" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function GlyphX({ color = "#FF0000" }) {
  return (
    <G>
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <path d="m9.5 9.5 5 5M14.5 9.5l-5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function GlyphPause({ color = "#F04C00" }) {
  return (
    <G>
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <path d="M10 9v6M14 9v6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function GlyphNoUser({ color = "#FF0000" }) {
  return (
    <G>
      <circle cx="10" cy="8.5" r="3.5" stroke={color} strokeWidth="1.8" />
      <path d="M4 20c.7-3.6 3.1-5.5 6-5.5 1.5 0 2.9.5 4 1.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="m15 15 5.5 5.5M20.5 15 15 20.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function GlyphMegaphone({ color = "#006AA4" }) {
  return (
    <G>
      <path d="M4 11v3l4 1 8 4V6L8 10l-4 1Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M6.5 15.5V19a1.5 1.5 0 0 0 3 0v-2.7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function GlyphEdit({ color = "#048B0B" }) {
  return (
    <G>
      <path d="M14.5 5.5 18.5 9.5 8.5 19.5l-5 1 1-5 10-10Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </G>
  );
}
export function GlyphCheckCircle({ color = "#048B0B" }) {
  return (
    <G>
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.8" />
      <path d="m8.5 12.2 2.5 2.5 4.8-5.2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  );
}
export function SuccessSeal({ size = 100 }) {
  return (
    <span
      className="flex items-center justify-center rounded-full bg-[#048B0B]"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none">
        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="#DFFFE1" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
export function GlyphCheck({ color = "#FFFFFF" }) {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="m5 12.5 4.5 4.5L19 7.5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
export function GlyphUpload({ color = "#048B0B" }) {
  return (
    <G s={40}>
      <path d="M12 15V4.5M7.5 9 12 4.5 16.5 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 15v4.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V15" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </G>
  );
}
export function GlyphPlus({ color = "#FFFFFF" }) {
  return (
    <G>
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </G>
  );
}
