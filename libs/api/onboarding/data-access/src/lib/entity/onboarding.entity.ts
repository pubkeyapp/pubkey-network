import { Field, Int, ObjectType } from '@nestjs/graphql'
import { OnboardingStep } from './onboarding-step'

@ObjectType()
export class OnboardingRequirements {
  @Field(() => String, { nullable: true })
  profileAccount!: string | null
  @Field(() => Int, { nullable: true })
  socialIdentities!: number | null
  @Field(() => Int, { nullable: true })
  solanaIdentities!: number | null
  @Field(() => Boolean, { nullable: true })
  validUsername!: boolean
  @Field(() => Boolean, { nullable: true })
  validAvatarUrl!: boolean
  @Field(() => OnboardingStep)
  step!: OnboardingStep
}
