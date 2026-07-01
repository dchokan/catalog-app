import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'emailRequired').email('emailInvalid'),
  password: z.string().min(1, 'passwordRequired'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'nameMin'),
    email: z.string().min(1, 'emailRequired').email('emailInvalid'),
    password: z.string().min(8, 'passwordMin').regex(/[A-Z]/, 'passwordUppercase').regex(/[0-9]/, 'passwordNumber'),
    confirmPassword: z.string().min(1, 'confirmRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordsMismatch',
    path: ['confirmPassword'],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
