"use client"

import { Bell, Mail, MessageSquare, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { NotificationSettings } from "@/types/profile"

interface NotificationsFormProps {
  settings: NotificationSettings
  onUpdate: (settings: Partial<NotificationSettings>) => Promise<void>
  isLoading: boolean
}

export function NotificationsForm({ settings, onUpdate, isLoading }: NotificationsFormProps) {
  const handleToggle = async (key: keyof NotificationSettings) => {
    const newValue = !settings[key]
    await onUpdate({ [key]: newValue })
  }

  const notificationOptions = [
    {
      key: "email" as const,
      label: "Email Notifications",
      description: "Receive updates via email",
      icon: Mail,
    },
    {
      key: "sms" as const,
      label: "SMS Notifications",
      description: "Receive updates via text message",
      icon: MessageSquare,
    },
    {
      key: "push" as const,
      label: "Push Notifications",
      description: "Receive updates via browser notifications",
      icon: Bell,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
        <CardDescription>
          Choose how you want to be notified about updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {notificationOptions.map((option) => {
            const Icon = option.icon
            const isEnabled = settings[option.key]
            
            return (
              <div key={option.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <Label 
                      htmlFor={`notification-${option.key}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={`notification-${option.key}`}
                  checked={isEnabled}
                  onCheckedChange={() => handleToggle(option.key)}
                  disabled={isLoading}
                  aria-describedby={`${option.key}-description`}
                />
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Notification Types:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• New quotes and job updates</li>
            <li>• Customer inquiries and responses</li>
            <li>• System maintenance and updates</li>
            <li>• Security alerts and account changes</li>
          </ul>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Changes are saved automatically
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
