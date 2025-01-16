import { useAuth } from '@pubkey-network/web-auth-data-access'
import { useAppConfig } from '@pubkey-network/web-core-data-access'
import {
  useCreateUserProfile,
  useGetUserProfile,
  usePubkeyProfileProgram,
} from '@pubkey-network/web-protocol-data-access'
import { PubkeyProfileUiCard, PubkeyProfileUiCreateForm } from '@pubkey-network/web-protocol-ui'
import { UiCard, UiInfo, UiLoader, UiStack } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { UserProfileLayout } from './user-profile-layout'

export function UserProfileCreate() {
  const query = useGetUserProfile()
  const mutation = useCreateUserProfile()
  const { pubkeyProtocolSigner } = useAppConfig()
  const { user } = useAuth()
  const { publicKey } = useWallet()
  const { createProfile } = usePubkeyProfileProgram()

  return (
    <UserProfileLayout>
      {query.isLoading ? (
        <UiLoader />
      ) : query.data ? (
        <UiStack>
          <UiInfo title="Profile already exists" message="You can't create a profile with the same username." />
          <PubkeyProfileUiCard profile={query.data} />
        </UiStack>
      ) : publicKey ? (
        <UiStack>
          <UiInfo title="No profile found" message="We couldn't find a profile for you. Create one now." />
          <UiCard>
            <PubkeyProfileUiCreateForm
              username={user?.username as string}
              avatarUrl={user?.avatarUrl as string}
              authority={publicKey}
              loading={mutation.isPending}
              submit={async ({ avatarUrl, username }) => {
                await createProfile
                  .mutateAsync({
                    authority: publicKey as PublicKey,
                    avatarUrl,
                    feePayer: pubkeyProtocolSigner,
                    username,
                    name: `${username}`,
                    community: PublicKey.unique(),
                  })
                  .then(() => query.refetch())
              }}
            />
          </UiCard>
        </UiStack>
      ) : (
        <UiStack>
          <UiInfo message="Connect your wallet to continue" />
        </UiStack>
      )}
    </UserProfileLayout>
  )
}
