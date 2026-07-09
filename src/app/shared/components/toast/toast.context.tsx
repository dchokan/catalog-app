'use client'

import { createContext, type FC, type ReactNode, useCallback, useContext, useState } from 'react'

import ToastComponent, { type IToast, type TToastVariant } from './toast.component'

interface IToastContext {
  showToast: (message: string, variant?: TToastVariant) => void
}

interface IProps {
  children: ReactNode
}

const TOAST_DURATION = 2500

const ToastContext = createContext<IToastContext | null>(null)

let nextToastId = 0

const ToastProvider: FC<Readonly<IProps>> = (props) => {
  const { children } = props

  const [toasts, setToasts] = useState<IToast[]>([])

  const showToast = useCallback((message: string, variant: TToastVariant = 'success') => {
    const id = ++nextToastId

    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, TOAST_DURATION)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastComponent toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast(): IToastContext {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

export default ToastProvider
