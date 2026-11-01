# BOOK MY TICKETS API

Express/TypeScript and PostgreSQL run through the root Docker Compose stack. The API, worker, migrations, seed and integration checks run in containers. The customer app and both portals use this API; there is no hardcoded catalog.

Public discovery uses `/api/public/resources`, listing details and show inventory. Customer bearer sessions use `/api/auth`, booking `/api/commerce`, favourites, consent, reviews and support. Founder/partner browser sessions use secure production cookies and CSRF protection for mutations. Resource approvals, scoped memberships, private uploads, finance and audit enforce server permissions.

Run `docker compose up -d --build --wait` from the repository root. The migration job automatically runs the idempotent configured founder/partner login seed. Existing accounts retain their credentials. Private provider credentials and account passwords belong in backend/.env; never commit it. Staff MFA is disabled unless explicitly enabled later.

Use the root README for Docker tests/APK builds and deploy/SHARED-PROXY.md for the existing VPS. Run `docker compose exec -T api node scripts/verify-connections.mjs` for local seeded-login and proxy checks. See deploy/RELEASE-CHECKLIST.md and docs/delivery-status.md for tested behavior and remaining scope.
