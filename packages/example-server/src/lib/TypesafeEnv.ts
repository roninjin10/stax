import type { z } from 'zod'

/**
 * Helper for turning zod validators into typesafe env variables
 *
 * @param validators a mapping of ENV variable names to zod validators
 * @param env the environment variables to parse.  Defaults to process.env
 * @returns a typesafe mapping of ENV variable names to their values
 * @example
 * const env = getTypesafeEnv({
 *  HOST: z.string().default('localhost').describe('HOST server should connect to'),
 * })
 * console.log(env.HOST) // this will be typesafe with editor autocomplete and validated at runtime
 */
export const getTypesafeEnv = <TValidators extends Record<string, z.ZodType>>(
  validators: TValidators,
  env = process.env,
): {
  [TKey in keyof TValidators]: z.infer<TValidators[TKey]>
} => {
  const errors: unknown[] = []

  const out = Object.fromEntries(
    Object.entries(validators).map(([key, validator]) => {
      try {
        return [key, validator.parse(env[key])]
      } catch (e) {
        console.error(
          `There was an error parsing env var ${key} with description ${validator.description}`,
          e,
        )
        errors.push(e)
        return []
      }
    }),
  ) as { [TKey in keyof TValidators]: z.infer<TValidators[TKey]> }

  if (errors.length) {
    console.error(...errors)
    throw errors[0]
  }

  return out
}

/**
 * Utility function to print the env schema when running `pnpm envSchema`
 *
 * @param validators a mapping of ENV variable names to zod validators
 * @returns a string documenting the available env variables
 * @example
 * getEnvSchema({
 *   HOST: z.string().default('localhost').describe('HOST server should connect to'),
 * })
 * Environment Variables schema
 *
 * HOST
 *     HOST server should connect to
 */
export const getEnvSchema = (validators: Record<string, z.ZodType>) => {
  const info: string[] = ['Environment Variables Schema']

  Object.keys(validators).forEach((key) => {
    info.push('\n')
    const tabSpace = '       '

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const validator = validators[key]!

    const defaultValueParse = validator.safeParse(undefined)
    const defaultValue = defaultValueParse.success
      ? defaultValueParse.data
      : 'REQUIRED'

    info.push(`${key} = ${defaultValue}`)
    info.push(`${tabSpace}${validator.description}`)
  })
  return info.join('\n')
}
