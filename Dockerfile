# Stage 1: Build
FROM node:24-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Environment variables for build time
# If these are not provided, Next.js might not bake them in correctly for the client side
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOCKET_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL

RUN pnpm build

# Stage 2: Runner
FROM node:24-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Re-enable corepack to use pnpm if needed for scripts, but standalone usually doesn't need it
# However, if we're using "pnpm start" we need it. 
# Next.js standalone usually uses "node server.js"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Next.js standalone output doesn't require node_modules to be copied if configured correctly
# but we need some files for it to work.
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
