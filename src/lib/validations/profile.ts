import { z } from "zod"

export const profileSchema = z.object({
  fullName: z.string().min(2, "Fullständigt namn måste vara minst 2 tecken"),
  email: z.string().email("Ange en giltig e-postadress"),
  phone: z.string().min(10, "Telefonnummer måste vara minst 10 siffror"),
  companyName: z.string().min(2, "Företagsnamn måste vara minst 2 tecken"),
})

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Nuvarande lösenord krävs"),
  newPassword: z
    .string()
    .min(8, "Lösenord måste vara minst 8 tecken")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Lösenord måste innehålla minst en stor bokstav, en liten bokstav, en siffra och ett specialtecken"
    ),
  confirmPassword: z.string().min(1, "Bekräfta ditt lösenord"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Lösenorden matchar inte",
  path: ["confirmPassword"],
})

export const notificationsSchema = z.object({
  email: z.boolean(),
  sms: z.boolean(),
  push: z.boolean(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
export type PasswordFormData = z.infer<typeof passwordSchema>
export type NotificationsFormData = z.infer<typeof notificationsSchema>
