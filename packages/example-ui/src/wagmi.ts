import { getDefaultClient } from 'connectkit'
import { createClient } from 'wagmi'

import { env } from './env'

export const client = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: 'My wagmi + ConnectKit App',
    alchemyId: env.VITE_ALCHEMY_API_KEY,
    infuraId: env.VITE_INFURA_API_KEY,
  }),
)
