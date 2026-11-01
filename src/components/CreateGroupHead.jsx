import iconBank from "../assets/bank-ink.svg";

/* "Create Group" header strip on the join-group flow (P7+): bank chip +
   "Join Group" title. Desktop chip colour varies per page (literal). */
export default function CreateGroupHead({ title = "Join Group", chip = "#B1DBB3", mBig = false }) {
  return (
    <>
      <div className="hidden px-[63px] pt-[30px] pb-[31px] xl:block">
        <div className="flex items-start">
          <span
            className="grid h-[50px] w-[54px] flex-none place-items-center rounded-[10px]"
            style={{ backgroundColor: chip }}
          >
            <img src={iconBank} alt="" className="h-[30px] w-[30px]" />
          </span>
          <span className="mt-[3px] ml-[20px] text-[35px] leading-[43px] font-bold text-ink">
            {title}
          </span>
        </div>
      </div>
      <div className="px-[30px] pt-[30px] pb-[31px] xl:hidden">
        <div className="flex items-start">
          <span
            className={`grid flex-none place-items-center rounded-[10px] bg-[#DFFFE0] ${
              mBig ? "h-[50px] w-[54px]" : "h-[44px] w-[48px]"
            }`}
          >
            <img
              src={iconBank}
              alt=""
              className={mBig ? "h-[30px] w-[30px]" : "h-[24px] w-[24px]"}
            />
          </span>
          <span
            className={`ml-[20px] text-[20px] leading-[24px] font-bold text-ink ${
              mBig ? "mt-[13px]" : "mt-[10px]"
            }`}
          >
            {title}
          </span>
        </div>
      </div>
    </>
  );
}
