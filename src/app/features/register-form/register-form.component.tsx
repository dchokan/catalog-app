'use client'

import { useTranslations } from 'next-intl'
import { type FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { useSignUpMutation } from '@/app/entities/api/auth'
import { ButtonComponent } from '@/app/shared/components/button'
import { InputComponent } from '@/app/shared/components/input'
import { type RegisterFormValues, registerSchema } from '@/app/shared/validation'
import { useRouter } from '@/pkg/locale'

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
          <InputComponent
            id='name'
            type='text'
            label={t('fields.name')}
            placeholder={t('fields.namePlaceholder')}
            error={errors.name?.message && tv(errors.name.message as Parameters<typeof tv>[0])}
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
            label={t('fields.email')}
            placeholder={t('fields.emailPlaceholder')}
            error={errors.email?.message && tv(errors.email.message as Parameters<typeof tv>[0])}
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
            placeholder={t('fields.passwordMinPlaceholder')}
            error={errors.password?.message && tv(errors.password.message as Parameters<typeof tv>[0])}
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
            label={t('fields.confirmPassword')}
            placeholder={t('fields.confirmPlaceholder')}
            error={errors.confirmPassword?.message && tv(errors.confirmPassword.message as Parameters<typeof tv>[0])}
            {...field}
          />
        )}
      />

      {signUp.error && (
        <p className='border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm'>
          {signUp.error.message}
        </p>
      )}

      <ButtonComponent type='submit' loading={signUp.isPending} className='w-full'>
        {t('register.submit')}
      </ButtonComponent>
    </form>
  )
}

export default RegisterFormComponent
