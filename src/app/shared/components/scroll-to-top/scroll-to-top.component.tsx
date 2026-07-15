'use client'

import { ChevronUpIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { type FC, useEffect, useState } from 'react'

import { Button } from '@/pkg/theme/ui/button'

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
    <Button
      size='icon-lg'
      onClick={scrollToTop}
      aria-label={t('label')}
      className='animate-fade-in fixed right-6 bottom-6 z-40 rounded-full shadow-lg'
    >
      <ChevronUpIcon className='size-5' />
    </Button>
  )
}

export default ScrollToTopComponent
