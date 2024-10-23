import { ActionIcon, Group, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IdentityProvider } from '@pubkey-protocol/sdk'
import { getEnumOptions } from '@pubkey-ui/core'
import { IconSearch } from '@tabler/icons-react'

export function PubkeyProfileUiSearchProviderForm({
  loading,
  provider,
  providerId,
  submit,
}: {
  loading: boolean
  provider: IdentityProvider
  providerId: string
  submit: (input: { provider: IdentityProvider; providerId: string }) => Promise<void>
}) {
  const form = useForm<{ provider: IdentityProvider; providerId: string }>({
    initialValues: {
      provider,
      providerId,
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => submit(values))}>
      <Group>
        <Select
          data={getEnumOptions(IdentityProvider)}
          name="provider"
          label="Provider"
          description="The provider of the profile to search for."
          disabled={loading}
          {...form.getInputProps('provider')}
        />
        <TextInput
          name="providerId"
          label="ProviderId"
          description="The providerId of the profile to search for."
          disabled={loading}
          rightSection={
            <ActionIcon loading={loading} type="submit" variant="light">
              <IconSearch size={16} />
            </ActionIcon>
          }
          {...form.getInputProps('providerId')}
        />
      </Group>
    </form>
  )
}
