import { type FC, type HTMLAttributes } from 'react'

interface IProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const CardComponent: FC<Readonly<IProps>> = (props) => {
  const { hover = false, children, className = '', ...rest } = props

  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${hover ? 'cursor-pointer transition-shadow hover:shadow-md' : ''} ${className} `}
      {...rest}
    >
      {children}
    </div>
  )
}

export default CardComponent
