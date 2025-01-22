import { Container, Grid, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { UiHeaderProfile } from '@pubkey-network/web-core-ui'
import { useUserOnboarding } from '@pubkey-network/web-onboarding-data-access'
import { UiDebug, UiHeader, UiLayout, UiLoader, UiStack } from '@pubkey-ui/core'
import { ReactNode, Suspense } from 'react'

export function OnboardingUiLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const [opened, { toggle }] = useDisclosure(false)
  const { requirements } = useUserOnboarding()
  return (
    <UiLayout
      header={
        <UiHeader
          opened={opened}
          toggle={toggle}
          profile={
            <Group gap="xs">
              <UiHeaderProfile user={user} logout={logout} />
            </Group>
          }
        />
      }
    >
      <Suspense fallback={<UiLoader mt="xl" size="xl" type="dots" />}>
        <Grid>
          <Grid.Col span={3}>
            <UiDebug data={requirements} open />
          </Grid.Col>
          <Grid.Col span={9}>
            <Container>
              <UiStack>{children}</UiStack>
            </Container>
          </Grid.Col>
        </Grid>
      </Suspense>
    </UiLayout>
  )
}
