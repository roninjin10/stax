import { HelloRoute } from './routes/hello'
import { AbstractApi } from './utils/AbstractApi'
import { Trpc } from './utils/Trpc'

export class Api extends AbstractApi {
  helloRoute = new HelloRoute(this.trpc)

  name = 'ExampleServer'

  version = 0

  handler = this.trpc.router({
    ...this.commonRoutes,
    [this.helloRoute.name]: this.helloRoute.handler,
  })

  constructor(trpc = new Trpc()) {
    super(trpc)
  }
}
