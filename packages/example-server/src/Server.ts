import { Api } from './Api'
import { Fastify } from './utils/Fastify'

export class Server {
  constructor(
    private readonly trpcEndpoint = '/api',
    private readonly playgroundEndpoint = '/playground',
    private readonly api = new Api(),
    private fastifyServer: Fastify | undefined = undefined,
  ) {}

  public readonly start = async () => {
    const server = await this.init()
    return server.start()
  }

  public readonly stop = () => {
    return this.fastifyServer?.stop()
  }

  private readonly init = async () => {
    if (this.fastifyServer) {
      return this.fastifyServer
    }

    const fastifyServer = new Fastify()

    await fastifyServer.registerMetrics()
    await fastifyServer.registerTrpc(this.trpcEndpoint, this.api.handler)
    await fastifyServer.registerTrpcPlayground(
      this.playgroundEndpoint,
      this.trpcEndpoint,
      this.api.handler,
    )

    this.fastifyServer = fastifyServer

    return fastifyServer
  }
}
