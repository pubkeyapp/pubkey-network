import { lazy } from 'react'

export const UserProfileRoutes = lazy(() => import('./lib/user-profile.routes'))
export const UserDirectoryRoutes = lazy(() => import('./lib/user-directory.routes'))
