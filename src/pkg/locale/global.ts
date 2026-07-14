import messages from '../../../translations/en.json'

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof messages
  }
}
