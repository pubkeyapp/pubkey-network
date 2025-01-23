import { AuthUiUserOnboardedGuard } from '@pubkey-network/web-auth-ui'
import { UiDashboard } from '@pubkey-network/web-core-ui'
import { UserDirectoryRoutes, UserProfileRoutes } from '@pubkey-network/web-protocol-feature'
import { SettingsFeature } from '@pubkey-network/web-settings-feature'
import { SolanaFeature } from '@pubkey-network/web-solana-feature'
import { UserFeature } from '@pubkey-network/web-user-feature'
import { UiDashboardItem, UiNotFound } from '@pubkey-ui/core'
import { IconCurrencySolana, IconSettings, IconStar, IconUser, IconUsers } from '@tabler/icons-react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

const links: UiDashboardItem[] = [
  // User Dashboard Links are added by the web-crud generator
  { label: 'Profile', icon: IconUser, to: '/profile' },
  { label: 'Settings', icon: IconSettings, to: '/settings' },
  { label: 'Solana', icon: IconCurrencySolana, to: '/solana' },
  { label: 'Users', icon: IconUsers, to: '/u' },
  { label: 'Onboarding', icon: IconStar, to: '/onboarding' },
]

const routes: RouteObject[] = [
  // User Dashboard Routes are added by the web-crud generator
  { path: '/profile/*', element: <UserProfileRoutes /> },
  { path: '/directory/*', element: <UserDirectoryRoutes /> },
  { path: '/settings/*', element: <SettingsFeature /> },
  { path: '/solana/*', element: <SolanaFeature /> },
  { path: '/u/*', element: <UserFeature /> },
]

export default function WebCoreRoutesUser() {
  return useRoutes([
    {
      // This guard makes sure that the user is onboarded
      element: <AuthUiUserOnboardedGuard />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: '/dashboard', element: <UiDashboard links={links} /> },
        ...routes,
      ],
    },
    { path: '*', element: <UiNotFound to="/dashboard" /> },
  ])
}
