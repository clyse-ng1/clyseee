# Clyse Trello audit — implementation snapshot

**Scope:** all actionable open board work, not only the original sprint. This file records the current implementation state; it is not a claim that every open card is complete.

## Implemented or improved in this pass

- **NOTIFICATION-002:** category/channel preference controls, mandatory-category protection, optimistic save/rollback using `PUT /member/notifications/preferences`.
- **WAITLIST-003:** the waitlist entry can start the existing create-group flow; it carries the exact plan and waitlist context, preserves free creation, captures date/access/visibility, requires invoice/receipt evidence and calls the documented from-waitlist create endpoint.
- **SUB-003 / SUB-004:** member request creation, list, detail/history, and rejected-request resubmission against the documented member endpoints; catalogue empty states route to the request form.
- **PAYOUT-001:** withdrawal fee/net estimates where API configuration is present, verified bank-account selection and explicit confirmation for simulated payouts.
- **DISPUTE-002:** creator dispute queue, detail/history, response and evidence upload using the documented member-dispute APIs.
- **USER-005:** new paginated subscription-history screen with membership events and payment details; linked from My Subscriptions.
- **WALLET-003:** transaction type/direction/date filters, cursor-based loading, and transaction details.
- **Admin access:** admin routes now require a successful server-authorized admin dashboard probe, in addition to sign-in.
- **Data integrity and flow cleanup:** removed sample users/prices/groups from public marketplace, browse, waitlist-join and create-group selection paths; corrected invite-code vs group-ID display; removed the demo verification contact; dead custom-subscription controls now link to the member request form; invalid direct-entry create/join routes no longer show fabricated success or sample money.

## Existing implementation retained

- **GROUP-012 / GROUP-013** were implemented and previously build/lint-validated before this broad-scope pass. Current build/lint also pass after the newer edits.
- The repo already contains member flows for authentication, catalogue browsing, group join/create/manage/close, access, reports, wallet funding, bank accounts, renewals, waitlist management, and notifications. Their continued presence is not the same as an end-to-end acceptance-test sign-off.
- Most admin screens are routed through the existing live-data `AdminDataPage`; actions remain dependent on each user's backend permissions and should be exercised with authorized admin accounts.

## Explicitly blocked / not claimed complete

1. **ADMIN-002 — Custom Subscription Request Review:** the Trello export marks backend work complete, but the supplied API reference does not document an admin request-queue/review endpoint. The UI therefore displays an honest unsupported state rather than guessing routes or presenting mock records.
2. **ADMIN-012 role creation:** the API reference documents role catalog/history, admin assignment/status, and permission changes, but not a create-role endpoint. Role creation is not simulated.
3. **BUG cards 65–75:** the export contains generic titles and screenshots but no usable acceptance descriptions. Direct Trello attachment retrieval returned HTTP 401, so cards about margins, icon/footer removal, UI review, and clickability cannot be reliably matched to their screenshots from this export alone. Some general clickability, spacing, and fake-data issues were addressed, but these cards are not marked closed.
4. **End-to-end verification:** build and lint pass, but no authenticated browser/API acceptance run was performed in this pass. Admin authorization, payment simulation and evidence uploads still require real test accounts and live backend responses.
5. **“Review all screens and compare with the UI”:** these nine screenshots expose specific dashboard, browse, create-group and footer issues; those marked issues were addressed. The images do not define a full-screen design specification for every application route, so this is not a complete product-wide visual QA sign-off.

## Screenshot-referenced BUG fixes in this pass

- Removed the decorative trailing arrows from the logged-in sidebar rows.
- Added top spacing to the dashboard content and browse search area; hid the horizontal category-strip scrollbar while keeping it scrollable.
- Improved contribution-panel text contrast, used creator avatars only when supplied by the API, and removed fixed demo group prices/people from loading and missing-data states.
- Removed About Us and Contact Us from the **logged-in** top navigation per the user's latest choice; public navigation is unchanged.
- Removed the disclaimer paragraph marked in the footer screenshot while retaining the rest of the footer.
- Made subscription cards visibly keyboard/click selectable and added accessible pressed states.
- Reworked the create-details page to use catalogue plan pricing/capacity only, support plan choice, block continuation without valid data, and reduce oversized spacing/fixed-width overflow.

## Validation

- `npm run build` — passed. Vite still reports its existing large-chunk advisory.
- `npm run lint` — passed with zero warnings and zero errors.
- A live Vite preview is running for manual review. No authenticated test-account API acceptance run was performed in this pass.
