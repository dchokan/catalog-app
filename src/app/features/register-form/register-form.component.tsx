'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/shared/components/button'
import { Input } from '@/app/shared/components/input'
import { registerSchema, type RegisterFormValues } from '@/app/entities/models'
import { useSignUp } from '@/app/entities/api/auth'

export function RegisterForm() {
  const router = useRouter()
  const signUp = useSignUp()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(data: RegisterFormValues) {
    signUp.mutate(data, {
      onSuccess: () => {
        router.push('/items')
        router.refresh()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Controller
        name='name'
        control={control}
        render={({ field }) => (
          <Input
            id='name'
            type='text'
            label='Full name'
            placeholder='John Doe'
            error={errors.name?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='email'
        control={control}
        render={({ field }) => (
          <Input
            id='email'
            type='email'
            label='Email address'
            placeholder='you@example.com'
            error={errors.email?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='password'
        control={control}
        render={({ field }) => (
          <Input
            id='password'
            type='password'
            label='Password'
            placeholder='Minimum 8 characters'
            error={errors.password?.message}
            {...field}
          />
        )}
      />

      <Controller
        name='confirmPassword'
        control={control}
        render={({ field }) => (
          <Input
            id='confirmPassword'
            type='password'
            label='Confirm password'
            placeholder='Repeat your password'
            error={errors.confirmPassword?.message}
            {...field}
          />
        )}
      />

      {signUp.error && (
        <p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
          {signUp.error.message}
        </p>
      )}

      <Button type='submit' loading={signUp.isPending} className='w-full'>
        Create account
      </Button>
    </form>
  )
}
