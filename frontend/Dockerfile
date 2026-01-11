# No SHA for images, as it might lead to architecture dependencies
# Build might fail due to incompatible architecture
FROM node:25.1.0-alpine AS builder
WORKDIR /build

COPY package*.json ./

RUN npm ci \
    && npm config set fund false \
    && npm config set audit false

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .
RUN npm run build

FROM node:25.1.0-alpine AS runner
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
