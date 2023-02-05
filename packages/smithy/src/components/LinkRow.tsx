import { Box, Text } from 'ink'
import * as React from 'react'
import { Link } from '.'

const columnWidth = 17

export const LinkRow: React.FC<{
  label: string
  url: string
  urlText: string
}> = ({ label, url, urlText }) => {
  return (
    <Box>
      <Box width={columnWidth}>
        <Text color="gray">{`${label}: `}</Text>
      </Box>
      <Box>
        <Link url={url}>
          <Text color="cyan">{urlText}</Text>
        </Link>
      </Box>
    </Box>
  )
}
