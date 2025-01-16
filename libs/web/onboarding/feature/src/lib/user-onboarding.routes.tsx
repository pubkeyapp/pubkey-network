import { OnboardingStep, UserOnboardingProvider } from '@pubkey-network/web-onboarding-data-access'
import { OnboardingUiLayout } from '@pubkey-network/web-onboarding-ui'
import React from 'react'
import { useRoutes } from 'react-router-dom'
import { UserOnboardingIndex } from './user-onboarding-index'
import { UserOnboardingStep } from './user-onboarding-step'
import { UserOnboardingStepCreateProfile } from './user-onboarding-step-create-profile'
import { UserOnboardingStepLinkSocial } from './user-onboarding-step-link-social'
import { UserOnboardingStepLinkSolana } from './user-onboarding-step-link-solana'

export default function UserOnboardingRoutes() {
  const routes = useRoutes([
    { index: true, element: <UserOnboardingIndex /> },
    { path: ':step', element: <UserOnboardingStep /> },
  ])

  const steps: OnboardingStep[] = [
    {
      id: 'link-social-identities',
      name: 'Link Social Identities',
      component: <UserOnboardingStepLinkSocial />,
      completed: async () => {
        return true
      },
    },
    {
      id: 'link-solana-wallets',
      name: 'Link Solana wallets',
      component: <UserOnboardingStepLinkSolana />,
      completed: async () => {
        return true
      },
    },
    {
      id: 'create-profile',
      name: 'Create Profile',
      component: <UserOnboardingStepCreateProfile />,
      completed: async () => {
        return true
      },
    },
  ]

  return (
    <UserOnboardingProvider steps={steps}>
      <OnboardingUiLayout>{routes}</OnboardingUiLayout>
    </UserOnboardingProvider>
  )
}
