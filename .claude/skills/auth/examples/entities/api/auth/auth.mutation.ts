'use client'

import { useMutation } from '@tanstack/react-query'

import type { LoginFormValues, RegisterFormValues } from '@/app/shared/validation'

import { signIn, signUp } from './auth.api'

// mutation-only slice — no query/model; the session comes from useSession()
export function useSignInMutation() {
  return useMutation({ mutationFn: (values: LoginFormValues) => signIn(values) })
}

export function useSignUpMutation() {
  return useMutation({ mutationFn: (values: RegisterFormValues) => signUp(values) })
}
