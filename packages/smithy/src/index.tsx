#!/usr/bin/env node
import type { ExecException } from 'child_process'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'
import { cac } from 'cac'
// @ts-ignore it's mad about me importing something not in tsconfig.includes
import packageJson from '../package.json'
import { render } from 'ink'
import * as React from 'react'

import type { Screen } from './constants'
import { useFlux } from './hooks'
import { Main } from './screens'
import { Forge } from './screens/Forge'
import { NotImplemented } from './screens/NotImplemented'
import { Docs } from './screens/Docs'
import { Chisel } from './screens/Chisel'
import { Anvil } from './screens/Anvil'
import { Cast } from './screens/Cast'

const Screen = () => {
  const { screen } = useFlux()
  if (screen === 'main') {
    return <Main />
  }
  if (screen === 'forge') {
    return <Forge />
  }
  if (screen === 'cast') {
    return <Cast />
  }
  if (screen === 'anvil') {
    return <Anvil />
  }
  if (screen === 'chisel') {
    return <Chisel />
  }
  if (screen === 'docs') {
    return <Docs />
  }
  return <NotImplemented />
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
