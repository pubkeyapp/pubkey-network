import { sdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'

export function useUserGetOnboardingAvatarUrlsQuery() {
  return useQuery({
    queryKey: ['user', 'get-onboarding-avatar-urls'],
    queryFn: () => sdk.userGetOnboardingAvatarUrls().then((res) => res.data.avatarUrls),
  })
}
