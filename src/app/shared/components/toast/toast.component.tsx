import { type FC } from 'react'

export type TToastVariant = 'success' | 'info'

export interface IToast {
  id: number
  message: string
  variant: TToastVariant
}

interface IProps {
  toasts: IToast[]
}

const ICONS: Record<TToastVariant, string> = {
  success: '✓',
  info: '−',
}

const ToastComponent: FC<Readonly<IProps>> = (props) => {
  const { toasts } = props

  return (
    <div className='pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2'>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role='status'
          aria-live='polite'
          className='animate-toast-in pointer-events-auto flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg'
        >
          <span className={toast.variant === 'success' ? 'text-green-400' : 'text-gray-400'}>
            {ICONS[toast.variant]}
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default ToastComponent
