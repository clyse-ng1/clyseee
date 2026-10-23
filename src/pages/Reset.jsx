import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Page, CenterCard } from "../components/AuthLayout";
import { Field, CtaButton } from "../components/Forms";
import { StatusCircle } from "../components/Decor";
import { useAuth } from "../lib/useAuth";
import { idOf } from "../lib/api";

/* Step 1 — enter email */
export function ResetEmail() {
  const navigate = useNavigate();
  const { forgot } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true);
    setApiError("");
    const { error } = await forgot(idOf(email.trim()));
    setBusy(false);
    if (error) {
      setApiError(error.message || "Could not send the reset code. Please try again.");
      return;
    }
    navigate("/reset-password/check-mail", { state: { email: email.trim() } });
  };

  return (
    <Page>
      <CenterCard>
        <h1 className="text-center text-[24px] font-bold leading-[30px] text-ink lg:text-[35px] lg:leading-[43px]">
          Reset Password
        </h1>
        <p className="mx-auto mt-[5px] max-w-[326px] text-center text-[12.5px] font-semibold leading-[16px] text-ash lg:mt-[10px] lg:max-w-[470px] lg:text-[18px] lg:leading-[22px]">
          Enter the email associated with your account and we’ll send an email with instruction to
          reset your password
        </p>
        <form onSubmit={handleSubmit} className="mt-[35px] lg:mt-[50px]">
          <div className="text-left">
            <Field
              label="Email Address"
              type="email"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              state={email ? "active" : "disabled"}
              autoComplete="email"
            />
          </div>
          <div className="mt-[34px] lg:mt-[50px]">
            <CtaButton type="submit" state={busy || !email.trim() ? "disabled" : "active"}>
              {busy ? "Sending…" : "Send Instruction"}
            </CtaButton>
          </div>
          {apiError && (
            <p className="mt-[12px] text-center text-[12.5px] font-semibold leading-[16px] text-clyse-red lg:text-[15px]">
              {apiError}
            </p>
          )}
        </form>
      </CenterCard>
    </Page>
  );
}

/* Step 2 — check mail */
export function ResetCheckMail() {
  const location = useLocation();
  const { forgot } = useAuth();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const email = location.state?.email || "";

  const handleResend = async () => {
    if (!email || resending) return;
    setResending(true);
    const { error } = await forgot(idOf(email));
    setResending(false);
    if (!error) setResent(true);
  };

  return (
    <Page>
      <CenterCard>
        <div className="text-center">
          <div className="lg:hidden">
            <StatusCircle icon="mail" size={90} />
          </div>
          <div className="hidden lg:block">
            <StatusCircle icon="mail" size={130} />
          </div>
          <h1 className="mt-[35px] text-[24px] font-bold leading-[30px] text-ink lg:mt-[50px] lg:text-[35px] lg:leading-[43px]">
            Check your mail
          </h1>
          <p className="mt-[5px] text-[12.5px] font-semibold leading-[16px] text-ash lg:mt-[10px] lg:text-[18px] lg:leading-[22px]">
            We have sent a password recovery
            <br />
            instruction to your mail
          </p>
          <a
            href="mailto:"
            className="bg-deep mt-[35px] flex h-[35px] w-full items-center justify-center rounded-[3.5px] text-[12.5px] font-semibold text-mint transition hover:opacity-90 lg:mt-[50px] lg:h-[50px] lg:rounded-[5px] lg:text-[18px]"
          >
            Open email App
          </a>
          <div>
            <Link
              to="/reset-password/new"
              state={{ email }}
              className="mt-[10px] inline-block text-[12.5px] font-semibold text-smoke lg:mt-[15px] lg:text-[18px]"
            >
              I have the code — set a new password
            </Link>
          </div>
          {email && (
            <div>
              <button
                type="button"
                onClick={handleResend}
                className="mt-[10px] inline-block text-[12.5px] font-semibold text-clyse lg:mt-[12px] lg:text-[16px]"
              >
                {resending ? "Resending…" : resent ? "Code resent" : "Resend code"}
              </button>
            </div>
          )}
        </div>
      </CenterCard>
    </Page>
  );
}

/* Step 3 — new password (the API requires the 6-digit code from the email) */
export function ResetNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword } = useAuth();
  const fixedEmail = location.state?.email || "";
  const [email, setEmail] = useState(fixedEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");

  const mismatch = submitted && password !== confirm;
  const canSubmit =
    email.trim() && code.trim().length >= 4 && password.length >= 8 && password === confirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");
    if (!canSubmit || busy) return;
    setBusy(true);
    const { error } = await resetPassword(idOf(email.trim()), code.trim(), password);
    setBusy(false);
    if (error) {
      setApiError(error.message || "Could not reset your password. Please try again.");
      return;
    }
    navigate("/signin");
  };

  return (
    <Page>
      <CenterCard>
        <h1 className="mx-auto max-w-[326px] text-center text-[24px] font-bold leading-[30px] text-ink lg:max-w-[470px] lg:text-[35px] lg:leading-[43px]">
          Create A New Password
        </h1>
        <p className="mt-[5px] text-center text-[12.5px] font-semibold text-ash lg:mt-[10px] lg:text-[18px] lg:leading-[22px]">
          must be different from previously used passwords.
        </p>
        <form onSubmit={handleSubmit} className="mt-[35px] text-left lg:mt-[50px]">
          {!fixedEmail && (
            <div className="mb-[32px] lg:mb-[46px]">
              <Field
                label="Email Address"
                type="email"
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                state={email ? "active" : "disabled"}
                autoComplete="email"
              />
            </div>
          )}
          <Field
            label="Verification Code"
            placeholder="Enter the 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            state={code ? "active" : "disabled"}
            autoComplete="one-time-code"
          />
          <p className="mt-[7px] text-[12.5px] font-semibold leading-[15px] text-smoke lg:mt-[10px] lg:text-[18px] lg:leading-[22px]">
            The code from the email we sent you
          </p>
          <div className="mt-[32px] lg:mt-[46px]">
            <Field
              label="Create Password"
              placeholder="Enter your Password"
              password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              state={mismatch ? "error" : password ? "active" : "disabled"}
              showPassword={showPw}
              onTogglePassword={() => setShowPw((v) => !v)}
              autoComplete="new-password"
            />
            <p className="mt-[7px] text-[12.5px] font-semibold leading-[15px] text-smoke lg:mt-[10px] lg:text-[18px] lg:leading-[22px]">
              Must be at least 8 characters
            </p>
          </div>
          <div className="mt-[32px] lg:mt-[46px]">
            <Field
              label="Confirm Password"
              placeholder="Enter your Password"
              password
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              state={mismatch ? "error" : confirm ? "active" : "disabled"}
              showPassword={showConfirm}
              onTogglePassword={() => setShowConfirm((v) => !v)}
              autoComplete="new-password"
            />
            <p className="mt-[7px] text-[12.5px] font-semibold leading-[15px] text-smoke lg:mt-[10px] lg:text-[18px] lg:leading-[22px]">
              Both passwords must match
            </p>
          </div>
          <div className="mt-[32px] lg:mt-[46px]">
            <CtaButton
              type="submit"
              state={busy ? "disabled" : mismatch ? "error" : canSubmit ? "active" : "disabled"}
            >
              {busy ? "Resetting…" : "Reset Password"}
            </CtaButton>
          </div>
          {apiError && (
            <p className="mt-[12px] text-center text-[12.5px] font-semibold leading-[16px] text-clyse-red lg:text-[15px]">
              {apiError}
            </p>
          )}
        </form>
      </CenterCard>
    </Page>
  );
}
