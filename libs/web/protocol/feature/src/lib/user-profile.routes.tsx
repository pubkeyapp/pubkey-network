import { useRoutes } from 'react-router-dom'
import { UserProfileCreate } from './user-profile-create'
import { UserProfileDetail } from './user-profile-detail'
import { UserProfileDirectory } from './user-profile-directory'
import { UserProfileIndex } from './user-profile-index'

export default function UserProfileRoutes() {
  return useRoutes([
    //
    { index: true, element: <UserProfileIndex /> },
    { path: 'search', element: <UserProfileDirectory /> },
    { path: 'create', element: <UserProfileCreate /> },
    { path: ':username', element: <UserProfileDetail /> },
  ])
}
