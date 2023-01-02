import type { Router } from '@trpc/server'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import type { AnyRouterDef } from '@trpc/server/dist/core/router'
import fastify from 'fastify'
import metricsPlugin from 'fastify-metrics'
import * as trpcPlayground from 'trpc-playground/handlers/fastify'

export interface ServerOptions {
  dev?: boolean
  port?: number
  prefix?: string
}

/**
 * Wrapper around fastify
 *
 * @see https://www.fastify.io/
 */
export class Fastify {
  constructor(
    /**
     * The port
     */
    private readonly port: number,
    /**
     * The host
     */
    private readonly host: string,
    /**
     * Whether to run in development mode
     * Defaults to Env.NODE_ENV === 'development'
     */
    dev: boolean,
    /**
     * The fastify server being wrapped
     *
     * @dependencyinjection
     */
    public readonly server = fastify({ logger: dev }),
  ) {}

  /**
   * Starts the fastify server
   */
  public readonly start = async () => {
    try {
      /**
       * @see https://www.fastify.io/docs/latest/Reference/Server/#listen
       */
      await this.server.listen({ port: this.port, host: this.host })
      console.log('listening on port', this.port)
    } catch (err) {
      this.server.log.error(err)
      process.exit(1)
    }
  }

  /**
   * Stop the fastify server
   */
  public readonly stop = async () => {
    await this.server.close()
  }

  /**
   * Registers metrics on fastify server
   */
  public readonly registerMetrics = async (endpoint = '/metrics') => {
    await this.server.register(metricsPlugin, { endpoint })
  }

  /**
   * Register a trpc router on fastify server
   * Include a playground endpoint if you want to use the playground
   */
  public readonly registerTrpc = async (
    prefix: string,
    appRouter: Router<AnyRouterDef>,
    playgroundEndpoint: string | undefined,
  ) => {
    await this.server.register(fastifyTRPCPlugin, {
      prefix,
      trpcOptions: { router: appRouter },
    })
    if (playgroundEndpoint) {
      this.server.register(
        await trpcPlayground.getFastifyPlugin({
          trpcApiEndpoint: prefix,
          playgroundEndpoint,
          router: appRouter,
          request: {
            superjson: true,
          },
        }),
        { prefix: playgroundEndpoint },
      )
    }
  }
}
