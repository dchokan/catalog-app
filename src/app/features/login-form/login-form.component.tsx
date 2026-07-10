'use client'

import { useTranslations } from 'next-intl'
import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useSignInMutation } from '@/app/entities/api/auth'
import { ButtonComponent } from '@/app/shared/components/button'
import { InputComponent } from '@/app/shared/components/input'
import { type LoginFormValues, loginSchema } from '@/app/shared/validation'
import { useRouter } from '@/pkg/locale'

const LoginFormComponent: FC = () => {
  const t = useTranslations('auth')
  const tv = useTranslations('validation')
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
            label={t('fields.email')}
            placeholder={t('fields.emailPlaceholder')}
            error={errors.email?.message && tv(errors.email.message)}
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
            label={t('fields.password')}
            placeholder={t('fields.passwordPlaceholder')}
            error={errors.password?.message && tv(errors.password.message)}
            {...field}
          />
        )}
      />

      {signIn.error && (
        <p className='border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm'>
          {signIn.error.message}
        </p>
      )}

      <ButtonComponent type='submit' loading={signIn.isPending} className='w-full'>
        {t('login.submit')}
      </ButtonComponent>
    </form>
  )
}

export default LoginFormComponent
