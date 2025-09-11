export interface UserProfile {
  id: string
  fullName: string
  email: string
  phone: string
  companyName: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
}

export interface ProfileUpdateRequest {
  fullName?: string
  email?: string
  phone?: string
  companyName?: string
  avatar?: string
}

export interface PasswordChangeRequest {
  currentPassword: string
  newPassword: string
}

export interface NotificationUpdateRequest {
  email?: boolean
  sms?: boolean
  push?: boolean
}
