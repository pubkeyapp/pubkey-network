import { sdk } from '@pubkey-network/web-core-data-access'
import { useMutation } from '@tanstack/react-query'

export function useUserOnboardingCustomizeProfile() {
  return useMutation({
    mutationFn: ({ avatarUrl, username }: { avatarUrl: string; username: string }) =>
      sdk.userOnboardingCustomizeProfile({ avatarUrl, username }).then((res) => res.data.updated),
  })
}
