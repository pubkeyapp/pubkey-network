import { ActionIcon, Button, rem, Switch, Text } from '@mantine/core'
import { ellipsify, IdentityProvider, PubkeyProfile } from '@pubkey-network/sdk'
import { WalletDisconnectButton, WalletIcon, WalletMultiButton } from '@pubkey-network/wallet-adapter-mantine-ui'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { useAppConfig } from '@pubkey-network/web-core-data-access'
import { useCreateSignature, useUserFindManyIdentity } from '@pubkey-network/web-identity-data-access'
import {
  useGetPubKeyProfile,
  useGetUserProfile,
  usePubkeyProfileProgram,
} from '@pubkey-network/web-profile-data-access'
import {
  ProfileUiPubKeyLoader,
  ProfileUiPubKeyProfile,
  PubkeyProfileUiCreateForm,
} from '@pubkey-network/web-profile-ui'
import {
  toastError,
  toastSuccess,
  UiCard,
  UiDebug,
  UiDebugModal,
  UiGroup,
  UiStack,
  useUiBreakpoints,
} from '@pubkey-ui/core'
import { verifySignature } from '@pubkeyapp/solana-verify-wallet'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { IconRefresh, IconUsb, IconWallet } from '@tabler/icons-react'
import React, { useCallback, useEffect, useState } from 'react'

export function DevPubkeyLogin() {
  const { isSm } = useUiBreakpoints()
  const { user } = useAuth()
  const { items } = useUserFindManyIdentity({ username: user?.username as string })
  const { connected, publicKey } = useWallet()
  const [signed, setSigned] = useState<boolean>(false)
  const challenge = 'Sign this message to verify your wallet'
  const createSignature = useCreateSignature()
  const { loading, profile, loadProfile } = useGetPubKeyProfile({ providerId: publicKey?.toString() })

  useEffect(() => {
    setSigned(false)
  }, [publicKey])
  const sign = useCallback(
    async (useLedger: boolean) => {
      setSigned(false)
      if (!publicKey) {
        toastError({ message: 'No public key', title: 'Error signing message' })
        return false
      }

      const signature = await createSignature({
        challenge,
        publicKey: publicKey.toString(),
        useLedger,
      }).catch((err) => toastError({ message: `${err}`, title: 'Error signing message' }))

      if (!signature) {
        toastError({
          message: 'No signature',
          title: 'Error signing message',
        })
        return false
      }

      const verified = verifySignature({
        challenge,
        publicKey: publicKey.toString(),
        signature,
        useLedger,
      })

      if (!verified) {
        toastError({
          message: 'Failed to verify signature',
          title: 'Error signing message',
        })
        return false
      }

      setSigned(true)
      toastSuccess({
        message: 'Successfully verified signature',
        title: 'Success signing message',
      })
      return !!signature
    },
    [challenge, createSignature, publicKey],
  )

  return (
    <UiStack my="xl" w={isSm ? '100%' : 600} mx={isSm ? undefined : 'auto'}>
      <UiStack my="xl" w={isSm ? '100%' : 600} mx={isSm ? undefined : 'auto'}>
        <UiCard radius="lg" p={isSm ? 'md' : 'lg'}>
          <UiStack>
            <UiGroup justify="end" w={isSm ? '100%' : undefined} gap="xs">
              <ActionIcon size="sm" variant="light" onClick={() => loadProfile()}>
                <IconRefresh size={14} />
              </ActionIcon>
              {connected ? (
                <WalletDisconnectButton variant="light" size="xs" fullWidth={isSm} />
              ) : (
                <WalletMultiButton variant="light" size="xs" fullWidth={isSm} />
              )}
            </UiGroup>
            {publicKey ? (
              <IdentityUiProfileLoader loading={loading} profile={profile ?? undefined} publicKey={publicKey} />
            ) : (
              <ProfileUiPubKeyProfile avatarUrl="/assets/icon.svg" label="Sign in to PubKey" />
            )}
            {signed && publicKey ? (
              <IdentityUiPubkeyDashboard publicKey={publicKey} refresh={loadProfile} />
            ) : (
              <IdentityUiPubkeyWizard sign={sign} />
            )}
          </UiStack>
        </UiCard>
        <UiGroup justify="center">
          <Text size="xs" c="dimmed">
            Powered by <strong>PubKey</strong>
          </Text>
        </UiGroup>
      </UiStack>
      <UiDebug
        data={{
          publicKey: publicKey?.toString(),
          providers: Object.keys(IdentityProvider),
          identities: items.map((i) => [i.provider, i.providerId]),
        }}
      />
    </UiStack>
  )
}

export interface IdentityUiPubkeyWizardProps {
  sign: (useLedger: boolean) => Promise<boolean>
  profile?: PubkeyProfile
}

export function IdentityUiPubkeyWizard({ sign }: IdentityUiPubkeyWizardProps) {
  const { isSm } = useUiBreakpoints()
  const { connected, publicKey } = useWallet()
  const [useLedger, setUseLedger] = useState<boolean>(false)

  return (
    <UiStack mt="md" gap="xl">
      <UiStack align="center">
        {connected && publicKey ? (
          <IdentityWizardButton publicKey={publicKey} onClick={() => sign(useLedger)} />
        ) : (
          <UiStack align="center">
            <Text size="xs" c="dimmed">
              Connect your Solana wallet to continue.
            </Text>
            <WalletMultiButton label="Connect Wallet" size="lg" fullWidth={isSm} />
          </UiStack>
        )}
        <Switch
          label={`Use ${useLedger ? 'Ledger' : 'Wallet'}`}
          size="sm"
          checked={useLedger}
          onChange={() => setUseLedger((useLedger) => !useLedger)}
          onLabel={<IconUsb style={{ width: rem(14), height: rem(14) }} stroke={1.5} />}
          offLabel={<IconWallet style={{ width: rem(14), height: rem(14) }} stroke={1.5} />}
        />
      </UiStack>
    </UiStack>
  )
}

export function IdentityUiPubkeyDashboard({ publicKey, refresh }: { publicKey: PublicKey; refresh: () => void }) {
  const { profile } = useGetPubKeyProfile({ providerId: publicKey.toString() })
  return (
    <UiStack mt="md" gap="xl">
      <UiStack align="center">
        {profile ? (
          <IdentityUiPubkeyManage publicKey={publicKey} />
        ) : (
          <IdentityUiPubkeyCreateProfile publicKey={publicKey} refresh={refresh} />
        )}
      </UiStack>
    </UiStack>
  )
}

export function IdentityUiPubkeyManage({ publicKey }: { publicKey: PublicKey }) {
  const { isSm } = useUiBreakpoints()
  const { profile } = useGetPubKeyProfile({ providerId: publicKey.toString() })

  if (!profile) {
    return null
  }

  return (
    <UiStack align="center">
      <Text size="xs" c="dimmed">
        Manage profile <strong>{profile?.username}</strong> using <strong>{ellipsify(publicKey?.toString(), 6)}</strong>
        .
      </Text>
      <UiGroup align="center" w={isSm ? '100%' : undefined}>
        <Button size="lg" onClick={() => toastSuccess('TBD: Manage profile')}>
          Manage Profile
        </Button>
      </UiGroup>
      <UiDebugModal data={profile} />
    </UiStack>
  )
}

export function IdentityUiPubkeyCreateProfile({ publicKey, refresh }: { publicKey: PublicKey; refresh: () => void }) {
  const { isSm } = useUiBreakpoints()
  const { profile } = useGetPubKeyProfile({ providerId: publicKey.toString() })

  const query = useGetUserProfile()
  const { pubkeyProtocolSigner } = useAppConfig()
  const { createProfile } = usePubkeyProfileProgram()
  if (profile) {
    refresh()
    return null
  }
  const username = `${publicKey?.toString().substring(0, 8)}_`

  return (
    <UiStack align="center">
      <Text size="xs" c="dimmed">
        Create a profile using <strong>{ellipsify(publicKey?.toString(), 6)}</strong>.
      </Text>
      <PubkeyProfileUiCreateForm
        username={username}
        avatarUrl={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${username}`}
        authority={publicKey}
        loading={createProfile.isPending}
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
            .then(async () => {
              // Sleep for a bit to allow the profile to be created
              await new Promise((resolve) => setTimeout(resolve, 1000))
              await query.refetch()
              refresh()
            })
        }}
      >
        <UiGroup align="center" w={isSm ? '100%' : undefined}>
          <Button size="lg" type="submit" onClick={() => toastSuccess('TBD: Create profile')}>
            Create Profile
          </Button>
        </UiGroup>
      </PubkeyProfileUiCreateForm>
    </UiStack>
  )
}

function IdentityWizardButton({ publicKey, onClick }: { publicKey: PublicKey; onClick: () => void }) {
  const { profile, username } = useGetPubKeyProfile({ providerId: publicKey.toString() })
  const { isSm } = useUiBreakpoints()
  const { wallet } = useWallet()

  return (
    <UiStack align="center">
      <Text size="xs" c="dimmed">
        {username ? (
          <span>
            Sign in as <strong>{username}</strong>
          </span>
        ) : (
          <span>Sign up to create a profile</span>
        )}{' '}
        using <strong>{ellipsify(publicKey?.toString(), 6)}</strong>.
      </Text>
      <Button
        leftSection={wallet ? <WalletIcon wallet={wallet} size="lg" /> : undefined}
        style={{ flexGrow: isSm ? 1 : undefined }}
        size="lg"
        onClick={onClick}
      >
        Verify to sign {profile ? 'in' : 'up'}
      </Button>
    </UiStack>
  )
}

function IdentityUiProfileLoader({
  loading,
  profile,
  publicKey,
}: {
  loading: boolean
  profile?: PubkeyProfile
  publicKey?: PublicKey
}) {
  return loading ? (
    <ProfileUiPubKeyLoader />
  ) : profile ? (
    <ProfileUiPubKeyProfile avatarUrl={profile.avatarUrl} label={profile.username} />
  ) : (
    <ProfileUiPubKeyProfile label={ellipsify(publicKey?.toString())} />
  )
}
