'use client'

import { useMutation } from '@tanstack/react-query'

import type { LoginFormValues, RegisterFormValues } from '@/app/entities/models'

import { signIn, signUp } from './auth.api'

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
