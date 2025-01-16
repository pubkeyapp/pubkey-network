import { Module } from '@nestjs/common'
import { ApiCoreDataAccessModule } from '@pubkey-network/api-core-data-access'
import { ApiOnboardingService } from './api-onboarding.service'

@Module({
  imports: [ApiCoreDataAccessModule],
  providers: [ApiOnboardingService],
  exports: [ApiOnboardingService],
})
export class ApiOnboardingDataAccessModule {}
