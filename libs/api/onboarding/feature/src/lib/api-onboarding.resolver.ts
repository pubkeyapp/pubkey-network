import { UseGuards } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { ApiAuthGraphQLAdminGuard, CtxUserId } from '@pubkey-network/api-auth-data-access'
import { ApiOnboardingService } from '@pubkey-network/api-onboarding-data-access'

@Resolver()
@UseGuards(ApiAuthGraphQLAdminGuard)
export class ApiOnboardingResolver {
  constructor(private readonly service: ApiOnboardingService) {}

  @Query(() => [String], { nullable: true })
  async userGetOnboardingUsernames(@CtxUserId() userId: string) {
    return this.service.getOnboardingUsernames(userId)
  }

  @Query(() => [String], { nullable: true })
  async userGetOnboardingAvatarUrls(@CtxUserId() userId: string) {
    return this.service.getOnboardingAvatarUrls(userId)
  }
}
