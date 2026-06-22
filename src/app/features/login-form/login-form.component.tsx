'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/pkg/auth'
import { Button } from '@/app/shared/components/button'
import { Input } from '@/app/shared/components/input'
import type { LoginFormValues } from './login-form.interface'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormValues) {
    setServerError(null)

    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message ?? 'Sign in failed. Please try again.')
      return
    }

    router.push('/items')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Input
        id='email'
        type='email'
        label='Email address'
        placeholder='you@example.com'
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id='password'
        type='password'
        label='Password'
        placeholder='Your password'
        error={errors.password?.message}
        {...register('password')}
      />

      {serverError && (
        <p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{serverError}</p>
      )}

      <Button type='submit' loading={isSubmitting} className='w-full'>
        Sign in
      </Button>
    </form>
  )
}
