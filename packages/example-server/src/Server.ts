import { Api } from './api/Api'
import { Env } from './Env'
import { Fastify } from './lib/Fastify'
import { Trpc } from './lib/Trpc'

/**
 * The top level server that instantiates the API and starts the server
 *
 * @example
 * const server = new Server()
 * await server.start()
 * await server.stop()
 */
export class Server {
  constructor(
    /**
     * The Env options for the server
     */
    private readonly env = Env.getEnv(),

    /**
     * The Trpc instance the API and routers will use
     *
     * @dependencyinjection
     */
    trpc = new Trpc(),
    /**
     * The API instance the server will use
     *
     * @dependencyinjection
     */
    private readonly api = new Api(trpc),
    /**
     * The Fastify instance the server will use to mount the API
     *
     * @dependencyinjection
     */
    private readonly fastifyServer: Fastify | undefined = undefined,
  ) {}

  /**
   * Starts the server
   */
  public readonly start = async () => {
    const server = await this.init()
    return server.start()
  }

  /**
   * stops the server
   */
  public readonly stop = () => {
    return this.fastifyServer?.stop()
  }

  /**
   * Initializes the server if not yet initialized
   *
   * @returns the fastify server
   */
  private readonly init = async () => {
    if (this.fastifyServer) {
      return this.fastifyServer
    }

    const fastifyServer = new Fastify(
      this.env.PORT,
      this.env.HOST,
      this.env.NODE_ENV === 'development',
    )

    await fastifyServer.registerMetrics()
    await fastifyServer.registerTrpc(
      this.env.TRPC_ENDPOINT,
      this.api.handler,
      this.env.TRPC_PLAYGROUND_ENDPOINT,
    )

    return fastifyServer
  }
}
