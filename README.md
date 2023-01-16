<a href="https://twitter.com/fucory">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40fucory&style=social&url=https%3A%2F%2Ftwitter.com%2Ffucory" />
</a>
<a href="https://gitmoji.dev">
  <img
    src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square"
    alt="Gitmoji"
  />
</a>

# Stax • [![CI](https://github.com/roninjin10/stax/actions/workflows/tests.yml/badge.svg)](https://github.com/roninjin10/stax/actions/workflows/tests.yml)

Stax is a collection of open source libraries and experimental evm based packages by roninjin10

## packages/\*

All apps and packages are in packages folder

### packages/contracts

All smart contracts are here

### packages/e2e

E2e tests with playwright (WIP)

### packages/example-server

The fastify/trpc based server of an example app being built to use all packages

### packages/example-ui

The ui of an example app being built to use all packages

### packages/typesafe-env

A utility for typeguarding process.env

### packages/typesafe-growthbook

A typesafe wrapper around growthbook

## Future packages

The ultimate goal of this repo is to improve developers lives building Dapps. These are experimental evm packages that are WIP.

Note: you won't see these in packages until they are out of the experimentation/exploratory phase of development

### packages/ts-sol

A node library for interacting with evm based chains using the native solidity platform

### packages/ts-sol-react

A wrapper around ts-solidity based on wagmi and @roninjin10/ts-solidity

### packages/ts-sol-plugin

A typescript plugin for transforming solidity imports

### packages/ts-sol-vite-plugin

A rollup/vite plugin for consuming typescript modules

### packages/ts-sol-webpack-plugin

A simple webpack plugin for consuming typescript modules

### packages/ts-sol-server

A solidity based way of building and consuming trustless blockchain based indexers deployed as app chains

## Other

### .github

Contains github actions for ci/cd

### .vscode

Contains basic vscode settings and recomended extensions to get you up and running

### lib/\*

Git submodules of outside repos

### node_modules/\*

Globally installed node modules and hoisted node modules

### packages/\*

All internal packages regardless of language live in packages/\*

### .env

Env variables for docker-compose

### docker-compose.yml Dockerfile

A docker compose file for spinning up the example app in docker.

Alternatively can run `nx serve` to start the example app outside of docker

### foundry.toml

Configures foundry contracts in packages/contracts

### nx.json

Configures nx. Nx is used for incremental and cached builds. Running `npm foo` as `nx foo` has
the advantage of nx being smart enough to rebuild subdependencies if they need built.

### tsconfig.json .prettierignore .eslintrc.js

Configs that packages extend from. The tsconfig.json has the absolute strictest settings possible. Much stricter than strict mode.

## License

[MIT](LICENSE) © 2023 roninjin10
