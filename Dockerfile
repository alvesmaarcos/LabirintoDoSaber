# Build application
FROM node:20-bullseye-slim AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY . .

RUN pnpm install

RUN pnpm run build

FROM node:20-bullseye-slim AS production

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json /app
COPY --from=builder /app/pnpm-lock.yaml /app
COPY --from=builder /app/dist /app/dist

RUN npm pkg delete scripts.prepare
RUN pnpm install --prod

EXPOSE 8080

CMD ["pnpm", "start"]