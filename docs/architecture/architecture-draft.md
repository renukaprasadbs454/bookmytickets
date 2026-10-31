# BOOK MY TICKETS — architecture proposal

Status: DRAFT, awaiting product answers. No application implementation is authorized by this document alone.
Date: 29 October 2026.

## Confirmed requirements

- Founder administration portal.
- Portal for theatre owners, venue owners, and event organizers/hosts.
- Shared secure backend using PostgreSQL, Express, React and Node.js (PERN).
- Existing React Native customer app remains the customer application.
- Founders need controls across all business modules.
- Store media locally; exact storage interpretation needs confirmation.
- No demo catalog, sample customers, fake reviews, or hardcoded business records.
- Complete architecture and feature discovery before coding.

## Scope interpretation to confirm

The three immediate deliverables are founder portal, partner portal, and shared backend. The existing mobile app stays blank until its integration phase. If the intended third deliverable is also a rebuilt customer experience in this phase, delivery scope must include it explicitly.

## Proposed deployment and code layout

Use a modular monolith: one Express API with separate domain modules, plus a worker process from the same backend codebase. This provides one authorization and booking system while keeping domain boundaries clear. Start with PostgreSQL-backed jobs/outbox; an additional queue service is not required for the initial architecture.

frontend/
  admin-panel/       React + TypeScript founder portal
  partner-panel/     React + TypeScript owner/host portal
  user-app/          existing React Native app
backend/
  src/modules/       auth, partners, venues, catalog, inventory, bookings, etc.
  src/worker/        expired holds, notifications, media jobs, reconciliation
  migrations/        versioned PostgreSQL schema changes
packages/
  contracts/         shared request/response validation and types
storage/             persistent local media root, excluded from Git
  public/            published approved marketing/catalog assets
  private/           verification documents and restricted files
  temporary/         uploads pending validation

Exact dependency versions, ORM choice, runtime ports and deployment configuration will be selected and verified when implementation begins. Preserve the existing mobile project rather than recreating it.

Browser portals and mobile app -> HTTPS entry point -> Express API
Express API -> PostgreSQL
Express API -> managed local media directories
Worker -> PostgreSQL jobs/outbox -> media processing, payment reconciliation, notifications
External integrations -> signed webhook endpoints -> Express API

One deployment can initially run the API, worker and PostgreSQL on the same server with separate processes/containers and persistent volumes. Traffic and storage answers determine whether they should be separated from the beginning. Deployment is a later action, not part of this proposal.

## Storage model

Proposed interpretation of local storage: files on the application server's persistent disk, not browser localStorage or each user's phone.

PostgreSQL stores users, partner organizations, memberships, venues, screen layouts, content, shows, inventory, bookings, payment/refund records, payouts, favourites, reviews, campaigns, consent records, audit events and media metadata. File bytes are stored in local directories; database rows store media IDs, storage keys, ownership, visibility, type, size, checksum and processing state.

Uploads receive generated filenames and validated types, contents, dimensions and limits. Published posters can be served publicly; private verification documents require API authorization. Upload directories must not execute code. Use separate temporary and approved states; a file is not publishable until validation completes. File ownership is checked before attaching it to a listing.

Database and filesystem operations are coordinated with explicit pending/ready/attached/deletion states; a database rollback alone cannot undo a filesystem operation. Cleanup jobs handle orphaned files and delayed deletion. Backup/restore must cover database rows and associated file versions together. Server-disk storage still needs a separate backup destination, capacity limits and disk-full handling; those decisions are pending.

Browser localStorage is limited to harmless preferences if needed. Web authentication uses secure HttpOnly cookies with CSRF protection for cookie-authenticated mutations. Mobile authentication uses secure device credential storage when that app is reconnected.

## Identity, organizations and access

Identity is shared, but sessions have an intended audience: founder web, partner web or customer mobile. A customer login does not grant partner or founder access.

A partner organization can have multiple members and multiple venues. One person can hold memberships in multiple organizations if approved. Members get role and resource scopes: organization, venue, screen or event. All resource access is authorized on the server using authenticated identity, memberships and resource ownership. Request-supplied organization IDs are never sufficient authority.

Proposed roles:
- Founder/super admin: platform-wide business control, settings and staff access.
- Platform operations/catalog: approvals, catalog and show oversight.
- Platform support: scoped customer/booking assistance.
- Platform finance: refunds, commissions, settlements and financial reports.
- Partner owner: organization, venues, team and agreed financial access.
- Partner manager: assigned venue/event operations.
- Box-office staff: permitted counter bookings and availability controls.
- Gate staff: assigned ticket verification and check-in only.
- Customer: own profile, preferences, bookings, reviews and favourites.

Owner, venue-owner and organizer capabilities should be permission sets attached to an organization, not three incompatible account systems. Hosting at another organization's venue requires an explicit venue/resource agreement or approval.

Founder controls span every business module. High-impact changes use explicit workflows and audit records: suspensions, owner bank changes, refunds, payout releases, show cancellations, customer-data exports and staff permissions. Completed financial events remain traceable through adjustments and reversals. Private credentials are handled through configuration workflows rather than displayed in dashboards.

## Founder portal modules

1. Dashboard: booking volume, occupancy, revenue, refunds, partner balances, pending approvals and service health.
2. Platform staff: roles, permissions, invitations, account/session controls and audit history.
3. Partners: applications, verification documents, approval/rejection, agreements, suspension and assigned staff.
4. Geography: country/state/city/locality records and serviceability.
5. Venues: theatre chains, venues, screens/halls, facilities, accessibility information and verified location.
6. Catalog: movies, people/cast/crew, genres, languages, certifications, durations, formats and media.
7. Experiences: event categories, organizers, schedules, venue links, capacity/ticket variants and publication status.
8. Shows and inventory: calendars, seating-layout versions, capacity, price rules, blocked seats, quotas and on-sale windows.
9. Orders and tickets: bookings, holds, payment state, issued tickets, cancellations, refund workflows and check-in records.
10. Finance: commission agreements, convenience fees, tax configuration, settlement ledger, payout approvals and reconciliation.
11. Growth/content: banners, featured placements, scheduled advertisements, sponsor placements, coupons and content pages.
12. Messaging: transactional templates, notification campaigns, targeting, consent filters and delivery results.
13. Customers: account controls, booking support, consent records and permission-controlled exports.
14. Reviews/support: moderation, reports, support cases and resolution history.
15. Settings/operations: policies, provider configuration, quotas, media library, job failures, backup status and audit search.

This is a proposed feature inventory. An item becomes implementation scope only after its release priority is agreed.

## Partner portal modules

- Organization profile and verification application.
- Venue/screen onboarding with facilities and local image uploads.
- Team invitations and venue/event-specific permissions.
- Movie selection from approved shared catalog; missing-content request workflow.
- Event creation, dates, ticket tiers, capacity and publication requests.
- Screen layouts, show calendars, pricing, blocked seats and on-sale windows.
- Bookings and counter sales when enabled; operational attendee lists with scoped customer information.
- Ticket scanning/check-in, duplicate rejection and authorized manual lookup.
- Food/add-ons and venue-specific offers if included in the release.
- Sales, occupancy, fees, refunds, settlements and payout reports.
- Promotion requests or self-service promotion purchases if enabled.
- Support cases and operational notifications.

Whether partners can publish immediately or need founder approval must be chosen per resource type. Selling inventory must not be silently changed by edits to a venue's current seat map: shows reference a layout version and booking-time price/policy snapshots.

## Proposed data domains

Identity: users, credentials, sessions, permissions, roles, memberships, invitations, consent_records.
Partners: organizations, verification_submissions, agreements, organization_members.
Places: locations, venues, halls/screens, facilities, seat_layout_versions, seats.
Catalog: movies, people, movie_credits, genres, languages, formats, catalog_media.
Experiences: events, occurrences, ticket_types, venue_permissions, publication_reviews.
Inventory: shows, show_seats, capacity_buckets, holds, hold_items, inventory_adjustments.
Commerce: orders, order_items, price_snapshots, payments, webhook_events, refunds, tickets, check_ins.
Finance: commission_agreements, ledger_entries, settlements, payouts, financial_adjustments.
Growth: placements, campaigns, creative_assets, coupons, redemptions, notification_jobs, delivery_attempts.
Customer: favourites, follows if approved, reviews, support_cases, notification_preferences.
Operations: media_assets, media_links, audit_events, outbox_events, background_jobs, platform_settings.

These are entity boundaries, not a finalized schema. Payment routing, shared venue use and offline requirements must be answered before schema approval. Money uses integer minor units with currency; financial history is not recomputed from today's mutable commission settings.

## Booking correctness

The server owns inventory and totals. For assigned seating, create canonical inventory rows per show/seat and use PostgreSQL transactions/row locks with database constraints. For general admission, reserve quantities atomically against capacity buckets. All seats in one hold succeed or fail together; lock seats in a consistent order to limit deadlocks.

Proposed flow: availability -> expiring hold -> server-priced order -> provider checkout -> verified webhook/reconciliation -> inventory confirmation -> ticket issuance -> notifications.

Hold expiry is enforced using database time during reservation/confirmation as well as by cleanup jobs. A worker delay must not keep expired stock unavailable indefinitely or enable overselling. Pending payments, expired holds and late successful payments have separate reconciliation paths: do not issue a ticket for stock that has already been sold to someone else.

Payment creation, provider events, refunds and ticket issuance are idempotent. Browser/mobile payment-success messages do not confirm orders. QR tickets carry opaque admission tokens rather than customer information. Online scanning atomically records admission and rejects repeated entry according to the agreed re-entry policy.

Counter sales and any external point-of-sale integration must reserve the same inventory if the platform is to prevent overselling. A purely manual import cannot guarantee real-time consistency with another ticketing system.

## Secure API boundary

- HTTPS termination and explicit web-origin configuration.
- Schema validation and request/body/upload limits.
- Verified authentication, session rotation/revocation and MFA for privileged accounts.
- Authorization on every API and private-file request; role plus resource/organization scope.
- Rate limits for login, OTP, uploads, checkout and scanning; provider webhooks are authenticated separately.
- Cookie security and CSRF controls for web; secure token lifecycle for mobile.
- Parameterized database access; restricted database/runtime accounts.
- Signed provider webhooks and event deduplication.
- Audit records for privileged business changes and sensitive exports.
- Secrets remain server-side; logs redact credentials and sensitive customer data.
- Founder bootstrap is a deliberate one-time setup process, with no shipped default password or fake customer accounts.

Relevant design references: OWASP Authorization, Session Management and File Upload guidance, and PostgreSQL explicit locking documentation. These guide the proposal; the implementation still requires targeted authorization, upload and concurrent-booking tests.

## Delivery gates proposed

A. Answer the product questionnaire and agree first-release scope.
B. Approve role matrix, data model, booking/payment/refund flows and storage/backup plan.
C. Build foundation: PostgreSQL migrations, auth, organizations, permissions, audit, local media and empty API-backed portals.
D. Build founder and partner onboarding, catalog, venue layouts and publication approval.
E. Build inventory, holds, orders, payments/refunds, tickets/check-in and finance workflows.
F. Add promotions, notification providers, reporting and customer/mobile integration according to agreed priority.

No sample business data will be inserted unless separately requested. Empty states should guide real record creation. The minimal founder bootstrap and permission definitions are operational setup, not a demo catalog.

## Acceptance criteria to carry into coding

- A partner cannot read or change another partner's records or private files, even using guessed IDs.
- Gate staff cannot access finance/customer exports; support access is scoped.
- Two concurrent customers cannot successfully purchase the same seat; capacity cannot become negative.
- Replayed payment events cannot duplicate tickets, credits, refunds or payouts.
- A late payment after stock release is reconciled without overselling.
- Published layout edits do not corrupt existing reservations.
- Ticket scan replay and revoked/cancelled tickets are handled correctly.
- Upload validation prevents executable files and unauthorized attachment/access.
- Restarting services preserves PostgreSQL data and local media.
- Backup restoration recovers a consistent set of records and media.
- No application screen depends on hardcoded business records.

## Sources

- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- https://www.postgresql.org/docs/current/explicit-locking.html

See feature-questions.md for decisions required before implementation.
