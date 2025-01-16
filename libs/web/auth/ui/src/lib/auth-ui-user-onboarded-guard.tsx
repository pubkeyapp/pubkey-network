import { useAuth } from '@pubkey-network/web-auth-data-access'
import { Navigate, Outlet } from 'react-router-dom'

export function AuthUiUserOnboardedGuard() {
  const { user } = useAuth()

  return user?.onboarded ? <Outlet /> : <Navigate to="/onboarding" replace />
}
