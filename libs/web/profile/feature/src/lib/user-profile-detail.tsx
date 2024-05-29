import { Button } from '@mantine/core'
import { IdentityProvider } from '@pubkey-network/sdk'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { useAppConfig } from '@pubkey-network/web-core-data-access'
import {
  useCreateUserProfile,
  useGetUserProfileByUsername,
  useProfileIdentityAdd,
  useProfileIdentityRemove,
  usePubkeyProfileProgram,
} from '@pubkey-network/web-profile-data-access'
import { PubkeyProfileUiCard } from '@pubkey-network/web-profile-ui'
import { useUserFindOneUser } from '@pubkey-network/web-user-data-access'
import { toastError, toastSuccess, UiInfo, UiLoader, UiStack } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useParams } from 'react-router-dom'
import { UserProfileLayout } from './user-profile-layout'

export function UserProfileDetail() {
  const { username } = useParams() as { username: string }
  const queryProfile = useGetUserProfileByUsername({ username })
  const { query: queryUser } = useUserFindOneUser({ username })
  const mutationCreateProfile = useCreateUserProfile()
  const mutationProfileIdentityAdd = useProfileIdentityAdd()
  const mutationProfileIdentityRemove = useProfileIdentityRemove()
  const { feePayer } = useAppConfig()
  const { user } = useAuth()
  const { publicKey } = useWallet()
  const { createProfile } = usePubkeyProfileProgram()

  const isLoading = queryProfile.isLoading || queryUser.isLoading
  const profileData = queryProfile.data
  const userData = queryUser.data?.item ?? undefined

  const currentUser = userData?.username === user?.username

  async function identityAdd({ provider, providerId }: { provider: IdentityProvider; providerId: string }) {
    return mutationProfileIdentityAdd
      .mutateAsync({ provider, providerId })
      .then(async (res) => {
        toastSuccess('Identity added')
        await Promise.all([queryUser.refetch(), queryProfile.refetch()])
      })
      .catch((err) => toastError(`Error adding identity: ${err}`))
  }

  async function identityRemove({ provider, providerId }: { provider: IdentityProvider; providerId: string }) {
    return mutationProfileIdentityRemove
      .mutateAsync({ provider, providerId })
      .then(async (res) => {
        toastSuccess('Identity removed')
        await Promise.all([queryUser.refetch(), queryProfile.refetch()])
      })
      .catch((err) => toastError(`Error removing identity: ${err}`))
  }

  function createUserProfile() {
    return createProfile.mutateAsync({
      authority: publicKey as PublicKey,
      avatarUrl: user?.avatarUrl as string,
      username: user?.username as string,
      feePayer,
    })
  }

  return (
    <UserProfileLayout>
      {isLoading ? (
        <UiLoader />
      ) : profileData ? (
        <UiStack>
          <PubkeyProfileUiCard
            profile={profileData}
            user={userData}
            identityAdd={currentUser ? (res) => identityAdd(res) : undefined}
            identityRemove={currentUser ? (res) => identityRemove(res) : undefined}
          />
        </UiStack>
      ) : (
        <UiStack>
          <UiInfo message="No profile found" />
          <Button loading={mutationCreateProfile.isPending} onClick={async () => createUserProfile()}>
            Create Profile
          </Button>
        </UiStack>
      )}
    </UserProfileLayout>
  )
}
