import { sdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'
import React, { ReactNode } from 'react'

export interface UserOnboardingProviderContext {
  avatarUrls: string[]
  onboarded: boolean
  usernames: string[]
  refresh: () => Promise<void>
}

const UserOnboardingContext = React.createContext<UserOnboardingProviderContext>({} as UserOnboardingProviderContext)

export function UserOnboardingProvider(props: { children: ReactNode }) {
  const { children } = props
  const avatarUrlsQuery = useAvatarUrlsQuery()
  const usernameQuery = useUsernameQuery()

  const value = {
    onboarded: false,
    avatarUrls: avatarUrlsQuery.data ?? [],
    usernames: usernameQuery.data ?? [],
    refresh: async () => {
      await avatarUrlsQuery.refetch()
      await usernameQuery.refetch()
    },
  }

  return <UserOnboardingContext.Provider value={value}>{children}</UserOnboardingContext.Provider>
}

export function useUserOnboarding() {
  return React.useContext(UserOnboardingContext)
}

function useUsernameQuery() {
  return useQuery({
    queryKey: ['user', 'get-onboarding-usernames'],
    queryFn: () => sdk.userGetOnboardingUsernames().then((res) => res.data.usernames),
  })
}

function useAvatarUrlsQuery() {
  return useQuery({
    queryKey: ['user', 'get-onboarding-avatar-urls'],
    queryFn: () => sdk.userGetOnboardingAvatarUrls().then((res) => res.data.avatarUrls),
  })
}
