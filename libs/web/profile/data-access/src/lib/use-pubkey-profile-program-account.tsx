import { uiToastLink } from '@pubkey-network/web-solana-data-access'
import {
  AddAuthorityOptions,
  AddIdentityOptions,
  RemoveAuthorityOptions,
  RemoveIdentityOptions,
  UpdateAvatarUrlOptions,
} from '@pubkey-program-library/sdk'
import { toastError } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { usePubkeyProfileSdk } from './use-pubkey-profile-sdk'

export function usePubkeyProfileProgramAccount({ profilePda }: { profilePda: PublicKey }) {
  const { sdk, solanaEndpoint, getExplorerUrl } = usePubkeyProfileSdk()

  const profileAccountQuery = useQuery({
    queryKey: ['pubkey-profile', 'fetchProfile', { solanaEndpoint, profilePda }],
    queryFn: () => sdk.getProfile({ profilePda }),
  })

  // const pointerAccountQuery = useQuery({
  //   queryKey: ['pubkey-profile', 'fetchPointer', { solanaEndpoint, profilePda] }],
  //   queryFn: () => sdk.getPointer({ pointerPda: account }),
  // })

  const updateAvatarUrl = useMutation({
    mutationKey: ['pubkey-profile', 'updateAvatarUrl', { solanaEndpoint, profilePda }],
    mutationFn: (options: UpdateAvatarUrlOptions) => sdk.updateAvatarUrl(options),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'addAuthority', { solanaEndpoint, profilePda }],
    mutationFn: (options: AddAuthorityOptions) => sdk.addAuthority(options),
    onError: (err) => toastError(`Error: ${err}`),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const removeAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'removeAuthority', { solanaEndpoint, profilePda }],
    mutationFn: (options: RemoveAuthorityOptions) => sdk.removeAuthority(options),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'addIdentity', { solanaEndpoint, profilePda }],
    mutationFn: (options: AddIdentityOptions) => sdk.addIdentity(options),
    onSuccess: (tx) =>
      Promise.all([
        //pointerAccountQuery.refetch(),
        profileAccountQuery.refetch(),
      ]).then(() => uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })),
  })

  const removeIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'removeIdentity', { solanaEndpoint, profilePda }],
    mutationFn: (options: RemoveIdentityOptions) => sdk.removeIdentity(options),
    onSuccess: (tx) =>
      Promise.all([
        //pointerAccountQuery.refetch(),
        profileAccountQuery.refetch(),
      ]).then(() => uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })),
  })

  return {
    profileAccountQuery,
    // pointerAccountQuery,
    updateAvatarUrl,
    addAuthority,
    removeAuthority,
    addIdentity,
    removeIdentity,
    authorities: profileAccountQuery.data?.authorities,
    username: profileAccountQuery.data?.username,
  }
}
