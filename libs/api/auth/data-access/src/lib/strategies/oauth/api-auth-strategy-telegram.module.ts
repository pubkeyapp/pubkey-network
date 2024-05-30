import { type DynamicModule, Logger, Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiAuthStrategyService } from '../api-auth-strategy.service'
import { ApiAuthStrategyTelegram } from './api-auth-strategy-telegram'

@Module({})
export class ApiAuthStrategyTelegramModule {
  static logger = new Logger(ApiAuthStrategyTelegramModule.name)
  static register(): DynamicModule {
    const enabled = this.enabled
    if (!enabled) {
      this.logger.warn(`Telegram Auth DISABLED`)
      return { module: ApiAuthStrategyTelegramModule }
    }
    this.logger.verbose(`Telegram Auth ENABLED`)
    return {
      module: ApiAuthStrategyTelegramModule,
      imports: [ApiCoreDataAccessModule],
      providers: [ApiAuthStrategyTelegram, ApiAuthStrategyService],
    }
  }

  // TODO: These should be coming from the ApiCoreConfigService instead of process.env
  private static get enabled(): boolean {
    return (
      // Telegram auth needs to be enabled
      !!process.env['AUTH_TELEGRAM_ENABLED'] &&
      // And we need to have the bot token set
      !!process.env['AUTH_TELEGRAM_BOT_TOKEN']
    )
  }
}
