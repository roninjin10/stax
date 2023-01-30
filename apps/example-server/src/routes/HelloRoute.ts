import { z } from 'zod'

import { AbstractRoute } from './AbstractRoute'

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
