import { useSdk } from '@pubkey-network/web-core-data-access'
import { useMutation } from '@tanstack/react-query'

export function useSyncUserProfile() {
  const sdk = useSdk()
  return useMutation({
    mutationFn: () => sdk.syncUserProfile().then((res) => res.data.synced),
  })
}

export function useCheckUserProfile() {
  const sdk = useSdk()
  return useMutation({
    mutationFn: () => sdk.checkUserProfile().then((res) => res.data.checked),
  })
}
