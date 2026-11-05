/* Shared desktop wallet hero blocks (Figma: Wallet / Wallet Empty right column).
   Extracted so /wallet and /wallet/empty render the identical 830px cards:
   balance card (830x346, r20) + Quick Actions (830x253, r20), 50px apart. */
import iconBalance from "../assets/balance-glyph.svg";
import iconHeroGlyph from "../assets/hero-glyph.svg";
import iconFundPlus from "../assets/fund-plus.svg";
import iconFundArrow from "../assets/fund-arrow.svg";
import iconPlusWhite from "../assets/plus-white.svg";
import iconArrowInk from "../assets/arrow-ink.svg";
import iconQaPlus from "../assets/qa-plus.svg";
import iconQaSliders from "../assets/qa-sliders.svg";
import iconQaClock from "../assets/qa-clock.svg";
import iconQaSupport from "../assets/qa-support.svg";

const QA = [
  { icon: "plus", label: "Fund Wallet", key: "fund" },
  { icon: "sliders", label: "View Limits" },
  { icon: "clock", label: "Transaction History" },
  { icon: "support", label: "Help & Support" },
];
const QA_ICONS = {
  plus: iconQaPlus,
  sliders: iconQaSliders,
  clock: iconQaClock,
  support: iconQaSupport,
};

function QACard({ item, onFund }) {
  const inner = (
    <>
      <img src={QA_ICONS[item.icon]} alt="" className="mx-auto w-[30px]" />
      <p className="mt-[10px] text-center text-[15px] leading-[18px] font-semibold text-[#013104]">
        {item.label}
      </p>
    </>
  );
  if (item.key === "fund") {
    return (
      <button
        type="button"
        onClick={onFund}
        className="h-[100px] w-full cursor-pointer rounded-[10px] bg-white pt-[21px] shadow-[0_0_20px_rgba(0,23,1,0.10)]"
      >
        {inner}
      </button>
    );
  }
  return (
    <div className="h-[100px] rounded-[10px] bg-white pt-[21px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
      {inner}
    </div>
  );
}

export function WalletBalanceCard({ balance, onFund, onWithdraw }) {
  return (
    <div className="bg-btn relative mt-[50px] h-[346px] rounded-[20px] px-[32px] pt-[32px] pb-[32px]">
      <div className="flex h-[32px] items-center">
        <span className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#048B0B]">
          <img src={iconBalance} alt="" className="w-[18px]" />
        </span>
        <span className="ml-[8px] text-[18px] leading-[22px] font-semibold text-white">
          Available Balance
        </span>
      </div>
      <div className="mt-[28px] flex items-center">
        <p className="text-[80px] leading-[98px] font-bold text-white">{balance}</p>
        <span className="ml-[12px] flex h-[43px] w-[90px] items-center justify-center rounded-[14px] bg-[#048B0B] text-[25px] leading-[35px] font-semibold text-white">
          NGN
        </span>
      </div>
      <p className="mt-[12px] text-[14px] leading-[20px] text-white">
        Ready for your next shared subscription.
      </p>
      <div className="mt-[32px] flex gap-[40px]">
        <button
          type="button"
          onClick={onFund}
          className="flex h-[60px] w-[200px] items-center rounded-[10px] bg-[#F1F8F1] pl-[30px]"
        >
          <span className="relative h-[18px] w-[28px] flex-none">
            <img src={iconFundArrow} alt="" className="absolute top-[2px] left-0 w-[15px]" />
            <img src={iconFundPlus} alt="" className="absolute top-0 left-[10px] w-[18px]" />
          </span>
          <span className="ml-[11px] text-[18px] font-semibold text-ink">Add Fund</span>
        </button>
        <button
          type="button"
          onClick={onWithdraw || onFund}
          className="flex h-[60px] w-[200px] items-center rounded-[10px] bg-[#048B0B] pl-[26px]"
        >
          <span className="relative h-[30px] w-[36px] flex-none">
            <img src={iconPlusWhite} alt="" className="absolute top-[6px] left-0 w-[18px]" />
            <span className="absolute top-0 left-[6px] flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white">
              <img src={iconArrowInk} alt="" className="w-[15px] rotate-180" />
            </span>
          </span>
          <span className="ml-[10px] whitespace-nowrap text-[18px] font-semibold text-white">
            Withdraw Fund
          </span>
        </button>
      </div>
      <span className="absolute top-[71px] right-[32px] flex h-[112px] w-[112px] items-center justify-center rounded-full bg-white">
        <img src={iconHeroGlyph} alt="" className="w-[44px]" />
      </span>
    </div>
  );
}

export function WalletQuickActions({ onFund }) {
  return (
    <div className="bg-btn mt-[50px] h-[253px] rounded-[20px] pb-[40px]">
      <h2 className="mt-[40px] ml-[90px] text-[35px] leading-[43px] font-semibold text-white">
        Quick Actions
      </h2>
      <div className="mx-[30px] mt-[30px] grid grid-cols-4 gap-[10px]">
        {QA.map((q) => (
          <QACard key={q.label} item={q} onFund={onFund} />
        ))}
      </div>
    </div>
  );
}
