'use client'

import { useTranslations } from 'next-intl'
import { type FC, useEffect, useState } from 'react'

const SCROLL_THRESHOLD = 300

const ScrollToTopComponent: FC = () => {
  const t = useTranslations('scrollToTop')

  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!isVisible) {
    return null
  }

  return (
    <button
      type='button'
      onClick={scrollToTop}
      aria-label={t('label')}
      className='animate-fade-in bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring fixed right-6 bottom-6 z-40 flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none'
    >
      <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M5 15l7-7 7 7' />
      </svg>
    </button>
  )
}

export default ScrollToTopComponent
