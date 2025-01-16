import { Module } from '@nestjs/common'
import { ApiAuthDataAccessModule } from '@pubkey-network/api-auth-data-access'
import { ApiAuthStrategyDiscordController } from './api-auth-strategy-discord.controller'
import { ApiAuthStrategyGithubController } from './api-auth-strategy-github.controller'
import { ApiAuthStrategyGoogleController } from './api-auth-strategy-google.controller'
import { ApiAuthStrategyTelegramController } from './api-auth-strategy-telegram.controller'
import { ApiAuthStrategyXController } from './api-auth-strategy-x.controller'
import { ApiAuthController } from './api-auth.controller'
import { ApiAuthResolver } from './api-auth.resolver'

@Module({
  controllers: [
    ApiAuthController,
    ApiAuthStrategyDiscordController,
    ApiAuthStrategyGithubController,
    ApiAuthStrategyGoogleController,
    ApiAuthStrategyTelegramController,
    ApiAuthStrategyXController,
  ],
  imports: [ApiAuthDataAccessModule],
  providers: [ApiAuthResolver],
})
export class ApiAuthFeatureModule {}
