import JoinExtra from "./JoinExtra";

/* Dark gradient container behind the View/Create extra rows (join +
   waitlist sidebars desktop; full-bleed band on mobile). */
export default function ExtraBlock({ mobile = false, className = "" }) {
  if (mobile) {
    return (
      <div className={`relative bg-btn ${className}`}>
        <div className="mx-auto flex max-w-[430px] flex-col items-center gap-[30px] px-[30px] py-[50px]">
          <JoinExtra />
        </div>
      </div>
    );
  }
  return (
    <div className={`relative bg-btn h-[250px] w-[372px] rounded-[20px] px-[30px] pt-[50px] ${className}`}>
      <div className="flex flex-col gap-[30px]">
        <JoinExtra width="w-[312px]" />
      </div>
    </div>
  );
}
