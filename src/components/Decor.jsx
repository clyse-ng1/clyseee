/* Landing blurs — 981px (blur 186, fill .3) + 751px (blur 372, fill .8/.7),
   containers .3 (left) / .2 (right) */
function HeroBlobs() {
  const big = "linear-gradient(135deg, rgba(4,139,11,0.3) 0%, rgba(224,248,225,0.3) 100%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* mobile wash — faint full-width gradient, left edge slightly deeper */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[500px] bg-[linear-gradient(180deg,#F5FBF5_0%,#EDF8EE_45%,#EAF7EB_80%,rgba(255,255,255,0)_100%)] lg:hidden"
      />
      <div
        aria-hidden
        className="blob left-[-110px] top-[180px] h-[320px] w-[320px] blur-[60px] lg:hidden"
        style={{ background: "radial-gradient(circle, rgba(143,251,148,0.14), rgba(143,251,148,0) 70%)" }}
      />
      {/* desktop left */}
      <div className="absolute inset-0 hidden opacity-30 lg:block">
        <div
          className="blob blur-[186px]"
          style={{ width: 981, height: 981, left: "calc(50% - 919px)", top: 260, background: big }}
        />
        <div
          className="blob blur-[372px]"
          style={{ width: 751, height: 751, left: "calc(50% - 1049px)", top: 832, background: "rgba(143,251,148,0.8)" }}
        />
      </div>
      {/* desktop right */}
      <div className="absolute inset-0 hidden opacity-20 lg:block">
        <div
          className="blob blur-[186px]"
          style={{ width: 981, height: 981, left: "calc(50% + 37px)", top: 385, background: big }}
        />
        <div
          className="blob blur-[372px]"
          style={{ width: 751, height: 751, left: "calc(50% + 298px)", top: 680, background: "rgba(143,251,148,0.7)" }}
        />
      </div>
    </div>
  );
}

/* Auth page blobs — same circles, containers .3 (left) / .2 (right) */
function PageBlobs() {
  const big = "linear-gradient(135deg, rgba(4,139,11,0.3) 0%, rgba(224,248,225,0.3) 100%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* mobile wash — faint full-page gradient, left edge slightly deeper */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#F4FBF4_0%,#E9F7EA_30%,#ECF8ED_50%,#F1FAF1_75%,#FBFEFB_100%)] lg:hidden"
      />
      <div
        aria-hidden
        className="blob left-[-110px] top-[22%] h-[320px] w-[320px] blur-[60px] lg:hidden"
        style={{ background: "radial-gradient(circle, rgba(143,251,148,0.14), rgba(143,251,148,0) 70%)" }}
      />
      {/* desktop left */}
      <div className="absolute inset-0 hidden opacity-30 lg:block">
        <div
          className="blob blur-[147px]"
          style={{ width: 777, height: 777, left: "calc(50% - 611px)", top: 211, background: big }}
        />
        <div
          className="blob blur-[295px]"
          style={{ width: 595, height: 595, left: "calc(50% - 714px)", top: 664, background: "rgba(143,251,148,0.8)" }}
        />
      </div>
      {/* desktop right */}
      <div className="absolute inset-0 hidden opacity-20 lg:block">
        <div
          className="blob blur-[147px]"
          style={{ width: 777, height: 777, left: "calc(50% + 176px)", top: 561, background: big }}
        />
        <div
          className="blob blur-[295px]"
          style={{ width: 595, height: 595, left: "calc(50% + 394px)", top: 187, background: "rgba(143,251,148,0.7)" }}
        />
      </div>
    </div>
  );
}

/* Soft ambient background blobs (Figma "BLUR BG") */
export function BlurBg({ variant = "page" }) {
  return variant === "hero" ? <HeroBlobs /> : <PageBlobs />;
}

/* Dark gradient status circle with white glyph (verification / mail) */
export function StatusCircle({ icon = "check", size = 130 }) {
  const iconSize = icon === "check" ? size * 0.54 : size * 0.62;
  return (
    <div
      className="bg-deep mx-auto flex items-center justify-center rounded-full"
      style={{ width: size, height: size }}
    >
      {icon === "check" ? (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6L9 17l-5-5"
            stroke="#FFFFFF"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
          <rect x="2.5" y="4.5" width="19" height="15" rx="3" stroke="#FFFFFF" strokeWidth="2.4" />
          <path
            d="M3.5 7l8.5 6 8.5-6"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
