import { AppIdentityProvider } from '@pubkey-network/sdk'
import {
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
  IconBrandTwitterFilled,
  IconCurrencySolana,
  IconQuestionMark,
} from '@tabler/icons-react'

export function PubkeyProfileUiProvider({ provider, size = 24 }: { provider: AppIdentityProvider; size?: number }) {
  switch (provider.toString().toLowerCase()) {
    case 'discord':
      return <IconBrandDiscordFilled size={size} />
    case 'github':
      return <IconBrandGithubFilled size={size} />
    case 'google':
      return <IconBrandGoogleFilled size={size} />
    case 'solana':
      return <IconCurrencySolana size={size} />
    case 'twitter':
      return <IconBrandTwitterFilled size={size} />
    default:
      return <IconQuestionMark size={size} />
  }
}
