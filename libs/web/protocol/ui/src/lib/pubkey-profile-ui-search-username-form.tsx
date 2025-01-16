import { ActionIcon, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconSearch } from '@tabler/icons-react'

export function PubkeyProfileUiSearchUsernameForm({
  submit,
  username,
  loading,
}: {
  loading: boolean
  submit: (input: { username: string }) => Promise<void>
  username: string
}) {
  const form = useForm<{ username: string }>({
    initialValues: {
      username,
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <TextInput
        name="username"
        label="Username"
        description="The username of the profile to search for."
        disabled={loading}
        rightSection={
          <ActionIcon loading={loading} type="submit" variant="light">
            <IconSearch size={16} />
          </ActionIcon>
        }
        {...form.getInputProps('username')}
      />
    </form>
  )
}
