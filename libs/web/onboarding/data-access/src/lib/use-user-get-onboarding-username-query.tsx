import { sdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'

export function useUserGetOnboardingUsernameQuery() {
  return useQuery({
    queryKey: ['user', 'get-onboarding-usernames'],
    queryFn: () => sdk.userGetOnboardingUsernames().then((res) => res.data.usernames),
  })
}
