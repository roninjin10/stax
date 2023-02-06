import { Text } from 'ink'
import * as React from 'react'

import { useScreenNavigation } from '../hooks'

export const NotImplemented: React.FC = () => {
  useScreenNavigation()
  return <Text>Not implemented yet</Text>
}
