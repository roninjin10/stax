export const tsSol = (strings: TemplateStringsArray, ...literals: string[]) => {
  console.log({ literals })
  return strings.join('')
}

export const run = async (script: string) => {
  // turn it into op codes
  // run it in the evm
  // return the result
  return 'Hello, World!'
}
