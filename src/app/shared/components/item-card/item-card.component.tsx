import Image from 'next/image'
import { type FC, type ReactNode } from 'react'

import { CardComponent } from '@/app/shared/components/card'
import { Link } from '@/pkg/locale'

interface IProps {
  href: string
  title: string
  imageUrl?: string | null
  description?: string | null
  footer?: ReactNode
  placeholder?: ReactNode
}

const ItemCardComponent: FC<Readonly<IProps>> = (props) => {
  const { href, title, imageUrl, description, footer, placeholder } = props

  return (
    <Link href={href}>
      <CardComponent hover className='flex h-full flex-col'>
        <div className='relative aspect-2/3 bg-gray-50'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <div className='flex h-full items-center justify-center text-5xl'>{placeholder}</div>
          )}
        </div>

        <div className='flex flex-1 flex-col gap-2 p-4'>
          <h3 className='line-clamp-2 leading-snug font-semibold text-gray-900'>{title}</h3>
          {description && <p className='line-clamp-3 text-sm leading-relaxed text-gray-500'>{description}</p>}
          {footer && <div className='mt-auto text-xs text-gray-400'>{footer}</div>}
        </div>
      </CardComponent>
    </Link>
  )
}

export default ItemCardComponent
