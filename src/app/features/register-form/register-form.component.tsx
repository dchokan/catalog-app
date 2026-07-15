'use client'

import { useTranslations } from 'next-intl'
import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useSignUpMutation } from '@/app/entities/api/auth'
import { type RegisterFormValues, registerSchema } from '@/app/entities/models'
import { useRouter } from '@/pkg/locale'
import { Button } from '@/pkg/theme/ui/button'
import { Input } from '@/pkg/theme/ui/input'
import { Spinner } from '@/pkg/theme/ui/spinner'

const RegisterFormComponent: FC = () => {
  const t = useTranslations('auth')
  const tv = useTranslations('validation')
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
          <Input
            id='name'
            type='text'
            label={t('fields.name')}
            placeholder={t('fields.namePlaceholder')}
            invalid={!!errors.name}
            message={errors.name?.message && tv(errors.name.message as Parameters<typeof tv>[0])}
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
            placeholder={t('fields.passwordMinPlaceholder')}
            invalid={!!errors.password}
            message={errors.password?.message && tv(errors.password.message as Parameters<typeof tv>[0])}
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
            label={t('fields.confirmPassword')}
            placeholder={t('fields.confirmPlaceholder')}
            invalid={!!errors.confirmPassword}
            message={errors.confirmPassword?.message && tv(errors.confirmPassword.message as Parameters<typeof tv>[0])}
            {...field}
          />
        )}
      />

      {signUp.error && (
        <p className='border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm'>
          {signUp.error.message}
        </p>
      )}

      <Button type='submit' disabled={signUp.isPending} className='w-full'>
        {signUp.isPending && <Spinner />}
        {t('register.submit')}
      </Button>
    </form>
  )
}

export default RegisterFormComponent
