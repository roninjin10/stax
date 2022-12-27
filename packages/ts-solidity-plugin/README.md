# ts-solidity-plugin

The ts solidity plugin provides useful functionality to optimize TypeScript development including

- a solidity native programming api
- auto completion
- type generation
- hook generation

This plugin has the following features:

- As TypeScript Language Service extension:
  - Completion suggestion
  - Get solidity diagnostics
  - Display solidity quick info within tooltip
- As CLI
  - Generate ts type files from solidity files
  - Extract + validate solidity code within your typescript files
- As rollup plugin
  - Transform your solidity directly to abis statically
  - Transform your solidity directly to wagmi hooks

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
  - [`localSchemaExtensions`](#localschemaextensions)
  - [`typegen.addons`](#typegenaddons)
  - [`removeDuplicatedFragments`](#removeduplicatedfragments)
- [Built-in Type Generator Addons](#built-in-type-generator-addons)
  - [`typed-query-document`](#typed-query-document)
- [webpack custom transformer](#webpack-custom-transformer)
  - [webpack plugin options](#webpack-plugin-options)
    - [`tsconfigPath` optional](#tsconfigpath-optional)
  - [Transformer options](#transformer-options)
    - [`removeFragmentDefinitions` optional](#removefragmentdefinitions-optional)
    - [`documentTransformers` optional](#documenttransformers-optional)
- [Template strings](#template-strings)
- [Available editors](#available-editors)
- [Version compatibility](#version-compatibility)
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
