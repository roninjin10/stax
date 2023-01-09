FROM node:18.12.1-bullseye

# Add the Foundry CLI to the PATH
RUN curl -L https://foundry.paradigm.xyz | bash
ENV PATH "$PATH:/root/.foundry/bin"
RUN foundryup \
  && forge --version \
  && anvil --version \
  && cast --version

WORKDIR /monorepo

# Install pnpm
RUN npm i pnpm@7.18.2 --global

ENV NX_DAEMON=false

# Install dependencies and build the project
COPY ./ /monorepo
RUN pnpm i && pnpm build

EXPOSE 3000 7300 8545

CMD ["pnpm", "serve"]
