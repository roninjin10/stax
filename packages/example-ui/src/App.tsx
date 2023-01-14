import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

import { Account } from './components/Account'

export const App = () => {
  const { isConnected } = useAccount()
  return (
    <div>
      <div className="navbar">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </div>
      <div className="container">
        <div className="side-nav">
          <ul>
            <li>Link 1</li>
            <li>Link 2</li>
            <li>Link 3</li>
          </ul>
        </div>
        <div className="main-content">{<ConnectKitButton />}</div>
        {isConnected && <Account />}
      </div>
      <footer>&copy; 2020</footer>
    </div>
  )
}
