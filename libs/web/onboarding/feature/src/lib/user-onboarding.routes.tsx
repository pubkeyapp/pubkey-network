import { UserOnboardingProvider } from '@pubkey-network/web-onboarding-data-access'
import { OnboardingUiLayout } from '@pubkey-network/web-onboarding-ui'
import React from 'react'
import { useRoutes } from 'react-router-dom'
import { UserOnboardingIndex } from './user-onboarding-index'

export default function UserOnboardingRoutes() {
  const routes = useRoutes([{ index: true, element: <UserOnboardingIndex /> }])

  return (
    <UserOnboardingProvider>
      <OnboardingUiLayout>{routes}</OnboardingUiLayout>
    </UserOnboardingProvider>
  )
}
