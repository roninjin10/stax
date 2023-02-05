import { Box, Text } from 'ink'
import * as React from 'react'
import { useFlux, useScreenNavigation } from '../hooks'

export const Main: React.FC<{}> = () => {
  useScreenNavigation()
  const { screen } = useFlux()
  return (
    <>
      <Text color="white">Welcome to the Forge Smithy</Text>
      <Text color="gray">{screen}</Text>
      <Text color="white">Select an option</Text>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">f</Text>
        <Text color="gray">{' to select forge'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">c</Text>
        <Text color="gray">{' to select cast'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">a</Text>
        <Text color="gray">{' to select anvil'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">j</Text>
        <Text color="gray">{' to select chisel'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">d</Text>
        <Text color="gray">{' for links to docs'}</Text>
      </Box>
      {/*
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">h</Text>
        <Text color="gray">{' to view help page'}</Text>
      </Box>
        */}
    </>
  )
}
