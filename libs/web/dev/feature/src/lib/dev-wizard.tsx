import { Button, Text } from '@mantine/core'
import { toastSuccess, UiCard, UiDebug, UiGroup, UiLoader, UiStack } from '@pubkey-ui/core'
import { IconCheck, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { ReactNode } from 'react'
import { useWizard, Wizard } from 'react-use-wizard'

export function DevWizard() {
  return (
    <Wizard>
      <Step1 />
      <Step2 />
      <Step3 />
    </Wizard>
  )
}

function Step1() {
  const { handleStep } = useWizard()
  // Attach an optional handler
  handleStep(async () => {
    toastSuccess('Going to step 2')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toastSuccess('Done')
  })

  return (
    <StepCard>
      <Text>Content of Step 1</Text>
    </StepCard>
  )
}

function Step2() {
  const { handleStep, isLoading } = useWizard()

  // Attach an optional handler
  handleStep(async () => {
    toastSuccess('Going to step 3')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toastSuccess('Done')
  })

  return (
    <StepCard>
      <Text>Content of Step 2</Text>
      {isLoading ? <UiLoader /> : null}
    </StepCard>
  )
}

function Step3() {
  return (
    <StepCard>
      <Text>Content of Step 3</Text>
    </StepCard>
  )
}
function StepCard({ children, title }: { children: ReactNode; title?: string }) {
  const { previousStep, nextStep, isLastStep, isLoading, isFirstStep } = useWizard()
  const wizard = useWizard()
  title = title ?? `Step ${wizard.activeStep + 1}/${wizard.stepCount}`
  return (
    <UiStack>
      <UiCard title={title}>
        <UiStack>
          {children}
          <UiGroup>
            <Button
              variant="light"
              leftSection={<IconChevronLeft size={16} stroke={1.5} />}
              disabled={isFirstStep}
              onClick={() => previousStep()}
            >
              Back
            </Button>
            <Button
              loading={isLoading}
              rightSection={
                isLastStep ? <IconCheck size={16} stroke={1.5} /> : <IconChevronRight size={16} stroke={1.5} />
              }
              disabled={isLastStep}
              onClick={() => nextStep()}
            >
              {isLastStep ? 'Done' : 'Next'}
            </Button>
          </UiGroup>
        </UiStack>
      </UiCard>
      <UiDebug data={wizard} open />
    </UiStack>
  )
}
