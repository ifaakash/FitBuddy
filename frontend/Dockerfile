FROM node:25.1.0-alpine@sha256:7e467cc5aa91c87e94f93c4608cf234ca24aac3ec941f7f3db207367ccccdd11 AS builder
WORKDIR /build

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run dev


FROM node:25.1.0-alpine@sha256:7e467cc5aa91c87e94f93c4608cf234ca24aac3ec941f7f3db207367ccccdd11  AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./

# ENV NODE_ENV=production

RUN npm ci

EXPOSE 3000
CMD ["npm", "start"]
