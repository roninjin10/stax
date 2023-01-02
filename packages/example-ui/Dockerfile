FROM node:18.12.1-alpine3.16

WORKDIR /app

COPY ./package.json /app
COPY ./pnpm-lock.yaml /app
COPY ./pnpm-workspace.yaml /app
COPY ./.nvmrc /app
COPY ./nx.json /app
COPY ./foundry.toml /app
COPY ./tsconfig.json /app
COPY ./.gitmodules /app

# copy package.json from all packages
COPY ./packages /app
RUN find packages \! -name "package.json" -mindepth 2 -maxdepth 2 -print | xargs rm -rf

FROM node:18.12.1-alpine3.16

WORKDIR /app

RUN apk --no-cache add curl jq python3 ca-certificates git make gcc musl-dev linux-headers bash build-base

# Step 5: Copy files from the first build stage.
COPY --from=0 /app .

RUN npm i pnpm@7.18.2 --global
RUN pnpm i --frozen-lockfile --ignore-scripts

COPY ./ /app

RUN pnpm nx build @stax/example-ui
# server build needs to run after client build because the client build using Vite
# removes the dist/ folder before compiling its code

EXPOSE 3000

CMD ["pnpm", "nx", "serve", "@stax/example-ui"]