import { Stack, Text } from '@mantine/core'
import { UiLoader, UiStack } from '@pubkey-ui/core'
import React from 'react'

export function ProfileUiPubKeyLoader() {
  return (
    <UiStack align="center" gap="xs">
      <UiLoader size="xl" my="xs" mt="md" />
      <Stack gap={0}>
        <Text size="xl" fw="bold">
          Loading...
        </Text>
      </Stack>
    </UiStack>
  )
}
