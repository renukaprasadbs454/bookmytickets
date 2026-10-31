# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/admin-panel/package.json frontend/admin-panel/package.json
COPY frontend/partner-panel/package.json frontend/partner-panel/package.json
COPY frontend/portal-shared/package.json frontend/portal-shared/package.json
RUN npm ci --no-audit --no-fund

FROM dependencies AS source
COPY backend backend
COPY frontend/admin-panel frontend/admin-panel
COPY frontend/partner-panel frontend/partner-panel
COPY frontend/portal-shared frontend/portal-shared

FROM source AS checks
RUN npm run typecheck
CMD ["npm", "test"]

FROM source AS api
RUN mkdir -p /app/storage/public /app/storage/private /app/storage/temporary && chown -R node:node /app/storage
WORKDIR /app/backend
USER node
EXPOSE 4100
CMD ["npm", "start"]

FROM source AS web-build
RUN npm run build

FROM nginx:1.28-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
ARG PORTAL=admin-panel
COPY --from=web-build /app/frontend/${PORTAL}/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
