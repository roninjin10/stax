import { useFlux } from './hooks'
import {
  Anvil,
  Cast,
  Chisel,
  Docs,
  Forge,
  Main,
  NotImplemented,
} from './screens'
import * as React from 'react'

export const App = () => {
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
