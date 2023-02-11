import { useQuery } from '@tanstack/react-query'

const forgeScript = `
contract HelloWorld is Script {
    function run() external {
        return 'Hello, World!';
    }
}
`

const run = async (script: string) => {}

export const App = () => {
  const { data, error, isLoading } = useQuery(['forgeScript'], async () => {
    return run(forgeScript)
  })
  return <div></div>
}
