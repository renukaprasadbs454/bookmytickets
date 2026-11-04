# Push campaigns and customer test OTP — 2–3 November 2026

- 42 isolated Docker integration checks pass: platform booking controls, campaign roles/consent/audiences/scheduling, Expo FCM payload mapping, retry/cancellation handling, and temporary customer OTP login.
- Email and SMS test requests accept 123456 without SMTP/Twilio, retain cooldown/expiry/attempt limits, reject staff/password accounts and require an issued challenge. Disabling the mode rejects marked test sessions and pending test codes. The optional test-contact allowlist is checked server-side.
- Platform/portal TypeScript checks pass. The native APK builder passed mobile lint and TypeScript checks. APK 2.1.1/code 8 source includes the live API URL, test-mode notices and the notification inbox. Its build was deferred by the user on 3 November after C: fell below 40 MB free. The disposable builder was removed; no final 2.1.1 APK is claimed. Existing API-connected APKs can use 123456 manually once the server is updated.
- Docker Chromium verified both password-login dashboards and the campaign composer/audience preview without saving or sending a campaign. Provider acceptance and delivery were simulated only in isolated tests; no real push or OTP was sent.
- Firebase is not configured. Android phone delivery remains unverified and requires the private provider files plus an APK rebuild with its client config. Inbox campaigns are available after deploying the code.
- Local private backend/.env enables the requested customer test mode. The remote VPS requires the operator commands in deploy/TEST-OTP.md; no remote environment/code changes were applied by this agent.

# Current verification — 1 November 2026

- Docker-only API, worker, PostgreSQL, admin and partner services are healthy; migrations and idempotent login seeds completed. No catalog fixtures were inserted.
- 21 isolated integration checks passed (20 subtests plus the parent test), including approval-to-public-discovery, tenant/private-file isolation, SMTP OTP, support request privacy and staff replies, favourites/consent, assigned-seat concurrency, GA capacity, archived-venue hold blocking, signed capture/replay protection, admission, refund and bank/payout flows.
- Platform and portal TypeScript checks, both portal production builds, mobile lint/TypeScript and Android JavaScript export passed.
- Reproducible `docker compose exec -T api node scripts/verify-connections.mjs` passes seeded founder/partner password login, authenticated dashboard, API proxy, CORS and logout checks without displaying credentials.
- Docker Chromium verified both welcome screens and seeded founder/partner dashboard login with zero uncaught page errors. Local screenshots/results are under ignored `.qa/browser-output/`. Desktop browser tools failed to initialize; Chromium provided the replacement verification.
- Sharp was upgraded to 0.35.5 with matching Linux binaries/libvips. The production dependency audit (`npm audit --omit=dev`) reports zero known vulnerabilities. Image upload validation still passes.
- Internal gateway, standalone TLS gateway and host HTTPS Nginx syntax checks pass using temporary Docker test certificates; merged VPS Compose configuration passes. Host Nginx and internal forwarding changes must be deployed together; see deploy/SHARED-PROXY.md.
- Docker APK build passed (388 tasks, 20m25s). Version 2.0.1 / code 6, package com.cinepass.demo; embedded https://user.bmt.kwiko.org verified. Signature matches the retained development certificate SHA256 fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c.
- APK: deliverables/BOOK-MY-TICKETS-live.apk. SHA256: 36d9b1b12e694f6c48e2382f0625eb4296d7b6389cf4798b7ce78a997c889d89. Canonical Docker and BOOK-MY-TICKETS.apk copies contain the same build.
- This APK was not installed/launched on a device or emulator. Real payment, Google, SMS and WhatsApp provider round trips were not performed.
- No remote deployment was applied. SSH authentication was unavailable; the operator chose to run the supplied VPS commands. The public API responded during the audit, with an empty approved catalog.

Earlier verification records below refer to their dated builds and artifacts.

# Docker verification — 30 October 2026

The runtime and build workflow is now Docker-only. No host application server, npm build, Gradle build, Metro server or Android emulator was launched for this change.

Verified inside Docker:

- API, worker, PostgreSQL, founder Nginx and partner Nginx containers report healthy.
- Migrations completed successfully against the retained PostgreSQL volume.
- PostgreSQL has no host-published port; only API 4100 and portals 5178/5179 are published on loopback.
- 16 integration checks passed against a separate test PostgreSQL container on an isolated network. The disposable test service was stopped afterward.
- Both portal production builds and platform TypeScript checks passed in Linux build containers.
- Mobile lint, TypeScript and Android JS export passed inside the mobile check container (1312 modules).
- Both Nginx portal proxies return the real API capabilities and empty public catalog.
- The main database still contains zero users, catalog records, orders and uploaded files.
- The non-root API user can write/read/delete a temporary file in the persistent media mount.
- Private backend environment files are excluded from the application image.
- The Docker backup service exported a custom PostgreSQL dump and a media archive to backups/.
- Existing unrelated fitnerve containers remain running on ports 3000 and 5050.

The initial Windows dependency lock omitted Linux sharp binaries. Matching optional Linux packages were added and verified through API startup, upload integration tests and the full passing test suite.

Android APK compilation runs through the optional apk profile. See README for the build commands and artifact paths. External provider flows still require credentials; product-feature limitations remain documented in docs/delivery-status.md.

Final Android verification:

- Docker APK build succeeded (388 tasks, 45m55s for the initial cold Gradle build).
- Version 2.0.0 / code 5, package com.cinepass.demo, target SDK 36.
- ARM64 and x86-64 native libraries and the embedded JavaScript bundle are present.
- Signature verified against the existing development certificate (SHA256 fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c).
- Docker-built APK SHA256: 65abf195967c8571ea3542fba57c0bf99427ed6d49fcca71bae894a2cfc3bb55.
- Artifacts: deliverables/BOOK-MY-TICKETS-docker.apk and BOOK-MY-TICKETS.apk (44,061,663 bytes).
- No new emulator/device installation was performed for this Docker-only change. Earlier emulator evidence in historical notes applies to the preceding build.

31 October update: SMTP six-digit customer email OTP and configurable domain/localhost CORS added. All 18 integration checks and Docker mobile lint/TypeScript checks passed. Test SMTP verifies sender, code, cooldown, reuse rejection, staff-password isolation and five-attempt lockout. No real email sent: SMTP credentials remain blank. Existing APK must be rebuilt to include the new email sign-in screen. Dependency audit reports a pre-existing high-severity Sharp/libvips advisory; its recommended breaking-version upgrade is not applied by this SMTP change.

## Local catalog and storefront review - 4 November 2026

- Explicit Docker-only `seed:demo` succeeded: three owner logins and memberships, eight cities, nine categories, 24 venues/layouts, 11 experiences, eight cast/crew records, 88 future shows, assigned-seat and tier inventory, eight add-ons, three promotions, a coupon and policy. Repeat execution created zero duplicate shows and retained existing passwords.
- Local disk WebP assets fetched successfully from the source URLs in the seed; public image API returned the correct MIME type.
- Backend suite: 42/42 passed in isolated Docker PostgreSQL. Backend/portal TypeScript and customer lint/typecheck/web export passed.
- 32 connected HTTP checks passed: all three partner logins and memberships, founder owner directory, city filtering, local images, promotion draft invisibility and approve/update/restore flow, customer OTP, profile editing and saved count.
- Docker Chromium passed admin/partner welcome/login, three partner cards and promotions table, customer light/dark discovery, city selection, movie detail, OTP login, profile name save and reload, notification inbox. Zero uncaught browser errors. Screenshots inspected; missing glyphs replaced with SVG icons.
- All six runtime services are healthy: PostgreSQL, API, worker, founder portal, partner portal and customer web. Local seed content is sample availability. No real payments, messages, identity verification or fabricated reviews/bookings were introduced.

### Filter popup and horizontal scrolling

Customer filters now open in a centred modal with a dimmed backdrop, scrollable options and fixed Close/Clear/Show results controls. All four horizontal rails use native nested scrolling on mobile and browser scroll containers with visible scrollbars, arrows, mouse dragging, wheel and keyboard support on web. Docker lint, TypeScript and web export passed. Docker Chromium verified filter apply/clear/close/Escape, horizontal mouse drag without accidental category selection, wheel, arrow controls, keyboard, CDP touch swipes, and overflow for categories, promotions, movies and venues. No uncaught browser errors. Popup screenshot visually inspected. Native device runtime remains unverified; APK build remains deferred.

### VPS full customer web routing fix

Production Compose now builds the same customer web app as local review, replacing the legacy static landing-page mount. Both gateway templates point to customer-web:8080. Browser API/media requests use the current origin by default; native builds retain configured API URLs. Docker customer lint/typecheck/export passed. Merged VPS/shared-proxy Compose verified customer image/build, absence of legacy bind mount, private gateway port 18089 and customer health dependency. Nginx syntax check passed in a disposable gateway container. Docker Chromium replay through that gateway under https://user.bmt.kwiko.org verified full storefront, filter popup, customer OTP login and profile: 44 same-origin API/media requests, zero uncaught errors. This is local verification, not deployment to the live VPS.

### Customer sign-in design refresh

Phone and email screens share a centred, branded authentication layout with theme-aware cards and responsive sizing. India mobile input has a separate +91 prefix, 10-digit validation and pasted-number normalisation. OTP entry supports six digits, autofill, wrong-code errors, resend countdown and changing contact. Unconfigured providers are hidden; native Google flow is retained when available. Test-mode notices remain visible without dominating the form. Docker lint/typecheck/web export passed. Docker Chromium verified mobile validation, pasted +91 number, rejected wrong code, customer mobile and email test-OTP login, hidden unavailable Google, light/dark and desktop/mobile layouts with zero uncaught errors. Screenshots visually reviewed. No backend auth changes or APK rebuild.

### Category illustration refresh

Discovery categories now use local SVG illustrations, individual accent palettes, larger icon areas, consistent two-line labels and a purple selected state. Existing category records and horizontal rail controls are preserved. Docker lint/typecheck/web export passed. Desktop/mobile and both theme screenshots inspected. Browser checks cover all ten seeded options, Movies filtering, All experiences reset, accessible pressed state and horizontal wheel scrolling. No backend or dependency changes; native device runtime remains unverified.
