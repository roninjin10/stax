import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

/**
 * Wrapper around TRPC
 *
 * TRPC is a typesafe way of a making an api server and a client
 * The typescript types are shared between the two keeping them in sync
 * The strength of trpc is how quickly you can add new endpoints
 *
 * @see https://trpc.io
 */
export class Trpc {
  private readonly trpc = initTRPC.create({
    /**
     * @see https://trpc.io/docs/v10/data-transformers
     */
    transformer: superjson,
  })

  /**
   * @see https://trpc.io/docs/v10/router
   */
  public readonly router = this.trpc.router

  /**
   * @see https://trpc.io/docs/v10/merging-routers
   */
  public readonly mergeRouters = this.trpc.mergeRouters

  /**
   * @see https://trpc.io/docs/v10/procedures
   **/
  public readonly procedure = this.trpc.procedure

  /**
   * @see https://trpc.io/docs/v10/middlewares
   */
  public readonly middleware = this.trpc.middleware
}
