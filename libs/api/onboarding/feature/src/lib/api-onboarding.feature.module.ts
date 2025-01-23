import { Module } from '@nestjs/common'
import { ApiOnboardingDataAccessModule } from '@pubkey-network/api-onboarding-data-access'
import { ApiOnboardingResolver } from './api-onboarding.resolver'

@Module({
  imports: [ApiOnboardingDataAccessModule],
  providers: [ApiOnboardingResolver],
})
export class ApiOnboardingFeatureModule {}
