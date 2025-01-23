import { OnboardingRequirements } from '@pubkey-network/sdk'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useUserGetOnboardingAvatarUrlsQuery } from './use-user-get-onboarding-avatar-urls-query'
import { useUserGetOnboardingUsernameQuery } from './use-user-get-onboarding-username-query'
import { useUserOnboardingCreateProfile } from './use-user-onboarding-create-profile'
import { useUserOnboardingCustomizeProfile } from './use-user-onboarding-customize-profile'
import { useUserOnboardingRequirements } from './use-user-onboarding-requirements'

export interface UserOnboardingProviderContext {
  avatarUrls: string[]
  onboarded: boolean
  requirements?: OnboardingRequirements | null
  usernames: string[]
  username: string
  setUsername: (username: string) => void
  avatarUrl: string
  setAvatarUrl: (avatarUrl: string) => void
  refresh: () => Promise<void>
  createProfile: () => Promise<string>
  updateProfile: () => Promise<boolean>
}

const UserOnboardingContext = React.createContext<UserOnboardingProviderContext>({} as UserOnboardingProviderContext)

export function UserOnboardingProvider(props: { children: ReactNode }) {
  const { children } = props
  const avatarUrlsQuery = useUserGetOnboardingAvatarUrlsQuery()
  const usernameQuery = useUserGetOnboardingUsernameQuery()
  const requirementsQuery = useUserOnboardingRequirements()
  const createMutation = useUserOnboardingCreateProfile()
  const updateMutation = useUserOnboardingCustomizeProfile()
  const avatarUrls = useMemo(() => avatarUrlsQuery.data ?? [], [avatarUrlsQuery.data])
  const usernames = useMemo(() => usernameQuery.data ?? [], [usernameQuery.data])

  const [username, setUsername] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')

  useEffect(() => {
    if (avatarUrls?.length && avatarUrl === '') {
      setAvatarUrl(avatarUrls[0])
    }
    if (usernames?.length && username === '') {
      setUsername(usernames[0])
    }
  }, [avatarUrls, usernames, avatarUrl, username])

  async function refresh() {
    await Promise.all([avatarUrlsQuery.refetch(), usernameQuery.refetch(), requirementsQuery.refetch()])
  }

  async function createProfile() {
    return createMutation.mutateAsync().then(async (result) => {
      await refresh()
      return result ?? ''
    })
  }

  async function updateProfile() {
    return updateMutation.mutateAsync({ avatarUrl, username }).then(async (result) => {
      await refresh()
      return result ?? false
    })
  }

  const value = {
    onboarded: false,
    avatarUrls: avatarUrlsQuery.data ?? [],
    usernames: usernameQuery.data ?? [],
    username,
    requirements: requirementsQuery.data,
    setUsername,
    avatarUrl,
    setAvatarUrl,
    refresh,
    createProfile,
    updateProfile,
  }

  return <UserOnboardingContext.Provider value={value}>{children}</UserOnboardingContext.Provider>
}

export function useUserOnboarding() {
  return React.useContext(UserOnboardingContext)
}
