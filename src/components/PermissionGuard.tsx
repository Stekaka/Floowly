"use client"

import { usePermissions } from '@/hooks/use-permissions'
import { ReactNode } from 'react'

interface PermissionGuardProps {
  resource: string
  action: string
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGuard({ 
  resource, 
  action, 
  fallback = null, 
  children 
}: PermissionGuardProps) {
  const { hasPermission } = usePermissions()

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface RoleGuardProps {
  roles: string[]
  fallback?: ReactNode
  children: ReactNode
}

export function RoleGuard({ 
  roles, 
  fallback = null, 
  children 
}: RoleGuardProps) {
  const { currentUser } = usePermissions()

  if (!currentUser || !roles.includes(currentUser.role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
