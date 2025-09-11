"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { profileSchema, type ProfileFormData } from "@/lib/validations/profile"
import { UserProfile } from "@/types/profile"

interface ProfileFormProps {
  profile: UserProfile
  onSubmit: (data: ProfileFormData) => Promise<void>
  isLoading: boolean
}

export function ProfileForm({ profile, onSubmit, isLoading }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      companyName: profile.companyName,
    },
  })

  const handleFormSubmit = async (data: ProfileFormData) => {
    try {
      await onSubmit(data)
      reset(data) // Reset form with new values to clear dirty state
    } catch (error) {
      // Error handling is done in parent component
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profilinformation</CardTitle>
        <CardDescription>
          Uppdatera din personliga information och kontaktuppgifter
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Fullständigt namn</Label>
              <Input
                id="fullName"
                {...register("fullName")}
                placeholder="Ange ditt fullständiga namn"
                disabled={isLoading}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-post</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="Ange din e-post"
                disabled={isLoading}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input
                id="phone"
                type="tel"
                {...register("phone")}
                placeholder="Ange ditt telefonnummer"
                disabled={isLoading}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
              {errors.phone && (
                <p id="phone-error" className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Företagsnamn</Label>
              <Input
                id="companyName"
                {...register("companyName")}
                placeholder="Ange ditt företagsnamn"
                disabled={isLoading}
                aria-invalid={!!errors.companyName}
                aria-describedby={errors.companyName ? "companyName-error" : undefined}
              />
              {errors.companyName && (
                <p id="companyName-error" className="text-sm text-destructive">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={!isDirty || isLoading}
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || isLoading}
              aria-describedby="save-description"
            >
              {isLoading ? "Sparar..." : "Spara ändringar"}
            </Button>
          </div>
          
          <p id="save-description" className="text-xs text-muted-foreground">
            {isDirty ? "You have unsaved changes" : "All changes saved"}
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
