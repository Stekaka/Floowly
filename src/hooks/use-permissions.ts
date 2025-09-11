import { useSession } from 'next-auth/react'
import { userApi } from '@/lib/api/users'
import { useQuery } from '@tanstack/react-query'

export function usePermissions() {
  // const { data: session } = useSession()
  
  // Mock current user (in real app, this would come from session)
  const currentUserId = 'user_1' // This would be from session.user.id
  
  const { data: currentUser } = useQuery({
    queryKey: ['user', currentUserId],
    queryFn: () => userApi.getUser(currentUserId),
    enabled: !!currentUserId,
  })

  const hasPermission = (resource: string, action: string): boolean => {
    if (!currentUser) return false
    return userApi.hasPermission(currentUser, resource, action)
  }

  const canCreate = (resource: string): boolean => {
    return hasPermission(resource, 'create')
  }

  const canRead = (resource: string): boolean => {
    return hasPermission(resource, 'read')
  }

  const canUpdate = (resource: string): boolean => {
    return hasPermission(resource, 'update')
  }

  const canDelete = (resource: string): boolean => {
    return hasPermission(resource, 'delete')
  }

  const isAdmin = (): boolean => {
    return currentUser?.role === 'admin'
  }

  const isManager = (): boolean => {
    return currentUser?.role === 'manager'
  }

  const isEmployee = (): boolean => {
    return currentUser?.role === 'employee'
  }

  const isViewer = (): boolean => {
    return currentUser?.role === 'viewer'
  }

  return {
    currentUser,
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    isAdmin,
    isManager,
    isEmployee,
    isViewer,
  }
}
