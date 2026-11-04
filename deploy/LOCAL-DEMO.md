# Local catalog review

Start the Docker stack:
```powershell
docker compose -f compose.yaml -f compose.local.yaml up -d --build --wait
docker compose -f compose.yaml -f compose.local.yaml exec -T -e ALLOW_DEMO_SEED=true api npm run seed:demo
```

Set `DEMO_PARTNER_PASSWORD` (at least 12 characters) in private `backend/.env` before starting. This explicit seed refuses production mode, uses stable IDs, retains existing passwords and edited records, and does not run during deployment. It creates three demo organizations with owner memberships, eight Indian cities, nine categories, 24 venues, 24 layouts, 11 experiences, 88 future shows with inventory, eight popcorn add-ons, three promotions, one policy and one coupon. Dates are relative to the first seed run; reruns preserve existing showtimes. No fabricated bookings, reviews, bank accounts or identity documents are created. Approved demo organizations are fixtures, not verified real businesses.

## Partner logins

Use http://localhost:5179 with the password in `DEMO_PARTNER_PASSWORD`:

| Business | Owner | Login |
| --- | --- | --- |
| Aurora Cinemas | Aarav Mehta | aurora.partner@example.test |
| Spotlight Live | Meera Rao | spotlight.partner@example.test |
| Canvas Experiences | Kabir Shah | canvas.partner@example.test |

The founder can inspect owner names, login emails, business contacts and capabilities in **Partners & approvals**, and edit all seeded catalog records through the normal resource controls. Passwords and password hashes are never returned by this directory. Partner users see their own organizations and inventory; approved public catalog records remain discoverable.

## Manage the storefront

Use **Cities**, **Categories**, **Movies & experiences**, **Venues**, **Shows & inventory**, **Food & add-ons**, **Coupons** and **Banners & promotions** in admin. Upload replacement files in **Media library**, choose their IDs in the editor, then approve changes. Promotions support placement, target, city, dates and priority. Editing an approved resource returns it to draft until approved again. Published shows and used layouts are immutable; create replacements. Active approved promotions appear in priority order, including global promotions while filtering by city.

Customer web: http://localhost:5180. Customer test OTP: request a code first, then use `123456`. The customer app has no embedded catalog fixture. All listings, images, prices, venues and offers come from the local API. Venue rental category opens venue discovery and support enquiries; no automated rental payment flow is implied. Payment still requires a configured provider.

## Image sources

Movie poster sample images are fetched from TMDB image delivery for Interstellar, Dune: Part Two, Inception and The Dark Knight. Event/venue photography is fetched from Unsplash. Exact source URLs are recorded in `backend/scripts/seed-demo.ts`. The seeder converts them to WebP and stores them on server disk with media records, so browsers do not hotlink external files. These are local review assets; replace with partner-provided licensed artwork before publishing a real catalog. Film and event listings are sample availability, not real ticket offers or claimed affiliations.
