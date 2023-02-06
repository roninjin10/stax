import { Text } from 'ink'
import * as React from 'react'

import { useScreenNavigation } from '../hooks'

export const Forge: React.FC = () => {
  useScreenNavigation()
  return <Text color="white">Forge</Text>
}
