import { useRoutes } from 'react-router-dom'
import { UserProfileDirectory } from './user-profile-directory'

export default function UserDirectoryRoutes() {
  return useRoutes([
    //
    { index: true, element: <UserProfileDirectory /> },
  ])
}
