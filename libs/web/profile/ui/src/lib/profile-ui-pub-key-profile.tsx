import { Stack, Text } from '@mantine/core'
import { UiAvatar, UiStack } from '@pubkey-ui/core'
import React from 'react'

export function ProfileUiPubKeyProfile({ avatarUrl, label }: { avatarUrl?: string; label?: string }) {
  return (
    <UiStack align="center" gap="xs">
      <UiAvatar url={avatarUrl ? avatarUrl : null} name={label} radius="lg" size="xl" />
      <Stack gap={0}>
        <Text size="xl" fw="bold">
          {label}
        </Text>
      </Stack>
    </UiStack>
  )
}
