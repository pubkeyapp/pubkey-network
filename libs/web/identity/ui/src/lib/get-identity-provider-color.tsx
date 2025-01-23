import { IdentityProvider } from '@pubkey-network/sdk'

export function getIdentityProviderColor(provider: IdentityProvider) {
  switch (provider) {
    case IdentityProvider.Discord:
      return '#5865F2'
    case IdentityProvider.Github:
      return '#333333'
    case IdentityProvider.Google:
      return '#DB4437'
    case IdentityProvider.Solana:
      return '#9945FF'
    case IdentityProvider.Telegram:
      return '#0088cc'
    case IdentityProvider.X:
      return '#000000'
    default:
      return '#333333'
  }
}
