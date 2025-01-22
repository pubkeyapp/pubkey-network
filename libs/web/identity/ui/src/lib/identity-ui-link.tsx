import { ActionIcon, ActionIconProps, Tooltip } from '@mantine/core'
import { Identity } from '@pubkey-network/sdk'
import { IconExternalLink } from '@tabler/icons-react'

export function IdentityUiLink({ item, ...props }: ActionIconProps & { item: Identity }) {
  return item.url ? (
    <Tooltip label={`Visit identity on ${item.provider}`} withArrow position="top">
      <ActionIcon size="sm" color="brand" variant="light" component="a" href={item.url} target="_blank" {...props}>
        <IconExternalLink size={16} />
      </ActionIcon>
    </Tooltip>
  ) : null
}
