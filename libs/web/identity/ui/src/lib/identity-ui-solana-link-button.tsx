import { Button, ButtonProps } from '@mantine/core'
import { modals } from '@mantine/modals'
import { Identity, IdentityProvider, solanaGradient } from '@pubkey-network/sdk'
import { SdkProvider } from '@pubkey-network/web-core-data-access'
import { IdentityProviderSolanaLink } from '@pubkey-network/web-identity-data-access'
import { SolanaClusterProvider } from '@pubkey-network/web-solana-data-access'
import { IdentityUiIcon } from './identity-ui-icon'
import { IdentityUiSolanaLinkWizard } from './identity-ui-solana-link-wizard'

export function IdentityUiSolanaLinkButton({
  identities = [],
  label,
  refresh,
  ...props
}: ButtonProps & {
  identities?: Identity[]
  refresh: () => void
  label?: string
}) {
  return (
    <Button
      size="xl"
      variant="gradient"
      gradient={solanaGradient}
      leftSection={<IdentityUiIcon provider={IdentityProvider.Solana} />}
      {...props}
      onClick={() => {
        modals.open({
          size: 'xl',
          title: 'Link Solana Wallet',
          zIndex: 1,
          children: (
            <SdkProvider>
              <SolanaClusterProvider autoConnect={true}>
                <IdentityProviderSolanaLink refresh={refresh}>
                  <IdentityUiSolanaLinkWizard
                    identities={identities ?? []}
                    refresh={() => {
                      refresh()
                      modals.closeAll()
                    }}
                  />
                </IdentityProviderSolanaLink>
              </SolanaClusterProvider>
            </SdkProvider>
          ),
        })
      }}
    >
      {label ?? 'Link Solana Wallet'}
    </Button>
  )
}
