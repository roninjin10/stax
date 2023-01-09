# syntax=docker/dockerfile:1

# This is a multi-stage Dockerfile. It is used to build the project and then
# run it in a separate stage. This is done to reduce the size of the final
# image. The first stage is called "builder" and the second stage is called
# "runner". The "runner" stage is based on the "node:alpine" image and foundry image, which is
# much smaller than the "node:bullseye" image.
FROM node:18.12.1-bullseye as builder

# Add the Foundry CLI to the PATH and do a quick test to make sure it's installed to path
RUN curl -L https://foundry.paradigm.xyz | bash
ENV PATH "$PATH:/root/.foundry/bin"
RUN foundryup \
  && forge --version \
  && anvil --version \
  && cast --version

WORKDIR /monorepo

RUN npm i pnpm@7.18.2 --global

# This is a workaround for a PNPM / NX bug
ENV NX_DAEMON=false

COPY ./ /monorepo
RUN pnpm i && pnpm build

EXPOSE $EXAMPLE_UI_PORT
EXPOSE $EXAMPLE_SERVER_PORT
EXPOSE $ANVIL_PORT

CMD ["pnpm", "serve"]

# This image is used to run the UI
FROM node:18.12.1-alpine3.16 as example-ui-runner

WORKDIR /monorepo

RUN npm i serve@14.1.2 --global

COPY --from=builder /monorepo/packages/example-ui/dist ./packages/example-ui/dist

EXPOSE $EXAMPLE_UI_PORT

CMD ["serve", "-s", "-l", "tcp://0.0.0.0:${PORT}", "packages/example-ui/dist"]

# This image is used to run the server
FROM node:18.12.1-alpine3.16 as example-server-runner

WORKDIR /monorepo

COPY --from=builder /monorepo/packages/example-server/dist/run.bundle.js ./packages/example-server/dist/run.bundle.js

EXPOSE $EXAMPLE_SERVER_PORT

CMD ["node", "packages/example-server/dist/run.bundle.js"]

# This image is used to run the contracts
# Since it's only used in dev we use entire builder image
FROM builder as contracts-runner

EXPOSE $ANVIL_PORT

CMD ["forge" "script" "packages/contracts/script/AppEntrypoint.s.sol:Deploy" "--rpc-url" "http://anvil:8545" "--broadcast" "-vvvv"]
