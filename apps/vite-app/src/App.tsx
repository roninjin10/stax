import { useQuery } from '@tanstack/react-query'

const forgeScript = `
contract HelloWorld is Script {
    function run() external {
        return 'Hello, World!';
    }
}
`

const run = async (script: string) => {
  return 'Hello, World!'
}

export const App = () => {
  const { data, error, isLoading } = useQuery(['forgeScript'], async () => {
    return run(forgeScript)
  })
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {(error as Error).message}</div>}
      {data && <div>{data}</div>}
    </div>
  )
}
