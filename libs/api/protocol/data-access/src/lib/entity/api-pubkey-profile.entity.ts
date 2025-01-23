import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PubkeyProfile {
  @Field(() => Int)
  bump!: number

  @Field()
  username!: string

  @Field()
  avatarUrl?: string

  @Field(() => [String])
  authorities!: string[]

  @Field(() => [PubkeyProfileIdentity])
  identities!: PubkeyProfileIdentity[]

  @Field()
  publicKey!: string
}

@ObjectType()
export class PubkeyProfileIdentity {
  @Field()
  provider!: string

  @Field()
  providerId!: string

  @Field()
  name!: string
}
