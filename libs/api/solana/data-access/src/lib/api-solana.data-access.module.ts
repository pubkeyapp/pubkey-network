import { Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiSolanaService } from './api-solana.service'

@Module({
  imports: [ApiCoreDataAccessModule],
  providers: [ApiSolanaService],
  exports: [ApiSolanaService],
})
export class ApiSolanaDataAccessModule {}
