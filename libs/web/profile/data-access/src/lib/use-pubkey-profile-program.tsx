import { useSdk } from '@pubkey-network/web-core-data-access'
import { uiToastLink } from '@pubkey-network/web-solana-data-access'
import { toastError } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMutation, useQuery } from '@tanstack/react-query'

import { usePubkeyProfileSdk } from './use-pubkey-profile-sdk'
import { CreateProfileOptions } from './web-pubkey-profile-sdk'

export function usePubkeyProfileProgram() {
  const { signTransaction } = useWallet()
  const graphqlSdk = useSdk()
  const { cluster, getExplorerUrl, sdk } = usePubkeyProfileSdk()

  const profileAccounts = useQuery({
    queryKey: ['pubkey-profile', 'profile', { cluster }],
    queryFn: () => sdk.getProfiles(),
  })

  const pointerAccounts = useQuery({
    queryKey: ['pubkey-profile', 'pointer', { cluster }],
    queryFn: () => sdk.getPointers(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => sdk.getProgramAccount(),
    retry: false,
  })

  const createProfile = useMutation({
    mutationKey: ['pubkey-profile', 'createProfile', { cluster }],
    mutationFn: (options: CreateProfileOptions) =>
      sdk.createProfile(options).then(async (unsigned) => {
        const tx = await signTransaction!(unsigned)
        return graphqlSdk.solanaSignAndConfirmTransaction({
          tx: Array.from(tx.serialize()),
        })
      }),
    onSuccess: (signature) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${signature}`) })
      return profileAccounts.refetch()
    },
    onError: () => toastError('Failed to create profile'),
  })

  return {
    createProfile,
    getProgramAccount,
    pointerAccounts,
    profileAccounts,
  }
}
