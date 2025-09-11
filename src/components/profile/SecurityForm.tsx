"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { passwordSchema, type PasswordFormData } from "@/lib/validations/profile"

interface SecurityFormProps {
  onSubmit: (data: PasswordFormData) => Promise<void>
  isLoading: boolean
}

export function SecurityForm({ onSubmit, isLoading }: SecurityFormProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const handleFormSubmit = async (data: PasswordFormData) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Ändra lösenord
        </CardTitle>
        <CardDescription>
          Uppdatera ditt lösenord för att hålla ditt konto säkert
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Nuvarande lösenord</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                {...register("currentPassword")}
                placeholder="Ange ditt nuvarande lösenord"
                disabled={isLoading}
                aria-invalid={!!errors.currentPassword}
                aria-describedby={errors.currentPassword ? "currentPassword-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("current")}
                disabled={isLoading}
                aria-label={showPasswords.current ? "Dölj lösenord" : "Visa lösenord"}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <p id="currentPassword-error" className="text-sm text-destructive">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nytt lösenord</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Ange ditt nya lösenord"
                disabled={isLoading}
                aria-invalid={!!errors.newPassword}
                aria-describedby={errors.newPassword ? "newPassword-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("new")}
                disabled={isLoading}
                aria-label={showPasswords.new ? "Dölj lösenord" : "Visa lösenord"}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.newPassword && (
              <p id="newPassword-error" className="text-sm text-destructive">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Bekräfta nytt lösenord</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Bekräfta ditt nya lösenord"
                disabled={isLoading}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility("confirm")}
                disabled={isLoading}
                aria-label={showPasswords.confirm ? "Dölj lösenord" : "Visa lösenord"}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Lösenordskrav:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Minst 8 tecken långt</li>
              <li>• Innehåller stora och små bokstäver</li>
              <li>• Innehåller minst en siffra</li>
              <li>• Innehåller minst ett specialtecken</li>
            </ul>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              aria-describedby="password-description"
            >
              {isLoading ? "Uppdaterar..." : "Uppdatera lösenord"}
            </Button>
          </div>
          
          <p id="password-description" className="text-xs text-muted-foreground">
            Ditt lösenord kommer att uppdateras omedelbart efter bekräftelse
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
