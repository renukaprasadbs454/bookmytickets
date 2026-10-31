# VPS deployment (Ubuntu, Docker only)

Source includes the API, portals, mobile sources and Docker build files. Credentials, signing keys, uploads, backups, APK binaries and local dependencies are intentionally excluded from the public repository.

The user domain currently provides public catalog discovery. Full booking is in the Android app; a complete browser booking client is not implemented.

1. Install Docker Engine with Compose plugin 2.24.4+ using https://docs.docker.com/engine/install/ubuntu/. Point A records for user.bmt.kwiko.org, admin.bmt.kwiko.org and partner.bmt.kwiko.org to the VPS IPv4. Only add AAAA records if IPv6 is configured. Ensure ports 80/443 are available; preserve any existing reverse proxy and coordinate routing instead of replacing it.

```bash
git clone https://github.com/renukaprasadbs454/bookmytickets.git
cd bookmytickets
docker run --rm -v "$PWD:/config" -v "$PWD/deploy/init-env.mjs:/init-env.mjs:ro" node:22-bookworm-slim node /init-env.mjs
chmod 600 .env backend/.env
# View your generated admin credentials privately. Optional partner seed fields can be filled here.
nano backend/.env
mkdir -p storage/public storage/private storage/temporary
docker run --rm -v "$PWD/storage:/storage" alpine:3.20 chown -R 1000:1000 /storage
```

The generated VPS secrets are new, independent credentials. Never copy your local database password into an existing production database or overwrite APP_KEY when restoring encrypted data. The admin seed creates an account only if absent; it does not reset existing passwords. Generated SEED_PARTNER_EMAIL and SEED_PARTNER_PASSWORD create a partner login (leave both blank to disable this seed), with no selling rights until the normal organization approval flow. Customer accounts are created by verified SMS/Google sign-in; fake customer accounts are not seeded.

Obtain the certificate before starting the TLS gateway (replace the email):

```bash
docker compose -f compose.yaml -f compose.vps.yaml --profile tls run --rm --no-deps -p 80:80 certbot certonly --standalone --cert-name bmt --email YOUR_EMAIL --agree-tos --no-eff-email -d user.bmt.kwiko.org -d admin.bmt.kwiko.org -d partner.bmt.kwiko.org
docker compose -f compose.yaml -f compose.vps.yaml up -d --build --wait
docker compose -f compose.yaml -f compose.vps.yaml ps
```

Configure SMS/Google/Razorpay test credentials privately in backend/.env as described in README. Google callback: https://user.bmt.kwiko.org/api/auth/google/callback. Razorpay webhook: https://user.bmt.kwiko.org/api/webhooks/razorpay. Live payments remain unsupported. MFA is currently disabled as requested.

Renew certificates regularly (run weekly from a root cron/system timer in the checkout):

```bash
docker compose -f compose.yaml -f compose.vps.yaml --profile tls run --rm --no-deps certbot renew --webroot -w /var/www/acme
docker compose -f compose.yaml -f compose.vps.yaml exec -T gateway nginx -s reload
```

Updates and backups:

```bash
git pull --ff-only
docker compose -f compose.yaml -f compose.vps.yaml up -d --build --wait
docker compose -f compose.yaml -f compose.vps.yaml logs --tail 100 api worker gateway
# Coordinated backup: stop writers; preserve PostgreSQL.
docker compose -f compose.yaml -f compose.vps.yaml stop gateway api worker
docker compose -f compose.yaml -f compose.vps.yaml --profile tools run --rm backup
docker compose -f compose.yaml -f compose.vps.yaml up -d --wait
```

Keep encrypted off-machine copies of backups, environment files and Android signing key. Never run down -v on the live stack. PostgreSQL and the API have no public published ports in the VPS override; only the gateway exposes 80/443. Firewall access must retain SSH before restricting inbound ports. The development feature/security limitations in docs/delivery-status.md still apply; this is deployable infrastructure, not a production-readiness certification. No VPS was accessed or DNS changed by this preparation.

Build a domain-connected APK using Docker (approximately 8 GB Docker memory recommended):

```bash
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile build apk
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile run --rm apk
```

The generated root environment already sets EXPO_PUBLIC_API_URL=https://user.bmt.kwiko.org. The APK is written to deliverables/. Restore your private docker/signing/debug.keystore first for an upgrade-compatible development build. That key is intentionally absent from Git; production distribution needs your own protected release signing setup.

SMTP email OTP configuration (backend/.env):

```dotenv
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_FROM_EMAIL=tickets@your-verified-domain.com
```

Sender display name is Book My Tickets. Port 465 normally uses SMTP_SECURE=true. Use an address verified by your SMTP provider. Codes are six digits, expire after five minutes, are single-use, and allow five verification attempts. Resends have a one-minute cooldown. OTP values are never returned or stored in plain text. Email OTP signs in customer accounts only; it does not bypass staff passwords. On the VPS recreate services after editing settings:

```bash
docker compose -f compose.yaml -f compose.vps.yaml up -d --build --wait
```

The customer mobile source now includes Continue with email; rebuild the APK to include the new screen. No real SMTP credentials are supplied, so live email delivery is unavailable until configured. SMTP tests use an isolated test server and send no external mail.

CORS: set WEB_ORIGINS to a comma-separated list of exact browser origins (scheme + host + port; no paths). Generated settings include the three HTTPS domains and localhost/127.0.0.1 ports 3000, 5173, 5178, 5179, 8081 and 19006. Add other ports explicitly; there is no unrestricted wildcard. VPS Compose reads WEB_ORIGINS and BACKEND_PUBLIC_URL from root .env; backend/.env controls CORS in the local Docker stack. Native APK requests without Origin are supported, but still require valid bearer authentication on protected endpoints. The APK API URL is EXPO_PUBLIC_API_URL, set before rebuilding. BACKEND_PUBLIC_URL is https://user.bmt.kwiko.org (API under /api); no separate backend domain is needed. Recreate Docker services after environment edits.
