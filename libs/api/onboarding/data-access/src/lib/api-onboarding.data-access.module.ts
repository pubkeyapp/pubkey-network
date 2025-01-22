import { Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiProtocolDataAccessModule } from '@pubkey-network/api-protocol-data-access'
import { ApiOnboardingService } from './api-onboarding.service'

@Module({
  imports: [ApiCoreDataAccessModule, ApiProtocolDataAccessModule],
  providers: [ApiOnboardingService],
  exports: [ApiOnboardingService],
})
export class ApiOnboardingDataAccessModule {}
