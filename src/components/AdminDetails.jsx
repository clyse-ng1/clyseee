import { useState } from "react";
import { Pill } from "./AdminShell";
import { GlyphPause, GlyphNoUser, GlyphMegaphone, GlyphEdit, GlyphBadge, GlyphClock, GlyphWarn, GlyphCheckCircle } from "./AdminGlyphs";
import BrandTile from "./BrandTile";
import { api } from "../lib/api";

/* Shared user/group details bits — Figma 1172:24979 / 1175:26039 /
   1176:26649. Static. Copy fixes: "Deactive" -> "Deactivate",
   "Warnimg" -> "Warning". */

export function TabsBar({ tabs, active, onChange }) {
  return (
    <div className="mt-[30px] flex h-[89px] items-center gap-[70px] rounded-[10px] border border-[#999999] bg-white px-[31px]">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`flex h-[47px] items-center text-[20px] font-bold ${
            active === t ? "border-b-2 border-[#048B0B] text-[#000000]" : "text-[#6B6B6B]"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

export function InfoCard({ label, children, className = "" }) {
  return (
    <div className={`rounded-[10px] border border-[#999999] bg-white p-[20px] ${className}`}>
      <p className="text-[18px] font-semibold text-[#6B6B6B]">{label}</p>
      <div className="mt-[8px] text-[18px] font-semibold text-[#000000]">{children}</div>
    </div>
  );
}

const ACTIVITIES = [
  { glyph: <GlyphBadge />, bg: "bg-[#DFFFE1]", title: "New Subscription Created", time: "2 hours ago" },
  { glyph: <GlyphCheckCircle />, bg: "bg-[#E0EFFF]", title: "Group Approved", time: "5 hours ago" },
  { glyph: <GlyphWarn />, bg: "bg-[#FBD9DC]", title: "Warning Issued", time: "1 day ago" },
  { glyph: <GlyphClock />, bg: "bg-[#FDEED9]", title: "Payment Pending Review", time: "2 days ago" },
  { glyph: <GlyphBadge color="#6A5ACD" />, bg: "bg-[#E9E4FF]", title: " Verification Completed", time: "3 days ago" },
];

export function ActivityRow({ glyph, bg, title, time }) {
  return (
    <div className="flex items-center gap-[15px] py-[12px]">
      <span className={`flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[10px] ${bg}`}>{glyph}</span>
      <span>
        <span className="block text-[20px] font-bold text-[#000000]">{title}</span>
        <span className="block text-[16px] font-semibold text-[#6B6B6B]">{time}</span>
      </span>
    </div>
  );
}

export function ActivitiesList({ count = 3 }) {
  return (
    <div className="flex flex-col divide-y divide-[#E1E1E1]">
      {ACTIVITIES.slice(0, count).map((a) => (
        <ActivityRow key={a.title} {...a} />
      ))}
    </div>
  );
}

const MOD_BUTTONS = [
  { key: "suspend", label: "Suspend Account", done: "Account Suspended", cls: "bg-[#FFF8F5] text-[#F04C00]", glyph: <GlyphPause /> },
  { key: "deactivate", label: "Deactivate Account", done: "Account Deactivated", cls: "bg-[#FFDEDE] text-[#FF0000]", glyph: <GlyphNoUser /> },
  { key: "warn", label: "Send Warning", done: "Warning Sent", cls: "bg-[#F1FAFF] text-[#4E4E4E]", glyph: <GlyphMegaphone /> },
  { key: "note", label: "Send Note", done: "Note Sent", cls: "border border-[#048B0B] bg-white text-[#048B0B]", glyph: <GlyphEdit /> },
];

export function ModerationActions({ targetType, targetId, targetUserId }) {
  const [done, setDone] = useState([]);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const sendNote = async (event) => {
    event.preventDefault();
    if (!targetId || !noteText.trim() || busy) return;
    setBusy(true);
    setMessage("");
    if (!targetUserId) {
      setBusy(false);
      setIsError(true);
      setMessage("This record has no linked user ID, so a note cannot be delivered.");
      return;
    }
    const created = await api("/admin/communications", {
      method: "POST",
      body: {
        category: "account",
        title: "A note from Clyse",
        body: noteText.trim(),
        channels: ["in_app"],
        audience: { type: "users", user_ids: [targetUserId] },
      },
    });
    if (created.error) {
      setBusy(false);
      setIsError(true);
      setMessage(created.error.message || "The note could not be sent.");
      return;
    }
    const communicationId = created.data?.communication?.id || created.data?.id;
    if (!communicationId) {
      setBusy(false);
      setIsError(true);
      setMessage("The message was prepared but no delivery ID was returned. Please check Communications before retrying.");
      return;
    }
    const delivery = await api("/admin/communications/send", { method: "POST", body: { id: communicationId } });
    setBusy(false);
    if (delivery.error) {
      setIsError(true);
      setMessage(delivery.error.message || "The note was created but could not be delivered.");
      return;
    }
    setDone((items) => [...items, "note"]);
    setNoteText("");
    setNoteOpen(false);
    setIsError(false);
    setMessage("Note sent to the user’s in-app inbox.");
  };

  return (
    <div className="flex flex-col gap-[12px]">
      {MOD_BUTTONS.map((b) => {
        const isDone = done.includes(b.key);
        return (
          <button
            key={b.key}
            disabled={isDone || (b.key === "note" && !targetUserId)}
            onClick={() => b.key === "note" ? (setMessage(""), setNoteOpen(true)) : setDone((d) => [...d, b.key])}
            title={b.key === "note" && !targetUserId ? "A linked user account is required to send a note" : undefined}
            className={`flex h-[67px] items-center gap-[12px] rounded-[10px] px-[20px] text-[18px] font-semibold disabled:opacity-70 ${b.cls}`}
          >
            {b.glyph}
            {isDone ? b.done : b.label}
          </button>
        );
      })}
      {message && <p role={isError ? "alert" : "status"} className={`rounded-lg px-3 py-2 text-sm font-semibold ${isError ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}>{message}</p>}
      {noteOpen && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"><form onSubmit={sendNote} role="dialog" aria-modal="true" aria-labelledby="moderation-note-title" className="w-full max-w-[520px] rounded-2xl bg-white p-6 shadow-2xl"><h2 id="moderation-note-title" className="text-xl font-bold text-[#001701]">Send Note</h2><p className="mt-2 text-sm text-[#657165]">This sends a private in-app message to the account linked to this {targetType}.</p><textarea autoFocus value={noteText} onChange={(e) => setNoteText(e.target.value)} maxLength={2000} rows={5} placeholder="Write a note…" className="mt-4 w-full rounded-xl border border-[#BFC9BF] p-3 outline-none focus:border-[#048B0B]" />{message && isError && <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{message}</p>}<div className="mt-4 flex justify-end gap-3"><button type="button" disabled={busy} onClick={() => setNoteOpen(false)} className="rounded-lg border border-[#BFC9BF] px-4 py-2 font-semibold">Cancel</button><button type="submit" disabled={busy || !noteText.trim()} className="rounded-lg bg-[#048B0B] px-5 py-2 font-semibold text-white disabled:opacity-50">{busy ? "Sending…" : "Send Note"}</button></div></form></div>}
    </div>
  );
}

export function ModerationCard({ targetType, targetId, targetUserId }) {
  return (
    <div className="mt-[30px] rounded-[20px] border border-[#999999] bg-white p-[31px]">
      <div className="flex gap-[62px]">
        <div className="w-[509px]">
          <h3 className="mb-[15px] text-[20px] font-bold text-[#000000]">Moderation Actions</h3>
          <ModerationActions targetType={targetType} targetId={targetId} targetUserId={targetUserId} />
        </div>
        <div className="w-[509px]">
          <h3 className="mb-[15px] text-[20px] font-bold text-[#000000]">Recent Activities</h3>
          <ActivitiesList count={3} />
        </div>
      </div>
    </div>
  );
}

export function SubRow({ brand, name, meta, rightTop, rightBottom }) {
  return (
    <div className="flex items-center gap-[15px] py-[15px]">
      <BrandTile brand={brand} size={50} />
      <span className="flex-1">
        <span className="block text-[18px] font-semibold text-[#000000]">{name}</span>
        <span className="block text-[16px] font-semibold text-[#6B6B6B]">
          <span className="text-[#048B0B]">Active</span> . {meta}
        </span>
      </span>
      <span className="text-right">
        <span className="block text-[18px] font-bold text-[#000000]">{rightTop}</span>
        <span className="block text-[16px] font-semibold text-[#6B6B6B]">{rightBottom}</span>
      </span>
    </div>
  );
}

export function MemberRow({ img, name, meta, pill }) {
  return (
    <div className="flex items-center gap-[15px] py-[15px]">
      <img src={img} alt={name} className="h-[50px] w-[50px] rounded-full object-cover" />
      <span className="flex-1">
        <span className="block text-[20px] font-bold text-[#000000]">{name}</span>
        <span className="block text-[16px] font-semibold text-[#6B6B6B]">{meta}</span>
      </span>
      <Pill tone={pill.tone} className="h-[37px] w-[127px]">
        {pill.label}
      </Pill>
    </div>
  );
}
