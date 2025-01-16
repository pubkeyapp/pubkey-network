import { Controller, Get, Param } from '@nestjs/common'
import { ApiProtocolService } from '@pubkey-network/api-protocol-data-access'
import { IdentityProvider } from '@pubkey-protocol/sdk'

@Controller('protocol')
export class ApiProtocolController {
  constructor(private readonly service: ApiProtocolService) {}

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
  async getProfileByProvider(@Param('provider') provider: IdentityProvider, @Param('providerId') providerId: string) {
    return this.service.getUserProfileByProvider(provider, providerId)
  }

  @Get('username/:username')
  async getProfileByUsername(@Param('username') username: string) {
    return this.service.getUserProfileByUsername(username)
  }
}
