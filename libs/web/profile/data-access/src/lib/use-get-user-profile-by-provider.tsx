import { IdentityProvider } from '@pubkey-network/sdk'
import { useSdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'

export function useGetUserProfileByProvider({ providerId }: { providerId?: string }) {
  const sdk = useSdk()
  return useQuery({
    queryFn: async () => {
      if (!providerId) {
        return null
      }
      return sdk
        .getUserProfileByProvider({
          provider: IdentityProvider.Solana,
          providerId,
        })
        .then((res) => res.data?.item)
    },
    queryKey: ['getUserProfileByProvider', { provider: IdentityProvider.Solana, providerId }],
    retry: false,
  })
}
