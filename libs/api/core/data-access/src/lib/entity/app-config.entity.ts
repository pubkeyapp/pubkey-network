import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class AppConfig {
  @Field()
  authDiscordEnabled!: boolean
  @Field()
  authGithubEnabled!: boolean
  @Field()
  authGoogleEnabled!: boolean
  @Field()
  authPasswordEnabled!: boolean
  @Field()
  authRegisterEnabled!: boolean
  @Field()
  authSolanaEnabled!: boolean
  @Field()
  authTelegramEnabled!: boolean
  @Field()
  authXEnabled!: boolean
  @Field()
  pubkeyProtocolSigner!: string
  @Field()
  solanaEndpoint!: string
}
