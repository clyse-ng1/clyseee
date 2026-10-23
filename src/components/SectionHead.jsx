import iconWaitlistGreen from "../assets/side-waitlist-green.svg";

/* Join-flow section header: mint icon box + green waitlist glyph + title.
   Desktop 35px; mobile 30px on plan page, 35px on details page. */
export default function SectionHead({ mobile = false }) {
  return (
    <div className="flex items-center">
      <span className="grid h-[50px] w-[54px] flex-none place-items-center rounded-[10px] bg-[#B1DBB3]">
        <img src={iconWaitlistGreen} alt="" className="h-[26px] w-[26px]" />
      </span>
      <span
        className={`ml-[20px] font-bold text-ink ${
          mobile ? "text-[30px] leading-[37px]" : "text-[35px] leading-[43px]"
        }`}
      >
        Join Waitlist
      </span>
    </div>
  );
}
