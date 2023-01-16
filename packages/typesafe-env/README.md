<a href="https://twitter.com/fucory">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40fucory&style=social&url=https%3A%2F%2Ftwitter.com%2Ffucory" />
</a>

# Typesafe Env • [![CI](https://github.com/roninjin10/stax/actions/workflows/tests.yml/badge.svg)](https://github.com/roninjin10/stax/actions/workflows/tests.yml)

Simple package for creating typesafe envs. It is a very light wrapper around [zod](https://github.com/colinhacks/zod)

## Getting started

1. Install @roninjin10/typesafe-env

```bash
npm i @roninjin10/typesafe-env
```

2. Install peer dependencies

```bash
npm i zod
```

3. Import typesafeEnv and create validators

```typescript
import { typesafeEnv } from '@roninjin10/typesafe-env'
import { z } from 'zod'

export const validators = {
  // Provide a description if you want to automatically generate documentation
  SERVICE_URI: z.string().url().describe('The URI to connect to '),

  HOST: z.string().default('localhost').describe(`HOST server should connect to
Must be set to 0.0.0.0 in a docker container`),

  PORT: z
    .string()
    .transform((val) => Number.parseInt(val))
    .default('7300')
    .describe('PORT server should connect to'),
}

export const env = typesafeEnv(validators, process.env)

env.PORT // type number
env.HOST // type string
// @ts-expect-error
env.NOT_ON_ENV
```

You now have an env object that will be 100% typesafe with autocompletion in your editor! This will defend against misconfigurations.

### Automatically generate documentation

typesafe-env provides an easy way of turning your env validators into documentation

`envSchema.ts`

```typescript
import { validators } from './env'
import { generateEnvDocs } from '@roninjin10/typesafe-env'

console.log(generateEnvDocs(validators))
```

Then if you run `ts-node envSchema` you will get this printed to console

```
Environment Variables schema

SERVICE_URI
    The URI to connect to

HOST
    HOST server should connect to

PORT
    PORT server should ocnnect to
```

### Contributing

All of @roninjin10 is open to contributions! To get started follow these steps

1. Clone the repo
2. Install pnpm `npm install -g pnpm`
3. Install node modules `pnpm install`
4. Cd to typesafe-env `cd packages/typesafe-env`
5. Run the tests `pnpm test`
6. Run the build `pnpm build`

#### Author: Will Cory 👨🏻‍💻
