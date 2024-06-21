import { useGetUserProfileByProvider } from './use-get-user-profile-by-provider'

export function useGetPubKeyProfile({ providerId }: { providerId?: string }) {
  const query = useGetUserProfileByProvider({ providerId })
  const profile = query.data

  return {
    loading: query.isLoading,
    profile,
    avatarUrl: profile?.avatarUrl,
    username: profile?.username,
    publicKey: profile?.publicKey,
    identities: profile?.identities,
    loadProfile: () => {
      return query.refetch()
    },
  }
}
