import * as React from 'react'

import { Screen } from './constants'
import { FluxProvider, useFlux } from './hooks'
import { validateFoundry } from './lib/validateFoundry'
import {
  Anvil,
  Cast,
  Chisel,
  Docs,
  Forge,
  Main,
  NotImplemented,
} from './screens'

const Screen = () => {
  React.useEffect(() => {
    validateFoundry
  }, [])
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

export const App: React.FC<{
  initalScreen: Screen
}> = ({ initalScreen }) => {
  return (
    <FluxProvider initialScreen={initalScreen}>
      <Screen />
    </FluxProvider>
  )
}
