FROM oven/bun:1 AS base

WORKDIR /app

COPY package.json bun.lock* ./

RUN bun install

COPY . .

RUN cd src/config && bunx prisma generate

EXPOSE 3000

CMD ["bun", "run", "src/server.ts"]