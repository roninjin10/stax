FROM node:18.12.1-alpine3.16

WORKDIR /app

RUN npm i pnpm@7.18.2 --global

COPY . .

RUN pnpm i --frozen-lockfile

RUN pnpm build

EXPOSE $PORT

CMD ["pnpm", "serve"]