import React, { ReactNode } from 'react'

export interface OnboardingStep {
  id: string
  name: string
  component: ReactNode
  completed: () => Promise<boolean>
}

export interface UserOnboardingProviderContext {
  onboarded: boolean
  steps: OnboardingStep[]
}

const UserOnboardingContext = React.createContext<UserOnboardingProviderContext>({} as UserOnboardingProviderContext)

export function UserOnboardingProvider(props: { children: ReactNode; steps: OnboardingStep[] }) {
  const { children } = props

  const value = {
    onboarded: false,
    steps: props.steps,
  }

  return <UserOnboardingContext.Provider value={value}>{children}</UserOnboardingContext.Provider>
}

export function useUserOnboarding() {
  return React.useContext(UserOnboardingContext)
}
