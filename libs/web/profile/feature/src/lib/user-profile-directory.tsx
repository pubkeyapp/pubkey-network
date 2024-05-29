import { useGetUserProfiles } from '@pubkey-network/web-profile-data-access'
import {
  PubkeyProfileUiList,
  PubkeyProfileUiSearchProviderForm,
  PubkeyProfileUiSearchUsernameForm,
} from '@pubkey-network/web-profile-ui'
import { PubKeyIdentityProvider } from '@pubkey-program-library/anchor'
import { UiCard, UiDebug, UiPage, UiStack } from '@pubkey-ui/core'
import { useState } from 'react'

export function UserProfileDirectory() {
  const query = useGetUserProfiles()
  const [username, setUsername] = useState<string>('')
  const [provider, setProvider] = useState<PubKeyIdentityProvider>(PubKeyIdentityProvider.Solana)
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
              setProvider(PubKeyIdentityProvider.Solana)
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
