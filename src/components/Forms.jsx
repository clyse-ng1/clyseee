import { useRef } from "react";
import { Link } from "react-router-dom";
import iconGoogle from "../assets/icon-google.png";
import iconApple from "../assets/icon-apple.png";
import iconEye from "../assets/icon-eye.png";
import iconEyeOff from "../assets/icon-eye-off.png";

const LABEL_COLOR = {
  disabled: "text-muted",
  active: "text-ink",
  error: "text-clyse-red",
};

const INPUT_BORDER = {
  disabled: "border-line",
  active: "border-clyse",
  error: "border-clyse-red",
};

/* Label + input field with Figma disabled / active / error states */
export function Field({
  label,
  state = "disabled",
  error,
  password = false,
  showPassword = false,
  onTogglePassword,
  value = "",
  ...inputProps
}) {
  const type = password ? (showPassword ? "text" : "password") : inputProps.type || "text";
  return (
    <div>
      <div>
        <label
          className={`mb-[4px] block text-[12.5px] font-semibold leading-[15px] lg:mb-[6px] lg:text-[18px] lg:leading-[22px] ${LABEL_COLOR[state]}`}
        >
          {label}
        </label>
        <div className="relative">
          <input
            {...inputProps}
            value={value}
            type={type}
            className={`h-[35px] w-full rounded-[3.5px] border bg-white px-[12px] text-[12.5px] font-semibold outline-none placeholder:font-semibold placeholder:text-muted lg:h-[50px] lg:rounded-[5px] lg:px-[20px] lg:text-[18px] ${INPUT_BORDER[state]} ${
              state === "error" ? "text-clyse-red" : "text-ink"
            } ${password ? "pr-[44px] lg:pr-[52px]" : ""}`}
          />
          {password && value && (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={onTogglePassword}
              className="absolute top-1/2 right-[10px] -translate-y-1/2 lg:right-[16px]"
            >
              <img
                src={showPassword ? iconEye : iconEyeOff}
                alt=""
                className={`h-[17px] w-auto lg:h-[24px] ${state === "error" ? "eye-error" : ""}`}
              />
            </button>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-[6px] text-[12.5px] font-semibold text-clyse-red lg:text-[18px]">{error}</p>
      )}
    </div>
  );
}

/* Main CTA button — grey / gradient / brick-red */
export function CtaButton({ state = "disabled", children, className = "", ...props }) {
  const styles =
    state === "active"
      ? "bg-btn text-[#F1F8F2] hover:opacity-90"
      : state === "error"
        ? "bg-brick text-white hover:opacity-90"
        : "bg-muted text-white";
  return (
    <button
      {...props}
      className={`h-[35px] w-full rounded-[3.5px] text-[12.5px] font-semibold transition lg:h-[50px] lg:rounded-[5px] lg:text-[18px] ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

/* Google / Apple continue buttons */
export function SocialButtons() {
  const cls =
    "flex h-[35px] w-full items-center justify-center gap-[8px] rounded-[3.5px] border border-clyse bg-white text-[12.5px] font-semibold text-ink transition hover:bg-mint lg:h-[50px] lg:gap-[10px] lg:rounded-[5px] lg:text-[18px]";
  return (
    <>
      <button type="button" className={cls}>
        <img src={iconGoogle} alt="" className="h-[14px] w-auto lg:h-[18px]" />
        Continue with Google
      </button>
      <button type="button" className={cls}>
        <img src={iconApple} alt="" className="h-[16px] w-auto lg:h-[22px]" />
        Continue with App
      </button>
    </>
  );
}

export function FormFooter({ text, linkText, to }) {
  return (
    <p className="-mt-[7px] text-center text-[12.5px] font-semibold text-black lg:-mt-[10px] lg:text-[18px]">
      {text}{" "}
      <Link to={to} className="text-clyse">
        {linkText}
      </Link>
    </p>
  );
}

/* Six-box OTP input with auto-advance, backspace nav + paste support */
export function OtpInput({ value, onChange, state = "default" }) {
  const refs = useRef([]);

  const border = state === "error" ? "border-clyse-red" : "border-line";
  const filledBorder = state === "error" ? "border-clyse-red" : "border-clyse";
  const digitColor = state === "error" ? "text-clyse-red" : "text-ink";

  const setDigit = (i, d) => {
    const next = [...value];
    next[i] = d;
    onChange(next);
  };

  const handleChange = (i, e) => {
    const d = e.target.value.replace(/\D/g, "").slice(-1);
    setDigit(i, d);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (value[i]) {
        setDigit(i, "");
      } else if (i > 0) {
        refs.current[i - 1]?.focus();
        setDigit(i - 1, "");
      }
    }
    if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    if (!digits.length) return;
    const next = ["", "", "", "", "", ""];
    digits.forEach((d, idx) => (next[idx] = d));
    onChange(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <div className="flex justify-between" onPaste={handlePaste}>
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className={`otp-box h-[42px] w-[45px] flex-none rounded-[7px] border bg-white text-center font-display text-[17.34px] font-semibold outline-none lg:h-[60px] lg:w-auto lg:max-w-[65px] lg:flex-1 lg:rounded-[10px] lg:text-[25px] ${digitColor} ${
            digit ? filledBorder : border
          }`}
        />
      ))}
    </div>
  );
}
