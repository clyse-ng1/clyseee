import iconUserHead from "../assets/icon-user-head.svg";

/* Group-creation step header — desktop: 50px #B1DBB3 icon + 35/700 title +
   25/600 step + 1114x15 progress (fill = step/4). Mobile step 1 uses the
   0.6476 scale family (32px icon, 22.67/16.19), steps 2-4 use 0.6935
   (35px icon, 24.27/17.34); progress 370x10. */
const MOBILE = {
  1: { icon: 32, iconX: 30, textX: 75, title: 22.67, titleLh: 27.63, step: 16.19, stepLh: 22.67, glyph: 17, mt: 80, pmt: 51 },
  2: { icon: 35, iconX: 44, textX: 92, title: 24.27, titleLh: 29.59, step: 17.34, stepLh: 24.27, glyph: 18, mt: 71, pmt: 57 },
  3: { icon: 35, iconX: 30, textX: 79, title: 24.27, titleLh: 29.59, step: 17.34, stepLh: 24.27, glyph: 18, mt: 100, pmt: 52 },
  4: { icon: 35, iconX: 30, textX: 79, title: 24.27, titleLh: 29.59, step: 17.34, stepLh: 24.27, glyph: 18, mt: 100, pmt: 57 },
};

export default function StepHeader({ step }) {
  const m = MOBILE[step] || MOBILE[1];
  return (
    <>
      {/* Desktop */}
      <div className="hidden pb-[31px] xl:block">
        <div className="flex items-center">
          <span className="grid h-[50px] w-[50px] flex-none place-items-center rounded-[10px] bg-[#B1DBB3]">
            <img src={iconUserHead} alt="" className="h-[31px] w-[27px]" />
          </span>
          <span className="ml-[20px]">
            <span className="block text-[35px] leading-[43px] font-bold text-ink">
              Create Group
            </span>
            <span className="block text-[25px] leading-[35px] font-semibold text-ash">
              Step {step}/4
            </span>
          </span>
        </div>
        <div className="mt-[50px] h-[15px] w-[1114px] rounded-full bg-[#B1DBB3]">
          <div
            className="h-[15px] rounded-full bg-clyse"
            style={{ width: (1114 * step) / 4 }}
          />
        </div>
      </div>

      {/* Mobile */}
      <div className="xl:hidden" style={{ marginTop: m.mt }}>
        <div className="flex items-center" style={{ marginLeft: m.iconX }}>
          <span
            className="grid flex-none place-items-center bg-[#B1DBB3]"
            style={{
              width: m.icon,
              height: m.icon,
              borderRadius: m.icon === 32 ? 6.48 : 6.94,
            }}
          >
            <img src={iconUserHead} alt="" style={{ width: m.glyph }} />
          </span>
          <span style={{ marginLeft: m.textX - m.iconX - m.icon }}>
            <span
              className="block font-bold text-ink"
              style={{ fontSize: m.title, lineHeight: `${m.titleLh}px` }}
            >
              Create Group
            </span>
            <span
              className="block font-semibold text-ash"
              style={{ fontSize: m.step, lineHeight: `${m.stepLh}px` }}
            >
              Step {step}/4
            </span>
          </span>
        </div>
        <div
          className="mx-[30px] h-[10px] rounded-full bg-[#B1DBB3]"
          style={{ marginTop: m.pmt }}
        >
          <div
            className="h-[10px] rounded-full bg-clyse"
            style={{ width: (370 * step) / 4 }}
          />
        </div>
      </div>
    </>
  );
}
