import { forwardRef, InputHTMLAttributes } from 'react'

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const InputComponent = forwardRef<HTMLInputElement, Readonly<IProps>>((props, ref) => {
  const { label, error, id, className = '', ...rest } = props

  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label htmlFor={id} className='text-foreground text-sm font-medium'>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`bg-card focus:ring-ring disabled:bg-muted w-full rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none disabled:cursor-not-allowed ${error ? 'border-destructive focus:ring-destructive' : 'border-input'} ${className} `}
        {...rest}
      />
      {error && <p className='text-destructive text-sm'>{error}</p>}
    </div>
  )
})

InputComponent.displayName = 'InputComponent'

export default InputComponent
