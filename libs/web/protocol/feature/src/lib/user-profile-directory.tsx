import { useGetUserProfiles } from '@pubkey-network/web-protocol-data-access'
import {
  PubkeyProfileUiList,
  PubkeyProfileUiSearchProviderForm,
  PubkeyProfileUiSearchUsernameForm,
} from '@pubkey-network/web-protocol-ui'
import { IdentityProvider } from '@pubkey-protocol/sdk'
import { UiCard, UiDebug, UiPage, UiStack } from '@pubkey-ui/core'
import { useState } from 'react'

export function UserProfileDirectory() {
  const query = useGetUserProfiles()
  const [username, setUsername] = useState<string>('')
  const [provider, setProvider] = useState<IdentityProvider>(IdentityProvider.Solana)
  const [providerId, setProviderId] = useState<string>('')
  return (
    <UiPage title="Profile Directory">
      <UiStack>
        <UiCard>
          <PubkeyProfileUiSearchUsernameForm
            username={username}
            loading={false}
            submit={async (res) => {
              setProviderId('')
              setProvider(IdentityProvider.Solana)
              setUsername(res.username ?? '')
            }}
          />
          <PubkeyProfileUiSearchProviderForm
            provider={provider}
            providerId={providerId}
            loading={false}
            submit={async (res) => {
              setUsername('')
              setProvider(res.provider)
              setProviderId(res.providerId ?? '')
            }}
          />
          <UiDebug data={{ username, provider, providerId }} />
        </UiCard>
        <PubkeyProfileUiList profiles={query.data} />
      </UiStack>
    </UiPage>
  )
}
