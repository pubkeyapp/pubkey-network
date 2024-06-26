import { Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useAuth } from '@pubkey-network/web-auth-data-access'
import { UiHeaderProfile } from '@pubkey-network/web-core-ui'
import { SolanaUiAccountBalanceButton, WalletIcon } from '@pubkey-network/web-solana-ui'
import { UiHeader, UiLayout, UiLoader } from '@pubkey-ui/core'
import { ReactNode, Suspense } from 'react'

export function WebCoreLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth()
  const [opened, { toggle }] = useDisclosure(false)
  return (
    <UiLayout
      header={
        <UiHeader
          opened={opened}
          toggle={toggle}
          links={[
            { link: '/profile', label: 'Profiles' },
            { link: '/directory', label: 'Directory' },
          ]}
          profile={
            <Group gap="xs">
              <SolanaUiAccountBalanceButton />
              <WalletIcon />
              <UiHeaderProfile user={user} logout={logout} />
            </Group>
          }
        />
      }
    >
      <Suspense fallback={<UiLoader mt="xl" size="xl" type="dots" />}>{children}</Suspense>
    </UiLayout>
  )
}
