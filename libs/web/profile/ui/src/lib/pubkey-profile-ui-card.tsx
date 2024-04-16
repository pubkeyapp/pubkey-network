import { Group, Stack, Text } from '@mantine/core'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiCard, UiDebugModal, UiGroup, UiStack } from '@pubkey-ui/core'
import { PubkeyProfileUiAvatar } from './pubkey-profile-ui-avatar'

import { PubkeyProfileUiCardAuthorities } from './pubkey-profile-ui-card-authorities'
import { PubkeyProfileUiCardIdentities } from './pubkey-profile-ui-card-identities'

export function PubkeyProfileUiCard({ profile }: { profile: PubKeyProfile }) {
  return (
    <UiCard
      title={
        <UiGroup align="start" pt="xs">
          <Group align="center" wrap="nowrap" gap="xs">
            <PubkeyProfileUiAvatar profile={profile} />
            <Stack gap={0}>
              <Text size="xl" fw="bold">
                {profile.username}
              </Text>
            </Stack>
          </Group>
          <Group gap="xs">
            <UiDebugModal size="lg" data={profile} />
          </Group>
        </UiGroup>
      }
    >
      <UiStack mt="md">
        <PubkeyProfileUiCardIdentities profile={profile} />
        <PubkeyProfileUiCardAuthorities profile={profile} />
      </UiStack>
    </UiCard>
  )
}
