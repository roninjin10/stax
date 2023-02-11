import { useQuery } from '@tanstack/react-query'
import { tsSol, run } from '@roninjin10/ts-sol/src'

const forgeScript = tsSol`
contract HelloWorld {
    function run() external {
        return 'Hello, World!';
    }
}
`

export const App = () => {
  const { data, error, isLoading } = useQuery(['helloWorldQuery'], async () => {
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
