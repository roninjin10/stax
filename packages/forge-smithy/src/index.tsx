#!/usr/bin/env node
import type { ExecException } from 'child_process'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'
import { cac } from 'cac'
// @ts-ignore it's mad about me importing something not in tsconfig.includes
import packageJson from '../package.json'
import * as React from 'react'
import { Box, render, Text, useInput } from 'ink'
import { create } from 'zustand'

const screens = ['main', 'forge', 'cast', 'anvil', 'chisel', 'help'] as const
type Screen = (typeof screens)[number]

const store = create<{
  screen: 'help' | 'main' | 'forge' | 'cast' | 'anvil' | 'chisel'
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
    if (input === 'h') {
      setScreen('help')
    }
    if (input === 'm') {
      setScreen('main')
    }
  })
}

const MainScreen = () => {
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
    </>
  )
}

const ForgeScreen = () => {
  useScreenNavigation()
  return <Text color="white">Forge</Text>
}

const NotImplementedScreen = () => {
  useScreenNavigation()
  return <Text>Not implemented yet</Text>
}

const Screen = () => {
  const { screen } = useFlux()
  if (screen === 'main') {
    return <MainScreen />
  }
  if (screen === 'forge') {
    return <ForgeScreen />
  }
  return <NotImplementedScreen />
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

const cli = cac('forge-smithy')

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
