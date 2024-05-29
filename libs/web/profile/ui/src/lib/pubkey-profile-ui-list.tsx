import { SimpleGrid } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'

import { PubkeyProfileUiCard } from './pubkey-profile-ui-card'

export function PubkeyProfileUiList({ profiles }: { profiles: PubKeyProfile[] }) {
  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }}>
      {profiles?.map((account) => (
        <PubkeyProfileUiCard key={account.publicKey?.toString()} profile={account} withLink />
      ))}
    </SimpleGrid>
  )
}
