'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { ButtonComponent } from '@/app/shared/components/button'
import { InputComponent } from '@/app/shared/components/input'
import { loginSchema, type LoginFormValues } from '@/app/shared/validation'
import { useSignInMutation } from '@/app/entities/api/auth'

const LoginFormComponent: FC = () => {
  const router = useRouter()
  const signIn = useSignInMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: LoginFormValues) {
    signIn.mutate(data, {
      onSuccess: () => {
        router.push('/items')
        router.refresh()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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
            placeholder='Your password'
            error={errors.password?.message}
            {...field}
          />
        )}
      />

      {signIn.error && (
        <p className='rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>
          {signIn.error.message}
        </p>
      )}

      <ButtonComponent type='submit' loading={signIn.isPending} className='w-full'>
        Sign in
      </ButtonComponent>
    </form>
  )
}

export default LoginFormComponent
