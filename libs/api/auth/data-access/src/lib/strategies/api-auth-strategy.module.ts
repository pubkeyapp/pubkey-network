import { type DynamicModule, Module } from '@nestjs/common'

import { ApiAuthStrategyDiscordModule } from './oauth/api-auth-strategy-discord.module'
import { ApiAuthStrategyGithubModule } from './oauth/api-auth-strategy-github.module'
import { ApiAuthStrategyGoogleModule } from './oauth/api-auth-strategy-google.module'
import { ApiAuthStrategyTelegramModule } from './oauth/api-auth-strategy-telegram.module'
import { ApiAuthStrategyXModule } from './oauth/api-auth-strategy-x.module'

@Module({})
export class ApiAuthStrategyModule {
  static register(): DynamicModule {
    return {
      module: ApiAuthStrategyModule,
      imports: [
        ApiAuthStrategyDiscordModule.register(),
        ApiAuthStrategyGithubModule.register(),
        ApiAuthStrategyGoogleModule.register(),
        ApiAuthStrategyTelegramModule.register(),
        ApiAuthStrategyXModule.register(),
      ],
    }
  }
}
