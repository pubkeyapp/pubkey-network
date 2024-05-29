import { Group, Stack, Text } from '@mantine/core'
import { AppIdentity } from '@pubkey-network/sdk'
import { useCluster } from '@pubkey-network/web-solana-data-access'
import { UiAnchor } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { PubkeyProfileUiProvider } from './pubkey-profile-ui-provider'

export function useGetIdentityUrl(identity: AppIdentity) {
  const { getExplorerUrl } = useCluster()

  switch (identity.provider.toString().toLowerCase()) {
    case 'discord':
      return `https://discord.com/users/${identity.providerId}`
    case 'github':
      return `https://github.com/${identity.name ?? identity.providerId}`
    case 'solana':
      return getExplorerUrl(`address/${identity.providerId}`)
    case 'twitter':
      return `https://x.com/${identity.name ?? identity.providerId}`
    default:
      return undefined
  }
}

export function PubkeyProfileUiIdentity({ children, identity }: { children?: ReactNode; identity: AppIdentity }) {
  const to = useGetIdentityUrl(identity)

  return (
    <Group justify="space-between" w="100%">
      <Group gap="xs">
        <PubkeyProfileUiProvider provider={identity.provider} />
        <Stack gap={0}>
          <UiAnchor to={to}>
            <Text fw="bold" size="sm">
              {identity.name}
            </Text>
          </UiAnchor>
          <Text size="xs" c="dimmed">
            {identity.providerId}
          </Text>
        </Stack>
      </Group>
      {children}
    </Group>
  )
}
