import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminShell, { PageTitle, Pill, PencilIcon, DotsIcon } from "../components/AdminShell";
import BrandTile from "../components/BrandTile";

/* Custom Requests list — Figma 1149:42309 (1440, desktop only). Static:
   tabs filter the rows client-side. */

const TABS = [
  { key: "all", label: "All", count: 12, pill: "bg-[#F2FFF3] text-[#048B0B]" },
  { key: "pending", label: "Pending", count: 12, pill: "bg-[#FFEFE4] text-[#FF6C03]" },
  { key: "approved", label: "Approved", count: 12, pill: "bg-[#F2FFF3] text-[#048B0B]" },
  { key: "rejected", label: "Reject", count: 12, pill: "bg-[#FFE2E2] text-[#FF0000]" },
  { key: "review", label: "Under Review", count: 12, pill: "bg-[#EFEFEF] text-[#5F5F5F]", wide: true },
];

const ROWS = [
  { name: "Maria Philips", brand: "netflix", sub: "Netflix", cat: "Streaming", plan: "Standard N5,500 / Monthly", period: "Monthly", status: "pending" },
  { name: "Ann Kenter", brand: "spotify", sub: "Spotify", cat: "Music Streaming", plan: "Basic N1,500 / Monthly", period: "Monthly", status: "approved" },
  { name: "James Lipshutz", brand: "canva", sub: "Canva", cat: "Productivity", plan: "Premium N5,500 / Monthly", period: "Monthly", status: "review" },
  { name: "Dulce Press", brand: "youtube", sub: "YouTube", cat: "Streaming", plan: "Basic N2,000 / Monthly", period: "Monthly", status: "rejected" },
  { name: "Jakob Lubin", brand: "capcut", sub: "CapCut", cat: "Productivity", plan: "Basic N3,000 / Monthly", period: "Monthly", status: "pending" },
  { name: "Kaylynn Dokidis", brand: "adobe", sub: "Adobe Creative Cloud", cat: "Productivity", plan: "Basic N2,000 / Monthly", period: "Monthly", status: "approved" },
];

const STATUS_PILL = {
  pending: { tone: "orange", label: "Pending" },
  approved: { tone: "green", label: "Approved" },
  rejected: { tone: "red", label: "Rejected" },
  review: { tone: "gray", label: "Under Review" },
};

export default function AdminCustomRequests() {
  const nav = useNavigate();
  const [tab, setTab] = useState("all");
  const [checked, setChecked] = useState([]);
  const rows = useMemo(() => (tab === "all" ? ROWS : ROWS.filter((r) => r.status === tab)), [tab]);
  const all = rows.length > 0 && rows.every((r) => checked.includes(r.name));
  const toggle = (name) => setChecked((c) => (c.includes(name) ? c.filter((x) => x !== name) : [...c, name]));

  return (
    <AdminShell active="subscriptions" sub="requests">
      <PageTitle title="Custom Subscription" />

      {/* Tabs */}
      <div className="mt-[30px] flex gap-[30px]">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex h-[65px] ${t.wide ? "w-[225px]" : "w-[191px]"} items-center justify-center gap-[10px] rounded-[10px] text-[20px] font-semibold ${t.pill} ${
              tab === t.key ? "outline outline-2 outline-offset-[-2px]" : ""
            }`}
          >
            {t.label} <span>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Table 1348 wide */}
      <div className="mt-[30px] overflow-x-auto rounded-[20px] border border-[#999999] bg-white">
        <div className="min-w-[1348px]">
          <div className="mt-[41px] flex h-[60px] items-center bg-[#DFFFE1] text-[16px] font-semibold text-[#4E4E4E]">
            <span className="flex w-[81px] shrink-0 justify-center">
              <button
                aria-label="Select all"
                onClick={() => setChecked(all ? [] : rows.map((r) => r.name))}
                className={`flex h-[30px] w-[30px] items-center justify-center rounded-[5px] border border-[#048B0B] bg-white ${all ? "bg-[#048B0B]" : ""}`}
              >
                {all && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="m5 12.5 4.5 4.5L19 7.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </span>
            <span className="w-[134px] shrink-0">Requester</span>
            <span className="w-[343px] shrink-0">Subscription</span>
            <span className="w-[168px] shrink-0">Category</span>
            <span className="w-[167px] shrink-0">Plans</span>
            <span className="w-[126px] shrink-0">Billing Period</span>
            <span className="w-[159px] shrink-0">Status</span>
            <span className="w-[80px] shrink-0">Action</span>
          </div>
          <div className="divide-y divide-[#999999] pb-[20px]">
            {rows.map((r) => (
              <div key={r.name} className="flex h-[111px] items-center">
                <span className="flex w-[81px] shrink-0 justify-center">
                  <button
                    aria-label={`Select ${r.name}`}
                    onClick={() => toggle(r.name)}
                    className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] border border-[#999999] bg-white"
                  >
                    {checked.includes(r.name) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="m5 12.5 4.5 4.5L19 7.5" stroke="#048B0B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </span>
                <span className="w-[134px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.name}</span>
                <span className="flex w-[343px] shrink-0 items-center gap-[15px]">
                  <BrandTile brand={r.brand} size={50} />
                  <span className="text-[18px] font-bold text-[#001701]">{r.sub}</span>
                </span>
                <span className="w-[168px] shrink-0">
                  <Pill className="h-[30px] w-[162px] text-[16px]">{r.cat}</Pill>
                </span>
                <span className="w-[167px] shrink-0 text-[16px] font-semibold leading-snug text-[#001701]">{r.plan}</span>
                <span className="w-[126px] shrink-0 text-[16px] font-semibold text-[#001701]">{r.period}</span>
                <span className="flex w-[159px] shrink-0">
                  <Pill tone={STATUS_PILL[r.status].tone} className="h-[37px] w-[120px]">
                    {STATUS_PILL[r.status].label}
                  </Pill>
                </span>
                <span className="flex w-[80px] shrink-0 items-center gap-[18px]">
                  <button aria-label={`Review ${r.name}`} onClick={() => nav("/admin/subscriptions/requests/details")}>
                    <PencilIcon />
                  </button>
                  <button aria-label="More actions">
                    <DotsIcon />
                  </button>
                </span>
              </div>
            ))}
            {rows.length === 0 && (
              <p className="px-[40px] py-[40px] text-[16px] font-semibold text-[#6B6B6B]">No requests in this tab.</p>
            )}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
