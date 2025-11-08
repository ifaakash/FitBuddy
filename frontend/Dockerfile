FROM node:25.1.0-alpine@sha256:7e467cc5aa91c87e94f93c4608cf234ca24aac3ec941f7f3db207367ccccdd11 AS builder
WORKDIR /build

COPY package*.json ./

RUN npm ci \
    && npm config set fund false \
    && npm config set audit false

COPY . .
RUN npm run build


FROM node:25.1.0-alpine@sha256:7e467cc5aa91c87e94f93c4608cf234ca24aac3ec941f7f3db207367ccccdd11  AS runner
WORKDIR /app

COPY --from=builder /build/public/ ./public
COPY --from=builder /build/.next/ ./.next
COPY --from=builder /build/package*.json ./
COPY --from=builder /build/next.config.ts ./

# ENV NODE_ENV=production

RUN npm install typescript --save \
    && npm install --omit=dev \
    && npm cache clean --force

EXPOSE 3000
CMD ["npm", "start"]
