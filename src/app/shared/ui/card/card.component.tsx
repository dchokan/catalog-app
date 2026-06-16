import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export function Card({ hover = false, children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${hover ? 'cursor-pointer transition-shadow hover:shadow-md' : ''} ${className} `}
      {...props}
    >
      {children}
    </div>
  )
}
