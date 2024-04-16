import { Button, Group } from '@mantine/core'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { useAppConfig, useSdk } from '@pubkey-network/web-core-data-access'
import { usePubkeyProfileProgram } from '@pubkey-network/web-profile-data-access'
import { PubkeyProfileUiList } from '@pubkey-network/web-profile-ui'
import { UiDebug, UiGroup, UiInfo, UiLoader, UiPage, UiStack } from '@pubkey-ui/core'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { NavLink, useRoutes } from 'react-router-dom'

export default function UserProfileRoutes() {
  return useRoutes([
    //
    { index: true, element: <ProfileIndex /> },
    { path: 'search', element: <ProfileSearch /> },
    { path: ':username', element: <ProfileDetail /> },
  ])
}

function useGetUserProfile() {
  const sdk = useSdk()
  return useQuery({
    queryFn: () => sdk.getUserProfile().then((res) => res.data?.item),
    queryKey: ['getUserProfile'],
    retry: false,
  })
}

function useGetUserProfiles() {
  const sdk = useSdk()
  return useQuery({
    queryFn: () => sdk.getUserProfiles().then((res) => res.data?.items),
    queryKey: ['getUserProfiles'],
    retry: false,
  })
}

function useCreateUserProfile() {
  const sdk = useSdk()
  const { publicKey } = useWallet()
  return useMutation({
    mutationFn: (tx: Uint8Array) =>
      sdk
        .createUserProfile({
          // tx: bytArray of the transaction
          publicKey: publicKey?.toString() ?? '',
        })
        .then(async (res) => {
          console.log(`res`, res)

          // const tx = VersionedTransaction.deserialize(byteArray)
          // console.log(message)
          //
          // console.log(tx)
          //
          // if (!signTransaction) {
          //   throw new Error('signTransaction not found')
          // }
          //
          // const signed = await signTransaction(tx)
          //
          // console.log('signed', signed)
          //
          // const tx = new VersionedTransaction(serialized, 'confirmed')
        }),
  })
}

function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <UiPage
      title={
        <UiGroup>
          <div>PUBKEY PROFILE</div>
        </UiGroup>
      }
      rightAction={
        <Group>
          <Button component={NavLink} to="/profile/">
            Index
          </Button>
          <Button component={NavLink} to="/profile/search">
            Search
          </Button>
        </Group>
      }
    >
      {children}
    </UiPage>
  )
}

export function ProfileIndex() {
  const query = useGetUserProfiles()

  return (
    <ProfileLayout>
      {query.isLoading ? (
        <UiLoader />
      ) : query.data ? (
        <UiStack>
          <PubkeyProfileUiList profiles={query.data} />
          <UiDebug data={query.data} open />
        </UiStack>
      ) : (
        <UiStack>
          <UiInfo message="No profile found" />
        </UiStack>
      )}
    </ProfileLayout>
  )
}

export function ProfileDetail() {
  const query = useGetUserProfile()
  const mutation = useCreateUserProfile()
  const { feePayer } = useAppConfig()
  const { user } = useAuth()
  const { publicKey } = useWallet()
  const { createProfile } = usePubkeyProfileProgram()
  function createUserProfile() {
    return createProfile.mutateAsync({
      authority: publicKey as PublicKey,
      avatarUrl: user?.avatarUrl as string,
      username: user?.username as string,
      feePayer,
    })
  }
  return (
    <ProfileLayout>
      {query.isLoading ? (
        <UiLoader />
      ) : query.data ? (
        <UiDebug data={query.data} open />
      ) : (
        <UiStack>
          <UiInfo message="No profile found" />
          <Button loading={mutation.isPending} onClick={async () => createUserProfile()}>
            Create Profile
          </Button>
        </UiStack>
      )}
    </ProfileLayout>
  )
}

function ProfileSearch() {
  return (
    <ProfileLayout>
      <div>PROFILE SEARCH</div>
    </ProfileLayout>
  )
}
