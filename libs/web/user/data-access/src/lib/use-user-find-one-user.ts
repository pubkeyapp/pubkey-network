import { useSdk } from '@pubkey-network/web-core-data-access'
import { useQuery } from '@tanstack/react-query'

export function useUserFindOneUser({ username }: { username: string }) {
  const sdk = useSdk()
  const query = useQuery({
    queryKey: ['user', 'find-one-user', username],
    queryFn: () => sdk.userFindOneUser({ username }).then((res) => res.data),
    retry: 0,
  })

  return {
    user: query.data?.item,
    query,
  }
}
