import { PubkeyProfile as SdkPubKeyProfile } from '@pubkey-network/sdk'
import { PubKeyProfile } from '@pubkey-program-library/anchor'
import { UiAvatar } from '@pubkey-ui/core'

export function PubkeyProfileUiAvatar({
  profile: { avatarUrl, username },
}: {
  profile: PubKeyProfile | SdkPubKeyProfile
}) {
  return <UiAvatar url={avatarUrl ? avatarUrl : null} name={username} radius={100} size="lg" />
}
