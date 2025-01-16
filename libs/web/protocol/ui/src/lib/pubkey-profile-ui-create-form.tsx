import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { ProfileCreateOptions } from '@pubkey-protocol/sdk'
import { UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'
import { ReactNode, useMemo } from 'react'
import { ProfileUiPubKeyProfile } from './profile-ui-pub-key-profile'

export function PubkeyProfileUiCreateForm({
  submit,
  children,
  username,
  avatarUrl,
  authority,
  loading,
}: {
  loading: boolean
  children?: ReactNode
  authority: PublicKey
  submit: (input: Omit<ProfileCreateOptions, 'feePayer'>) => Promise<void>
  username: string
  avatarUrl: string
}) {
  const form = useForm<Omit<ProfileCreateOptions, 'feePayer'>>({
    initialValues: {
      authority,
      avatarUrl,
      username,
      community: PublicKey.unique(),
      name: username,
    },
  })

  const profile = useMemo(
    () => ({
      avatarUrl: form.values.avatarUrl,
      username: form.values.username,
    }),
    [form.values],
  )

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <TextInput
          name="username"
          label="Username"
          description="The username of the profile. Make sure to pick one that you like as you won't be able to change it later."
          disabled={loading}
          {...form.getInputProps('username')}
        />
        <TextInput
          disabled={loading}
          name="avatarUrl"
          label="Avatar URL"
          description="The URL of the profile avatar. You can update this later if you want to change it."
          type="url"
          {...form.getInputProps('avatarUrl')}
        />
        <Group justify="center" mt="md">
          <ProfileUiPubKeyProfile avatarUrl={profile.avatarUrl} label={profile.username} />
        </Group>
        <Group justify="center">
          {children ? (
            children
          ) : (
            <Button loading={loading} type="submit">
              Create Profile
            </Button>
          )}
        </Group>
      </UiStack>
    </form>
  )
}
