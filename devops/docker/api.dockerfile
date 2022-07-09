FROM --platform=linux/amd64 node:current-alpine AS base
# Set working directory
WORKDIR /app

FROM base AS pruner
RUN yarn global add turbo@latest
COPY . .
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS deps
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/yarn.lock ./yarn.lock
COPY --from=pruner /app/turbo.json ./turbo.json
RUN yarn install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
RUN yarn turbo run generate --scope=api --include-dependencies --no-deps
RUN yarn turbo run build --scope=api --include-dependencies --no-deps

FROM base as runner
WORKDIR /app
EXPOSE 3001
ENV PORT=3001
ENV NODE_NO_WARNINGS=1
ENV NODE_ENV=production
ENV ENV=PROD
COPY --from=builder /app/ .
CMD [ "node", "apps/api/dist/src/app.js" ]