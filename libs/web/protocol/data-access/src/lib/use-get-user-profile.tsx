import { useSdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'

export function useGetUserProfile() {
  const sdk = useSdk()
  return useQuery({
    queryFn: () => sdk.getUserProfile().then((res) => res.data?.item),
    queryKey: ['getUserProfile'],
    retry: false,
  })
}
