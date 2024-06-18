import { Module } from '@nestjs/common'
import { ApiAuthDataAccessModule } from '@pubkey-network/api-auth-data-access'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiProfileDataAccessModule } from '@pubkey-network/api-profile-data-access'
import { ApiIdentityDataAdminService } from './api-identity-data-admin.service'
import { ApiIdentityDataAnonService } from './api-identity-data-anon.service'
import { ApiIdentityDataUserService } from './api-identity-data-user.service'
import { ApiIdentitySolanaService } from './api-identity-solana.service'
import { ApiIdentityService } from './api-identity.service'

@Module({
  imports: [ApiAuthDataAccessModule, ApiCoreDataAccessModule, ApiProfileDataAccessModule],
  providers: [
    ApiIdentityDataAdminService,
    ApiIdentityDataAnonService,
    ApiIdentityService,
    ApiIdentitySolanaService,
    ApiIdentityDataUserService,
  ],
  exports: [ApiIdentityService],
})
export class ApiIdentityDataAccessModule {}
