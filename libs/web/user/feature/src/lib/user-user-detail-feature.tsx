import { Alert, Button, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { ellipsify } from '@pubkey-network/sdk'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { UiGrid } from '@pubkey-network/web-core-ui'
import { useUserFindManyIdentity } from '@pubkey-network/web-identity-data-access'
import { IdentityUiAvatar, IdentityUiBadge, IdentityUiLink } from '@pubkey-network/web-identity-ui'
import { useUserFindOneUser } from '@pubkey-network/web-user-data-access'
import { UserUiProfile } from '@pubkey-network/web-user-ui'
import { UiCard, UiContainer, UiDebugModal, UiGroup, UiLoader, UiStack, UiWarning } from '@pubkey-ui/core'
import { IconMoodSmile } from '@tabler/icons-react'
import { Link, useParams } from 'react-router-dom'

export default function UserUserDetailFeature() {
  const { user: authUser } = useAuth()
  const { username } = useParams<{ username: string }>() as { username: string }
  const { user, query } = useUserFindOneUser({ username })
  const { items } = useUserFindManyIdentity({ username })

  if (query.isLoading) {
    return <UiLoader />
  }

  if (!user) {
    return <UiWarning message="User not found" />
  }

  const isAuthUser = authUser?.id === user.id

  return (
    <UiContainer>
      <UiGrid
        sidebar={
          <UserUiProfile
            user={user}
            action={
              isAuthUser ? (
                <Button size="xs" variant="light" component={Link} to={`/settings`}>
                  Edit profile
                </Button>
              ) : null
            }
          />
        }
      >
        <UiStack>
          <Alert icon={<IconMoodSmile size="2rem" />} title="Hello there!" color="brand" variant="outline">
            It's quite empty here. At some point you'll be able to see the content of this user. Or maybe not.
          </Alert>
          <SimpleGrid cols={{ md: 2 }}>
            {items?.map((identity) => (
              <UiCard key={identity.id}>
                <UiGroup align="start">
                  <Group>
                    <IdentityUiAvatar item={identity} />
                    <Stack gap={0}>
                      <Text size="lg" fw="bold">
                        {ellipsify(identity.name ?? identity.providerId, 6)}
                      </Text>
                      <IdentityUiBadge provider={identity.provider} />
                    </Stack>
                  </Group>
                  <Group gap={2}>
                    <UiDebugModal data={identity} />
                    <IdentityUiLink item={identity} />
                  </Group>
                </UiGroup>
              </UiCard>
            ))}
          </SimpleGrid>
        </UiStack>
      </UiGrid>
    </UiContainer>
  )
}
