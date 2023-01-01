import type { BuildProcedure, CreateRouterInner } from '@trpc/server'

import type { Trpc } from './Trpc'

/**
 * Abstract class for creating a route
 */
export abstract class AbstractRoute {
  public abstract readonly name: string

  public abstract readonly handler:
    | BuildProcedure<any, any, any>
    | CreateRouterInner<any, any>

  constructor(protected readonly trpc: Trpc) {}
}
