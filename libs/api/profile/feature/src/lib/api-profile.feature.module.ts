import { Module } from '@nestjs/common'
import { ApiProfileDataAccessModule } from '@pubkey-network/api-profile-data-access'
import { ApiProfileResolver } from './api-profile.resolver'

@Module({
  imports: [ApiProfileDataAccessModule],
  providers: [ApiProfileResolver],
})
export class ApiProfileFeatureModule {}
