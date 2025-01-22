import { sdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'

export function useUserOnboardingRequirements() {
  return useQuery({
    queryKey: ['user', 'onboarding-requirements'],
    queryFn: () => sdk.userOnboardingRequirements().then((res) => res.data.item),
  })
}
