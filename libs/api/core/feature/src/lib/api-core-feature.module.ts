import { Module } from '@nestjs/common'
import { ApiAuthFeatureModule } from '@pubkey-network/api-auth-feature'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiIdentityFeatureModule } from '@pubkey-network/api-identity-feature'
import { ApiProtocolFeatureModule } from '@pubkey-network/api-protocol-feature'
import { ApiSolanaFeatureModule } from '@pubkey-network/api-solana-feature'
import { ApiUserFeatureModule } from '@pubkey-network/api-user-feature'
import { ApiCoreController } from './api-core.controller'
import { ApiCoreResolver } from './api-core.resolver'

const imports = [
  // The api-feature generator will add the imports here
  ApiAuthFeatureModule,
  ApiCoreDataAccessModule,
  ApiIdentityFeatureModule,
  ApiProtocolFeatureModule,
  ApiSolanaFeatureModule,
  ApiUserFeatureModule,
]

@Module({
  controllers: [ApiCoreController],
  imports: [...imports],
  providers: [ApiCoreResolver],
})
export class ApiCoreFeatureModule {}
