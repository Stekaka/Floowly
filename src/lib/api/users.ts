import { User, Company, CreateUserPayload, UpdateUserPayload, InviteUserPayload, UserRole, UserStatus } from '@/types/user'

// API functions using Prisma
export const userApi = {
  // Get all users
  async getUsers(): Promise<User[]> {
    const response = await fetch('/api/users')
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  },

  // Get user by ID
  async getUser(userId: string): Promise<User | null> {
    const response = await fetch(`/api/users/${userId}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch user')
    }
    return response.json()
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`)
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    const users = await response.json()
    return users[0] || null
  },

  // Create new user
  async createUser(payload: CreateUserPayload): Promise<User> {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create user')
    }
    
    return response.json()
  },

  // Update user
  async updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update user')
    }
    
    return response.json()
  },

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete user')
    }
  },

  // Invite user (creates pending user)
  async inviteUser(payload: InviteUserPayload): Promise<User> {
    const response = await fetch('/api/users/invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to invite user')
    }
    
    return response.json()
  },

  // Activate user (when they accept invitation)
  async activateUser(userId: string): Promise<User> {
    const response = await fetch(`/api/users/${userId}/activate`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to activate user')
    }
    
    return response.json()
  },

  // Get company info
  async getCompany(companyId: string): Promise<Company | null> {
    const response = await fetch(`/api/companies/${companyId}`)
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error('Failed to fetch company')
    }
    return response.json()
  },

  // Check if user has permission
  hasPermission(user: User, resource: string, action: string): boolean {
    const permission = user.permissions?.find(p => p.resource === resource)
    return permission ? permission.actions.includes(action as 'create' | 'read' | 'update' | 'delete') : false
  },

  // Get role display name
  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case 'admin': return 'Administrator'
      case 'manager': return 'Manager'
      case 'employee': return 'Employee'
      case 'viewer': return 'Viewer'
      default: return 'Unknown'
    }
  },

  // Get status display name
  getStatusDisplayName(status: UserStatus): string {
    switch (status) {
      case 'active': return 'Active'
      case 'inactive': return 'Inactive'
      case 'pending': return 'Pending'
      default: return 'Unknown'
    }
  }
}