import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import BrandTile from "../components/BrandTile";
import LogoMarquee from "../components/LogoMarquee";
import CreateGroupHead from "../components/CreateGroupHead";
import { BlurBg } from "../components/Decor";
import { api, accessLabel, brandOf, kobo } from "../lib/api";
import iconCheck from "../assets/check-green-circle.svg";
import iconBanknote from "../assets/banknote-white.svg";

/* Figma samples, shown on the static waitlist path (no invite context). */
const INFO = [
  ["Available Slot:", "12 Slot left"],
  ["Access Method:", "Access Link"],
  ["Group Visibility:", "Public Group"],
  ["Group ID:", "AD-234250569575"],
];

function MakePayment({ className = "", pay, busy, disabled }) {
  if (!pay) {
    return (
      <Link
        to="/join/payment"
        className={`bg-btn flex h-[60px] w-full items-center justify-center rounded-[16px] ${className}`}
      >
        <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
          Make Payment
        </span>
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={pay}
      disabled={disabled || busy}
      className={`bg-btn flex h-[60px] w-full items-center justify-center rounded-[16px] ${disabled && !busy ? "opacity-50" : ""} ${className}`}
    >
      <span className="text-[18px] leading-[22px] font-semibold text-[#F1F8F1]">
        {busy ? "Processing…" : "Make Payment"}
      </span>
    </button>
  );
}

export default function JoinSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const inviteToken = params.token || location.state?.invite_token || null;
  const code = location.state?.code || null;
  const stateGroupId = location.state?.group_id || null;
  const statePreview = location.state?.preview || null;
  const real = !!(inviteToken || code || stateGroupId);

  const [preview, setPreview] = useState(null);
  const [balance, setBalance] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!real) return;
    let live = true;
    (async () => {
      if (stateGroupId && statePreview) {
        setPreview({ group: statePreview });
        const w = await api("/member/wallet");
        if (live && w.data) setBalance(w.data.wallet?.balance_kobo ?? w.data.balance_kobo ?? 0);
        return;
      }
      if (stateGroupId && !statePreview) {
        navigate("/join/failed", {
          replace: true,
          state: {
            title: "Open this group from your dashboard",
            body: "We lost the group details along the way. Please try again.",
            btnLabel: "Back to Dashboard",
            btnVariant: "dark",
            btnTo: "/dashboard",
            hideBack: true,
          },
        });
        return;
      }
      const pv = inviteToken
        ? await api(`/member/groups/by-invite?token=${encodeURIComponent(inviteToken)}`)
        : await api(`/member/groups/by-code?code=${encodeURIComponent(code)}`);
      if (!live) return;
      if (pv.error || (inviteToken && !pv.data?.valid)) {
        navigate("/join/failed", {
          replace: true,
          state: {
            title: "This invite link is no longer valid",
            body: "Ask the group creator for a fresh invite link.",
            btnLabel: "Browse Subscriptions",
            btnVariant: "dark",
            btnTo: "/marketplace",
            hideBack: true,
          },
        });
        return;
      }
      if (code && pv.data && pv.data.can_join === false) {
        const reason = pv.data.join_block_reason;
        if (reason === "already_member") {
          navigate("/join/already", {
            replace: true,
            state: {
              title: "You're already in this group",
              body: "You already hold a slot here — no charge was made.",
              btnLabel: "View My Subscriptions",
              btnVariant: "dark",
              btnTo: "/subscriptions",
              hideBack: true,
            },
          });
          return;
        }
        navigate("/join/failed", {
          replace: true,
          state: {
            title: "You can't join this group",
            body:
              reason === "own_group"
                ? "You can't join a group you created."
                : reason === "full"
                  ? "This group is full."
                  : "This group is no longer available.",
            btnLabel: "Browse Subscriptions",
            btnVariant: "dark",
            btnTo: "/marketplace",
            hideBack: true,
          },
        });
        return;
      }
      setPreview(pv.data);
      const w = await api("/member/wallet");
      if (live && w.data) setBalance(w.data.wallet?.balance_kobo ?? w.data.balance_kobo ?? 0);
    })();
    return () => {
      live = false;
    };
  }, [real, inviteToken, code, stateGroupId, statePreview, navigate]);

  const group = preview?.group || null;
  const plan = group?.plan || {};
  const service = group?.service || {};
  // Price split: unit + Clyse (platform) fee = total. Previews carry it on
  // group.price or the nested plan depending on the endpoint.
  const price = group?.price || {};
  const unit =
    price.unit_kobo ?? plan.unit_price_kobo ?? plan.unit_kobo ?? null;
  const fee =
    price.platform_kobo ?? plan.platform_fee_kobo ?? plan.platform_kobo ?? null;
  const total =
    price.total_kobo ??
    plan.total_price_kobo ??
    plan.total_kobo ??
    (unit != null && fee != null ? unit + fee : null);
  const sufficient = total != null && balance != null && balance >= total;

  const vBrand = group ? brandOf(service) : "netflix";
  const vEyebrow = real ? "JOIN GROUP" : "WAITLIST DETAILS";
  const vTitle = group
    ? [service.name, plan.name].filter(Boolean).join(" ") || "Group"
    : "Netflix Premium";
  const vPlanLine = group
    ? `${plan.name || "Premium"} Plan | ${(group.creator?.first_name || "Creator") + "'s Group"}`
    : "Premium Plan | Monthly Plan";
  const vPrice = total != null ? kobo(total) : "N 2,000";
  const vUnit = unit != null ? kobo(unit) : vPrice;
  const vFee = fee != null ? kobo(fee) : real ? "Included" : "N200";
  const vTotal = total != null ? kobo(total) : "N2,500";
  const vBalance = balance != null ? kobo(balance) : "N 3,000";
  const vInfo = group
    ? [
        ["Available Slot:", `${group.available_slots ?? 0} Slot left`],
        ["Access Method:", accessLabel(group.access_method) || "Access Link"],
        [
          "Group Visibility:",
          group.visibility === "private" ? "Private Group" : "Public Group",
        ],
        ["Group ID:", group.invite_code || group.id || "—"],
      ]
    : INFO;

  const pay = async () => {
    if (busy || total == null) return;
    setBusy(true);
    setError("");
    const body = inviteToken
      ? { invite_token: inviteToken }
      : code
        ? { code }
        : { group_id: stateGroupId };
    const { data, error: apiError } = await api("/member/groups/join", {
      method: "POST",
      body,
    });
    setBusy(false);
    if (!apiError && data?.status === "already_member") {
      navigate("/join/already", {
        state: {
          title: "You're already in this group",
          body: "You already hold a slot here — no charge was made.",
          btnLabel: "View My Subscriptions",
          btnVariant: "dark",
          btnTo: "/subscriptions",
          hideBack: true,
        },
      });
      return;
    }
    if (apiError) {
      const c = apiError.code || "";
      if (c === "already_member") {
        navigate("/join/already", {
          state: {
            title: "You're already in this group",
            body: "You already hold a slot here — no charge was made.",
            btnLabel: "View My Subscriptions",
            btnVariant: "dark",
            btnTo: "/subscriptions",
            hideBack: true,
          },
        });
        return;
      }
      if (c === "insufficient_balance") {
        navigate("/join/failed", {
          state: {
            title: "Insufficient wallet balance",
            body: `You need ${kobo(total)} to join. Top up your wallet and try again.`,
            btnLabel: "Fund Wallet",
            btnVariant: "dark",
            btnTo: "/wallet",
            hideBack: true,
          },
        });
        return;
      }
      if (c === "group_full") {
        navigate("/join/failed", {
          state: {
            title: "This group is full",
            body: "All slots were just taken. Browse other open groups.",
            btnLabel: "Browse Subscriptions",
            btnVariant: "dark",
            btnTo: "/marketplace",
            hideBack: true,
          },
        });
        return;
      }
      if (c === "forbidden") {
        navigate("/join/failed", {
          state: {
            title: "You can't join your own group",
            body: "Creators can't take a slot in their own group.",
            btnLabel: "View My Groups",
            btnVariant: "dark",
            btnTo: "/groups",
            hideBack: true,
          },
        });
        return;
      }
      navigate("/join/failed", {
        state: {
          title: "Could not join the group",
          body: apiError.message || "Something went wrong. Please try again.",
          btnLabel: "Browse Subscriptions",
          btnVariant: "dark",
          btnTo: "/marketplace",
          hideBack: true,
        },
      });
      return;
    }
    navigate("/join/success", {
      state: {
        title: "You've joined the group!",
        body: `Welcome to ${vTitle}. Your access details are under Subscriptions.`,
        btnLabel: "View My Subscriptions",
        btnVariant: "dark",
        btnTo: "/subscriptions",
        hideBack: true,
      },
    });
  };

  const balanceBlock =
    !real || sufficient ? (
      <>
        <div className="mt-[40px] ml-[20px] flex items-center gap-[10px]">
          <img src={iconCheck} alt="" className="h-[30px] w-[30px]" />
          <p className="text-[25px] leading-[35px] font-semibold text-black">
            Sufficient Balance
          </p>
        </div>
        <p className="mt-[10px] ml-[20px] text-[18px] leading-[22px] font-semibold text-black">
          Your wallet balance is enough to cover this payment
        </p>
      </>
    ) : (
      <>
        <div className="mt-[40px] ml-[20px] flex items-center gap-[10px]">
          <p className="text-[25px] leading-[35px] font-semibold text-[#FF0000]">
            Insufficient Balance
          </p>
        </div>
        <p className="mt-[10px] ml-[20px] text-[18px] leading-[22px] font-semibold text-black">
          Fund your wallet to join this group.{" "}
          <Link to="/wallet" className="text-clyse">
            Fund Wallet
          </Link>
        </p>
      </>
    );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden xl:block">
        <BlurBg variant="hero" />
        <div className="relative mt-[102px] flex gap-[50px] bg-white">
          <div className="w-[690px] flex-none">
            <CreateGroupHead chip="#DFFFE0" />
            <div className="px-[63px] pt-[30px] pb-[30px]">
              <div className="flex items-start">
                <BrandTile brand={vBrand} size={75} plain />
                <div className="ml-[20px]">
                  <p className="text-[18px] leading-[22px] font-semibold text-clyse">
                    {vEyebrow}
                  </p>
                  <p className="mt-[16px] text-[35px] leading-[43px] font-bold text-ink">
                    {vTitle}
                  </p>
                  <p className="mt-[5px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    {vPlanLine}
                  </p>
                </div>
                <p className="mr-[-83px] ml-auto flex items-start">
                  <span className="text-[35px] leading-[43px] font-bold text-ink">
                    {vPrice}
                  </span>
                  <span className="mt-[11px] ml-[2px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    /Monthly
                  </span>
                </p>
              </div>
              <div className="mt-[60px] flex gap-[30px]">
                <div className="h-[153px] w-[266px] rounded-[7px] bg-[#DFFFE0] px-[30px] pt-[40px]">
                  <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Fixed Unit Price
                  </p>
                  <p className="mt-[8px] text-[35px] leading-[43px] font-bold text-ink">
                    {vUnit}
                  </p>
                </div>
                <div className="h-[151px] w-[268px] rounded-[7px] bg-[#F1F8F1] px-[31px] pt-[41px]">
                  <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Clyse Fee
                  </p>
                  <p className="mt-[17px] text-[35px] leading-[43px] font-bold text-clyse">
                    {vFee}
                  </p>
                </div>
              </div>
              <h2 className="mt-[50px] text-[35px] leading-[43px] font-bold text-ink">
                Group Information
              </h2>
              <div className="mt-[35px] rounded-[30px] bg-white px-[30px] pt-[30px] pb-[30px]">
                {vInfo.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-[10px] first:pt-0 last:pb-0">
                    <span className="text-[25px] leading-[35px] font-semibold text-[#4E4E4E]">
                      {k}
                    </span>
                    <span className="text-[25px] leading-[35px] font-semibold text-[#013104]">
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[500px] flex-none">
            <div className="px-[50px] pt-[30px] pb-[31px]">
              <p className="text-[35px] leading-[43px] font-bold text-ink">
                Payment Summary
              </p>
            </div>
            <div className="px-[30px] pt-[30px] pb-[30px]">
              <div className="mx-[20px] flex items-center justify-between">
                <span className="text-[25px] leading-[35px] font-semibold text-[#4E4E4E]">
                  Fixed Unit Price
                </span>
                <span className="text-[25px] leading-[35px] font-semibold text-[#013104]">
                  {vUnit}
                </span>
              </div>
              <div className="mt-[41px] mx-[20px] flex items-center justify-between">
                <span className="text-[25px] leading-[35px] font-semibold text-[#4E4E4E]">
                  Clyse Fee
                </span>
                <span className="text-[25px] leading-[35px] font-semibold text-[#013104]">
                  {vFee}
                </span>
              </div>
              <div className="mt-[61px] flex h-[85px] items-center rounded-[15px] bg-[#DFFFE0] px-[21px]">
                <span className="text-[25px] leading-[35px] font-semibold text-[#036F09]">
                  Total Amount
                </span>
                <span className="ml-auto text-[35px] leading-[43px] font-bold text-[#036F09]">
                  {vTotal}
                </span>
              </div>
              <p className="mt-[40px] text-[18px] leading-[22px] font-semibold text-black">
                Have a Promo Code or Coupon?
              </p>
              <input
                placeholder="Enter Code or Coupon"
                className="mt-[10px] h-[64px] w-full rounded-[10px] border border-[#999999] bg-white px-[21px] text-[18px] leading-[22px] font-semibold text-ink outline-none placeholder:text-[#999999]"
              />
              <div className="mt-[40px] rounded-[20px] bg-[#F1F8F1] px-[21px] pt-[31px] pb-[31px]">
                <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                  Current Wallet Balance
                </p>
                <div className="mt-[10px] flex items-center gap-[10px]">
                  <span className="grid h-[32px] w-[32px] flex-none place-items-center rounded-[14px] bg-[#048B0B]">
                    <img src={iconBanknote} alt="" className="h-[18px] w-[18px]" />
                  </span>
                  <span className="text-[35px] leading-[43px] font-bold text-ink">
                    {vBalance}
                  </span>
                </div>
              </div>
              {balanceBlock}
              {error && (
                <p className="mt-[10px] ml-[20px] text-[16px] font-semibold text-[#FF0000]">
                  {error}
                </p>
              )}
              <MakePayment
                className="mt-[62px]"
                pay={real ? pay : null}
                busy={busy}
                disabled={real && (total == null || !sufficient)}
              />
            </div>
          </div>
        </div>
      </main>
      <div className="hidden xl:block">
        <LogoMarquee className="mt-[60px]" />
        <div className="pb-[60px]" />
      </div>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative bg-white">
          <CreateGroupHead />
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[30px] pb-[30px]">
            <div className="flex items-start">
              <BrandTile brand={vBrand} size={50} plain />
              <div className="ml-[20px]">
                <p className="text-[18px] leading-[22px] font-semibold text-clyse">
                  {vEyebrow}
                </p>
                <p className="mt-[6px] text-[30px] leading-[37px] font-bold text-ink">
                  {vTitle}
                </p>
                <p className="mt-[1px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                  {vPlanLine}
                </p>
              </div>
            </div>
            <div className="mt-[60px] flex gap-[30px]">
              <div className="h-[95px] w-[169px] rounded-[7px] bg-[#DFFFE0] px-[32px] pt-[20px]">
                <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Fixed Unit Price
                </p>
                <p className="text-[25px] leading-[30px] font-bold text-ink">
                  {vUnit}
                </p>
              </div>
              <div className="h-[97px] w-[171px] rounded-[7px] bg-[#F1F8F1] px-[53px] pt-[21px]">
                <p className="text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Clyse Fee
                </p>
                <p className="text-[25px] leading-[30px] font-bold text-clyse">
                  {vFee}
                </p>
              </div>
            </div>
            <h2 className="mt-[30px] text-[25px] leading-[30px] font-bold text-ink">
              Group Information
            </h2>
            <div className="mt-[28px] rounded-[30px] bg-white px-[14px] pt-[30px] pb-[30px]">
              {vInfo.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-[10px] first:pt-0 last:pb-0">
                  <span className="text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
                    {k}
                  </span>
                  <span className="text-[18px] leading-[22px] font-semibold text-[#013104]">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative bg-white">
          <div className="px-[30px] pt-[30px] pb-[66px]">
            <p className="text-[35px] leading-[43px] font-bold text-ink">
              Payment Summary
            </p>
            <div className="mt-[30px] flex items-center justify-between">
              <span className="ml-[20px] text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
                Fixed Unit Price
              </span>
              <span className="mr-[20px] text-[25px] leading-[35px] font-semibold text-[#013104]">
                {vUnit}
              </span>
            </div>
            <div className="mt-[41px] flex items-center justify-between">
              <span className="ml-[20px] text-[13px] leading-[20px] font-semibold text-[#4E4E4E]">
                Clyse Fee
              </span>
              <span className="mr-[20px] text-[25px] leading-[35px] font-semibold text-[#013104]">
                {vFee}
              </span>
            </div>
            <div className="mt-[61px] flex h-[79px] items-center rounded-[15px] bg-[#DFFFE0] px-[21px]">
              <span className="text-[18px] leading-[22px] font-semibold text-[#036F09]">
                Total Amount
              </span>
              <span className="ml-auto text-[30px] leading-[37px] font-bold text-[#036F09]">
                {vTotal}
              </span>
            </div>
            <p className="mt-[40px] text-[18px] leading-[22px] font-semibold text-black">
              Have a Promo Code or Coupon?
            </p>
            <input
              placeholder="Enter Code or Coupon"
              className="mt-[10px] h-[64px] w-full rounded-[10px] border border-[#999999] bg-white px-[21px] text-[18px] leading-[22px] font-semibold text-ink outline-none placeholder:text-[#999999]"
            />
            <div className="mt-[40px] rounded-[20px] bg-[#F1F8F1] px-[21px] pt-[31px] pb-[31px]">
              <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                Current Wallet Balance
              </p>
              <div className="mt-[10px] flex items-center gap-[10px]">
                <span className="grid h-[32px] w-[32px] flex-none place-items-center rounded-[14px] bg-[#048B0B]">
                  <img src={iconBanknote} alt="" className="h-[18px] w-[18px]" />
                </span>
                <span className="text-[30px] leading-[37px] font-bold text-ink">
                  {vBalance}
                </span>
              </div>
            </div>
            {balanceBlock}
            {error && (
              <p className="mt-[10px] ml-[20px] text-[16px] font-semibold text-[#FF0000]">
                {error}
              </p>
            )}
            <MakePayment
              className="mt-[62px]"
              pay={real ? pay : null}
              busy={busy}
              disabled={real && (total == null || !sufficient)}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
