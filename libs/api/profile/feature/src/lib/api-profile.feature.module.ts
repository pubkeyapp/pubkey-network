import { Module } from '@nestjs/common'
import { ApiProfileDataAccessModule } from '@pubkey-network/api-profile-data-access'
import { ApiProfileController } from './api-profile.controller'
import { ApiProfileResolver } from './api-profile.resolver'

@Module({
  controllers: [ApiProfileController],
  imports: [ApiProfileDataAccessModule],
  providers: [ApiProfileResolver],
})
export class ApiProfileFeatureModule {}
