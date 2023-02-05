import { useEffect, useState } from 'react'
import { create } from 'zustand'
import type { Screen } from './constants'

const store = create<{
  screen: Screen
  setScreen: (screen: Screen) => void
}>((set) => ({
  screen: 'main' as Screen,
  setScreen: (screen: Screen) => set({ screen }),
}))

/**
 * There is some incompatibility with zustands react binding
 * with either react 17 or ink.  I haven't debugged it since
 * this workaround is fine for this cli tool since we don't
 * need any of zustands peformance rerender benefits.
 */
export const useFlux = () => {
  // zustand not playing nice with ink or react17 triggering rerenders
  // I haven't debugged at all just did this quick workaround
  const [state, setState] = useState(store.getState())
  useEffect(() => {
    return store.subscribe(setState)
  }, [])
  return state
}
