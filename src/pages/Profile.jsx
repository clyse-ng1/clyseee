import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ExtraBlock from "../components/ExtraBlock";
import MemberMini from "../components/MemberMini";
import { BlurBg } from "../components/Decor";
import { useAuth } from "../lib/useAuth";
import { api } from "../lib/api";
import { displayName } from "../lib/api";
import avatarAccount from "../assets/avatar-account.webp";

/* Profile — Figma 889:87054. Name/email/phone prefill from /auth/me.
   Only the name is editable (PATCH /profile); email/phone/location are
   read-only. Photo uploads go to PUT /profile/avatar as raw bytes;
   "Delete Account" deactivates via POST /member/security/deactivate.
   Copy fixes: "Change Passwords" -> "Change Password",
   "Account Setting" -> "Account Settings",
   "Payment Setting" -> "Payment Settings". */
const SUB = "Stay Connected with your creators and members";

const FIG = {
  name: "Maria Saris",
  email: "sideeqyusuff@gmail.com",
  phone: "07044716674",
  location: "Lagos, Nigeria",
};

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="#048B0B" />
      <path
        d="m8 12.5 2.8 2.8L16.5 9"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="7.5" width="18" height="12" rx="2.5" stroke="#FFFFFF" strokeWidth="1.8" />
      <circle cx="12" cy="13.5" r="3.4" stroke="#FFFFFF" strokeWidth="1.8" />
      <path d="M9 7.5 10.2 5h3.6L15 7.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 6.5h15M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5m2.5 0-.7 12a1.5 1.5 0 0 1-1.5 1.4H9.2a1.5 1.5 0 0 1-1.5-1.4l-.7-12"
        stroke="#E31B00"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Normalize orientation + cap size before upload (avatar endpoint takes
// raw jpeg/png bytes, max 5MB).
function normalizePhoto(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1024;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("encode"))),
        "image/jpeg",
        0.9,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode"));
    };
    img.src = url;
  });
}

export default function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [local, setLocal] = useState({});
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState("");
  const [editBusy, setEditBusy] = useState(false);
  const [editError, setEditError] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [sessions, setSessions] = useState(null);
  const [sessBusy, setSessBusy] = useState(false);
  const [sessMsg, setSessMsg] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      const { data } = await api("/member/security/sessions");
      if (live && data?.sessions) setSessions(data.sessions);
    })();
    return () => {
      live = false;
    };
  }, []);

  const revokeOthers = async () => {
    if (sessBusy) return;
    setSessBusy(true);
    setSessMsg("");
    const { error } = await api("/member/security/sessions/revoke-all", {
      method: "POST",
      body: { include_current: false },
    });
    setSessBusy(false);
    if (error) {
      setSessMsg(error.message || "Could not sign out other devices.");
      return;
    }
    setSessMsg("Other devices signed out.");
    const { data } = await api("/member/security/sessions");
    if (data?.sessions) setSessions(data.sessions);
  };

  const [delOpen, setDelOpen] = useState(false);
  const [delPw, setDelPw] = useState("");
  const [delBusy, setDelBusy] = useState(false);
  const [delError, setDelError] = useState("");

  const val = (k) =>
    local[k] ?? user?.[k] ?? user?.[k === "name" ? "full_name" : k] ?? FIG[k];
  const name = local.name ?? displayName(user) ?? FIG.name;
  const role =
    user?.role && typeof user.role === "string"
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : "Creator / Member";

  const startEdit = (k, current) => {
    setEditing(k);
    setDraft(current);
    setEditError("");
  };
  const saveEdit = async () => {
    const value = draft.trim();
    if (!value) {
      setEditing(null);
      return;
    }
    // Only full_name is writable; anything else is rejected by the API.
    if (editing !== "name") {
      setEditError("Only your name can be changed here. Contact support for anything else.");
      return;
    }
    setEditBusy(true);
    setEditError("");
    const { error } = await api("/profile", {
      method: "PATCH",
      body: { full_name: value },
    });
    setEditBusy(false);
    if (error) {
      setEditError(error.message || "Could not save your name. Please try again.");
      return;
    }
    setLocal((l) => ({ ...l, name: value }));
    setEditing(null);
    refreshUser();
  };

  const onPhoto = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setPhotoBusy(true);
    setPhotoError("");
    try {
      const blob = await normalizePhoto(f);
      const { error } = await api("/profile/avatar", {
        method: "PUT",
        raw: true,
        contentType: "image/jpeg",
        body: blob,
      });
      if (error) throw new Error(error.message || "Upload failed.");
      setPhoto(URL.createObjectURL(blob));
      refreshUser();
    } catch (err) {
      setPhotoError(err.message || "Could not upload that photo. Please try another.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const removePhoto = async () => {
    setPhotoBusy(true);
    setPhotoError("");
    const { error } = await api("/profile/avatar", { method: "DELETE" });
    setPhotoBusy(false);
    if (error) {
      setPhotoError(error.message || "Could not remove your photo. Please try again.");
      return;
    }
    setPhoto(null);
    refreshUser();
  };

  const deactivate = async () => {
    if (delBusy || !delPw) return;
    setDelBusy(true);
    setDelError("");
    // No hard delete exists — this deactivates the account.
    const { error } = await api("/member/security/deactivate", {
      method: "POST",
      body: { password: delPw },
    });
    setDelBusy(false);
    if (error) {
      setDelError(error.message || "Could not deactivate your account. Please try again.");
      return;
    }
    await logout();
    navigate("/");
  };

  const signOut = async () => {
    await logout();
    navigate("/");
  };

  const personal = [
    { key: "name", label: "Full Name", value: name },
    { key: "email", label: "Email", value: val("email") },
    { key: "phone", label: "Phone Number", value: val("phone") },
    { key: "location", label: "Location", value: val("location") },
  ];

  const renderPersonalRow = (r) => (
    <div
      key={r.key}
      className="flex min-h-[93px] items-center border-b border-[#999999] last:border-b-0"
    >
      {editing === r.key ? (
        <>
        <div className="flex w-full items-center gap-[12px] py-[12px]">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            aria-label={r.label}
            className="h-[50px] flex-1 rounded-[10px] border border-clyse bg-white px-[15px] text-[18px] font-semibold text-ink outline-none"
          />
          <button
            type="button"
            onClick={saveEdit}
            disabled={editBusy}
            className="h-[50px] flex-none rounded-[10px] bg-clyse px-[20px] text-[16px] font-semibold text-white disabled:opacity-50"
          >
            {editBusy ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="h-[50px] flex-none rounded-[10px] border border-[#999999] px-[20px] text-[16px] font-semibold text-[#6B6B6B]"
          >
            Cancel
          </button>
        </div>
        {editError && (
          <p className="w-full pb-[12px] text-[14px] font-semibold text-clyse-red">
            {editError}
          </p>
        )}
        </>
      ) : (
        <>
          <div className="min-w-0">
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {r.label}
            </p>
            <p className="mt-[6px] truncate text-[20px] leading-[24px] font-bold text-ink">
              {r.value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => startEdit(r.key, r.value)}
            className="ml-auto flex-none text-[18px] leading-[22px] font-semibold text-clyse transition hover:opacity-70"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans text-ink">
      <Navbar loggedIn />
      {/* Desktop */}
      <main className="relative mx-[100px] hidden pb-[100px] xl:block">
        <BlurBg variant="hero" />
        <div className="relative flex gap-[38px]">
          <Sidebar active="Profile" />
          <div className="w-[830px] flex-none">
            <h1 className="text-[35px] leading-[43px] font-bold text-black">
              Profile
            </h1>
            <p className="text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
              {SUB}
            </p>
            {/* Hero card */}
            <div className="bg-btn mt-[50px] flex h-[265px] items-center gap-[41px] rounded-[30px] px-[40px]">
              <img
                src={photo || user?.avatar_url || avatarAccount}
                alt={name}
                className="h-[170px] w-[170px] flex-none rounded-full border-2 border-white object-cover"
              />
              <div>
                <p className="text-[35px] leading-[43px] font-bold text-white">
                  {name}
                </p>
                <p className="mt-[10px] text-[18px] leading-[22px] font-semibold text-white">
                  {role}
                </p>
                <span className="mt-[10px] inline-flex h-[34px] items-center gap-[8px] rounded-[10px] bg-[#F1F8F1] px-[13px] text-[16px] font-semibold text-clyse">
                  <CheckIcon />
                  Verified
                </span>
                <span className="block">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={photoBusy}
                    className="mt-[24px] flex h-[42px] w-[231px] items-center justify-center gap-[10px] rounded-[10px] border border-white text-[16px] font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
                  >
                    <CameraIcon />
                    {photoBusy ? "Uploading…" : "Change Photo"}
                  </button>
                  {photoError && (
                    <p className="mt-[8px] text-[14px] font-semibold text-[#FFD7D7]">
                      {photoError}
                    </p>
                  )}
                </span>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onPhoto}
                />
              </div>
            </div>
            {/* Personal info */}
            <div className="mt-[50px] rounded-[20px] bg-white px-[30px] py-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <h2 className="text-[25px] leading-[35px] font-semibold text-black">
                Personal Information
              </h2>
              <div className="mt-[10px]">{personal.map(renderPersonalRow)}</div>
            </div>
            {/* Account */}
            <div className="mt-[50px] rounded-[20px] bg-white px-[30px] py-[40px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
              <h2 className="text-[25px] leading-[35px] font-semibold text-black">
                Account Settings
              </h2>
              <div className="mt-[10px] flex min-h-[93px] items-center border-b border-[#999999]">
                <div>
                  <p className="text-[20px] leading-[24px] font-bold text-ink">
                    Change Password
                  </p>
                  <p className="mt-[6px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Update your account password
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="ml-auto flex-none text-[18px] leading-[22px] font-semibold text-clyse transition hover:opacity-70"
                >
                  Edit
                </button>
              </div>
              <div className="mt-0 flex min-h-[93px] items-center border-b border-[#999999]">
                <div>
                  <p className="text-[20px] leading-[24px] font-bold text-ink">
                    Payment Settings
                  </p>
                  <p className="mt-[6px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Change your payment method setting
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/withdraw/select-bank")}
                  className="ml-auto flex-none text-[18px] leading-[22px] font-semibold text-clyse transition hover:opacity-70"
                >
                  Edit
                </button>
              </div>
              <div className="mt-0 flex min-h-[93px] items-center border-b border-[#999999]">
                <div>
                  <p className="text-[20px] leading-[24px] font-bold text-ink">
                    Active Sessions
                  </p>
                  <p className="mt-[6px] text-[18px] leading-[22px] font-semibold text-[#6B6B6B]">
                    {sessions
                      ? `${sessions.length} signed-in device${sessions.length === 1 ? "" : "s"}${sessMsg ? ` · ${sessMsg}` : ""}`
                      : "Manage your signed-in devices"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={revokeOthers}
                  disabled={sessBusy || !sessions || sessions.length < 2}
                  className="ml-auto flex-none text-[18px] leading-[22px] font-semibold text-clyse transition hover:opacity-70 disabled:opacity-40"
                >
                  {sessBusy ? "Working…" : "Sign out others"}
                </button>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="flex min-h-[65px] w-full items-center border-b border-[#999999] text-[20px] leading-[24px] font-bold text-[#E31B00] transition hover:opacity-70"
              >
                Log Out
              </button>
              {!delOpen ? (
                <button
                  type="button"
                  onClick={() => setDelOpen(true)}
                  className="mt-[50px] flex h-[60px] w-full items-center justify-center gap-[12px] rounded-[10px] border border-[#E31B00] bg-white text-[18px] font-semibold text-[#E31B00] transition hover:bg-[#FFF1F1]"
                >
                  <TrashIcon />
                  Delete Account
                </button>
              ) : (
                <div className="mt-[50px] rounded-[10px] border border-[#E31B00] bg-white p-[24px]">
                  <p className="text-[18px] leading-[24px] font-semibold text-ink">
                    Deactivate your account?
                  </p>
                  <p className="mt-[8px] text-[15px] leading-[22px] font-semibold text-[#6B6B6B]">
                    Your profile is hidden and your groups are closed. Enter
                    your password to confirm.
                  </p>
                  <input
                    type="password"
                    value={delPw}
                    onChange={(e) => setDelPw(e.target.value)}
                    placeholder="Password"
                    aria-label="Password"
                    className="mt-[16px] h-[50px] w-full rounded-[10px] border border-[#999999] px-[16px] text-[16px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
                  />
                  {delError && (
                    <p className="mt-[12px] text-[14px] font-semibold text-clyse-red">
                      {delError}
                    </p>
                  )}
                  <div className="mt-[16px] flex gap-[12px]">
                    <button
                      type="button"
                      onClick={() => {
                        setDelOpen(false);
                        setDelPw("");
                        setDelError("");
                      }}
                      className="h-[50px] flex-1 rounded-[10px] border border-[#999999] text-[16px] font-semibold text-[#6B6B6B]"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={deactivate}
                      disabled={delBusy || !delPw}
                      className="h-[50px] flex-1 rounded-[10px] bg-[#E31B00] text-[16px] font-semibold text-white disabled:opacity-50"
                    >
                      {delBusy ? "Deactivating…" : "Confirm"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile */}
      <main className="relative xl:hidden">
        <BlurBg variant="page" />
        <div className="relative px-[30px] pt-[46px]">
          <MemberMini />
          <div className="mt-[14px] flex h-[33px] items-center justify-center rounded-[5px] border border-line bg-white">
            <svg width="16" height="8" viewBox="0 0 19 9" fill="none" aria-hidden>
              <path
                d="M1.5 1.5 9.5 7.5l8-6"
                stroke="#6B6B6B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="bg-btn -mx-[30px] mt-[30px] flex min-h-[236px] items-center gap-[20px] px-[30px] py-[30px]">
            <img
              src={photo || user?.avatar_url || avatarAccount}
              alt={name}
              className="h-[120px] w-[120px] flex-none rounded-full border-2 border-white object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[20px] leading-[25px] font-bold text-white">
                {name}
              </p>
              <p className="mt-[6px] text-[14px] font-semibold text-white">
                {role}
              </p>
              <span className="mt-[8px] inline-flex h-[30px] items-center gap-[6px] rounded-[8px] bg-[#F1F8F1] px-[10px] text-[14px] font-semibold text-clyse">
                <CheckIcon />
                Verified
              </span>
            </div>
            <div className="flex flex-none flex-col gap-[12px]">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Change photo"
                className="grid h-[50px] w-[50px] place-items-center rounded-full bg-white"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15.5 4.5l4 4L8.5 19.5 4 20.5l1-4.5 10.5-11.5Z"
                    stroke="#048B0B"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={removePhoto}
                aria-label="Remove photo"
                className="grid h-[50px] w-[50px] place-items-center rounded-full bg-white"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
          <div className="mt-[24px] rounded-[20px] bg-white p-[20px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
            <h2 className="text-[20px] font-semibold text-black">
              Personal Information
            </h2>
            <div className="mt-[6px]">{personal.map(renderPersonalRow)}</div>
          </div>
          <div className="mt-[24px] rounded-[20px] bg-white p-[20px] shadow-[0_0_20px_rgba(0,23,1,0.10)]">
            <h2 className="text-[20px] font-semibold text-black">
              Account Settings
            </h2>
            <div className="mt-[6px] flex min-h-[80px] items-center border-b border-[#999999]">
              <div>
                <p className="text-[18px] font-bold text-ink">Change Password</p>
                <p className="mt-[4px] text-[14px] font-semibold text-[#6B6B6B]">
                  Update your account password
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/reset-password")}
                className="ml-auto flex-none text-[16px] font-semibold text-clyse"
              >
                Edit
              </button>
            </div>
            <div className="flex min-h-[80px] items-center border-b border-[#999999]">
              <div>
                <p className="text-[18px] font-bold text-ink">Payment Settings</p>
                <p className="mt-[4px] text-[14px] font-semibold text-[#6B6B6B]">
                  Change your payment method setting
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/withdraw/select-bank")}
                className="ml-auto flex-none text-[16px] font-semibold text-clyse"
              >
                Edit
              </button>
            </div>
            <div className="flex min-h-[80px] items-center border-b border-[#999999]">
              <div>
                <p className="text-[18px] font-bold text-ink">Active Sessions</p>
                <p className="mt-[4px] text-[14px] font-semibold text-[#6B6B6B]">
                  {sessions
                    ? `${sessions.length} signed-in device${sessions.length === 1 ? "" : "s"}${sessMsg ? ` · ${sessMsg}` : ""}`
                    : "Manage your signed-in devices"}
                </p>
              </div>
              <button
                type="button"
                onClick={revokeOthers}
                disabled={sessBusy || !sessions || sessions.length < 2}
                className="ml-auto flex-none text-[16px] font-semibold text-clyse disabled:opacity-40"
              >
                {sessBusy ? "Working…" : "Sign out others"}
              </button>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="flex min-h-[60px] w-full items-center border-b border-[#999999] text-[18px] font-bold text-[#E31B00]"
            >
              Log Out
            </button>
            {!delOpen ? (
              <button
                type="button"
                onClick={() => setDelOpen(true)}
                className="mt-[24px] flex h-[50px] w-full items-center justify-center gap-[10px] rounded-[10px] border border-[#E31B00] bg-white text-[14px] font-semibold text-[#E31B00]"
              >
                <TrashIcon />
                Delete Account
              </button>
            ) : (
              <div className="mt-[24px] rounded-[10px] border border-[#E31B00] bg-white p-[20px]">
                <p className="text-[16px] leading-[22px] font-semibold text-ink">
                  Deactivate your account?
                </p>
                <p className="mt-[6px] text-[13px] leading-[20px] font-semibold text-[#6B6B6B]">
                  Your profile is hidden and your groups are closed. Enter
                  your password to confirm.
                </p>
                <input
                  type="password"
                  value={delPw}
                  onChange={(e) => setDelPw(e.target.value)}
                  placeholder="Password"
                  aria-label="Password"
                  className="mt-[12px] h-[50px] w-full rounded-[10px] border border-[#999999] px-[16px] text-[15px] font-semibold text-ink outline-none placeholder:text-[#999999] focus:border-clyse"
                />
                {delError && (
                  <p className="mt-[10px] text-[13px] font-semibold text-clyse-red">
                    {delError}
                  </p>
                )}
                <div className="mt-[12px] flex gap-[12px]">
                  <button
                    type="button"
                    onClick={() => {
                      setDelOpen(false);
                      setDelPw("");
                      setDelError("");
                    }}
                    className="h-[50px] flex-1 rounded-[10px] border border-[#999999] text-[14px] font-semibold text-[#6B6B6B]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={deactivate}
                    disabled={delBusy || !delPw}
                    className="h-[50px] flex-1 rounded-[10px] bg-[#E31B00] text-[14px] font-semibold text-white disabled:opacity-50"
                  >
                    {delBusy ? "Deactivating…" : "Confirm"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <ExtraBlock mobile className="mt-[40px]" />
        <div className="bg-white pb-[60px]" />
      </main>
    </div>
  );
}
