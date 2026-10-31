# Approved product decisions â€” 29 October 2026

All three web/backend deliverables plus customer mobile integration are in this release. Categories cover movies, concerts/music, comedy, plays, sports, workshops, exhibitions and activities. Venues host ticketed experiences; a venue-rental marketplace is excluded. India/INR/English initially; cities and content come from database records, with GPS discovery and localization-ready metadata.

Partners self-apply and founders approve selling. Multiple organizations/memberships and venues are supported. Organizations can own venues and organize events. A venue owner approves another organizer's venue/time request. Partner content submissions require approval according to configurable resource rules. Verification documents remain private and available to authorized platform staff; mandatory identity/business/venue proof depends on partner type, with optional agreements and tax documents as applicable. Bank validation is required before payouts.

Platform staff roles: founder, operations, catalog, support, finance, marketing. Founders invite platform staff/grant platform roles. Partner roles: owner, manager, cashier, scanner, marketing, accountant, scoped to assigned venues/events.

Customer authentication is SMS OTP or Google OAuth, not email/password. Founder/partner staff use email/password and authenticator MFA. Missing SMS/Google configuration must report unavailable; no fake OTP or authentication bypass. Razorpay TEST MODE only initially. Provider keys stay in backend environment configuration.

The platform receives customer payments. Founders configure fees/commission; refunds wait for approval. Founder-controlled partner payout workflows record verified transfers and retain an auditable ledger. A recorded manual payout is not a bank transfer integration.

Booking confirmation queues SMS and WhatsApp links to the ticket. Each missing/unconfigured channel is skipped independently, not reported as delivered. WhatsApp template requirements and public ticket URL must be configured before delivery. Local disk stores uploads, PostgreSQL stores records. Development stays local; existing unrelated services must be preserved. No sample business records or default passwords.

Recommended remaining defaults: assigned seating + capacity tiers; online scan/duplicate prevention; five-minute holds and six tickets/order initially configurable; publication approvals; verified booking reviews; founder promotions and opt-in marketing; private PDFs and JPG/PNG/WebP media; separate backup destination required before production.

## Docker-only runtime — 30 October 2026

User requested all services and builds run inside Docker. PostgreSQL is internal to the Compose network; API/worker/migrations and Nginx-served portals run in containers. Tests, backups and the Android APK builder use optional container profiles. Host application runtimes are no longer part of the workflow. Existing data volume, local media storage and private environment configuration are retained.
