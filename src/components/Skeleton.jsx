/* Loading skeletons — shimmer placeholders shown while live data loads.
 * Pages must NEVER render mock/Figma content as a loading stand-in: it
 * paints first and then visibly swaps when the API resolves (the flash).
 * Show these instead; show real empty/error states once loading settles. */

export default function Sk({ className = "", light = false }) {
  return (
    <span
      aria-hidden
      className={`block animate-pulse rounded-[8px] ${light ? "bg-white/25" : "bg-[#DFE9DF]"} ${className}`}
    />
  );
}
