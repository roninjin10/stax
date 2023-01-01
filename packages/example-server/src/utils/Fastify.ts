import { Router } from '@trpc/server'
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import * as trpcPlayground from 'trpc-playground/handlers/fastify'
import metricsPlugin from 'fastify-metrics'

export interface ServerOptions {
  dev?: boolean
  port?: number
  prefix?: string
}

/**
 * Wrapper around fastify
 */
export class Fastify {
  constructor(
    private readonly port = 7300,
    dev = true,
    public readonly server = fastify({ logger: dev }),
  ) {}

  public readonly stop = async () => {
    await this.server.close()
  }

  public readonly start = async () => {
    try {
      await this.server.listen({ port: this.port })
      console.log('listening on port', this.port)
    } catch (err) {
      this.server.log.error(err)
      process.exit(1)
    }
  }

  public readonly registerMetrics = async (endpoint = '/metrics') => {
    await this.server.register(metricsPlugin, { endpoint })
  }

  public readonly registerTrpc = async (
    prefix: string,
    appRouter: Router<any>,
  ) => {
    await this.server.register(fastifyTRPCPlugin, {
      prefix,
      trpcOptions: { router: appRouter },
    })
  }

  public readonly registerTrpcPlayground = async (
    playgroundEndpoint: string,
    trpcApiEndpoint: string,
    appRouter: Router<any>,
  ) => {
    this.server.register(
      await trpcPlayground.getFastifyPlugin({
        trpcApiEndpoint,
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
