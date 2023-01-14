import { generateEnvDocs, typesafeEnv } from '@roninjin10/typesafe-env'
import { z } from 'zod'

/**
 * A typesafe wrapper around process.env
 */
export class Env {
  public static getEnv(env: Record<string, string>) {
    return typesafeEnv(Env.validators, env)
  }

  public static getEnvSchema() {
    return generateEnvDocs(Env.validators)
  }

  private static readonly validators = {
    NODE_ENV: z
      .union([
        z.literal('development'),
        z.literal('test'),
        z.literal('production'),
      ])
      .default('production')
      .describe('NODE_ENV development,test,production'),

    VITE_ALCHEMY_API_KEY: z.string().describe('Alchemy API key'),

    VITE_INFURA_API_KEY: z.string().describe('Infura API key'),
  }
}

export const env = Env.getEnv(import.meta.env)
