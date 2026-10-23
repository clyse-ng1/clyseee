import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page, AuthSplit } from "../components/AuthLayout";
import { Field, CtaButton, SocialButtons, FormFooter } from "../components/Forms";
import { useAuth } from "../lib/useAuth";
import collageSignup from "../assets/collage-signup.webp";
import collageMobile from "../assets/collage-mobile.webp";

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");

  const emailOk = /.+@.+\..+/.test(email.trim());
  const filled = name.trim() && email.trim() && password && confirm;
  const mismatch = submitted && password !== confirm;
  const canSubmit = filled && emailOk && password.length >= 8 && password === confirm;

  const stateOf = (val) => (val ? "active" : "disabled");
  const pwState = mismatch ? "error" : stateOf(password);
  const confirmState = mismatch ? "error" : stateOf(confirm);
  const btnState = busy ? "disabled" : mismatch ? "error" : canSubmit ? "active" : "disabled";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setApiError("");
    if (!canSubmit || busy) return;
    setBusy(true);
    const { data, error } = await register({
      fullName: name.trim(),
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      setApiError(error.message || "Could not create your account. Please try again.");
      return;
    }
    navigate("/verify-email", {
      state: { email: email.trim(), destination: data?.destination },
    });
  };

  return (
    <Page>
      <AuthSplit collage={collageSignup} collageMobile={collageMobile} title="Sign Up">
        <form onSubmit={handleSubmit} className="flex flex-col gap-[21px] lg:gap-[30px]">
          <Field
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            state={stateOf(name)}
            autoComplete="name"
          />
          <Field
            label="Email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            state={stateOf(email)}
            autoComplete="email"
          />
          <Field
            label="Create Password"
            placeholder="Enter your Password"
            password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            state={pwState}
            showPassword={showPw}
            onTogglePassword={() => setShowPw((v) => !v)}
            autoComplete="new-password"
          />
          <Field
            label="Confirm Password"
            placeholder="Enter your Password"
            password
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            state={confirmState}
            showPassword={showConfirm}
            onTogglePassword={() => setShowConfirm((v) => !v)}
            error={mismatch ? "The password does not match" : ""}
            autoComplete="new-password"
          />
          <CtaButton type="submit" state={btnState}>
            {busy ? "Creating Account…" : "Create Account"}
          </CtaButton>
          {apiError && (
            <p className="-mt-[10px] text-center text-[12.5px] font-semibold leading-[16px] text-clyse-red lg:-mt-[14px] lg:text-[15px]">
              {apiError}
            </p>
          )}
          <SocialButtons />
        </form>
        <FormFooter text="I already have an account" linkText="Sign In" to="/signin" />
      </AuthSplit>
    </Page>
  );
}
