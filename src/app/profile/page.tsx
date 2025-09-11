"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { AvatarCard } from "@/components/profile/AvatarCard"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { SecurityForm } from "@/components/profile/SecurityForm"
import { NotificationsForm } from "@/components/profile/NotificationsForm"
import { TeamManagement } from "@/components/profile/TeamManagement"
import { profileApi } from "@/lib/api/profile"
import { UserProfile, NotificationSettings } from "@/types/profile"
import { ProfileFormData, PasswordFormData } from "@/lib/validations/profile"

export default function ProfileSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  // Fetch profile data
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.getProfile,
    enabled: status === "authenticated",
  })

  // Fetch notification settings
  const { data: notificationData, isLoading: notificationLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: profileApi.getNotificationSettings,
    enabled: status === "authenticated",
  })

  // Update profile data when fetched
  useEffect(() => {
    if (profileData) {
      setProfile(profileData)
    }
  }, [profileData])

  // Update notification settings when fetched
  useEffect(() => {
    if (notificationData) {
      setNotificationSettings(notificationData)
    }
  }, [notificationData])

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (updatedProfile) => {
      setProfile(updatedProfile)
      queryClient.setQueryData(["profile"], updatedProfile)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      })
    },
  })

  // Password change mutation
  const passwordMutation = useMutation({
    mutationFn: profileApi.changePassword,
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive",
      })
    },
  })

  // Notification settings mutation
  const notificationMutation = useMutation({
    mutationFn: profileApi.updateNotificationSettings,
    onSuccess: (updatedSettings) => {
      setNotificationSettings(updatedSettings)
      queryClient.setQueryData(["notifications"], updatedSettings)
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been updated.",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update notification settings",
        variant: "destructive",
      })
    },
  })

  // Avatar upload mutation
  const avatarMutation = useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: (avatarUrl) => {
      if (profile) {
        const updatedProfile = { ...profile, avatar: avatarUrl }
        setProfile(updatedProfile)
        queryClient.setQueryData(["profile"], updatedProfile)
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully.",
        })
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload avatar",
        variant: "destructive",
      })
    },
  })

  const handleProfileUpdate = async (data: ProfileFormData) => {
    await profileMutation.mutateAsync(data)
  }

  const handlePasswordChange = async (data: PasswordFormData) => {
    await passwordMutation.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
  }

  const handleNotificationUpdate = async (settings: Partial<NotificationSettings>) => {
    await notificationMutation.mutateAsync(settings)
  }

  const handleAvatarChange = async (file: File) => {
    setIsUploadingAvatar(true)
    try {
      await avatarMutation.mutateAsync(file)
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const handleAvatarRemove = () => {
    if (profile) {
      const updatedProfile = { ...profile, avatar: undefined }
      setProfile(updatedProfile)
      queryClient.setQueryData(["profile"], updatedProfile)
      toast({
        title: "Avatar removed",
        description: "Your profile picture has been removed.",
      })
    }
  }

  if (status === "loading" || profileLoading || notificationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!session || !profile || !notificationSettings) {
    return null
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-slate-300">Manage your account settings and preferences</p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Profile */}
              <div className="space-y-6">
                <AvatarCard
                  avatar={profile.avatar}
                  fullName={profile.fullName}
                  onAvatarChange={handleAvatarChange}
                  onAvatarRemove={handleAvatarRemove}
                  isUploading={isUploadingAvatar}
                />
                
                <ProfileForm
                  profile={profile}
                  onSubmit={handleProfileUpdate}
                  isLoading={profileMutation.isPending}
                />
              </div>

              {/* Right Column - Notifications */}
              <div className="space-y-6">
                <NotificationsForm
                  settings={notificationSettings}
                  onUpdate={handleNotificationUpdate}
                  isLoading={notificationMutation.isPending}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-6">
            <div className="max-w-2xl">
              <SecurityForm
                onSubmit={handlePasswordChange}
                isLoading={passwordMutation.isPending}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-6">
            <TeamManagement />
          </TabsContent>
        </Tabs>
      </div>
      
      <Toaster />
    </div>
  )
}
