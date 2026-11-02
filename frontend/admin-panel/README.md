# Founder control panel

React/Vite portal served by Nginx in Docker on http://127.0.0.1:5178 for local development. Start through root `docker compose up -d --build --wait`. Shared UI lives in frontend/portal-shared. The partner build uses the same contracts with audience/role restrictions enforced by the API.

Sign in with private backend/.env ADMIN_EMAIL / ADMIN_PASSWORD. The overview setup cards guide publication of approved cities, categories, policies, partners, venues, layouts, content and shows. Support responses are edited in the Support resource editor and are visible in the customer app. Provider setup lists SMTP, SMS/WhatsApp, Google and payment configuration fields without exposing secret values.

Use deploy/SHARED-PROXY.md for admin.bmt.kwiko.org deployment. No browser localStorage business database or demo catalog is used.

Founder and marketing roles can open **Push campaigns** to preview opt-in audiences, save drafts and queue/cancel inbox and Android FCM campaigns. Firebase setup and limits are documented in deploy/PUSH-NOTIFICATIONS.md.
