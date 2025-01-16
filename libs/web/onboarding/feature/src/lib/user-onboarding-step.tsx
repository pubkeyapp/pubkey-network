import { useUserOnboarding } from '@pubkey-network/web-onboarding-data-access'
import { UiDebug, UiError, UiStack } from '@pubkey-ui/core'
import { useParams } from 'react-router-dom'

export function UserOnboardingStep() {
  const { step } = useParams() as { step: string }
  const { steps } = useUserOnboarding()

  const current = steps.find((s) => s.id === step)

  if (!current) {
    return <UiError message={`Step ${step} not found`} />
  }

  return (
    <UiStack>
      {current.component}
      <UiDebug data={{ step }} open />
    </UiStack>
  )
}
