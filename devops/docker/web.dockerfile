FROM --platform=linux/amd64 node:current-alpine AS base
RUN apk update
WORKDIR /app
# CDN upload keys
ARG AZURE_STORAGE_ACCOUNT
ARG AZURE_STORAGE_ACCOUNT_KEY
# build args
ARG NEXT_PUBLIC_ALGOLIA_API_KEY
ARG NEXT_PUBLIC_ALGOLIA_APP_ID
ARG NEXT_PUBLIC_ALGOLIA_INDEX_NAME
ARG NEXT_PUBLIC_API_ENDPOINT
ARG NEXT_PUBLIC_CDN_URL
ARG NEXT_PUBLIC_DEFAULT_BLOG_ID
ARG NEXT_PUBLIC_DEFAULT_BLOG_NAME
ARG NEXT_PUBLIC_DEFAULT_BLOG_SLOGAN
ARG NEXT_PUBLIC_DEFAULT_CLIENT_ID
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_SUPPORTED_OAUTH_PROVIDERS

FROM base AS pruner
RUN yarn global add turbo@latest
COPY . .
RUN turbo prune --scope=web --docker

FROM base AS deps
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
RUN yarn install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
RUN yarn generate:ci
RUN ENV=DOCKER \
    NEXT_PUBLIC_ALGOLIA_API_KEY=${NEXT_PUBLIC_ALGOLIA_API_KEY} \
    NEXT_PUBLIC_ALGOLIA_APP_ID=${NEXT_PUBLIC_ALGOLIA_APP_ID} \
    NEXT_PUBLIC_ALGOLIA_INDEX_NAME=${NEXT_PUBLIC_ALGOLIA_INDEX_NAME} \
    NEXT_PUBLIC_API_ENDPOINT=${NEXT_PUBLIC_API_ENDPOINT} \
    NEXT_PUBLIC_CDN_URL=${NEXT_PUBLIC_CDN_URL} \
    NEXT_PUBLIC_DEFAULT_BLOG_ID=${NEXT_PUBLIC_DEFAULT_BLOG_ID} \
    NEXT_PUBLIC_DEFAULT_BLOG_NAME=${NEXT_PUBLIC_DEFAULT_BLOG_NAME} \
    NEXT_PUBLIC_DEFAULT_BLOG_SLOGAN=${NEXT_PUBLIC_DEFAULT_BLOG_SLOGAN} \
    NEXT_PUBLIC_DEFAULT_CLIENT_ID=${NEXT_PUBLIC_DEFAULT_CLIENT_ID} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_SUPPORTED_OAUTH_PROVIDERS=${NEXT_PUBLIC_SUPPORTED_OAUTH_PROVIDERS} \
    yarn turbo run build --scope=web --include-dependencies --no-deps

# upload nextjs static assets to CDN
RUN export AZURE_STORAGE_ACCOUNT=${AZURE_STORAGE_ACCOUNT} export AZURE_STORAGE_ACCOUNT_KEY=${AZURE_STORAGE_ACCOUNT_KEY} \
    yarn cdn:clean
RUN export AZURE_STORAGE_ACCOUNT=${AZURE_STORAGE_ACCOUNT} export AZURE_STORAGE_ACCOUNT_KEY=${AZURE_STORAGE_ACCOUNT_KEY} \
    yarn cdn:upload

FROM base AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/public/robots.txt ./apps/web/public/robots.txt
COPY --from=builder /app/apps/web/public/sitemap.xml ./apps/web/public/sitemap.xml
COPY --from=builder /app/apps/web/public/sitemap-0.xml ./apps/web/public/sitemap-0.xml
COPY --from=builder /app/apps/web/public/favicon.ico ./apps/web/public/favicon.ico

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "apps/web/server.js"]