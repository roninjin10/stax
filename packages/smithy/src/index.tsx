#!/usr/bin/env node
import { cac } from 'cac'
// @ts-ignore it's mad about me importing something not in tsconfig.includes
import packageJson from '../package.json'
import { render } from 'ink'
import * as React from 'react'

import { App } from './App'

const cli = cac('smithy')

cli
  .command('forge', 'Runs smithy starting on forge screen')
  .action(async () => {
    render(<App initalScreen="forge" />)
  })

cli.command('cast', 'Runs smithy starting on cast screen').action(async () => {
  render(<App initalScreen="cast" />)
})

cli
  .command('anvil', 'Runs smithy starting on anvil screen')
  .action(async () => {
    render(<App initalScreen="anvil" />)
  })

cli
  .command('chisel', 'Runs smithy starting on chisel screen')
  .action(async () => {
    render(<App initalScreen="chisel" />)
  })

cli
  .command('docs', 'View handy links to forge documentation')
  .action(async () => {
    render(<App initalScreen="docs" />)
  })

cli.command('main', 'Runs smithy starting on main screen').action(async () => {
  render(<App initalScreen="main" />)
})

cli.help()
cli.version(packageJson.version)

void (async () => {
  try {
    // Parse CLI args without running command
    cli.parse(process.argv, { run: false })
    if (!cli.matchedCommand && cli.args.length === 0) {
      render(<App initalScreen="main" />)
      return
    }
    await cli.runMatchedCommand()
  } catch (error) {
    console.error(`\n${(error as Error).message}`)
    process.exit(1)
  }
})()
