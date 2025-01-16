import { useSdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'

export function useGetUserProfiles() {
  const sdk = useSdk()
  return useQuery({
    queryFn: () => sdk.getUserProfiles().then((res) => res.data?.items),
    queryKey: ['getUserProfiles'],
    retry: false,
  })
}
