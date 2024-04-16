import { Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiSolanaDataAccessModule } from '@pubkey-network/api-solana-data-access'
import { ApiProfileService } from './api-profile.service'

@Module({
  imports: [ApiCoreDataAccessModule, ApiSolanaDataAccessModule],
  providers: [ApiProfileService],
  exports: [ApiProfileService],
})
export class ApiProfileDataAccessModule {}
