<a href="https://twitter.com/roninjin10">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40roninjin10&style=social&url=https%3A%2F%2Ftwitter.com%2Falexdotjs" />
</a>

# Server Boilerplate

Boilerplate for scaffolding scalable production ready servers

## Technologies

- [tRPC](https://trpc.io)
- [fastify](https://www.fastify.io/)
- [prisma](https://www.prisma.io/)
- [zod](https://github.com/colinhacks/zod)
- [tRPC-playground](https://github.com/sachinraja/trpc-playground)
- [fastify-metrics](https://github.com/SkeLLLa/fastify-metrics)
- [pnpm](https://pnpm.io/)

### TRPC

TRPC is the easiest way to build robust typesafe APIs for typescript clients.

<figure>
    <img src="https://assets.trpc.io/www/v10/v10-dark-landscape.gif" alt="Demo" />
    <figcaption>
      <p align="center">
        The client above is <strong>not</strong> importing any code from the server, only its type declarations.
      </p>
    </figcaption>
</figure>

### Fastify

Fastify is a highly peformant server that replaces express. With minor modifications this server will work with express, aws lambdas, next.js or any other way of using the trpc server that trpc supports.

### Prisma

Prisma is a typesafe way of interacting with a db.

### Pnpm

PNPM is an npm/yarn alternative that is much faster.

## Development

Run server in watch mode

```bash
yarn start
```

Build and start server

```bash
yarn build && yarn serve
```

Lint with prettier and eslint

```bash
yarn lint:fix
```

Explore prisma cli

```bash
npx prisma
```

### Metrics

Metrics for all routes are automatically served at /metrics

### Playground / Docs

Docs for all trpc routes along with a playground are automatically served at /playground

<img width="1724" alt="image" src="https://user-images.githubusercontent.com/35039927/210158427-06161895-088f-4519-8b05-2cfcd77cd655.png">

### Routes

For an example of defining a route checkout `src/routes/hello`. The route is registered on the api at `src/Api.ts`

### Zod

For typesafe validation for things like env variables or outside user input I recomend using [zod](https://github.com/colinhacks/zod). TRPC routes by default use zod.

#### Author: Will Cory 👨🏻‍💻
