import { Box, Text } from 'ink'
import * as React from 'react'
import { useFlux, useScreenNavigation } from '../hooks'

export const Help: React.FC<{}> = () => {
  useScreenNavigation()
  return <Text color="white">Help</Text>
}
