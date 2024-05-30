import { Injectable } from '@nestjs/common'
import { AuthGuard, PassportStrategy } from '@nestjs/passport'
import { IdentityProvider } from '@prisma/client'
import { ApiCoreService } from '@pubkey-network/api-core-data-access'
import { TelegramStrategy as Strategy } from 'passport-telegram-official'
import type { ApiAuthRequest } from '../../interfaces/api-auth.request'
import { ApiAuthStrategyService } from '../api-auth-strategy.service'

@Injectable()
export class ApiAuthStrategyTelegramGuard extends AuthGuard('telegram') {}

interface Profile {
  id: string
  username: string
  [key: string]: string
}

@Injectable()
export class ApiAuthStrategyTelegram extends PassportStrategy(Strategy, 'telegram') {
  constructor(private core: ApiCoreService, private service: ApiAuthStrategyService) {
    super({
      botToken: core.config.authTelegramBotToken,
      callbackURL: core.config.webUrl + '/api/auth/telegram/callback',
      passReqToCallback: true,
    })
  }

  async validate(req: ApiAuthRequest, accessToken: string, refreshToken: string, profile: Profile) {
    console.log('validate', req, accessToken, refreshToken, profile)
    return this.service.validateRequest({
      req,
      providerId: profile.id,
      provider: IdentityProvider.Telegram,
      accessToken,
      refreshToken,
      profile: createTelegramProfile(profile),
    })
  }
}

function createTelegramProfile(profile: Profile) {
  console.log('profile', profile)
  return {
    externalId: profile?.id,
    username: profile?.username,
    name: profile?.username,
    // avatarUrl: profile.photos?.[0]?.value,
  }
}
