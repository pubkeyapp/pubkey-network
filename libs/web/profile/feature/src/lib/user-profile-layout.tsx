import { Button, Group } from '@mantine/core'
import { useCheckUserProfile, useSyncUserProfile } from '@pubkey-network/web-profile-data-access'
import { UiCard, UiGroup, UiPage } from '@pubkey-ui/core'
import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

export function UserProfileLayout({ children }: { children: ReactNode }) {
  const checkUserProfile = useCheckUserProfile()
  const syncUserProfile = useSyncUserProfile()

  return (
    <UiPage
      title={
        <UiGroup>
          <div>PUBKEY PROFILE</div>
        </UiGroup>
      }
      rightAction={
        <Group>
          <Button onClick={() => checkUserProfile.mutateAsync()}>Check</Button>
          <Button onClick={() => syncUserProfile.mutateAsync()}>Sync</Button>
          <Button component={NavLink} to="/profile/">
            Index
          </Button>
          <Button component={NavLink} to="/profile/create">
            Create
          </Button>
        </Group>
      }
    >
      {children}
    </UiPage>
  )
}

export function UserProfileCheckFeature() {
  const checkUserProfile = useCheckUserProfile()

  return <UiCard title={'Check Profile'}>CONTENT</UiCard>
}
