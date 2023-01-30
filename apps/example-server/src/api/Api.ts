import type { Trpc } from '../lib/Trpc'
import { HelloRoute } from '../routes/HelloRoute'
import { AbstractApi } from './AbstractApi'

/**
 * The Api class containing the trpc route
 * All new routes must be registered here
 *
 * @example
 * const api = new Api(new Trpc())
 * // RouterType is needed by trpc client
 * type RouterType = typeof api.handler
 */
export class Api extends AbstractApi {
  name = 'ExampleServer'
  version = '0.0.0'

  /**
   * ROUTES
   *
   * For convenience, routes are not injected with dependency injection
   */
  helloRoute = new HelloRoute(this.trpc)

  /**
   * Handler for the trpc router
   *
   * @example to use with trpc client
   * type AppRouter = Api['handler']
   */
  handler = this.trpc.router({
    ...this.commonRoutes,
    [this.helloRoute.name]: this.helloRoute.handler,
  })

  constructor(
    /**
     * @dependencyinjection
     */
    trpc: Trpc,
  ) {
    super(trpc)
  }
}
