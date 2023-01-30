[![CI](https://github.com/roninjin10/stax/actions/workflows/tests.yml/badge.svg)](https://github.com/roninjin10/stax/actions/workflows/tests.yml)
[![CI](https://github.com/roninjin10/stax/actions/workflows/lint.yml/badge.svg)](https://github.com/roninjin10/stax/actions/workflows/lint.yml)
[![CI](https://github.com/roninjin10/stax/actions/workflows/typecheck.yml/badge.svg)](https://github.com/roninjin10/stax/actions/workflows/typecheck.yml)
[![CI](https://github.com/roninjin10/stax/actions/workflows/docker.yml/badge.svg)](https://github.com/roninjin10/stax/actions/workflows/docker.yml)
<a href="https://twitter.com/fucory">
<img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40fucory&style=social&url=https%3A%2F%2Ftwitter.com%2Ffucory" />
</a>
<a href="https://gitmoji.dev">
<img
    src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square"
    alt="Gitmoji"
  />
</a>

# Stax

Stax is a collection of open source libraries and experimental evm based packages and apps by roninjin10

## Getting started

### Requirements

1. [docker and docker-compose](https://docs.docker.com/get-docker/)
2. [Rust](https://www.rust-lang.org/tools/install)
3. [Node18](https://nodejs.org/en/) or use [NVM](https://github.com/nvm-sh/nvm)
4. [Forge](https://github.com/foundry-rs/forge-std/tree/eb980e1d4f0e8173ec27da77297ae411840c8ccb)
5. [pnpm](https://pnpm.io) install with `npm i pnpm --global`

Alternatively, the dev environment can be ran as a docker container by targeting monorepo target in the Dockerfile.

### Orchestrating monorepo

#### nx

This monorepo is orchestrated with [nx](https://nx.dev/). You can build lint or test entire monorepo using nx. There is also a vscode extension for nx.

To build everything run `pnpm nx run-many --target=build`

To test everything run `pnpm nx run-many --target=test`

To lint everything run `pnpm nx run-many --target=lint`

To typecheck typescript code run `pnpm nx run-many --target=typecheck`

To build an individual package like typesafe-growthbook `pnpm nx build @roninjin10/typesafe-growthbook`

For more information run `pnpm nx --help`.

Consider adding an alias `alias nx="pnpm nx"`

You can also generate a new package with `nx generate`. For example `pnpm nx generate @nxrs/cargo:app new-rust-package` will generate a new rust app named new-rust-package. See [nx generator documentation](https://nx.dev/plugin-features/use-code-generators) for more information.

Nx provides a uniform interface to build and test all packages regardless of language but all code can be run directly too using pnpm forge or cargo.

#### docker

All the applications can also be run as docker containers. This is the best way to approximate what the apps will run like once deployed. To run in docker run `docker-compose up my-service`. See [docker-compose](https://github.com/roninjin10/stax/blob/main/docker-compose.yml) file for what services are available or omit a service to run everything.

The [dockerbuild](https://github.com/roninjin10/stax/blob/main/Dockerfile) is a multistage build that first builds the monorepo and then creates smaller production images for individual services.

## Directories

### apps/

Web apps, servers, and rust cli tools as well as their e2e tests

### lib/

External libraries and git submodules

### packages/\*

Packages, npm libraries, and shared components

### ci/cd

All ci/cd workflows are in the [github workflows folder](https://github.com/roninjin10/stax/tree/main/.github/workflows). Npm packages are published on release events. Docker images are pushed every commit. Most workflows can also be triggered manually by going to the actions tab in github.

## License

[MIT](LICENSE) © 2023 roninjin10
