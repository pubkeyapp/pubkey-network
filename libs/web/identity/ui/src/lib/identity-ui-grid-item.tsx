import { ActionIcon, Badge, Code, Group, Text, Tooltip } from '@mantine/core'
import { ellipsify, Identity } from '@pubkey-network/sdk'
import { UiCard, UiDebugModal, UiGroup } from '@pubkey-ui/core'
import { IconTrash } from '@tabler/icons-react'
import { IdentityUiAvatar } from './identity-ui-avatar'
import { IdentityUiLink } from './identity-ui-link'
import { IdentityUiProviderHeader } from './identity-ui-provider-header'
import { IdentityUiSolanaVerifyButton } from './identity-ui-solana-verify-button'
import { IdentityUiVerified } from './identity-ui-verified'

export function IdentityUiGridItem({
  deleteIdentity,
  refresh,
  item,
}: {
  refresh?: () => void
  deleteIdentity?: (id: string) => void
  item: Identity
}) {
  return (
    <UiCard p={0}>
      <IdentityUiProviderHeader provider={item.provider}>
        {deleteIdentity && (
          <Tooltip label={`Unlink ${item.provider} identity`} withArrow>
            <ActionIcon variant="light" size="sm" color="white" onClick={() => deleteIdentity(item.id)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </IdentityUiProviderHeader>
      <Group justify="space-between" p="md" pt={0}>
        <Group>
          <IdentityUiAvatar item={item} />
          <UiGroup gap="xs" align="center">
            {item.profile?.username ? (
              <Text size="lg" display="flex">
                {item.profile?.username}
              </Text>
            ) : (
              <Code>{ellipsify(item.providerId)}</Code>
            )}
            {item.verified ? (
              <IdentityUiVerified item={item} />
            ) : refresh ? (
              <IdentityUiSolanaVerifyButton identity={item} refresh={refresh} />
            ) : (
              <Badge variant="light" color="yellow">
                Not verified
              </Badge>
            )}
          </UiGroup>
        </Group>
        <Group gap="xs">
          <UiDebugModal data={item} />
          <IdentityUiLink item={item} />
        </Group>
      </Group>
    </UiCard>
  )
}
