import { z } from 'zod'
import { AbstractApi } from './AbstractApi'
import { Trpc } from './Trpc'

export class Api extends AbstractApi {
  name = 'ExampleServer'
  version = 0
  routes = {
    // Add routes here
  }
  handler = this.trpc.router({
    ...this.commonRoutes,
    hello: this.trpc.procedure
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
      }),
  })

  constructor() {
    super(new Trpc())
  }
}
