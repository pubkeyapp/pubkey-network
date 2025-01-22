import { Button, Group, Paper, Select, Stack, Text } from '@mantine/core'
import { IdentityProvider } from '@pubkey-network/sdk'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { useUserFindManyIdentity } from '@pubkey-network/web-identity-data-access'
import { IdentityUiGrid, IdentityUiLinkButton } from '@pubkey-network/web-identity-ui'
import { useUserOnboarding } from '@pubkey-network/web-onboarding-data-access'
import { UiStack } from '@pubkey-ui/core'
import { IconCurrencySolana, IconRocket, IconSocial, IconUserHeart } from '@tabler/icons-react'
import React, { ComponentType } from 'react'
import { OnboardingUiSelectAvatarUrl } from './onboarding-ui-select-username'

export function UserOnboardingIndex() {
  const { user, refresh: authRefresh } = useAuth()
  const { deleteIdentity, query, items } = useUserFindManyIdentity({ username: user?.username as string })
  const {
    refresh,
    usernames,
    avatarUrl,
    avatarUrls,
    username,
    setUsername,
    setAvatarUrl,
    requirements,
    createProfile,
    updateProfile,
  } = useUserOnboarding()

  // Get the Solana identities
  const solana = items.filter((item) => item.provider === IdentityProvider.Solana)
  // Get the social identities for these providers
  const providers = [
    IdentityProvider.Discord,
    IdentityProvider.Github,
    IdentityProvider.Google,
    // IdentityProvider.Telegram,
    IdentityProvider.X,
  ]
  const found = items.filter((item) => providers.includes(item.provider))
  // Get the missing social identities
  const missing = providers.filter((provider) => !found.find((item) => item.provider === provider))

  return (
    <UiStack>
      <UiStack>
        <OnboardingCard
          icon={IconSocial}
          title="Social identities"
          description="Link your social identities to your profile"
        >
          <UiStack pt="md">
            {found.length ? (
              <IdentityUiGrid
                items={found}
                refresh={async () => {
                  await query.refetch()
                  await refresh()
                }}
                deleteIdentity={async (id) => {
                  await deleteIdentity(id)
                  await refresh()
                }}
              />
            ) : null}

            <Group justify="flex-end">
              {missing.map((provider) => (
                <IdentityUiLinkButton
                  key={provider}
                  identities={items}
                  refresh={async () => {
                    await query.refetch()
                    await refresh()
                  }}
                  provider={provider}
                  size="sm"
                  w={210}
                />
              ))}
            </Group>
          </UiStack>
        </OnboardingCard>
        <OnboardingCard
          icon={IconCurrencySolana}
          title="Solana wallets"
          description="Link your Solana wallets to your profile"
        >
          <UiStack>
            {solana?.length ? (
              <IdentityUiGrid
                items={solana}
                refresh={async () => {
                  await query.refetch()
                  await refresh()
                }}
                deleteIdentity={async (id) => {
                  await deleteIdentity(id)
                  await refresh()
                }}
              />
            ) : null}

            <Group justify="flex-end">
              <IdentityUiLinkButton
                identities={items}
                refresh={async () => {
                  await query.refetch()
                  await refresh()
                }}
                provider={IdentityProvider.Solana}
                size="sm"
                w={210}
              />
            </Group>
          </UiStack>
        </OnboardingCard>
        <OnboardingCard
          icon={IconUserHeart}
          title="Customize your profile"
          description="Change your username and avatar"
        >
          <UiStack>
            <Stack align="center">
              <OnboardingUiSelectAvatarUrl avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />
              <Select
                miw={400}
                label="Select your username"
                description="Choose wisely, you won't be able to change it later."
                data={usernames}
                placeholder="Select username"
                value={username}
                onChange={(username) => setUsername(username as string)}
                clearable={false}
              />
            </Stack>
            <Group justify="center">
              <Button
                color="green"
                variant="filled"
                size="lg"
                onClick={async () => {
                  await updateProfile()
                  await authRefresh()
                  await query.refetch()
                  await refresh()
                }}
              >
                Update Profile
              </Button>
            </Group>
          </UiStack>
        </OnboardingCard>
        <OnboardingCard icon={IconRocket} title="Create your profile" description="Create your profile on Solana">
          <UiStack>
            <Group justify="center">
              <Button color="green" variant="filled" size="lg" disabled={!requirements} onClick={createProfile}>
                Create Profile
              </Button>
            </Group>
          </UiStack>
        </OnboardingCard>
      </UiStack>
    </UiStack>
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
  icon: ComponentType<{ size: number; stroke: number }>
  children: React.ReactNode
}) {
  return (
    <Paper withBorder p="lg" radius="md" shadow="md">
      <Group justify="space-between" mb="xs">
        <Stack gap="xs">
          <Group gap="xs">
            <Icon size={28} stroke={1.5} />
            <Text fz="xl" fw={500}>
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
