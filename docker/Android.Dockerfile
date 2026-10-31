# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS mobile-source
WORKDIR /app
ENV CI=1 EXPO_NO_TELEMETRY=1
COPY frontend/user-app/package.json frontend/user-app/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/user-app ./
FROM mobile-source AS mobile-checks
RUN npm run lint && npm run typecheck
CMD ["npx", "expo", "export", "--platform", "android", "--output-dir", "/tmp/mobile-export"]

FROM eclipse-temurin:21-jdk AS jdk
FROM mobile-source AS android
USER root
COPY --from=jdk /opt/java/openjdk /opt/java/openjdk
ENV JAVA_HOME=/opt/java/openjdk ANDROID_HOME=/opt/android-sdk ANDROID_SDK_ROOT=/opt/android-sdk GRADLE_USER_HOME=/gradle-cache
ENV PATH=/opt/java/openjdk/bin:/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools:$PATH
RUN apt-get update && apt-get install -y --no-install-recommends curl unzip git python3 ca-certificates && rm -rf /var/lib/apt/lists/*
ARG ANDROID_TOOLS_VERSION=15859902
ARG ANDROID_TOOLS_SHA256=4e4c464f145a7512b57d088ac6c278c03c9eea610886b35a5e0804e74eedf583
RUN curl -fL --retry 3 https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_TOOLS_VERSION}_latest.zip -o /tmp/tools.zip \
 && echo "${ANDROID_TOOLS_SHA256}  /tmp/tools.zip" | sha256sum -c - \
 && mkdir -p /opt/android-sdk/cmdline-tools \
 && unzip -q /tmp/tools.zip -d /opt/android-sdk/cmdline-tools \
 && mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/latest \
 && rm /tmp/tools.zip \
 && yes | sdkmanager --licenses > /dev/null \
 && sdkmanager 'platform-tools' 'platforms;android-36' 'build-tools;36.0.0' 'ndk;27.1.12297006' 'cmake;3.22.1'
COPY docker/build-apk.sh /usr/local/bin/build-apk
RUN chmod +x /usr/local/bin/build-apk
ENTRYPOINT ["sh", "/usr/local/bin/build-apk"]
