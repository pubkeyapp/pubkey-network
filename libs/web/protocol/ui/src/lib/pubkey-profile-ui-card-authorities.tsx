import { Divider, Paper, Text } from '@mantine/core'
import { ellipsify, PubkeyProfile as SdkPubKeyProfile } from '@pubkey-network/sdk'
import { PubKeyProfile } from '@pubkey-protocol/sdk'
import { UiGroup, UiStack } from '@pubkey-ui/core'

export function PubkeyProfileUiCardAuthorities({ profile }: { profile: PubKeyProfile | SdkPubKeyProfile }) {
  return (
    <Paper withBorder py="sm">
      <UiStack>
        <UiGroup px="xs">
          <Text size="lg" fw={500}>
            Authorities
          </Text>
        </UiGroup>
        <Divider />

        {profile.authorities.map((item) => (
          <UiGroup px="xs" key={item.toString()}>
            <Text>{ellipsify(item.toString())}</Text>
          </UiGroup>
        ))}
      </UiStack>
    </Paper>
  )
}
