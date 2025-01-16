import { Injectable } from '@nestjs/common'
import { AuthGuard, PassportStrategy } from '@nestjs/passport'
import { IdentityProvider } from '@prisma/client'
import { ApiCoreService } from '@pubkey-network/api-core-data-access'
import { Profile, Strategy } from 'passport-twitter'
import type { ApiAuthRequest } from '../../interfaces/api-auth.request'
import { ApiAuthStrategyService } from '../api-auth-strategy.service'

@Injectable()
export class ApiAuthStrategyXGuard extends AuthGuard('x') {}

@Injectable()
export class ApiAuthStrategyX extends PassportStrategy(Strategy, 'x') {
  constructor(private core: ApiCoreService, private service: ApiAuthStrategyService) {
    super({
      consumerKey: core.config.authXConsumerKey,
      consumerSecret: core.config.authXConsumerSecret,
      callbackURL: core.config.webUrl + '/api/auth/x/callback',
      passReqToCallback: true,
    })
  }

  async validate(req: ApiAuthRequest, accessToken: string, refreshToken: string, profile: Profile) {
    return this.service.validateRequest({
      req,
      providerId: profile.id,
      provider: IdentityProvider.X,
      accessToken,
      refreshToken,
      profile: createXProfile(profile),
    })
  }
}

function createXProfile(profile: Profile) {
  return {
    externalId: profile.id,
    username: profile.username,
    name: profile.displayName,
    avatarUrl: profile.photos?.[0]?.value,
  }
}
