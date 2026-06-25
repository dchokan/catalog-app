'use client'

import { useMutation } from '@tanstack/react-query'
import { signIn, signUp } from './auth.api'
import type { LoginFormValues, RegisterFormValues } from '@/app/entities/models'

export function useSignIn() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => signIn(values),
  })
}

export function useSignUp() {
  return useMutation({
    mutationFn: (values: RegisterFormValues) => signUp(values),
  })
}
