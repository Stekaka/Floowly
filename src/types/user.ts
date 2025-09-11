export type UserRole = 'admin' | 'manager' | 'employee' | 'viewer'

export type UserStatus = 'active' | 'inactive' | 'pending'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  companyId: string
  companyName: string
  permissions: UserPermission[]
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
  avatar?: string
  phone?: string
  department?: string
}

export interface UserPermission {
  resource: 'customers' | 'quotes' | 'jobs' | 'calendar' | 'reports' | 'settings' | 'users'
  actions: ('create' | 'read' | 'update' | 'delete')[]
}

export interface Company {
  id: string
  name: string
  domain?: string
  plan: 'basic' | 'professional' | 'enterprise'
  maxUsers: number
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  email: string
  name: string
  role: UserRole
  companyId: string
  phone?: string
  department?: string
}

export interface UpdateUserPayload {
  name?: string
  role?: UserRole
  status?: UserStatus
  phone?: string
  department?: string
  permissions?: UserPermission[]
}

export interface InviteUserPayload {
  email: string
  name: string
  role: UserRole
  companyId: string
  phone?: string
  department?: string
}
