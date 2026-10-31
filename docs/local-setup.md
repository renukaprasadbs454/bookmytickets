# Docker operations

All application/build/test processes run in containers. Use the root README for the start, stop, checks, APK and backup commands. The earlier host npm/Gradle workflow has been replaced.

## Service boundaries

Nginx serves built founder/partner React portals on host loopback 5178/5179 and proxies /api, /ticket and /checkout to the API container. The API listens on 4100 inside Docker and is published on host loopback 4100 for the Android customer app. PostgreSQL is only reachable at postgres:5432 on the project's Docker network. The separate worker processes notifications, hold expiry and approved refunds. A one-shot migration service completes before the API/worker start. Health checks cover PostgreSQL, API, worker heartbeat and both Nginx servers. Portal proxies use Docker DNS to rediscover the API after container replacement.

The existing database volume is retained. Local `storage/` is bind-mounted to `/app/storage` in the API/worker, so images and private verification documents survive image rebuilds. Root and backend environment files remain private host configuration; neither is copied into images. The API process runs as the node user without Linux capabilities. The Android signing key is mounted read-only at build-container runtime and is not baked into an image.

## Configuration

Root .env supplies POSTGRES_USER/POSTGRES_DB/POSTGRES_PASSWORD and optionally EXPO_PUBLIC_API_URL for Android builds. backend/.env supplies APP_KEY, ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD, provider values, PUBLIC_ORIGIN and WEB_ORIGINS. Compose overrides DATABASE_URL, HOST, PORT and STORAGE_ROOT for container networking. Keep the existing database password and APP_KEY when reusing stored data.

The stack deliberately uses development cookie mode for local HTTP. Production HTTPS, production signing, full-disk encryption, upload scanning, data-retention workflows and monitored backups remain separate work. Do not expose the local review stack publicly.

## Provider setup

All provider secrets belong in backend/.env. Recreate API and worker after edits. Blank provider values disable the related flow; no fake OTP or payment fallback exists.

- Twilio SMS login: account SID, auth token, Verify service SID. Phone numbers are E.164.
- Google: web client ID/secret and registered `${PUBLIC_ORIGIN}/api/auth/google/callback` redirect. The mobile handoff is short-lived, single-use and bound to its verifier. A Google customer must verify a phone for SMS/WhatsApp confirmations.
- Razorpay: test key ID starting `rzp_test_`, key secret and signed webhook secret. A reachable `/api/webhooks/razorpay` processes payment.captured and refund.processed. Browser return alone does not confirm a booking.
- SMS confirmation: Twilio SMS sender. WhatsApp confirmation: WhatsApp sender plus approved Content SID (template variables 1=experience title, 2=ticket URL).
- Confirmation links require TICKET_PUBLIC_ORIGIN with a public HTTPS API origin. Unconfigured/ineligible channels are skipped independently. Message `sent` means accepted by the provider, not a verified handset delivery receipt.

## Money flow

The platform receives payments. The API calculates prices/fees/coupons/commission and stores an order snapshot. Captured payments append partner ledger credits and issue QR tickets. Refunds await founder approval; the worker reconciles provider refunds before reversing credits. Payouts use approved encrypted bank records and cleared funds after event delays/refund holds. Founder payout recording stores an external bank-transfer reference; it does not move money.

## Backups and isolated restore

Stop the portals/API/worker before a coordinated snapshot; keep PostgreSQL running. Run the backup profile and then start the stack again as shown in README. The backup container uses pg_dump and archives media read-only, writing to host `backups/`. It does not mount the Docker socket. Back up root/backend environment files and the signing key separately with encryption and restricted access. Copy backups to a separate disk/machine.

For a restore rehearsal, create a new PostgreSQL container with a new named volume and isolated network. Load database.dump through its container's pg_restore with --no-owner, unpack media into a separate directory, and supply the matching APP_KEY to an isolated API. Verify records and private-file access there before any cutover. Never overwrite the active database during a restore test. Automatic backup schedules and disaster-recovery drills are not configured.

## Development and checks

Source edits are built into images; there are no host dependency/source mounts for running servers. Rebuild with `docker compose up -d --build --wait`. Platform checks use a separate tmpfs PostgreSQL service on a separate network and do not receive the main database credentials. Mobile checks/builds use compose.mobile.yaml and do not launch a host emulator or host Metro server.

## Sources

Startup gating follows [Docker Compose startup order](https://docs.docker.com/compose/how-tos/startup-order/). The Android builder uses [official Android command-line tools](https://developer.android.com/studio#command-tools) and [documented SDK packages](https://developer.android.com/tools/sdkmanager). Dependency installation and builds take place inside Linux containers.

