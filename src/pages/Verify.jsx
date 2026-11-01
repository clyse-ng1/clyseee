import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Page, AuthSplit, CenterCard } from "../components/AuthLayout";
import { OtpInput, CtaButton } from "../components/Forms";
import { StatusCircle } from "../components/Decor";
import { useAuth } from "../lib/useAuth";
import collageE1 from "../assets/collage-email-1.webp";
import collageE2 from "../assets/collage-email-2.webp";
import collageE3 from "../assets/collage-email-3.webp";
import collageMobile from "../assets/collage-mobile.webp";

const FALLBACK_EMAIL = "sideeqyusuff1997@gmail.com";

export function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verify, resend } = useAuth();
  const EMAIL = location.state?.email || location.state?.destination || FALLBACK_EMAIL;
  const identifier = location.state?.email
    ? { email: location.state.email }
    : location.state?.phone
      ? { phone: location.state.phone }
      : { email: EMAIL };
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");
  const [resent, setResent] = useState(false);

  const complete = otp.every(Boolean);
  const btnState = busy ? "disabled" : failed ? "error" : complete ? "active" : "disabled";
  const collage = failed ? collageE2 : complete ? collageE3 : collageE1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complete || busy) return;
    setBusy(true);
    setApiError("");
    const { error } = await verify(identifier, otp.join(""));
    setBusy(false);
    if (error) {
      setFailed(true);
      setApiError(error.message || "The OTP is not correct.");
      return;
    }
    navigate("/verify-email/success");
  };

  const handleOtp = (next) => {
    setOtp(next);
    setFailed(false);
    setApiError("");
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setFailed(false);
    setApiError("");
    const { error } = await resend(identifier);
    if (error) setApiError(error.message || "Could not resend the code. Please try again.");
    else setResent(true);
  };

  return (
    <Page>
      <AuthSplit
        collage={collage}
        collageMobile={collageMobile}
        compact
        title="Please check your mail"
        sub={
          <>
            We have sent a verification code to your email
            <br />
            <span className="text-clyse">{EMAIL}</span>
          </>
        }
        subClass="mt-[5px] text-center text-[12.5px] font-semibold leading-[16px] text-ash lg:mt-[5px] lg:text-[18px] lg:leading-[24px]"
        contentClass="mt-[34px] lg:mt-[50px]"
        formClass="py-[28px]! lg:py-[40px]!"
      >
        <form onSubmit={handleSubmit} className="flex flex-col">
          <OtpInput value={otp} onChange={handleOtp} state={failed ? "error" : "default"} />
          {(failed || apiError) && (
            <p className="mt-[35px] text-[12.5px] font-semibold leading-[15px] text-clyse-red lg:mt-[50px] lg:text-[18px] lg:leading-[22px]">
              {apiError || "The OTP is not correct."}{" "}
              <button type="button" onClick={handleResend} className="font-semibold text-clyse">
                Resend
              </button>
            </p>
          )}
          {resent && !apiError && (
            <p className="mt-[35px] text-[12.5px] font-semibold leading-[15px] text-clyse lg:mt-[50px] lg:text-[18px] lg:leading-[22px]">
              A new code was sent.
            </p>
          )}
          <div className="mt-[35px] lg:mt-[50px]">
            <CtaButton type="submit" state={btnState}>
              {busy ? "Verifying…" : "Verify"}
            </CtaButton>
          </div>
        </form>
      </AuthSplit>
    </Page>
  );
}

export function VerifySuccess() {
  const { user } = useAuth();
  return (
    <Page>
      <CenterCard>
        <div className="text-center">
          <div className="lg:hidden">
            <StatusCircle icon="check" size={90} />
          </div>
          <div className="hidden lg:block">
            <StatusCircle icon="check" size={130} />
          </div>
          <h1 className="mt-[35px] text-[24px] font-bold leading-[30px] text-ink lg:mt-[50px] lg:text-[35px] lg:leading-[43px]">
            Verification Successful
          </h1>
          <p className="mt-[5px] text-[12.5px] font-semibold text-ash lg:mt-[10px] lg:text-[18px] lg:leading-[22px]">
            Your account has been verified successfully
          </p>
          <Link
            to={sessionStorage.getItem("clyse.post_auth") || (user ? "/dashboard" : "/signin")}
            onClick={() => sessionStorage.removeItem("clyse.post_auth")}
            className="bg-deep mt-[35px] flex h-[35px] w-full items-center justify-center rounded-[3.5px] text-[12.5px] font-semibold text-mint transition hover:opacity-90 lg:mt-[50px] lg:h-[50px] lg:rounded-[5px] lg:text-[18px]"
          >
            {user ? "Go to Dashboard" : "Login"}
          </Link>
        </div>
      </CenterCard>
    </Page>
  );
}
