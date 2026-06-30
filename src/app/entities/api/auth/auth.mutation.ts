'use client'

import { useMutation } from '@tanstack/react-query'
import { signIn, signUp } from './auth.api'
import type { LoginFormValues, RegisterFormValues } from '@/app/shared/validation'

export function useSignInMutation() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => signIn(values),
  })
}

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => signUp(values),
  })
}
