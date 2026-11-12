/* Landing blurs — 981px (blur 186, fill .3) + 751px (blur 372, fill .8/.7),
   containers .3 (left) / .2 (right) */
function HeroBlobs() {
  const big = "linear-gradient(135deg, rgba(4,139,11,0.3) 0%, rgba(224,248,225,0.3) 100%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* mobile: Figma's "BACKGROUND BLUR" — the 383 / 293 pair (blur 73 / 145),
          containers .3 left / .2 right. Every member mobile page carries it. */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute opacity-30">
          <div className="blob absolute" style={{ width: 383, height: 383, left: -150, top: 149, background: "linear-gradient(135deg, rgba(4,139,11,0.3) 0%, rgba(224,248,225,0.3) 100%)", opacity: 0.3, filter: "blur(73px)" }} />
          <div className="blob absolute" style={{ width: 293, height: 293, left: -106, top: 311, background: "rgba(143,251,148,0.8)", filter: "blur(145px)" }} />
        </div>
        <div className="absolute opacity-20">
          <div className="blob absolute" style={{ width: 383, height: 383, left: 216, top: 199, background: "linear-gradient(135deg, rgba(4,139,11,0.3) 0%, rgba(224,248,225,0.3) 100%)", opacity: 0.3, filter: "blur(73px)" }} />
          <div className="blob absolute" style={{ width: 293, height: 293, left: 260, top: 361, background: "rgba(143,251,148,0.8)", filter: "blur(145px)" }} />
        </div>
      </div>
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

/* Figma "BLUR BG" exactly as the two Join Group pages draw it (889:52181 in
   889:52178, 889:52209 in 889:52206): a 777 circle (blur 147.53) + a 595
   circle (blur 295.05) each side, containers .3 left / .2 right, and the
   lighter 383 / 293 pair (blur 73 / 145) on mobile. Coordinates are figma
   absolute offsets from the frame's top-left, so the wash sits bottom-left
   and top-right the way the artboards do — not centred like the hero blobs. */
function JoinBlobs() {
  const grad = "linear-gradient(135deg, rgba(4,139,11,0.3) 0%, rgba(224,248,225,0.3) 100%)";
  const mint = "rgba(143,251,148,0.8)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* desktop */}
      <div className="absolute inset-0 hidden xl:block">
        <div className="absolute opacity-30">
          <div className="blob absolute" style={{ width: 777, height: 777, left: 34, top: 361, background: grad, opacity: 0.3, filter: "blur(147.53px)" }} />
          <div className="blob absolute" style={{ width: 595, height: 595, left: -68, top: 815, background: mint, filter: "blur(295.05px)" }} />
        </div>
        <div className="absolute opacity-20">
          <div className="blob absolute" style={{ width: 777, height: 777, left: 822, top: 712, background: grad, opacity: 0.5, filter: "blur(147.53px)" }} />
          <div className="blob absolute" style={{ width: 595, height: 595, left: 1040, top: 338, background: mint, filter: "blur(295.05px)" }} />
        </div>
      </div>
      {/* mobile */}
      <div className="absolute inset-0 xl:hidden">
        <div className="absolute opacity-30">
          <div className="blob absolute" style={{ width: 383, height: 383, left: -150, top: 149, background: grad, opacity: 0.3, filter: "blur(73px)" }} />
          <div className="blob absolute" style={{ width: 293, height: 293, left: -106, top: 311, background: mint, filter: "blur(145px)" }} />
        </div>
        <div className="absolute opacity-20">
          <div className="blob absolute" style={{ width: 383, height: 383, left: 216, top: 199, background: grad, opacity: 0.3, filter: "blur(73px)" }} />
          <div className="blob absolute" style={{ width: 293, height: 293, left: 260, top: 361, background: mint, filter: "blur(145px)" }} />
        </div>
      </div>
    </div>
  );
}

/* The prominent green wash at the top of the mobile member screens. Figma
   paints it as a band behind the page heading (mobile waitlist 524:14945:
   ~#E6FBE7 at the heading, back to white by ~340px), but the blurred circles
   alone are far too faint to read on a phone — the old pages tried to fake it
   with a flat #E4F6E5 wash, which killed the gradient's depth instead. This is
   one shared element so every screen in the flow reads identically. */
export function MobileTopWash({ height = 520 }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 xl:hidden"
      style={{
        height,
        background:
          "linear-gradient(180deg, rgba(230,251,231,0.95) 0%, rgba(226,250,228,0.85) 34%, rgba(240,252,240,0.45) 66%, rgba(255,255,255,0) 100%)",
      }}
    />
  );
}

/* Soft ambient background blobs (Figma "BLUR BG") */
export function BlurBg({ variant = "page" }) {
  return variant === "hero" ? <HeroBlobs /> : variant === "join" ? <JoinBlobs /> : <PageBlobs />;
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
