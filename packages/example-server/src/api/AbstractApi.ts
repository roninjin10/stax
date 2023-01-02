import { AbstractRoute } from '../routes/AbstractRoute'

/**
 * Abstract class for creating an API
 *
 * @example
 * export class Api extends AbstractApi {
 *    name = 'ExampleServer'
 *    version = '0.0.0'
 *    handler = this.trpc.router({
 *    ...this.commonRoutes,
 *    hello: this.trpc.procedure.query(() => 'Hello World'),
 *  })
 * }
 */
export abstract class AbstractApi extends AbstractRoute {
  /**
   * Recommended routes to add to every api
   */
  public readonly commonRoutes = {
    /**
     * Health check route
     */
    healthz: this.trpc.procedure.query(() => ({ ok: true })),
    /**
     * Returns the version of the api
     */
    version: this.trpc.procedure.query(() => this.version),
    /**
     * Returns the name of the api
     */
    name: this.trpc.procedure.query(() => this.name),
  }

  /**
   * The version of the api
   */
  public abstract readonly version: string
}
