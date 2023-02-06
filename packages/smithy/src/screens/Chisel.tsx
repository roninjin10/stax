import { Text } from 'ink'
import * as React from 'react'

import { useScreenNavigation } from '../hooks'

export const Chisel: React.FC = () => {
  useScreenNavigation()
  return <Text color="white">Chisel</Text>
}
