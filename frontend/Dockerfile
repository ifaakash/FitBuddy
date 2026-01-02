# No SHA for images, as it might lead to architecture dependencies
# Build might fail due to incompatible architecture

FROM node:25.1.0-alpine as baseimage

FROM baseimage AS builder
WORKDIR /build

COPY package*.json ./

RUN npm ci

COPY . .

# Set build-time arguments
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

FROM baseimage AS runner
WORKDIR /app

ENV NODE_ENV=production

# RUN groupadd --system --gid 1001 nodejs
# RUN useradd --system --uid 1001 nextjs
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
USER nextjs

# Copy necessary assets from the builder stage
COPY --from=builder /build/public ./public

# Copy standalone output and static assets
COPY --from=builder --chown=nextjs:nodejs /build/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /build/.next/static ./.next/static

USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# The command to start the app
CMD ["node", "server.js"]
