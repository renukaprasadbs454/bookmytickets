FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY frontend/user-app/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/user-app ./
ARG EXPO_PUBLIC_API_URL=
ENV EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL}
RUN npm run lint && npm run typecheck && npx expo export --platform web
FROM nginx:1.28-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
