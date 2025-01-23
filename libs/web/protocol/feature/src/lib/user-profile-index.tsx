import { Button } from '@mantine/core'
import { useGetUserProfile } from '@pubkey-network/web-protocol-data-access'
import { PubkeyProfileUiCard } from '@pubkey-network/web-protocol-ui'
import { UiDebug, UiInfo, UiLoader, UiStack } from '@pubkey-ui/core'
import { Navigate, NavLink } from 'react-router-dom'
import { UserProfileLayout } from './user-profile-layout'

export function UserProfileIndex() {
  const query = useGetUserProfile()

  if (query.data?.username) {
    return <Navigate to={`/profile/${query.data.username}`} replace />
  }

  return (
    <UserProfileLayout>
      {query.isLoading ? (
        <UiLoader />
      ) : query.data ? (
        <UiStack>
          <PubkeyProfileUiCard profile={query.data} withLink />
          <UiDebug data={query.data} />
        </UiStack>
      ) : (
        <UiStack>
          <UiDebug data={query.data} />
          <UiInfo message="No profiles found. Click the button below to create one" />
          <Button component={NavLink} to="/profile/create">
            Create
          </Button>
        </UiStack>
      )}
    </UserProfileLayout>
  )
}
