import { Button, type ButtonProps } from '@mantine/core'
import { modals } from '@mantine/modals'
import { Identity, IdentityProvider } from '@pubkey-network/sdk'
import { TLoginButton, TLoginButtonSize } from 'react-telegram-auth'
import { IdentityUiProviderButton } from './identity-ui-provider-button'
import { IdentityUiSolanaLinkButton } from './identity-ui-solana-link-button'

export function IdentityUiLinkButton({
  identities,
  provider,
  refresh,
  ...props
}: ButtonProps & {
  identities: Identity[]
  provider: IdentityProvider
  refresh?: () => void
}) {
  switch (provider) {
    case IdentityProvider.Discord:
    case IdentityProvider.GitHub:
    case IdentityProvider.Google:
    case IdentityProvider.Twitter:
      return <IdentityUiProviderButton action="link" provider={provider} {...props} />
    case IdentityProvider.Telegram:
      return (
        <Button
          onClick={() => {
            modals.open({
              title: 'Link Telegram',
              children: (
                <div>
                  <TLoginButton
                    botName="PubKeyDevBot"
                    buttonSize={TLoginButtonSize.Large}
                    lang="en"
                    usePic={false}
                    cornerRadius={20}
                    redirectUrl="/api/auth/telegram/callback"
                    additionalClassNames={'css-class-for-wrapper'}
                  />
                </div>
              ),
            })
          }}
        >
          Link Telegram
        </Button>
      )
    case IdentityProvider.Solana:
      return refresh ? <IdentityUiSolanaLinkButton identities={identities} refresh={refresh} {...props} /> : null
    default:
      return null
  }
}
