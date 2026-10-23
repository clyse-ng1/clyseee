import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Page, AuthSplit } from "../components/AuthLayout";
import { Field, CtaButton, SocialButtons, FormFooter } from "../components/Forms";
import { useAuth } from "../lib/useAuth";
import { idOf } from "../lib/api";
import collageSignin from "../assets/collage-signin.webp";
import collageMobile from "../assets/collage-mobile.webp";

export default function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [apiError, setApiError] = useState("");

  const from = location.state?.from || "/dashboard";
  const valid = /.+@.+\..+/.test(email.trim()) && password.length >= 8;
  const btnState = busy ? "disabled" : failed ? "error" : valid ? "active" : "disabled";
  const fieldState = (val) => (failed ? "error" : val ? "active" : "disabled");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) {
      setFailed(true);
      return;
    }
    if (busy) return;
    setBusy(true);
    setApiError("");
    const identifier = idOf(email.trim());
    const { error } = await login(identifier, password);
    setBusy(false);
    if (error) {
      // Correct password but unverified contact -> finish verification first.
      if (error.code === "verification_required") {
        navigate("/verify-email", { state: { ...identifier } });
        return;
      }
      setFailed(true);
      setApiError(error.message || "Sign in failed. Please try again.");
      return;
    }
    const postAuth = sessionStorage.getItem("clyse.post_auth");
    sessionStorage.removeItem("clyse.post_auth");
    navigate(postAuth || from, { replace: true });
  };

  return (
    <Page>
      <AuthSplit collage={collageSignin} collageMobile={collageMobile} title="Sign In">
        <form onSubmit={handleSubmit} className="flex flex-col gap-[21px] lg:gap-[30px]">
          <Field
            label="Email or Username"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFailed(false);
              setApiError("");
            }}
            state={fieldState(email)}
            autoComplete="email"
          />
          <div>
            <Field
              label="Password"
              placeholder="Enter your Password"
              password
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFailed(false);
                setApiError("");
              }}
              state={fieldState(password)}
              showPassword={showPw}
              onTogglePassword={() => setShowPw((v) => !v)}
              error={failed && !apiError ? "The password does not match" : ""}
              autoComplete="current-password"
            />
            {email.trim() && (
              <div className="mt-[4px] text-center lg:mt-[6px]">
                <Link
                  to="/reset-password"
                  className="text-[12.5px] font-semibold leading-[15px] text-clyse underline lg:text-[18px] lg:leading-[22px]"
                >
                  Forgot your Password?
                </Link>
              </div>
            )}
          </div>
          <CtaButton type="submit" state={btnState}>
            {busy ? "Signing In…" : "Sign In"}
          </CtaButton>
          {apiError && (
            <p className="-mt-[10px] text-center text-[12.5px] font-semibold leading-[16px] text-clyse-red lg:-mt-[14px] lg:text-[15px]">
              {apiError}
            </p>
          )}
          <SocialButtons />
        </form>
        <FormFooter text="I don't have an account" linkText="Sign Up" to="/signup" />
      </AuthSplit>
    </Page>
  );
}
