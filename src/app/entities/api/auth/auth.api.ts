import { authClient } from '@/pkg/auth'
import type { LoginFormValues, RegisterFormValues } from '@/app/shared/validation'

export async function signIn(values: LoginFormValues): Promise<void> {
  const { error } = await authClient.signIn.email({
    email: values.email,
    password: values.password,
  })

  if (error) {
    throw new Error(error.message ?? 'Sign in failed. Please try again.')
  }
}

export async function signUp(values: RegisterFormValues): Promise<void> {
  const { error } = await authClient.signUp.email({
    name: values.name,
    email: values.email,
    password: values.password,
  })

  if (error) {
    throw new Error(error.message ?? 'Registration failed. Please try again.')
  }
}
