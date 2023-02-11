import { useQuery } from '@tanstack/react-query'
import { tsSol, run } from '@roninjin10/ts-sol'
import { useState } from 'react'

const forgeScript = tsSol`
contract Script {
    function run() external returns (string memory) {
        return "Hello, World!";
    }
}
`

export const App = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const { data, error, isLoading } = useQuery(['helloWorldQuery'], async () => {
    return run(forgeScript)
  })
  return (
    <div>
      <button onClick={() => setIsEnabled(!isEnabled)}>Click to run tx</button>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {(error as Error).message}</div>}
      {data && <div>{data}</div>}
    </div>
  )
}
