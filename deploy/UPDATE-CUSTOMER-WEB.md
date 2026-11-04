# Deploy the full customer web app

The VPS customer service previously mounted the legacy `frontend/customer-web` static landing page. It now builds the React Native/Expo web app using `docker/UserWeb.Dockerfile`, serves it on internal port 8080 and routes both Nginx gateway configurations to that port. Browser API and media URLs default to the current origin; APK builds retain their configured backend URL. No localhost address is baked into the default web build.

Run on the existing shared-proxy VPS:

```bash
cd /opt/bookmytickets
mkdir -p backups
# Preserve the manually uploaded seed file before Git starts tracking it.
if [ -f backend/scripts/seed-demo.ts ] && ! git ls-files --error-unmatch backend/scripts/seed-demo.ts >/dev/null 2>&1; then
  mv backend/scripts/seed-demo.ts "backups/seed-demo-before-update-$(date +%Y%m%d-%H%M%S).ts"
fi
git pull --ff-only && \
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml up -d --build --wait && \
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml up -d --no-deps --force-recreate gateway

docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml exec -T gateway nginx -t
curl -fsS -H 'Host: user.bmt.kwiko.org' http://127.0.0.1:18089/healthz
curl -fsS https://user.bmt.kwiko.org/api/auth/capabilities
```

If Git reports modified tracked files, preserve/review those changes before continuing; do not reset the checkout. Existing private `.env` values, storage files and PostgreSQL volume remain in place. No reseed, volume removal or host Nginx replacement is needed. After deployment hard-refresh https://user.bmt.kwiko.org. The homepage should show the app navigation, movie posters, promotion rails and filter popup.
