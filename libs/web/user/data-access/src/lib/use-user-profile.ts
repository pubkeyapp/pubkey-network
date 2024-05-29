import { UserUserUpdateInput } from '@pubkey-network/sdk'
import { useAuth, useMe } from '@pubkey-network/web-auth-data-access'
import { useSdk } from '@pubkey-network/web-core-data-access'
import { toastError, toastSuccess } from '@pubkey-ui/core'
import { useUserFindOneUser } from './use-user-find-one-user'

export function useUserProfile() {
  const sdk = useSdk()
  const me = useMe(sdk)
  const { user } = useAuth()
  const { query } = useUserFindOneUser({ username: user?.username as string })

  return {
    user: query.data?.item,
    query,
    updateUser: async (input: UserUserUpdateInput) => {
      return sdk
        .userUpdateUser({
          input,
        })
        .then(async (res) => {
          await Promise.all([query.refetch(), me.refetch()])
          toastSuccess('Profile updated')
          return !!res.data
        })
        .catch((err) => {
          toastError(err.message)
          return false
        })
    },
  }
}
