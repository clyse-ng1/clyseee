import DarkButton from "./DarkButton";

/* Join plan-picker card. Unselected: gray stroke, no status label at all —
   the mobile frames (JOINT WAITLIST MOBILE PAGE 2) only ever show a chip on
   the chosen card. Selected: green stroke, mint "Selected" pill (adds 6px
   height), dark Select with side-by-side pair. */
export default function PlanCard({ name, price, features, status, selected, onSelect }) {
  return (
    <article
      className={`w-[370px] rounded-[20px] border bg-white px-[31px] pt-[41px] pb-[41px] shadow-[0_0_20px_rgba(0,23,1,0.10)] xl:w-[358px] ${
        selected ? "h-[319px] border-clyse" : "h-[313px] border-[#BABABA]"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] leading-[22px] font-semibold text-ink">
          {name}
        </h3>
        {selected ? (
          <span className="grid h-[28px] w-[101px] place-items-center rounded-[14px] bg-[#DFFFE0]">
            <span className="text-[13px] leading-[20px] font-semibold text-clyse">
              {status}
            </span>
          </span>
        ) : (
          <span className="text-[13px] leading-[20px] font-semibold text-clyse">
            {status}
          </span>
        )}
      </div>
      <p className="mt-[26px] flex items-baseline">
        <span className="text-[25px] leading-[30px] font-bold text-ink">
          {price}
        </span>
        <span className="ml-[2px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
          /Monthly
        </span>
      </p>
      <p className="mt-[31px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
        {features}
      </p>
      {selected ? (
        <DarkButton onClick={onSelect} className="mt-[32px] w-full" icons={false}>
          Select
        </DarkButton>
      ) : (
        <button
          type="button"
          onClick={onSelect}
          className="mt-[32px] flex h-[56px] w-full items-center justify-center rounded-[10px] border border-[#BABABA] bg-white text-[17px] leading-[22px] font-semibold text-ink transition hover:border-clyse"
        >
          Select
        </button>
      )}
    </article>
  );
}
