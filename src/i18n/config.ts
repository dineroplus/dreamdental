export const locales = ['ka', 'en', 'ru'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'ka'

export const localeLabels: Record<Locale, string> = {
  ka: 'ქართული',
  en: 'English',
  ru: 'Русский',
}

export const localeShortLabels: Record<Locale, string> = {
  ka: 'KA',
  en: 'EN',
  ru: 'RU',
}

/** BCP 47 tags used for `lang`, `hreflang` and Open Graph `locale`. */
export const htmlLang: Record<Locale, string> = {
  ka: 'ka-GE',
  en: 'en',
  ru: 'ru',
}

export const ogLocale: Record<Locale, string> = {
  ka: 'ka_GE',
  en: 'en_US',
  ru: 'ru_RU',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
