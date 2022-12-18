import { Common } from '@ethereumjs/common'
import { HardforkConfig } from '@ethereumjs/common/src/types'
import { setLengthRight, BN } from 'ethereumjs-util'
import { IReferenceItem } from 'types'

const namespaces = ['gasPrices']
const reFences = /{(.+)}/
const reGasVariable = /\{\s*[a-zA-Z0-9_|]*\s*\}/g

function toWordSize(a: BN): BN {
  const wordSize = new BN(32)
  const div = a.div(wordSize)
  const mod = a.mod(wordSize)

  // Fast case - exact division
  if (mod.isZero()) {
    return div
  }

  // Round up
  return div.isNeg() ? div.isubn(1) : div.iaddn(1)
}

function memoryCost(wordSize: BN, common: Common): BN {
  const fee = Number(common.param('gasPrices', 'memory'))
  const quadCoeff = Number(common.param('gasPrices', 'quadCoeffDiv'))
  return wordSize.muln(fee).add(wordSize.mul(wordSize).divn(quadCoeff))
}

function memoryExtensionCost(
  offset: BN,
  byteSize: BN,
  currentMemorySize: BN,
  common: Common,
): BN {
  if (byteSize.isZero()) {
    return byteSize
  }

  const newMemoryWordSize = toWordSize(offset.add(byteSize))
  const oldMemoryWordSize = toWordSize(currentMemorySize)
  if (newMemoryWordSize.lte(oldMemoryWordSize)) {
    return new BN(0)
  }

  const newCost = memoryCost(newMemoryWordSize, common)
  const oldCost = memoryCost(oldMemoryWordSize, common)
  if (newCost.gt(oldCost)) {
    newCost.isub(oldCost)
  }
  return newCost
}

function memoryCostCopy(inputs: any, param: string, common: Common): BN {
  const paramWordCost = new BN(Number(common.param('gasPrices', param)))
  const expansionCost = memoryExtensionCost(
    new BN(inputs.offset),
    new BN(inputs.size),
    new BN(inputs.memorySize),
    common,
  )
  return expansionCost.iadd(paramWordCost.mul(toWordSize(new BN(inputs.size))))
}

function addressAccessCost(common: Common, inputs: any): BN {
  if (inputs.cold === '1') {
    return new BN(Number(common.param('gasPrices', 'coldaccountaccess')))
  } else {
    return new BN(Number(common.param('gasPrices', 'warmstorageread')))
  }
}

function sstoreCost(common: Common, inputs: any): BN {
  if (common.hardfork() === 'constantinople') {
    if (inputs.newValue === inputs.currentValue) {
      return new BN(Number(common.param('gasPrices', 'netSstoreNoopGas')))
    } else if (inputs.currentValue === inputs.originalValue) {
      if (inputs.originalValue === '0') {
        return new BN(Number(common.param('gasPrices', 'netSstoreInitGas')))
      } else {
        return new BN(Number(common.param('gasPrices', 'netSstoreCleanGas')))
      }
    } else {
      return new BN(Number(common.param('gasPrices', 'netSstoreDirtyGas')))
    }
  } else if (common.gteHardfork('istanbul')) {
    if (inputs.newValue === inputs.currentValue) {
      if (common.gteHardfork('berlin') && inputs.cold !== '1') {
        return new BN(Number(common.param('gasPrices', 'warmstorageread')))
      } else {
        return new BN(Number(common.param('gasPrices', 'sstoreNoopGasEIP2200')))
      }
    } else if (inputs.currentValue === inputs.originalValue) {
      if (inputs.originalValue === '0') {
        return new BN(Number(common.param('gasPrices', 'sstoreInitGasEIP2200')))
      } else {
        return new BN(
          Number(common.param('gasPrices', 'sstoreCleanGasEIP2200')),
        )
      }
    } else {
      return new BN(Number(common.param('gasPrices', 'sstoreDirtyGasEIP2200')))
    }
  } else {
    if (inputs.newValue !== '0' && inputs.currentValue === '0') {
      return new BN(Number(common.param('gasPrices', 'sstoreSet')))
    } else {
      return new BN(Number(common.param('gasPrices', 'sstoreReset')))
    }
  }
}

function createCost(common: Common, inputs: any): BN {
  const expansionCost = memoryExtensionCost(
    new BN(inputs.offset),
    new BN(inputs.size),
    new BN(inputs.memorySize),
    common,
  )
  const depositCost = new BN(inputs.deployedSize).imuln(
    Number(common.param('gasPrices', 'createData')),
  )
  return expansionCost.iadd(depositCost).iadd(new BN(inputs.executionCost))
}

function callCost(common: Common, inputs: any): BN {
  const argsOffset = new BN(inputs.argsOffset)
  const argsSize = new BN(inputs.argsSize)
  const retOffset = new BN(inputs.retOffset)
  const retSize = new BN(inputs.retSize)
  let result = null

  if (argsOffset.add(argsSize).gt(retOffset.add(retSize))) {
    result = memoryExtensionCost(
      argsOffset,
      argsSize,
      new BN(inputs.memorySize),
      common,
    )
  } else {
    result = memoryExtensionCost(
      retOffset,
      retSize,
      new BN(inputs.memorySize),
      common,
    )
  }

  result.iadd(new BN(inputs.executionCost))

  if (typeof inputs.value !== 'undefined' && inputs.value !== '0') {
    result.iaddn(Number(common.param('gasPrices', 'callValueTransfer')))
    result.isubn(Number(common.param('gasPrices', 'callStipend')))
  }

  if (common.gteHardfork('spuriousDragon')) {
    if (inputs.empty === '1' && inputs.value !== '0') {
      result.iadd(new BN(Number(common.param('gasPrices', 'callNewAccount'))))
    }
  } else if (inputs.empty === '1') {
    result.iadd(new BN(Number(common.param('gasPrices', 'callNewAccount'))))
  }

  if (common.gteHardfork('berlin')) {
    result.iadd(addressAccessCost(common, inputs))
  }

  return result
}

export const calculateDynamicFee = (
  opcodeOrPrecompiled: IReferenceItem,
  common: Common,
  inputs: any,
) => {
  if (opcodeOrPrecompiled.opcodeOrAddress.startsWith('0x')) {
    return calculatePrecompiledDynamicFee(opcodeOrPrecompiled, common, inputs)
  } else {
    return calculateOpcodeDynamicFee(opcodeOrPrecompiled, common, inputs)
  }
}

export const calculateDynamicRefund = (
  opcode: IReferenceItem,
  common: Common,
  inputs: any,
) => {
  let result = null
  switch (opcode.opcodeOrAddress) {
    case '55': {
      if (common.hardfork() === 'constantinople') {
        if (inputs.newValue === inputs.currentValue) {
          result = new BN(0)
        } else if (inputs.currentValue === inputs.originalValue) {
          if (inputs.originalValue !== '0' && inputs.newValue === '0') {
            result = new BN(
              Number(common.param('gasPrices', 'netSstoreClearRefund')),
            )
          } else {
            result = new BN(0)
          }
        } else {
          result = new BN(0)
          if (inputs.originalValue !== '0') {
            if (inputs.currentValue === '0') {
              result.isubn(
                Number(common.param('gasPrices', 'netSstoreClearRefund')),
              )
            } else if (inputs.newValue === '0') {
              result.iaddn(
                Number(common.param('gasPrices', 'netSstoreClearRefund')),
              )
            }
          }
          if (inputs.newValue === inputs.originalValue) {
            if (inputs.originalValue === '0') {
              result.iaddn(
                Number(common.param('gasPrices', 'netSstoreResetClearRefund')),
              )
            } else {
              result.iaddn(
                Number(common.param('gasPrices', 'netSstoreResetRefund')),
              )
            }
          }
        }
      } else if (common.gteHardfork('istanbul')) {
        if (inputs.newValue === inputs.currentValue) {
          result = new BN(0)
        } else if (inputs.currentValue === inputs.originalValue) {
          if (inputs.originalValue !== '0' && inputs.newValue === '0') {
            result = new BN(
              Number(common.param('gasPrices', 'sstoreClearRefundEIP2200')),
            )
          } else {
            result = new BN(0)
          }
        } else {
          result = new BN(0)
          if (inputs.originalValue !== '0') {
            if (inputs.currentValue === '0') {
              result.isubn(
                Number(common.param('gasPrices', 'sstoreClearRefundEIP2200')),
              )
            } else if (inputs.newValue === '0') {
              result.iaddn(
                Number(common.param('gasPrices', 'sstoreClearRefundEIP2200')),
              )
            }
          }
          if (inputs.newValue === inputs.originalValue) {
            if (inputs.originalValue === '0') {
              if (common.gteHardfork('berlin') && inputs.cold !== '1') {
                result
                  .iaddn(
                    Number(common.param('gasPrices', 'sstoreInitGasEIP2200')),
                  )
                  .isubn(Number(common.param('gasPrices', 'warmstorageread')))
              } else {
                result.iaddn(
                  Number(common.param('gasPrices', 'sstoreInitRefundEIP2200')),
                )
              }
            } else {
              if (common.gteHardfork('berlin') && inputs.cold !== '1') {
                result
                  .iaddn(Number(common.param('gasPrices', 'sstoreReset')))
                  .isubn(Number(common.param('gasPrices', 'coldsload')))
                  .isubn(Number(common.param('gasPrices', 'warmstorageread')))
              } else {
                result.iaddn(
                  Number(common.param('gasPrices', 'sstoreCleanRefundEIP2200')),
                )
              }
            }
          }
        }
      } else {
        if (inputs.newValue === '0' && inputs.currentValue !== '0') {
          result = new BN(Number(common.param('gasPrices', 'sstoreRefund')))
        } else {
          result = new BN(0)
        }
      }
      break
    }
    case 'ff': {
      if (common.gteHardfork('london')) {
        return null
      } else {
        result = new BN(Number(common.param('gasPrices', 'selfdestructRefund')))
      }
      break
    }
    default:
      return null
  }
  return result.toString()
}

/*
 * Calculates dynamic gas fee
 *
 * @param opcode The IReferenceItem
 * @param common The Common object
 * @param inputs The Object of user inputs based on the `dynamicFee` inputs
 *                 in the opcodes.json. If empty, we want to return the minimum fee for that code.
 *
 * @returns The String representation of the gas fee.
 *
 * Fee calculation is based on the ethereumjs-vm functions,
 * See: https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/evm/opcodes/functions.ts
 */
export const calculateOpcodeDynamicFee = (
  opcode: IReferenceItem,
  common: Common,
  inputs: any,
) => {
  let result = null
  switch (opcode.opcodeOrAddress) {
    case '0a': {
      const exponent = new BN(inputs.exponent)
      const gasPrice = Number(common.param('gasPrices', 'expByte'))
      result = new BN(exponent.byteLength()).imuln(gasPrice)
      break
    }
    case '20': {
      result = memoryCostCopy(inputs, 'sha3Word', common)
      break
    }
    case '31':
    case '3b':
    case '3f': {
      if (common.gteHardfork('berlin')) {
        result = addressAccessCost(common, inputs)
      } else {
        result = new BN(0)
      }
      break
    }
    case '37':
    case '39':
    case '3e': {
      result = memoryCostCopy(inputs, 'copy', common)
      break
    }
    case '3c': {
      result = memoryCostCopy(inputs, 'copy', common)

      if (common.gteHardfork('berlin')) {
        result.iadd(addressAccessCost(common, inputs))
      }
      break
    }
    case '51':
    case '52': {
      // If no value is provided, we want a value that gives us the minimum cost
      result = memoryExtensionCost(
        new BN(inputs.offset),
        new BN(32),
        new BN(inputs.memorySize || 32),
        common,
      )
      break
    }
    case '53': {
      // If no value is provided, we want a value that gives us the minimum cost
      result = memoryExtensionCost(
        new BN(inputs.offset),
        new BN(1),
        new BN(inputs.memorySize || 32),
        common,
      )
      break
    }
    case '54': {
      if (common.gteHardfork('berlin')) {
        if (inputs.cold === '1') {
          result = new BN(Number(common.param('gasPrices', 'coldsload')))
        } else {
          result = new BN(Number(common.param('gasPrices', 'warmstorageread')))
        }
      } else {
        result = new BN(0)
      }
      break
    }
    case '55': {
      result = sstoreCost(common, inputs)

      if (common.gteHardfork('berlin') && inputs.cold === '1') {
        result.iaddn(Number(common.param('gasPrices', 'coldsload')))
      }
      break
    }
    case 'a0':
    case 'a1':
    case 'a2':
    case 'a3':
    case 'a4': {
      const topicsCount = new BN(opcode.opcodeOrAddress, 'hex').isubn(0xa0)
      const expansionCost = memoryExtensionCost(
        new BN(inputs.offset),
        new BN(inputs.size),
        new BN(inputs.memorySize),
        common,
      )
      result = new BN(Number(common.param('gasPrices', 'logTopic')))
        .imul(topicsCount)
        .iadd(expansionCost)
        .iadd(
          new BN(inputs.size).muln(
            Number(common.param('gasPrices', 'logData')),
          ),
        )
      break
    }
    case 'f0': {
      result = createCost(common, inputs)
      break
    }
    case 'f1':
    case 'f2':
    case 'f4':
    case 'fa': {
      result = callCost(common, inputs)
      break
    }
    case 'f3':
    case 'fd': {
      result = memoryExtensionCost(
        new BN(inputs.offset),
        new BN(inputs.size),
        new BN(inputs.memorySize),
        common,
      )
      break
    }
    case 'f5': {
      result = createCost(common, inputs).iadd(
        toWordSize(new BN(inputs.size)).imuln(
          Number(common.param('gasPrices', 'sha3Word')),
        ),
      )
      break
    }
    case 'fe': {
      // If no value is provided, we want a value that gives us the minimum cost, which in this case is everything
      if (inputs.remaining) {
        result = new BN(inputs.remaining)
      } else {
        return 'NaN'
      }
      break
    }
    case 'ff': {
      if (inputs.empty === '1' && inputs.hasNoBalance !== '1') {
        result = new BN(Number(common.param('gasPrices', 'callNewAccount')))
      } else {
        result = new BN(0)
      }

      if (common.gteHardfork('berlin') && inputs.cold === '1') {
        result.iaddn(Number(common.param('gasPrices', 'coldaccountaccess')))
      }
      break
    }
    default:
      result = new BN(0)
  }

  return result.iaddn(opcode.staticFee || 0).toString()
}

function getAdjustedExponentLength(exponent: BN): BN {
  const expLen = new BN(exponent.byteLength())
  let firstExpBytes = Buffer.from(exponent.toArray().slice(0, 32)) // first word of the exponent data
  firstExpBytes = setLengthRight(firstExpBytes, 32) // reading past the data reads virtual zeros
  let firstExpBN = new BN(firstExpBytes)
  let max32expLen = 0
  if (expLen.ltn(32)) {
    max32expLen = 32 - expLen.toNumber()
  }
  firstExpBN = firstExpBN.shrn(8 * Math.max(max32expLen, 0))

  let bitLen = -1
  while (firstExpBN.gtn(0)) {
    bitLen = bitLen + 1
    firstExpBN = firstExpBN.ushrn(1)
  }
  let expLenMinus32OrZero = expLen.subn(32)
  if (expLenMinus32OrZero.ltn(0)) {
    expLenMinus32OrZero = new BN(0)
  }
  const eightTimesExpLenMinus32OrZero = expLenMinus32OrZero.muln(8)
  const adjustedExpLen = eightTimesExpLenMinus32OrZero
  if (bitLen > 0) {
    adjustedExpLen.iaddn(bitLen)
  }
  return adjustedExpLen
}

function multComplexity(x: BN): BN {
  let fac1
  let fac2
  if (x.lten(64)) {
    return x.sqr()
  } else if (x.lten(1024)) {
    // return Math.floor(Math.pow(x, 2) / 4) + 96 * x - 3072
    fac1 = x.sqr().divn(4)
    fac2 = x.muln(96)
    return fac1.add(fac2).subn(3072)
  } else {
    // return Math.floor(Math.pow(x, 2) / 16) + 480 * x - 199680
    fac1 = x.sqr().divn(16)
    fac2 = x.muln(480)
    return fac1.add(fac2).subn(199680)
  }
}

function multComplexityEIP2565(x: BN): BN {
  const words = x.addn(7).divn(8)
  return words.mul(words)
}

/*
 * Calculates dynamic gas fee for precompiled contracts
 *
 * @param opcode The IReferenceItem
 * @param common The Common object
 * @param inputs The Object of user inputs based on the `dynamicFee` inputs
 *                 in the precompiled.json. If empty, we want to return the minimum fee for that code.
 *
 * @returns The String representation of the gas fee.
 *
 * Fee calculation is based on the ethereumjs-vm functions,
 * See: https://github.com/ethereumjs/ethereumjs-monorepo/blob/master/packages/vm/src/evm/precompiles/index.ts
 */
export const calculatePrecompiledDynamicFee = (
  precompiled: IReferenceItem,
  common: Common,
  inputs: any,
) => {
  let result = null
  switch (precompiled.opcodeOrAddress) {
    case '0x01': {
      result = new BN(Number(common.param('gasPrices', 'ecRecover')))
      break
    }
    case '0x02': {
      result = toWordSize(new BN(inputs.size))
        .imuln(Number(common.param('gasPrices', 'sha256Word')))
        .iaddn(Number(common.param('gasPrices', 'sha256')))
      break
    }
    case '0x03': {
      result = toWordSize(new BN(inputs.size))
        .imuln(Number(common.param('gasPrices', 'ripemd160Word')))
        .iaddn(Number(common.param('gasPrices', 'ripemd160')))
      break
    }
    case '0x04': {
      result = toWordSize(new BN(inputs.size))
        .imuln(Number(common.param('gasPrices', 'identityWord')))
        .iaddn(Number(common.param('gasPrices', 'identity')))
      break
    }
    case '0x05': {
      const Gquaddivisor = Number(
        common.param('gasPrices', 'modexpGquaddivisor'),
      )
      result = getAdjustedExponentLength(new BN(inputs.exponent))

      let maxLen = new BN(inputs.Bsize)
      const mLen = new BN(inputs.Msize)
      if (maxLen.lt(mLen)) {
        maxLen = mLen
      }

      if (common.gteHardfork('berlin')) {
        result.imul(multComplexityEIP2565(maxLen)).divn(Gquaddivisor)
        if (result.ltn(200)) {
          result = new BN(200)
        }
      } else {
        result.imul(multComplexity(maxLen)).divn(Gquaddivisor)
      }
      break
    }
    case '0x06': {
      if (inputs.invalid === '1') {
        result = new BN(inputs.remaining)
      } else {
        result = new BN(Number(common.param('gasPrices', 'ecAdd')))
      }
      break
    }
    case '0x07': {
      if (inputs.invalid === '1') {
        result = new BN(inputs.remaining)
      } else {
        result = new BN(Number(common.param('gasPrices', 'ecMul')))
      }
      break
    }
    case '0x08': {
      const inputDataSize = Math.floor(parseInt(inputs.size || 0) / 192)
      result = new BN(
        Number(common.param('gasPrices', 'ecPairing')) +
          inputDataSize * Number(common.param('gasPrices', 'ecPairingWord')),
      )
      break
    }
    case '0x09': {
      result = new BN(Number(common.param('gasPrices', 'blake2Round')))
      result.imul(new BN(inputs.rounds))
      break
    }
    default:
      return 'Missing precompiled'
  }

  return result.toString()
}

/*
 * Parses string and replaces all dynamic gas price occurrences
 *
 * @param common The Common object
 * @param contents The String to process
 *
 * @returns The String with gas prices replaced.
 */
export const parseGasPrices = (common: Common, contents: string) => {
  return contents.replace(reGasVariable, (str) => {
    const value = str.match(reFences)
    if (!value?.[1]) {
      return str
    }

    const [namespace, key] = value[1].split('|')
    if (!namespaces.includes(namespace) || !key) {
      return str
    }

    if (namespace === 'gasPrices') {
      const gasPrice = common.param('gasPrices', key)
      return gasPrice.toString()
    }
    return str
  })
}

/*
 * Finds matching fork name from the list
 *
 * @param forks The Array of known Hardforks
 * @param forkNames The Array of string fork names to match against
 * @param selectedFork The Hardfork selected by the user
 */
export const findMatchingForkName = (
  forks: HardforkConfig[],
  forkNames: string[],
  selectedFork: HardforkConfig | undefined,
) => {
  // get all known forks mapped to a block number
  const knownForksWithBlocks = forks.reduce(
    (res: { [forkName: string]: number }, fork: HardforkConfig) => {
      if (fork.block) {
        res[fork.name] = fork.block
      }
      return res
    },
    {},
  )

  // filter all forks with block number below or equal to the selected,
  // sort in descending order and pick the first found
  let foundFork: string = forkNames
    .filter(
      (forkName) =>
        knownForksWithBlocks[forkName] <= (selectedFork?.block || 0),
    )
    .sort((a, b) => knownForksWithBlocks[b] - knownForksWithBlocks[a])[0]

  // NOTE: Petersburg and Constantinople have the same block number & hash,
  // so when both are present, Constantinople is picked, so this handles it.
  if (
    selectedFork?.name === 'petersburg' &&
    forkNames.includes(selectedFork?.name)
  ) {
    foundFork = selectedFork?.name
  }

  return foundFork
}
