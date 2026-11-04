# Actor profiles and staged booking upgrade

## Existing VPS update

```bash
cd /opt/bookmytickets
mkdir -p backups
docker compose exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB"' > "backups/before-booking-upgrade-$(date +%Y%m%d-%H%M%S).sql"
git pull --ff-only && \
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml up -d --build --wait
```

Migration 008 adds hold pricing snapshots. Existing PostgreSQL, uploads, private credentials, orders and seat inventory remain in place. Do not remove volumes or reseed the base catalog. No host Nginx changes are required. The full customer web deployment from the preceding update must already be present.

To enrich the existing eight **demo** artists with credited portraits, factual birth dates, birthplaces, short biographies and sourced movie release dates:

```bash
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml run --rm --no-deps -e NODE_ENV=development -e ALLOW_DEMO_SEED=true api npm run seed:profiles
```

This temporary container flag permits an explicit demo import; running production services stay in production mode. The script only targets stable demo catalog IDs. It preserves existing uploaded portraits, entered birth dates and edited biographies, and skips concurrent edits. Repeat runs are safe. Sources are the public Wikipedia summary API, Wikidata facts and Wikimedia Commons metadata; source links and photo creator/license credits are retained. Portraits are optimized to WebP on local server disk. Original image licenses continue to apply. Release date is India-specific where a sourced Indian date is available, otherwise a labelled original United States release. No reviews or bookings are fabricated.

Refresh the web app after deployment. The APK remains deferred and needs a future Docker rebuild to receive the new native screens.

## Founder and partner controls

- **Actors & artists:** biography, portrait, profession, birth date (age is calculated), birthplace, nationality, known-for text, website and attribution/source fields. Partners create and manage their own profiles; founder approval publishes them. Other partners can reuse approved profiles without changing their ownership. Unavailable profiles do not appear in public casts.
- **Movies & experiences:** release date/region/source and searchable existing artist selection. Approved linked movies/events automatically populate each artist's filmography.
- **Reviews:** verified-attendee reviews retain moderation; owning partner owner/manager or authorized staff can add a response using Reply. Partners cannot edit another business's replies or customer rating.
- **Screens & layouts:** screen position, seat columns, aisles, custom section names, seat types (standard, premium, recliner, lower, upper balcony), extra legroom, blocked and accessible seats. Apply section/type/legroom to a whole row. Create a new layout version for layouts used by published shows. Existing booked layouts are not silently changed.
- **Shows & inventory:** section prices remain in paise and must match the layout section labels. General admission uses capacity tiers.
- **Fees & booking policies:** convenience fee is paise per order; GST on this fee is configurable in basis points (100 = 1%). It defaults to **0** until your rate is confirmed. Ticket prices remain tax-inclusive as entered and add-ons are priced as entered. Prefer creating/approving a replacement policy, which archives the previous one atomically. Held bills retain their fee and GST rate.

## Customer flow

Listing/artist profiles → Book tickets → horizontal date calendar and venue showtimes → ticket quantity → seat/zone selection → add-ons → bill with available offers, discount, convenience fee, GST and total → configured payment checkout. Offers and add-ons are validated/priced by the backend. Inventory is held after seat selection; changing seats releases the old hold. Expired holds cannot be paid. Billing can be reviewed without a configured gateway; issuing tickets still requires verified provider payment.

GPS now chooses the nearest supported city within 100 km of its configured centre, persists that city and refreshes discovery. Location is requested only on user action. HTTPS/localhost and browser/device permission are required. Denied/unavailable/timed-out location has a visible explanation and manual city fallback. This flow stores the selected city ID, not precise coordinates in customer account records.

## Verification

Docker backend/portal TypeScript, customer lint/typecheck/web export; 51 isolated backend tests; browser journeys for actor/filmography, date and venue selection, quantity enforcement, reserved/general admission, add-ons, offers, server bill, hold release, admin/partner actor editors and artist selection, layout controls, simulated GPS success and denied-permission fallback. No physical-device GPS or new APK validation was performed.
