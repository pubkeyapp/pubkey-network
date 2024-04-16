import { User } from '@pubkey-network/sdk'
import { UiAvatar, UiAvatarProps } from '@pubkey-ui/core'

export type UserUiAvatarProps = UiAvatarProps & {
  user?: User
}

export function UserUiAvatar({ user, ...props }: UserUiAvatarProps) {
  return <UiAvatar url={user?.avatarUrl} name={user?.username} {...props} />
}
