# Delivery status — 30 October 2026

This is the first local full-stack review build, not a completed commercial launch. No catalog/user/venue fixtures were added to the main application database. Tests create and remove a separate database.

| Area | Available in this build | Limits / remaining work |
|---|---|---|
| Founder access | One-time bootstrap, password + authenticator MFA, platform roles, invitations, access changes/revocation, user suspension, audit trail | Recovery codes and password/email recovery not implemented; two-founder approval thresholds not implemented |
| Partner access | Self-registration, multiple organizations, owner/manager/cashier/scanner/marketing/accountant, scoped venue/event access | Scanner uses browser with hardware scanner or manual token; camera scanner/offline scanner not implemented |
| Approval | Private verification files, partner approval, per-resource approval rules, owner approval of external venue requests | Verification is manual; no identity-provider integration |
| Catalog | Movies/music/comedy/plays/sports/workshops/exhibitions/activities, categories, people, cities, venues, screens, layouts, price sections, general tiers, single shows | Repeating schedules, season/multi-day passes, tables, quota allocations, waitlists and POS integrations not implemented |
| Discovery | Search, city, GPS nearby venues, cast, trailers, detail pages, favourites for experiences/venues/people | No copied BookMyShow customer/review/catalog records; no recommendations engine or full localization UI |
| Inventory | PostgreSQL locked timed holds, booking cutoff/max tickets, excluded overlapping screen reservations, immutable published inventory | Single-show inventory only; multi-source inventory synchronization not implemented |
| Commerce | Add-ons, coupons, server pricing, platform collection, Razorpay test checkout, verified captures, QR tickets, history, review after attendance | External payment round trips require credentials; cash/box-office sale entry, partial ticket refunds and gift cards/loyalty/subscriptions not implemented |
| Finance | Founder commission/fee policy, requested refunds with founder approval, refund worker/reconciliation, encrypted approved banks, ledger and founder-recorded payouts | Payout recording does not send bank funds; no automatic splits, GST invoices/credit notes, CSV/PDF financial reports or configurable per-partner tax terms |
| Marketing | Scheduled city/home/search/featured promotion records and coupons; marketing consent controls | No marketing campaign sender, Android/iOS push, bulk segments, advertising billing or sponsored-search ranking engine; mobile currently renders home promotion feed |
| Messages | Independent queued booking SMS and WhatsApp ticket links, retries/statuses, missing providers skipped | Requires Twilio credentials, approved WhatsApp template, verified phone and public HTTPS origin; delivery receipts not integrated |
| Support/reviews | Booking support API, staff support records/responses, verified attendance review submissions and moderation | Customer-facing support inbox/chat/escalation SLAs not implemented |
| Media | Local disk images/private PDFs, 10 MB request limit, image decoding/re-encoding, database metadata, permission checks | No partner quotas, malware scanning, media replacement/deletion UI or video upload; trailers use HTTPS links |
| Privacy | Secure mobile token storage, staff permissions, opt-in marketing consent, GPS permission prompt | No behavioral tracking pipeline, retention automation, customer data export/deletion workflow |
| Operations | Dockerized PostgreSQL/API/worker/Nginx portals, automatic migrations, health checks, isolated container tests, Docker backup service and Android build profile | No deployed public environment, automatic backup schedule/restore drill, production signing/monitoring/load test |

## Verification evidence

- Workspace TypeScript checks and both Vite production builds passed.
- Mobile lint and TypeScript checks passed without warnings.
- 16 integration tests passed, covering founder bootstrap/MFA/CSRF, empty catalog and provider availability, tenant/private-file isolation, approval authority, actual publication/section pricing, overlapping reservations, scoped access, concurrent seat holds, price tampering, webhook replay, missing-channel skips, duplicate admission, late payment review and founder refund decisions, last-founder/owner protection and the bank/payout lifecycle.
- Android release build succeeded: version 2.0.0 / code 5, arm64-v8a + x86_64. APK signature verified (existing Android development signing identity). Installed and launched successfully in Pixel_8 emulator. Startup showed the empty API catalog and no AndroidRuntime/ReactNativeJS error logs.
- Founder setup and partner application screens were inspected in the browser; no real founder or partner account was created.
- Local backup script successfully exported the empty database and storage into a project test folder; an off-machine backup schedule and restore rehearsal remain outstanding.
- No external SMS, WhatsApp, Google OAuth, payment or bank transfer was performed. Provider-dependent flows remain unverified end-to-end.

Artifacts: `deliverables/BOOK-MY-TICKETS.apk`, versioned copy and SHA256 file. Screenshots: `screenshots/fullstack`. The local APK defaults to Android Emulator's API address; a physical phone needs the URL setup in README and a rebuild.


## Docker-only update

All server services, builds, checks, migrations, backups and Android compilation now use Docker. PostgreSQL is internal-only and the existing persistent volume/media were retained. Sixteen integration checks passed in an isolated Docker test database; both portal builds, mobile lint/typecheck/Android JS export, proxy checks and the backup workflow passed inside containers. See root README and QA.md for current commands and evidence.

The Docker-built Android APK completed successfully and its signature, version, embedded bundle and both native architectures were verified. No new host emulator/device run was performed for the Docker-only update; the earlier launch evidence above belongs to the preceding build. Current artifact checks and checksum are in root QA.md.
