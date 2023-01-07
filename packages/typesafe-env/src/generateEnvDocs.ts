import type { z } from 'zod'

/**
 * Utility function to print the env schema when running `pnpm envSchema`
 *
 * @param validators a mapping of ENV variable names to zod validators
 * @returns a string documenting the available env variables
 * @example
 * generateEnvDocs({
 *   HOST: z.string().default('localhost').describe('HOST server should connect to'),
 * })
 * // Outputs the following
 * Environment Variables schema
 *
 * HOST
 *     HOST server should connect to
 */
export const generateEnvDocs = (validators: Record<string, z.ZodType>) => {
  const info: string[] = ['Environment Variables Schema']

  Object.keys(validators).forEach((key) => {
    info.push('\n')
    const tabSpace = '       '

    const validator = validators[key]

    if (!validator) {
      throw new Error(`Validator not found for key: ${key}`)
    }

    const defaultValueParse = validator.safeParse(undefined)
    const defaultValue = defaultValueParse.success
      ? defaultValueParse.data
      : 'REQUIRED'

    info.push(`${key} = ${defaultValue}`)
    info.push(`${tabSpace}${validator.description}`)
  })

  return info.join('\n')
}
