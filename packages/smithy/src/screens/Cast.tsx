import { Text } from 'ink'
import * as React from 'react'

import { useScreenNavigation } from '../hooks'

export const Cast: React.FC = () => {
  useScreenNavigation()
  return <Text color="white">Cast</Text>
}
