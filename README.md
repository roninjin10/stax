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

Stax is a collection of open source libraries and experimental evm based packages and apps by roninjin10.

## Currently being developed

The current project being developed is a forge inspired [clientside library codenamed ts-sol](https://github.com/roninjin10/stax/tree/main/docs/ts-sol).

1. Write a forge-like script

```solidity
// src/TransferAllMutation.s.sol
pragma solidity ^0.8.17;

import { ERC20 } from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import { Script } from '@ts-sol/contracts/Script';

contract TransferAllMutation is Script {
  function run() external {
    uint256 signerPublicKey = vm.envUint('SIGNER');
    ERC20 tokenContract = new ERC20(vm.envUint('TOKEN_ADDRESS'));
    uint256 tokenBalance = tokenContract.balanceOf(signerPublicKey);
    uint256 to = vm.envUint('TO');

    vm.prepareBroadcast(signerPublicKey);
    tokenContract.transfer(signer, tokenBalance);
    vm.stopPrepareBroadcast();
  }
}
```

2. Now execute that script in your clientside typescript code

```typescript
// src/index.ts
import { TransferAllMutation } from './TransferAllMutation.s.sol'
import { prepareMutate, mutate } from '@ts-sol/core'
import detectEthereumProvider from '@metamask/detect-provider'
import addresses from './my-constants/addresses'

const signer = await detectEthereumProvider()

const prepareConfig = await prepareMutate(TransferAllMutation, {
  env: {
    SIGNER: signer,
    TOKEN_ADDRESS: addresses.myToken,
    TO: addresses.someOtherWallet,
  },
})

console.log(prepareConfig.gasLimit)
console.log(prepareConfig.expectedEvents)

const result = await mutate(prepareConfig)

console.log(result.txHash)
```

See [docs/ts-sol](https://github.com/roninjin10/stax/tree/main/docs/ts-sol) for more.

## Getting started with monorepo

### Requirements

1. [Node18](https://nodejs.org/en/) or use [NVM](https://github.com/nvm-sh/nvm)
2. [pnpm](https://pnpm.io) install with `npm i pnpm --global`
3. [Forge](https://github.com/foundry-rs/forge-std/tree/eb980e1d4f0e8173ec27da77297ae411840c8ccb)

Just pnpm and forge is enought o run much of the monorepo. To be able to run action and service you should also download the following:

4. [docker and docker-compose](https://docs.docker.com/get-docker/)
5. [Rust](https://www.rust-lang.org/tools/install)

Alternatively, the dev environment can be ran as a docker container by targeting monorepo target in the Dockerfile. Rust

### Orchestrating monorepo

### Install deps

Install node modules with pnpm. Pnpm is approximately the same api as npm

```
pnpm i
```

#### nx

This monorepo is orchestrated with [nx](https://nx.dev/). You can build lint or test entire monorepo using nx. There is also a vscode extension for nx.

##### alias

Consider adding an alias to your bashrc or zshrc`alias nx="pnpm nx"`

##### Commands

There is a readonly access token for access to the nx cache in the `nx.json`. Nx will also cache locally with no setup.

Nx help

```bash
pnpm nx --help
```

Do everything

```
pnpm nx run-many --targets=build,test,lint,typecheck
```

Build everything

```bash
pnpm nx run-many --target=build
```

Test everything

```bash
pnpm nx run-many --target=test
```

Lint/prettier everything

```bash
pnpm nx run-many --target=lint
```

Run only tests that have changed vs origin/main

```
pnpm nx affected --target=test
```

So all tooling is fast we treat typechecking as a seperate lint step. No other pipeline including the production build runs the typechecker.

```bash
pnpm nx run-many --target=typecheck`
```

To build an individual package like typesafe-growthbook

```bash
pnpm nx build @roninjin10/typesafe-growthbook
```

You can also generate a new package with `nx generate`. For example `pnpm nx generate @nxrs/cargo:app new-rust-package` will generate a new rust app named new-rust-package. See [nx generator documentation](https://nx.dev/plugin-features/use-code-generators) for more information. Usually you will be better off copy pasting a similar package.

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
