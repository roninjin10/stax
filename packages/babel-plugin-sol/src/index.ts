import { /*NodePath, template,*/ types as t } from '@babel/core'
import { declare } from '@babel/helper-plugin-utils'
import * as fs from 'fs/promises'
import * as os from 'os'
import * as path from 'path'
import { z } from 'zod'

const isSolidityVersion = (version: string) => {
  const regex = /^\d+\.\d+\.\d+$/
  return regex.test(version)
}

export const optionsValidator = z.object({
  // solc must be a version e.g. 0.8.17
  solc: z
    .string()
    .refine(isSolidityVersion)
    .optional()
    .default('0.8.17')
    .describe('solc version'),
})

export type Options = z.infer<typeof optionsValidator>

export default declare((api, options: Options) => {
  let solc: string
  try {
    solc = optionsValidator.parse(options).solc
  } catch (e) {
    console.error(e)
    throw new Error('ts-sol babel plugin options are invalid')
  }

  api.assertVersion(7)

  const tempDir = os.tmpdir()

  const tempForgeProjectPath = path.join(tempDir, '__ts-sol-forge-project__')

  const foundryTomlPath = path.join(tempForgeProjectPath, 'foundry.toml')

  const foundryToml = `
[project]
name = "temp-ts-sol-forge-project"
src = "src"
out = "dist"
solc = ${solc}
`

  const createProjectPromise = fs.mkdir(tempForgeProjectPath).then(() => {
    return Promise.all([
      fs.writeFile(foundryTomlPath, foundryToml, { encoding: 'utf-8' }),
      fs.mkdir(path.join(tempForgeProjectPath, 'src')),
    ])
  })

  return {
    name: 'ts-sol',
    visitor: {
      TaggedTemplateExpression: async (path) => {
        const {
          node: { tag, quasi },
        } = path

        const isTsSolTag = tag.type === 'Identifier' && tag.name === 'tsSol'

        if (!isTsSolTag) {
          return
        }

        await createProjectPromise

        /*
        we aren't handling string interpelation yet

        const strings: t.Node[] = []
        const raws = []
        for (const elem of quasi.quasis) {
          const { raw, cooked } = elem.value
          const value =
            cooked == null
              ? path.scope.buildUndefinedNode()
              : t.stringLiteral(cooked)

          strings.push(value)
          raws.push(t.stringLiteral(raw))
        }
        */
        const solidityString = quasi.quasis[0]?.value.raw

        if (!solidityString) {
          throw new Error('tsSol tagged template literal must have a string')
        }

        console.log(solidityString)
      },
    },
  }
})
