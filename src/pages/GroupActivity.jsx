import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { api, fmtTx } from "../lib/api";
import { useGroupId } from "../lib/useGroup";
import {
  MemberPage,
  Panel,
  Pill,
  EventRow,
  Empty,
  ErrorText,
  humanise,
  statusTone,
} from "../components/MemberPage";
import iconQaBolt from "../assets/qa-bolt.svg";

/* Group Activity — the two append-only trails the docs added, on one screen
   because they answer the same question ("what happened on this group?"):
     GET /member/groups/invite-events?group_id=   created / revoked / used invites
     GET /member/verification/events?group_id=    the verification trail
     GET /member/access/events?group_id=          access-method changes
   Tabbed rather than three pages. Group is resolved exactly like GroupShare /
   GroupDetails (location.state group_id, else the creator's first group). */

const TABS = [
  { key: "invites", label: "Invites" },
  { key: "verification", label: "Verification" },
  { key: "access", label: "Access" },
];

const ENDPOINT = {
  invites: (id) => `/member/groups/invite-events?group_id=${encodeURIComponent(id)}&limit=50`,
  verification: (id) => `/member/verification/events?group_id=${encodeURIComponent(id)}&limit=50`,
  access: (id) => `/member/access/events?group_id=${encodeURIComponent(id)}&limit=50`,
};

const VERB = {
  created: "Invite created",
  revoked: "Invite revoked",
  used: "Invite used",
  submitted: "Verification submitted",
  approved: "Verification approved",
  rejected: "Verification rejected",
  withdrawn: "Verification withdrawn",
  info_requested: "More information requested",
  updated: "Access method changed",
  confirmed: "Access confirmed",
  provided: "Access details provided",
};

export function GroupActivity() {
  const location = useLocation();
  const [groupId, resolved] = useGroupId(location.state?.group_id);
  const [tab, setTab] = useState("invites");
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async (which) => {
    if (!groupId) return;
    setEvents(null);
    setError("");
    const { data, error: apiError } = await api(ENDPOINT[which](groupId));
    if (apiError) {
      setError(apiError.message || "Could not load this activity.");
      setEvents([]);
      return;
    }
    setEvents(data?.events || []);
  }, [groupId]);

  useEffect(() => {
    if (!groupId) return;
    let live = true;
    setEvents(null);
    setError("");
    (async () => {
      const { data, error: apiError } = await api(ENDPOINT[tab](groupId));
      if (!live) return;
      if (apiError) {
        setError(apiError.message || "Could not load this activity.");
        setEvents([]);
        return;
      }
      setEvents(data?.events || []);
    })();
    return () => {
      live = false;
    };
  }, [groupId, tab]);

  if (resolved && !groupId) return <Navigate to="/groups/empty" replace />;

  const rows = (events || []).map((e, i) => {
    let note = "";
    if (tab === "invites" && e.metadata?.uses != null) note = `${e.metadata.uses} use(s)`;
    if (tab === "access" && e.method_before && e.method_after) {
      note = `${humanise(e.method_before)} → ${humanise(e.method_after)}`;
    }
    if (e.note) note = e.note;
    return {
      key: `${e.id ?? i}-${e.created_at || ""}`,
      title: VERB[e.event_type] || humanise(e.event_type),
      note,
      time: fmtTx(e.created_at),
      tone:
        e.event_type === "approved" || e.event_type === "confirmed"
          ? "good"
          : e.event_type === "rejected" || e.event_type === "revoked" || e.event_type === "withdrawn"
            ? "bad"
            : e.event_type === "info_requested"
              ? "open"
              : "info",
    };
  });

  return (
    <MemberPage
      active="My Group"
      title="Group Activity"
      sub="Invites, verification and access changes for this group."
      icon={<img src={iconQaBolt} alt="" className="h-[24px] w-[24px]" />}
      action={
        <Link
          to="/groups/details"
          state={{ group_id: groupId }}
          className="hidden h-[44px] items-center rounded-[22px] border border-clyse px-[20px] text-[15px] font-semibold text-ink xl:inline-flex"
        >
          Group details
        </Link>
      }
    >
      <div className="mb-[16px] flex gap-[8px] overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`h-[38px] flex-none rounded-[19px] px-[18px] text-[14px] font-semibold transition ${
              tab === t.key
                ? "bg-btn text-white"
                : "border border-clyse bg-white text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Panel>
        {error ? (
          <ErrorText text={error} />
        ) : events === null ? (
          <p className="text-[15px] font-semibold text-[#6B6B6B]">Loading activity…</p>
        ) : rows.length === 0 ? (
          <Empty
            text={
              tab === "invites"
                ? "No invite activity yet. Create an invite from Group Share."
                : tab === "verification"
                  ? "No verification activity yet."
                  : "No access changes yet."
            }
          />
        ) : (
          <ol className="m-0 list-none p-0">
            {rows.map((r, i) => (
              <EventRow key={r.key} {...r} last={i === rows.length - 1} />
            ))}
          </ol>
        )}
      </Panel>

      <div className="mt-[16px] flex justify-center">
        <Link
          to="/groups/share"
          state={{ group_id: groupId }}
          className="text-[14px] font-semibold text-[#048B0B] hover:underline"
        >
          Go to Group Share
        </Link>
      </div>
    </MemberPage>
  );
}

/* Invite manager — lists the group's invite tokens with a Revoke action
   (POST /member/groups/invites/revoke { invite_id }). Group Share could create
   invites but never cancel them; this closes that gap without touching the
   existing share screen's layout. */
export function InviteManager() {
  const location = useLocation();
  const [groupId, resolved] = useGroupId(location.state?.group_id);
  const [invites, setInvites] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [rowError, setRowError] = useState("");

  const load = useCallback(async () => {
    if (!groupId) return;
    const { data, error: apiError } = await api(`/member/groups/invites?group_id=${groupId}`);
    if (apiError) {
      setError(apiError.message || "Could not load this group's invites.");
      setInvites([]);
      return;
    }
    setInvites(data?.invites || []);
  }, [groupId]);

  useEffect(() => {
    let live = true;
    if (!groupId) return;
    (async () => {
      const { data, error: apiError } = await api(`/member/groups/invites?group_id=${groupId}`);
      if (!live) return;
      if (apiError) {
        setError(apiError.message || "Could not load this group's invites.");
        setInvites([]);
        return;
      }
      setInvites(data?.invites || []);
    })();
    return () => {
      live = false;
    };
  }, [groupId]);

  const revoke = async (invite) => {
    if (busyId) return;
    setBusyId(invite.id);
    setRowError("");
    const { error: apiError } = await api("/member/groups/invites/revoke", {
      method: "POST",
      body: { invite_id: invite.id },
    });
    setBusyId(null);
    if (apiError) {
      setRowError(apiError.message || "Could not revoke that invite.");
      return;
    }
    load();
  };

  if (resolved && !groupId) return <Navigate to="/groups/empty" replace />;

  return (
    <MemberPage
      active="My Group"
      title="Invite Links"
      sub="Every invite link for this group. Revoke one and it stops working immediately."
      icon={<img src={iconQaBolt} alt="" className="h-[24px] w-[24px]" />}
      action={
        <Link
          to="/groups/share"
          state={{ group_id: groupId }}
          className="hidden h-[44px] items-center rounded-[22px] bg-btn px-[20px] text-[15px] font-semibold text-white xl:inline-flex"
        >
          + New invite
        </Link>
      }
    >
      <Panel>
        {error ? (
          <ErrorText text={error} />
        ) : invites === null ? (
          <p className="text-[15px] font-semibold text-[#6B6B6B]">Loading invites…</p>
        ) : invites.length === 0 ? (
          <Empty text="No invite links yet. Create one from Group Share." />
        ) : (
          <div className="space-y-[12px]">
            {invites.map((inv) => {
              const revoked = `${inv.status}`.toLowerCase() === "revoked";
              return (
                <div
                  key={inv.id}
                  className="rounded-[12px] border border-clyse bg-white px-[16px] py-[14px]"
                >
                  <div className="flex items-start gap-[10px]">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[14px] leading-[20px] font-semibold text-black">
                        {inv.token || inv.id}
                      </span>
                      <span className="mt-[2px] block text-[12px] leading-[18px] font-semibold text-[#66726C]">
                        {inv.uses ?? 0}
                        {inv.max_uses ? ` / ${inv.max_uses}` : ""} used
                        {inv.expires_at ? ` · expires ${fmtTx(inv.expires_at)}` : " · no expiry"}
                      </span>
                    </span>
                    <Pill tone={revoked ? "bad" : "good"}>{humanise(inv.status)}</Pill>
                  </div>
                  {!revoked && (
                    <button
                      type="button"
                      onClick={() => revoke(inv)}
                      disabled={busyId === inv.id}
                      className="mt-[10px] flex h-[36px] items-center justify-center rounded-[18px] border border-[#D22] px-[18px] text-[13px] font-semibold text-[#D22] disabled:opacity-40"
                    >
                      {busyId === inv.id ? "Revoking…" : "Revoke"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {rowError && <p className="mt-[10px] text-[13px] font-semibold text-[#D22]">{rowError}</p>}
      </Panel>
      <p className="mt-[14px] text-[13px] font-semibold text-[#66726C]">
        Status: {invites ? `${invites.filter((i) => i.status === "active").length} active` : "—"}
      </p>
    </MemberPage>
  );
}
