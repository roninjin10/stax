import { Wallet } from 'ethers'
import fs from 'fs'

const addresses = []

const csv = [
  'address,a_is_voter,b_is_multisig_signer,c_is_gitcoin,d_is_active_bridged,e_op_user,f_op_repeat,num_categories,g_overlap_bonus_op,total_amount_op',
]
const ONE_OP = '1' + '0'.repeat(18)
const newLine = `[address],0,0,383272762631634812928,0,0,0,0,${ONE_OP}`

while (addresses.length < 25) {
  const { mnemonic, address, privateKey } = Wallet.createRandom()
  const opToClaim = ONE_OP
  addresses.push({ mnemonic: mnemonic.phrase, privateKey, address, opToClaim })
  csv.push(newLine.replace('[address]', address))
}

fs.writeFileSync('./keys.json', JSON.stringify(addresses, null, 2))
fs.writeFileSync('claim.csv', csv.join('\n'))
