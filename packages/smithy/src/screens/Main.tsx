import { Box, Text } from 'ink'
import * as React from 'react'
import { useFlux, useScreenNavigation } from '../hooks'

export const Main: React.FC<{}> = () => {
  useScreenNavigation()
  const { screen } = useFlux()
  return (
    <>
      <Text color="white">Welcome to Smithy for Forge</Text>
      <Text color="white">Select an option</Text>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">f</Text>
        <Text color="gray">{' to select smithy-forge'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">c</Text>
        <Text color="gray">{' to select smith-cast'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">a</Text>
        <Text color="gray">{' to select smith-anvil'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">j</Text>
        <Text color="gray">{' to select smith-chisel'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">w</Text>
        <Text color="gray">{' for wagmi cli'}</Text>
      </Box>
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">g</Text>
        <Text color="gray">{' for code gen'}</Text>
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
