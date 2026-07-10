import { type ButtonHTMLAttributes, type FC } from 'react'

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const ButtonComponent: FC<Readonly<IProps>> = (props) => {
  const { variant = 'primary', size = 'md', loading = false, disabled, children, className = '', ...rest } = props

  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring',
    secondary: 'bg-secondary text-secondary-foreground border border-input hover:bg-muted focus:ring-ring',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive',
    ghost: 'text-muted-foreground hover:bg-muted focus:ring-ring',
  }

  const sizes = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && (
        <svg className='h-4 w-4 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
          <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
          <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
        </svg>
      )}
      {children}
    </button>
  )
}

export default ButtonComponent
