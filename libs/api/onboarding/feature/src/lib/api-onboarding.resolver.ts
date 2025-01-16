import { Resolver } from '@nestjs/graphql'
import { ApiOnboardingService } from '@pubkey-network/api-onboarding-data-access'

@Resolver()
export class ApiOnboardingResolver {
  constructor(private readonly service: ApiOnboardingService) {}
}
