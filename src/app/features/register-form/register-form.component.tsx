'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/pkg/auth'
import { Button } from '@/app/shared/components/button'
import { Input } from '@/app/shared/components/input'
import type { RegisterFormValues } from './register-form.interface'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  async function onSubmit(data: RegisterFormValues) {
    setServerError(null)

    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message ?? 'Registration failed. Please try again.')
      return
    }

    router.push('/items')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Input
        id='name'
        type='text'
        label='Full name'
        placeholder='John Doe'
        error={errors.name?.message}
        {...register('name')}
      />

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
        placeholder='Minimum 8 characters'
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        id='confirmPassword'
        type='password'
        label='Confirm password'
        placeholder='Repeat your password'
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      {serverError && (
        <p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{serverError}</p>
      )}

      <Button type='submit' loading={isSubmitting} className='w-full'>
        Create account
      </Button>
    </form>
  )
}
