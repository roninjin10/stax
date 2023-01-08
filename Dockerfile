FROM node:18.12.1-bullseye

WORKDIR /app

RUN curl -L https://foundry.paradigm.xyz | bash

ENV PATH "$PATH:/root/.foundry/bin"
RUN foundryup \
  && forge --version \
  && anvil --version \
  && cast --version

ENV NX_DAEMON=false

RUN npm i pnpm@7.18.2 --global

COPY ./ /app

RUN pnpm i && pnpm build

ENV HOST '0.0.0.0'

EXPOSE 3000
EXPOSE 7300
EXPOSE 8545

CMD ["pnpm", "serve"]