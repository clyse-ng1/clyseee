import Navbar from "./Navbar";
import { BlurBg } from "./Decor";

/* Page shell: navbar + ambient blobs + content */
export function Page({ children, blur = true }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="relative overflow-hidden">
        {blur && <BlurBg />}
        <div className="relative z-[1]">{children}</div>
      </main>
    </div>
  );
}

/* Dark-green side panel with photo collage */
export function AuthPanel({ collage, collageMobile, compact = false }) {
  return (
    <div
      className={`bg-deep relative overflow-hidden px-[30px] pt-[40px] lg:rounded-tl-[30px] lg:rounded-bl-[30px] lg:px-[63px] ${
        compact ? "lg:pt-[40px]" : "lg:pt-[100px]"
      }`}
    >
      <h2 className="text-center font-display text-[30px] font-bold leading-[37px] text-white lg:text-left lg:font-sans lg:text-[35px] lg:leading-[43px]">
        Share the Cost.
        <br />
        Enjoy the Access.
      </h2>
      <p className="mx-auto mt-[15px] max-w-[494px] text-center font-display text-[13px] font-semibold leading-[20px] text-mint lg:mx-0 lg:mt-[20px] lg:text-left lg:font-sans lg:text-[18px] lg:leading-[22px]">
        Join trusted subscription groups, share available slots, and enjoy the services you love at
        a lower cost.
      </p>
      <img
        src={collageMobile || collage}
        alt=""
        className="-mb-[26px] -ml-[30px] mt-[15px] block w-[calc(100%+60px)] max-w-none lg:hidden"
      />
      <img
        src={collage}
        alt=""
        className="absolute bottom-0 left-0 hidden w-[620px] max-w-none lg:block"
      />
    </div>
  );
}

/* Split card: dark panel left, form right (stacked on mobile) */
export function AuthSplit({
  collage,
  collageMobile,
  compact = false,
  title,
  sub = null,
  subClass = "",
  contentClass = "mt-[24px] lg:mt-[35px]",
  children,
  formClass = "",
}) {
  return (
    <div className="px-0 py-0 lg:px-[24px] lg:py-[80px]">
      <div className="mx-auto grid w-full max-w-full grid-cols-1 bg-mint lg:w-full lg:max-w-[1240px] lg:grid-cols-[620px_1fr] lg:overflow-hidden lg:shadow-[2px_2px_25px_rgba(0,23,1,0.15)]">
        <AuthPanel collage={collage} collageMobile={collageMobile} compact={compact} />
        <div className={`bg-mint px-[30px] py-[35px] lg:px-[63px] lg:py-[50px] ${formClass}`}>
          <h1 className="text-center text-[24px] font-bold leading-[30px] text-ink lg:text-[35px] lg:leading-[43px]">
            {title}
          </h1>
          {sub && <div className={subClass}>{sub}</div>}
          <div className={`flex flex-col gap-[21px] lg:gap-[30px] ${contentClass}`}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* Centered mint card (success / reset flows) — square corners, vertically
   centered full-bleed panel on mobile */
export function CenterCard({ children }) {
  return (
    <div className="lg:px-[24px] lg:py-[80px]">
      <div className="mx-auto flex min-h-[calc(100svh-63px)] w-full max-w-full items-center bg-mint shadow-[2px_2px_25px_rgba(0,23,1,0.15)] lg:block lg:min-h-0 lg:w-full lg:max-w-[1240px]">
        <div className="w-full px-[30px] py-[69px] lg:py-[100px]">
          <div className="mx-auto w-full max-w-[370px] lg:max-w-[470px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
