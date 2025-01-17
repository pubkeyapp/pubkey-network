import { Button, CloseButton, Group, Paper, Stack, Text } from '@mantine/core'
import { IdentityProvider } from '@pubkey-network/sdk'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { useUserFindManyIdentity } from '@pubkey-network/web-identity-data-access'
import { IdentityUiLinkButton, IdentityUiList } from '@pubkey-network/web-identity-ui'
import { useUserOnboarding } from '@pubkey-network/web-onboarding-data-access'
import { UiDebug, UiStack } from '@pubkey-ui/core'
import { IconCheck, IconCurrencySolana, IconSocial, IconUserCode } from '@tabler/icons-react'
import React, { ComponentType } from 'react'

export function UserOnboardingIndex() {
  const { user } = useAuth()
  const { deleteIdentity, query, items, hasSolana } = useUserFindManyIdentity({ username: user?.username as string })

  const { avatarUrls, usernames, refresh } = useUserOnboarding()
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
      <OnboardingCard
        icon={IconSocial}
        title="Social identities"
        description="Link your social identities to your profile"
      >
        <UiStack>
          {found.length ? (
            <IdentityUiList showProvider items={found} refresh={query.refetch} deleteIdentity={deleteIdentity} />
          ) : null}

          <Group justify="space-evenly">
            {missing.map((provider) => {
              return (
                <IdentityUiLinkButton
                  key={provider}
                  identities={items}
                  refresh={query.refetch}
                  provider={provider}
                  size="sm"
                  w={210}
                />
              )
            })}
          </Group>
        </UiStack>
      </OnboardingCard>
      <OnboardingCard
        icon={IconCurrencySolana}
        title="Solana wallets"
        description="Link your Solana wallets to your profile"
      >
        <UiStack>
          <Text>Content</Text>
        </UiStack>
      </OnboardingCard>
      <OnboardingCard icon={IconUserCode} title="Select your username" description="Choose a username for your profile">
        <UiStack>
          <Text>Content</Text>
          <UiDebug data={{ avatarUrls, usernames }} open />
          <Button onClick={refresh}>Refresh</Button>
        </UiStack>
      </OnboardingCard>
      <OnboardingCard icon={IconCheck} title="Create your profile" description="Create your profile on Solana">
        <UiStack>
          <Text>Content</Text>
        </UiStack>
      </OnboardingCard>
    </UiStack>
  )
}

export function CookiesBanner() {
  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      <Group justify="space-between" mb="xs">
        <Text fz="md" fw={500}>
          Allow cookies
        </Text>
        <CloseButton mr={-9} mt={-9} />
      </Group>
      <Text c="dimmed" fz="xs">
        So the deal is, we want to spy on you. We would like to know what did you have for todays breakfast, where do
        you live, how much do you earn and like 50 other things. To view our landing page you will have to accept all
        cookies. That&apos;s all, and remember that we are watching...
      </Text>
      <Group justify="flex-end" mt="md">
        <Button variant="default" size="xs">
          Cookies preferences
        </Button>
        <Button variant="outline" size="xs">
          Accept all
        </Button>
      </Group>
    </Paper>
  )
}

export function OnboardingCard({
  description,
  title,
  icon: Icon,
  children,
}: {
  description: string
  title: string
  icon: ComponentType<{ size: number; color: string }>
  children: React.ReactNode
}) {
  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      <Group justify="space-between" mb="xs">
        <Stack gap="xs">
          <Group gap="xs">
            <Icon size={20} color="var(--mantine-color-blue-6)" />
            <Text fz="md" fw={500}>
              {title}
            </Text>
          </Group>
          <Text fz="sm" c="dimmed">
            {description}
          </Text>
        </Stack>
      </Group>
      {children}
    </Paper>
  )
}
