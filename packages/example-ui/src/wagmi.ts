import { getDefaultClient } from 'connectkit'
import { createClient } from 'wagmi'

export const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: 'My wagmi + ConnectKit App',
    alchemyId: process.env.VITE_ALCHEMY_API_KEY!,
    infuraId: process.env.VITE_INFURA_API_KEY!,
  }),
)
