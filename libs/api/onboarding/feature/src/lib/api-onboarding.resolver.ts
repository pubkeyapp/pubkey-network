import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ApiAuthGraphQLAdminGuard, CtxUserId } from '@pubkey-network/api-auth-data-access'
import { ApiOnboardingService } from '@pubkey-network/api-onboarding-data-access'
import { OnboardingRequirements } from '@pubkey-network/api-onboarding-data-access'

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

  @Query(() => OnboardingRequirements, { nullable: true })
  async userOnboardingRequirements(@CtxUserId() userId: string) {
    return this.service.getOnboardingRequirements(userId)
  }

  @Mutation(() => Boolean, { nullable: true })
  async userOnboardingCustomizeProfile(
    @CtxUserId() userId: string,
    @Args('username') username: string,
    @Args('avatarUrl') avatarUrl: string,
  ) {
    return this.service.customizeProfile(userId, username, avatarUrl)
  }

  @Mutation(() => [Int], { nullable: true })
  async userOnboardingCreateProfile(@CtxUserId() userId: string, @Args('publicKey') publicKey: string) {
    return this.service.createProfile(userId, publicKey)
  }
}
