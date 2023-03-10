# babel-plugin-sol

A babel plugin for transpiling template string solidity from ts-sol

## Usage

### Install this package

_Currently not published to npm_

```bash
pnpm i @roninjin10/babel-plugin-sol
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

ts-sol contains the code that runs at runtime

```bash
pnpm i @roninjin10/ts-sol
```

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
