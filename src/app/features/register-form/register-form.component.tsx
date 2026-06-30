'use client'

import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useSignUpMutation } from '@/app/entities/api/auth'
import { ButtonComponent } from '@/app/shared/components/button'
import { InputComponent } from '@/app/shared/components/input'
import { type RegisterFormValues, registerSchema } from '@/app/shared/validation'
import { useRouter } from '@/pkg/locale'

const RegisterFormComponent: FC = () => {
  const router = useRouter()
  const signUp = useSignUpMutation()

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
          <InputComponent
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
          <InputComponent
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
          <InputComponent
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
          <InputComponent
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

      <ButtonComponent type='submit' loading={signUp.isPending} className='w-full'>
        Create account
      </ButtonComponent>
    </form>
  )
}

export default RegisterFormComponent
