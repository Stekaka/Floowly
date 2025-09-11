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
      label: "E-postnotifieringar",
      description: "Få uppdateringar via e-post",
      icon: Mail,
    },
    {
      key: "sms" as const,
      label: "SMS-notifieringar",
      description: "Få uppdateringar via textmeddelande",
      icon: MessageSquare,
    },
    {
      key: "push" as const,
      label: "Push-notifieringar",
      description: "Få uppdateringar via webbläsarnotifieringar",
      icon: Bell,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Notifieringsinställningar
        </CardTitle>
        <CardDescription>
          Välj hur du vill bli notifierad om uppdateringar
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
          <h4 className="text-sm font-medium mb-2">Notifieringstyper:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Nya offerter och jobbuppdateringar</li>
            <li>• Kundförfrågningar och svar</li>
            <li>• Systemunderhåll och uppdateringar</li>
            <li>• Säkerhetsvarningar och kontoförändringar</li>
          </ul>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground">
            Ändringar sparas automatiskt
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
