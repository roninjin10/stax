FROM node:18.12.1-alpine3.16

WORKDIR /app

RUN npm i pnpm@7.18.2 --global

COPY ./package.json /app
COPY ./pnpm-lock.yaml /app
COPY ./.nvmrc /app
COPY ./tsconfig.json /app
COPY ./babel.config.js /app

# don't run postinstall until after we copy src in 
RUN pnpm i --frozen-lockfile --ignore-scripts

COPY ./src/ /app/src/

RUN pnpm postinstall

RUN pnpm build

ENV PORT 7300
ENV HOST '0.0.0.0'

EXPOSE $PORT

CMD ["pnpm", "serve"]