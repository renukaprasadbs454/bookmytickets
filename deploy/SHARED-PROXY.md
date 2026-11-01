# Existing host Nginx (this VPS)

Use all three Compose files for every server operation. Do not stop the shared host Nginx. BMT's gateway listens only on 127.0.0.1:18089. This supersedes the standalone-certbot port-80 instructions for this server.

```bash
cd /opt/bookmytickets
git pull --ff-only
# Check that this new loopback port is unused before starting:
ss -ltnp 'sport = :18089'
mkdir -p deploy/acme deploy/certificates
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml up -d --build --wait
curl -I -H 'Host: admin.bmt.kwiko.org' http://127.0.0.1:18089
```

Inspect the existing Nginx configuration for duplicate BMT server_name entries before adding the file below (`nginx -T`). The commands assume /etc/nginx/conf.d/*.conf is included inside its http block. If bmt.conf already exists, back it up and review it first. Leave every other site's files alone.

```bash
sudo nginx -T 2>&1 | grep -E 'conf.d|user.bmt|admin.bmt|partner.bmt'
# Run only when no existing BMT site configuration conflicts:
sudo cp deploy/host-nginx.http.conf /etc/nginx/conf.d/bmt.conf
sudo nginx -t && sudo systemctl reload nginx
```

Issue the certificate via the running shared HTTP server; enter a real email when prompted:

```bash
read -r -p 'Certificate contact email: ' BMT_CERT_EMAIL
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml --profile tls run --rm --no-deps certbot certonly --webroot -w /var/www/acme --cert-name bmt --email "$BMT_CERT_EMAIL" --agree-tos --no-eff-email -d user.bmt.kwiko.org -d admin.bmt.kwiko.org -d partner.bmt.kwiko.org
```

Only after issuance succeeds:

```bash
sudo cp deploy/host-nginx.https.conf /etc/nginx/conf.d/bmt.conf
sudo nginx -t && sudo systemctl reload nginx
curl -I https://admin.bmt.kwiko.org
```

For renewal, run regularly from /opt/bookmytickets:

```bash
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml --profile tls run --rm --no-deps certbot renew --webroot -w /var/www/acme
sudo nginx -t && sudo systemctl reload nginx
```

Environment files already exist: do not run init-env again or replace APP_KEY/database credentials. No Docker gateway certificate is required in this topology; TLS terminates at the existing host Nginx. HTTP bootstrap is only for certificate setup; sign into staff panels after HTTPS is enabled. These files have been prepared locally; they have not been applied to the remote VPS.

## Applying the connection fixes to an existing HTTPS deployment

This update forwards sanitized client addresses so API rate limits apply per visitor instead of per gateway. Apply the host Nginx and container changes together. The host template overwrites incoming forwarding headers; the internal gateway is loopback-only and the API has no published port. Keep those boundaries when TRUST_PROXY_HOPS=1.

```bash
cd /opt/bookmytickets
git pull --ff-only
sudo cp /etc/nginx/conf.d/bmt.conf /etc/nginx/conf.d/bmt.conf.backup
# Review your existing BMT customizations before replacing its file:
diff -u /etc/nginx/conf.d/bmt.conf deploy/host-nginx.https.conf || true
sudo cp deploy/host-nginx.https.conf /etc/nginx/conf.d/bmt.conf
sudo nginx -t && sudo systemctl reload nginx
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml up -d --build --wait
# Bind-mounted Nginx config requires reload even when Compose did not recreate it:
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml exec gateway nginx -t
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml exec gateway nginx -s reload
curl -fsS https://user.bmt.kwiko.org/api/auth/capabilities
curl -fsS 'https://user.bmt.kwiko.org/api/public/resources?kind=location'
```

Open admin.bmt.kwiko.org and sign in using the existing private backend/.env ADMIN_EMAIL / ADMIN_PASSWORD. The dashboard setup cards show what is still missing. Publish in this order: cities, categories, policy, verified partner, venue, screen/layout, content/cast, show. Customers see only approved records. These commands do not add demo catalog records or reset database credentials.

The current APK uses https://user.bmt.kwiko.org with /api paths. A separate API subdomain is optional. If adding one later, update Nginx/TLS, BACKEND_PUBLIC_URL, WEB_ORIGINS where needed, Google redirect registration and EXPO_PUBLIC_API_URL before rebuilding the APK. Browser CORS origins must be exact; native Android bearer requests normally have no Origin header.
