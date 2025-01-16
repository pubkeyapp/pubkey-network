import { Button } from '@mantine/core'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { useUserOnboarding } from '@pubkey-network/web-onboarding-data-access'
import { UiDebug, UiStack } from '@pubkey-ui/core'
import { Link } from 'react-router-dom'

export function UserOnboardingIndex() {
  const { user } = useAuth()
  const { steps } = useUserOnboarding()

  if (!user) {
    return null
  }

  return (
    <UiStack>
      {steps.map((step) => (
        <UiStack key={step.name}>
          <Button component={Link} to={`./${step.id}`}>
            {step.name}
          </Button>
          <UiDebug data={step.id} open />
        </UiStack>
      ))}
      <UiDebug data={user} open />
    </UiStack>
  )
}
