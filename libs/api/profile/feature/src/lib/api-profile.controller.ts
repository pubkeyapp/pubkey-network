import { Controller, Get, Param } from '@nestjs/common'
import { ApiProfileService } from '@pubkey-network/api-profile-data-access'
import { PubKeyIdentityProvider } from '@pubkey-program-library/anchor'

@Controller('profiles')
export class ApiProfileController {
  constructor(private readonly service: ApiProfileService) {}

  @Get()
  async index() {
    return [
      '/profiles/all',
      '/profiles/providers',
      '/profiles/provider/:provider/:providerId',
      '/profiles/username/:username',
    ].map((p) => this.service.getApiUrl(p))
  }

  @Get('all')
  async getProfiles() {
    return this.service.getUserProfiles()
  }

  @Get('providers')
  async getProviders() {
    return this.service.getProviders()
  }

  @Get('provider/:provider/:providerId')
  async getProfileByProvider(
    @Param('provider') provider: PubKeyIdentityProvider,
    @Param('providerId') providerId: string,
  ) {
    return this.service.getUserProfileByProvider(provider, providerId)
  }

  @Get('username/:username')
  async getProfileByUsername(@Param('username') username: string) {
    return this.service.getUserProfileByUsername(username)
  }
}
