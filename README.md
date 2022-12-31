# Stax

Stax is a collection of experimental evm based packages by William Cory

## Packages

### lib/\*

Git submodules of outside repos

### apps/\*

All apps (currently none) live in apps/_. Very minimal code is here. Most of their generic logic will live in a package in package/_.

### packages/\*

All internal packages regardless of language live in packages/\*

#### packages/contracts

Where all the forge based smart contracts live

#### packages/ts-sol

A node library for interacting with evm based chains using the native solidity platform

#### packages/ts-sol-react

A wrapper around ts-solidity based on wagmi and @stax/ts-solidity

#### packages/ts-sol-plugin

A typescript plugin for transforming solidity imports

#### packages/ts-sol-vite-plugin

A rollup/vite plugin for consuming typescript modules

#### packages/ts-sol-webpack-plugin

A simple webpack plugin for consuming typescript modules

#### packages/ts-sol-server

A solidity based way of building and consuming trustless blockchain based indexers deployed as app chains
