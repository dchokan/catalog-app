import Link from 'next/link'
import Image from 'next/image'
import { Card } from '@/app/shared/ui/card'
import type { Item } from '@/app/entities/models'

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/items/${item.id}`}>
      <Card hover className='flex h-full flex-col'>
        <div className='relative aspect-2/3 bg-gray-50'>
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className='object-cover'
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          ) : (
            <div className='flex h-full items-center justify-center text-5xl'>📖</div>
          )}
        </div>

        <div className='flex flex-1 flex-col gap-2 p-4'>
          <h3 className='line-clamp-2 leading-snug font-semibold text-gray-900'>{item.title}</h3>
          {item.description && <p className='line-clamp-3 text-sm leading-relaxed text-gray-500'>{item.description}</p>}
        </div>
      </Card>
    </Link>
  )
}
