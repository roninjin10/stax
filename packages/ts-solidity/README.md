# ts-solidity-plugin

The ts solidity library along with the ts-solidity-plugin provides
a familiar and powerful api for programming blockhain applications
in typescript by plugging into foundry both serverside and clientside.

You can read from blockchain via writing arbitrary solidity code

```ts
import { sol } from '@stax/ts-sol'
import detectEthereumProvider from '@metamask/detect-provider'

const { query } = sol.initResolvers({
  provider: await detectEthereumProvider(),
})

const balanceQuery = sol`
function balance() {
  uint256 account = vm.envUint("account");
  return address(account).balance
}
`
const result = await query(balanceQuery, {
  env: {
    account: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
  },
})
console.log(result.txHash)
console.log(result.data.balance)
```

In mutations any transaction that gets sent will be sent by the signer

```ts
import { sol } from '@stax/ts-sol'
import detectEthereumProvider from '@metamask/detect-provider'
import { MyERC20 } from '../contracts/myERC20.sol'

const { mutate } = sol.initResolvers({
  signers: [await detectEthereumProvider()],
})

// to write to blockchain simply write a forge style script
const transferAll = sol.import({
  MyERC20,
}).sol`
function transferAll() external {
  # sol signer is a special env variable passed into every mutation
  uint256 solSigner = vm.envUint('SIGNERS[0]');
  vm.startBroadcast(solSigner);
  uint256 contractAddress = vm.envUint('contractAddress');
  uint256 recipient = vm.envUint('recipient');
  MyERC20Contract contract = MyERC20Contract(contractAddress);
  uint256 totalBalance = contract.balanceOf(address(solSigner));
  contract.safeTransfer(msg.sender, amount);
  vm.stopBroadcast()
}
`
const provider = await detectEthereumProvider()
const result = await mutate(transferAll, {
  env: {
    recipient: '0xab5801a7d398351b8be11c439e05c5b3259aec9b',
  },
})
console.log(result.txHash)
```

## ToC

<!-- toc -->

- [Getting started](#getting-started)
- [CLI Usage](#cli-usage)
  - [`typegen` command](#typegen-command)
  - [`extract` command](#extract-command)
  - [`validate` command](#validate-command)
  - [`report` command](#report-command)
- [Plugin options](#plugin-options)
  - [`schema`](#schema)
  - [`tag`](#tag)
- [Template strings](#template-strings)
- [Available editors](#available-editors)
- [Contributing](#contributing)
- [License](#license)

<!-- tocstop -->

## Getting started

First, confirm that your project has foundry installed.

To install this foundry visit https://github.com/foundry-rs/foundry#installing-from-source

````

And configure `plugins` section in your tsconfig.json, for example:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "plugins": [
      {
        "name": "ts-solidity-plugin",
        "foundry-config": "path/to/foundry.toml",
      }
    ]
  }
}
````

It's ready to go. Launch your TypeScript IDE.

## CLI Usage

```sh
$ npx ts-solidity-plugin <command> [options]
```

If you install this plugin, a short alias `tssol` is also available instead of `ts-solidity-plugin`.

Available commands are `typegen`, `extract`, and `validate`. If you want more detail, run`ts-solidity-plugin --help`or`ts-solidity-plugin <command> --help` in your console.

### `typegen` command

Generate TypeScript types from solidity files and template strings in ts files [Here is an output example](https://github.com/roninjin10/ts-solidity-plugin/blob/main/project-fixtures/react-apollo-prj/src/__generated__/git-hub-query.ts).

### `extract` command

Extracts Solidity from ts files and writes them to `manifest.json`.

### `validate` command

Validates your solidity code in your ts files and report syntax or semantic errors.

## Plugin options

Pass plugin options to your tsconfig.json to configure this plugin.

```js
/* tsconfig.json */
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "ts-solidity-plugin",
        /* plugin options */
        "foundry-config": "path/to/foundry.toml",
        ...
      }
    ]
  }
}
```

### `foundry-config`

It's a required parameter and should point your foundry-toml file `

### `tag`

Comma seperated list of tags that include solidity template strings.

It's optional. When it's set, this plugin works only if the target template string is tagged by a function whose name is equal to this parameter.

If not set, this plugin will default to sol

For example if you set tag=s:

```ts
import { sol as s } from '@stax/ts-sol'

// when tag param is sol'
const deployMutation = s`
function mutate() external {
    uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
    vm.startBroadcast(deployerPrivateKey);
    AppEntrypoint appEntrypoint = new AppEntrypoint();
    vm.stopBroadcast();
}
` // work
const str2 = `<div></div>` // don't work
const str3 = otherTagFn`foooo` // don't work
```

It's useful to write multiple kinds template strings(e.g. one is Angular Component template, another is Apollo GraphQL query).

## Available editors

TODO check the operation with the following editors:

- Visual Studio Code
- Vim (with tsuquyomi)
- Emacs
- Sublime text
- Eclipse

## Version compatibility

## Contributing

See [contribution guide](CONTRIBUTING.md).

## License

This software is released under the MIT License, see LICENSE.txt.
