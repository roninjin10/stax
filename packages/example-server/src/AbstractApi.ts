import { AbstractRoute } from './AbstractRoute'

/**
 * Extend this class to create new API versions whenever a breaking change happens
 */
export abstract class AbstractApi extends AbstractRoute {
  public readonly commonRoutes = {
    healthz: this.trpc.procedure.query(() => ({ ok: true })),
    version: this.trpc.procedure.query(() => this.version),
  }

  /**
   * The api will be served at `/api/[version]/routename?input=...`
   *
   * @example
   * version = ApiVersion.V0
   */
  public abstract readonly version: number
}
