import { Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiSolanaDataAccessModule } from '@pubkey-network/api-solana-data-access'
import { ApiProtocolService } from './api-protocol.service'

@Module({
  imports: [ApiCoreDataAccessModule, ApiSolanaDataAccessModule],
  providers: [ApiProtocolService],
  exports: [ApiProtocolService],
})
export class ApiProtocolDataAccessModule {}
