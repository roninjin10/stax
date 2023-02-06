import { Text } from 'ink'
import * as React from 'react'

import { useScreenNavigation } from '../hooks'

export const Help: React.FC = () => {
  useScreenNavigation()
  return <Text color="white">Help</Text>
}
