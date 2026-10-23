/* Card brand pills on the card-number label row (Visa / Mastercard / Verve). */
export default function CardBrands({ className = "h-[39px] w-[70px]" }) {
  return (
    <span className="flex gap-[20px] xl:gap-[20px]">
      <svg viewBox="0 0 70 39" className={className} aria-label="Visa">
        <rect width="70" height="39" rx="10" fill="#1A1F71" />
        <text
          x="35"
          y="26"
          textAnchor="middle"
          fontSize="15"
          fontStyle="italic"
          fontWeight="800"
          fill="#FFFFFF"
          fontFamily="Arial, sans-serif"
        >
          VISA
        </text>
      </svg>
      <svg viewBox="0 0 70 39" className={className} aria-label="Mastercard">
        <rect width="70" height="39" rx="10" fill="#0E0E0E" />
        <circle cx="29" cy="19.5" r="10" fill="#EB001B" />
        <circle cx="41" cy="19.5" r="10" fill="#F79E1B" fillOpacity="0.85" />
      </svg>
      <svg viewBox="0 0 70 39" className={className} aria-label="Verve">
        <rect width="70" height="39" rx="10" fill="#008A96" />
        <text
          x="35"
          y="25"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#FFFFFF"
          fontFamily="Arial, sans-serif"
        >
          verve
        </text>
      </svg>
    </span>
  );
}
