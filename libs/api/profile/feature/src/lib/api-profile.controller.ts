import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { ApiProfileService } from '@pubkey-network/api-profile-data-access'
import { PubKeyIdentityProvider } from '@pubkey-program-library/anchor'

@Controller('profiles')
export class ApiProfileController {
  constructor(private readonly service: ApiProfileService) {}

  @Get()
  async getProfiles() {
    return this.service.getUserProfiles()
  }

  @Get(':provider/:providerId')
  async getProfileByProvider(
    @Param('provider') provider: PubKeyIdentityProvider,
    @Param('providerId') providerId: string,
  ) {
    const profile = await this.service.getUserProfileByProvider(provider, providerId)
    if (!profile) {
      throw new NotFoundException(`User profile not found for provider ${provider} and providerId ${providerId}`)
    }
    return profile
  }

  @Get(':username')
  async getProfileByUsername(@Param('username') username: string) {
    const profile = await this.service.getUserProfileByUsername(username)
    if (!profile) {
      throw new NotFoundException(`User profile not found for username ${username}`)
    }
    return profile
  }
}
