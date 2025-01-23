import { registerEnumType } from '@nestjs/graphql'

export enum OnboardingStep {
  CreateProfile = 'CreateProfile',
  CustomizeProfile = 'CustomizeProfile',
  Finished = 'Finished',
  LinkSocialIdentities = 'LinkSocialIdentities',
  LinkSolanaWallets = 'LinkSolanaWallets',
}

registerEnumType(OnboardingStep, { name: 'OnboardingStep' })
