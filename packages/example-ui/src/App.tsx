import { abi as counterAbi } from '@roninjin10/contracts/dist/Counter.sol/Counter.json'
import { ConnectKitButton } from 'connectkit'
import { useAccount, usePrepareContractWrite } from 'wagmi'

import {
  mainContentStyle,
  navbarLiAStyle,
  navbarLiStyle,
  navbarStyle,
  navbarUlStyle,
  sideNavLiStyle,
  sideNavStyle,
  sideNavUlStyle,
} from './App.css'
import { Account } from './components/Account'

export const App = () => {
  const { isConnected } = useAccount()
  const { config } = usePrepareContractWrite({
    abi: counterAbi,
  })
  return (
    <div>
      <div className={navbarStyle}>
        <ul className={navbarUlStyle}>
          <li className={navbarLiStyle}>
            <a className={navbarLiAStyle}>Home</a>
          </li>
          <li className={navbarLiStyle}>
            <a className={navbarLiAStyle}>About</a>
          </li>
          <li className={navbarLiStyle}>
            <a className={navbarLiAStyle}>Contact</a>
          </li>
        </ul>
      </div>
      <div className="container">
        <div className={sideNavStyle}>
          <ul className={sideNavUlStyle}>
            <li className={sideNavLiStyle}>Link 1</li>
            <li className={sideNavLiStyle}>Link 2</li>
            <li className={sideNavLiStyle}>Link 3</li>
          </ul>
          <div className={mainContentStyle}>{<ConnectKitButton />}</div>
          {isConnected && <Account />}
        </div>
      </div>
    </div>
  )
}
