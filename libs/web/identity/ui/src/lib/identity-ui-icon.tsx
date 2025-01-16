import { IdentityProvider } from '@pubkey-network/sdk'
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandTelegram,
  IconBrandX,
  IconCurrencySolana,
  IconQuestionMark,
} from '@tabler/icons-react'

export function IdentityUiIcon({ provider, size }: { provider: IdentityProvider; size?: number }) {
  switch (provider) {
    case IdentityProvider.Discord:
      return <IconBrandDiscord size={size} />
    case IdentityProvider.Github:
      return <IconBrandGithub size={size} />
    case IdentityProvider.Google:
      return <IconBrandGoogle size={size} />
    case IdentityProvider.Solana:
      return <IconCurrencySolana size={size} />
    case IdentityProvider.Telegram:
      return <IconBrandTelegram size={size} />
    case IdentityProvider.X:
      return <IconBrandX size={size} />
    default:
      return <IconQuestionMark size={size} />
  }
}
