# src/routes

All routes are stored here under the name FooRoute.ts. Routes exist at `/foo`.

For most tasks, you will only need to create or touch routes. All routes are in the [`src/routes`](https://github.com/roninjin10/server-boilerplate/tree/master/src/routes) folder.

For an example of defining a route checkout [`src/routes/hello.ts`](https://github.com/roninjin10/server-boilerplate/blob/master/src/routes/hello.ts). The route is registered on the api at `src/Api.ts`.

Routes can use a trpc procedure as an handler.

```typescript
export class HelloRoute extends AbstractRoute {
  name = 'hello'
  handler = this.trpc.procedure
    .input(
      z
        .object({
          name: z.string().describe('Your name'),
        })
        .describe('Says hello to name of requester'),
    )
    .query(async ({ input }) => {
      return {
        message: `Hello ${input.name}`,
      }
    })
}
```

## Nested routes

Nested routes such as `/foo/bar` can either inline them in `Foo.ts` or when appropriate
they can go in a new directory `/foo/Bar.ts` as their own route.
