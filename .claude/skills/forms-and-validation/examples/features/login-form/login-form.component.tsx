'use client'

import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useSignInMutation } from '@/app/entities/api/auth'
import { ButtonComponent } from '@/app/shared/components/button'
import { InputComponent } from '@/app/shared/components/input'
import { type LoginFormValues, loginSchema } from '@/app/shared/validation'
import { useRouter } from '@/pkg/locale'

const LoginFormComponent: FC = () => {
  const router = useRouter()
  const signIn = useSignInMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }, // controlled inputs
  })

  function onSubmit(data: LoginFormValues) {
    signIn.mutate(data, {
      onSuccess: () => {
        router.push('/items')
        router.refresh() // re-sync server components (header session)
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* one Controller per field, wrapping the shared Input; error from RHF/Zod */}
      <Controller
        name='email'
        control={control}
        render={({ field }) => <InputComponent id='email' type='email' label='Email address' error={errors.email?.message} {...field} />}
      />
      <Controller
        name='password'
        control={control}
        render={({ field }) => <InputComponent id='password' type='password' label='Password' error={errors.password?.message} {...field} />}
      />

      {/* SERVER error from the mutation (not validation) */}
      {signIn.error && <p>{signIn.error.message}</p>}

      <ButtonComponent type='submit' loading={signIn.isPending}>
        Sign in
      </ButtonComponent>
    </form>
  )
}

export default LoginFormComponent
