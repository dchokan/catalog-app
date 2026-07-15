'use client'

import { useTranslations } from 'next-intl'
import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useSignInMutation } from '@/app/entities/api/auth'
import { type LoginFormValues, loginSchema } from '@/app/entities/models'
import { useRouter } from '@/pkg/locale'
import { Button } from '@/pkg/theme/ui/button'
import { Input } from '@/pkg/theme/ui/input'
import { Spinner } from '@/pkg/theme/ui/spinner'

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
          <Input
            id='email'
            type='email'
            label={t('fields.email')}
            placeholder={t('fields.emailPlaceholder')}
            invalid={!!errors.email}
            message={errors.email?.message && tv(errors.email.message as Parameters<typeof tv>[0])}
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
            label={t('fields.password')}
            placeholder={t('fields.passwordPlaceholder')}
            invalid={!!errors.password}
            message={errors.password?.message && tv(errors.password.message as Parameters<typeof tv>[0])}
            {...field}
          />
        )}
      />

      {signIn.error && (
        <p className='border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm'>
          {signIn.error.message}
        </p>
      )}

      <Button type='submit' disabled={signIn.isPending} className='w-full'>
        {signIn.isPending && <Spinner />}
        {t('login.submit')}
      </Button>
    </form>
  )
}

export default LoginFormComponent
