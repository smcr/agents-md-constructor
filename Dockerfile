FROM node:22-bookworm-slim AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:22-bookworm-slim AS backend
WORKDIR /backend
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY backend/package.json backend/package-lock.json ./
COPY backend/prisma ./prisma
RUN npm ci
COPY backend/ ./
RUN npx prisma generate

FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=backend /backend ./backend
COPY --from=frontend /frontend/dist ./frontend/dist
WORKDIR /app/backend
ENV PORT=8080
ENV FRONTEND_DIST=/app/frontend/dist
EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/index.ts"]
