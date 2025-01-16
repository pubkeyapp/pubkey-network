import { useSdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'

export function useGetUserProfileByUsername({ username }: { username: string }) {
  const sdk = useSdk()
  return useQuery({
    queryFn: () => sdk.getUserProfileByUsername({ username }).then((res) => res.data?.item),
    queryKey: ['getUserProfile'],
    retry: false,
  })
}
