import { SimpleGrid } from '@mantine/core'
import { Identity } from '@pubkey-network/sdk'
import { IdentityUiGridItem } from './identity-ui-grid-item'

export function IdentityUiGrid({
  deleteIdentity,
  refresh,
  items,
}: {
  refresh?: () => void
  deleteIdentity?: (id: string) => void
  items: Identity[]
}) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
      {items?.map((item) => (
        <IdentityUiGridItem key={item.id} item={item} deleteIdentity={deleteIdentity} refresh={refresh} />
      ))}
    </SimpleGrid>
  )
}
