# Android demo acceptance checks

## Automated
- `npm run typecheck`: app and booking model compile.
- `npm test`: itemized totals, invalid quantities, show-specific seat reservations, and cancellation releasing seats.

## Device checks to perform
- Open offline without Metro or a backend; posters must render.
- Search a movie, genre, and actor; filter by language and check empty results.
- Change city and check venue names update.
- Save a movie, restart, and confirm it remains in the watchlist.
- Open cast filmography and return to the movie.
- Select date / theatre / show; booked seats cannot be selected; zero seats disables Continue; selection caps at six.
- Add/remove popcorn and confirm totals; two seats + popcorn + fee = ₹780.
- Simulate payment; ticket displays the exact movie, city, venue, date, time, seats and total.
- Restart; booking history and QR reference remain.
- Reopen the same show: purchased seats are unavailable. Different date/time retains independent availability.
- Cancel a local booking, verify cancelled status and released seats.
- Upcoming movies save to watchlist instead of starting a booking.
- Events / Plays / Sports / Activities explain the future phase.

A demo QR contains only `CINEPASS-DEMO:<local-reference>` and is not an admission credential. Payments are local simulations.

## Verified on emulator — 28 October 2026

Android API 36, Pixel 8 x86_64, standalone release APK (no Metro server):
- Successful install and launch; no React Native / Android runtime errors observed.
- Home and movie artwork render from bundled assets.
- Favourite saved on details and retained after a forced stop and offline restart.
- Theatre/show selection opens the seat map. Continue is disabled with zero seats.
- D8/D9 selection shows two seats and ₹600.
- Payment summary is ₹630 without popcorn; adding popcorn changes it to ₹780.
- Demo payment creates a ticket with matching movie, venue, showtime, seats, total and QR code.
- Booking history and ticket reopen after offline restart.
- Local cancellation confirmation changes the ticket status to Booking cancelled.
- Emulator Wi-Fi/mobile data restored after the offline test.
- APK Signature Scheme v2 verification passed.

Automated booking tests: 4 passed. TypeScript: passed. Android assembleRelease: passed.

Screenshots are in screenshots/: home.png, details.png, seats.png, payment.png, ticket.png, bookings.png. Other device-check items above remain a checklist, not a claim of exhaustive device coverage. Physical ARM64 devices were not tested; ARM64 and x86_64 native binaries are included.

## Light / dark theme update — v1.1

- Added shared semantic colour palettes for all existing screens, cards, inputs, navigation, sheets, seats, payment states, and tickets.
- Theme switches immediately via Discover's sun/moon button or Profile → Appearance.
- Theme choice is stored separately under cinepass-theme; existing favourites and bookings are preserved.
- Verified upgrade install on Android API 36 emulator, both theme selectors, and light-mode persistence after force-stop/relaunch.
- Completed a light-mode demo booking: D8, ₹300 + ₹30 fee = ₹330; confirmation and QR render correctly.
- Visually inspected light home, seat selection, payment, ticket and profile screenshots. Captures also include movie details, shows, restart and dark-profile state under screenshots/light/.
- Lint, TypeScript, four booking tests, Android release build, and APK signature verification passed.
- Physical ARM64 device testing remains outside this emulator check.

APK: deliverables/CinePass-light-dark.apk (version 1.1.0 / Android version code 2).

## BOOK MY TICKETS rename — v1.2

- Launcher display name, native splash asset, home/splash titles, promotions, notifications, shared ticket text and demo QR payload now use BOOK MY TICKETS.
- Added a new purple ticket launcher icon. New booking references use BMT.
- Android version 1.2.0 / version code 3; both themes retained.
- APK label verified with Android packaging tools; signature verification passed.
- Emulator upgrade install and launch passed, with the saved light theme retained. Visually checked the new home branding; no app runtime errors observed.
- APK: deliverables/BOOK-MY-TICKETS.apk; SHA256 alongside it. Screenshot: screenshots/book-my-tickets/home.png.
- Android application ID and local-storage keys remain compatible with existing installs to preserve saved demo data.
- Lint and TypeScript passed. Booking behavior was unchanged apart from the reference prefix.
