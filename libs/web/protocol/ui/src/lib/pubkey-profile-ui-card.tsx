import { Anchor, Group, Stack, Text } from '@mantine/core'
import { IdentityProvider, PubkeyProfile as SdkPubKeyProfile, User } from '@pubkey-network/sdk'
import { PubKeyProfile } from '@pubkey-protocol/sdk'
import { UiCard, UiDebugModal, UiGroup, UiStack } from '@pubkey-ui/core'
import { Link } from 'react-router-dom'
import { PubkeyProfileUiAvatar } from './pubkey-profile-ui-avatar'
import { PubkeyProfileUiCardAuthorities } from './pubkey-profile-ui-card-authorities'
import { PubkeyProfileUiCardIdentities } from './pubkey-profile-ui-card-identities'

export function PubkeyProfileUiCard({
  profile,
  user,
  withLink,
  identityAdd,
  identityRemove,
}: {
  profile: PubKeyProfile | SdkPubKeyProfile
  user?: User | undefined
  withLink?: boolean
  identityAdd?: (input: { provider: IdentityProvider; providerId: string }) => Promise<void>
  identityRemove?: (input: { provider: IdentityProvider; providerId: string }) => Promise<void>
}) {
  return (
    <UiCard
      title={
        <UiGroup align="start" pt="xs">
          <Group align="center" wrap="nowrap" gap="xs">
            <PubkeyProfileUiAvatar profile={profile} />
            <Stack gap={0}>
              {withLink ? (
                <Anchor component={Link} to={`/profile/${profile.username}`} size="xl" fw="bold">
                  {profile.username}
                </Anchor>
              ) : (
                <Text size="xl" fw="bold">
                  {profile.username}
                </Text>
              )}
            </Stack>
          </Group>
          <Group gap="xs">
            <UiDebugModal size="lg" data={profile} />
          </Group>
        </UiGroup>
      }
    >
      <UiStack mt="md">
        <PubkeyProfileUiCardIdentities
          profile={profile}
          user={user}
          identityAdd={identityAdd}
          identityRemove={identityRemove}
        />
        <PubkeyProfileUiCardAuthorities profile={profile} />
      </UiStack>
    </UiCard>
  )
}
