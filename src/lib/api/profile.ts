import { UserProfile, ProfileUpdateRequest, PasswordChangeRequest, NotificationSettings, NotificationUpdateRequest } from "@/types/profile"

// Mock API functions - replace with actual API calls
export const profileApi = {
  async getProfile(): Promise<UserProfile> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      id: "1",
      fullName: "Admin User",
      email: "admin@floowly.com",
      phone: "+46 70 123 4567",
      companyName: "Floowly",
      avatar: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  async updateProfile(data: ProfileUpdateRequest): Promise<UserProfile> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate API error for testing
    if (data.email === "error@test.com") {
      throw new Error("Email already exists")
    }
    
    return {
      id: "1",
      fullName: data.fullName || "Admin User",
      email: data.email || "admin@carwrap.com",
      phone: data.phone || "+46 70 123 4567",
      companyName: data.companyName || "CarWrap Pro",
      avatar: data.avatar,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  },

  async changePassword(data: PasswordChangeRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate API error for testing
    if (data.currentPassword === "wrong") {
      throw new Error("Current password is incorrect")
    }
  },

  async getNotificationSettings(): Promise<NotificationSettings> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      email: true,
      sms: false,
      push: true,
    }
  },

  async updateNotificationSettings(data: NotificationUpdateRequest): Promise<NotificationSettings> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      email: data.email ?? true,
      sms: data.sms ?? false,
      push: data.push ?? true,
    }
  },

  async uploadAvatar(file: File): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate file validation
    if (file.size > 5 * 1024 * 1024) { // 5MB
      throw new Error("File size must be less than 5MB")
    }
    
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image")
    }
    
    // Return mock URL
    return URL.createObjectURL(file)
  },
}
