import type {
  AnyRootConfig,
  BuildProcedure,
  CreateRouterInner,
  ProcedureParams,
} from '@trpc/server'

import type { Trpc } from '../lib/Trpc'

/**
 * Abstract class for creating a route
 *
 * @example
 *
 * export class HelloRoute extends AbstractRoute {
 *   name = 'hello'
 *   handler = this.trpc.procedure
 *     .input(
 *       z
 *         .object({
 *  *           name: z.string().describe('Your name'),
 *         })
 *         .describe('Says hello to name of requester'),
 *     )
 *     .query(async ({ input }) => {
 *       return {
 *         message: `Hello ${input.name}`,
 *       }
 *     })
 * }
 */
export abstract class AbstractRoute {
  public abstract readonly name: string

  public abstract readonly handler:
    | BuildProcedure<
        'query' | 'mutation' | 'subscription',
        ProcedureParams<
          AnyRootConfig,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        >,
        unknown
      >
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | CreateRouterInner<AnyRootConfig, any>

  constructor(protected readonly trpc: Trpc) {}
}
