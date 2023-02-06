import * as React from 'react'
import { create } from 'zustand'

import type { Screen } from '../constants'

const createStore = (initialScreen: Screen) => {
  return create<{
    screen: Screen
    setScreen: (screen: Screen) => void
  }>((set) => ({
    screen: initialScreen as Screen,
    setScreen: (screen: Screen) => set({ screen }),
  }))
}

const StoreContext = React.createContext<ReturnType<typeof createStore>>(
  createStore('main'),
)

export const FluxProvider: React.FC<
  React.PropsWithChildren<{ initialScreen: Screen }>
> = ({ children, initialScreen }) => {
  const store = React.useMemo(() => createStore(initialScreen), [])
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

/**
 * There is some incompatibility with zustands react binding
 * with either react 17 or ink.  I haven't debugged it since
 * this workaround is fine for this cli tool since we don't
 * need any of zustands peformance rerender benefits.
 */
export const useFlux = () => {
  const store = React.useContext(StoreContext)
  const [state, setState] = React.useState(store.getState())
  React.useEffect(() => {
    return store.subscribe(setState)
  }, [])
  return state
}
