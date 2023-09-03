import { useEthers } from '@usedapp/core'
import { AbstractConnector } from '@web3-react/abstract-connector'
import type { providers } from 'ethers'
import { useEffect } from 'react'
import { useAccount, useNetwork } from 'wagmi'

class UseDappConnector extends AbstractConnector {
  constructor(
    private readonly chainId: number,
    private readonly address: string,
    public readonly getProvider: () => Promise<providers.JsonRpcProvider>,
    public readonly deactivate: () => Promise<void>,
  ) {
    super()
  }

  getChainId = async () => this.chainId
  getAccount = async () => this.address
  activate = async () => {
    const provider = await this.getProvider()
    await provider.ready
    return {
      account: this.address,
      chainId: this.chainId,
      provider,
    }
  }
}

/**
 * Connects RainbowKit to useDapp
 * When rainbowkit connection changes, useDapp is activated with the connection
 * When the rainbow connection goes away, useDapp is deactivated
 */
export const UseDappRainbowKitAdapter: React.FC = () => {
  const { activate, deactivate } = useEthers()

  const { address, connector } = useAccount()
  const { chain } = useNetwork()

  useEffect(() => {
    if (!connector || !address || !chain) {
      deactivate()
      return
    }
    connector.getProvider().then(async (provider) => {
      await provider.ready
      activate(
        new UseDappConnector(
          chain.id,
          address,
          connector.getProvider.bind(connector),
          () => {
            // we don't want to actually disconnect here because it would cause issues with the rainbowkit connection
          },
        ),
      )
    })
  }, [connector, chain, address])

  return <></>
}
