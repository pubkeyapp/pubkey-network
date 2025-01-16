import { Button, Container, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { UiHeaderProfile } from '@pubkey-network/web-core-ui'
import { useUserOnboarding } from '@pubkey-network/web-onboarding-data-access'
import { UiHeader, UiLayout, UiLoader, UiStack } from '@pubkey-ui/core'
import { ReactNode, Suspense } from 'react'
import { Link, useLocation } from 'react-router-dom'

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
          <UiStack>
            <OnboardingUiSteps />
            {children}
          </UiStack>
        </Container>
      </Suspense>
    </UiLayout>
  )
}

export function OnboardingUiSteps() {
  const { steps } = useUserOnboarding()
  const pathname = useLocation().pathname
  return (
    <Group>
      {steps.map((step) => {
        const active = pathname.includes(step.id)
        return (
          <div key={step.id}>
            <Button component={Link} to={`./${step.id}`} variant={active ? 'filled' : 'light'}>
              {step.name}
            </Button>
          </div>
        )
      })}
    </Group>
  )
}
