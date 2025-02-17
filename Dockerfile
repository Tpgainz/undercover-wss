FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/build ./build

RUN npm install --production

CMD ["node", "build/index.js"]