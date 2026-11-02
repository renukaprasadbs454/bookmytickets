# Temporary customer OTP login

When CUSTOMER_OTP_TEST_MODE=true, customer email/SMS requests create a five-minute challenge and accept **123456**. No email or SMS is sent for eligible test contacts. The server issues a normal authenticated customer session, marked as a test session; the frontend does not fabricate a login. Test sessions and pending test codes stop working when the flag is disabled or the contact is removed from the optional test allowlist.

Staff and password-based partner accounts continue using email/password and cannot use this customer test bypass. Use a separate customer email or phone when testing the mobile app. The app must request a code first; reusing a consumed challenge is rejected. Resend cooldowns and attempt limits still apply.

The private local backend/.env has test mode enabled as requested. The shared example configuration defaults to false. The remote VPS requires the following operator update; local changes do not alter its environment.

## Enable on the existing VPS

```bash
cd /opt/bookmytickets
git pull --ff-only
# Change only the test-mode field; preserve database, encryption and staff credentials.
sed -i '/^CUSTOMER_OTP_TEST_MODE=/d' backend/.env
printf '\nCUSTOMER_OTP_TEST_MODE=true\n' >> backend/.env
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml up -d --build --wait
curl -fsS https://user.bmt.kwiko.org/api/auth/capabilities
```

The response must contain `"customerOtpTestMode":true`, `"emailOtp":true` and `"smsOtp":true`. If the field is absent, the API still runs an older image. If false, verify the flag in the server's backend/.env and recreate the API. If Firebase is configured later, retain compose.push.yaml in the command as well.

In the app, enter a customer email or an E.164 phone number such as your own +91 number, request a code, and enter **123456**. The new APK shows a test-mode notice and pre-fills the code after a test request. Earlier API-connected APKs can enter the same code manually after the server update.

## Optional restriction to named testers

Set this in the private server environment (replace examples with your actual test contacts):

```dotenv
CUSTOMER_OTP_TEST_CONTACTS=tester@example.com,+919876543210
```

Only those contacts use the fixed test code. An empty value enables test login for all customer contacts, so use the allowlist when the server contains real customer accounts. Contacts outside the list require the configured real provider.

## Disable after testing

```bash
cd /opt/bookmytickets
sed -i 's/^CUSTOMER_OTP_TEST_MODE=.*/CUSTOMER_OTP_TEST_MODE=false/' backend/.env
docker compose -f compose.yaml -f compose.vps.yaml -f compose.shared-proxy.yaml up -d --force-recreate --wait api worker
```

Existing test sessions are rejected once the API reloads. Configure SMTP/Twilio before expecting real codes; disabling this flag does not repair missing or rejected provider credentials. Real OTP generation and delivery remain unchanged when test mode is off.
