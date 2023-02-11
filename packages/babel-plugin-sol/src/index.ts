import { /*NodePath, template,*/ types as t } from '@babel/core'
import { declare } from '@babel/helper-plugin-utils'

export interface Options {
  loose?: boolean
}

export default declare((api, options: Options) => {
  api.assertVersion(7)
  console.log(options)
  return {
    name: 'ts-sol',
    visitor: {
      TaggedTemplateExpression(path) {
        const {
          node,
          node: { tag },
        } = path

        const isTsSolTag = tag.type === 'Identifier' && tag.name === 'tsSol'

        if (!isTsSolTag) {
          return
        }

        const { quasi } = node

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
      },
    },
  }
})
