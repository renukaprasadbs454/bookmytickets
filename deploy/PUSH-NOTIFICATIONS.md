# Admin push campaigns — stage one

Founder/marketing staff use **Push campaigns** to save drafts, preview the eligible audience, schedule or queue a campaign, and cancel pending sends. Other staff and partners cannot send campaigns. Titles/messages are plain text. Destinations are restricted to discovery, bookings or an approved content/venue record.

Customers opt in through Profile → Notifications & announcements. Inbox messages work without Firebase. Android push additionally needs OS notification permission and device registration. Opt-out is checked again before each device send. Signing out attempts to unregister that installation; an offline phone cannot revoke a server token until it reconnects. Messages are marketing announcements, never sensitive booking or payment details.

Audiences: all opted-in customers, selected city (registered devices), customers who saved an experience, or confirmed customers for an experience. Audiences are selected when a campaign starts; preview counts can change. Maximum 10,000 customers per campaign. Campaigns are additive and immutable after creation; cancel and create a corrected draft when needed.

## Firebase setup (operator action)

1. Create a Firebase project in the Firebase console. Add an Android app with package **com.cinepass.demo**, matching the existing APK application ID.
2. Download that Android app's **google-services.json**. Save it privately as `docker/secrets/google-services.json` in this checkout. This is the client configuration; it is not the server key.
3. Enable the Firebase Cloud Messaging HTTP v1 API for that Google Cloud project.
4. Create a service account with the Firebase Cloud Messaging API Admin role (or a custom role limited to message creation). Create its JSON key and save it privately as `docker/secrets/firebase-service-account.json`. Never put the server key in the APK, frontend, Git or public storage. Restrict host file access; the non-root API/worker must be able to read the mounted file. With the standard Node image UID 1000 on Linux, use `chown 1000:1000 docker/secrets/firebase-service-account.json` and `chmod 400 docker/secrets/firebase-service-account.json`.
5. Add these fields to private `backend/.env`:

```dotenv
FCM_ENABLED=true
FCM_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
FCM_SERVICE_ACCOUNT_FILE=/run/secrets/firebase-service-account.json
```

Do not regenerate APP_KEY, database passwords or existing login passwords. The project ID must match both Firebase files. FCM is disabled by default. Server OAuth access tokens are short lived and obtained from the mounted service-account file; no static bearer token is exposed to customers.

Firebase's official [Android setup](https://firebase.google.com/docs/cloud-messaging/android/get-started) and [HTTP v1 authentication](https://firebase.google.com/docs/cloud-messaging/send/v1-api) describe these provider requirements.

## Docker deployment

Without Firebase, the normal Compose stack applies migration 006 and supports inbox campaigns. After adding the private Firebase files:

```bash
cd /opt/bookmytickets
git pull --ff-only
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml -f compose.push.yaml up -d --build --wait
```

Include compose.push.yaml in later API/worker recreations so the key stays mounted. That override is optional and intentionally fails if the key file is missing. Do not include it until the real file exists.

Build the customer APK with the Android client configuration, using Docker:

```powershell
docker compose -f compose.yaml -f compose.mobile.yaml --profile mobile build apk
docker compose -f compose.yaml -f compose.mobile.yaml -f compose.push.mobile.yaml --profile mobile run --rm --no-deps apk
```

Set root .env EXPO_PUBLIC_API_URL=https://user.bmt.kwiko.org for the public APK. The client JSON is mounted only at build time; Expo copies the required Android resources during prebuild. Restore the existing private signing key when building an upgrade. Builds without the Firebase override still compile and support the inbox, but cannot register for real Android alerts.

## Verify on a physical Android phone

Install the configured APK, sign in, open Notifications & announcements, opt into announcements, and enable Android alerts. Allow the OS permission. Check that the device registration succeeds. Create a small campaign for the intended opted-in test audience in the founder panel, queue it, and verify inbox creation, the phone alert and tap destination. Repeat with the app foregrounded and backgrounded. Test opt-out and sign-out. Do not broadcast to real customers as a setup test.

Delivery states distinguish **accepted by Firebase** from actual device display. Queued sends retry explicit throttling/server rejection up to three attempts. Unknown network/worker outcomes are not automatically resent to avoid accidental duplicates. Invalid/unregistered tokens are disabled. Multiple devices can receive one customer's message; the inbox contains one record per customer/campaign. Cancelling cannot recall in-flight or accepted notifications, or remove already-created inbox items.

## Later stages

1. Admin campaigns, consent, Android push, customer inbox (this stage).
2. Gift-card balances and loyalty, including purchase/redemption/reversal rules.
3. Ticket transfer/resale, with verified recipients and atomic admission-token replacement.
4. Offline scanning and conflict reconciliation.
5. Tax invoices/credit notes with operator-confirmed issuer and tax configuration.
6. Streaming with licensed content, entitlements, media delivery and playback protection.

Stages 2–6 remain planned. They are not represented as working product controls in this release.
