import Image from 'next/image'
import { type FC, type ReactNode } from 'react'

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
    <div className='group border-border bg-card flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-md'>
      <Link href={href}>
        <div className='bg-muted relative aspect-3/4 overflow-hidden'>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className='object-cover transition-transform duration-300 group-hover:scale-105'
              sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
            />
          ) : (
            <div className='flex h-full items-center justify-center text-4xl'>{placeholder}</div>
          )}
        </div>
      </Link>

      <div className='flex flex-1 flex-col gap-1.5 p-3'>
        <Link href={href}>
          <h3 className='text-card-foreground hover:text-primary line-clamp-2 text-base leading-snug font-semibold transition-colors'>
            {title}
          </h3>
        </Link>
        {description && <p className='text-muted-foreground line-clamp-2 text-sm leading-relaxed'>{description}</p>}
        {footer && <div className='mt-auto'>{footer}</div>}
      </div>
    </div>
  )
}

export default ItemCardComponent
