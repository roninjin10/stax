<a href="https://twitter.com/fucory">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40fucory&style=social&url=https%3A%2F%2Ftwitter.com%2Ffucory" />
</a>

# typesafe-growthbook

A light easy to configure typesafe wrapper around [@growthbook/react](https://docs.growthbook.io/) providing runtime validation and typesafety with [zod](https://github.com/colinhacks/zod)

## Getting started

1. Install @roninjin10/typesafe-growthbook

```bash
npm i @roninjin10/typesafe-growthbook
```

2. Install peer dependencies

```bash
npm i @growthbook/growthbook-react zod react
```

3. Specify your flags and initialize Growthbook

```typescript
import { flag, TypesafeGrowthbook } from '@roninjin10/typesafe-growthbook'

const flags = {
  myBoolFlag: flag.bool,
  myStringFLag: flag.string,
  myUrlFlag: flag.url,
  myNumberFlag: flag.number,
}

export const growthbook = new TypesafeGrowthbook(flags)
```

4. Initialize the react api

```typescript
export const { Provider, useFeature, IfFeatureEnabled, FeatureString } =
  initGrowthbookReact(growthbook)
```

You now have a version of growthbook that has full typesafety! The zod validators will validate your feature flags and throw an error if they are misconfigured.

All react hooks and growthbook methods will infer flag ids and value types from the flag object you provided!

## Flag validators

Flag validators are provided for all types of flags supported by growthbook.

- flag.bool
- flag.url
- flag.string
- flag.number
- flag.stringArray
- flag.numberArray

To make a JSON feature flag use [z.object from zod](https://zod.dev/?id=objects)

```typescript
import {z} from 'zod'

const flags = {
  myJsonFlag: z.object({
    ...
  })
}
```

## Creating a default fallback

Sometimes we don't want to crash the entire app when flag validation fails. In this case you can create a fallback value.

```typescript
import { flag } from '@roninjin10/typesafe-growthbook'
const flags = {
  backedUrl: flag.url().catch('http://default-url-fallback'),
}
```

## Creating an optional value

We can also create optional values with zod if the flag is optional

```typescript
import { flag } from '@roninjin10/typesafe-growthbook'
const flags = {
  backedUrl: flag.bool().optional(),
}
```

## Nullability

By default all feature flags have non nullable types.

## What's changed from growthbook

TypesafeGrowthbook is a typesafe wrapper around growthbook with no changes to the Growthbook API. It simply adds type safety.

Refer to the [growthbook docs](https://docs.growthbook.io/lib/js) for more information on their api

## Contributing

All of @roninjin10 is open to contributions! To get started follow these steps

1. Clone the repo
2. Install pnpm and nx `npm install -g pnpm nx`
3. Install node modules `pnpm install`
4. Cd to typesafe-env `cd packages/typesafe-env`
5. Run the tests `pnpm test`
6. Run the build `pnpm build`
7. Optionally spin up the example app `nx dev` or `docker-compose up`
8. Run only typesafe growthbook tests `nx test @roninjin10/typesafe-growthbook`

### Author: Will Cory 👨🏻‍💻
