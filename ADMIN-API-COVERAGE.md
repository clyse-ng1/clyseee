# Admin API → frontend coverage (verified 2026-11-18 against the live API docs)

All **95 documented admin endpoints** are called from the frontend. Verified by extracting
every `METHOD /admin/...` from the API reference and matching each against string literals in
`src/`. Live-probed with an admin session: the 37-route admin tour returned 200s and 0 page errors.

| Endpoint | Method | Wired in |
|---|---|---|
| `/admin/admins` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/admins/assign` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/admins/detail` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/admins/status` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/audit-logs` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/audit-logs/detail` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/catalogue/events` | GET | AdminDataPage.jsx |
| `/admin/catalogue/plans` | GET | AdminDataPage.jsx, AdminSubAdd.jsx, useAdminRows.jsx |
| `/admin/catalogue/plans` | POST | AdminDataPage.jsx, AdminSubAdd.jsx, useAdminRows.jsx |
| `/admin/catalogue/plans` | PATCH | AdminDataPage.jsx, AdminSubAdd.jsx, useAdminRows.jsx |
| `/admin/catalogue/plans/detail` | GET | AdminDataPage.jsx, AdminSubAdd.jsx, useAdminRows.jsx |
| `/admin/catalogue/plans/status` | POST | AdminDataPage.jsx, AdminSubAdd.jsx, useAdminRows.jsx |
| `/admin/catalogue/services` | GET | AdminDataPage.jsx, AdminSubDetails.jsx |
| `/admin/catalogue/services` | POST | AdminDataPage.jsx, AdminSubDetails.jsx |
| `/admin/catalogue/services` | PATCH | AdminDataPage.jsx, AdminSubDetails.jsx |
| `/admin/catalogue/services/detail` | GET | AdminDataPage.jsx, AdminSubDetails.jsx |
| `/admin/catalogue/services/status` | POST | AdminDataPage.jsx, AdminSubAdd.jsx, AdminSubscriptions.jsx, useAdminRows.jsx |
| `/admin/communications` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/communications` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/communications` | PATCH | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/communications/cancel` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/communications/channels` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/communications/detail` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/communications/preview` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/communications/recipients` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/communications/send` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/config` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/config` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/config/detail` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/config/history` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/dashboard` | GET | Admin.jsx, AdminDataPage.jsx, App.jsx, RequireAdmin.jsx |
| `/admin/disputes` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/disputes/detail` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/disputes/info-request` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/disputes/resolve` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/finance/creator-earnings` | GET | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/payouts` | GET | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/reconcile` | POST | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/reconciliations` | GET | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/reconciliations/detail` | GET | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/reconciliations/exceptions` | GET | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/reconciliations/resolve` | POST | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/reconciliations/run` | POST | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/transactions` | GET | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/transactions/detail` | GET | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/finance/wallet-fundings` | GET | AdminFinance.jsx, AdminShell.jsx, App.jsx |
| `/admin/groups` | GET | AdminDataPage.jsx, AdminGroupDetails.jsx, AdminShell.jsx, App.jsx, useAdminRows.jsx |
| `/admin/groups/detail` | GET | AdminDataPage.jsx, AdminGroupDetails.jsx, AdminShell.jsx, App.jsx, useAdminRows.jsx |
| `/admin/groups/review` | GET | AdminDataPage.jsx, AdminGroupDetails.jsx, AdminShell.jsx, App.jsx, useAdminRows.jsx |
| `/admin/groups/review` | POST | AdminDataPage.jsx, AdminGroupDetails.jsx, AdminShell.jsx, App.jsx, useAdminRows.jsx |
| `/admin/groups/review/detail` | GET | AdminDataPage.jsx, AdminGroupDetails.jsx, AdminShell.jsx, App.jsx, useAdminRows.jsx |
| `/admin/groups/status` | POST | AdminDataPage.jsx, AdminGroupDetails.jsx, AdminShell.jsx, App.jsx, useAdminRows.jsx |
| `/admin/health/history` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/health/incidents` | GET | AdminDataPage.jsx |
| `/admin/health/incidents/detail` | GET | AdminDataPage.jsx |
| `/admin/health/incidents/update` | POST | AdminDataPage.jsx |
| `/admin/health/run` | POST | AdminDataPage.jsx |
| `/admin/health/runs/detail` | GET | AdminDataPage.jsx |
| `/admin/health/status` | GET | AdminDataPage.jsx, AdminHealth.jsx |
| `/admin/moderation/groups` | POST | AdminDataPage.jsx |
| `/admin/moderation/records` | GET | AdminDataPage.jsx, AdminGroupDetails.jsx, AdminUserDetails.jsx, useAdminRows.jsx |
| `/admin/moderation/records/detail` | GET | AdminDataPage.jsx, AdminGroupDetails.jsx, AdminUserDetails.jsx, useAdminRows.jsx |
| `/admin/moderation/users` | POST | AdminDataPage.jsx |
| `/admin/reports/groups` | GET | AdminDataPage.jsx |
| `/admin/reports/groups/export` | GET | AdminDataPage.jsx |
| `/admin/reports/subscriptions` | GET | AdminDataPage.jsx |
| `/admin/reports/subscriptions/export` | GET | AdminDataPage.jsx |
| `/admin/roles` | GET | AdminDataPage.jsx |
| `/admin/roles/history` | GET | AdminDataPage.jsx |
| `/admin/roles/permissions` | POST | AdminDataPage.jsx |
| `/admin/security/alerts` | GET | AdminShell.jsx, App.jsx |
| `/admin/security/events` | GET | AdminShell.jsx, App.jsx |
| `/admin/security/incidents` | GET | AdminShell.jsx, App.jsx |
| `/admin/security/incidents/detail` | GET | AdminShell.jsx, App.jsx |
| `/admin/security/incidents/update` | POST | AdminShell.jsx, App.jsx |
| `/admin/security/retention` | POST | AdminShell.jsx, App.jsx |
| `/admin/security/scan` | POST | AdminShell.jsx, App.jsx |
| `/admin/security/summary` | GET | AdminShell.jsx, App.jsx |
| `/admin/support/issues` | GET | App.jsx |
| `/admin/support/issues/assign` | POST | App.jsx |
| `/admin/support/issues/detail` | GET | App.jsx |
| `/admin/support/issues/priority` | POST | App.jsx |
| `/admin/support/issues/reply` | POST | App.jsx |
| `/admin/support/issues/update` | POST | App.jsx |
| `/admin/templates` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/templates` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/templates` | PATCH | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/templates/detail` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/templates/placeholders` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/templates/preview` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/templates/status` | POST | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/templates/versions` | GET | AdminDataPage.jsx, useAdminRows.jsx |
| `/admin/users` | GET | AdminDataPage.jsx, AdminShell.jsx, AdminUserDetails.jsx, App.jsx, useAdminRows.jsx |
| `/admin/users/detail` | GET | AdminDataPage.jsx, AdminShell.jsx, AdminUserDetails.jsx, App.jsx, useAdminRows.jsx |
| `/admin/users/status` | POST | AdminDataPage.jsx, AdminShell.jsx, AdminUserDetails.jsx, App.jsx, useAdminRows.jsx |

## Reachability

- Bespoke Figma screens: dashboard, subscriptions (+add/details), custom requests, group
  verification (+review), users (+details), groups (+details), finance (+transaction details,
  reconciliation, history, exceptions, disputes), support, security (events), system health.
- API areas without a bespoke Figma frame (notifications, reports, roles/admins, config,
  audit, security alerts/incidents/summary, health history/incidents, catalogue events/plans,
  wallet fundings, creator earnings) render through the shared `AdminDataPage` table, linked
  from the sidebar entries Figma defines, plus small in-page links added on the bespoke
  health/security/subscriptions/disputes screens.

## Known, documented API gaps (screens say so instead of faking)

- No admin custom-request endpoint (member-side only) → request detail approve/reject show a gap note.
- No group-level 'request more information' (only dispute-level `/admin/disputes/info-request`).
- No OAuth/social sign-in endpoints → Google/Apple buttons removed from signup/signin.
