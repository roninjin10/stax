  <a href="https://twitter.com/fucory">
      <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40fucory&style=social&url=https%3A%2F%2Ftwitter.com%2Ffucory" />
  </a>


# usedapp-rainbowkit-adapter

A simple react component that connects rainbowkit to usedapp. This is used by [OP Labs](https://www.oplabs.co/) in the [optimism gateway](https://app.optimism.io/bridge/deposit)

## Getting started

1. Install @roninjin10/usedapp-rainbowkit-adapter

```bash
npm i @roninjin10/typesafe-growthbook
```

2. Nest the adapter inside of your DappProvider

Follow rainbowkit docs to set up a rainbowkit as normal and then nest the adapter inside of your DappProvider

```typescript
return (
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider
      chains={wagmiChains}
      theme={rainbowThemes[theme]}
      appInfo={{
        appName: APP_NAME,
        learnMoreUrl: externalRoutes.HOW_DO_I_START,
        disclaimer: RainbowKitDisclaimer,
      }}
      modalSize="compact"
    >
      <DAppProvider
        config={{
          readOnlyChainId: Mainnet.chainId,
          readOnlyUrls: readOnlyUrls as any,
          autoConnect: false,
          pollingInterval: 10_000,
          networks: [
            ...DEFAULT_SUPPORTED_CHAINS,
            chains.OptimismGoerli,
            chains.Devnet,
            chains.OptimismDevnet,
          ],
        }}
      >
        <UseDappRainbowKitAdapter />
        {restOfYourApp}
      </DAppProvider>
    </RainbowKitProvider>
  </WagmiConfig>
)
```

### Author: Will Cory 👨🏻‍💻
