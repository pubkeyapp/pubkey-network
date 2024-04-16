import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ApiAuthGraphQLUserGuard, CtxUserId } from '@pubkey-network/api-auth-data-access'
import { ApiProfileService } from '@pubkey-network/api-profile-data-access'
import { GraphQLJSON } from 'graphql-scalars'

@Resolver()
@UseGuards(ApiAuthGraphQLUserGuard)
export class ApiProfileResolver {
  constructor(private readonly service: ApiProfileService) {}

  @Mutation(() => [Int])
  createUserProfile(@CtxUserId() userId: string, @Args('publicKey') publicKey: string) {
    return this.service.createUserProfile(userId, publicKey)
  }

  @Query(() => GraphQLJSON)
  getUserProfile(@CtxUserId() userId: string) {
    return this.service.getUserProfile(userId)
  }

  @Query(() => GraphQLJSON)
  getUserProfiles() {
    return this.service.getUserProfiles()
  }
}
