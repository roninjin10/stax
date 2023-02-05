import { Box, Text } from 'ink'
import * as React from 'react'
import { useFlux, useScreenNavigation } from '../hooks'

export const NotImplemented: React.FC<{}> = () => {
  useScreenNavigation()
  return <Text>Not implemented yet</Text>
}
