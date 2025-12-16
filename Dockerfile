# =========================
# Builder
# =========================
FROM oven/bun:1 AS builder
WORKDIR /app

# Build-time args
ARG VENDURE_SHOP_API_URL
ARG NEXT_PUBLIC_VENDURE_SHOP_API_URL
ARG VENDURE_CHANNEL_TOKEN
ARG NEXT_PUBLIC_SITE_URL
ARG REVALIDATION_SECRET
ARG NEXT_PUBLIC_SITE_NAME
ARG APP_BASE_URL
ARG AUTH0_DOMAIN
ARG AUTH0_CLIENT_ID
ARG AUTH0_CLIENT_SECRET
ARG AUTH0_API_ID
ARG AUTH0_API_IDENTIFIER

# Pasar args a envs para next build
ENV VENDURE_SHOP_API_URL=$VENDURE_SHOP_API_URL
ENV NEXT_PUBLIC_VENDURE_SHOP_API_URL=$NEXT_PUBLIC_VENDURE_SHOP_API_URL
ENV VENDURE_CHANNEL_TOKEN=$VENDURE_CHANNEL_TOKEN
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV REVALIDATION_SECRET=$REVALIDATION_SECRET
ENV NEXT_PUBLIC_SITE_NAME=$NEXT_PUBLIC_SITE_NAME
ENV APP_BASE_URL=$APP_BASE_URL
ENV AUTH0_DOMAIN=$AUTH0_DOMAIN
ENV AUTH0_CLIENT_ID=$AUTH0_CLIENT_ID
ENV AUTH0_CLIENT_SECRET=$AUTH0_CLIENT_SECRET
ENV AUTH0_API_ID=$AUTH0_API_ID
ENV AUTH0_API_IDENTIFIER=$AUTH0_API_IDENTIFIER

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Instalar deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copiar código
COPY . .

# Build Next
RUN bun run next build

# =========================
# Runner
# =========================
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Railway inyecta PORT; no lo fijamos nosotros
# Expose solo para documentación (puede ser cualquiera, usa $PORT en runtime)
EXPOSE 8080

# Copiamos solo el standalone y estáticos
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Importante: usar node sobre el standalone server
CMD ["node", "server.js"]