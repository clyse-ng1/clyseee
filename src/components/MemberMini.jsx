import avatarAccount from "../assets/avatar-account.webp";

/* Mobile member header (join flow): 50px avatar + name + since. */
export default function MemberMini() {
  return (
    <div className="flex items-center gap-[6px]">
      <img
        src={avatarAccount}
        alt="Marcus Saris"
        className="h-[50px] w-[50px] rounded-full object-cover"
      />
      <div>
        <p className="text-[24.77px] leading-[28px] font-bold text-ink">
          Marcus Saris
        </p>
        <p className="text-[12.88px] leading-[20px] font-semibold text-[#6B6B6B]">
          Member on Clyse Since 20/11/2026
        </p>
      </div>
    </div>
  );
}
