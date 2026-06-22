import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className = '', ...props }, ref) => {
  return (
    <div className='flex flex-col gap-1'>
      {label && (
        <label htmlFor={id} className='text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'} ${className} `}
        {...props}
      />
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
