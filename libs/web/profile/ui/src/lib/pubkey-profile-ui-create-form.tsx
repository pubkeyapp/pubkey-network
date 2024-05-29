import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { CreateProfileOptions } from '@pubkey-program-library/sdk'
import { UiStack } from '@pubkey-ui/core'
import { PublicKey } from '@solana/web3.js'

export function PubkeyProfileUiCreateForm({
  submit,
  username,
  avatarUrl,
  authority,
  loading,
}: {
  loading: boolean
  authority: PublicKey
  submit: (input: Omit<CreateProfileOptions, 'feePayer'>) => Promise<void>
  username: string
  avatarUrl: string
}) {
  const form = useForm<Omit<CreateProfileOptions, 'feePayer'>>({
    initialValues: {
      authority,
      avatarUrl,
      username,
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <TextInput
          name="authority"
          label="Authority"
          description="The public key that has authority to update this profile. You can later add more authorities to this profile."
          readOnly={true}
          {...form.getInputProps('authority')}
        />
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
        <Group justify="right">
          <Button loading={loading} type="submit">
            Create Profile
          </Button>
        </Group>
      </UiStack>
    </form>
  )
}
