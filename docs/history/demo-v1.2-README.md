# BOOK MY TICKETS — offline mobile prototype

Latest update: version 1.2 renames the app to BOOK MY TICKETS, including launcher, splash, in-app branding, shared ticket text and demo QR payload. Install `deliverables/BOOK-MY-TICKETS.apk`. Both light and dark themes are included; use the sun/moon button on Discover or Profile → Appearance. Existing local bookings and favourites are preserved when upgrading.

Phase 1 is a React Native / Expo Android app in `frontend/user-app`. `frontend/admin-panel` and `backend` are reserved for the later React admin and PostgreSQL / Express / Node API. No server is needed for this prototype.

## Run and build

From `frontend/user-app`: `npm install`, then `npx expo start`. To generate Android sources run `npx expo prebuild --platform android`. Build a standalone offline APK with `android/gradlew.bat -p android assembleRelease`. The generated release uses the Android debug signing key for local demo distribution only; configure a private production signing key before store publication.

## Included

Dark cinema UI, splash, city picker, discovery, movie/genre/actor search, language filters, movie detail and cast filmography, sample reviews, saved favourites, date/theatre/show selection, available/booked/selected seats, six-seat limit, optional popcorn, itemized simulated payment, ticket sharing, cancellation, booking history, profile, and local notification inbox. Bookings, city, favourites and preferences persist on device. Existing local bookings occupy seats for the same movie, venue, date and showtime; cancellation releases those seats.

## Demo boundaries

All schedules, venue names/distances, ratings, reviews, prices, availability and upcoming states are illustrative. No real money, login, GPS, push delivery, ads management, analytics, personal-data collection, or live inventory. Events, Plays, Sports and Activities are explicitly upcoming. Payment choices simulate the same local confirmation. Tickets are not valid for admission. Reference screenshots are in `references/` and belong to their respective owners; they are design references, not app assets.

Public category research: https://in.bookmyshow.com/ (Movies, Events, Plays, Sports, Activities). No BookMyShow customer data or reviews were imported. Poster artwork bundled from TMDb image CDN for this private prototype: Interstellar `gEU2QniE6E77NI6lCU6MxlNBvIx`, Dune `d5NXSklXo0qyIYkgV94XAgMIckC`, Inception `oYuLEt3zVCKq57qu2F8dT7NIa6f`, Spider-Verse `8Vt6mWEReuy4Of61Lnj5Xj704m8`. Movie artwork belongs to its owners; replace with licensed assets before public distribution. This app is not endorsed by TMDb or BookMyShow.

## Later phases

PostgreSQL entities: users and consent, cities, venues/screens, seats, movies, cast, languages/genres/formats, shows, seat holds, bookings, payment events, favourites, reviews, promotion placements and notification campaigns. Admin will manage catalog, schedules, inventory, pricing, offers, promotions, review moderation, campaigns and consent-aware reporting. Server-side seat holds and verified payment webhooks must precede real ticket issuance.

Visual reference: the attached CinePass UI/UX concept by Concetto Labs. This is an independently implemented React Native prototype, using its dark/purple visual direction rather than embedded screenshot screens.

Toolchain: Expo SDK 54, React Native 0.81.5, React 19.1, Android SDK 36, Java 17. Run npm test and npm run typecheck from the mobile app folder. The lockfile records the tested dependency set.

## Finished demo APK

Install `deliverables/CinePass-demo.apk` on a 64-bit Android phone (Android 7+). The APK is self-contained and does not require Expo Go, Metro, a backend, or internet access. It is signed with the template demo/debug key and is intended for testing, not Play Store release. Size: about 36.4 MiB. See QA.md for actual validation results and screenshots/ for device captures.
