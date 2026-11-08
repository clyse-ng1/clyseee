import { useEffect, useState } from "react";
import { api } from "../lib/api";

/* Notification options, shared by /notifications and the Manage Group card.
   The PM flagged Manage Group's notification block as "incomplete" — it only
   showed the activity list, with none of the switches that the API exposes via
   /member/notifications/preferences. */

const PREF_LABELS = {
  group_activity: "Group activity",
  group_updates: "Group updates",
  invite: "Invites",
  invites: "Invites",
  payment: "Payments",
  payments: "Payments",
  wallet: "Wallet",
  waitlist: "Waitlist",
  subscription: "Subscriptions",
  verification: "Verification",
  marketing: "Product news",
  security: "Security",
  system: "System alerts",
};

const label = (key) =>
  PREF_LABELS[key] ||
  key.replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());

export default function NotifPrefs({ className = "", compact = false }) {
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    let on = true;
    (async () => {
      const { data, error } = await api("/member/notifications/preferences");
      if (!on) return;
      if (error) {
        setPrefs({});
        return;
      }
      const cats = data?.categories;
      if (Array.isArray(cats)) {
        setPrefs(
          Object.fromEntries(
            cats.map((c) => [
              c.category,
              { in_app: c.channels?.in_app !== false, mandatory: c.mandatory === true },
            ]),
          ),
        );
      } else {
        setPrefs(data?.preferences || data || {});
      }
    })();
    return () => {
      on = false;
    };
  }, []);

  const toggle = async (key, next) => {
    setPrefs((p) => ({ ...(p || {}), [key]: { ...(p || {})[key], in_app: next } }));
    const { error } = await api("/member/notifications/preferences", {
      method: "PUT",
      body: { preferences: [{ category: key, channel: "in_app", enabled: next }] },
    });
    if (error) {
      setPrefs((p) => ({ ...(p || {}), [key]: { ...(p || {})[key], in_app: !next } }));
    }
  };

  const entries = Object.entries(prefs || {});

  if (!prefs) {
    return (
      <div className={`${className} space-y-[10px]`} aria-hidden>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[22px] w-full rounded-full bg-[#F1F8F1]" />
        ))}
      </div>
    );
  }

  if (!entries.length) {
    return (
      <p className={`${className} ${compact ? "text-[13px] leading-[19px]" : "text-[16px] leading-[22px]"} font-semibold text-[#6B6B6B]`}>
        No notification options available yet.
      </p>
    );
  }

  return (
    <div className={className}>
      <div className="divide-y divide-[#EDF3ED]">
        {entries.map(([key, val]) => {
          const locked = val?.mandatory === true;
          const on = val?.in_app !== false;
          return (
            <div key={key} className="flex items-center gap-[12px] py-[10px]">
              <span
                className={`min-w-0 flex-1 font-semibold text-ink ${
                  compact ? "text-[13px] leading-[19px]" : "text-[16px] leading-[22px]"
                }`}
              >
                {label(key)}
                {locked && (
                  <span className="ml-[6px] text-[12px] font-semibold text-[#999999]">
                    (always on)
                  </span>
                )}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                aria-label={label(key)}
                disabled={locked}
                onClick={() => toggle(key, !on)}
                className={`relative h-[22px] w-[48px] flex-none rounded-full transition ${
                  on ? "bg-clyse" : "bg-[#D9D9D9]"
                } ${locked ? "opacity-50" : ""}`}
              >
                <span
                  className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white transition-all ${
                    on ? "right-[3px]" : "left-[3px]"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
