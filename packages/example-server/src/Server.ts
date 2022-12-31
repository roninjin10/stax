import { Api } from './Api'
import { Fastify } from './Fastify'

export class Server {
  constructor(
    private readonly trpcEndpoint = '/api',
    private readonly playgroundEndpoint = '/playground',
    private readonly api = new Api(),
    private readonly fastifyServer: Fastify | undefined = undefined,
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
    fastifyServer.registerTrpc(this.trpcEndpoint, this.api.handler)
    await fastifyServer.registerTrpcPlayground(
      this.playgroundEndpoint,
      this.trpcEndpoint,
      this.api.handler,
    )
    return fastifyServer
  }
}
