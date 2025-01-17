import { Container, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { UiHeaderProfile } from '@pubkey-network/web-core-ui'
import { UiHeader, UiLayout, UiLoader, UiStack } from '@pubkey-ui/core'
import { ReactNode, Suspense } from 'react'

export function OnboardingUiLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const [opened, { toggle }] = useDisclosure(false)

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
        <Container>
          <UiStack>{children}</UiStack>
        </Container>
      </Suspense>
    </UiLayout>
  )
}
