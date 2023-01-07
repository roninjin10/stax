import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { typesafeEnv } from './typesafeEnv'

describe(typesafeEnv.name, () => {
  it('it should properly parse env variables', () => {
    const validators = {
      HOST: z
        .string()
        .default('localhost')
        .describe('HOST server should connect to'),
      PORT: z.number().default(3000).describe('PORT server should connect to'),
      BOOL: z.boolean().default(true).describe('PORT server should connect to'),
      STRING_INT: z
        .string()
        .transform((str) => Number.parseInt(str))
        .default('123')
        .describe('PORT server should connect to'),
    }

    const env = {
      HOST: 'localhost',
      PORT: 3000,
      BOOL: true,
      STRING_INT: '123',
    }

    const result = typesafeEnv(validators, env)

    expect(result).toEqual({
      BOOL: true,
      HOST: 'localhost',
      PORT: 3000,
      STRING_INT: 123,
    })
  })
})
