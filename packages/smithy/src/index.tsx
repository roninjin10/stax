#!/usr/bin/env node
import type { ExecException } from 'child_process'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'
import { cac } from 'cac'
// @ts-ignore it's mad about me importing something not in tsconfig.includes
import packageJson from '../package.json'
import { Box, Newline, render, Text, Transform, useInput } from 'ink'
import * as React from 'react'
import terminalLink from 'terminal-link'

import { create } from 'zustand'
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

const screens = [
  'main',
  'forge',
  'cast',
  'anvil',
  'chisel',
  'docs',
  'help',
] as const
type Screen = (typeof screens)[number]

const store = create<{
  screen: Screen
  setScreen: (screen: Screen) => void
}>((set) => ({
  screen: 'main' as Screen,
  setScreen: (screen: Screen) => set({ screen }),
}))

const useFlux = () => {
  // zustand not playing nice with ink or react17 triggering rerenders
  // I haven't debugged at all just did this quick workaround
  const [state, setState] = React.useState(store.getState())
  React.useEffect(() => {
    return store.subscribe(setState)
  }, [])
  return state
}

const useScreenNavigation = () => {
  const { setScreen } = useFlux()
  useInput((input) => {
    if (input === 'f') {
      setScreen('forge')
    }
    if (input === 'c') {
      setScreen('cast')
    }
    if (input === 'a') {
      setScreen('anvil')
    }
    if (input === 'j') {
      setScreen('chisel')
    }
    if (input === 'd') {
      setScreen('docs')
    }
    if (input === 'h') {
      setScreen('help')
    }
    if (input === 'm') {
      setScreen('main')
    }
  })
}

const screenComponents = {
  Main: () => {
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
        <Box>
          <Text color="gray">{'> Press '}</Text>
          <Text color="white">h</Text>
          <Text color="gray">{' to view help page'}</Text>
        </Box>
      </>
    )
  },
  Forge: () => {
    useScreenNavigation()
    return <Text color="white">Forge</Text>
  },
  Cast: () => {
    useScreenNavigation()
    return <Text color="white">Cast</Text>
  },
  Anvil: () => {
    useScreenNavigation()
    return <Text color="white">Anvil</Text>
  },
  Chisel: () => {
    useScreenNavigation()
    return <Text color="white">Chisel</Text>
  },
  Docs: () => {
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
            <Text color="cyan">
              https://book.getfoundry.sh/reference/forge/
            </Text>
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
            <Text color="cyan">
              https://book.getfoundry.sh/reference/anvil/
            </Text>
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
  },
  NotImplemented: () => {
    useScreenNavigation()
    return <Text>Not implemented yet</Text>
  },
}

const Screen = () => {
  const { screen } = useFlux()
  if (screen === 'main') {
    return <screenComponents.Main />
  }
  if (screen === 'forge') {
    return <screenComponents.Forge />
  }
  if (screen === 'cast') {
    return <screenComponents.Cast />
  }
  if (screen === 'anvil') {
    return <screenComponents.Anvil />
  }
  if (screen === 'chisel') {
    return <screenComponents.Chisel />
  }
  if (screen === 'docs') {
    return <screenComponents.Docs />
  }
  return <screenComponents.NotImplemented />
  // console.error('Not implemented yet')
  // process.exit(1)
}

const App = () => {
  return <Screen />
}

const exec = promisify(execCallback)

async function runCommand(command: string): Promise<string> {
  try {
    const { stdout } = await exec(command)
    return stdout
  } catch (error: any) {
    const execError = error as ExecException
    if (execError.code === 127) {
      console.error(`Error: ${command} not found in PATH.`)
      console.error(`Please check that you have the Foundry CLI installed.`)
      console.error(
        `Visit https://github.com/foundry-rs/foundry for more information.`,
      )
    } else {
      console.error(`Error: ${command} exited with code ${execError.code}.`)
      console.error(execError.message)
    }
    throw error
  }
}

export function forgeWrapper() {
  return render(<App />)
}

export function castWrapper() {
  runCommand('cast')
}

export function anvilWrapper() {
  runCommand('anvil')
}

export function chiselWrapper() {
  runCommand('chisel')
}

export function help() {
  console.log(`
Usage:
  forge-cli [command]

Commands:
  forge      Runs the forge library
  cast       Runs the cast library
  anvil      Runs the anvil library
  chisel     Runs the chisel library
  help       Prints this help documentation

Examples:
  forge-cli forge
  forge-cli cast
`)
}

const cli = cac('smithy')

cli.command('forge', 'Runs the forge library').action(async () => {
  return forgeWrapper()
})

cli.command('cast', 'Runs the cast library').action(async () => {
  return castWrapper()
})

cli.command('anvil', 'Runs the anvil library').action(async () => {
  return anvilWrapper()
})

cli.command('chisel', 'Runs the chisel library').action(async () => {
  return chiselWrapper()
})

cli.help()
cli.version(packageJson.version)

void (async () => {
  try {
    // Parse CLI args without running command
    cli.parse(process.argv, { run: false })
    if (!cli.matchedCommand && cli.args.length === 0) {
      cli.outputHelp()
    }
    await cli.runMatchedCommand()
  } catch (error) {
    console.error(`\n${(error as Error).message}`)
    process.exit(1)
  }
})()
