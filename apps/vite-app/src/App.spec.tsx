import type { FeatureDefinition } from '@growthbook/growthbook-react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import matchers from '@testing-library/jest-dom/matchers'
import { cleanup, render, screen } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { z } from 'zod'
import { App } from './App'

expect.extend(matchers)

afterEach(() => {
  cleanup()
})

describe('evm-client MVP', () => {
  it('should render', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <App />)
      </QueryClientProvider>,
    )
    expect(screen.getByText('Hello world!')).toBeInTheDocument()
  })
})
