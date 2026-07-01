import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// point the plugin at the request config inside pkg/locale
const withNextIntl = createNextIntlPlugin('./src/pkg/locale/request.ts')

const nextConfig: NextConfig = {
  // images.remotePatterns etc. unrelated to i18n
}

export default withNextIntl(nextConfig)
