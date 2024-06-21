import { UseGuards } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'
import { ApiAuthGraphQLUserGuard, CtxUserId } from '@pubkey-network/api-auth-data-access'
import { IdentityProvider } from '@pubkey-network/api-identity-data-access'
import { ApiProfileService, PubkeyProfile } from '@pubkey-network/api-profile-data-access'
import { GraphQLJSON } from 'graphql-scalars'

@Resolver()
@UseGuards(ApiAuthGraphQLUserGuard)
export class ApiProfileResolver {
  constructor(private readonly service: ApiProfileService) {}

  @Mutation(() => [Int])
  createUserProfile(@CtxUserId() userId: string, @Args('publicKey') publicKey: string) {
    return this.service.createUserProfile(userId, publicKey)
  }

  @Mutation(() => [Int])
  profileIdentityAdd(
    @CtxUserId() userId: string,
    @Args('publicKey') publicKey: string,
    @Args({ name: 'provider', type: () => IdentityProvider }) provider: IdentityProvider,
    @Args('providerId') providerId: string,
  ) {
    return this.service.profileIdentityAdd(userId, publicKey, provider, providerId)
  }

  @Mutation(() => [Int])
  profileIdentityRemove(
    @CtxUserId() userId: string,
    @Args('publicKey') publicKey: string,
    @Args({ name: 'provider', type: () => IdentityProvider }) provider: IdentityProvider,
    @Args('providerId') providerId: string,
  ) {
    return this.service.profileIdentityRemove(userId, publicKey, provider, providerId)
  }

  @Mutation(() => GraphQLJSON, { nullable: true })
  checkUserProfile(@CtxUserId() userId: string) {
    return this.service.checkUserProfile(userId)
  }

  @Mutation(() => GraphQLJSON, { nullable: true })
  syncUserProfile(@CtxUserId() userId: string) {
    return this.service.syncUserProfile(userId)
  }

  @Query(() => PubkeyProfile, { nullable: true })
  getUserProfileByUsername(@Args('username') username: string) {
    return this.service.getUserProfileByUsername(username)
  }

  @Query(() => PubkeyProfile, { nullable: true })
  getUserProfileByProvider(
    @Args({ name: 'provider', type: () => IdentityProvider }) provider: IdentityProvider,
    @Args('providerId') providerId: string,
  ) {
    return this.service.getUserProfileByProviderNullable(provider, providerId)
  }

  @Query(() => PubkeyProfile, { nullable: true })
  getUserProfile(@CtxUserId() userId: string) {
    return this.service.getUserProfile(userId)
  }

  @Query(() => GraphQLJSON)
  getUserProfiles() {
    return this.service.getUserProfiles()
  }
}
