import { z } from 'zod'

import { getEnvSchema, getTypesafeEnv } from './lib/TypesafeEnv'

/**
 * A typesafe wrapper around process.env
 */
export class Env {
  public static getEnv() {
    return getTypesafeEnv(Env.validators)
  }

  public static getEnvSchema() {
    return getEnvSchema(Env.validators)
  }

  private static readonly validators = {
    HOST: z.string().default('localhost')
      .describe(`HOST server should connect to 
       Must be set to 0.0.0.0 in a docker container`),

    PORT: z
      .string()
      .refine((val) => {
        try {
          return Number.parseInt(val) > 0
        } catch (e) {
          return false
        }
      })
      .transform((val) => Number.parseInt(val))
      .default('7300')
      .describe('PORT server should connect to'),

    NODE_ENV: z
      .string()
      .default('production')
      .describe('NODE_ENV development,test,production'),

    TRPC_ENDPOINT: z
      .string()
      .default('/api')
      .describe('The route the trpc api is served at'),

    TRPC_PLAYGROUND_ENDPOINT: z
      .string()
      .optional()
      .default('/docs')
      .describe(
        'Change the route the playground is served at.  Explicitly set to nothing to disable playground',
      ),
  }
}
