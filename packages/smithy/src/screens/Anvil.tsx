import { Text } from 'ink'
import * as React from 'react'

import { useScreenNavigation } from '../hooks'

export const Anvil: React.FC = () => {
  useScreenNavigation()
  return <Text color="white">Anvil</Text>
}
