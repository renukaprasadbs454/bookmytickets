# Docker verification — 30 October 2026

The runtime and build workflow is now Docker-only. No host application server, npm build, Gradle build, Metro server or Android emulator was launched for this change.

Verified inside Docker:

- API, worker, PostgreSQL, founder Nginx and partner Nginx containers report healthy.
- Migrations completed successfully against the retained PostgreSQL volume.
- PostgreSQL has no host-published port; only API 4100 and portals 5178/5179 are published on loopback.
- 16 integration checks passed against a separate test PostgreSQL container on an isolated network. The disposable test service was stopped afterward.
- Both portal production builds and platform TypeScript checks passed in Linux build containers.
- Mobile lint, TypeScript and Android JS export passed inside the mobile check container (1312 modules).
- Both Nginx portal proxies return the real API capabilities and empty public catalog.
- The main database still contains zero users, catalog records, orders and uploaded files.
- The non-root API user can write/read/delete a temporary file in the persistent media mount.
- Private backend environment files are excluded from the application image.
- The Docker backup service exported a custom PostgreSQL dump and a media archive to backups/.
- Existing unrelated fitnerve containers remain running on ports 3000 and 5050.

The initial Windows dependency lock omitted Linux sharp binaries. Matching optional Linux packages were added and verified through API startup, upload integration tests and the full passing test suite.

Android APK compilation runs through the optional apk profile. See README for the build commands and artifact paths. External provider flows still require credentials; product-feature limitations remain documented in docs/delivery-status.md.

Final Android verification:

- Docker APK build succeeded (388 tasks, 45m55s for the initial cold Gradle build).
- Version 2.0.0 / code 5, package com.cinepass.demo, target SDK 36.
- ARM64 and x86-64 native libraries and the embedded JavaScript bundle are present.
- Signature verified against the existing development certificate (SHA256 fac61745dc0903786fb9ede62a962b399f7348f0bb6f899b8332667591033b9c).
- Docker-built APK SHA256: 65abf195967c8571ea3542fba57c0bf99427ed6d49fcca71bae894a2cfc3bb55.
- Artifacts: deliverables/BOOK-MY-TICKETS-docker.apk and BOOK-MY-TICKETS.apk (44,061,663 bytes).
- No new emulator/device installation was performed for this Docker-only change. Earlier emulator evidence in historical notes applies to the preceding build.
