import { describe, it, expect } from 'vitest'
import { profileSchema, passwordSchema, notificationsSchema } from '../profile'

describe('Profile Validation Schemas', () => {
  describe('profileSchema', () => {
    it('should validate correct profile data', () => {
      const validData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        companyName: 'Acme Corp',
      }

      const result = profileSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const invalidData = {
        fullName: 'John Doe',
        email: 'invalid-email',
        phone: '1234567890',
        companyName: 'Acme Corp',
      }

      const result = profileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('valid email')
      }
    })

    it('should reject short full name', () => {
      const invalidData = {
        fullName: 'J',
        email: 'john@example.com',
        phone: '1234567890',
        companyName: 'Acme Corp',
      }

      const result = profileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 2 characters')
      }
    })

    it('should reject short phone number', () => {
      const invalidData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123',
        companyName: 'Acme Corp',
      }

      const result = profileSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 10 digits')
      }
    })
  })

  describe('passwordSchema', () => {
    it('should validate correct password data', () => {
      const validData = {
        currentPassword: 'oldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'NewPassword123!',
      }

      const result = passwordSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        currentPassword: 'oldPassword123!',
        newPassword: 'NewPassword123!',
        confirmPassword: 'DifferentPassword123!',
      }

      const result = passwordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("don't match")
      }
    })

    it('should reject weak password', () => {
      const invalidData = {
        currentPassword: 'oldPassword123!',
        newPassword: 'weak',
        confirmPassword: 'weak',
      }

      const result = passwordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least 8 characters')
      }
    })

    it('should reject password without special characters', () => {
      const invalidData = {
        currentPassword: 'oldPassword123!',
        newPassword: 'NewPassword123',
        confirmPassword: 'NewPassword123',
      }

      const result = passwordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('special character')
      }
    })

    it('should reject password without uppercase letters', () => {
      const invalidData = {
        currentPassword: 'oldPassword123!',
        newPassword: 'newpassword123!',
        confirmPassword: 'newpassword123!',
      }

      const result = passwordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('uppercase letter')
      }
    })

    it('should reject password without numbers', () => {
      const invalidData = {
        currentPassword: 'oldPassword123!',
        newPassword: 'NewPassword!',
        confirmPassword: 'NewPassword!',
      }

      const result = passwordSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('number')
      }
    })
  })

  describe('notificationsSchema', () => {
    it('should validate correct notification settings', () => {
      const validData = {
        email: true,
        sms: false,
        push: true,
      }

      const result = notificationsSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should accept all boolean combinations', () => {
      const combinations = [
        { email: true, sms: true, push: true },
        { email: false, sms: false, push: false },
        { email: true, sms: false, push: true },
        { email: false, sms: true, push: false },
      ]

      combinations.forEach(data => {
        const result = notificationsSchema.safeParse(data)
        expect(result.success).toBe(true)
      })
    })

    it('should reject non-boolean values', () => {
      const invalidData = {
        email: 'true',
        sms: 1,
        push: null,
      }

      const result = notificationsSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })
})
