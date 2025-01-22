import { Group, Text } from '@mantine/core'
import { IdentityProvider } from '@pubkey-network/sdk'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { useUserFindManyIdentity } from '@pubkey-network/web-identity-data-access'
import { IdentityUiIcon, IdentityUiLinkButton, IdentityUiList } from '@pubkey-network/web-identity-ui'
import { UiInfo, UiStack } from '@pubkey-ui/core'
import React from 'react'

export function UserOnboardingStepLinkSocial() {
  const { user } = useAuth()
  const { deleteIdentity, query, items } = useUserFindManyIdentity({ username: user?.username as string })

  const socials = [
    IdentityProvider.Discord,
    IdentityProvider.Github,
    IdentityProvider.Google,
    IdentityProvider.Telegram,
    IdentityProvider.X,
  ]

  const found = items.filter((item) => socials.includes(item.provider))

  const missing = socials.filter((provider) => !found.find((item) => item.provider === provider))

  return (
    <UiStack>
      <Text size="xl">Link your Social Identities</Text>

      <UiInfo message={`${found?.length} social identities linked`} />

      {found?.length ? (
        <IdentityUiList showProvider items={found} refresh={query.refetch} deleteIdentity={deleteIdentity} />
      ) : null}

      <UiInfo message="Link your missing social identities" />

      {missing.map((provider) => {
        return (
          <div key={provider}>
            <Group justify="space-between">
              <Group pl="lg">
                <IdentityUiIcon provider={provider} />
                <Text size="xl">{provider}</Text>
              </Group>
              <IdentityUiLinkButton identities={items} refresh={query.refetch} provider={provider} size="sm" w={210} />
            </Group>
          </div>
        )
      })}
    </UiStack>
  )
}
