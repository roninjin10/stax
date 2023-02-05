import { useInput } from 'ink'
import { useFlux } from './useFlux'

export const useScreenNavigation = () => {
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
