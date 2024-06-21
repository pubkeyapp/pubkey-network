import { UiContainer, UiTabRoute, UiTabRoutes } from '@pubkey-ui/core'
import { DevIdentityWizard } from './dev-identity-wizard'
import { DevNew } from './dev-new'
import { DevPubkeyLogin } from './dev-pubkey-login'
import { DevUserAutocomplete } from './dev-user-autocomplete'
import { DevWalletComponents } from './dev-wallet-components'

export default function DevAdminRoutes() {
  const tabs: UiTabRoute[] = [
    { path: 'new', label: 'New', element: <DevNew /> },
    { path: 'identity-wizard', label: 'Identity Wizard', element: <DevIdentityWizard /> },
    { path: 'user-autocomplete', label: 'User Autocomplete', element: <DevUserAutocomplete /> },
    { path: 'pubkey-login', label: 'PubKey Login', element: <DevPubkeyLogin /> },
    { path: 'wallet-components', label: 'Wallet Components', element: <DevWalletComponents /> },
  ]
  return (
    <UiContainer>
      <UiTabRoutes tabs={tabs} />
    </UiContainer>
  )
}
