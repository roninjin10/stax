# babel-plugin-sol

**Note this is just a proof of concept and will change heavily in future versions**

A babel plugin for transpiling template string solidity from ts-sol

## Usage

To use you must add the ts-sol babel plugin

### Install dependencies

_Currently not published to npm as it's experimental_

```bash
pnpm i @roninin10/ts-sol @roninjin10/babel-plugin-sol
```

### Add to babel.config.js

```typescript
export default (api) => {
  return {
    plugins: ['@roninjin10/babel-plugin-sol'],
  }
}
```

### Now you can write solidity with ts-sol

```typescript
import { run, tsSol } from '@roninjin10/ts-sol'
import { useState } from 'react'

const forgeScript = tsSol`
contract Script {
    function run() external returns (string memory) {
        return "Hello, World!";
    }
}
`
const sayHello = (): Promise<string> => run(forgeScript)
```
