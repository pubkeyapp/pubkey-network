import { Button, Divider, Paper, Text } from '@mantine/core'
import { AppIdentity, IdentityProvider, PubkeyProfile as SdkPubKeyProfile, User } from '@pubkey-network/sdk'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiDebugModal, UiGroup, UiStack } from '@pubkey-ui/core'
import { PubkeyProfileUiIdentity } from './pubkey-profile-ui-identity'

export function PubkeyProfileUiCardIdentities({
  profile,
  user,
  identityAdd,
  identityRemove,
}: {
  profile: PubKeyProfile | SdkPubKeyProfile
  user: User | undefined
  identityAdd?: (input: { provider: IdentityProvider; providerId: string }) => Promise<void>
  identityRemove?: (input: { provider: IdentityProvider; providerId: string }) => Promise<void>
}) {
  const profileIdentities: AppIdentity[] = profile.identities ?? []
  const missingIdentities: AppIdentity[] = filterIdentities(user?.identities ?? [], profileIdentities)

  return (
    <Paper withBorder py="sm">
      <UiStack>
        <UiGroup px="xs">
          <Text size="lg" fw={500}>
            Identities on chain
          </Text>
          <UiDebugModal data={profileIdentities} />
        </UiGroup>
        <Divider />

        {profileIdentities.map((item) => (
          <UiGroup px="xs" key={item.providerId}>
            <PubkeyProfileUiIdentity identity={item} key={item.providerId}>
              {identityRemove ? (
                <Button
                  size="xs"
                  variant="light"
                  onClick={() =>
                    identityRemove({ provider: item.provider as IdentityProvider, providerId: item.providerId })
                  }
                >
                  Remove
                </Button>
              ) : null}
            </PubkeyProfileUiIdentity>
          </UiGroup>
        ))}
        {missingIdentities.length ? (
          <UiStack>
            <Divider />
            <UiGroup px="xs">
              <Text size="lg" fw={500}>
                Identities off chain
              </Text>
              <UiDebugModal data={missingIdentities} />
            </UiGroup>
            <Divider />
            {missingIdentities.map((item) => (
              <UiGroup px="xs" key={item.providerId}>
                <PubkeyProfileUiIdentity identity={item} key={item.providerId}>
                  {identityAdd ? (
                    <Button
                      size="xs"
                      variant="light"
                      onClick={() =>
                        identityAdd({ provider: item.provider as IdentityProvider, providerId: item.providerId })
                      }
                    >
                      Add
                    </Button>
                  ) : null}
                </PubkeyProfileUiIdentity>
              </UiGroup>
            ))}
          </UiStack>
        ) : null}
      </UiStack>
    </Paper>
  )
}

function filterIdentities(right: AppIdentity[], left: AppIdentity[]) {
  return right.filter((r) => !left.some((l) => compareIdentities(r, l)))
}

function compareIdentities(right: AppIdentity, left: AppIdentity) {
  return (
    right.providerId === left.providerId &&
    right.provider.toLowerCase().toString() === left.provider.toLowerCase().toString()
  )
}
