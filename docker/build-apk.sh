#!/bin/sh
set -eu
export CI=1 NODE_ENV=production
npm run lint
npm run typecheck
npx expo prebuild --platform android --no-install
# Reuse this checkout's existing development signing identity for upgrade compatibility.
if [ -f /signing/debug.keystore ]; then cp /signing/debug.keystore android/app/debug.keystore; fi
cd android
sh gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a,x86_64 --max-workers=2 --no-daemon --console=plain
apk=app/build/outputs/apk/release/app-release.apk
"$ANDROID_HOME/build-tools/36.0.0/apksigner" verify --print-certs "$apk"
mkdir -p /output
cp "$apk" /output/BOOK-MY-TICKETS-docker.apk
sha256sum /output/BOOK-MY-TICKETS-docker.apk > /output/BOOK-MY-TICKETS-docker.apk.sha256
cp "$apk" /output/BOOK-MY-TICKETS.apk
sha256sum /output/BOOK-MY-TICKETS.apk > /output/BOOK-MY-TICKETS.apk.sha256
printf '\nAPK saved to deliverables/BOOK-MY-TICKETS-docker.apk\n'
