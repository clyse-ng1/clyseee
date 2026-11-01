# Admin API coverage (API reference checked 2026-11-01)

The CMS sidebar now exposes live API-backed admin workspaces. Admin screens use the shared `api()` client (Bearer session, silent refresh, standard `{ data }` / `{ error }` envelope), real loading/empty/error states, cursor pagination where returned, and server-side filters.

## Wired workspaces

- **Dashboard:** `/admin/dashboard`
- **Catalogue:** services, plans, catalogue events; service/plan detail, create/edit, activate/deactivate
- **Group review:** queue/detail; approve, reject, suspend, resume
- **Users & groups:** list/detail/status changes
- **Finance:** transactions/detail, wallet funding, creator earnings, payouts, ledger integrity check, reconciliations/detail/run, exceptions/resolve, disputes/detail/info-request/resolve
- **Support:** issues/detail, assignment, priority, replies, status updates
- **Moderation:** records/detail and user/group moderation actions
- **Roles & admins:** roles and permission catalogue/history, admin list/detail/assign/status
- **Configuration:** grouped settings editor, typed values, bulk save, setting detail/history
- **Communications:** campaigns, recipient delivery states, configured channels; create/edit/preview/send/cancel
- **Templates:** list/detail/versions/placeholders; create/edit/preview/activate
- **Reports:** subscription and group summaries, authenticated CSV export
- **Security:** summary, events, incidents/detail/update, alerts, scan, retention preview
- **System monitoring:** health status, run checks, history/run detail, incidents/detail/update

## Explicit API gaps

- The Figma **Create Role** frame has no matching create-role endpoint in the current API reference. Role permissions and admin assignments are wired; the create screen clearly explains the missing endpoint rather than pretending to save.
- The old **Custom Subscription Requests (admin queue)** design has no admin queue endpoint in the current API reference; only member-owned subscription-request endpoints are documented. The screen is an honest API-gap state, not seeded with sample rows.
- Member-to-member chat/message endpoints remain absent from the API reference; the existing Messages page remains unchanged.
