# Connected booking release

## Included changes

- Customer discovery refreshes on focus and periodically, with manual refresh and city/category/type/language/genre/format filters derived from real content.
- Network requests time out with readable errors. Failed listing, inventory and booking requests show an error state.
- Customer support submission, private request history and staff replies are connected to the portal support editor.
- Founder dashboard shows approval counts and catalog setup prerequisites. Approval validates category, city and cast prerequisites.
- All hold creation requires an approved organization, content, venue and screen. Payment finalization rechecks parent availability before issuing admission tickets.
- VPS proxies forward sanitized client addresses to avoid sharing one IP rate limit across customers. Apply the matching host Nginx template and internal gateway together.
- Patched Sharp 0.35.5 and matching Linux binaries remove the known production dependency advisories; upload checks pass.
- Email/password staff authentication remains enabled. SMTP OTP provider settings are documented in the founder panel.

No sample movies, customers, venues or shows are added. Existing bootstrap only creates configured founder/partner login accounts and retains existing credentials. Catalog setup and provider credentials remain operator configuration.

## Docker verification

```bash
docker compose --profile checks build checks
docker compose --profile checks run --rm checks
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile build mobile-checks
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile run --rm --no-deps mobile-checks
docker compose up -d --build --wait
docker compose exec -T api node scripts/verify-connections.mjs
```

The connection check signs into the configured private founder/partner accounts and signs out its new sessions. It prints no credentials or tokens, sends no OTP messages, creates no catalog records and does not run provider payment transactions. Run it in the local development stack; default test origins are loopback ports. Integration tests use a separate disposable PostgreSQL database and cover approval, publication, tenant privacy, seat concurrency, GA capacity, favourites/consent, SMTP OTP, support replies, signature verification, late payment, scanning, refunds and settlements.

## VPS update

Follow [SHARED-PROXY.md](SHARED-PROXY.md), using all three Compose files. Preserve private environment files and database volumes. Do not run init-env again on the existing server. After applying the host Nginx update, rebuild the services and reload the internal gateway config. The remote VPS is a separate deployment; local verification does not apply code there automatically.

## APK

Use `compose.mobile.yaml` and the Docker Android build instructions in the root README. Set EXPO_PUBLIC_API_URL=https://user.bmt.kwiko.org for the public build. The customer API lives under /api on that origin. The retained development signing identity supports upgrades from earlier review APKs. Local founder and partner login credentials are in ignored backend/.env; the partner seed grants no approved organization or selling rights. Installation/device behavior and production store signing need separate verification.

## Operational dependencies

Bookings require approved records and Razorpay sandbox credentials; SMS and WhatsApp need configured delivery providers and an approved WhatsApp template. Google needs registered OAuth credentials/redirect. An empty approved catalog correctly produces empty discovery screens. Configured capability flags do not prove successful delivery by a provider.

## Scope

This release connects the current booking platform. It does not claim feature parity with another service. Gift-card stored value, ticket resale/transfer, streaming rights/DRM, loyalty/subscriptions, offline gate admission, push campaigns, account data export/deletion and tax invoice generation remain separate product work. Do not advertise those as complete.

Release verification: 21 isolated checks passed; Docker Chromium verified both welcome screens and seeded password-login dashboards. APK 2.0.1/code 6 is signed and live-URL verified; checksum in root QA.md. No mobile device launch or real external-provider transaction was performed.
