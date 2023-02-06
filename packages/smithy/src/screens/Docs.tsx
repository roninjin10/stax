import { Box, Newline, Text } from 'ink'
import * as React from 'react'

import { LinkRow } from '../components/LinkRow'
import { useScreenNavigation } from '../hooks'

export const Docs: React.FC = () => {
  useScreenNavigation()
  return (
    <>
      <Text color="white">Docs</Text>
      <LinkRow
        label="Cheatsheet"
        url="https://github.com/dabit3/foundry-cheatsheet"
        urlText="dabit3/foundry-cheatsheet"
      />
      <LinkRow
        label="Smithy github"
        url="https://github.com/roninjin10/stax/tree/main/packages/smithy"
        urlText="roninjin10/stax"
      />
      <LinkRow
        label="Forge github"
        url="https://github.com/foundry-rs/foundry"
        urlText="foundry-rs/foundry"
      />
      <LinkRow
        label="Foundry book"
        url="https://book.getfoundry.sh/"
        urlText="book.getfoundry.sh"
      />
      <LinkRow
        label="Forge reference"
        url="https://book.getfoundry.sh/reference/forge"
        urlText="https://book.getfoundry.sh/reference/forge/"
      />
      <LinkRow
        label="Cast reference"
        url="https://book.getfoundry.sh/reference/cast"
        urlText="https://book.getfoundry.sh/reference/cast"
      />
      <LinkRow
        label="Anvil reference"
        url="https://book.getfoundry.sh/reference/anvil/"
        urlText="https://book.getfoundry.sh/reference/anvil/"
      />
      <Newline />
      <Box>
        <Text color="gray">{'> Press '}</Text>
        <Text color="white">m</Text>
        <Text color="gray">{' to return to main screen'}</Text>
      </Box>
    </>
  )
}
