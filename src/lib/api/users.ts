import { User, Company, CreateUserPayload, UpdateUserPayload, InviteUserPayload, UserRole, UserStatus } from '@/types/user'

// Mock data for companies
const companies: Company[] = [
  {
    id: 'company_1',
    name: 'Floowly Demo Company',
    domain: 'floowly.com',
    plan: 'professional',
    maxUsers: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

// Mock data for users
const users: User[] = [
  {
    id: 'user_1',
    email: 'admin@floowly.com',
    name: 'Admin User',
    role: 'admin',
    status: 'active',
    companyId: 'company_1',
    companyName: 'Floowly Demo Company',
    permissions: [
      { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'quotes', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'jobs', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'calendar', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    phone: '+46 70 123 4567',
    department: 'Management',
  },
  {
    id: 'user_2',
    email: 'manager@floowly.com',
    name: 'Manager User',
    role: 'manager',
    status: 'active',
    companyId: 'company_1',
    companyName: 'Floowly Demo Company',
    permissions: [
      { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'quotes', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'jobs', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'calendar', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'settings', actions: ['read'] },
      { resource: 'users', actions: ['read'] },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    phone: '+46 70 234 5678',
    department: 'Sales',
  },
  {
    id: 'user_3',
    email: 'employee@floowly.com',
    name: 'Employee User',
    role: 'employee',
    status: 'active',
    companyId: 'company_1',
    companyName: 'Floowly Demo Company',
    permissions: [
      { resource: 'customers', actions: ['create', 'read', 'update'] },
      { resource: 'quotes', actions: ['create', 'read', 'update'] },
      { resource: 'jobs', actions: ['create', 'read', 'update'] },
      { resource: 'calendar', actions: ['create', 'read', 'update'] },
      { resource: 'reports', actions: ['read'] },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    phone: '+46 70 345 6789',
    department: 'Operations',
  }
]

// Helper function to get default permissions for role
const getDefaultPermissions = (role: UserRole): User['permissions'] => {
  switch (role) {
    case 'admin':
      return [
        { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'quotes', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'jobs', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'calendar', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      ]
    case 'manager':
      return [
        { resource: 'customers', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'quotes', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'jobs', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'calendar', actions: ['create', 'read', 'update', 'delete'] },
        { resource: 'reports', actions: ['read'] },
        { resource: 'settings', actions: ['read'] },
        { resource: 'users', actions: ['read'] },
      ]
    case 'employee':
      return [
        { resource: 'customers', actions: ['create', 'read', 'update'] },
        { resource: 'quotes', actions: ['create', 'read', 'update'] },
        { resource: 'jobs', actions: ['create', 'read', 'update'] },
        { resource: 'calendar', actions: ['create', 'read', 'update'] },
        { resource: 'reports', actions: ['read'] },
      ]
    case 'viewer':
      return [
        { resource: 'customers', actions: ['read'] },
        { resource: 'quotes', actions: ['read'] },
        { resource: 'jobs', actions: ['read'] },
        { resource: 'calendar', actions: ['read'] },
        { resource: 'reports', actions: ['read'] },
      ]
    default:
      return []
  }
}

// API functions
export const userApi = {
  // Get all users for a company
  async getUsers(companyId: string): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 300)) // Simulate API delay
    return users.filter(user => user.companyId === companyId)
  },

  // Get user by ID
  async getUser(userId: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return users.find(user => user.id === userId) || null
  },

  // Get user by email
  async getUserByEmail(email: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return users.find(user => user.email === email) || null
  },

  // Create new user
  async createUser(payload: CreateUserPayload): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const company = companies.find(c => c.id === payload.companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === payload.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Check company user limit
    const companyUsers = users.filter(u => u.companyId === payload.companyId)
    if (companyUsers.length >= company.maxUsers) {
      throw new Error('Company user limit reached')
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      status: 'pending',
      companyId: payload.companyId,
      companyName: company.name,
      permissions: getDefaultPermissions(payload.role),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phone: payload.phone,
      department: payload.department,
    }

    users.push(newUser)
    return newUser
  },

  // Update user
  async updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const updatedUser = {
      ...users[userIndex],
      ...payload,
      updatedAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser
    return updatedUser
  },

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    users.splice(userIndex, 1)
  },

  // Invite user (creates pending user)
  async inviteUser(payload: InviteUserPayload): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const company = companies.find(c => c.id === payload.companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === payload.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Check company user limit
    const companyUsers = users.filter(u => u.companyId === payload.companyId)
    if (companyUsers.length >= company.maxUsers) {
      throw new Error('Company user limit reached')
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      status: 'pending',
      companyId: payload.companyId,
      companyName: company.name,
      permissions: getDefaultPermissions(payload.role),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phone: payload.phone,
      department: payload.department,
    }

    users.push(newUser)
    return newUser
  },

  // Activate user (when they accept invitation)
  async activateUser(userId: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const updatedUser = {
      ...users[userIndex],
      status: 'active' as UserStatus,
      updatedAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    }

    users[userIndex] = updatedUser
    return updatedUser
  },

  // Get company info
  async getCompany(companyId: string): Promise<Company | null> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return companies.find(c => c.id === companyId) || null
  },

  // Check if user has permission
  hasPermission(user: User, resource: string, action: string): boolean {
    const permission = user.permissions.find(p => p.resource === resource)
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
