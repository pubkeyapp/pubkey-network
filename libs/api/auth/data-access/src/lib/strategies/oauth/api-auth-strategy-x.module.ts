import { type DynamicModule, Logger, Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiAuthStrategyService } from '../api-auth-strategy.service'
import { ApiAuthStrategyX } from './api-auth-strategy-x'

@Module({})
export class ApiAuthStrategyXModule {
  static logger = new Logger(ApiAuthStrategyXModule.name)
  static register(): DynamicModule {
    const enabled = this.enabled
    if (!enabled) {
      this.logger.warn(`X Auth DISABLED`)
      return { module: ApiAuthStrategyXModule }
    }
    this.logger.verbose(`X Auth ENABLED`)
    return {
      module: ApiAuthStrategyXModule,
      imports: [ApiCoreDataAccessModule],
      providers: [ApiAuthStrategyX, ApiAuthStrategyService],
    }
  }

  // TODO: These should be coming from the ApiCoreConfigService instead of process.env
  private static get enabled(): boolean {
    return (
      // X auth needs to be enabled
      !!process.env['AUTH_X_ENABLED'] &&
      // And we need to have the client ID and secret set
      !!process.env['AUTH_X_CONSUMER_KEY'] &&
      !!process.env['AUTH_X_CONSUMER_SECRET']
    )
  }
}
