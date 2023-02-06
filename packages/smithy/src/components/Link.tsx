import { Text, Transform } from 'ink'
import * as React from 'react'
import terminalLink from 'terminal-link'

/**
 * Copied from ink-link https://github.com/sindresorhus/ink-link/blob/main/index.js
 * ink-link is not maintained
 */
export const Link: React.FC<
  React.PropsWithChildren<{
    url: string
  }>
> = (props) => {
  return (
    <Transform transform={(children) => terminalLink(children, props.url)}>
      <Text>{props.children}</Text>
    </Transform>
  )
}
