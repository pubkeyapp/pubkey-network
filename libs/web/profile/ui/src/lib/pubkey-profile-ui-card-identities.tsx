import { Divider, Paper, Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiGroup, UiStack } from '@pubkey-ui/core'
import { PubkeyProfileUiIdentity } from './pubkey-profile-ui-identity'

export function PubkeyProfileUiCardIdentities({ profile }: { profile: PubKeyProfile }) {
  return (
    <Paper withBorder py="sm">
      <UiStack>
        <UiGroup px="xs">
          <Text size="lg" fw={500}>
            Identities
          </Text>
        </UiGroup>
        <Divider />

        {profile.identities.map((item) => (
          <UiGroup px="xs" key={item.providerId}>
            <PubkeyProfileUiIdentity identity={item} key={item.providerId} />
          </UiGroup>
        ))}
      </UiStack>
    </Paper>
  )
}
