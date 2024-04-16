import { Button, Group, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { CreateProfileOptions } from '@pubkey-network/web-profile-data-access'
import { UiStack } from '@pubkey-ui/core'

export function PubkeyProfileUiCreateForm({
  submit,
}: {
  submit: (input: Omit<CreateProfileOptions, 'feePayer' | 'authority'>) => Promise<void>
}) {
  const form = useForm<Omit<CreateProfileOptions, 'feePayer' | 'authority'>>({
    initialValues: {
      avatarUrl: '',
      username: '',
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <UiStack>
        <TextInput name="username" label="Username" {...form.getInputProps('username')} />
        <TextInput name="avatarUrl" label="AvatarUrl" type="url" {...form.getInputProps('avatarUrl')} />
        <Group justify="right">
          <Button type="submit">Save</Button>
        </Group>
      </UiStack>
    </form>
  )
}
