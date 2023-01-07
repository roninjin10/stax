import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { generateEnvDocs } from './generateEnvDocs'

describe(generateEnvDocs.name, () => {
  it('should return a string documenting the env variable schema', () => {
    const validators = {
      HOST: z
        .string()
        .default('localhost')
        .describe('HOST server should connect to'),
      PORT: z.number().default(3000).describe('PORT server should connect to'),
    }

    const result = generateEnvDocs(validators)

    expect(result).toMatchInlineSnapshot(`
      "Environment Variables Schema


      HOST = localhost
             HOST server should connect to


      PORT = 3000
             PORT server should connect to"
    `)
  })
})
