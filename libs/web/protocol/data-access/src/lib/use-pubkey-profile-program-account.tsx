import { uiToastLink } from '@pubkey-network/web-solana-data-access'
import {
  ProfileAuthorityAddOptions,
  ProfileAuthorityRemoveOptions,
  ProfileIdentityAddOptions,
  ProfileIdentityRemoveOptions,
  ProfileUpdateOptions,
} from '@pubkey-protocol/sdk'
import { toastError } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { usePubKeyProtocolSdk } from './use-pubkey-protocol-sdk'

export function usePubkeyProfileProgramAccount({ profilePda }: { profilePda: PublicKey }) {
  const { sdk, solanaEndpoint, getExplorerUrl } = usePubKeyProtocolSdk()

  const profileAccountQuery = useQuery({
    queryKey: ['pubkey-profile', 'fetchProfile', { solanaEndpoint, profilePda }],
    queryFn: () => sdk.profileGet({ profile: profilePda.toString() }),
  })

  // const pointerAccountQuery = useQuery({
  //   queryKey: ['pubkey-profile', 'fetchPointer', { solanaEndpoint, profilePda] }],
  //   queryFn: () => sdk.getPointer({ pointerPda: account }),
  // })

  const updateAvatarUrl = useMutation({
    mutationKey: ['pubkey-profile', 'updateAvatarUrl', { solanaEndpoint, profilePda }],
    mutationFn: (options: ProfileUpdateOptions) =>
      sdk.profileUpdate({
        avatarUrl: options.avatarUrl,
        authority: '',
        community: '',
        feePayer: '',
        name: '',
        username: '',
      }),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'addAuthority', { solanaEndpoint, profilePda }],
    mutationFn: (options: ProfileAuthorityAddOptions) => sdk.profileAuthorityAdd(options),
    onError: (err) => toastError(`Error: ${err}`),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const removeAuthority = useMutation({
    mutationKey: ['pubkey-profile', 'removeAuthority', { solanaEndpoint, profilePda }],
    mutationFn: (options: ProfileAuthorityRemoveOptions) => sdk.profileAuthorityRemove(options),
    onSuccess: (tx) => {
      uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })
      return profileAccountQuery.refetch()
    },
  })

  const addIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'addIdentity', { solanaEndpoint, profilePda }],
    mutationFn: (options: ProfileIdentityAddOptions) => sdk.profileIdentityAdd(options),
    onSuccess: (tx) =>
      Promise.all([
        //pointerAccountQuery.refetch(),
        profileAccountQuery.refetch(),
      ]).then(() => uiToastLink({ label: 'View transaction', link: getExplorerUrl(`tx/${tx}`) })),
  })

  const removeIdentity = useMutation({
    mutationKey: ['pubkey-profile', 'removeIdentity', { solanaEndpoint, profilePda }],
    mutationFn: (options: ProfileIdentityRemoveOptions) => sdk.profileIdentityRemove(options),
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
