# BOOK MY TICKETS — Docker only

The API, background worker, PostgreSQL, founder portal and partner portal run in Docker. Builds, migrations, tests, backups and Android APK compilation also run in containers. Docker Desktop with Linux containers is the only host runtime required. No host Node, npm, Java, Gradle, Android SDK or database installation is needed.

## Start and stop

Run from this folder:

```powershell
docker compose up -d --build --wait
docker compose ps
```

- Founder: http://127.0.0.1:5178
- Partner: http://127.0.0.1:5179
- API: http://127.0.0.1:4100/health

PostgreSQL has no published host port. The stack waits for its health check, runs migrations once, then starts the API/worker and the portals. The web portals are built static assets served by Nginx; no host Vite server runs. Port 4100 stays available for the customer mobile app. Ports are loopback-only for local review.

```powershell
# Stop this stack, retaining containers, database and files
docker compose stop
# Resume
docker compose up -d --wait
# Remove this project's service containers/network, retaining persistent data
docker compose down
# Logs
docker compose logs -f --tail 50 api worker
# Apply a new source revision
docker compose up -d --build --wait
```

Do not add `-v` to `down`: it would remove the PostgreSQL volume. Other projects' containers are not part of this Compose project.

## Files and first founder

Existing private root `.env` and `backend/.env` files are reused. For a new checkout, copy their `.env.example` files and set your own independent random database password, APP_KEY (64 hex characters), and ADMIN_EMAIL / ADMIN_PASSWORD. Docker creates no default founder or catalog records. Compose supplies the database's internal hostname and the persistent upload path. Secrets and host dependencies are excluded from the build context.

The admin account is seeded automatically during Docker startup from ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD in backend/.env. Sign in with those values using email and password. Authenticator MFA is disabled for this release. Existing accounts are never silently reset on restart. Create cities, categories and a booking policy before approving partner submissions.

PostgreSQL data remains in the existing `book-my-tickets_bmt_postgres` volume. Uploaded images/documents remain on local disk in `storage/`, mounted into the API and worker. Keep the matching APP_KEY safe: encrypted records depend on it. No browser localStorage database is used.

## Tests inside Docker

```powershell
# Backend + web TypeScript checks happen during the checks image build.
docker compose --profile checks build checks
# Integration tests use a separate temporary PostgreSQL container/database.
docker compose --profile checks run --rm checks
# Stop the disposable test database when finished.
docker compose --profile checks stop test-postgres
# Mobile lint, TypeScript and Android JS export, all inside Docker.
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile build mobile-checks
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile run --rm mobile-checks
```

## Build the customer APK inside Docker

```powershell
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile build apk
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile run --rm apk
```

The builder installs its own Linux Android SDK/NDK/JDK, generates native sources inside the container, checks the app, builds the release APK, verifies the signature and writes `deliverables/BOOK-MY-TICKETS-docker.apk` plus `BOOK-MY-TICKETS.apk` and SHA256 files. The APK profile allows up to 6 GB of container memory; give Docker about 8 GB when building alongside the running stack. The first run downloads build tools and Gradle dependencies; subsequent builds reuse the image and `android_gradle` Docker volume. It does not run an emulator or Metro on the host.

This checkout's existing development signing key was preserved in the ignored `docker/signing/debug.keystore` and is mounted read-only into the builder. A fresh checkout must restore this key from your private copy before building an upgrade. It is excluded from images. This is a local review APK, using the retained `com.cinepass.demo` application ID; production signing remains a separate release step.

The APK defaults to `http://10.0.2.2:4100` (Android Emulator's host alias). For a physical phone, set EXPO_PUBLIC_API_URL in root `.env` to a reachable PC/LAN API URL before rebuilding; the API port binding must also permit the chosen connection. Docker DNS names such as `api` are for containers, not phones. An APK runs on Android; Docker supplies its build environment and all server services.

## Backup inside Docker

For a coordinated database/file snapshot, briefly stop writers while keeping PostgreSQL running:

```powershell
docker compose stop admin-panel partner-panel api worker
docker compose --profile tools run --rm backup
docker compose up -d --wait
```

Backups appear in `backups/bmt-<UTC timestamp>/` as `database.dump` and `media.tar.gz`. Copy them to a separate encrypted disk/machine, alongside separately secured environment/signing keys. The backup service has read-only media access and no Docker socket mount. Restore into an isolated database first; see [operations](docs/local-setup.md).

SMS/Google login, WhatsApp and Razorpay still need provider configuration in backend/.env. Restart with `docker compose up -d --force-recreate api worker` after changing provider values. This containerization change does not add the unfinished product features listed in [delivery status](docs/delivery-status.md).


Staff login currently uses email/password only. STAFF_MFA_ENABLED=false in backend/.env disables authenticator challenges for admins and partners. To enable MFA later, set it to true and recreate API/worker containers. Existing enrolled secrets are retained; unfinished enrollment is cleared on password-only login.

VPS setup: see deploy/README.md for DNS, generated credentials, HTTPS certificates, Nginx routing and exact Docker deployment commands. On the existing shared-Nginx VPS, use compose.yaml, compose.vps.yaml and compose.shared-proxy.yaml together; see deploy/SHARED-PROXY.md. The customer domain currently provides catalog discovery; booking remains in the mobile app.

Current integration release: [changes and checks](deploy/RELEASE-CHECKLIST.md), [existing VPS update commands](deploy/SHARED-PROXY.md).

Admin push campaigns and the customer inbox: [setup and staged roadmap](deploy/PUSH-NOTIFICATIONS.md). Android alerts require the private Firebase configuration. Temporary customer-only 123456 login: [enable/disable instructions](deploy/TEST-OTP.md).
