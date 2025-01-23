import { Group, Text } from '@mantine/core'
import { IdentityProvider } from '@pubkey-network/sdk'
import { ReactNode } from 'react'
import { getIdentityProviderColor } from './get-identity-provider-color'
import { IdentityUiIcon } from './identity-ui-icon'

export function IdentityUiProviderHeader({ children, provider }: { children: ReactNode; provider: IdentityProvider }) {
  const color = getIdentityProviderColor(provider)
  return (
    <Group
      justify="space-between"
      p="md"
      c="white"
      style={{
        background: `linear-gradient(90deg, ${color} 0%, ${color}00 100%)`,
      }}
    >
      <Group>
        <IdentityUiIcon provider={provider} />
        <Text size="lg" display="flex">
          {provider}
        </Text>
      </Group>
      <Group gap="xs">{children}</Group>
    </Group>
  )
}
