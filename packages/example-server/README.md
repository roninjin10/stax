<a href="https://twitter.com/fucory">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40fucory&style=social&url=https%3A%2F%2Ftwitter.com%2Ffucory" />
</a>

# Server Boilerplate

Simple opinionated boilerplate for scaffolding scalable production ready servers.

This boilerplate optimizes for typesafety while building internal APIs consumed by typescript.

Note: This boilerplate can work as an external facing API if using Open API as described later in README

## Getting started

1. Install the required prereqs

- requires node 18 (recomend using [nvm](https://github.com/nvm-sh/nvm))
- requires pnpm `node install -g pnpm`

2. View env options `pnpm envSchema`

3. Start the server `pnpm start`

4. View the docs/playground at [localhost:7300](http://localhost:7300)

5. Try making a change to the hello route at [HelloRoute.ts](https://github.com/roninjin10/server-boilerplate/blob/master/src/routes/HelloRoute.ts)

## Technologies

- [typescript](https://www.typescriptlang.org/)
- [tRPC](https://trpc.io) for typesafe routes
- [tRPC-playground](https://github.com/sachinraja/trpc-playground) for automatic doc generation
- [fastify](https://www.fastify.io/) for a peformant server
- [fastify-metrics](https://github.com/SkeLLLa/fastify-metrics) for automatic metrics
- [prisma](https://www.prisma.io/) for typesafe database connections
- [pnpm](https://pnpm.io/) for fast node module installation
- [nvm](https://github.com/nvm-sh/nvm) for consistent node versions locally and on CI
- [zod](https://github.com/colinhacks/zod) for typesafety
- [preconstruct](https://preconstruct.tools/guides/building-typescript-packages) for generating packages to be consumed in monorepo or on npm
- [docker](https://www.docker.com/) as an optional way to deploy app
- [github actions](https://docs.github.com/en/actions) for basic CI/CD
- [prettier](https://prettier.io/) for code formatting
- [eslint](https://eslint.org/docs/latest/) for linting
- [babel](https://babeljs.io/) for faster compiles than tsc

### Typescript

Typescript allows javascript code to be statically analyzed based on it's types.

This boilerplate heavily optimizes for typesafety with other tools such as Zod, TRPC, and Prisma.

Note we do not compile our code with typescript as typechecking can be slow as projects grow and instead do typechecking seperately as a lint step with `yarn typecheck` while using babel to compile the code faster

Typescript is configured in [tsconfig](https://github.com/roninjin10/server-boilerplate/blob/master/tsconfig.json)

The current typescript config is the most strict typescript config possible. Even stricter than strict mode. Typescript specific eslint rules are also included.

### TRPC

TRPC is the easiest way to build robust typesafe APIs for typescript clients. https://trpc.io

Trpc is wrapped internally at [`src/utils/Trpc.ts`](https://github.com/roninjin10/server-boilerplate/blob/master/src/utils/Trpc.ts)

<figure>
    <img src="https://assets.trpc.io/www/v10/v10-dark-landscape.gif" alt="Demo" />
    <figcaption>
      <p align="center">
        The client above is <strong>not</strong> importing any code from the server, only its type declarations.
      </p>
    </figcaption>
</figure>

### tRPC playground

Docs for all trpc routes along with a playground are automatically served at /playground. https://github.com/sachinraja/trpc-playground

Trpc playground is configured by the server in [`src/Server.ts`](https://github.com/roninjin10/server-boilerplate/blob/master/src/Server.ts#l30)

<img width="1724" alt="image" src="https://user-images.githubusercontent.com/35039927/210158427-06161895-088f-4519-8b05-2cfcd77cd655.png">

### Fastify

Fastify is a highly peformant server that replaces express. With minor modifications this server will work with express, aws lambdas, next.js or any other way of using the trpc server that trpc supports. https://www.fastify.io/.

Fastify is wrapped at [`src/utils/Fastify.ts](https://github.com/roninjin10/server-boilerplate/blob/master/src/utils/Fastify.ts)

### Fastify Metrics

Metrics for all routes are automatically served at /metrics. https://github.com/SkeLLLa/fastify-metrics

Metrics are configured by server in [`src/Server.ts`](https://github.com/roninjin10/server-boilerplate/blob/master/src/Server.ts#L30)

### Prisma

Prisma is a typesafe way of interacting with a db. https://www.prisma.io/.

To start using prisma simply run the prisma cli command to get started. Prisma will automatically generate a prisma client that you can use in your routes

```bash
npx prisma
```

### Pnpm

PNPM is an npm/yarn alternative that is much faster. https://pnpm.io/ .

The commands are for the most part the same as NPM.

### Nvm

Nvm is a way to guarantee everything is using the same version of node. This is useful for eliminating an entire class of bugs.
Engines in package.json will warn if node version does not match.
Install nvm and run `nvm use` to automatically be on correct version.

### Zod

Zod is an amazing tool to validate unvalidated input into typesafe values. https://github.com/colinhacks/zod.

It is used to validate routes and create automatic typesafe clients for any typescript clients using the service.

### Preconstruct

Preconstruct is a very simple but robust nearly 0 config tool to build typescript packages for npm distribution. All the config lives in `package.json`.

Preconstruct will generate types, commonjs javascript, and esm modules along with .d.ts type files ready to be distributed by npm or consumed by other packages in a monorepo https://preconstruct.tools/guides/building-typescript-packages

### Docker

Docker is a popular tool for deploying predictable builds including the system it's running on. A docker image is supported to be ran just about everywhere

A [Dockerfile](https://github.com/roninjin10/server-boilerplate/blob/master/Dockerfile) is included along with a [Workflow](https://github.com/roninjin10/server-boilerplate/blob/master/.github/workflows/docker.yml) for automatically publishing to dockerhub.

### Github actions

Github actions are simple yml files that allow us to trigger workflows to run on certain github events. They are configured in .github folder

### Prettier

Prettier is a tool for formatting code with a consistent style.
Prettier is configured in [.prettierrc](https://github.com/roninjin10/server-boilerplate/blob/master/.prettierrc)

### eslint

Eslint is a tool for linting JavaScript code.  
Eslint is configured in [.eslintrc.js](https://github.com/roninjin10/server-boilerplate/blob/master/.eslintrc.js)

The included eslint config prefers rules with autofixers and rules that can catch actual bugs (such as no floating promise)

### babel

Babel is a very simple tool for transpiling JavaScript
Babel is configured in [babel.config.js](https://github.com/roninjin10/server-boilerplate/blob/master/babel.config.js)
Babel just removes the typescript types. It does not typecheck. It is recommended to use babel for any other tools that need to transpile typescript, for example jest, as babel will be much faster than the typescript compiler.

## Development

Print env options

```bash
pnpm envSchema
```

Run server in watch mode

```bash
pnpm start
```

Build and start server

```bash
pnpm build && pnpm serve
```

Lint with prettier and eslint

```bash
pnpm lint
```

Explore prisma cli

```bash
npx prisma
```

## Architecture

The architecture is very simple

1. The Server class is the server and has an Api
2. The Api class is the api and has routes
3. The routes class are routes and they have TRPC route handlers

### Folder structure

The [`src folder`](https://github.com/roninjin10/server-boilerplate/tree/master/src) has Api.ts, Server.ts, and the main index.ts folder. Utils live in [`utils`](https://github.com/roninjin10/server-boilerplate/tree/master/src/utils) and routes live in [`routes`](https://github.com/roninjin10/server-boilerplate/tree/master/src/routes).

### Dependency Injection

This boilerplate makes heavy use of [`dependency injection`](https://www.reddit.com/r/csharp/comments/ru9chz/can_you_explain_what_dependency_injection_is/) to make testing easier and dependencies explicit, and the server more modular and a simple architecture that scales to being usable by larger teams.

### Server

The [`Server`](https://github.com/roninjin10/server-boilerplate/blob/master/src/Server.ts) class is the main entrypoint to the server. It starts a Fastify server and initializes it with a TRPC api.

### API

The [`Api`](https://github.com/roninjin10/server-boilerplate/blob/master/src/Api.ts) class is where new routes are registered. THe API itself is a route that handles /api/ and it's routes can optionally have nested routes.

### Routes

For most tasks, you will only need to create or touch routes. All routes are in the [`src/routes`](https://github.com/roninjin10/server-boilerplate/tree/master/src/routes) folder.

Routes are set up to be scalable to larger teams and support nested apis/routes.

For an example of defining a route checkout [`src/routes/hello.ts`](https://github.com/roninjin10/server-boilerplate/blob/master/src/routes/hello.ts). The route is registered on the api at `src/Api.ts`.

### Env

Process.env is wrapped with a class that peforms basic validation on it and documents what the env variables are [`src/Env.ts`](https://github.com/roninjin10/server-boilerplate/blob/master/src/Env.ts).

### CI/CD

A basic CI/CD setup exists with [`github actions`](https://docs.github.com/en/actions).

To setup you must set up some secrets in your repo and configure branch protection rules

#### Deployments

A basic dockerfile is provided for convenience. This boilerplate can easily be modified to work with most serverless deployments as well as next.js.

Github actions exist for both publishing package to npm and publishing docker image to dockerhub.

#### CI

Basic github actions for running test, lint, and testing the build exist in `.github/workflows`.

## OpenAPI

This boilerplate is optimized for building internal APIs as parts of larger systems. The api is optimized for consuption by typescript clients. For external facing apis that are potentially not consumed by typescript clients, I'd recomend adding [OpenAPI](https://github.com/jlalmes/trpc-openapi) to the trpc setup. I didn't add it here because OpenAPI does require the extra boilerplate of specifying `.output` zod validators as well as a `meta` tag in every route. But it's a great option to turn some of the internal apis to external apis and may be added to this boilerplate in the future

#### Author: Will Cory 👨🏻‍💻
