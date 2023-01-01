import { AbstractRoute } from './AbstractRoute'

/**
 * Abstract class for creating an API
 */
export abstract class AbstractApi extends AbstractRoute {
  /**
   * Recommended routes to add to every api
   */
  public readonly commonRoutes = {
    healthz: this.trpc.procedure.query(() => ({ ok: true })),
    version: this.trpc.procedure.query(() => this.version),
  }

  /**
   * The version of the api
   */
  public abstract readonly version: number
}
