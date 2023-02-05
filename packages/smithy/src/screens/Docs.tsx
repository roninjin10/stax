import { Box, Newline, Text } from 'ink'
import * as React from 'react'
import { Link } from '../components'
import { useFlux, useScreenNavigation } from '../hooks'

export const Docs: React.FC<{}> = () => {
  useScreenNavigation()
  const columnWidth = 17
  return (
    <>
      <Text color="white">Help</Text>
      <Box>
        <Box width={columnWidth}>
          <Text color="gray">{'Cheatsheet: '}</Text>
        </Box>
        <Box>
          <Link url="https://github.com/dabit3/foundry-cheatsheet">
            <Text color="cyan">dabit3/foundry-cheatsheet</Text>
          </Link>
        </Box>
      </Box>
      <Box>
        <Box width={columnWidth}>
          <Text color="gray">{'Smithy github: '}</Text>
        </Box>
        <Box>
          <Link url="https://github.com/roninjin10/stax/tree/main/packages/smithy">
            <Text color="cyan">roninjin10/stax</Text>
          </Link>
        </Box>
      </Box>
      <Box>
        <Box width={columnWidth}>
          <Text color="gray">{'Forge github: '}</Text>
        </Box>
        <Box>
          <Link url="https://github.com/foundry-rs/foundry">
            <Text color="cyan">foundry-rs/foundry</Text>
          </Link>
        </Box>
      </Box>
      <Box>
        <Box width={columnWidth}>
          <Text color="gray">{'Foundry book: '}</Text>
        </Box>
        <Link url="https://book.getfoundry.sh/">
          <Text color="cyan">book.getfoundry.sh</Text>
        </Link>
      </Box>
      <Box>
        <Box width={columnWidth}>
          <Text color="gray">{'Forge reference: '}</Text>
        </Box>
        <Link url="https://book.getfoundry.sh/reference/forge">
          <Text color="cyan">https://book.getfoundry.sh/reference/forge/</Text>
        </Link>
      </Box>
      <Box>
        <Box width={columnWidth}>
          <Text color="gray">{'Cast reference: '}</Text>
        </Box>
        <Link url="https://book.getfoundry.sh/reference/cast">
          <Text color="cyan">https://book.getfoundry.sh/reference/cast</Text>
        </Link>
      </Box>
      <Box>
        <Box width={columnWidth}>
          <Text color="gray">{'Anvil reference: '}</Text>
        </Box>
        <Link url="https://book.getfoundry.sh/reference/anvil/">
          <Text color="cyan">https://book.getfoundry.sh/reference/anvil/</Text>
        </Link>
      </Box>
      <Newline />
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">m</Text>
        <Text color="gray">{' to return to main screen'}</Text>
      </Box>
    </>
  )
}
