FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .
RUN npm build

FROM node:16-alpine as production
WORKDIR /app

COPY --from=builder /app/package*.json ./

RUN npm --prod

COPY --from=builder /app/dist ./dist/

CMD ["pm2 start", "./dist/main.js"]
