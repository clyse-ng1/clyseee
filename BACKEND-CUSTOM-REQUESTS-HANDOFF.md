# Backend handoff: admin custom-subscription request queue

**Status:** This is a request for a backend contract, not a claim that these endpoints already exist. The current client intentionally shows no fabricated requests because member-side custom requests cannot be queried safely as an admin.

## Current blocker

The published admin API reference has no admin endpoint for custom-subscription requests. The member routes (`GET/POST /member/subscriptions/custom-requests`) are scoped to the submitting member, so they cannot power an admin queue or status tabs.

## Requested capability

Please expose an admin-authorized queue so staff can review every member's request, inspect its details, and update its review status. The backend team should confirm the final route names and payload schema before the client is wired up.

### Suggested operations (proposal)

1. **List requests** — paginated, filterable by status, category, and submitted date; optional text search by request ID, requester email/name, or requested service.
2. **Get one request** — full request details and requester reference, addressed by request ID.
3. **Update review status** — approve, reject, or mark under review; require a reason/note for rejection and record the acting admin and timestamp.

Possible route shape, subject to backend naming conventions:

- `GET /admin/subscriptions/custom-requests?status=&category=&q=&from=&to=&limit=&before=`
- `GET /admin/subscriptions/custom-requests/detail?request_id=`
- `POST /admin/subscriptions/custom-requests/review` with `{ request_id, status, note }`

## Data needed by the admin UI

- request ID and submission timestamp
- requester user ID, display name, and email
- requested service/subscription name and category
- requested plan details and billing period
- current status (`pending`, `under_review`, `approved`, or `rejected`, or the backend's canonical equivalent)
- review note / decision history, if available

The list response should include pagination metadata and counts by status (or document that the UI should derive counts from paginated results). The detail response should include the fields needed to make an approve/reject decision without querying member-only endpoints.

## Authorization and audit requirements

- Restrict all queue/detail/review operations to authorized admin roles.
- Enforce allowed status transitions server-side.
- Record the acting admin, previous/new status, timestamp, and decision note in the audit history.
- Do not expose one member's custom request through another member's `/member/...` scope.

## Acceptance checks

- An admin can see requests submitted by multiple members, with no placeholder rows.
- Status/category/date/search filters and pagination operate on the server's complete queue.
- Opening a request by ID returns the correct request or a clear not-found response.
- Review updates persist, reject invalid transitions, and appear in the audit record.
- A member can still only see their own requests through member endpoints.
